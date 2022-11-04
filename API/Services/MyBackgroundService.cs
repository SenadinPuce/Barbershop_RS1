using API.Data;
using API.Extensions;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace API.Services
{
    public class MyBackgroundService : BackgroundService
    {
        private readonly ILogger<MyBackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public MyBackgroundService(ILogger<MyBackgroundService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    _logger.LogInformation("Background process has started...");

                    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();

                    var dateTime = DateTime.Now.ToUniversalTime();
                    dateTime = dateTime.AddHours(1).AddSeconds(-dateTime.Second).AddMilliseconds(-dateTime.Millisecond);

                    var appointmentsInHour = dbContext.Appointment.Include(x => x.Client.AppUser).Include(x => x.Barber.AppUser)
                    .Where(x => x.StartsAt.Year == dateTime.Year && x.StartsAt.Month == dateTime.Month &&
                        x.StartsAt.Day == dateTime.Day && x.StartsAt.Minute == dateTime.Minute);

                    if (appointmentsInHour.Any())
                    {
                        var appointmentService = scope.ServiceProvider.GetRequiredService<IAppointmentService>();

                        foreach (var appt in appointmentsInHour)
                        {
                            await appointmentService.SendAppointmentOneHourDueEmail(appt);
                        }

                        _logger.LogInformation($"Appointments in one hour: {appointmentsInHour}");
                    }

                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
            }
        }
    }
}
