using System;

namespace CloudIEP.Data.Exceptions;

// Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
//
// GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/blob/master/TodoService.Core/Exceptions/EntityNotFoundException.cs

public class EntityNotFoundException : Exception
{
    public EntityNotFoundException() { }

    public EntityNotFoundException(string message) : base(message) { }
}
