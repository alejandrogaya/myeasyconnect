using System.Collections.Generic;

namespace MyEasyConnect.Models
{
    public class MessageRS
    {
        public List<Message> Messages { get; set; }

        public MessageRS()
        {
            Messages = new List<Message>();
        }
    }
}