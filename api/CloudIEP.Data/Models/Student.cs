using System;
using System.Collections.Generic;

namespace CloudIEP.Data.Models
{
    public class Student : Entity
    {
        private DateTime dateOfBirth;

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get => dateOfBirth; set => dateOfBirth = DateTime.SpecifyKind(value.Date, DateTimeKind.Unspecified); }
        public string TeacherId { get; set; }
        public List<GoalPreview> Goals { get; set; } = new List<GoalPreview>();
    }

    public class GoalPreview
    {
        public string GoalId { get; set; }
        public string GoalName { get; set; }
    }
}
