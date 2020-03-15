namespace CloudIEP.Data.Models
{
    // Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
    //
    // GitHub:
    // https://github.com/Azure-Samples/PartitionedRepository/blob/master/TodoService.Core/Models/Entity.cs
    public abstract class Entity
    {
        public string Id { get; set; }
    }
}
