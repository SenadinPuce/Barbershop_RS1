using API.DTOs;

namespace API.Interfaces
{
    public interface IEmailService
    {
        Task SendEmail(EmailDto email);
    }
}
