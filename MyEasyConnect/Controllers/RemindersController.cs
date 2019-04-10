using MyEasyConnect.Models;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web.Http;

namespace MyEasyConnect.Controllers
{
    [RoutePrefix("api/reminder")]
    public class RemindersController : ApiController
    {
        
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["myConnectionString"].ConnectionString;

        [HttpPost, Route("all")]
        public ReminderRS GetUserReminders(UserRQ req)
        {
            ReminderRS data = new ReminderRS();

            using (OracleConnection conn = new OracleConnection(this.connectionString))
            {
                conn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = conn;

                    StringBuilder sql = new StringBuilder();
                    sql.Append("SELECT R.ID, R.USER_ID, R.REMINDER_DATE, R.TITLE, R.DESCRIPTION, R.DONE, R.SUBTITLE ");
                    sql.Append("  FROM REMINDER R ");
                    sql.Append(" WHERE R.USER_ID = :VAR");

                    cmd.CommandText = sql.ToString();
                    cmd.BindByName = true;
                    cmd.CommandType = CommandType.Text;

                    cmd.Parameters.Add("VAR", OracleDbType.Decimal, req.Id, ParameterDirection.Input);


                    using (OracleDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            Reminder reminder = new Reminder
                            {
                                Id = dr["ID"].ToString(),
                                User_id = dr["USER_ID"].ToString(),
                                Date = Convert.ToDateTime(dr["REMINDER_DATE"]),
                                Title = dr["TITLE"].ToString(),
                                Description = dr["DESCRIPTION"].ToString(),
                                Done = dr["DONE"].ToString(),
                                Subtitle = dr["SUBTITLE"].ToString()
                            };
                            data.Reminders.Add(reminder);
                        }
                    }

                }
            }

            return data;
        }
    }
}
