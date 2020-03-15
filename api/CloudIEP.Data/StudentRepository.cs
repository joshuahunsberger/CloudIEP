using CloudIEP.Data.CosmosDB;
using CloudIEP.Data.Models;

namespace CloudIEP.Data
{
    public interface IStudentRepository : IRepository<Student>
    {
    }

    public class StudentRepository : CosmosDbRepository<Student>, IStudentRepository
    {
        public StudentRepository(ICosmosDbClientFactory factory) : base(factory) { }

        public override string CollectionName => "students";
    }
}
