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
    public partial class ManageTimeline : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"=== Page_Load called - IsPostBack: {IsPostBack} ===");
            
            // Handle URL redirection to maintain canonical URLs
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/managetimeline.aspx") || path.EndsWith("/managetimeline"))
            {
                Response.Redirect("~/admin/timeline", true);
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
                PopulateTypeDropdown();
                PopulateStatusDropdown();
                
                // Load timeline list
                BindTimelineGrid();
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("PostBack detected - page is processing form submission");
            }
        }
        
        private void PopulateTypeDropdown()
        {
            if (ddlType != null)
            {
                // Clear existing items first
                ddlType.Items.Clear();
                
                // Add type options
                ddlType.Items.Add(new ListItem("Select Type", ""));
                ddlType.Items.Add(new ListItem("Education", "Education"));
                ddlType.Items.Add(new ListItem("Work Experience", "Work Experience"));
                ddlType.Items.Add(new ListItem("Project", "Project"));
                ddlType.Items.Add(new ListItem("Achievement", "Achievement"));
                ddlType.Items.Add(new ListItem("Certification", "Certification"));
                ddlType.Items.Add(new ListItem("Personal", "Personal"));
                ddlType.Items.Add(new ListItem("Other", "Other"));
                
                // Set default selection
                ddlType.SelectedIndex = 0; // Default to "Select Type"
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
                ddlStatus.Items.Add(new ListItem("Active", "Active"));
                ddlStatus.Items.Add(new ListItem("Completed", "Completed"));
                ddlStatus.Items.Add(new ListItem("In Progress", "In Progress"));
                ddlStatus.Items.Add(new ListItem("Ongoing", "Ongoing"));
                ddlStatus.Items.Add(new ListItem("Inactive", "Inactive"));
                
                // Set default selection
                ddlStatus.SelectedIndex = 1; // Default to "Active"
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

                // Get timeline ID from hidden field and determine if this is a new timeline entry
                string timelineIdValue = hdnTimelineId?.Value ?? "";
                bool isNewTimeline = string.IsNullOrEmpty(timelineIdValue);

                // Log debugging information
                System.Diagnostics.Debug.WriteLine($"Timeline ID Value: '{timelineIdValue}', Is New Timeline: {isNewTimeline}");

                // Validate required fields
                if (string.IsNullOrWhiteSpace(txtYearRange?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Year range validation failed");
                    ShowError("Year range is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(txtTitle?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Title validation failed");
                    ShowError("Title is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(ddlType?.SelectedValue))
                {
                    System.Diagnostics.Debug.WriteLine("Type validation failed");
                    ShowError("Type is required.");
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

                System.Diagnostics.Debug.WriteLine("All validations passed, calling SaveTimeline...");

                // Create or update timeline entry
                SaveTimeline(isNewTimeline);

                System.Diagnostics.Debug.WriteLine("SaveTimeline method completed successfully");

                // Reset form and refresh grid
                ResetForm();
                BindTimelineGrid();

                // Show success message after reset so it is visible
                ShowSuccess(isNewTimeline ? "Timeline entry added successfully!" : "Timeline entry updated successfully!");
                
                System.Diagnostics.Debug.WriteLine("=== btnSave_Click method completed successfully ===");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"=== btnSave_Click ERROR: {ex.Message} ===");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                ShowError("Error saving timeline entry: " + ex.Message);
            }
        }

        // Validate that all required controls are properly initialized
        private bool ValidateControls()
        {
            return hdnTimelineId != null && 
                   txtYearRange != null && 
                   txtTitle != null && 
                   txtLocation != null && 
                   txtDescription != null && 
                   ddlType != null && 
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
                string timelineId = hdnTimelineId?.Value ?? "";
                if (!string.IsNullOrEmpty(timelineId))
                {
                    DeleteTimeline(timelineId);
                    ShowSuccess("Timeline entry deleted successfully!");
                    ResetForm();
                    BindTimelineGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error deleting timeline entry: " + ex.Message);
            }
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            BindTimelineGrid();
        }

        protected void gvTimeline_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                string timelineId = e.CommandArgument.ToString();

                if (e.CommandName == "EditTimeline")
                {
                    // Load timeline details for editing
                    LoadTimelineForEdit(timelineId);
                }
                else if (e.CommandName == "DeleteTimeline")
                {
                    // Delete timeline entry
                    DeleteTimeline(timelineId);
                    ShowSuccess("Timeline entry deleted successfully!");
                    BindTimelineGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error processing command: " + ex.Message);
            }
        }

        protected void gvTimeline_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvTimeline.PageIndex = e.NewPageIndex;
            BindTimelineGrid();
        }

        #region Helper Methods

        private void BindTimelineGrid()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, YearRange, Title, Location, Description, 
                               Type, DisplayOrder, Status, CreatedAt
                        FROM Timeline 
                        ORDER BY DisplayOrder, YearRange DESC, CreatedAt DESC";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        if (gvTimeline != null)
                        {
                            gvTimeline.DataSource = dt;
                            gvTimeline.DataBind();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading timeline: {ex.Message}");
                ShowError("Error loading timeline data: " + ex.Message);
            }
        }
        

        private void SaveTimeline(bool isNewTimeline)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    
                    // First, let's check the actual schema of the Timeline table
                    try
                    {
                        string schemaQuery = @"
                            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
                            FROM INFORMATION_SCHEMA.COLUMNS 
                            WHERE TABLE_NAME = 'Timeline'
                            ORDER BY ORDINAL_POSITION";
                        
                        using (SqlCommand schemaCmd = new SqlCommand(schemaQuery, connection))
                        {
                            using (SqlDataReader schemaReader = schemaCmd.ExecuteReader())
                            {
                                System.Diagnostics.Debug.WriteLine("=== Timeline Table Schema ===");
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
                    
                    if (isNewTimeline)
                    {
                        // Insert new timeline entry - let SQL Server auto-increment the ID
                        string insertQuery = @"
                            INSERT INTO Timeline (
                                YearRange, Title, Location, Description, 
                                Type, DisplayOrder, Status, CreatedAt
                            ) VALUES (
                                @YearRange, @Title, @Location, @Description, 
                                @Type, @DisplayOrder, @Status, GETDATE()
                            );
                            SELECT SCOPE_IDENTITY();";
                            
                        command = new SqlCommand(insertQuery, connection);
                    }
                    else
                    {
                        // Update existing timeline entry
                        string updateQuery = @"
                            UPDATE Timeline SET
                                YearRange = @YearRange,
                                Title = @Title,
                                Location = @Location,
                                Description = @Description,
                                Type = @Type,
                                DisplayOrder = @DisplayOrder,
                                Status = @Status
                            WHERE Id = @TimelineId";
                            
                        command = new SqlCommand(updateQuery, connection);
                        
                        // Convert timeline ID safely for updates
                        string timelineIdValue = hdnTimelineId?.Value ?? "";
                        if (!int.TryParse(timelineIdValue, out int timelineIdInt))
                        {
                            throw new Exception($"Invalid timeline ID: '{timelineIdValue}'. Cannot update timeline entry.");
                        }
                        command.Parameters.AddWithValue("@TimelineId", timelineIdInt);
                    }
                    
                    // Add parameters - ensure we get actual values from controls
                    string yearRange = txtYearRange?.Text?.Trim() ?? "";
                    string title = txtTitle?.Text?.Trim() ?? "";
                    string location = txtLocation?.Text?.Trim() ?? "";
                    string description = txtDescription?.Text?.Trim() ?? "";
                    string type = ddlType?.SelectedValue ?? "";
                    string status = ddlStatus?.SelectedValue ?? "";
                    string displayOrderText = txtDisplayOrder?.Text?.Trim() ?? "";

                    // Log the values being saved for debugging
                    System.Diagnostics.Debug.WriteLine($"Saving timeline - YearRange: '{yearRange}', Title: '{title}', Type: '{type}'");
                    System.Diagnostics.Debug.WriteLine($"Location: '{location}', Status: '{status}', Display Order: '{displayOrderText}'");
                    
                    command.Parameters.AddWithValue("@YearRange", string.IsNullOrEmpty(yearRange) ? DBNull.Value : (object)yearRange);
                    command.Parameters.AddWithValue("@Title", string.IsNullOrEmpty(title) ? DBNull.Value : (object)title);
                    command.Parameters.AddWithValue("@Location", string.IsNullOrEmpty(location) ? DBNull.Value : (object)location);
                    command.Parameters.AddWithValue("@Description", string.IsNullOrEmpty(description) ? DBNull.Value : (object)description);
                    command.Parameters.AddWithValue("@Type", string.IsNullOrEmpty(type) ? DBNull.Value : (object)type);
                    command.Parameters.AddWithValue("@Status", string.IsNullOrEmpty(status) ? DBNull.Value : (object)status);
                    
                    // Handle display order
                    if (!string.IsNullOrEmpty(displayOrderText) && int.TryParse(displayOrderText, out int displayOrder))
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", DBNull.Value);
                    }
                    
                    if (isNewTimeline)
                    {
                        // Execute INSERT and get the new timeline ID that was auto-generated
                        var newId = command.ExecuteScalar();
                        if (newId != null && newId != DBNull.Value)
                        {
                            string newIdStr = newId.ToString();
                            if (hdnTimelineId != null)
                            {
                                hdnTimelineId.Value = newIdStr;
                            }
                            System.Diagnostics.Debug.WriteLine($"New timeline entry created with auto-generated ID: {newIdStr}");
                        }
                        else
                        {
                            System.Diagnostics.Debug.WriteLine("WARNING: ExecuteScalar returned null - timeline entry may not have been created");
                        }
                    }
                    else
                    {
                        // Execute UPDATE
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Timeline entry may not exist.");
                        }
                        System.Diagnostics.Debug.WriteLine($"Updated timeline entry, {rowsAffected} rows affected");
                    }
                    
                    // Log the action
                    string actionType = isNewTimeline ? "Created" : "Updated";
                    string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                    System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} {actionType} timeline entry '{yearRange} - {title}' (ID: {hdnTimelineId?.Value ?? "unknown"})");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while saving timeline entry: " + ex.Message);
            }
        }

        private void LoadTimelineForEdit(string timelineId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, YearRange, Title, Location, Description, 
                               Type, DisplayOrder, Status
                        FROM Timeline 
                        WHERE Id = @TimelineId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@TimelineId", Convert.ToInt32(timelineId));
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                if (hdnTimelineId != null) hdnTimelineId.Value = reader["Id"].ToString();
                                if (txtYearRange != null) txtYearRange.Text = reader["YearRange"]?.ToString() ?? "";
                                if (txtTitle != null) txtTitle.Text = reader["Title"]?.ToString() ?? "";
                                if (txtLocation != null) txtLocation.Text = reader["Location"]?.ToString() ?? "";
                                if (txtDescription != null) txtDescription.Text = reader["Description"]?.ToString() ?? "";
                                
                                if (ddlType != null)
                                {
                                    string type = reader["Type"] != DBNull.Value 
                                        ? reader["Type"].ToString() 
                                        : string.Empty;
                                    
                                    if (!string.IsNullOrEmpty(type) && ddlType.Items.FindByValue(type) != null)
                                    {
                                        ddlType.SelectedValue = type;
                                    }
                                    else
                                    {
                                        ddlType.SelectedIndex = 0; // Default to first item
                                    }
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
                                
                                if (txtDisplayOrder != null)
                                {
                                    txtDisplayOrder.Text = reader["DisplayOrder"] != DBNull.Value 
                                        ? reader["DisplayOrder"].ToString() 
                                        : "0";
                                }
                                
                                // Update form title and show delete button
                                if (lblFormTitle != null) lblFormTitle.Text = "Edit Timeline Entry";
                                if (btnDelete != null) btnDelete.Visible = true;
                            }
                            else
                            {
                                ShowError("Timeline entry not found.");
                                ResetForm();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading timeline entry: " + ex.Message);
            }
        }

        private void DeleteTimeline(string timelineId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM Timeline WHERE Id = @TimelineId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@TimelineId", Convert.ToInt32(timelineId));
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Timeline entry not found or already deleted.");
                        }
                        
                        // Log the action
                        string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                        System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} deleted timeline entry with ID: {timelineId}");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting timeline entry: " + ex.Message);
            }
        }

        private void ResetForm()
        {
            // Clear all form fields
            if (hdnTimelineId != null) hdnTimelineId.Value = "";
            if (txtYearRange != null) txtYearRange.Text = "";
            if (txtTitle != null) txtTitle.Text = "";
            if (txtLocation != null) txtLocation.Text = "";
            if (txtDescription != null) txtDescription.Text = "";
            if (ddlType != null) ddlType.SelectedIndex = 0; // Default to "Select Type"
            if (ddlStatus != null) ddlStatus.SelectedIndex = 1; // Default to "Active"
            if (txtDisplayOrder != null) txtDisplayOrder.Text = "0";

            // Reset form title and hide delete button
            if (lblFormTitle != null) lblFormTitle.Text = "Add New Timeline Entry";
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