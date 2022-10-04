using System;

namespace API.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public int Duration { get; set; }
        public string Note { get; set; }

        public int? ClientId { get; set; }
        public Client Client { get; set; }
        public int BarberId { get; set; }
        public Barber Barber { get; set; }
        public int AppointmentTypeId { get; set; }
        public AppointmentType AppointmentType { get; set; }
        public int AppointmentStatusId { get; set; }
        public AppointmentStatus AppointmentStatus { get; set; }
    }
}