namespace MasterPieceALL.DTOs
{
    public class UserRegisterDTO
    {
       

        public string? UserName { get; set; }

        public string Email { get; set; } = null!;
        public string? Passwword { get; set; }
    }
    public class UserEmailDTO
    {
        public string? Email { get; set; }
    }
}
