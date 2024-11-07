using MasterPieceALL.DTOs;
using MasterPieceALL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly MyDbContext _db;

        public OrderController(MyDbContext db)
        {
            _db = db;
        }

        [HttpPost("checkout")]
        public IActionResult Checkout(int userId)
        {
            var cart = _db.Carts
                .Include(c => c.CartItems)
                .FirstOrDefault(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
            {
                return BadRequest("The cart is empty or does not exist.");
            }

            decimal totalAmount = cart.CartItems.Sum(ci => ci.Quantity * ci.Price);

            if (cart.VoucherId.HasValue)
            {
                var voucher = _db.Vouchers.Find(cart.VoucherId);
                if (voucher != null && voucher.DiscountPercentage > 0)
                {
                    decimal discountAmount = totalAmount * (voucher.DiscountPercentage / 100);
                    totalAmount -= discountAmount;
                    totalAmount = totalAmount < 0 ? 0 : totalAmount;
                }
            }

            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var order = new Order
                    {
                        UserId = cart.UserId,
                        CartId = cart.CartId,
                        TotalAmount = totalAmount, 
                        OrderDate = DateTime.Now,
                        CreatedAt = DateTime.Now,
                        ShippingStatus = "Pending", 
                        VoucherId = cart.VoucherId 
                    };

                    _db.Orders.Add(order);
                    _db.SaveChanges(); 

                    foreach (var cartItem in cart.CartItems)
                    {
                        var orderItem = new OrderItem
                        {
                            OrderId = order.OrderId, 
                            Quantity = cartItem.Quantity,
                            TotalPrice = cartItem.Quantity * cartItem.Price
                        };

                        _db.OrderItems.Add(orderItem);
                    }

                    _db.SaveChanges();

                    _db.CartItems.RemoveRange(cart.CartItems);
                    _db.SaveChanges(); 

                    _db.Carts.Remove(cart);
                    _db.SaveChanges(); 

                    transaction.Commit();

                    return Ok(new { Message = "Checkout completed successfully", OrderId = order.OrderId });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, $"An error occurred during checkout: {ex.Message}");
                }
            }
        }


        //[HttpGet("GetAllOrder")]
        //public IActionResult GetAllOrders()
        //{
        //    // جلب الطلبات من قاعدة البيانات بشكل متزامن
        //    var orders = _db.Orders
        //        .Select(o => new OrderRequestDTO
        //        {
        //            UserId=o.UserId,
        //            OrderDate = o.OrderDate,
        //            ShippingStatus = o.ShippingStatus,
        //            TotalAmount = o.TotalAmount
        //        })
        //        .ToList(); // استخدام ToList لجلب البيانات بشكل متزامن

        //    // التحقق من وجود بيانات
        //    if (orders == null || !orders.Any())
        //    {
        //        return NotFound("No orders found."); // إذا لم توجد طلبات
        //    }

        //    // إرجاع الطلبات كـ JSON
        //    return Ok(orders); // إرجاع البيانات
        //}
        [HttpGet("GetAllOrder")]
        public IActionResult GetAllOrders()
        {
            var orders = _db.Orders
                .Include(o => o.User) 
                .Select(o => new OrderRequestDTO
                {
                    UserId = o.UserId,
                    UserName = o.User.UserName, 
                    OrderDate = o.OrderDate,
                    ShippingStatus = o.ShippingStatus,
                    TotalAmount = o.TotalAmount
                })
                .ToList(); 

            if (orders == null || !orders.Any())
            {
                return NotFound("No orders found."); 
            }

            return Ok(orders); 
        }

    }
}
