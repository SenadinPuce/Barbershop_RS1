using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using API.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(DataContext context, IMapper mapper, IAppointmentService appointmentService)
        {
            _context = context;
            _mapper = mapper;
            _appointmentService = appointmentService;
        }

        [HttpGet]
        public async Task<ActionResult<AppointmentDto[]>> GetAppointmentAsync([FromQuery] AppointmentParams request)
        {
            var appointmentsQuery = _context.Appointment.Include(x => x.AppointmentType).Include(x => x.AppointmentStatus).Include(x => x.Client.AppUser).Include(x => x.Barber.AppUser)
                .Where(x => x.StartsAt >= request.DateFrom && x.StartsAt <= request.DateTo).AsQueryable();
            if (request.BarberIds?.Length > 0)
            {
                var barberIds = request.BarberIds.Split(',').Select(x => int.Parse(x));
                appointmentsQuery = appointmentsQuery.Where(x => barberIds.Any(bId => bId == x.BarberId));
            }
            if (request.ClientId != null)
            {
                appointmentsQuery = appointmentsQuery.Where(x => x.Client.Id == request.ClientId);
            }
            var appointments = await appointmentsQuery.OrderBy(appt => appt.StartsAt).ToListAsync();

            return _mapper.Map<AppointmentDto[]>(appointments);
        }

        [HttpGet("taken-slots")]
        public async Task<ActionResult<CalendarSlotDto[]>> GetTakenSlotsAsync([FromQuery] AppointmentParams request)
        {
            var appointmentsQuery = _context.Appointment.Include(x => x.Client)
                .Where(x => x.StartsAt >= request.DateFrom && x.StartsAt <= request.DateTo).AsQueryable();
            if (request.BarberIds?.Length > 0)
            {
                var barberIds = request.BarberIds.Split(',').Select(x => int.Parse(x));
                appointmentsQuery = appointmentsQuery.Where(x => barberIds.Any(bId => bId == x.BarberId));
            }
            if (request.ClientId != null)
            {
                appointmentsQuery = appointmentsQuery.Where(x => x.ClientId != request.ClientId);
            }
            var slots = await appointmentsQuery.OrderBy(appt => appt.StartsAt).Select(x =>
                 new CalendarSlotDto
                 {
                     DateFrom = x.StartsAt,
                     DateTo = x.EndsAt
                 }
            ).ToArrayAsync();

            return slots;
        }

        [HttpGet("{id}", Name = "GetAppointment")]
        public async Task<ActionResult<AppointmentDto>> GetAppointmentByIdAsync(int id)
        {
            var appointmentType = await _context.Appointment.SingleOrDefaultAsync(x => x.Id == id);
            return _mapper.Map<AppointmentDto>(appointmentType);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostAppointmentAsync(AppointmentDto model)
        {
            var appt = _mapper.Map<Appointment>(model);

            await _context.AddAsync(appt);
            if (await _context.SaveChangesAsync() < 1)
            {
                return BadRequest("Error while inserting the appointment");
            }

            var newAppt = await _context.Appointment.Include(x => x.Client.AppUser).Include(x => x.Barber.AppUser).SingleOrDefaultAsync(x => x.Id == appt.Id);

            await _appointmentService.OnAppointmentSchedule(newAppt);

            return CreatedAtRoute("GetAppointment", new { id = newAppt.Id }, _mapper.Map<AppointmentDto>(newAppt));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteAsync(int id)
        {
            var appointment = await _context.Appointment.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            _context.Remove(appointment);
            await _context.SaveChangesAsync();

            return true;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> PutAsync(int id, AppointmentDto model)
        {
            var appointment = await _context.Appointment.SingleOrDefaultAsync(x => x.Id == id);

            if (appointment == null)
            {
                return BadRequest();
            }
            var entity = _mapper.Map(model, appointment);

            _context.Update(entity);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        [HttpPut("{id}/complete")]
        public async Task<ActionResult> CompleteAsync(int id)
        {
            var appointment = await _context.Appointment.SingleOrDefaultAsync(x => x.Id == id);
            if (appointment == null)
            {
                return BadRequest();
            }
            var completedStatus = await _context.AppointmentStatus.SingleAsync(status => status.Name == "Completed");
            appointment.AppointmentStatusId = completedStatus.Id;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}/cancel")]
        public async Task<ActionResult> CancelAsync(int id)
        {
            var appointment = await _context.Appointment.SingleOrDefaultAsync(x => x.Id == id);
            if (appointment == null)
            {
                return BadRequest();
            }
            var canceledStatus = await _context.AppointmentStatus.SingleAsync(status => status.Name == "Canceled");
            appointment.AppointmentStatusId = canceledStatus.Id;

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}