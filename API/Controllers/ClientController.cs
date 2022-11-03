using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/clients")]
    public class ClientController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public ClientController(DataContext context, IMapper mapper, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<ClientDto>>> GetClientAsync([FromQuery] BaseParams clientParams)
        {
            var clients = _context.Client
            .Where(x => x.AppUser.FirstName.ToLower().Contains(clientParams.Search.ToLower()) ||
                     x.AppUser.LastName.ToLower().Contains(clientParams.Search.ToLower()) ||
                     (x.AppUser.FirstName.ToLower() + " " + x.AppUser.LastName.ToLower()).Contains(clientParams.Search)).AsQueryable();

            clients = clientParams.SortBy switch
            {
                "created|asc" => clients.OrderBy(x => x.AppUser.Created),
                "created|desc" => clients.OrderByDescending(x => x.AppUser.Created),
                "name|desc" => clients.OrderByDescending(x => x.AppUser.FirstName),
                _ => clients.OrderBy(x => x.AppUser.FirstName)
            };


            var clientDtos = clients.ProjectTo<ClientDto>(_mapper.ConfigurationProvider).AsNoTracking();

            var list = await PagedList<ClientDto>.CreateAsync(clientDtos, clientParams.PageNumber, clientParams.PageSize);

            Response.AddPaginationHeader(list.TotalCount, list.CurrentPage, list.PageSize, list.TotalPages);

            return list;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientDto>> GetClientByIdAsync(int id)
        {
            var client = await _context.Client.Include(x => x.AppUser).ThenInclude(x => x.Photo).SingleOrDefaultAsync(x => x.Id == id);

            if (client == null) return NotFound();

            return _mapper.Map<ClientDto>(client);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostClientAsync(ClientDto model)
        {
            var clients = _mapper.Map<Client>(model);
            await _context.AddAsync(clients);
            await _context.SaveChangesAsync();

            return Created(this.Url.ToString(), true);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutClientAsync(int id, ClientDto model)
        {
            var client = await _context.Client.Include(x => x.AppUser).SingleOrDefaultAsync(x => x.Id == id);

            if (client == null) return BadRequest();

            _mapper.Map(model, client);

            _context.Update(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteClientAsync(int id)
        {
            var client = await _context.Client.SingleOrDefaultAsync(x => x.Id == id);
            if (client == null) return NotFound();

            var user = await _userManager.FindByIdAsync(client.AppUserId.ToString());

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest();

            return true;
        }
    }
}