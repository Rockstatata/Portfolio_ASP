using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace admin_panel
{
    public partial class ManageHome : AdminBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Check authentication (inherited from AdminBasePage)
            System.Diagnostics.Debug.WriteLine($"=== ManageHome Page_Load called - IsPostBack: {IsPostBack} ===");

            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/managehome.aspx") || path.EndsWith("/managehome"))
            {
                Response.Redirect("~/admin/dashboard", true);
                return;
            }
            
            if (!IsPostBack)
            {
                LoadHomeSections();
                
                // Initialize default sections if table is empty
                InitializeDefaultHomeSections();
            }
        }
        
        protected void gvHomeSections_RowEditing(object sender, GridViewEditEventArgs e)
        {
            gvHomeSections.EditIndex = e.NewEditIndex;
            LoadHomeSections();
        }

        protected void gvHomeSections_RowUpdating(object sender, GridViewUpdateEventArgs e)
        {
            try
            {
                // Get the ID from DataKeys
                int sectionId = Convert.ToInt32(gvHomeSections.DataKeys[e.RowIndex].Value);
                
                // Get the updated content from the TextBox in the edit template
                GridViewRow row = gvHomeSections.Rows[e.RowIndex];
                TextBox txtContent = (TextBox)row.FindControl("txtContent");
                
                if (txtContent != null)
                {
                    string newContent = txtContent.Text.Trim();
                    UpdateHomeSectionContent(sectionId, newContent);
                    
                    // Show success message
                    ShowSuccess("Home section updated successfully!");
                }
                
                gvHomeSections.EditIndex = -1;
                LoadHomeSections();
            }
            catch (Exception ex)
            {
                ShowError("Error updating section: " + ex.Message);
                System.Diagnostics.Debug.WriteLine($"Error in gvHomeSections_RowUpdating: {ex.Message}");
            }
        }

        protected void gvHomeSections_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
        {
            gvHomeSections.EditIndex = -1;
            LoadHomeSections();
        }
        
        private void LoadHomeSections()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, SectionName, Content, ImagePath, DisplayOrder, IsActive, 
                               CreatedDate, UpdatedDate
                        FROM HomeSections 
                        ORDER BY DisplayOrder, SectionName";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        gvHomeSections.DataSource = dt;
                        gvHomeSections.DataBind();
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading home sections: {ex.Message}");
                ShowError("Error loading home sections data: " + ex.Message);
                
                // Fallback to sample data if database fails
                var sampleData = new[]
                {
                    new { Id = 1, SectionName = "Hero Section", Content = "Welcome to my portfolio", ImagePath = "", DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.Now, UpdatedDate = (DateTime?)null },
                    new { Id = 2, SectionName = "About Section", Content = "I am a software developer", ImagePath = "", DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.Now, UpdatedDate = (DateTime?)null },
                    new { Id = 3, SectionName = "Skills Section", Content = "My technical skills", ImagePath = "", DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.Now, UpdatedDate = (DateTime?)null }
                };
                
                gvHomeSections.DataSource = sampleData;
                gvHomeSections.DataBind();
            }
        }
        
        private void InitializeDefaultHomeSections()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    // Check if HomeSections table has any data
                    string countQuery = "SELECT COUNT(*) FROM HomeSections";
                    using (SqlCommand countCommand = new SqlCommand(countQuery, connection))
                    {
                        connection.Open();
                        int count = Convert.ToInt32(countCommand.ExecuteScalar());
                        
                        if (count == 0)
                        {
                            // Insert default sections
                            string insertQuery = @"
                                INSERT INTO HomeSections (SectionName, Content, ImagePath, DisplayOrder, IsActive, CreatedDate, UpdatedDate)
                                VALUES 
                                ('Hero Section', 'Welcome to my portfolio website. I am a passionate developer creating amazing digital experiences.', '/images/hero-bg.jpg', 1, 1, GETDATE(), GETDATE()),
                                ('About Section', 'I am a dedicated software developer with expertise in modern web technologies and a passion for creating innovative solutions.', '/images/about-me.jpg', 2, 1, GETDATE(), GETDATE()),
                                ('Skills Section', 'Explore my technical skills and proficiencies in various programming languages and frameworks.', '/images/skills-bg.jpg', 3, 1, GETDATE(), GETDATE()),
                                ('Projects Section', 'Check out my latest projects and portfolio work showcasing my development capabilities.', '/images/projects-bg.jpg', 4, 1, GETDATE(), GETDATE()),
                                ('Experience Section', 'Learn about my professional experience and career journey in software development.', '/images/experience-bg.jpg', 5, 1, GETDATE(), GETDATE()),
                                ('Contact Section', 'Get in touch with me for collaboration opportunities or project inquiries.', '/images/contact-bg.jpg', 6, 1, GETDATE(), GETDATE())";
                                
                            using (SqlCommand insertCommand = new SqlCommand(insertQuery, connection))
                            {
                                int rowsInserted = insertCommand.ExecuteNonQuery();
                                System.Diagnostics.Debug.WriteLine($"Initialized {rowsInserted} default home sections");
                                LogAdminAction("Initialized Default Home Sections", $"Created {rowsInserted} default sections");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error initializing default home sections: {ex.Message}");
            }
        }
        
        private void UpdateHomeSectionContent(int sectionId, string newContent)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        UPDATE HomeSections 
                        SET Content = @Content, UpdatedDate = GETDATE()
                        WHERE Id = @SectionId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Content", string.IsNullOrEmpty(newContent) ? DBNull.Value : (object)newContent);
                        command.Parameters.AddWithValue("@SectionId", sectionId);
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Section may not exist.");
                        }
                        
                        // Log the action
                        LogAdminAction("Updated Home Section", $"Section ID: {sectionId}, New Content: {newContent}");
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while updating section: " + ex.Message);
            }
        }
        
        // Helper methods for the dashboard design
        protected string GetUserInitials()
        {
            string fullName = GetCurrentAdminFullName();
            if (string.IsNullOrEmpty(fullName))
            {
                return "A";
            }
            
            string[] nameParts = fullName.Split(' ');
            if (nameParts.Length >= 2)
            {
                return (nameParts[0].Substring(0, 1) + nameParts[1].Substring(0, 1)).ToUpper();
            }
            else
            {
                return nameParts[0].Substring(0, 1).ToUpper();
            }
        }
        
        protected int GetProjectsCount()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "SELECT COUNT(*) FROM Projects";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        object result = command.ExecuteScalar();
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting projects count: {ex.Message}");
                return 0; // Return 0 if there's an error
            }
        }
        
        protected int GetExperienceCount()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "SELECT COUNT(*) FROM Experience";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        object result = command.ExecuteScalar();
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting experience count: {ex.Message}");
                return 0;
            }
        }
        
        protected int GetSkillsCount()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "SELECT COUNT(*) FROM Skills";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        object result = command.ExecuteScalar();
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting skills count: {ex.Message}");
                return 0;
            }
        }
        
        protected int GetContactsCount()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    // Try multiple possible table names for contacts/messages
                    string[] possibleTables = { "Contacts", "ContactMessages", "Messages", "ContactForm" };
                    
                    foreach (string tableName in possibleTables)
                    {
                        try
                        {
                            string query = $"SELECT COUNT(*) FROM {tableName}";
                            using (SqlCommand command = new SqlCommand(query, connection))
                            {
                                connection.Open();
                                object result = command.ExecuteScalar();
                                return result != null ? Convert.ToInt32(result) : 0;
                            }
                        }
                        catch
                        {
                            // Table doesn't exist, try next one
                            if (connection.State == ConnectionState.Open)
                                connection.Close();
                            continue;
                        }
                    }
                    
                    // If no contact table exists, return 0
                    return 0;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting contacts count: {ex.Message}");
                return 0;
            }
        }

        protected int GetBlogsCount()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "SELECT COUNT(*) FROM Blogs";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        object result = command.ExecuteScalar();
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting blogs count: {ex.Message}");
                return 0;
            }
        }

        protected int GetTimelineCount()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "SELECT COUNT(*) FROM Timeline";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        object result = command.ExecuteScalar();
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting timeline count: {ex.Message}");
                return 0;
            }
        }

        #region Helper Methods for Success/Error Messages

        protected void ShowSuccess(string message)
        {
            // Since this page doesn't use Site.Master with message controls,
            // we'll just log it for now. In a full implementation, you'd add
            // message controls to the page or show via JavaScript
            System.Diagnostics.Debug.WriteLine($"SUCCESS: {message}");
            LogAdminAction("Success", message);
        }

        protected void ShowError(string message)
        {
            // Since this page doesn't use Site.Master with message controls,
            // we'll just log it for now. In a full implementation, you'd add
            // message controls to the page or show via JavaScript
            System.Diagnostics.Debug.WriteLine($"ERROR: {message}");
            LogAdminAction("Error", message);
        }

        #endregion

        #region Additional CRUD Methods (for future expansion)

        /// <summary>
        /// Creates a new home section
        /// </summary>
        protected void CreateHomeSection(string sectionName, string content, string imagePath, int displayOrder, bool isActive)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        INSERT INTO HomeSections (SectionName, Content, ImagePath, DisplayOrder, IsActive, CreatedDate, UpdatedDate)
                        VALUES (@SectionName, @Content, @ImagePath, @DisplayOrder, @IsActive, GETDATE(), GETDATE());
                        SELECT SCOPE_IDENTITY();";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@SectionName", string.IsNullOrEmpty(sectionName) ? DBNull.Value : (object)sectionName);
                        command.Parameters.AddWithValue("@Content", string.IsNullOrEmpty(content) ? DBNull.Value : (object)content);
                        command.Parameters.AddWithValue("@ImagePath", string.IsNullOrEmpty(imagePath) ? DBNull.Value : (object)imagePath);
                        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                        command.Parameters.AddWithValue("@IsActive", isActive);
                        
                        connection.Open();
                        object newId = command.ExecuteScalar();
                        
                        LogAdminAction("Created Home Section", $"Section: {sectionName}, ID: {newId}");
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error creating home section: {ex.Message}");
                throw new Exception("Database error while creating section: " + ex.Message);
            }
        }

        /// <summary>
        /// Deletes a home section by ID
        /// </summary>
        protected void DeleteHomeSection(int sectionId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM HomeSections WHERE Id = @SectionId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@SectionId", sectionId);
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Section not found or already deleted.");
                        }
                        
                        LogAdminAction("Deleted Home Section", $"Section ID: {sectionId}");
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error deleting home section: {ex.Message}");
                throw new Exception("Database error while deleting section: " + ex.Message);
            }
        }

        /// <summary>
        /// Toggles the active status of a home section
        /// </summary>
        protected void ToggleHomeSectionStatus(int sectionId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        UPDATE HomeSections 
                        SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END,
                            UpdatedDate = GETDATE()
                        WHERE Id = @SectionId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@SectionId", sectionId);
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Section not found.");
                        }
                        
                        LogAdminAction("Toggled Home Section Status", $"Section ID: {sectionId}");
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error toggling home section status: {ex.Message}");
                throw new Exception("Database error while toggling section status: " + ex.Message);
            }
        }

        #endregion
    }
}