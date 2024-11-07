using MasterPieceALL.DTOs.VouchersDtos;
using MasterPieceALL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VouchersController : ControllerBase
    {

        private readonly MyDbContext _db;

        public VouchersController(MyDbContext db)
        {
            _db = db;
        }


        // GET: api/Vouchers
        [HttpGet("GetVoucher")]
        public IActionResult GetVouchers()
        {
            var vouchers = _db.Vouchers.ToList();
            return Ok(vouchers);
        }

        // GET: api/Vouchers/5
        [HttpGet("GetVoucherById{id}")]
        public IActionResult GetVoucher(int id)
        {
            var voucher = _db.Vouchers.Find(id); 

            if (voucher == null)
            {
                return NotFound();
            }

            return Ok(voucher); 
        }


        // GET: api/Vouchers/5
        [HttpGet("GetVoucherByVoucherCode{voucherCode}")]
        public IActionResult GetVoucherByVoucherCode(string voucherCode)
        {
            var voucher = _db.Vouchers.Where(x=>x.VoucherCode == voucherCode).FirstOrDefault();

            if (voucher == null)
            { 
                return NotFound();
            }

            return Ok(voucher);
        }

        // POST: api/Vouchers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("AddVoucher")]

        public IActionResult PostVoucher([FromBody] VoucherDto voucherDto)
        {
            var voucher = voucherDto.CreateVoucher();
            _db.Vouchers.Add(voucher);

            try
            {
                _db.SaveChanges(); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create voucher.", error = ex.Message });
            }

            return CreatedAtAction("GetVoucher", new { id = voucher.VoucherId }, voucher);
        }


        // PUT: api/Vouchers/5
        [HttpPut("UpdateVoucher{id}")]
        public IActionResult PutVoucher(int id, [FromBody] VoucherDto voucherDto)
        {
            var voucher = _db.Vouchers.Find(id); 
            if (voucher == null)
            {
                return NotFound(); 
            }

            // تحديث القيم
            voucher.EndDate = DateOnly.Parse(voucherDto.EndDate);
            voucher.StartDate = DateOnly.Parse(voucherDto.StartDate);
            voucher.DiscountPercentage = voucherDto.DiscountPercentage;
            voucher.IsActive = voucherDto.IsActive;
            voucher.VoucherCode = voucherDto.VoucherCode;

            _db.Entry(voucher).State = EntityState.Modified;

            try
            {
                _db.SaveChanges(); 
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VoucherExists(id))
                    return NotFound(); 
                throw; 
            }

            return NoContent(); 
        }

       
        // DELETE: api/Vouchers/5
        [HttpDelete("DeletVoucher{id}")]
       
        public IActionResult DeleteVoucher(int id)
        {
            var voucher = _db.Vouchers.Find(id); 
            if (voucher == null)
            {
                return NotFound(); 
            }

            _db.Vouchers.Remove(voucher); 
            _db.SaveChanges();

            return NoContent(); 
        }

        private bool VoucherExists(int id)
        {
            return _db.Vouchers.Any(e => e.VoucherId == id);
        }
    }
}
