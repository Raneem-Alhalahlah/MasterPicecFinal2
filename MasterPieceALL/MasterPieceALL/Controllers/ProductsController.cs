using MasterPieceALL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterPieceALL.DTOs.ProductDtos;
using static MasterPieceALL.Shared.ImageSaver;
using Azure.Core;
using System.Drawing;
using MasterPieceALL.DTOs;
namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private readonly MyDbContext _db;

        public ProductsController(MyDbContext db)
        {
            _db = db;
        }


        [HttpPost("AddProducts")]
        public IActionResult AddProduct([FromForm] ProductRequestDTO request)
        {


            if (!ModelState.IsValid)
            {

                return BadRequest();

            }

            var products = new Product
            {

                CategoryId = request.CategoryId,
                ProductImage1 = request.ProductImage1 == null ? null : SaveImage(request.ProductImage1),
                ProductImage2 = request.ProductImage2 == null ? null : SaveImage(request.ProductImage2),
                ProductImage3 = request.ProductImage3 == null ? null : SaveImage(request.ProductImage3),
                ProductImage4 = request.ProductImage4 == null ? null : SaveImage(request.ProductImage4),
                ProductImage5 = request.ProductImage5 == null ? null : SaveImage(request.ProductImage5),
                ProductImage6 = request.ProductImage6 == null ? null : SaveImage(request.ProductImage6),
                ProductName = request.ProductName,
                Description = request.Description,
                Visiblity = request.Visiblity,
                Price = request.Price,
                Color = request.Color,
                DiscountPercentage = request.DiscountPercentage,
                StockQuantity = request.StockQuantity,
            };
            _db.Products.Add(products);
            _db.SaveChanges();
            return Ok(products);

        }





        [HttpGet("GetAllProducts")]
        public IActionResult GetAllProducts()
        {
            var products = _db.Products.Where(p => p.CategoryId != null ).Select(p => ProductDisplayDto.
                    CreateDtoFromProduct(p)).
                ToList();

            if (products != null)
            {
                return Ok(products);
            }

            return NotFound();
        }



        [HttpGet("GetProductsById/{id}")]
        public IActionResult GetProductsById(int id)
        {

            if (id <= 0)
            {
                return BadRequest();
            }

            var products = _db.Products.FirstOrDefault(p => p.ProductId == id);
            if (products != null)
            {
                return Ok(products);
            }

            return NotFound();
        }


        [HttpGet("GetProductsByCategoryId/{id}")]
        public IActionResult GetProductsByCategoryId(int id)
        {
            if (id <= 0)
            {
                return BadRequest();

            }

            var category = _db.Categories.Find(id);
            if (category == null)
            {
                return NotFound();
            }

            var products = _db.Products.
                Where(p => p.CategoryId == id ).
                Select(p => ProductDisplayDto.
                    CreateDtoFromProduct(p)).
                ToList();

            if (products != null)
            {
                return Ok(products);

            }

            return NotFound();
        }






        [HttpDelete("DeleteProduct/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            if (id <= 0)
            {

                return BadRequest();

            }

            var product = _db.Products.Find(id);
            if (product != null)
            {
                _db.Products.Remove(product);
                _db.SaveChanges();
                return NoContent();
            }

            return NotFound();


        }




        [HttpPut("UpdateProduct/{id}")]

        public IActionResult UpdateProduct([FromForm] ProductRequestDTO response, int id)
        {

            if (id <= 0)
            {
                return BadRequest();
            }

            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);
            if (product != null)
            {

                product.CategoryId = response.CategoryId;
                product.ProductImage1 = response.ProductImage1 == null ? null : SaveImage(response.ProductImage1);
                product.ProductImage2 = response.ProductImage2 == null ? null : SaveImage(response.ProductImage2);
                product.ProductImage3 = response.ProductImage3 == null ? null : SaveImage(response.ProductImage3);
                product.ProductImage4 = response.ProductImage4 == null ? null : SaveImage(response.ProductImage4);
                product.ProductImage5 = response.ProductImage5 == null ? null : SaveImage(response.ProductImage5);
                product.ProductImage6 = response.ProductImage6 == null ? null : SaveImage(response.ProductImage6);
                product.ProductName = response.ProductName;
                product.Description = response.Description;
                product.Visiblity = response.Visiblity;
                product.Price = response.Price;
                product.Color = response.Color;
                product.DiscountPercentage = response.DiscountPercentage;
                product.StockQuantity = response.StockQuantity;



                _db.Products.Update(product);
                _db.SaveChanges();
                return Ok(product);
            }

            return NotFound();

        }



        [HttpGet("GetLatestProducts")]
        public IActionResult GetLatestProducts()
        {
            var products = _db.Products
                .OrderByDescending(p => p.CreatedAt)
                .Take(3).Select(p => new ProductWithRatingDto
                {
                    ReviewCount = p.Reviews.Count,
                    Rating = p.Reviews.Count > 0 ? (double)p.Reviews.Sum(r => r.Rating) / (double)p.Reviews.Count : 0,
                    CategoryId = p.CategoryId,
                    Description = p.Description,
                    DiscountPercentage = p.DiscountPercentage,
                    Price = p.Price,
                    ProductId = p.ProductId,
                    ProductImage1 = p.ProductImage1,
                    ProductImage2 = p.ProductImage2,
                    ProductImage3 = p.ProductImage3,
                    ProductImage4 = p.ProductImage4,
                    ProductImage5 = p.ProductImage5,
                    ProductImage6 = p.ProductImage6,
                    ProductName = p.ProductName,
                    StockQuantity = p.StockQuantity,
                    Visiblity = p.Visiblity
                })
                .ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound("No products found.");
            }

            return Ok(products);
        }



        //[HttpGet("filterByPrice")]
        //public IActionResult GetProductsByPrice(string sortOrder, int? CategoryId)
        //{
        //    if (string.IsNullOrEmpty(sortOrder))
        //    {
        //        return BadRequest("Sort order is required.");
        //    }

        //    IQueryable<Product> products = _db.Products;

        //    if (sortOrder.ToLower() == "asc")
        //    {
        //        products = products.Where(x => x.CategoryId == CategoryId).OrderBy(p => p.Price);
        //    }
        //    else if (sortOrder.ToLower() == "desc")
        //    {
        //        products = products.Where(x => x.CategoryId == CategoryId).OrderByDescending(p => p.Price);
        //    }
        //    else
        //    {
        //        return BadRequest("Invalid sort order. Use 'asc' for ascending or 'desc' for descending.");
        //    }

        //    return Ok(products.ToList());
        //}
        [HttpGet("priceRange")]
        public IActionResult GetProductsByPriceRange(decimal minPrice, decimal maxPrice)
        {
            var products = _db.Products
                                  .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
                                  .ToList();

            if (products.Count == 0)
            {
                return NotFound(new { message = "No products found within the specified price range." });
            }

            return Ok(products);
        }

        [HttpGet("filterByPriceWithoutCategoryId")]
        public IActionResult GetfilterByPriceWithoutCategoryId(string sortOrder)
        {
            if (string.IsNullOrEmpty(sortOrder))
            {
                return BadRequest("Sort order is required.");
            }

            IQueryable<Product> products = _db.Products;

            if (sortOrder.ToLower() == "asc")
            {
                products = products.OrderBy(p => p.Price);
            }
            else if (sortOrder.ToLower() == "desc")
            {
                products = products.OrderByDescending(p => p.Price);
            }
            else
            {
                return BadRequest("Invalid sort order. Use 'asc' for ascending or 'desc' for descending.");
            }

            return Ok(products.ToList());
        }




        [HttpGet("productsWithRatings")]
        public IActionResult GetProductWithRating()
        {
            var products = _db.Products.Include(p => p.Reviews).Select(p =>
                new ProductWithRatingDto
                {
                    ReviewCount = p.Reviews.Count,
                    Rating = p.Reviews.Count > 0 ? (double)p.Reviews.Sum(r => r.Rating) / (double)p.Reviews.Count : 0,
                    CategoryId = p.CategoryId,
                    Description = p.Description,
                    DiscountPercentage = p.DiscountPercentage,
                    Price = p.Price,
                    ProductId = p.ProductId,
                    ProductImage1 = p.ProductImage1,
                    ProductImage2 = p.ProductImage2,
                    ProductImage3 = p.ProductImage3,
                    ProductImage4 = p.ProductImage4,
                    ProductImage5 = p.ProductImage5,
                    ProductImage6 = p.ProductImage6,
                    ProductName = p.ProductName,
                    StockQuantity = p.StockQuantity,
                    Visiblity = p.Visiblity
                }).OrderByDescending(p => p.Rating).Take(3);
            return Ok(products);
        }

        [HttpPost("visible")]
        public IActionResult GetVisibleProducts([FromBody] AdventureRequestDTO adventureDTO)
        {
            var visibleProduct = _db.Products
                .Where(p => p.Visiblity == true
                             && p.Color == adventureDTO.Color
                             && p.Price >= adventureDTO.minPrice
                             && p.Price <= adventureDTO.maxPrice
                             && p.ProductName.Contains(adventureDTO.ProductName))
                .FirstOrDefault();

            if (visibleProduct != null)
            {
                return Ok(visibleProduct);
            }

            return NotFound("No visible product found.");
        }

        //[HttpGet("colors")]
        //public async Task<IActionResult> GetAvailableColors()
        //{

        //    var colors = await _db.Products
        //        .Select(p => p.Color)
        //        .Distinct()
        //        .ToListAsync();

        //    return Ok(colors);
        //}

       
    }

   
}




