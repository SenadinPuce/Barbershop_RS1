using API.Data;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.SignalR
{
    public class NotificationHub : Hub
    {
        private readonly IUnitOfWork _uow;
        private readonly PresenceTracker _tracker;
        private readonly DataContext _db;
        private readonly UserManager<AppUser> _userManager;
        public NotificationHub(IUnitOfWork uow, PresenceTracker tracker, DataContext db, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _db = db;
            _tracker = tracker;
            _uow = uow;
        }

        public override async Task OnConnectedAsync()
        {
            await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);

            var user = await _userManager.GetUserAsync(Context.User);
            if (await _userManager.IsInRoleAsync(user, "Barber"))
            {
                var pendingStatus = await _db.AppointmentStatus.SingleAsync(x => x.Name == "Pending");
                int numberOfPendingAppointments = await _db.Appointment.Include(x => x.Barber)
                    .Where(appt => appt.Barber.AppUserId == user.Id
                        && appt.AppointmentStatusId == pendingStatus.Id).CountAsync();
                await Clients.Caller.SendAsync("PendingAppointments", numberOfPendingAppointments);
            }

            int numberOfUnreadMessages = await _uow.MessageRepository.GetNumberOfUnread(Context.User.GetUsername());
            await Clients.Caller.SendAsync("UnreadMessages", numberOfUnreadMessages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }

    }
}