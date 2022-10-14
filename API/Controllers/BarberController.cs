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
    [Route("api/barbers")]
    public class BarberController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public BarberController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<BarberDto[]>> GetBarberAsync()
        {
            var barbers = await _context.Barber.Include(x => x.AppUser).ToListAsync();
            return _mapper.Map<BarberDto[]>(barbers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BarberDto>> GetBarberAsync(int id)
        {
            var barber = await _context.Barber.Include(x => x.AppUser).Include(x => x.BarberServices).ThenInclude(x => x.Service).SingleOrDefaultAsync(x => x.Id == id);
            if (barber == null)
            {
                return NotFound();
            }
            return _mapper.Map<BarberDto>(barber);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostBarberAsync(BarberDto model)
        {
            var barbers = _mapper.Map<Barber>(model);
            await _context.AddAsync(barbers);
            await _context.SaveChangesAsync();

            return Created(this.Url.ToString(), true);
        }


    }
}