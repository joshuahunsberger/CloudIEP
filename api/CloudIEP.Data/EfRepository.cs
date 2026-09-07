using System;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudIEP.Data;

public abstract class EfRepository<T> : IRepository<T> where T : Entity
{
    protected readonly CloudIEPDbContext Context;
    protected readonly DbSet<T> DbSet;

    protected EfRepository(CloudIEPDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    public virtual async Task<T[]> GetAllAsync()
    {
        return await DbSet.ToArrayAsync();
    }

    public virtual async Task<T> GetByIdAsync(string id)
    {
        var entity = await DbSet.FindAsync(id);
        if (entity == null)
        {
            throw new EntityNotFoundException();
        }
        return entity;
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        if (string.IsNullOrWhiteSpace(entity.Id))
        {
            entity.Id = GenerateId(entity);
        }

        DbSet.Add(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task UpdateAsync(T entity)
    {
        var existing = await DbSet.FindAsync(entity.Id);
        if (existing == null)
        {
            throw new EntityNotFoundException();
        }

        Context.Entry(existing).CurrentValues.SetValues(entity);
        await Context.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(T entity)
    {
        var existing = await DbSet.FindAsync(entity.Id);
        if (existing == null)
        {
            throw new EntityNotFoundException();
        }

        DbSet.Remove(existing);
        await Context.SaveChangesAsync();
    }

    protected virtual string GenerateId(T entity) => Guid.NewGuid().ToString();
}
