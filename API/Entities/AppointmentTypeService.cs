namespace API.Entities
{
    public class AppointmentTypeService
    {
        public int AppointmentTypeId { get; set; }
        public AppointmentType AppointmentType { get; set; }

        public int ServiceId { get; set; }
        public Service Service { get; set; }

    }
}