using System;
using System.Web;
using System.Web.UI;

namespace admin_panel
{
    /// <summary>
    /// Base class for all admin pages that require authentication
    /// </summary>
    public class AdminBasePage : Page
    {
        protected override void OnInit(EventArgs e)
        {
            // Check authentication before page loads
            CheckAdminAuthentication();
            base.OnInit(e);
        }

        protected virtual void CheckAdminAuthentication()
        {
            // Check if user is logged in
            if (Session["AdminLoggedIn"] == null || !(bool)Session["AdminLoggedIn"])
            {
                // Store the current page URL for redirect after login
                Session["ReturnUrl"] = Request.Url.ToString();
                
                // Redirect to login page using the admin route
                Response.Redirect("~/admin/", true);
                return;
            }

            // Check session timeout
            if (Session["LoginTime"] != null)
            {
                DateTime loginTime = (DateTime)Session["LoginTime"];
                TimeSpan sessionDuration = DateTime.Now - loginTime;
                
                // Get timeout from config (default 30 minutes)
                int timeoutMinutes = 30;
                if (System.Configuration.ConfigurationManager.AppSettings["SessionTimeoutMinutes"] != null)
                {
                    int.TryParse(System.Configuration.ConfigurationManager.AppSettings["SessionTimeoutMinutes"], out timeoutMinutes);
                }

                if (sessionDuration.TotalMinutes > timeoutMinutes)
                {
                    // Session expired
                    Session.Clear();
                    Session.Abandon();
                    
                    // Redirect to login with timeout message
                    Response.Redirect("~/admin/?timeout=1", true);
                    return;
                }
            }

            // Update last activity time
            Session["LastActivity"] = DateTime.Now;
        }

        protected string GetCurrentAdminUsername()
        {
            return Session["AdminUsername"]?.ToString() ?? "Admin";
        }

        protected string GetCurrentAdminFullName()
        {
            return Session["AdminFullName"]?.ToString() ?? GetCurrentAdminUsername();
        }

        protected string GetCurrentAdminEmail()
        {
            return Session["AdminEmail"]?.ToString() ?? "";
        }

        protected int GetCurrentAdminUserId()
        {
            if (Session["AdminUserId"] != null && int.TryParse(Session["AdminUserId"].ToString(), out int userId))
            {
                return userId;
            }
            return 0;
        }

        protected void LogAdminAction(string action, string details = "")
        {
            try
            {
                string logMessage = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {GetCurrentAdminUsername()} - {action}";
                if (!string.IsNullOrEmpty(details))
                {
                    logMessage += $" - {details}";
                }
                
                // Log to debug (you can implement database logging here)
                System.Diagnostics.Debug.WriteLine(logMessage);
                
                // TODO: Implement database logging
                /*
                string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "INSERT INTO AdminLogs (Username, Action, Details, Timestamp, IPAddress) VALUES (@username, @action, @details, @timestamp, @ipAddress)";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@username", GetCurrentAdminUsername());
                        command.Parameters.AddWithValue("@action", action);
                        command.Parameters.AddWithValue("@details", details);
                        command.Parameters.AddWithValue("@timestamp", DateTime.Now);
                        command.Parameters.AddWithValue("@ipAddress", Request.UserHostAddress);
                        
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
                */
            }
            catch (Exception ex)
            {
                // Log error silently
                System.Diagnostics.Debug.WriteLine($"Logging error: {ex.Message}");
            }
        }

        protected void LogoutAdmin()
        {
            LogAdminAction("Logout", "Admin logged out");
            
            // Clear session
            Session.Clear();
            Session.Abandon();
            
            // Redirect to login
            Response.Redirect("~/admin/?logout=1", true);
        }
    }
}