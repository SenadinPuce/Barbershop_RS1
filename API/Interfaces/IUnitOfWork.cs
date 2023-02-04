namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IMessageRepository MessageRepository {get;}
        IUserRepository UserRepository{get;}
        IProductRepository ProductRepository {get;}
        Task<bool> Complete();
        bool HasChanges();
    }
}