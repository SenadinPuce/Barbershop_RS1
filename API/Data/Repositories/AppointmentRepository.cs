using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Interfaces.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;

namespace API.Data.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;

        public AppointmentRepository(DataContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<List<AppointmentDto>> GetAppointmentsAsync(AppointmentParams appointmentParams)
        {
            var appointments = _db.Appointment
                .AsNoTracking()
                .Include(x => x.AppointmentType)
                .Include(x => x.AppointmentStatus)
                .Include(x => x.Client.AppUser)
                .Include(x => x.Barber.AppUser)
                .Where(x => x.StartsAt >= appointmentParams.DateFrom.Value && x.StartsAt <= appointmentParams.DateTo.Value)
                .OrderBy(x => x.StartsAt)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(appointmentParams.BarberIds))
            {
                var barberIds = appointmentParams.BarberIds.Split(',').Select(x => int.Parse(x));
                appointments = appointments.Where(x => barberIds.Any(bId => bId == x.BarberId));
            }
            if (!string.IsNullOrWhiteSpace(appointmentParams.StatusIds))
            {
                var statusIds = appointmentParams.StatusIds.Split(',').Select(x => int.Parse(x));
                appointments = appointments.Where(x => statusIds.Any(bId => bId == x.AppointmentStatusId));
            }
            if (appointmentParams.ClientId.HasValue)
            {
                appointments = appointments.Where(x => x.Client.Id == appointmentParams.ClientId.Value);
            }

            var appointmentDtos = appointments.ProjectTo<AppointmentDto>(_mapper.ConfigurationProvider);

            return await appointmentDtos.ToListAsync();
        }

        public async Task<List<CalendarSlotDto>> GetTakenSlotsAsync(AppointmentParams appointmentParams)
        {
            var canceledStatus = await _db.AppointmentStatus.SingleAsync(x => x.Name == "Canceled");
            var appointmentSlots = _db.Appointment
                .AsNoTracking()
                .Include(x => x.Client)
                .Where(x => x.StartsAt >= appointmentParams.DateFrom.Value &&
                            x.StartsAt <= appointmentParams.DateTo.Value &&
                            x.AppointmentStatusId != canceledStatus.Id)
                .OrderBy(x => x.StartsAt)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(appointmentParams.BarberIds))
            {
                var barberIds = appointmentParams.BarberIds.Split(',').Select(x => int.Parse(x));
                appointmentSlots = appointmentSlots.Where(x => barberIds.Any(bId => bId == x.BarberId));
            }
            if (appointmentParams.ClientId.HasValue)
            {
                appointmentSlots = appointmentSlots.Where(x => x.ClientId != appointmentParams.ClientId.Value);
            }

            var takenSlots = await appointmentSlots
                .Select(apptSlot => new CalendarSlotDto
                {
                    DateFrom = apptSlot.StartsAt,
                    DateTo = apptSlot.EndsAt,
                }).ToListAsync();

            return takenSlots;
        }

        public async Task<Appointment> GetByIdAsync(int id)
        {
            return await _db.Appointment.SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Appointment> GetByIdWithBarberAndClient(int id)
        {
            return await _db.Appointment
                        .Include(x => x.Client.AppUser)
                        .Include(x => x.Barber.AppUser)
                        .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddAsync(Appointment appointment)
        {
            await _db.Appointment.AddAsync(appointment);
        }

        public void Remove(Appointment appointment)
        {
            _db.Appointment.Remove(appointment);
        }
    }
}
