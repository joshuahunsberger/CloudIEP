using System;
using System.Collections.Generic;

namespace CloudIEP.Data.Models
{
    public class Goal : Entity
    {
        public string GoalName { get; set; }
        public string GoalDescription { get; set; }
        public string Category { get; set; }
        public DateTime BeginDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<Objective> Objectives { get; set; } = new List<Objective>();
        public string StudentId { get; set; }
    }

    public class Objective
    {
        public string ObjectiveName { get; set; }
        public bool Complete { get; set; }
    }
}
