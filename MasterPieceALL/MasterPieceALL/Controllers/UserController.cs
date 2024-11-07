using MasterPieceALL.DTOs;
using MasterPieceALL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using static MasterPieceALL.Shared.EmailSender;
namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _db;
        private readonly TokenGenerator _tokenGenerator;
        public UserController(MyDbContext db, TokenGenerator tokenGenerator)
        {
            _tokenGenerator = tokenGenerator;
            _db = db;
        }


        [HttpGet("ShowAllUsers")]
        public IActionResult GetAllUser()
        {
            var users = _db.Users.ToList();
            return Ok(users);
        }


        //[HttpPost("RegisterUsers")]
        //public IActionResult Register([FromForm] UserRegisterDTO user)
        //{
        //    byte[] hash;
        //    byte[] salt;
        //    PasswordHash.Hasher(user.Passwword, out hash, out salt);
        //    var data = new User
        //    {

        //        UserName = user.UserName,
        //        Email = user.Email,
        //        Passwword = user.Passwword,
        //        PasswordHash = hash,
        //        PasswordSalt = salt,
        //    };
        //    _db.Users.Add(data);
        //    _db.SaveChanges();
        //    return Ok(data);
        //}

        [HttpPost("RegisterUsers")]
        public IActionResult Register([FromForm] UserRegisterDTO user)
        {
            // تحقق إذا كان البريد الإلكتروني موجودًا مسبقًا في قاعدة البيانات
            var existingUser = _db.Users.FirstOrDefault(u => u.Email == user.Email);

            if (existingUser != null)
            {
                // إذا كان البريد الإلكتروني موجودًا بالفعل، أعطِ رسالة تنبيه
                return BadRequest(new { message = "البريد الإلكتروني موجود بالفعل!" });
            }

            byte[] hash;
            byte[] salt;
            PasswordHash.Hasher(user.Passwword, out hash, out salt);

            var data = new User
            {
                UserName = user.UserName,
                Email = user.Email,
                Passwword = user.Passwword,
                PasswordHash = hash,
                PasswordSalt = salt,
            };

            _db.Users.Add(data);
            _db.SaveChanges();

            return Ok(data);
        }


        [HttpPost("LoginUsers")]
        public IActionResult Login([FromForm] UserLoginDTO user)
        {
            var data = _db.Users.FirstOrDefault(x => x.Email == user.Email);
            if (data == null || !PasswordHash.verifyPassword(user.Password, data.PasswordHash, data.PasswordSalt))
            {
                return Unauthorized();
            }

            var token = _tokenGenerator.GenerateToken(data.UserName);

            var response = new
            {
                Token = token,
                User = data
            };

            return Ok(response);
        }



        [HttpGet("ShowUserByID/{id:int}")]
        public IActionResult GetUser(int id)
        {
            var user = _db.Users.Find(id);
            return Ok(user);
        }
        [HttpPut("UpdateUser/{id:int}")]
        public IActionResult UpdateUser(int id, [FromForm] UpdateUserDTO user)
        {
            var uploadedFolder = Path.Combine(Directory.GetCurrentDirectory(), "UsersImage");
            if (!Directory.Exists(uploadedFolder))
            {
                Directory.CreateDirectory(uploadedFolder);
            }
            var fileImage = Path.Combine(uploadedFolder, user.UserImage.FileName);
            using (var stream = new FileStream(fileImage, FileMode.Create))
            {
                user.UserImage.CopyToAsync(stream);
            }
            var data = _db.Users.Find(id);

            data.FirstName = user.FirstName;
            data.LastName = user.LastName;
            data.UserName = user.UserName;
            data.Email = user.Email;
            data.PhoneNumber = user.PhoneNumber;
            data.Address = user.Address;
            data.UserImage = user.UserImage.FileName;

            _db.Users.Update(data);
            _db.SaveChanges();
            return Ok(user);
        }





        [HttpDelete("DeleteUser/{id:int}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _db.Users.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            _db.Users.Remove(user);
            _db.SaveChanges();
            return Ok($"User with ID {id} has been successfully deleted.");
        }



        //[HttpPut("ChangePassword/{id:int}")]
        //public IActionResult ChangePassword(int id, [FromBody] ChangePasswordDTO user)
        //{
        //    var data = _db.Users.Find(id);
        //    if (data == null)
        //    {
        //        return NotFound($"User with ID {id} not found.");
        //    }

        //    byte[] hash;
        //    byte[] salt;
        //    PasswordHash.Hasher(user.Passwword, out hash, out salt);

        //    data.Passwword = user.Passwword;
        //    data.PasswordHash = hash;
        //    data.PasswordSalt = salt;

        //    _db.Users.Update(data);
        //    _db.SaveChanges();
        //    return Ok("Password has been successfully changed.");
        //}


        //[HttpGet("GetUserByEmail/{email}")]
        //public IActionResult GetUserByEmail(string email)
        //{
        //    if (string.IsNullOrEmpty(email))
        //    {
        //        return BadRequest("Email parameter is required.");
        //    }

        //    var user = _db.Users.FirstOrDefault(u => u.Email == email);

        //    if (user == null)
        //    {
        //        return NotFound("User not found.");
        //    }

        //    return Ok(user);
        //}


        //[HttpPost("send")]
        //public async Task<IActionResult> SendEmail([FromForm] EmailRequest request)
        //{
        //    // Generate OTP
        //    var otp = OtpGenerator.GenerateOtp();
        //    var user = _db.Users.Where(x => x.Email == request.ToEmail).FirstOrDefault();
        //    user.Passwword = otp;
        //    _db.SaveChanges();

        //    // Create email body including the OTP
        //    var emailBody = $"<p>Hello,</p><p>Your OTP code is: <strong>{otp}</strong></p><p>Thank you.</p>";
        //    var Subject = "send OTP";
        //    // Send email with OTP
        //    //await _emailService.SendEmailAsync(request.ToEmail, Subject, emailBody);
        //    Shared.EmailSender.SendEmail(request.ToEmail, Subject, emailBody);

        //    return Ok(new { message = "Email sent successfully.", otp, user.UserId }); // Optionally return the OTP for testing
        //}



        //[HttpPost("GetOTP/{id}")]
        //public IActionResult GetOTP([FromForm] OTPDTO request, int id)
        //{
        //    var user = _db.Users.Find(id);
        //    if (user.Passwword == request.OTP)
        //    {

        //        return Ok();

        //    }
        //    return BadRequest();
        //}



    }
}
