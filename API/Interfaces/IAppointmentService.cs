using API.Entities;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IAppointmentService
    {
        Task SendAppointmentScheduledEmail(Appointment appointment);
        Task OnAppointmentSchedule(Appointment appointment);
    }
}
