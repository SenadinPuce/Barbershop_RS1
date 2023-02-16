using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public PhotoDto Photo { get; set; }
        public bool SmsNotification { get; set; }
        public bool EmailNotification { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}