using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;

namespace API.Controllers
{
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
        public async Task<ActionResult<AppointmentDto[]>> GetAppointmentAsync()
        {
            var appointments = await _context.Appointment.Include(x => x.AppointmentType).Include(x => x.Client.AppUser).ToListAsync();
            return _mapper.Map<AppointmentDto[]>(appointments);
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

            var scheduledStatus = await _context.AppointmentStatus.SingleOrDefaultAsync(x => x.Name == "Scheduled");
            appt.AppointmentStatusId = scheduledStatus.Id;

            await _context.AddAsync(appt);
            if(await _context.SaveChangesAsync() < 1)
            {
                return BadRequest("Error while inserting the appointment");
            }

            var newAppt = await _context.Appointment.Include(x => x.Client.AppUser).Include(x => x.Barber.AppUser).SingleOrDefaultAsync( x=> x.Id == appt.Id);

            await _appointmentService.OnAppointmentSchedule(newAppt);

            return CreatedAtRoute("GetAppointment", new {id = newAppt.Id}, _mapper.Map<AppointmentDto>(newAppt));
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
    }
}