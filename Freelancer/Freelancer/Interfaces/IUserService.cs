using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserSearchResultDto>> SearchUsersAsync(string query, int currentUserId);
    }
}
