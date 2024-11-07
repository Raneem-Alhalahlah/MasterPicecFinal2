namespace MasterPieceALL.DTOs
{
    public class OrderRequestDTO
    {

        public int? UserId { get; set; }

        public string? UserName { get; set; }

        public DateTime? OrderDate { get; set; }

        public string? ShippingStatus { get; set; }

        public decimal TotalAmount { get; set; }


    }
}
