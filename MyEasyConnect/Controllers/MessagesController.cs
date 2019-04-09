using MyEasyConnect.Models;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web.Http;

namespace MyEasyConnect.Controllers
{
    [RoutePrefix("api/message")]
    public class MessagesController : ApiController
    {

        private readonly string connectionString = ConfigurationManager.ConnectionStrings["myConnectionString"].ConnectionString;

        [HttpPost, Route("all")]
        public MessageRS GetUserMessages(UserRQ req)
        {
            MessageRS data = new MessageRS();

            using (OracleConnection conn = new OracleConnection(this.connectionString))
            {
                conn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = conn;

                    StringBuilder sql = new StringBuilder();
                    sql.Append("SELECT M.USER_ID_SENDER, ");
                    sql.Append("       M.USER_ID_RECEIVER, ");
                    sql.Append("       M.SUBJECT, ");
                    sql.Append("       M.SEND_AT, ");
                    sql.Append("       M.READ, ");
                    sql.Append("       M.CONTENT, ");
                    sql.Append("       U.NAME ");
                    sql.Append("  FROM MESSAGE M INNER JOIN APP_USER U ON U.ID = M.USER_ID_SENDER ");
                    sql.Append(" WHERE M.USER_ID_RECEIVER = :VAR ");


                    cmd.CommandText = sql.ToString();
                    cmd.BindByName = true;
                    cmd.CommandType = CommandType.Text;

                    cmd.Parameters.Add("VAR", OracleDbType.Decimal, req.Id, ParameterDirection.Input);


                    using (OracleDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            Message message = new Message
                            {
                                User_id = dr["USER_ID_SENDER"].ToString(),
                                User_id_receiver = dr["USER_ID_RECEIVER"].ToString(),
                                Subject = dr["SUBJECT"].ToString(),
                                SendAt = Convert.ToDateTime(dr["SEND_AT"]),
                                Read = dr["READ"].ToString(),
                                Content = dr["CONTENT"].ToString(),
                                Sender_name = dr["NAME"].ToString()
                            };
                            data.Messages.Add(message);
                        }
                    }

                }
            }

            return data;
        }
    }
}
