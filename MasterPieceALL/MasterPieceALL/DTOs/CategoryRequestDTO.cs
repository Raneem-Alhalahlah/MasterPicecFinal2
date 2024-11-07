namespace MasterPieceALL.DTOs
{
    public class CategoryRequestDTO
    {
        public string? CategoryName { get; set; }

        public string? Description { get; set; }

        public IFormFile? CategoryImage { get; set; }
    }
}
