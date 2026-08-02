using CloudIEP.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudIEP.Data;

public class CloudIEPDbContext : DbContext
{
    public CloudIEPDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToContainer("Users");
        modelBuilder.Entity<Goal>().ToContainer("Goals");
        modelBuilder.Entity<Student>().ToContainer("Students");
        base.OnModelCreating(modelBuilder);
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<Student> Students { get; set; }
}
