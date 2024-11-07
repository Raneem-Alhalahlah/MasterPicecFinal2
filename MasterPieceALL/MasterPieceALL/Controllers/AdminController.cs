using MasterPieceALL.DTOs;
using MasterPieceALL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {


        private readonly MyDbContext _db;
        private readonly TokenGenerator _tokenGenerator;

        public AdminController(MyDbContext db, TokenGenerator tokenGenerator)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;

        }


        //[HttpPost("CreateAdmin")]
        //public IActionResult CreateAdmin([FromForm] AdminRequestDTO admin)
        //{
        //    byte[] hash;
        //    byte[] salt;
        //    PasswordHash.Hasher(admin.Password, out hash, out salt);
        //    var data = new Admin
        //    {
        //        AdminName = admin.AdminName,
        //        Email = admin.Email,
        //        Password = admin.Password,
        //        PasswordHash = hash,
        //        PasswordSalt = salt,
        //    };
        //    _db.Admins.Add(data);
        //    _db.SaveChanges();
        //    return Ok(data);
        //}

        [HttpPost("LoginAdmin")]
        public IActionResult Login([FromForm] AdminRequestDTO Admin)
        {

            var data = _db.Admins.FirstOrDefault(x => x.Email == Admin.Email);

            if (data == null || !PasswordHash.verifyPassword(Admin.Password, data.PasswordHash, data.PasswordSalt))
            {
                return Unauthorized();
            }

            var token = _tokenGenerator.GenerateToken(data.AdminName);

            var response = new
            {
                Token = token,
                User = data
            };


            return Ok(response);
        }

    }
}
