using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyEasyConnect.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Employment { get; set; }
        public string Points { get; set; }
        //public string password { get; set; }
        public string Email { get; set; }
        public string Notifications { get; set; }
    }
}