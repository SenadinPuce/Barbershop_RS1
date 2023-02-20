using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        
    }
}