using API.Entities.Order;

namespace API.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderByIdAsync(int id, string userName);
        Task<IReadOnlyList<Order>>  GetOrdersForUserAsync(string userName);
        Task<Order> GetOrderByPaymentIntentIdAsync(string paymentIntentId);
        void AddOrder(Order order);
        void UpdateOrder(Order order);
        void DeleteOrder(Order order);
    }
}