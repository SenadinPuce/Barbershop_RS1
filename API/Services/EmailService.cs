using API.DTOs;
using API.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task SendEmail(EmailDto emailData)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_config["Email:Name"], _config["Email:Address"]));
            email.To.Add(MailboxAddress.Parse(emailData.To));
            email.Subject = emailData.Subject;
            email.Body = new TextPart(TextFormat.Html) { Text = emailData.Body };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_config["Email:Address"], _config["Email:AppPassword"]);

            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }
    }
}
