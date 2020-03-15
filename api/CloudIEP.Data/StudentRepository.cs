using CloudIEP.Data.CosmosDB;
using CloudIEP.Data.Models;
using Microsoft.Azure.Documents;

namespace CloudIEP.Data
{
    public interface IStudentRepository : IRepository<Student>
    {
    }

    public class StudentRepository : CosmosDbRepository<Student>, IStudentRepository
    {
        public StudentRepository(ICosmosDbClientFactory factory) : base(factory) { }

        public override string CollectionName => "Students";
        public override PartitionKey ResolvePartitionKey(string entityId) => new PartitionKey(entityId);
    }
}
