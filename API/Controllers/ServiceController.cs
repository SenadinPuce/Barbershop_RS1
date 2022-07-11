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
    [Route("api/services")]
    public class ServiceController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ServiceController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceDto[]>> GetServiceAsync()
        {
            var services = await _context.Service.ToListAsync();
            return  _mapper.Map<ServiceDto[]>(services);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostServiceAsync(ServiceDto model)
        {
            var service = _mapper.Map<Service>(model);
            await _context.AddAsync(service);
            _context.SaveChanges();

            return Created(this.Url.ToString(), true);
        }


  }
}