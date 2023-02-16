namespace API.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IMessageRepository MessageRepository {get;}
        IUserRepository UserRepository{get;}
        IProductRepository ProductRepository {get;}
        IDeliveryMethodRepository DeliveryMethodRepository {get;}
        IOrderRepository OrderRepository {get;}
        Task<int> Complete();
        bool HasChanges();
    }
}