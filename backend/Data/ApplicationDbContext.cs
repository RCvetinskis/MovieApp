using FavoriteMovieAppBackEnd.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FavoriteMovieAppBackEnd.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }


        public DbSet<ProfileImage> ProfileImage { get; set; }
        public DbSet<Favorites> Favorites { get; set; }
        public DbSet<Watchlist> Watchlist { get; set; }
        public DbSet<MediaItem> MediaItem { get; set; }
        public DbSet<Likes> Likes { get; set; }
        public DbSet<Dislikes> Dislikes { get; set; }
        public DbSet<Comment> Comment { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // One-to-many: User => Comments
            builder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Self-referencing one-to-many: Comment => Replies
            builder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Likes Relationship
            builder.Entity<Likes>()
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Likes>()
                .HasOne(l => l.Comment)
                .WithMany(c => c.Likes)
                .HasForeignKey(l => l.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Dislikes Relationship
            builder.Entity<Dislikes>()
                .HasOne(d => d.User)
                .WithMany(u => u.Dislikes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Dislikes>()
                .HasOne(d => d.Comment)
                .WithMany(c => c.Dislikes)
                .HasForeignKey(d => d.CommentId)
                .OnDelete(DeleteBehavior.Cascade);



            // Favorites relationship
            builder.Entity<Favorites>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Watchlist relationship
            builder.Entity<Watchlist>()
                .HasOne(w => w.User)
                .WithMany(u => u.Watchlist)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // MediaItem => Watchlist
            builder.Entity<MediaItem>()
                .HasOne(m => m.Watchlist)
                .WithMany(w => w.MediaItems)
                .HasForeignKey(m => m.WatchlistId)
                .OnDelete(DeleteBehavior.Cascade);

            // MediaItem => Favorites
            builder.Entity<Favorites>()
           .HasOne(f => f.MediaItem)
           .WithOne(m => m.Favorite)
           .HasForeignKey<Favorites>(f => f.MediaItemId)
           .OnDelete(DeleteBehavior.Cascade);

            // User => ProfileImage
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.ProfileImage)
                .WithOne(p => p.User)
                .HasForeignKey<ProfileImage>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);


        }


    }
}
