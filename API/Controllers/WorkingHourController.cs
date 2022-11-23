using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    [Route("api/working-hours")]
    public class WorkingHoursController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public WorkingHoursController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<WorkingHoursDto[]>> GetWorkingHoursAsync()
        {
            var services = await _context.WorkingHours.ToListAsync();
            return _mapper.Map<WorkingHoursDto[]>(services);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateWorkingHoursAsync(WorkingHoursDto[] model)
        {
            var hours = await _context.WorkingHours.ToListAsync();

            foreach (var item in hours)
            {
                _mapper.Map(model.Single(x => x.Id == item.Id), item);
            }

            await _context.SaveChangesAsync();

            return Ok(true);
        }

    }
}