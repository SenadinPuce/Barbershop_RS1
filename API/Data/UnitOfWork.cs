using API.Data.Repositories;
using API.Interfaces;
using API.Interfaces.Repositories;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper);

        public IUserRepository UserRepository =>  new UserRepository(_context);

        public IProductRepository ProductRepository => new ProductRepository(_context, _mapper);

        public IDeliveryMethodRepository DeliveryMethodRepository => new DeliveryMethodRepository(_context);

        public IOrderRepository OrderRepository => new OrderRepository(_context);
        public IAppointmentRepository AppointmentRepository => new AppointmentRepository(_context, _mapper);
        public IAppointmentStatusRepository AppointmentStatusRepository => new AppointmentStatusRepository(_context);

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public bool HasChanges()
        {
           return _context.ChangeTracker.HasChanges();
        }
    }
}