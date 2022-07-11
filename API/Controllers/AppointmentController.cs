using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AppointmentController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<AppointmentDto[]>> GetAppointmentAsync()
        {
            var appointmentTypes = await _context.Appointment.ToListAsync();
            return _mapper.Map<AppointmentDto[]>(appointmentTypes);
        }

        [HttpGet("{id}")]
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
            await _context.SaveChangesAsync();

            return Created(this.Url.ToString(), true);
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