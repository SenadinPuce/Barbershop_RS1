using API.DTOs;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IEmailService
    {
        Task SendEmail(EmailDto email);
    }
}
