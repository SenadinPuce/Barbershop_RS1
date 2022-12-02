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
    [Route("api/custom-hours")]
    public class CustomHourController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CustomHourController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<CustomHoursDto[]>> GetCustomHoursAsync()
        {
            var services = await _context.CustomHours.ToListAsync();
            return _mapper.Map<CustomHoursDto[]>(services);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateCustomHoursAsync(CustomHoursDto[] model)
        {
            var mappedModels = _mapper.Map<List<CustomHours>>(model);
            var hours = await _context.CustomHours.ToListAsync();

            _context.RemoveRange(hours);
            _context.AddRange(mappedModels);

            await _context.SaveChangesAsync();

            return Ok(true);
        }

    }
}