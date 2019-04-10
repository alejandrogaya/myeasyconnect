using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyEasyConnect.Models
{
    public class Reminder
    {
        public string Id { get; set; }
        public string User_id { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Done { get; set; }
        public string Subtitle { get; set; }
    }
}