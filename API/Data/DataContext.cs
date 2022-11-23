using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DbSet<AppointmentType> AppointmentType { get; set; }
        public DbSet<AppointmentTypeService> AppointmentTypeService { get; set; }
        public DbSet<BarberService> BarberService { get; set; }
        public DbSet<Service> Service { get; set; }
        public DbSet<Appointment> Appointment { get; set; }
        public DbSet<AppointmentStatus> AppointmentStatus { get; set; }
        public DbSet<Barber> Barber { get; set; }
        public DbSet<Client> Client { get; set; }
        public DbSet<Photo> Photo { get; set; }
        public DbSet<WorkingHours> WorkingHours { get; set; }
        public DbSet<CustomHours> CustomHours { get; set; }
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.Entity<BarberService>()
                .HasOne(bs => bs.Barber)
                .WithMany(b => b.BarberServices)
                .HasForeignKey(bs => bs.BarberId)
                .IsRequired();

            builder.Entity<BarberService>()
               .HasOne(bs => bs.Service)
                .WithMany(b => b.BarberServices)
                .HasForeignKey(bs => bs.ServiceId)
                .IsRequired();

            builder.Entity<AppointmentTypeService>().HasKey(apptTypeService => new { apptTypeService.AppointmentTypeId, apptTypeService.ServiceId });

        }

    }
}