using API.Entities;
using API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class AppointmentStatusRepository : IAppointmentStatusRepository
    {
        private readonly DataContext _db;

        public AppointmentStatusRepository(DataContext db)
        {
            _db = db;
        }
        public async Task<AppointmentStatus> GetAsync(string status)
        {
            return await _db.AppointmentStatus.SingleOrDefaultAsync(s => s.Name == status);
        }
    }
}
