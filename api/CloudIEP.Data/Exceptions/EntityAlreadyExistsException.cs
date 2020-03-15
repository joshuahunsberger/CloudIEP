using System;

namespace CloudIEP.Data.Exceptions
{
    // Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
    //
    // GitHub:
    // https://github.com/Azure-Samples/PartitionedRepository/blob/master/TodoService.Core/Exceptions/EntityAlreadyExistsException.cs

    public class EntityAlreadyExistsException : Exception
    {
        public EntityAlreadyExistsException() { }

        public EntityAlreadyExistsException(string message) : base(message) { }
    }
}
