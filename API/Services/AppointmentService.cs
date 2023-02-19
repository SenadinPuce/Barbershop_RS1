using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers.Constants;
using API.Interfaces;
using API.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IEmailService _emailService;
        private readonly DataContext _db;
        private readonly IHubContext<NotificationHub> _notificationHub;

        public AppointmentService(IEmailService emailService, DataContext db, IHubContext<NotificationHub> notificationHub)
        {
            _notificationHub = notificationHub;
            _db = db;
            _emailService = emailService;
        }

        public async Task OnAppointmentCreated(Appointment appointment)
        {
            if (appointment == null) throw new Exception("Appointment does not exist");
            //scheduled by barber/admin
            if (!appointment.CreatedByClient)
            {
                if (appointment.Client != null && appointment.Client.AppUser.Email != null && appointment.Client.EmailNotification == true)
                {
                    await SendAppointmentScheduledEmail(appointment);
                }
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionsForUser(appointment.Barber.AppUser.UserName);
                if (connections != null)
                {
                    await _notificationHub.Clients.Clients(connections).SendAsync("NewPendingAppointment");
                }
            }
        }

        public async Task OnAppointmentSchedule(Appointment appointment)
        {
            if (appointment == null) throw new Exception("Appointment does not exist");

            await SendAppointmentScheduledEmail(appointment);

            var connections = await PresenceTracker.GetConnectionsForUser(appointment.Barber.AppUser.UserName);
            if (connections != null)
            {
                await _notificationHub.Clients.Clients(connections).SendAsync("PendingAppointmentLess");
            }

        }

        public async Task OnAppointmentCancel(Appointment appointment, bool canceledByClient, int previousStatusId)
        {
            if (appointment == null) throw new Exception("Appointment does not exist");

            var pendingStatus = await _db.AppointmentStatus.SingleAsync(x => x.Name == AppointmentStatuses.Pending);
            if (previousStatusId == pendingStatus.Id)
            {
                var connections = await PresenceTracker.GetConnectionsForUser(appointment.Barber.AppUser.UserName);
                if (connections != null)
                {
                    await _notificationHub.Clients.Clients(connections).SendAsync("PendingAppointmentLess");
                }
            }
            if (!canceledByClient)
            {
                if (appointment.Client != null && appointment.Client.AppUser.Email != null && appointment.Client.EmailNotification == true)
                {
                    await SendAppointmentCanceledEmail(appointment, previousStatusId);
                }
            }
        }

        public async Task SendAppointmentScheduledEmail(Appointment appointment)
        {
            var client = appointment.Client;
            var barber = appointment.Barber;
            var startDateInLocal = appointment.StartsAt.ToLocalTime();

            var body = $"<p>Hello {client.AppUser.FirstName},<br><br>" +
                $"this email confirms that a new appointment has been scheduled for you!<br><br>" +
                $"Date and Time: <b>{startDateInLocal.ToString("dddd, dd MMMM HH:mm")}</br><br>" +
                $"Duration: {appointment.Duration} minutes<br>" +
                $"Barber: {barber.AppUser.FirstName} {barber.AppUser.LastName}<br><br>" +
                $"We are looking forward to seeing you. :) <br><br><br>" +
                $"Regards, BarberShop </p>";

            var email = new EmailDto
            {
                To = appointment.Client.AppUser.Email,
                Subject = "New Appointment Scheduled",
                Body = body
            };

            await _emailService.SendEmail(email);
            await _emailService.SaveEmail(email);
        }

        public async Task SendAppointmentCanceledEmail(Appointment appointment, int previousStatusId)
        {
            var client = appointment.Client;
            var startDateInLocal = appointment.StartsAt.ToLocalTime();
            var pendingStatus = await _db.AppointmentStatus.SingleAsync(x => x.Name == AppointmentStatuses.Pending);
            var body = "";
            var subject = "";
            if (previousStatusId == pendingStatus.Id)
            {
                subject = "Appointment Feedback";
                body = $"<p>Hello {client.AppUser.FirstName},<br><br>" +
                    $"this email confirms that your suggested appointment on {startDateInLocal.ToString("dddd, dd MMMM HH:mm")} hasn't been scheduled.<br>" +
                    $"Be free to use our calendar and schedule a new appointment with desired date and time or contact us directly. <br><br>" +
                    $"Thank you for understanding. <br><br><br>" +
                    $"Regards, BarberShop </p>";
            }
            else
            {
                subject = "Appointment Canceled";
                body = $"<p>Hello {client.AppUser.FirstName},<br><br>" +
                    $"this email confirms that your scheduled appointment on {startDateInLocal.ToString("dddd, dd MMMM HH:mm")} has been canceled due to unexpected events.<br>" +
                    $"Be free to use our calendar and schedule a new appointment with desired date and time or contact us directly. <br><br>" +
                    $"Thank you for understanding. <br><br><br>" +
                    $"Regards, BarberShop </p>";
            }
            var email = new EmailDto
            {
                To = appointment.Client.AppUser.Email,
                Subject = subject,
                Body = body
            };

            await _emailService.SendEmail(email);
            await _emailService.SaveEmail(email);
        }

        public async Task SendAppointmentOneHourDueEmail(Appointment appointment)
        {
            if (appointment.Client == null || appointment.Client.AppUser.Email == null || appointment.Client.EmailNotification == false) return;

            var client = appointment.Client;
            var barber = appointment.Barber;
            var startDateInLocal = appointment.StartsAt.ToLocalTime();

            var body = $"<p>Hello {client.AppUser.FirstName},<br><br>" +
                $"this email confirms that your scheduled appointment is in one hour due.<br><br>" +
                $"Date and Time: <b>{startDateInLocal.ToString("dddd, dd MMMM HH:mm")}</b><br>" +
                $"Duration: {appointment.Duration} minutes<br>" +
                $"Barber: {barber.AppUser.FirstName} {barber.AppUser.LastName}<br><br>" +
                $"We are looking forward to seeing you. :) <br><br><br>" +
                $"Regards, BarberShop </p>";

            var email = new EmailDto
            {
                To = appointment.Client.AppUser.Email,
                Subject = "Appointment in One Hour",
                Body = body
            };

            await _emailService.SendEmail(email);
            await _emailService.SaveEmail(email);
        }

        public async Task<bool> CanBeCreated(AppointmentUpdateDto appointment)
        {
            var startsAt = appointment.StartsAt;
            var endsAt = appointment.EndsAt;
            var now = DateTime.UtcNow;

            if (startsAt < now) return false;

            var dateIn30Days = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second).AddDays(30);
            if (startsAt > dateIn30Days) return false;

            var workingHours = await _db.WorkingHours.ToListAsync();
            var dayWorkingHours = workingHours.Single(wh => ((int)startsAt.Value.DayOfWeek) == wh.DayOfWeek);
            var startsAtInLocal = startsAt.Value.ToLocalTime();
            var endsAtInLocal = endsAt.Value.ToLocalTime();

            //appointment outside of working hours
            if (startsAtInLocal.Hour < dayWorkingHours.FromHours || endsAtInLocal.Hour > dayWorkingHours.ToHours) return false;
            if (startsAtInLocal.Hour == dayWorkingHours.FromHours)
            {
                if (startsAtInLocal.Minute < dayWorkingHours.FromMinutes) return false;
            }
            if (endsAtInLocal.Hour == dayWorkingHours.ToHours)
            {
                if (endsAtInLocal.Minute > dayWorkingHours.ToMinutes) return false;
            }

            //appointment inside custom closed hours
            var customHours = await _db.CustomHours.ToListAsync();
            if (customHours.Any(ch => ch.IsOpen != true &&
                                (startsAt > ch.DateFrom && startsAt < ch.DateTo ||
                                endsAt > ch.DateFrom && endsAt < ch.DateTo)))
            {
                return false;
            }

            return true;
        }

    }
}
