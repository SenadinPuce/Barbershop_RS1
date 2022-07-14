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
    [Route("api/clients")]
    public class ClientController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ClientController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<ClientDto[]>> GetClientAsync()
        {
            var clients = await _context.Client.Include(x => x.AppUser).ToListAsync();
            return _mapper.Map<ClientDto[]>(clients);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostClientAsync(ClientDto model)
        {
            var clients = _mapper.Map<Client>(model);
            await _context.AddAsync(clients);
            await _context.SaveChangesAsync();

            return Created(this.Url.ToString(), true);
        }


    }
}