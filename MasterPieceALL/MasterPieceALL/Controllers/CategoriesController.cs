using MasterPieceALL.DTOs;
using MasterPieceALL.Models;
using MasterPieceALL.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using static MasterPieceALL.Shared.ImageSaver;

namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly MyDbContext _db;

        public CategoriesController(MyDbContext db)
        {
            _db = db;
        }

        [HttpPost("AddCategory")]
        public IActionResult AddCategory([FromForm] CategoryRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = new Category
            {
                CategoryImage = ImageSaver.SaveImage(request.CategoryImage),
                CategoryName = request.CategoryName,
                Description = request.Description
            };

            _db.Categories.Add(category);
            _db.SaveChanges();
            return Ok(category);
        }

        [HttpGet("GetAllCategories")]
        public IActionResult GetAll()
        {
            var categories = _db.Categories.ToList();
            if (categories.Any())
            {
                return Ok(categories);
            }
            return NoContent();
        }

        [HttpGet("GetCategoryById/{id:int}")]
        public IActionResult GetCategoryById(int id)
        {
            if (id <= 0)
            {
                return BadRequest();
            }

            var category = _db.Categories.FirstOrDefault(p => p.CategoryId == id);

            if (category != null)
            {
                return Ok(category);
            }
            return NotFound();
        }

        [HttpDelete("DeleteCategory/{id:int}")]
        public IActionResult DeleteCategory(int id)
        {
            if (id <= 0)
            {
                return BadRequest();
            }

            var category = _db.Categories.FirstOrDefault(p => p.CategoryId == id);
            if (category != null)
            {
                _db.Categories.Remove(category);
                _db.SaveChanges();
                return NoContent();
            }
            return NotFound();
        }

        [HttpPut("UpdateCategory/{id:int}")]
        public IActionResult UpdateCategory([FromForm] CategoryRequestDTO request, int id)
        {
            var category = _db.Categories.FirstOrDefault(c => c.CategoryId == id);
            if (category == null)
            {
                return NotFound();
            }

            // Update only if image is provided
            if (request.CategoryImage != null)
            {
                category.CategoryImage = ImageSaver.SaveImage(request.CategoryImage);
            }
            category.CategoryName = request.CategoryName;
            category.Description = request.Description;

            _db.Categories.Update(category);
            _db.SaveChanges();
            return Ok(category);
        }
    }
}
