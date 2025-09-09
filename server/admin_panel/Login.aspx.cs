using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace admin_panel
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Handle logout
            if (Request.QueryString["logout"] == "1")
            {
                // Clear all session variables
                Session.Clear();
                Session.Abandon();
                
                // Redirect to login page without the logout parameter
                Response.Redirect("~/admin/login", true);
                return;
            }

            // Check if user is already logged in
            if (Session["AdminLoggedIn"] != null && (bool)Session["AdminLoggedIn"] == true)
            {
                Response.Redirect("~/admin", false);
                return;
            }

            // Redirect if accessed via /Login.aspx
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/login.aspx"))
            {
                Response.Redirect("~/admin/login", true);
                return;
            }

            // Focus on username field when page loads
            if (!IsPostBack)
            {
                txtUsername.Focus();
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            string username = txtUsername.Text.Trim();
            string password = txtPassword.Text.Trim();

            // Basic validation
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                ShowError("Please fill in all fields.");
                return;
            }

            if (username.Length < 3)
            {
                ShowError("Username must be at least 3 characters long.", 3000); // Show for 3 seconds
                return;
            }

            if (password.Length < 6)
            {
                ShowError("Password must be at least 6 characters long.", 3000); // Show for 3 seconds
                return;
            }

            // Validate credentials against database
            if (ValidateUserFromDatabase(username, password))
            {
                // Set session
                Session["AdminLoggedIn"] = true;
                Session["AdminUsername"] = username;
                Session["LoginTime"] = DateTime.Now;

                // Log successful login
                LogLoginAttempt(username, true, Request.UserHostAddress);

                // Show success popup and redirect
                string script = @"
                    showSuccessPopup();
                    setTimeout(function() { 
                        window.location.href = '" + ResolveUrl("~/admin") + @"';
                    }, 1000);";
                
                ClientScript.RegisterStartupScript(this.GetType(), "successAndRedirect", script, true);
            }
            else
            {
                // Log failed login attempt
                LogLoginAttempt(username, false, Request.UserHostAddress);

                // Show error message
                ShowError("Invalid username or password. Please try again.");
                
                // Clear password field for security
                txtPassword.Text = string.Empty;
                txtUsername.Focus();
            }
        }

        private bool ValidateUserFromDatabase(string username, string password)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    // Simple query to match your existing AdminUsers table structure
                    string query = @"
                        SELECT id, Username, Password, Email
                        FROM AdminUsers 
                        WHERE Username = @username AND Password = @password";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@username", username);
                        command.Parameters.AddWithValue("@password", password);
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // Store user info in session
                                Session["AdminUserId"] = reader["id"];
                                Session["AdminEmail"] = reader["Email"]?.ToString() ?? "";
                                Session["AdminFullName"] = reader["Username"]?.ToString();
                                
                                return true;
                            }
                        }
                    }
                }
                
                return false;
            }
            catch (Exception ex)
            {
                // Log error for debugging
                System.Diagnostics.Debug.WriteLine($"Database login validation error: {ex.Message}");
                
                // Try fallback authentication with hardcoded credentials
                return ValidateFallback(username, password);
            }
        }

        private bool ValidateFallback(string username, string password)
        {
            // Fallback to hardcoded credentials if database fails
            try
            {
                string adminUsername = ConfigurationManager.AppSettings["AdminUsername"] ?? "admin";
                string adminPassword = ConfigurationManager.AppSettings["AdminPassword"] ?? "portfolio2024!";

                if (username.Equals(adminUsername, StringComparison.OrdinalIgnoreCase) && 
                    password == adminPassword)
                {
                    // Set basic session info for fallback
                    Session["AdminUserId"] = 1;
                    Session["AdminEmail"] = "admin@portfolio.com";
                    Session["AdminFullName"] = "Administrator";
                    return true;
                }
                
                return false;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Fallback validation error: {ex.Message}");
                return false;
            }
        }

        private void LogLoginAttempt(string username, bool successful, string ipAddress)
        {
            try
            {
                // Log to debug output for development
                string logMessage = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - Login attempt: {username} from {ipAddress} - {(successful ? "SUCCESS" : "FAILED")}";
                System.Diagnostics.Debug.WriteLine(logMessage);
            }
            catch (Exception ex)
            {
                // Log error silently
                System.Diagnostics.Debug.WriteLine($"Logging error: {ex.Message}");
            }
        }

        private void ShowError(string message, int delay = 3000)
        {
            // Reset button state and show error with specified delay
            string script = $@"
                resetLoginButton();
                showError('{message.Replace("'", "\\'")}', {delay});
            ";
            
            ClientScript.RegisterStartupScript(this.GetType(), "showError", script, true);
        }

        private void ShowSuccess(string message)
        {
            string script = $@"
                showSuccess('{message.Replace("'", "\\'")}');
            ";
            
            ClientScript.RegisterStartupScript(this.GetType(), "showSuccess", script, true);
        }
    }
}