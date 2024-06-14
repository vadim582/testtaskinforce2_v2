using API.Context;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Services;
using API.Models.Dto;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly AppDbContext _likesContext;

        public LikesController(AppDbContext context)
        {
            _likesContext = context;
        }
        [HttpPost("like")]
        public async Task<IActionResult> Like([FromBody] LikeDto Likes)
        {
            var existingLike = await _likesContext.LikesAndDislikes.FirstOrDefaultAsync(l => l.UserId == Likes.UserId && l.PictureId == Likes.PicId);

            if (existingLike != null)
            {
                existingLike.IsLike = Likes.IsLike;
            }
            else
            {
                var like = new LikesAndDislikes
                {
                    PictureId = Likes.PicId,
                    IsLike = Likes.IsLike,
                    UserId = Likes.UserId
                };
                _likesContext.LikesAndDislikes.Add(like);
            }

            await _likesContext.SaveChangesAsync();
            return Ok();
        }
        [HttpGet("likes-count/{picId}")]
        public async Task<IActionResult> GetLikesCount(int picId)
        {
            var likesCount = await _likesContext.LikesAndDislikes.CountAsync(l => l.PictureId == picId && l.IsLike);
            var dislikesCount = await _likesContext.LikesAndDislikes.CountAsync(l => l.PictureId == picId && !l.IsLike);

            return Ok(new { LikesCount = likesCount, DislikesCount = dislikesCount });
        }
        [HttpGet]
        public async Task<ActionResult<Picture>> GetLikes()
        {
            return Ok(_likesContext.LikesAndDislikes.ToList());
        }
    }
}
