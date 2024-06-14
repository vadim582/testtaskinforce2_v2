using API.Controllers;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using API.Context;

namespace APITests.Tests
{
    public class AlbumControllerTests
    {
        private readonly Mock<AppDbContext> _mockDbContext;
        private readonly AlbumController _controller;

        public AlbumControllerTests()
        {
            _mockDbContext = new Mock<AppDbContext>();
            _controller = new AlbumController(_mockDbContext.Object);
        }

        [Fact]
        public async Task AddAlbum_ValidInput_ReturnsOkResult()
        {
            // Arrange
            var albumObj = new Album { Id = 1, AlbumName = "Test Album" };
            var expectedResult = new { Status = 200, Message = "Album Created!" };

            // Act
            var result = await _controller.AddAlbum(albumObj) as OkObjectResult;

            // Assert
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.IsNotNull(result);
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreEqual(expectedResult.Status, result.StatusCode);
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.Equals(expectedResult.Message, result.Value.ToString());
        }

        [Fact]
        public async Task DeleteAlbum_ValidId_ReturnsOkResult()
        {
            // Arrange
            var albumId = 1;
            var albums = new List<Album> { new Album { Id = albumId, AlbumName = "Test Album" } };
            var mockSet = new Mock<DbSet<Album>>().SetupData(albums);

            _mockDbContext.Setup(c => c.Albums).Returns(mockSet.Object);
            _mockDbContext.Setup(c => c.Albums.FindAsync(albumId)).ReturnsAsync(albums.FirstOrDefault(a => a.Id == albumId));

            // Act
            var result = await _controller.DeleteAlbum(albumId) as OkObjectResult;

            // Assert
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.IsNotNull(result);
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.Equals(200, result.StatusCode);
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.IsType<List<Album>>(result.Value);
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.DoesNotContain(albumId, (result.Value as List<Album>).Select(a => a.Id));
        }

        [Fact]
        public async Task GetUserAlbums_ReturnsOkResult()
        {
            // Arrange
            var albums = new List<Album> { new Album { Id = 1, AlbumName = "Test Album 1" }, new Album { Id = 2, AlbumName = "Test Album 2" } };
            var mockSet = new Mock<DbSet<Album>>().SetupData(albums);

            _mockDbContext.Setup(c => c.Albums).Returns(mockSet.Object);

            // Act
            var result = await _controller.GetUserAlbums() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.IsType<List<Album>>(result.Value);
            Assert.Equal(2, (result.Value as List<Album>).Count);
        }
    }
}