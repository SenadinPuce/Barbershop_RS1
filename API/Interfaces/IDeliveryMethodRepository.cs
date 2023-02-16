using API.Entities.Order;

namespace API.Interfaces
{
    public interface IDeliveryMethodRepository
    {
        Task<DeliveryMethod> GetDeliveryMethodByIdAsync(int id);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
    }
}