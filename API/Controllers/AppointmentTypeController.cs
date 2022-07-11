using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;

namespace API.Controllers
{
    [ApiController]
    [Route("api/appointment-types")]
    public class AppointmentTypeController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AppointmentTypeController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<AppointmentTypeDto[]>> GetAppointmentTypeAsync()
        {
            var appointmentTypes = await _context.AppointmentType.Include(x => x.AppointmentTypeServices).ThenInclude(x => x.Service).ToListAsync();
            return _mapper.Map<AppointmentTypeDto[]>(appointmentTypes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentTypeDto>> GetAppointmentTypeByIdAsync(int id)
        {
            var appointmentType = await _context.AppointmentType.Include(x => x.AppointmentTypeServices).ThenInclude(x => x.Service).SingleOrDefaultAsync(x => x.Id == id);
            return _mapper.Map<AppointmentTypeDto>(appointmentType);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostAppointmentTypeAsync(AppointmentTypeDto model)
        {
            if (!model.Services.Any() == true)
            {
                return BadRequest();
            }

            var appt = _mapper.Map<AppointmentType>(model);
            await _context.AddAsync(appt);

            if (_context.SaveChanges() > 0)
            {
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
                _context.SaveChanges();

                return Created(this.Url.ToString(), true);
            }

            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteAsync(int id)
        {
            var apptType = await _context.AppointmentType.FindAsync(id);

            if (apptType == null)
            {
                return NotFound();
            }

            _context.Remove(apptType);
            _context.SaveChanges();

            return true;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentTypeDto>> PutAsync(int id, AppointmentTypeDto model)
        {
            var apptType = await _context.AppointmentType.Include(x => x.AppointmentTypeServices).FirstOrDefaultAsync(x => x.Id == id);

            if (apptType == null)
            {
                return BadRequest();
            }
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

            _context.Update(entity);
            _context.SaveChanges();

            return Ok(model);
        }
    }
}