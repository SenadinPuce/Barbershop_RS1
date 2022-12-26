using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class NotificationHub : Hub
    {
        private readonly IUnitOfWork _uow;
        private readonly PresenceTracker _tracker;
        public NotificationHub(IUnitOfWork uow, PresenceTracker tracker)
        {
            _tracker = tracker;
            _uow = uow;
        }

        public override async Task OnConnectedAsync()
        {
            await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);

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