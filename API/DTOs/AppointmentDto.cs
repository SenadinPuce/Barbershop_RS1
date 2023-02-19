using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public int Duration { get; set; }
        public string Note { get; set; }
        public bool CreatedByClient { get; set; }

        public int? ClientId { get; set; }
        public ClientDto Client { get; set; }
        public int BarberId { get; set; }
        public BarberDto Barber { get; set; }
        public int AppointmentTypeId { get; set; }
        public AppointmentTypeDto AppointmentType { get; set; }
        public int AppointmentStatusId { get; set; }
        public AppointmentStatusDto AppointmentStatus { get; set; }
    }

    public class AppointmentUpdateDto
    {
        [Required]
        public DateTime? StartsAt { get; set; }
        [Required]
        public DateTime? EndsAt { get; set; }
        [Required]
        public int? Duration { get; set; }
        public string Note { get; set; }

        public int? ClientId { get; set; }
        [Required]
        public int? BarberId { get; set; }
        [Required]
        public int? AppointmentTypeId { get; set; }
        [Required]
        public int? AppointmentStatusId { get; set; }
    }
}