using System.Collections.Generic;

namespace CloudIEP.Data.Models;

public class User : Entity
{
    public string Auth0Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<StudentPreview> Students { get; set; } = new List<StudentPreview>();
}

public class StudentPreview
{
    public string Id { get; set; }
    public string FullName { get; set; }
}
