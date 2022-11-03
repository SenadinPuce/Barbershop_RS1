using API.DTOs;
using API.Entities;
using API.Interfaces;
using System;
using System.Threading.Tasks;

namespace API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IEmailService _emailService;

        public AppointmentService(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task OnAppointmentSchedule(Appointment appointment)
        {
            if (appointment == null) throw new Exception("Appointment does not exist");

            if (appointment.Client == null)  return;

            if(appointment.Client.EmailNotification == true)
            {
                await SendAppointmentScheduledEmail(appointment);
            }
        }

        public async Task SendAppointmentScheduledEmail(Appointment appointment)
        {
            var client = appointment.Client;
            var barber = appointment.Barber;
            var startDateInLocal = appointment.StartsAt.ToLocalTime();

            var body = $"<p>Hello {client.AppUser.FirstName},<br><br>this email confirms that a new appointment has been scheduled for you!<br><br>Date and Time: <b>{startDateInLocal.ToString("dddd, dd MMMM HH:mm")}</b><br>Duration: {appointment.Duration} minutes<br>Barber: {barber.AppUser.FirstName} {barber.AppUser.LastName}<br><br>We are looking forward to seeing you. :) <br><br><br>Regards, BarberShop </p>";
            var email = new EmailDto
            {
                To = appointment.Client.AppUser.Email,
                Subject = "BarberShop - New Appointment Scheduled",
                Body = body
            };

            await _emailService.SendEmail(email);
        }
    }
}
