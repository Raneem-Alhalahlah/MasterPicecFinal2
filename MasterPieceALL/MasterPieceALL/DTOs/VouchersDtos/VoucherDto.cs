
using MasterPieceALL.Models;
using System.ComponentModel.DataAnnotations;

namespace MasterPieceALL.DTOs.VouchersDtos
{
    public class VoucherDto
    {
        [Required]
        public string VoucherCode { get; set; } = null!;

        [Required]
        public decimal DiscountPercentage { get; set; }

        [Required]
        public string StartDate { get; set; }

        [Required]
        public string EndDate { get; set; }

        [Required]
        public bool? IsActive { get; set; }

        public Voucher CreateVoucher()
        {
            return new Voucher
            {
                DiscountPercentage = DiscountPercentage,
                EndDate = DateOnly.Parse(EndDate),
                IsActive = IsActive,
                StartDate = DateOnly.Parse(StartDate),
                VoucherCode = VoucherCode
            };
        }
    }
}
