using CloudIEP.Data.CosmosDB;
using CloudIEP.Data.Models;
using Microsoft.Azure.Documents;

namespace CloudIEP.Data;

public interface IGoalRepository : IRepository<Goal>
{
}

public class GoalRepository : CosmosDbRepository<Goal>, IGoalRepository
{
    public GoalRepository(ICosmosDbClientFactory factory) : base(factory) { }

    public override string CollectionName => "Goals";
    public override PartitionKey ResolvePartitionKey(string entityId) => new PartitionKey(entityId);
}
