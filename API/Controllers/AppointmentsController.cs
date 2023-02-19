using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using API.Helpers;
using Microsoft.AspNetCore.Authorization;
using API.Helpers.Constants;

namespace API.Controllers
{
    [Authorize]
    public class AppointmentsController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IAppointmentService _appointmentService;
        private readonly IUnitOfWork _unitOfWork;

        public AppointmentsController(IMapper mapper, IAppointmentService appointmentService, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _appointmentService = appointmentService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<List<AppointmentDto>>> GetAppointmentAsync([FromQuery] AppointmentParams request)
        {
            return await _unitOfWork.AppointmentRepository.GetAppointmentsAsync(request);
        }

        [HttpGet("taken-slots")]
        public async Task<ActionResult<List<CalendarSlotDto>>> GetTakenSlotsAsync([FromQuery] AppointmentParams request)
        {
           return await _unitOfWork.AppointmentRepository.GetTakenSlotsAsync(request);
        }

        [HttpGet("{id}", Name = "GetAppointment")]
        public async Task<ActionResult<AppointmentDto>> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _unitOfWork.AppointmentRepository.GetByIdAsync(id);

            return _mapper.Map<AppointmentDto>(appointment);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostAppointmentAsync(AppointmentUpdateDto model)
        {
            if (!await _appointmentService.CanBeCreated(model)) 
                return BadRequest("Appointment has not been created. Try with different date and time.");

            var appt = _mapper.Map<Appointment>(model);
            var pendingStatus = await _unitOfWork.AppointmentStatusRepository.GetAsync(AppointmentStatuses.Pending);
            if (appt.AppointmentStatusId == pendingStatus.Id)
            {
                appt.CreatedByClient = true;
            }

            await _unitOfWork.AppointmentRepository.AddAsync(appt);
            if (await _unitOfWork.Complete() < 1)
                return BadRequest("Error while inserting the appointment");

            var newAppt = await _unitOfWork.AppointmentRepository.GetByIdWithBarberAndClient(appt.Id);
            await _appointmentService.OnAppointmentCreated(newAppt);

            return CreatedAtRoute("GetAppointment", new { id = newAppt.Id }, _mapper.Map<AppointmentDto>(newAppt));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteAsync(int id)
        {
            var appointment = await _unitOfWork.AppointmentRepository.GetByIdAsync(id);
            if (appointment == null) return BadRequest();

            _unitOfWork.AppointmentRepository.Remove(appointment);
            await _unitOfWork.Complete();

            return true;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> PutAsync(int id, AppointmentUpdateDto model)
        {
            var appointment = await _unitOfWork.AppointmentRepository.GetByIdAsync(id);
            if (appointment == null) return BadRequest();

            _mapper.Map(model, appointment);

            await _unitOfWork.Complete();

            return Ok(model);
        }


        [HttpPut("{id}/schedule")]
        public async Task<ActionResult> ScheduleAsync(int id)
        {
            var appointment = await _unitOfWork.AppointmentRepository.GetByIdWithBarberAndClient(id);
            if (appointment == null) return BadRequest();

            var scheduledStatus = await _unitOfWork.AppointmentStatusRepository.GetAsync(AppointmentStatuses.Scheduled);
            appointment.AppointmentStatusId = scheduledStatus.Id;

            await _unitOfWork.Complete();
            await _appointmentService.OnAppointmentSchedule(appointment);

            return Ok();
        }

        [HttpPut("{id}/complete")]
        public async Task<ActionResult> CompleteAsync(int id)
        {
            var appointment = await _unitOfWork.AppointmentRepository.GetByIdAsync(id);
            if (appointment == null) return BadRequest();

            var completedStatus = await _unitOfWork.AppointmentStatusRepository.GetAsync(AppointmentStatuses.Completed);
            appointment.AppointmentStatusId = completedStatus.Id;

            await _unitOfWork.Complete();

            return Ok();
        }

        [HttpPut("{id}/cancel")]
        public async Task<ActionResult> CancelAsync(int id, bool canceledByClient)
        {
            var appointment = await _unitOfWork.AppointmentRepository.GetByIdWithBarberAndClient(id);
            if (appointment == null) return BadRequest();

            var canceledStatus = await _unitOfWork.AppointmentStatusRepository.GetAsync(AppointmentStatuses.Canceled);
            var previousStatusId = appointment.AppointmentStatusId;
            appointment.AppointmentStatusId = canceledStatus.Id;

            await _unitOfWork.Complete();
            await _appointmentService.OnAppointmentCancel(appointment, canceledByClient, previousStatusId);

            return Ok();
        }
    }
}