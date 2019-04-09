using System.Collections.Generic;

namespace MyEasyConnect.Models
{
    public class FollowRS
    {
        public List<Follow> Follows { get; set; } 
        public List<Follow> Pending { get; set; } 

        public FollowRS()
        {
            Follows = new List<Follow>();
            Pending = new List<Follow>();
        }

    }
}