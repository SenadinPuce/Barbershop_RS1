using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
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

        public ClientController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<ClientDto>>> GetClientAsync([FromQuery] ClientParams clientParams)
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