using Microsoft.Extensions.Hosting;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class LikesAndDislikes
    {  
        public int Id { get; set; }
        public int PictureId { get; set; }
        public bool IsLike { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public Picture Picture { get; set; }

    }
}
