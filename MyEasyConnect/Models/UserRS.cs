using System.Collections.Generic;

namespace MyEasyConnect.Models
{
    public class UserRS
    {
        public List<User> Users { get; set; }

        public UserRS()
        {
            Users = new List<User>();
        }
    }
}