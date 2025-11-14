using Freelancer.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface ISeekerService
    {
        Task<IEnumerable<SeekerSearchResultDto>> SearchSeekersAsync(SeekerSearchQueryDto query);
       
    }
}