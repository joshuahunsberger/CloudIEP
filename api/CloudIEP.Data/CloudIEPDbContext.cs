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
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(builder =>
        {
            builder.ToContainer("Users");
            builder.HasPartitionKey(u => u.Id);
            builder.HasKey(u => u.Id);
        });
        modelBuilder.Entity<Goal>(builder =>
        {
            builder.ToContainer("Goals");
            builder.HasPartitionKey(g => g.Id);
            builder.HasKey(g => g.Id);
        });
        modelBuilder.Entity<Student>(builder =>
        {
            builder.ToContainer("Students");
            builder.HasPartitionKey(s => s.Id);
            builder.HasKey(s => s.Id);
        });
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<Student> Students { get; set; }
}
