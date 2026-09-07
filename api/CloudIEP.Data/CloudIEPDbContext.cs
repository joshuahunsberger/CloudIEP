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
            builder.OwnsMany(u => u.Students);
        });
        modelBuilder.Entity<Goal>(builder =>
        {
            builder.ToContainer("Goals");
            builder.HasPartitionKey(g => g.Id);
            builder.HasKey(g => g.Id);
            builder.OwnsMany(g => g.Objectives);
            builder.OwnsMany(g => g.Observations);
        });
        modelBuilder.Entity<Student>(builder =>
        {
            builder.ToContainer("Students");
            builder.HasPartitionKey(s => s.Id);
            builder.HasKey(s => s.Id);
            builder.OwnsMany(s => s.Goals);
        });
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<Student> Students { get; set; }
}
