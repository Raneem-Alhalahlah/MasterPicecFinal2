﻿using MasterPieceALL.DTOs.CartDtos;
using MasterPieceALL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterPieceALL.TokenReaderNS;
using MasterPieceALL.Services;

namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(MyDbContext db, IConfiguration config, PayPalPaymentService payPalService) : ControllerBase
    {


        private readonly string? _redirectUrl = config["PayPal:RedirectUrl"];


        [Authorize]
        [HttpGet("getCartItems")]
        public IActionResult GetCartItems()
        {
            var user = GetUser();
            if (user == null) return BadRequest("There were a problem while trying to get the user info");
            var (cartItems, cart) = GetAllCartItems(user);
            var cartItemsD = cartItems.Select(DisplayCartItemDto.createFromCartItem).ToList();
            return Ok(new { cartItems = cartItemsD, cart = cart });
        }

        private (List<CartItem>, Cart) GetAllCartItems(User user)
        {
            var cart = db.Carts.Include(c => c.Voucher).
                FirstOrDefault(c => c.UserId == user.UserId);
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = user.UserId,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                db.Carts.Add(cart);
                db.SaveChanges();
            }
            return (db.CartItems.Include(cItem => cItem.Product).Where(cItem => cItem.CartId == cart.CartId).ToList(), cart);
        }
        [Authorize]
        [HttpPost("addToCart")]
        public IActionResult AddToCart(CartItemDto cartItem)
        {
            var user = GetUser();
            if (user == null) return BadRequest("There were a problem while trying to get the user info");

            var cart = db.Carts.Include(c => c.Voucher).FirstOrDefault(c => c.UserId == user.UserId);
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = user.UserId,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    
                };
                db.Carts.Add(cart);
                db.SaveChanges();
            }

            var updatedCartItem = cartItem.CreateCartItem(db, cart);
            return Ok(DisplayCartItemDto.createFromCartItem(updatedCartItem));
        }

        [HttpPost("AddVoucher")]
        public IActionResult AddVoucher([FromBody] AddVoucherDto voucherCodeDto)
        {
            var voucherCode = voucherCodeDto.VoucherCode;
            var voucher = db.Vouchers.FirstOrDefault(v => v.VoucherCode.Equals(voucherCode));
            if (voucher == null)
                return NotFound();
            var now = DateTime.Now;
            if (voucher.StartDate.ToDateTime(new TimeOnly(0, 0)) > now ||
                voucher.EndDate.ToDateTime(new TimeOnly(0, 0)) < now)
                return Gone("VoucherExpired");
            var discount = voucher.DiscountPercentage;
            var user = GetUser();
            var (cartItems, cart) = GetAllCartItems(user);
            cart.VoucherId = voucher.VoucherId;
            db.Carts.Update(cart);
            cartItems = ApplyDiscountToCartItems(cartItems, discount);
            db.SaveChanges();
            return Ok(cartItems);
        }

        private List<CartItem> ApplyDiscountToCartItems(List<CartItem> cartItems, decimal discount)
        {
            foreach (var cartItem in cartItems)
            {
                var prdPrice = cartItem.Product?.Price ?? 0m;
                var prdPriceWithDiscount = prdPrice - prdPrice * cartItem.Product?.DiscountPercentage ?? 0m;
                var singleProductPrice = prdPriceWithDiscount - prdPriceWithDiscount * discount;
                cartItem.Price = singleProductPrice * cartItem.Quantity;
            }
            db.CartItems.UpdateRange(cartItems);
            return cartItems;
        }

        [Authorize]
        [HttpDelete("deleteFromCart/{id:int}")]
        public IActionResult DeleteCartItem(int id)
        {

            var user = GetUser();
            var cartItem = db.CartItems.Find(id);
            if (cartItem == null)
                return NotFound();
            db.CartItems.Remove(cartItem);
            db.SaveChanges();
            return NoContent();
        }



        //[Authorize]
        //[HttpDelete("deleteProductFromCart/{id:int}")]
        //public IActionResult DeleteProductFromCartItem(int id)
        //{

        //    var user = GetUser();
        //    var cartItem = db.CartItems.Where(x => x.ProductId == id).FirstOrDefault();
        //    if (cartItem == null)
        //        return NotFound();
        //    db.CartItems.Remove(cartItem);
        //    db.SaveChanges();
        //    return NoContent();
        //}

        [Authorize]
        [HttpPut("updateCartItem/{id:int}")]
        public IActionResult UpdateCartItem(int id, UpdateCartItemDto update)
        {
            if (update.Quantity < 1)
                return BadRequest("The quantity must be at least 1");
            var cartItem = db.CartItems.Find(id);
            if (cartItem == null)
                return NotFound();

            var product = db.Products.Find(cartItem.ProductId);
            var cart = db.Carts.Find(cartItem.ProductId);
            var voucherDiscount = 0m;
            Voucher? voucher = null;
            try
            { voucher = db.Vouchers.Find(cart?.VoucherId); }
            catch (Exception e)
            {
                // ignored
            }

            if (voucher != null)
            {
                voucherDiscount = voucher.DiscountPercentage;
            }

            var productPrice = (product?.Price ?? 0m) - (product?.Price ?? 0m) * (product?.DiscountPercentage ?? 0m);

            cartItem.Quantity = update.Quantity;
            cartItem.Price = cartItem.Quantity * (productPrice - voucherDiscount * productPrice);
            db.CartItems.Update(cartItem);
            db.SaveChanges();
            return Ok(DisplayCartItemDto.createFromCartItem(cartItem));
        }

        [Authorize]
        [HttpPost("checkout")]
        public IActionResult CreatePayment()
        {
            if (string.IsNullOrEmpty(_redirectUrl))
                throw new Exception("The redirect link for the paypal should be set correctly on the sitting app.");

            var user = GetUser();
            var (cartItems, cart) = GetAllCartItems(user);
            var totalPrice = cartItems.Sum(c => c.Price);
            var payment = payPalService.CreatePayment(_redirectUrl ?? " ", totalPrice, null, user.UserId);
            var approvalUrl = payment.links.FirstOrDefault(l => l.rel.Equals("approval_url", StringComparison.OrdinalIgnoreCase))?.href;

            return Ok(new { approvalUrl });
        }

        [HttpGet("success")]
        public IActionResult ExecutePayment(string paymentId, string PayerID, string token, int userId)
        {
            var user = db.Users.Find(userId);
            var (cartItems, cart) = GetAllCartItems(user);
            var totalAmount = cartItems.Sum(c => c.Price);

            // Create new order
            var order = new Order
            {
                UserId = user.UserId,
                Address = user.Address,
                OrderDate = DateTime.Now,
                ShippingStatus = "pending",
                CreatedAt = DateTime.Now,
                VoucherId = cart.VoucherId,
                TotalAmount = totalAmount
            };

            db.Orders.Add(order);
            db.SaveChanges();
            // Add the cart Items to the order
            foreach (var cartItem in cartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    Quantity = cartItem.Quantity,
                    TotalPrice = cartItem.Price
                };
                db.OrderItems.Add(orderItem);
                db.CartItems.Remove(cartItem);
            }
            db.Carts.Remove(cart);

            var executedPayment = payPalService.ExecutePayment(paymentId, PayerID);
            var payment = new Payment
            {
                Status = executedPayment.state,
                OrderId = order.OrderId,
                Amount = order.TotalAmount,
                PaymentMethod = "Paypal",
                PaymentDate = DateTime.Now,
                TransactionId = executedPayment.id,
                PaymentGateway = "Paypal"
            };
            db.Payments.Add(payment);
            db.SaveChanges();
            return Ok("Payment has been completed, You can close this window now.");
        }

        [HttpGet("cancel")]
        public IActionResult CancelPayment()
        {
            return BadRequest("Payment canceled.");
        }

        private User? GetUser()
        {
            var tokenReader = new TokenReader(config);
            var token = Request.Headers["Authorization"].ToString().Split(' ')[1];
            var principal = tokenReader.ValidateToken(token);
            return db.Users.FirstOrDefault(u => u.UserName == principal.Identity.Name);

        }
        // Custom helper method for 410 Gone
        private IActionResult Gone(object value)
        {
            return StatusCode(StatusCodes.Status410Gone, value);
        }


        [HttpGet("CartItemCount/{userId}")]
        public IActionResult GetCartItemCount(int userId)
        {
            // العثور على CartId المرتبط بالـ UserId
            var cart = db.Carts.FirstOrDefault(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound("Cart not found for the specified user.");
            }

            // عدّ العناصر في CartItems المرتبطة بالـ CartId
            var cartItemCount = db.CartItems
                                   .Where(ci => ci.CartId == cart.CartId)
                                   .Count();

            return Ok(cartItemCount);
        }


    }
}
