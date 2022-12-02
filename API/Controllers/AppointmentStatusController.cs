using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/appointment-status")]
    public class AppointmentStatusController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AppointmentStatusController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<AppointmentStatusDto[]>> GetAppointmentStatusAsync()
        {
            var statuses = await _context.AppointmentStatus.ToListAsync();
            return _mapper.Map<AppointmentStatusDto[]>(statuses);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostAppointmentStatusAsync(AppointmentStatusDto model)
        {
            var statuses = _mapper.Map<AppointmentStatus>(model);
            await _context.AddAsync(statuses);
            await _context.SaveChangesAsync();

            return Created(this.Url.ToString(), true);
        }


    }
}