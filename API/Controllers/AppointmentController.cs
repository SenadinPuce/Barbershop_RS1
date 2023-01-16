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
            if (request.StatusIds?.Length > 0)
            {
                var statusIds = request.StatusIds.Split(',').Select(x => int.Parse(x));
                appointmentsQuery = appointmentsQuery.Where(x => statusIds.Any(bId => bId == x.AppointmentStatusId));
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
            var canceledStatus = await _context.AppointmentStatus.SingleAsync(x => x.Name == "Canceled");
            var appointmentsQuery = _context.Appointment.Include(x => x.Client)
                .Where(x => x.StartsAt >= request.DateFrom && x.StartsAt <= request.DateTo
                    && x.AppointmentStatusId != canceledStatus.Id).AsQueryable();
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
            if (await _appointmentService.CanBeCreated(model) == false) return BadRequest("Appointment has not been created. Try with different date and time.");

            var appt = _mapper.Map<Appointment>(model);
            var pendingStatus = await _context.AppointmentStatus.SingleAsync(status => status.Name == "Pending");
            if (appt.AppointmentStatusId == pendingStatus.Id)
            {
                appt.CreatedByClient = true;
            }

            await _context.AddAsync(appt);
            if (await _context.SaveChangesAsync() < 1)
            {
                return BadRequest("Error while inserting the appointment");
            }

            var newAppt = await _context.Appointment.Include(x => x.Client.AppUser).Include(x => x.Barber.AppUser).SingleOrDefaultAsync(x => x.Id == appt.Id);
            await _appointmentService.OnAppointmentCreated(newAppt);

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
        public async Task<ActionResult<AppointmentDto>> PutAsync(int id, AppointmentUpdateDto model)
        {
            var appointment = await _context.Appointment.SingleOrDefaultAsync(x => x.Id == id);

            if (appointment == null)
            {
                return BadRequest();
            }
            var entity = _mapper.Map(model, appointment);

            await _context.SaveChangesAsync();

            return Ok(model);
        }


        [HttpPut("{id}/schedule")]
        public async Task<ActionResult> ScheduleAsync(int id)
        {
            var appointment = await _context.Appointment.Include(x => x.Client.AppUser).Include(x => x.Barber.AppUser).SingleOrDefaultAsync(x => x.Id == id);
            if (appointment == null) return BadRequest();

            var scheduledStatus = await _context.AppointmentStatus.SingleAsync(status => status.Name == "Scheduled");
            appointment.AppointmentStatusId = scheduledStatus.Id;

            await _context.SaveChangesAsync();
            await _appointmentService.OnAppointmentSchedule(appointment);

            return Ok();
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
        public async Task<ActionResult> CancelAsync(int id, bool canceledByClient)
        {
            var appointment = await _context.Appointment.Include(x => x.Barber.AppUser).Include(x => x.Client.AppUser).Include(x => x.AppointmentStatus).SingleOrDefaultAsync(x => x.Id == id);
            if (appointment == null)
            {
                return BadRequest();
            }

            var canceledStatus = await _context.AppointmentStatus.SingleAsync(status => status.Name == "Canceled");
            var previousStatus = appointment.AppointmentStatus;
            appointment.AppointmentStatusId = canceledStatus.Id;

            await _context.SaveChangesAsync();
            await _appointmentService.OnAppointmentCancel(appointment, canceledByClient, previousStatus);

            return Ok();
        }
    }
}