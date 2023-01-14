using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/barbers")]
    public class BarberController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly IPhotoService _photoService;

        public BarberController(DataContext context, IMapper mapper, UserManager<AppUser> userManager, IPhotoService photoService)
        {
            _photoService = photoService;
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<BarberDto[]>> GetBarberAsync()
        {
            var barbers = await _context.Barber.Include(x => x.AppUser).ThenInclude(x => x.Photo).Include(x => x.BarberServices).ThenInclude(x => x.Service).ToListAsync();
            return _mapper.Map<BarberDto[]>(barbers);
        }

        [HttpGet("{id}", Name = "GetBarber")]
        public async Task<ActionResult<BarberDto>> GetBarberAsync(int id)
        {
            var barber = await _context.Barber.Include(x => x.AppUser).ThenInclude(x => x.Photo).Include(x => x.BarberServices).ThenInclude(x => x.Service).SingleOrDefaultAsync(x => x.AppUserId == id);
            if (barber == null)
            {
                return NotFound();
            }
            return _mapper.Map<BarberDto>(barber);
        }

        [Authorize("RequireBarberRole")]
        [HttpGet("username/{username}")]
        public async Task<ActionResult<BarberDto>> GetBarberByUsernameAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();

            var barber = await _context.Barber.Include(x => x.AppUser).ThenInclude(x => x.Photo).Include(x => x.BarberServices).ThenInclude(x => x.Service).SingleOrDefaultAsync(x => x.AppUserId == user.Id);
            if (barber == null) return NotFound();

            return _mapper.Map<BarberDto>(barber);
        }

        [Authorize("RequireAdminRole")]
        [HttpPost]
        public async Task<ActionResult<bool>> PostBarberAsync(BarberDto model)
        {
            var username = model.FirstName.ToLower() + "." + model.LastName.ToLower();
            if (await UserExists(username))
                return BadRequest("Username already taken");

            var barber = new Barber();
            _mapper.Map(model, barber);
            barber.AppUser.UserName = username;

            if (model.Photo != null)
            {
                barber.AppUser.PhotoId = model.Photo.Id;
                barber.AppUser.Photo = null;
            }

            await _userManager.CreateAsync(barber.AppUser, "Barber0!");
            await _userManager.AddToRoleAsync(barber.AppUser, "Barber");

            await _context.AddAsync(barber);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        [Authorize("RequireBarberOrAdminRole")]
        [HttpPut("{id}")]
        public async Task<ActionResult> PutBarberAsync(int id, BarberDto model)
        {
            var barber = await _context.Barber.Include(x => x.AppUser).Include(x => x.BarberServices).SingleOrDefaultAsync(x => x.Id == id);

            if (barber == null) return BadRequest();
            _mapper.Map(model, barber);

            _context.Update(barber);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize("RequireAdminRole")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteAsync(int id)
        {
            var barber = await _context.Barber.SingleOrDefaultAsync(x => x.Id == id);
            if (barber == null) return NotFound();

            var user = await _userManager.FindByIdAsync(barber.AppUserId.ToString());

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest();

            return true;
        }

        [HttpPost("add-photo")]
        [Authorize("RequireBarberOrAdminRole")]
        public async Task<ActionResult<PhotoDto>> UploadPhotoAsync(int barberId, IFormFile file)
        {
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            _context.Add(photo);
            await _context.SaveChangesAsync();

            var uploadedPhoto = await _context.Photo.SingleOrDefaultAsync(x => x.PublicId == photo.PublicId);

            return _mapper.Map<PhotoDto>(uploadedPhoto);
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}