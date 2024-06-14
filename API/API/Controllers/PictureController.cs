using API.Context;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PictureController : ControllerBase
    {
        private readonly AppDbContext _pictureContext;
        private readonly IFileService _fileService;

        public PictureController(IFileService fs, AppDbContext context)
        {
            _fileService = fs;
            _pictureContext = context;
        }
        [HttpPost("addPicture")]
        public async Task<IActionResult> AddPic([FromForm] Picture picObj)
        {
            if (picObj == null)
                return BadRequest();
            if (picObj.ImageFile != null)
            {
                var fileResult = _fileService.SaveImage(picObj.ImageFile);
                if (fileResult.Item1 == 1)
                {
                    picObj.ImageName = fileResult.Item2;
                }
                //var productResult = _pictureContext.Add(picObj);
            }
            await _pictureContext.AddAsync(picObj);
            await _pictureContext.SaveChangesAsync();

            return Ok(new
            {
                Status = 200,
                Message = "Picture Added!"
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePicture(int id)
        {
            var picture = await _pictureContext.Pictures
            .Include(p => p.Likes)
            .FirstOrDefaultAsync(p => p.Id == id);

            if (picture == null)
            {
                return NotFound();
            }
            _pictureContext.LikesAndDislikes.RemoveRange(picture.Likes);

            if (_pictureContext.Pictures == null)
            {
                return NotFound();
            }
            var paymentDetail = await _pictureContext.Pictures.FindAsync(id);
            if (paymentDetail == null)
            {
                return NotFound();
            }
            _pictureContext.Pictures.Remove(paymentDetail);
            await _pictureContext.SaveChangesAsync();

            return Ok(await _pictureContext.Pictures.ToListAsync());
        }
        [HttpGet]
        public async Task<ActionResult<Picture>> GetAlbumPictures()
        {
            return Ok(_pictureContext.Pictures.ToList());
        }
    }
}
