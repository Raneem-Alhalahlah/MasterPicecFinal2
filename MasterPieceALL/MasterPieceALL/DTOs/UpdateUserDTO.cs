namespace MasterPieceALL.DTOs
{
    public class UpdateUserDTO
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? UserName { get; set; }

        public string Email { get; set; } = null!;
        public string? Passwword { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }
        public IFormFile? UserImage { get; set; }

    }
}
