using MasterPieceALL.DTOs;
using MasterPieceALL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdressUserController : ControllerBase
    {

        private readonly MyDbContext _db;

        public AdressUserController(MyDbContext db)
        {
            _db = db;
        }



        // POST: api/Address
        [HttpPost("AddUserAdress")]
        public IActionResult PostUserAddress([FromBody] AdressUser addressDto)
        {
           
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userAddress = new UserAddress
            {
                Country = addressDto.Country,
                City = addressDto.City,
                Street = addressDto.Street,
                PostalCode = addressDto.PostalCode,
                UserId = addressDto.UserId,
                
            };

            _db.UserAddresses.Add(userAddress);
            _db.SaveChanges(); 
            return Ok(userAddress);
        }


        // PUT: api/Address/UpdateUserAddressByUserId/{userId}
        [HttpPut("UpdateUserAddressByUserId/{userId}")]
        public IActionResult UpdateUserAddressByUserId(int userId, [FromBody] AdressUser addressDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // البحث عن العنوان باستخدام UserId
            var userAddress = _db.UserAddresses.FirstOrDefault(a => a.UserId == userId);
            if (userAddress == null)
            {
                return NotFound(); // إذا لم يتم العثور على العنوان
            }

            // تحديث خصائص العنوان
            userAddress.Country = addressDto.Country;
            userAddress.City = addressDto.City;
            userAddress.Street = addressDto.Street;
            userAddress.PostalCode = addressDto.PostalCode;

            _db.UserAddresses.Update(userAddress);
            _db.SaveChanges();

            return Ok(userAddress); // إرجاع العنوان المحدث
        }

        // GET: api/AdressUser/GetUserAddressByUserId/2
        [HttpGet("GetUserAddressByUserId/{userId}")]
        public IActionResult GetUserAddressByUserId(int userId)
        {
            var address = _db.UserAddresses.FirstOrDefault(a => a.UserId == userId); // استبدل UserAddresses باسم الجدول الخاص بك

            if (address == null)
            {
                return NotFound(new { message = "Address not found." });
            }

            return Ok(address);
        }
    


}
}
