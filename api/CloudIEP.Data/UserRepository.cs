using CloudIEP.Data.CosmosDB;
using Microsoft.Azure.Documents;

namespace CloudIEP.Data;

public interface IUserRepository : IRepository<Models.User>
{
}

public class UserRepository : CosmosDbRepository<Models.User>, IUserRepository
{
    public UserRepository(ICosmosDbClientFactory factory) : base(factory) { }

    public override string CollectionName => "Users";
    public override string GenerateId(Models.User entity) => entity.Auth0Id;
    public override PartitionKey ResolvePartitionKey(string entityId) => new PartitionKey(entityId);
}
