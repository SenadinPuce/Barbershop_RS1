using API.Entities.Order;
using API.Interfaces;
using API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DataContext _context;
        public OrderRepository(DataContext context)
        {
            _context = context;
        }

        public void AddOrder(Order order)
        {
            _context.Add(order);
        }

        public void DeleteOrder(Order order)
        {
            _context.Remove(order);
        }

        public async Task<Order> GetOrderByIdAsync(int id, string userName)
        {
           return await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.DeliveryMethod)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserName == userName);
        }

        public async Task<Order> GetOrderByPaymentIntentIdAsync(string paymentIntentId)
        {
              return await _context.Orders
            .FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string userName)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.DeliveryMethod)
                .OrderByDescending(o => o.OrderDate)
                .Where(o => o.UserName == userName)
                .ToListAsync();
        }

        public void UpdateOrder(Order order)
        {
            _context.Orders.Attach(order);
            _context.Entry(order).State = EntityState.Modified;
        }
    }
}