using API.Entities.Order;

namespace API.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string userName, int delieveryMethod, string basketId, Address shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string userName);
        Task<Order> GetOrderByIdAsync(int id, string userName);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
    }
}