using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IAppointmentService
    {
        Task SendAppointmentScheduledEmail(Appointment appointment);
        Task SendAppointmentCanceledEmail(Appointment appointment, int previousStatusId);
        Task SendAppointmentOneHourDueEmail(Appointment appointment);
        Task OnAppointmentCreated(Appointment appointment);
        Task OnAppointmentCancel(Appointment appointment, bool canceledByClient, int previousStatusId);
        Task<bool> CanBeCreated(AppointmentUpdateDto appointment);
        Task OnAppointmentSchedule(Appointment appointment);
    }
}
