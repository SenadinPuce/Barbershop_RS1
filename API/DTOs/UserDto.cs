namespace API.DTOs
{
    public class UserDto
    {
        public string Username { get; set; }
        public string Token { get; set; }
        public PhotoDto Photo { get; set; }
        public int? ClientId { get; set; }
        public int? BarberId { get; set; }
    }
}