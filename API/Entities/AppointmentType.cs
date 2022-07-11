using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class AppointmentType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public int Duration { get; set; }
        public ICollection<AppointmentTypeService> AppointmentTypeServices { get; set; }
    }
}