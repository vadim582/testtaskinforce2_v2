namespace API.Models.Dto
{
    public class LikeDto
    {
        public int PicId { get; set; }
        public bool IsLike { get; set; }
        public int UserId { get; set; }
    }
}
