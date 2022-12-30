using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly DataContext _db;

        public EmailService(IConfiguration config, IMapper mapper, DataContext db)
        {
            _db = db;
            _mapper = mapper;
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

        public async Task SaveEmail(EmailDto emailDto)
        {
            var email = new Email();
            _mapper.Map(emailDto, email);

            email.DateSent = DateTime.UtcNow;

            await _db.AddAsync(email);
            await _db.SaveChangesAsync();
        }
    }
}
