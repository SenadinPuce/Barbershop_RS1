using API.Entities;

namespace API.Interfaces.Repositories
{
    public interface IAppointmentStatusRepository
    {
        Task<AppointmentStatus> GetAsync(string status);
        Task<List<AppointmentStatus>> GetAllAsync();

    }
}
