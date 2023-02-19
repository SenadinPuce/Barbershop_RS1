using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [Route("api/appointment-status")]
    public class AppointmentStatusController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AppointmentStatusController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<AppointmentStatusDto>>> GetAsync()
        {
            var apptStatuses = await _unitOfWork.AppointmentStatusRepository.GetAllAsync();

            return _mapper.Map<List<AppointmentStatusDto>>(apptStatuses);
        }

    }
}