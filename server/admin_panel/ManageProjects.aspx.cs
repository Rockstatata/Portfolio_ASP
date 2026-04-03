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
    public partial class ManageProjects : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"=== Page_Load called - IsPostBack: {IsPostBack} ===");
            
            // Handle URL redirection to maintain canonical URLs
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/manageprojects.aspx") || path.EndsWith("/manageprojects"))
            {
                Response.Redirect("~/admin/projects", true);
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
                System.Diagnostics.Debug.WriteLine("First page load - populating dropdown and binding grid");
                // Populate status dropdown
                PopulateStatusDropdown();
                
                // Load projects list
                BindProjectsGrid();
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
                ddlStatus.Items.Add(new ListItem("Completed", "Completed"));
                ddlStatus.Items.Add(new ListItem("In Development", "In Development"));
                ddlStatus.Items.Add(new ListItem("Planning", "Planning"));
                ddlStatus.Items.Add(new ListItem("On Hold", "On Hold"));
                ddlStatus.Items.Add(new ListItem("Cancelled", "Cancelled"));
                
                // Set default selection
                ddlStatus.SelectedIndex = 1; // Default to "Completed"
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

                // Get project ID from hidden field and determine if this is a new project
                string projectIdValue = hdnProjectId?.Value ?? "";
                bool isNewProject = string.IsNullOrEmpty(projectIdValue);

                // Log debugging information
                System.Diagnostics.Debug.WriteLine($"Project ID Value: '{projectIdValue}', Is New Project: {isNewProject}");

                // Validate required fields
                if (string.IsNullOrWhiteSpace(txtTitle?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Title validation failed");
                    ShowError("Project title is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(ddlStatus?.SelectedValue))
                {
                    System.Diagnostics.Debug.WriteLine("Status validation failed");
                    ShowError("Project status is required.");
                    return;
                }

                // Validate project year if provided
                if (!string.IsNullOrWhiteSpace(txtProjectYear?.Text))
                {
                    if (!int.TryParse(txtProjectYear.Text, out int year) || year < 1900 || year > DateTime.Now.Year + 1)
                    {
                        System.Diagnostics.Debug.WriteLine("Project year validation failed");
                        ShowError($"Project year must be a valid year between 1900 and {DateTime.Now.Year + 1}.");
                        return;
                    }
                }

                // Validate display order if provided
                if (!string.IsNullOrWhiteSpace(txtDisplayOrder?.Text))
                {
                    if (!int.TryParse(txtDisplayOrder.Text, out int order) || order < 0)
                    {
                        System.Diagnostics.Debug.WriteLine("Display order validation failed");
                        ShowError("Display order must be a non-negative number.");
                        return;
                    }
                }

                System.Diagnostics.Debug.WriteLine("All validations passed, calling SaveProject...");

                // Create or update project
                SaveProject(isNewProject);

                System.Diagnostics.Debug.WriteLine("SaveProject method completed successfully");

                // Reset form and refresh grid
                ResetForm();
                BindProjectsGrid();

                // Show success message after reset so it is visible
                ShowSuccess(isNewProject ? "Project added successfully!" : "Project updated successfully!");
                
                System.Diagnostics.Debug.WriteLine("=== btnSave_Click method completed successfully ===");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"=== btnSave_Click ERROR: {ex.Message} ===");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                ShowError("Error saving project: " + ex.Message);
            }
        }

        // Validate that all required controls are properly initialized
        private bool ValidateControls()
        {
            return hdnProjectId != null && 
                   txtTitle != null && 
                   txtDescription != null && 
                   txtTechnologies != null && 
                   txtProjectYear != null && 
                   ddlStatus != null && 
                   txtDemoLink != null && 
                   txtSourceLink != null && 
                   txtImagePath != null && 
                   txtDisplayOrder != null && 
                   chkIsActive != null;
        }

        protected void btnCancel_Click(object sender, EventArgs e)
        {
            ResetForm();
        }

        protected void btnDelete_Click(object sender, EventArgs e)
        {
            try
            {
                string projectId = hdnProjectId?.Value ?? "";
                if (!string.IsNullOrEmpty(projectId))
                {
                    DeleteProject(projectId);
                    ShowSuccess("Project deleted successfully!");
                    ResetForm();
                    BindProjectsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error deleting project: " + ex.Message);
            }
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            BindProjectsGrid();
        }

        protected void gvProjects_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                string projectId = e.CommandArgument.ToString();

                if (e.CommandName == "EditProject")
                {
                    // Load project details for editing
                    LoadProjectForEdit(projectId);
                }
                else if (e.CommandName == "DeleteProject")
                {
                    // Delete project
                    DeleteProject(projectId);
                    ShowSuccess("Project deleted successfully!");
                    BindProjectsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error processing command: " + ex.Message);
            }
        }

        protected void gvProjects_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvProjects.PageIndex = e.NewPageIndex;
            BindProjectsGrid();
        }

        #region Helper Methods

        private void BindProjectsGrid()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Title, Description, Technologies, ProjectYear, 
                               Status, DemoLink, SourceLink, ImagePath, DisplayOrder, 
                               (CASE WHEN DisplayOrder IS NOT NULL THEN 1 ELSE 0 END) AS IsActive
                        FROM Projects 
                        ORDER BY DisplayOrder, ProjectYear DESC, Title";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        if (gvProjects != null)
                        {
                            gvProjects.DataSource = dt;
                            gvProjects.DataBind();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading projects: {ex.Message}");
                
                // Fall back to mock data if database fails
                
            }
        }
        

        private void SaveProject(bool isNewProject)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command;
                    
                    if (isNewProject)
                    {
                        // Insert new project - let SQL Server auto-increment the ID
                        string insertQuery = @"
                            INSERT INTO Projects (
                                Title, Description, Technologies, ProjectYear, 
                                Status, DemoLink, SourceLink, ImagePath, 
                                DisplayOrder, CreatedAt, UpdatedAt
                            ) VALUES (
                                @Title, @Description, @Technologies, @ProjectYear, 
                                @Status, @DemoLink, @SourceLink, @ImagePath, 
                                @DisplayOrder, GETDATE(), GETDATE()
                            );
                            SELECT SCOPE_IDENTITY();";
                            
                        command = new SqlCommand(insertQuery, connection);
                    }
                    else
                    {
                        // Update existing project
                        string updateQuery = @"
                            UPDATE Projects SET
                                Title = @Title,
                                Description = @Description,
                                Technologies = @Technologies,
                                ProjectYear = @ProjectYear,
                                Status = @Status,
                                DemoLink = @DemoLink,
                                SourceLink = @SourceLink,
                                ImagePath = @ImagePath,
                                DisplayOrder = @DisplayOrder,
                                UpdatedAt = GETDATE()
                            WHERE Id = @ProjectId";
                            
                        command = new SqlCommand(updateQuery, connection);
                        
                        // Convert project ID safely for updates
                        string projectIdValue = hdnProjectId?.Value ?? "";
                        if (!int.TryParse(projectIdValue, out int projectIdInt))
                        {
                            throw new Exception($"Invalid project ID: '{projectIdValue}'. Cannot update project.");
                        }
                        command.Parameters.AddWithValue("@ProjectId", projectIdInt);
                    }
                    
                    // Add parameters - ensure we get actual values from controls
                    string title = txtTitle?.Text?.Trim() ?? "";
                    string description = txtDescription?.Text?.Trim() ?? "";
                    string technologies = txtTechnologies?.Text?.Trim() ?? "";
                    string status = ddlStatus?.SelectedValue ?? "";
                    string demoLink = txtDemoLink?.Text?.Trim() ?? "";
                    string sourceLink = txtSourceLink?.Text?.Trim() ?? "";
                    string imagePath = txtImagePath?.Text?.Trim() ?? "";
                    string displayOrderText = txtDisplayOrder?.Text?.Trim() ?? "";
                    string projectYearText = txtProjectYear?.Text?.Trim() ?? "";
                    bool isActive = chkIsActive?.Checked ?? false;

                    // Log the values being saved for debugging
                    System.Diagnostics.Debug.WriteLine($"Saving project - Title: '{title}', Status: '{status}', Description: '{description}'");
                    System.Diagnostics.Debug.WriteLine($"Project Year: '{projectYearText}', Display Order: '{displayOrderText}', Is Active: {isActive}");
                    
                    command.Parameters.AddWithValue("@Title", string.IsNullOrEmpty(title) ? DBNull.Value : (object)title);
                    command.Parameters.AddWithValue("@Description", string.IsNullOrEmpty(description) ? DBNull.Value : (object)description);
                    command.Parameters.AddWithValue("@Technologies", string.IsNullOrEmpty(technologies) ? DBNull.Value : (object)technologies);
                    
                    // Handle nullable project year
                    if (!string.IsNullOrEmpty(projectYearText) && int.TryParse(projectYearText, out int projectYear))
                    {
                        command.Parameters.AddWithValue("@ProjectYear", projectYear);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@ProjectYear", DBNull.Value);
                    }
                    
                    command.Parameters.AddWithValue("@Status", string.IsNullOrEmpty(status) ? DBNull.Value : (object)status);
                    command.Parameters.AddWithValue("@DemoLink", string.IsNullOrEmpty(demoLink) ? DBNull.Value : (object)demoLink);
                    command.Parameters.AddWithValue("@SourceLink", string.IsNullOrEmpty(sourceLink) ? DBNull.Value : (object)sourceLink);
                    command.Parameters.AddWithValue("@ImagePath", string.IsNullOrEmpty(imagePath) ? DBNull.Value : (object)imagePath);
                    
                    // Handle display order
                    if (!string.IsNullOrEmpty(displayOrderText) && int.TryParse(displayOrderText, out int displayOrder))
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                    }
                    else
                    {
                        // Set display order based on active status
                        if (isActive)
                        {
                            command.Parameters.AddWithValue("@DisplayOrder", 999); // Default for active projects
                        }
                        else
                        {
                            command.Parameters.AddWithValue("@DisplayOrder", DBNull.Value);
                        }
                    }
                    
                    if (isNewProject)
                    {
                        // Execute INSERT and get the new project ID that was auto-generated
                        var newId = command.ExecuteScalar();
                        if (newId != null && newId != DBNull.Value)
                        {
                            string newIdStr = newId.ToString();
                            if (hdnProjectId != null)
                            {
                                hdnProjectId.Value = newIdStr;
                            }
                            System.Diagnostics.Debug.WriteLine($"New project created with auto-generated ID: {newIdStr}");
                        }
                        else
                        {
                            System.Diagnostics.Debug.WriteLine("WARNING: ExecuteScalar returned null - project may not have been created");
                        }
                    }
                    else
                    {
                        // Execute UPDATE
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Project may not exist.");
                        }
                        System.Diagnostics.Debug.WriteLine($"Updated project, {rowsAffected} rows affected");
                    }
                    
                    // Log the action
                    string actionType = isNewProject ? "Created" : "Updated";
                    string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                    System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} {actionType} project '{title}' (ID: {hdnProjectId?.Value ?? "unknown"})");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while saving project: " + ex.Message);
            }
        }

        private void LoadProjectForEdit(string projectId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Title, Description, Technologies, ProjectYear, 
                               Status, DemoLink, SourceLink, ImagePath, DisplayOrder
                        FROM Projects 
                        WHERE Id = @ProjectId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ProjectId", Convert.ToInt32(projectId));
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                if (hdnProjectId != null) hdnProjectId.Value = reader["Id"].ToString();
                                if (txtTitle != null) txtTitle.Text = reader["Title"]?.ToString() ?? "";
                                if (txtDescription != null) txtDescription.Text = reader["Description"]?.ToString() ?? "";
                                if (txtTechnologies != null) txtTechnologies.Text = reader["Technologies"]?.ToString() ?? "";
                                
                                // Handle nullable fields
                                if (txtProjectYear != null)
                                {
                                    txtProjectYear.Text = reader["ProjectYear"] != DBNull.Value 
                                        ? reader["ProjectYear"].ToString() 
                                        : string.Empty;
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
                                
                                if (txtDemoLink != null)
                                {
                                    txtDemoLink.Text = reader["DemoLink"] != DBNull.Value 
                                        ? reader["DemoLink"].ToString() 
                                        : string.Empty;
                                }
                                
                                if (txtSourceLink != null)
                                {
                                    txtSourceLink.Text = reader["SourceLink"] != DBNull.Value 
                                        ? reader["SourceLink"].ToString() 
                                        : string.Empty;
                                }
                                
                                if (txtImagePath != null)
                                {
                                    txtImagePath.Text = reader["ImagePath"] != DBNull.Value 
                                        ? reader["ImagePath"].ToString() 
                                        : string.Empty;
                                }
                                
                                bool isActive = reader["DisplayOrder"] != DBNull.Value;
                                if (chkIsActive != null) chkIsActive.Checked = isActive;
                                
                                if (txtDisplayOrder != null)
                                {
                                    txtDisplayOrder.Text = reader["DisplayOrder"] != DBNull.Value 
                                        ? reader["DisplayOrder"].ToString() 
                                        : "0";
                                }
                                
                                // Update form title and show delete button
                                if (lblFormTitle != null) lblFormTitle.Text = "Edit Project";
                                if (btnDelete != null) btnDelete.Visible = true;
                            }
                            else
                            {
                                ShowError("Project not found.");
                                ResetForm();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading project: " + ex.Message);
            }
        }

        private void DeleteProject(string projectId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM Projects WHERE Id = @ProjectId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ProjectId", Convert.ToInt32(projectId));
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Project not found or already deleted.");
                        }
                        
                        // Log the action
                        string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                        System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} deleted project with ID: {projectId}");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting project: " + ex.Message);
            }
        }

        private void ResetForm()
        {
            // Clear all form fields
            if (hdnProjectId != null) hdnProjectId.Value = "";
            if (txtTitle != null) txtTitle.Text = "";
            if (txtDescription != null) txtDescription.Text = "";
            if (txtTechnologies != null) txtTechnologies.Text = "";
            if (txtProjectYear != null) txtProjectYear.Text = "";
            if (ddlStatus != null) ddlStatus.SelectedIndex = 1; // Default to "Completed" instead of empty
            if (txtDemoLink != null) txtDemoLink.Text = "";
            if (txtSourceLink != null) txtSourceLink.Text = "";
            if (txtImagePath != null) txtImagePath.Text = "";
            if (txtDisplayOrder != null) txtDisplayOrder.Text = "0";
            if (chkIsActive != null) chkIsActive.Checked = true;

            // Reset form title and hide delete button
            if (lblFormTitle != null) lblFormTitle.Text = "Add New Project";
            if (btnDelete != null) btnDelete.Visible = false;

            // Do NOT hide messages here so success/error is visible after save
            // lblMessage.Visible = false;
            // lblError.Visible = false;
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