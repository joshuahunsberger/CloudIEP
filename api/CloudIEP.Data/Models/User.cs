using System;
namespace CloudIEP.Data.Models
{
    public class User : Entity
    {
        public string Auth0Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
