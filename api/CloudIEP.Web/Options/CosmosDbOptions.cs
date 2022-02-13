using System;
using System.Collections.Generic;

namespace CloudIEP.Web.Options;

public class CosmosDbOptions
{
    public string DatabaseName { get; set; }
    public Uri Endpoint { get; set; }
    public string Key { get; set; }
    public List<CollectionInfo> Collections { get; set; }
}

public class CollectionInfo
{
    public string Name { get; set; }
    public string PartitionKey { get; set; }
}
