using MasterPieceALL.DTOs;
using MasterPieceALL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MasterPieceALL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {


        private readonly MyDbContext _db;

        public PaymentsController(MyDbContext db)
        {
            _db = db;
        }



        [HttpGet("GetPayment")]
        public IActionResult GetAllOrders()
        {
            var payments = _db.Payments
                .Select(o => new PaymentRequestDto
                {
                    OrderId = o.OrderId,
                    Amount = o.Amount,
                    PaymentMethod = o.PaymentMethod,
                    PaymentDate = o.PaymentDate,
                    PaymentGateway = o.PaymentGateway,
                    Status = o.Status
                })
                .ToList();

            if (payments == null || !payments.Any())
            {
                return NotFound("No payments found.");
            }

            return Ok(payments);
        }



        [HttpPost("processPayment")]
        public IActionResult ProcessPayment([FromBody] payment2Dto paymentRequest)
        {
            // التحقق من صحة القيم المستلمة
            if (paymentRequest.OrderId == null || paymentRequest.Amount == null)
            {
                return BadRequest("OrderId or Amount is missing.");
            }

            // إنشاء بيانات الدفع وإضافتها إلى جدول الـ Payment
            var payment = new Payment
            {
                OrderId = paymentRequest.OrderId.Value,
                Amount = paymentRequest.Amount.Value,
                PaymentDate = DateTime.Now
            };

            _db.Payments.Add(payment);
            _db.SaveChanges(); // حفظ التغييرات في قاعدة البيانات

            return Ok("Payment processed successfully.");
        }
    }
}
