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
    public partial class ManageExperiences : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"=== Page_Load called - IsPostBack: {IsPostBack} ===");
            
            // Handle URL redirection to maintain canonical URLs
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/manageexperiences.aspx") || path.EndsWith("/manageexperiences"))
            {
                Response.Redirect("~/admin/experience", true);
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
                
                // Load experience list
                BindExperienceGrid();
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
                ddlStatus.Items.Add(new ListItem("Current", "Current"));
                ddlStatus.Items.Add(new ListItem("Previous", "Previous"));
                ddlStatus.Items.Add(new ListItem("Contract", "Contract"));
                ddlStatus.Items.Add(new ListItem("Internship", "Internship"));
                ddlStatus.Items.Add(new ListItem("Freelance", "Freelance"));
                
                // Set default selection
                ddlStatus.SelectedIndex = 1; // Default to "Current"
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

                // Get experience ID from hidden field and determine if this is a new experience
                string experienceIdValue = hdnExperienceId?.Value ?? "";
                bool isNewExperience = string.IsNullOrEmpty(experienceIdValue);

                // Log debugging information
                System.Diagnostics.Debug.WriteLine($"Experience ID Value: '{experienceIdValue}', Is New Experience: {isNewExperience}");

                // Validate required fields
                if (string.IsNullOrWhiteSpace(txtCompany?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Company validation failed");
                    ShowError("Company name is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(txtPosition?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Position validation failed");
                    ShowError("Position is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(ddlStatus?.SelectedValue))
                {
                    System.Diagnostics.Debug.WriteLine("Status validation failed");
                    ShowError("Status is required.");
                    return;
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

                System.Diagnostics.Debug.WriteLine("All validations passed, calling SaveExperience...");

                // Create or update experience
                SaveExperience(isNewExperience);

                System.Diagnostics.Debug.WriteLine("SaveExperience method completed successfully");

                // Reset form and refresh grid
                ResetForm();
                BindExperienceGrid();

                // Show success message after reset so it is visible
                ShowSuccess(isNewExperience ? "Experience added successfully!" : "Experience updated successfully!");
                
                System.Diagnostics.Debug.WriteLine("=== btnSave_Click method completed successfully ===");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"=== btnSave_Click ERROR: {ex.Message} ===");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                ShowError("Error saving experience: " + ex.Message);
            }
        }

        // Validate that all required controls are properly initialized
        private bool ValidateControls()
        {
            return hdnExperienceId != null && 
                   txtCompany != null && 
                   txtPosition != null && 
                   txtDuration != null && 
                   txtDescription != null && 
                   txtResponsibilities != null && 
                   ddlStatus != null && 
                   txtDisplayOrder != null;
        }

        protected void btnCancel_Click(object sender, EventArgs e)
        {
            ResetForm();
        }

        protected void btnDelete_Click(object sender, EventArgs e)
        {
            try
            {
                string experienceId = hdnExperienceId?.Value ?? "";
                if (!string.IsNullOrEmpty(experienceId))
                {
                    DeleteExperience(experienceId);
                    ShowSuccess("Experience deleted successfully!");
                    ResetForm();
                    BindExperienceGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error deleting experience: " + ex.Message);
            }
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            BindExperienceGrid();
        }

        protected void gvExperience_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                string experienceId = e.CommandArgument.ToString();

                if (e.CommandName == "EditExperience")
                {
                    // Load experience details for editing
                    LoadExperienceForEdit(experienceId);
                }
                else if (e.CommandName == "DeleteExperience")
                {
                    // Delete experience
                    DeleteExperience(experienceId);
                    ShowSuccess("Experience deleted successfully!");
                    BindExperienceGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error processing command: " + ex.Message);
            }
        }

        protected void gvExperience_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvExperience.PageIndex = e.NewPageIndex;
            BindExperienceGrid();
        }

        #region Helper Methods

        private void BindExperienceGrid()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Company, Position, Duration, Description, 
                               Responsibilities, DisplayOrder, Status, CreatedAt
                        FROM Experience 
                        ORDER BY DisplayOrder, CreatedAt DESC";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        if (gvExperience != null)
                        {
                            gvExperience.DataSource = dt;
                            gvExperience.DataBind();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading experience: {ex.Message}");
                ShowError("Error loading experience data: " + ex.Message);
            }
        }
        

        private void SaveExperience(bool isNewExperience)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    
                    // First, let's check the actual schema of the Experience table
                    try
                    {
                        string schemaQuery = @"
                            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
                            FROM INFORMATION_SCHEMA.COLUMNS 
                            WHERE TABLE_NAME = 'Experience'
                            ORDER BY ORDINAL_POSITION";
                        
                        using (SqlCommand schemaCmd = new SqlCommand(schemaQuery, connection))
                        {
                            using (SqlDataReader schemaReader = schemaCmd.ExecuteReader())
                            {
                                System.Diagnostics.Debug.WriteLine("=== Experience Table Schema ===");
                                while (schemaReader.Read())
                                {
                                    string columnName = schemaReader["COLUMN_NAME"].ToString();
                                    string dataType = schemaReader["DATA_TYPE"].ToString();
                                    string isNullable = schemaReader["IS_NULLABLE"].ToString();
                                    string maxLength = schemaReader["CHARACTER_MAXIMUM_LENGTH"]?.ToString() ?? "N/A";
                                    System.Diagnostics.Debug.WriteLine($"{columnName}: {dataType} (Nullable: {isNullable}, MaxLength: {maxLength})");
                                }
                                System.Diagnostics.Debug.WriteLine("=== End Schema ===");
                            }
                        }
                    }
                    catch (Exception schemaEx)
                    {
                        System.Diagnostics.Debug.WriteLine($"Error checking schema: {schemaEx.Message}");
                    }
                    
                    SqlCommand command;
                    
                    if (isNewExperience)
                    {
                        // Insert new experience - let SQL Server auto-increment the ID
                        string insertQuery = @"
                            INSERT INTO Experience (
                                Company, Position, Duration, Description, 
                                Responsibilities, DisplayOrder, Status, CreatedAt
                            ) VALUES (
                                @Company, @Position, @Duration, @Description, 
                                @Responsibilities, @DisplayOrder, @Status, GETDATE()
                            );
                            SELECT SCOPE_IDENTITY();";
                            
                        command = new SqlCommand(insertQuery, connection);
                    }
                    else
                    {
                        // Update existing experience
                        string updateQuery = @"
                            UPDATE Experience SET
                                Company = @Company,
                                Position = @Position,
                                Duration = @Duration,
                                Description = @Description,
                                Responsibilities = @Responsibilities,
                                DisplayOrder = @DisplayOrder,
                                Status = @Status
                            WHERE Id = @ExperienceId";
                            
                        command = new SqlCommand(updateQuery, connection);
                        
                        // Convert experience ID safely for updates
                        string experienceIdValue = hdnExperienceId?.Value ?? "";
                        if (!int.TryParse(experienceIdValue, out int experienceIdInt))
                        {
                            throw new Exception($"Invalid experience ID: '{experienceIdValue}'. Cannot update experience.");
                        }
                        command.Parameters.AddWithValue("@ExperienceId", experienceIdInt);
                    }
                    
                    // Add parameters - ensure we get actual values from controls
                    string company = txtCompany?.Text?.Trim() ?? "";
                    string position = txtPosition?.Text?.Trim() ?? "";
                    string duration = txtDuration?.Text?.Trim() ?? "";
                    string description = txtDescription?.Text?.Trim() ?? "";
                    string responsibilities = txtResponsibilities?.Text?.Trim() ?? "";
                    string status = ddlStatus?.SelectedValue ?? "";
                    string displayOrderText = txtDisplayOrder?.Text?.Trim() ?? "";

                    // Log the values being saved for debugging
                    System.Diagnostics.Debug.WriteLine($"Saving experience - Company: '{company}', Position: '{position}', Status: '{status}'");
                    System.Diagnostics.Debug.WriteLine($"Duration: '{duration}', Display Order: '{displayOrderText}'");
                    
                    command.Parameters.AddWithValue("@Company", string.IsNullOrEmpty(company) ? DBNull.Value : (object)company);
                    command.Parameters.AddWithValue("@Position", string.IsNullOrEmpty(position) ? DBNull.Value : (object)position);
                    command.Parameters.AddWithValue("@Duration", string.IsNullOrEmpty(duration) ? DBNull.Value : (object)duration);
                    command.Parameters.AddWithValue("@Description", string.IsNullOrEmpty(description) ? DBNull.Value : (object)description);
                    command.Parameters.AddWithValue("@Responsibilities", string.IsNullOrEmpty(responsibilities) ? DBNull.Value : (object)responsibilities);
                    
                    // Handle Status - check if it might be a bit field or different data type
                    command.Parameters.AddWithValue("@Status", string.IsNullOrEmpty(status) ? DBNull.Value : (object)status);
                    
                    // Handle display order
                    if (!string.IsNullOrEmpty(displayOrderText) && int.TryParse(displayOrderText, out int displayOrder))
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", 0);
                    }
                    
                    if (isNewExperience)
                    {
                        // Execute INSERT and get the new experience ID that was auto-generated
                        var newId = command.ExecuteScalar();
                        if (newId != null && newId != DBNull.Value)
                        {
                            string newIdStr = newId.ToString();
                            if (hdnExperienceId != null)
                            {
                                hdnExperienceId.Value = newIdStr;
                            }
                            System.Diagnostics.Debug.WriteLine($"New experience created with auto-generated ID: {newIdStr}");
                        }
                        else
                        {
                            System.Diagnostics.Debug.WriteLine("WARNING: ExecuteScalar returned null - experience may not have been created");
                        }
                    }
                    else
                    {
                        // Execute UPDATE
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Experience may not exist.");
                        }
                        System.Diagnostics.Debug.WriteLine($"Updated experience, {rowsAffected} rows affected");
                    }
                    
                    // Log the action
                    string actionType = isNewExperience ? "Created" : "Updated";
                    string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                    System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} {actionType} experience '{company} - {position}' (ID: {hdnExperienceId?.Value ?? "unknown"})");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while saving experience: " + ex.Message);
            }
        }

        private void LoadExperienceForEdit(string experienceId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Company, Position, Duration, Description, 
                               Responsibilities, DisplayOrder, Status
                        FROM Experience 
                        WHERE Id = @ExperienceId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ExperienceId", Convert.ToInt32(experienceId));
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                if (hdnExperienceId != null) hdnExperienceId.Value = reader["Id"].ToString();
                                if (txtCompany != null) txtCompany.Text = reader["Company"]?.ToString() ?? "";
                                if (txtPosition != null) txtPosition.Text = reader["Position"]?.ToString() ?? "";
                                if (txtDuration != null) txtDuration.Text = reader["Duration"]?.ToString() ?? "";
                                if (txtDescription != null) txtDescription.Text = reader["Description"]?.ToString() ?? "";
                                if (txtResponsibilities != null) txtResponsibilities.Text = reader["Responsibilities"]?.ToString() ?? "";
                                
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
                                
                                if (txtDisplayOrder != null)
                                {
                                    txtDisplayOrder.Text = reader["DisplayOrder"] != DBNull.Value 
                                        ? reader["DisplayOrder"].ToString() 
                                        : "0";
                                }
                                
                                // Update form title and show delete button
                                if (lblFormTitle != null) lblFormTitle.Text = "Edit Experience";
                                if (btnDelete != null) btnDelete.Visible = true;
                            }
                            else
                            {
                                ShowError("Experience not found.");
                                ResetForm();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading experience: " + ex.Message);
            }
        }

        private void DeleteExperience(string experienceId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM Experience WHERE Id = @ExperienceId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ExperienceId", Convert.ToInt32(experienceId));
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Experience not found or already deleted.");
                        }
                        
                        // Log the action
                        string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                        System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} deleted experience with ID: {experienceId}");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting experience: " + ex.Message);
            }
        }

        private void ResetForm()
        {
            // Clear all form fields
            if (hdnExperienceId != null) hdnExperienceId.Value = "";
            if (txtCompany != null) txtCompany.Text = "";
            if (txtPosition != null) txtPosition.Text = "";
            if (txtDuration != null) txtDuration.Text = "";
            if (txtDescription != null) txtDescription.Text = "";
            if (txtResponsibilities != null) txtResponsibilities.Text = "";
            if (ddlStatus != null) ddlStatus.SelectedIndex = 1; // Default to "Current" instead of empty
            if (txtDisplayOrder != null) txtDisplayOrder.Text = "0";

            // Reset form title and hide delete button
            if (lblFormTitle != null) lblFormTitle.Text = "Add New Experience";
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