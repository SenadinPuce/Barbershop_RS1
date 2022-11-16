using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class WorkingHoursDto
    {
        public int Id { get; set; }
        public string Day { get; set; }
        public int FromHours { get; set; }
        public int FromMinutes { get; set; }
        public int ToHours { get; set; }
        public int ToMinutes { get; set; }
        public bool IsOpen { get; set; }
    }
}