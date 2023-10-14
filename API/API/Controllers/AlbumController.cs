using API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Text;
using API.Context;
using Microsoft.EntityFrameworkCore;
using API.Helpers;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using API.Models.Dto;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly AppDbContext _albumContext;

        public AlbumController(AppDbContext context)
        {
            _albumContext = context;
        }
        [HttpPost("addAlbum")]
        public async Task<IActionResult> AddAlbum([FromBody] Album albumObj)
        {
            if (albumObj == null)
                return BadRequest();
            
            await _albumContext.AddAsync(albumObj);
            await _albumContext.SaveChangesAsync();

            return Ok(new
            {
                Status = 200,
                Message = "Album Created!"
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlbum(int id)
        {
            if (_albumContext.Albums == null)
            {
                return NotFound();
            }
            var paymentDetail = await _albumContext.Albums.FindAsync(id);
            if (paymentDetail == null)
            {
                return NotFound();
            }
            _albumContext.Albums.Remove(paymentDetail);
            await _albumContext.SaveChangesAsync();

            return Ok(await _albumContext.Albums.ToListAsync());
        }
        [HttpGet]
        public async Task<ActionResult<Album>> GetUserAlbums()
        {
            return Ok(await _albumContext.Albums.ToListAsync());
        }
    }
}
