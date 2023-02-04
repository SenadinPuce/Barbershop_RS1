using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task ClearConnections(DataContext context)
        {
            context.Connections.RemoveRange(context.Connections);
            await context.SaveChangesAsync();
        }
        public static async Task SeedUsers(DataContext db, UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userPhotosData = await System.IO.File.ReadAllTextAsync("Data/Seed/UserPhotos.json");
            var photos = JsonSerializer.Deserialize<List<Photo>>(userPhotosData);

            db.AddRange(photos);
            await db.SaveChangesAsync();

            var userData = await System.IO.File.ReadAllTextAsync("Data/Seed/Users.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Client"},
                new AppRole{Name = "Barber"},
                new AppRole{Name = "Admin"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            var i = 0;
            foreach (var user in users)
            {
                i++;
                await userManager.CreateAsync(user, "Barber0!");
                user.Address = new Address
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Street = "Street" + i,
                    City = "City" + i,
                    ZipCode = "000" + i,
                    Country = "Country" + i,
                };
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Barber0!");
            await userManager.AddToRolesAsync(admin, new[] { "Admin" });
        }
        public static async Task SeedEntities(DataContext db, UserManager<AppUser> userManager)
        {
            if (!await db.Service.AnyAsync())
            {
                var serviceData = await System.IO.File.ReadAllTextAsync("Data/Seed/Services.json");
                var services = JsonSerializer.Deserialize<List<Service>>(serviceData);
                if (services == null) return;

                await db.AddRangeAsync(services);
            }

            if (!await db.AppointmentType.AnyAsync())
            {
                var serviceData = await System.IO.File.ReadAllTextAsync("Data/Seed/AppointmentTypes.json");
                var services = JsonSerializer.Deserialize<List<AppointmentType>>(serviceData);
                if (services == null) return;

                await db.AddRangeAsync(services);
            }

            if (!await db.AppointmentStatus.AnyAsync())
            {
                var apptStatusData = await System.IO.File.ReadAllTextAsync("Data/Seed/AppointmentStatuses.json");
                var apptStatuses = JsonSerializer.Deserialize<List<AppointmentStatus>>(apptStatusData);
                if (apptStatuses == null) return;

                await db.AddRangeAsync(apptStatuses);
            }

            if (!await db.WorkingHours.AnyAsync())
            {
                var workingHoursData = await System.IO.File.ReadAllTextAsync("Data/Seed/WorkingHours.json");
                var workingHours = JsonSerializer.Deserialize<List<WorkingHours>>(workingHoursData);
                if (workingHours == null) return;

                await db.AddRangeAsync(workingHours);
            }
            await db.SaveChangesAsync();

            if (!await db.AppointmentTypeService.AnyAsync())
            {
                var appointmentTypeServices = new List<AppointmentTypeService>()
                {
                    new AppointmentTypeService
                    {
                        AppointmentTypeId = 1,
                        ServiceId = 1
                    },
                    new AppointmentTypeService
                    {
                        AppointmentTypeId = 1,
                        ServiceId = 3
                    },
                    new AppointmentTypeService
                    {
                        AppointmentTypeId = 2,
                        ServiceId = 2
                    },
                    new AppointmentTypeService
                    {
                        AppointmentTypeId = 2,
                        ServiceId= 4
                    },
                    new AppointmentTypeService
                    {
                        AppointmentTypeId = 2,
                        ServiceId = 5
                    }
                };
                await db.AddRangeAsync(appointmentTypeServices);
                await db.SaveChangesAsync();
            }
            if (!await db.Barber.AnyAsync())
            {
                var barbers = new List<Barber>()
                {
                    new Barber
                    {
                        AppUserId = 11
                    },
                    new Barber
                    {
                        AppUserId = 12
                    }
                };
                await db.AddRangeAsync(barbers);
                foreach (var barber in barbers)
                {
                    var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == barber.AppUserId);
                    await userManager.AddToRoleAsync(user, "Barber");
                }
                await db.SaveChangesAsync();
            }
            if (!await db.Client.AnyAsync())
            {
                var clients = new List<Client>()
                {
                    new Client
                    {
                        AppUserId = 1
                    },
                    new Client
                    {
                        AppUserId = 2
                    },
                    new Client
                    {
                        AppUserId = 3
                    },
                    new Client
                    {
                        AppUserId = 4
                    },
                    new Client
                    {
                        AppUserId = 5
                    },
                    new Client
                    {
                        AppUserId = 6
                    },
                    new Client
                    {
                        AppUserId = 7
                    },
                    new Client
                    {
                        AppUserId = 8
                    },
                    new Client
                    {
                        AppUserId = 9
                    },
                    new Client
                    {
                        AppUserId = 10
                    },
                };
                await db.AddRangeAsync(clients);

                foreach (var client in clients)
                {
                    var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == client.AppUserId);
                    await userManager.AddToRoleAsync(user, "Client");
                }
                await db.SaveChangesAsync();
            }

        }

        public static async Task SeedProducts(DataContext context)
        {

            if (!context.ProductBrands.Any())
            {
                var brandsData = File.ReadAllText("Data/Seed/Brands.json");

                var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);

                foreach (var item in brands)
                {
                    context.ProductBrands.Add(item);
                }

                await context.SaveChangesAsync();
            }

            if (!context.ProductTypes.Any())
            {
                var typesData = File.ReadAllText("Data/Seed/Types.json");

                var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);

                foreach (var item in types)
                {
                    context.ProductTypes.Add(item);
                }

                await context.SaveChangesAsync();
            }

            if (!context.Products.Any())
            {
                var productsData = File.ReadAllText("Data/Seed/Products.json");

                var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                foreach (var item in products)
                {
                    context.Products.Add(item);
                }

                await context.SaveChangesAsync();
            }

        }

    }
}