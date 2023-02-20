using System.ComponentModel.DataAnnotations;

namespace API.Helpers
{
    public class AppointmentParams : BaseParams
    {
        [Required]
        public DateTime? DateFrom { get; set; }
        [Required]
        public DateTime? DateTo { get; set; }
        public string BarberIds { get; set; }
        public string StatusIds { get; set; }
        public int? ClientId { get; set; }
    }
}
