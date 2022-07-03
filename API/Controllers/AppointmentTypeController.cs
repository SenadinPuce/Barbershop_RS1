using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            return  _mapper.Map<AppointmentTypeDto[]>(appointmentTypes);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostAppointmentTypeAsync(AppointmentTypeDto model)
        {
            if(!model.Services.Any() == true)
            {
                return BadRequest();
            }

            var appt = _mapper.Map<AppointmentType>(model);
            await _context.AddAsync(appt);

            if(_context.SaveChanges() > 0)
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

                 return Created(this.Url.ToString(), true);
            }

            return BadRequest();
        }
  }
}