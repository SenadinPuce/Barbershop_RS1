using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}