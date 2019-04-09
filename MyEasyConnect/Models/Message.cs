using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyEasyConnect.Models
{
    public class Message
    {
        public string User_id { get; set; }
        public string User_id_receiver { get; set; }
        public string Subject { get; set; }
        public DateTime SendAt { get; set; }
        public string Read { get; set; }
        public string Content { get; set; }
        public string Sender_name { get; set; }
    }
}