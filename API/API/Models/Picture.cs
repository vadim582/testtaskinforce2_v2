using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Picture
    {  
        public int Id { get; set; }
        public string? AlbumName { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageName { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }

    }
}
