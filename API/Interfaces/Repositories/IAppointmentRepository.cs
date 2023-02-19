using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repositories
{
    public interface IAppointmentRepository
    {
        Task<List<AppointmentDto>> GetAppointmentsAsync(AppointmentParams appointmentParams);
        Task<List<CalendarSlotDto>> GetTakenSlotsAsync(AppointmentParams appointmentParams);
        Task<Appointment> GetByIdAsync(int id);
        Task<Appointment> GetByIdWithBarberAndClient(int id);
        Task AddAsync(Appointment appointment);
        void Remove(Appointment appointment);
    }
}
