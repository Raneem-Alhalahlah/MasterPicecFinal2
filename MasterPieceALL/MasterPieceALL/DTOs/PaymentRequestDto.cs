namespace MasterPieceALL.DTOs
{
    public class PaymentRequestDto
    {
        public int? OrderId { get; set; }
        public decimal? Amount { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? PaymentGateway { get; set; }
        public string? Status { get; set; }

    }
}
