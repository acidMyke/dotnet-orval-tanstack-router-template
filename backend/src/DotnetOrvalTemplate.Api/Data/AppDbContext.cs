using DotnetOrvalTemplate.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DotnetOrvalTemplate.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.Username)
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}
