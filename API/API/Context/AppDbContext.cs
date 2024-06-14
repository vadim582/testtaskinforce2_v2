using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Picture> Pictures { get; set; }
        public DbSet<LikesAndDislikes> LikesAndDislikes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().ToTable("users");
            builder.Entity<Album>().ToTable("albums");
            builder.Entity<Picture>().ToTable("pictures");
            builder.Entity<LikesAndDislikes>().ToTable("likes");

            builder.Entity<LikesAndDislikes>()
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<LikesAndDislikes>()
                .HasOne(l => l.Picture)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PictureId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<LikesAndDislikes>()
                .HasIndex(l => new { l.UserId, l.PictureId })
                .IsUnique();
        }
    }
}
