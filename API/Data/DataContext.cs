using System.Reflection;
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
        public DataContext(DbContextOptions options) : base(options)
        {
        }

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
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Email> Email { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

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

            builder.Entity<AppointmentTypeService>()
                .HasKey(apptTypeService => new { apptTypeService.AppointmentTypeId, apptTypeService.ServiceId });

            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

        }

    }
}