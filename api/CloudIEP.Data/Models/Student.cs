using System;

namespace CloudIEP.Data.Models
{
    public class Student : Entity
    {
        private DateTime dateOfBirth;

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get => dateOfBirth; set => dateOfBirth = DateTime.SpecifyKind(value.Date, DateTimeKind.Unspecified); }
    }
}
