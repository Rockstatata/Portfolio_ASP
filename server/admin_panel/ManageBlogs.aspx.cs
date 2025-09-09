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
    public partial class ManageBlogs : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"=== Page_Load called - IsPostBack: {IsPostBack} ===");
            
            // Handle URL redirection to maintain canonical URLs
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/manageblogs.aspx") || path.EndsWith("/manageblogs"))
            {
                Response.Redirect("~/admin/blogs", true);
                return;
            }

            // Check if user is logged in
            if (Session["AdminLoggedIn"] == null || !(bool)Session["AdminLoggedIn"])
            {
                System.Diagnostics.Debug.WriteLine("User not logged in, redirecting to login");
                Response.Redirect("~/admin/login", true);
                return;
            }

            if (!IsPostBack)
            {
                System.Diagnostics.Debug.WriteLine("First page load - populating dropdowns and binding grid");
                // Populate dropdowns
                PopulateStatusDropdown();
                
                // Load blogs list
                BindBlogsGrid();
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("PostBack detected - page is processing form submission");
            }
        }
        
        private void PopulateStatusDropdown()
        {
            if (ddlStatus != null)
            {
                // Clear existing items first
                ddlStatus.Items.Clear();
                
                // Add status options
                ddlStatus.Items.Add(new ListItem("Select Status", ""));
                ddlStatus.Items.Add(new ListItem("Draft", "Draft"));
                ddlStatus.Items.Add(new ListItem("Published", "Published"));
                ddlStatus.Items.Add(new ListItem("Scheduled", "Scheduled"));
                ddlStatus.Items.Add(new ListItem("Archived", "Archived"));
                ddlStatus.Items.Add(new ListItem("Private", "Private"));
                
                // Set default selection
                ddlStatus.SelectedIndex = 1; // Default to "Draft"
            }
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {
            // Add immediate debug output to confirm the method is being called
            System.Diagnostics.Debug.WriteLine("=== btnSave_Click method called ===");
            
            try
            {
                // Log page postback state
                System.Diagnostics.Debug.WriteLine($"Page.IsPostBack: {Page.IsPostBack}");
                
                // Since we disabled validation on the button, we need to manually validate
                Page.Validate();
                System.Diagnostics.Debug.WriteLine($"After Page.Validate() - Page.IsValid: {Page.IsValid}");
                
                // Ensure all controls are properly initialized
                if (!ValidateControls())
                {
                    System.Diagnostics.Debug.WriteLine("ValidateControls() returned false");
                    ShowError("Form controls are not properly initialized. Please refresh the page.");
                    return;
                }

                // Get blog ID from hidden field and determine if this is a new blog post
                string blogIdValue = hdnBlogId?.Value ?? "";
                bool isNewBlog = string.IsNullOrEmpty(blogIdValue);

                // Log debugging information
                System.Diagnostics.Debug.WriteLine($"Blog ID Value: '{blogIdValue}', Is New Blog: {isNewBlog}");

                // Validate required fields
                if (string.IsNullOrWhiteSpace(txtTitle?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Title validation failed");
                    ShowError("Title is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(txtContent?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Content validation failed");
                    ShowError("Content is required.");
                    return;
                }

                // Validate read time if provided
                if (!string.IsNullOrWhiteSpace(txtReadTime?.Text))
                {
                    if (!int.TryParse(txtReadTime.Text, out int readTime) || readTime <= 0)
                    {
                        System.Diagnostics.Debug.WriteLine("Read time validation failed");
                        ShowError("Read time must be a positive number.");
                        return;
                    }
                }

                // Validate publish date if provided
                if (!string.IsNullOrWhiteSpace(txtPublishDate?.Text))
                {
                    if (!DateTime.TryParse(txtPublishDate.Text, out DateTime publishDate))
                    {
                        System.Diagnostics.Debug.WriteLine("Publish date validation failed");
                        ShowError("Please enter a valid publish date.");
                        return;
                    }
                }

                System.Diagnostics.Debug.WriteLine("All validations passed, calling SaveBlog...");

                // Create or update blog post
                SaveBlog(isNewBlog);

                System.Diagnostics.Debug.WriteLine("SaveBlog method completed successfully");

                // Reset form and refresh grid
                ResetForm();
                BindBlogsGrid();

                // Show success message after reset so it is visible
                ShowSuccess(isNewBlog ? "Blog post added successfully!" : "Blog post updated successfully!");
                
                System.Diagnostics.Debug.WriteLine("=== btnSave_Click method completed successfully ===");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"=== btnSave_Click ERROR: {ex.Message} ===");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                ShowError("Error saving blog post: " + ex.Message);
            }
        }

        // Validate that all required controls are properly initialized
        private bool ValidateControls()
        {
            return hdnBlogId != null && 
                   txtTitle != null && 
                   txtContent != null && 
                   txtExcerpt != null && 
                   txtCategories != null && 
                   txtTags != null && 
                   txtPublishDate != null && 
                   txtReadTime != null && 
                   txtImagePath != null && 
                   ddlStatus != null;
        }

        protected void btnCancel_Click(object sender, EventArgs e)
        {
            ResetForm();
        }

        protected void btnDelete_Click(object sender, EventArgs e)
        {
            try
            {
                string blogId = hdnBlogId?.Value ?? "";
                if (!string.IsNullOrEmpty(blogId))
                {
                    DeleteBlog(blogId);
                    ShowSuccess("Blog post deleted successfully!");
                    ResetForm();
                    BindBlogsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error deleting blog post: " + ex.Message);
            }
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            BindBlogsGrid();
        }

        protected void gvBlogs_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                string blogId = e.CommandArgument.ToString();

                if (e.CommandName == "EditBlog")
                {
                    // Load blog details for editing
                    LoadBlogForEdit(blogId);
                }
                else if (e.CommandName == "DeleteBlog")
                {
                    // Delete blog post
                    DeleteBlog(blogId);
                    ShowSuccess("Blog post deleted successfully!");
                    BindBlogsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error processing command: " + ex.Message);
            }
        }

        protected void gvBlogs_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvBlogs.PageIndex = e.NewPageIndex;
            BindBlogsGrid();
        }

        #region Helper Methods

        private void BindBlogsGrid()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Title, Content, Excerpt, Categories, Tags, PublishDate, 
                               ReadTime, ImagePath, Status, CreatedAt, UpdatedAt
                        FROM BlogPosts 
                        ORDER BY CreatedAt DESC";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        if (gvBlogs != null)
                        {
                            gvBlogs.DataSource = dt;
                            gvBlogs.DataBind();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading blogs: {ex.Message}");
                ShowError("Error loading blog data: " + ex.Message);
            }
        }
        
        private void SaveBlog(bool isNewBlog)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    
                    SqlCommand command;
                    
                    if (isNewBlog)
                    {
                        // Insert new blog post - let SQL Server auto-increment the ID
                        string insertQuery = @"
                            INSERT INTO BlogPosts (
                                Title, Content, Excerpt, Categories, Tags, PublishDate, 
                                ReadTime, ImagePath, Status, CreatedAt, UpdatedAt
                            ) VALUES (
                                @Title, @Content, @Excerpt, @Categories, @Tags, @PublishDate, 
                                @ReadTime, @ImagePath, @Status, GETDATE(), GETDATE()
                            );
                            SELECT SCOPE_IDENTITY();";
                            
                        command = new SqlCommand(insertQuery, connection);
                    }
                    else
                    {
                        // Update existing blog post
                        string updateQuery = @"
                            UPDATE BlogPosts SET
                                Title = @Title,
                                Content = @Content,
                                Excerpt = @Excerpt,
                                Categories = @Categories,
                                Tags = @Tags,
                                PublishDate = @PublishDate,
                                ReadTime = @ReadTime,
                                ImagePath = @ImagePath,
                                Status = @Status,
                                UpdatedAt = GETDATE()
                            WHERE Id = @BlogId";
                            
                        command = new SqlCommand(updateQuery, connection);
                        
                        // Convert blog ID safely for updates
                        string blogIdValue = hdnBlogId?.Value ?? "";
                        if (!int.TryParse(blogIdValue, out int blogIdInt))
                        {
                            throw new Exception($"Invalid blog ID: '{blogIdValue}'. Cannot update blog post.");
                        }
                        command.Parameters.AddWithValue("@BlogId", blogIdInt);
                    }
                    
                    // Add parameters - ensure we get actual values from controls
                    string title = txtTitle?.Text?.Trim() ?? "";
                    string content = txtContent?.Text?.Trim() ?? "";
                    string excerpt = txtExcerpt?.Text?.Trim() ?? "";
                    string categories = txtCategories?.Text?.Trim() ?? "";
                    string tags = txtTags?.Text?.Trim() ?? "";
                    string publishDateText = txtPublishDate?.Text?.Trim() ?? "";
                    string readTimeText = txtReadTime?.Text?.Trim() ?? "";
                    string imagePath = txtImagePath?.Text?.Trim() ?? "";
                    string status = ddlStatus?.SelectedValue ?? "";

                    // Log the values being saved for debugging
                    System.Diagnostics.Debug.WriteLine($"Saving blog - Title: '{title}', Status: '{status}', Categories: '{categories}'");
                    System.Diagnostics.Debug.WriteLine($"Excerpt length: {excerpt.Length}, Content length: {content.Length}");
                    
                    command.Parameters.AddWithValue("@Title", string.IsNullOrEmpty(title) ? DBNull.Value : (object)title);
                    command.Parameters.AddWithValue("@Content", string.IsNullOrEmpty(content) ? DBNull.Value : (object)content);
                    command.Parameters.AddWithValue("@Excerpt", string.IsNullOrEmpty(excerpt) ? DBNull.Value : (object)excerpt);
                    command.Parameters.AddWithValue("@Categories", string.IsNullOrEmpty(categories) ? DBNull.Value : (object)categories);
                    command.Parameters.AddWithValue("@Tags", string.IsNullOrEmpty(tags) ? DBNull.Value : (object)tags);
                    command.Parameters.AddWithValue("@ImagePath", string.IsNullOrEmpty(imagePath) ? DBNull.Value : (object)imagePath);
                    command.Parameters.AddWithValue("@Status", string.IsNullOrEmpty(status) ? DBNull.Value : (object)status);
                    
                    // Handle publish date
                    if (!string.IsNullOrEmpty(publishDateText) && DateTime.TryParse(publishDateText, out DateTime publishDate))
                    {
                        command.Parameters.AddWithValue("@PublishDate", publishDate);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@PublishDate", DBNull.Value);
                    }
                    
                    // Handle read time
                    if (!string.IsNullOrEmpty(readTimeText) && int.TryParse(readTimeText, out int readTime))
                    {
                        command.Parameters.AddWithValue("@ReadTime", readTime);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@ReadTime", DBNull.Value);
                    }
                    
                    if (isNewBlog)
                    {
                        // Execute INSERT and get the new blog ID that was auto-generated
                        var newId = command.ExecuteScalar();
                        if (newId != null && newId != DBNull.Value)
                        {
                            string newIdStr = newId.ToString();
                            if (hdnBlogId != null)
                            {
                                hdnBlogId.Value = newIdStr;
                            }
                            System.Diagnostics.Debug.WriteLine($"New blog post created with auto-generated ID: {newIdStr}");
                        }
                        else
                        {
                            System.Diagnostics.Debug.WriteLine("WARNING: ExecuteScalar returned null - blog post may not have been created");
                        }
                    }
                    else
                    {
                        // Execute UPDATE
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Blog post may not exist.");
                        }
                        System.Diagnostics.Debug.WriteLine($"Updated blog post, {rowsAffected} rows affected");
                    }
                    
                    // Log the action
                    string actionType = isNewBlog ? "Created" : "Updated";
                    string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                    System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} {actionType} blog post '{title}' (ID: {hdnBlogId?.Value ?? "unknown"})");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while saving blog post: " + ex.Message);
            }
        }

        private void LoadBlogForEdit(string blogId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Title, Content, Excerpt, Categories, Tags, PublishDate, 
                               ReadTime, ImagePath, Status
                        FROM BlogPosts 
                        WHERE Id = @BlogId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@BlogId", Convert.ToInt32(blogId));
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                if (hdnBlogId != null) hdnBlogId.Value = reader["Id"].ToString();
                                if (txtTitle != null) txtTitle.Text = reader["Title"]?.ToString() ?? "";
                                if (txtContent != null) txtContent.Text = reader["Content"]?.ToString() ?? "";
                                if (txtExcerpt != null) txtExcerpt.Text = reader["Excerpt"]?.ToString() ?? "";
                                if (txtCategories != null) txtCategories.Text = reader["Categories"]?.ToString() ?? "";
                                if (txtTags != null) txtTags.Text = reader["Tags"]?.ToString() ?? "";
                                if (txtImagePath != null) txtImagePath.Text = reader["ImagePath"]?.ToString() ?? "";
                                
                                // Handle publish date
                                if (reader["PublishDate"] != DBNull.Value && txtPublishDate != null)
                                {
                                    DateTime publishDate = Convert.ToDateTime(reader["PublishDate"]);
                                    txtPublishDate.Text = publishDate.ToString("yyyy-MM-ddTHH:mm");
                                }
                                else if (txtPublishDate != null)
                                {
                                    txtPublishDate.Text = "";
                                }
                                
                                // Handle read time
                                if (reader["ReadTime"] != DBNull.Value && txtReadTime != null)
                                {
                                    txtReadTime.Text = reader["ReadTime"].ToString();
                                }
                                else if (txtReadTime != null)
                                {
                                    txtReadTime.Text = "";
                                }
                                
                                if (ddlStatus != null)
                                {
                                    string status = reader["Status"] != DBNull.Value 
                                        ? reader["Status"].ToString() 
                                        : string.Empty;
                                    
                                    if (!string.IsNullOrEmpty(status) && ddlStatus.Items.FindByValue(status) != null)
                                    {
                                        ddlStatus.SelectedValue = status;
                                    }
                                    else
                                    {
                                        ddlStatus.SelectedIndex = 0; // Default to first item
                                    }
                                }
                                
                                // Update form title and show delete button
                                if (lblFormTitle != null) lblFormTitle.Text = "Edit Blog Post";
                                if (btnDelete != null) btnDelete.Visible = true;
                            }
                            else
                            {
                                ShowError("Blog post not found.");
                                ResetForm();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading blog post: " + ex.Message);
            }
        }

        private void DeleteBlog(string blogId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM BlogPosts WHERE Id = @BlogId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@BlogId", Convert.ToInt32(blogId));
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Blog post not found or already deleted.");
                        }
                        
                        // Log the action
                        string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                        System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} deleted blog post with ID: {blogId}");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting blog post: " + ex.Message);
            }
        }

        private void ResetForm()
        {
            // Clear all form fields
            if (hdnBlogId != null) hdnBlogId.Value = "";
            if (txtTitle != null) txtTitle.Text = "";
            if (txtContent != null) txtContent.Text = "";
            if (txtExcerpt != null) txtExcerpt.Text = "";
            if (txtCategories != null) txtCategories.Text = "";
            if (txtTags != null) txtTags.Text = "";
            if (txtPublishDate != null) txtPublishDate.Text = "";
            if (txtReadTime != null) txtReadTime.Text = "";
            if (txtImagePath != null) txtImagePath.Text = "";
            if (ddlStatus != null) ddlStatus.SelectedIndex = 1; // Default to "Draft"

            // Reset form title and hide delete button
            if (lblFormTitle != null) lblFormTitle.Text = "Add New Blog Post";
            if (btnDelete != null) btnDelete.Visible = false;
        }

        private void ShowSuccess(string message)
        {
            if (lblMessage != null)
            {
                lblMessage.Text = message;
                lblMessage.Visible = true;
            }
            if (lblError != null)
            {
                lblError.Visible = false;
            }
        }

        private void ShowError(string message)
        {
            if (lblError != null)
            {
                lblError.Text = message;
                lblError.Visible = true;
            }
            if (lblMessage != null)
            {
                lblMessage.Visible = false;
            }
        }

        #endregion
    }
}