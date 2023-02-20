using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Authorize]
    [Route("api/appointment-types")]
    public class AppointmentTypeController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AppointmentTypeController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<AppointmentTypeDto[]>> GetAsync()
        {
            var appointmentTypes = await _context.AppointmentType.Include(x => x.AppointmentTypeServices).ThenInclude(x => x.Service).ToListAsync();
            return _mapper.Map<AppointmentTypeDto[]>(appointmentTypes);
        }

        [HttpGet("{id}", Name = "GetAppointmentType")]
        public async Task<ActionResult<AppointmentTypeDto>> GetByIdAsync(int id)
        {
            var appointmentType = await _context.AppointmentType
                                        .Include(x => x.AppointmentTypeServices)
                                        .ThenInclude(x => x.Service)
                                        .SingleOrDefaultAsync(x => x.Id == id);

            return _mapper.Map<AppointmentTypeDto>(appointmentType);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostAppointmentTypeAsync(AppointmentTypeDto model)
        {
            if (!model.Services.Any()) return BadRequest();

            var appt = _mapper.Map<AppointmentType>(model);
            await _context.AddAsync(appt);

            if (await _context.SaveChangesAsync() == 0) return BadRequest();

            var newAppt = _context.AppointmentType.SingleOrDefault(x => x.Name.Equals(model.Name));
            var apptTypeServices = new List<AppointmentTypeService>();
            foreach (var service in model.Services)
            {
                apptTypeServices.Add(new AppointmentTypeService
                {
                    AppointmentTypeId = newAppt.Id,
                    ServiceId = service.Id
                });
            }
            _context.AddRange(apptTypeServices);
            await _context.SaveChangesAsync();

            return CreatedAtRoute("GetAppointmentType", new { id = newAppt.Id }, _mapper.Map<AppointmentTypeDto>(newAppt));

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteAsync(int id)
        {
            var apptType = await _context.AppointmentType.FindAsync(id);

            if (apptType == null) return NotFound();

            _context.Remove(apptType);
            await _context.SaveChangesAsync();

            return true;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentTypeDto>> PutAsync(int id, AppointmentTypeDto model)
        {
            var apptType = await _context.AppointmentType.Include(x => x.AppointmentTypeServices).FirstOrDefaultAsync(x => x.Id == id);

            if (apptType == null) return BadRequest();

            var entity = _mapper.Map(model, apptType);

            var appointmentTypeServices = new List<AppointmentTypeService>();
            foreach (var serviceId in model.Services.Select(s => s.Id))
            {
                appointmentTypeServices.Add(new AppointmentTypeService()
                {
                    AppointmentTypeId = model.Id,
                    ServiceId = serviceId
                });
            }
            _context.RemoveRange(entity.AppointmentTypeServices);
            entity.AppointmentTypeServices = appointmentTypeServices;

            await _context.SaveChangesAsync();

            return Ok(model);
        }
    }
}