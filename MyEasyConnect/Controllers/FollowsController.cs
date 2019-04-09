using MyEasyConnect.Models;
using Oracle.ManagedDataAccess.Client;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web.Http;

namespace MyEasyConnect.Controllers
{
    [RoutePrefix("api/follow")]
    public class FollowsController : ApiController
    {

        private readonly string connectionString = ConfigurationManager.ConnectionStrings["myConnectionString"].ConnectionString;

        [HttpPost, Route("all")]
        public FollowRS GetUserFollows(UserRQ req)
        {
            FollowRS data = new FollowRS();

            using (OracleConnection conn = new OracleConnection(this.connectionString))
            {
                conn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {

                    cmd.Connection = conn;

                    StringBuilder sql = new StringBuilder();
                    sql.Append("SELECT U.NAME, U.EMPLOYMENT, F.USER_ID, F.USER_ID_FOLLOWED, F.ACCEPTED ");
                    sql.Append("  FROM FOLLOW F INNER JOIN APP_USER U ON U.ID = F.USER_ID_FOLLOWED ");
                    sql.Append(" WHERE F.USER_ID = :VAR ");
                    sql.Append("UNION ALL ");
                    sql.Append("SELECT U.NAME, U.EMPLOYMENT, F.* ");
                    sql.Append("  FROM FOLLOW F INNER JOIN APP_USER U ON U.ID = F.USER_ID ");
                    sql.Append(" WHERE F.USER_ID_FOLLOWED = :VAR");


                    cmd.CommandText = sql.ToString();
                    cmd.BindByName = true;
                    cmd.CommandType = CommandType.Text;

                    cmd.Parameters.Add("VAR", OracleDbType.Decimal, req.Id, ParameterDirection.Input);
                    //cmd.Parameters.Add("VAR", OracleDbType.Decimal).Value = req.id;


                    using (OracleDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            Follow follow = new Follow();
                            if (dr[2].ToString() == req.Id.ToString())
                            {
                                follow.User = new User
                                {
                                    Name = dr["NAME"].ToString(),
                                    Employment = dr["EMPLOYMENT"].ToString()
                                };
                                follow.Id = dr["USER_ID"].ToString();
                                follow.User.Id = dr["USER_ID_FOLLOWED"].ToString();
                                follow.Accepted = dr["ACCEPTED"].ToString();
                                data.Follows.Add(follow);
                            }
                            else
                            {
                                follow.User = new User
                                {
                                    Name = dr["NAME"].ToString(),
                                    Employment = dr["EMPLOYMENT"].ToString()
                                };
                                follow.Id = dr["USER_ID"].ToString();
                                follow.User.Id = dr["USER_ID_FOLLOWED"].ToString();
                                follow.Accepted = dr["ACCEPTED"].ToString();
                                data.Pending.Add(follow);
                            }

                        }
                    }

                }
            }

            return data;
        }
    }
}
