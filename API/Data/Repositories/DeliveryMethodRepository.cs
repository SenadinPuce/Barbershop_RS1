using API.Entities.Order;
using API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class DeliveryMethodRepository : IDeliveryMethodRepository
    {
        private readonly DataContext _context;
        public DeliveryMethodRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<DeliveryMethod> GetDeliveryMethodByIdAsync(int id)
        {
            return await _context.DeliveryMethods.FindAsync(id);
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _context.DeliveryMethods.ToListAsync();
        }
    }
}