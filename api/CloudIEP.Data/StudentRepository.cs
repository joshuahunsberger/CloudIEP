using CloudIEP.Data.CosmosDB;
using CloudIEP.Data.Models;

namespace CloudIEP.Data
{
    public class StudentRepository : CosmosDbRepository<Student>, IRepository<Student>
    {
        public StudentRepository(ICosmosDbClientFactory factory) : base(factory) { }

        public override string CollectionName => "students";
    }
}
