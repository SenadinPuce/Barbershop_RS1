using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IAppointmentService
    {
        Task SendAppointmentScheduledEmail(Appointment appointment);
        Task SendAppointmentCanceledEmail(Appointment appointment, AppointmentStatus previousStatus);
        Task SendAppointmentOneHourDueEmail(Appointment appointment);
        Task OnAppointmentSchedule(Appointment appointment);
        Task OnAppointmentCancel(Appointment appointment, bool canceledByClient, AppointmentStatus previousStatus);
        Task<bool> CanBeCreated(AppointmentDto appointment);
    }
}
