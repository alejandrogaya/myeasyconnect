using MyEasyConnect.Models;
using Oracle.ManagedDataAccess.Client;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web.Http;

namespace MyEasyConnect.Controllers
{
    [RoutePrefix("api")]
    public class UsersController : ApiController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["myConnectionString"].ConnectionString;

        [HttpPost, Route("user/name")]
        public UserRS GetUserName(UserRQ req)
        {
            UserRS data = new UserRS();

            using (OracleConnection conn = new OracleConnection(this.connectionString))
            {
                conn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = conn;

                    StringBuilder sql = new StringBuilder();
                    sql.Append("SELECT NAME user_name ");
                    sql.Append("  FROM APP_USER ");
                    sql.Append(" WHERE ID = :VAR ");

                    cmd.CommandText = sql.ToString();
                    cmd.BindByName = true;
                    cmd.CommandType = CommandType.Text;

                    cmd.Parameters.Add("VAR", OracleDbType.Decimal, req.Id, ParameterDirection.Input);


                    using (OracleDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            User user = new User
                            {
                                Name = dr["user_name"].ToString()
                            };
                            data.Users.Add(user);
                            
                        }
                    }
                }
            }


            return data;
        }

        [HttpPost, Route("user/login")]
        public UserRS GetUserAndNotificationsCount(UserRQ req)
        {
            UserRS data = new UserRS();

            using (OracleConnection conn = new OracleConnection(this.connectionString))
            {
                conn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = conn;

                    StringBuilder sql = new StringBuilder();
                    sql.Append("SELECT U.NAME                                    user_name, ");
                    sql.Append("       U.EMAIL                                   email, ");
                    sql.Append("       U.EMPLOYMENT                              employment, ");
                    sql.Append("       U.POINTS                                  points, ");
                    sql.Append("       U.ID                                      user_id, ");
                    sql.Append("       (SELECT COUNT (*)     notifications ");
                    sql.Append("          FROM (SELECT U.ID USER_ID, R.DONE STATUS ");
                    sql.Append("                  FROM APP_USER U INNER JOIN REMINDER R ON U.ID = R.USER_ID ");
                    sql.Append("                UNION ALL ");
                    sql.Append("                SELECT U.ID USER_ID, R.READ STATUS ");
                    sql.Append("                  FROM APP_USER U INNER JOIN MESSAGE R ON U.ID = R.USER_ID_RECEIVER ");
                    sql.Append("                UNION ALL ");
                    sql.Append("                SELECT U.ID USER_ID, R.ACCEPTED STATUS ");
                    sql.Append("                  FROM APP_USER U INNER JOIN FOLLOW R ON U.ID = R.USER_ID_FOLLOWED) ");
                    sql.Append("         WHERE USER_ID = :VAR AND STATUS = 0)    notifications ");
                    sql.Append("  FROM APP_USER U ");
                    sql.Append(" WHERE U.ID = :VAR ");

                    cmd.CommandText = sql.ToString();
                    cmd.BindByName = true;
                    cmd.CommandType = CommandType.Text;

                    cmd.Parameters.Add("VAR", OracleDbType.Decimal, req.Id, ParameterDirection.Input);


                    using (OracleDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            User user = new User
                            {
                                Id = dr["user_id"].ToString(),
                                Email = dr["email"].ToString(),
                                Employment = dr["employment"].ToString(),
                                Name = dr["user_name"].ToString(),
                                Points = dr["points"].ToString(),
                                Notifications = dr["notifications"].ToString()
                            };
                            data.Users.Add(user);
                        }
                    }

                }
            }

            return data;
        }

        [HttpPost, Route("user/search")]
        public UserRS GetUserByName(UserRQ req)
        {
            UserRS data = new UserRS();

            using (OracleConnection conn = new OracleConnection(this.connectionString))
            {
                conn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = conn;

                    StringBuilder sql = new StringBuilder();
                    sql.Append("SELECT user_id, user_name ");
                    sql.Append("  FROM (SELECT U.ID AS user_id, U.NAME AS user_name ");
                    sql.Append("          FROM APP_USER U ");
                    sql.Append("         WHERE REGEXP_LIKE (U.NAME, :VAR, 'i')) ");
                    sql.Append(" WHERE ROWNUM < 6 ");

                    cmd.CommandText = sql.ToString();
                    cmd.BindByName = true;
                    cmd.CommandType = CommandType.Text;

                    cmd.Parameters.Add("VAR", OracleDbType.Varchar2, req.Name, ParameterDirection.Input);

                    using (OracleDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            User user = new User
                            {
                                Id = dr["user_id"].ToString(),
                                Name = dr["user_name"].ToString()
                            };
                            data.Users.Add(user);
                        }
                    }

                }
            }
            
            return data;
        }
    }
}
