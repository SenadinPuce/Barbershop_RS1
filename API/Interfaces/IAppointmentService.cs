using API.Entities;

namespace API.Interfaces
{
    public interface IAppointmentService
    {
        Task SendAppointmentScheduledEmail(Appointment appointment);
        Task OnAppointmentSchedule(Appointment appointment);
        Task SendAppointmentOneHourDueEmail(Appointment appointment);

    }
}
