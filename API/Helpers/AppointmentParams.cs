namespace API.Helpers
{
    public class AppointmentParams : BaseParams
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string BarberIds { get; set; }
        public string StatusIds { get; set; }
        public int? ClientId { get; set; }
    }
}
