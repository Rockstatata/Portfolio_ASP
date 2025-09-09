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
    public partial class ManageSkills : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"=== Page_Load called - IsPostBack: {IsPostBack} ===");
            
            // Handle URL redirection to maintain canonical URLs
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/manageskills.aspx") || path.EndsWith("/manageskills"))
            {
                Response.Redirect("~/admin/skills", true);
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
                
                // Load skills list
                BindSkillsGrid();
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
                ddlStatus.Items.Add(new ListItem("Active", "Active"));
                ddlStatus.Items.Add(new ListItem("Learning", "Learning"));
                ddlStatus.Items.Add(new ListItem("Expert", "Expert"));
                ddlStatus.Items.Add(new ListItem("Intermediate", "Intermediate"));
                ddlStatus.Items.Add(new ListItem("Beginner", "Beginner"));
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

                // Get skill ID from hidden field and determine if this is a new skill
                string skillIdValue = hdnSkillId?.Value ?? "";
                bool isNewSkill = string.IsNullOrEmpty(skillIdValue);

                // Log debugging information
                System.Diagnostics.Debug.WriteLine($"Skill ID Value: '{skillIdValue}', Is New Skill: {isNewSkill}");

                // Validate required fields
                if (string.IsNullOrWhiteSpace(txtCategory?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Category validation failed");
                    ShowError("Category is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(txtSkillName?.Text))
                {
                    System.Diagnostics.Debug.WriteLine("Skill name validation failed");
                    ShowError("Skill name is required.");
                    return;
                }

                // Validate proficiency if provided
                if (!string.IsNullOrWhiteSpace(txtProficiency?.Text))
                {
                    if (!int.TryParse(txtProficiency.Text, out int proficiency) || proficiency < 1 || proficiency > 100)
                    {
                        System.Diagnostics.Debug.WriteLine("Proficiency validation failed");
                        ShowError("Proficiency must be a number between 1 and 100.");
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

                System.Diagnostics.Debug.WriteLine("All validations passed, calling SaveSkill...");

                // Create or update skill
                SaveSkill(isNewSkill);

                System.Diagnostics.Debug.WriteLine("SaveSkill method completed successfully");

                // Reset form and refresh grid
                ResetForm();
                BindSkillsGrid();

                // Show success message after reset so it is visible
                ShowSuccess(isNewSkill ? "Skill added successfully!" : "Skill updated successfully!");
                
                System.Diagnostics.Debug.WriteLine("=== btnSave_Click method completed successfully ===");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"=== btnSave_Click ERROR: {ex.Message} ===");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                ShowError("Error saving skill: " + ex.Message);
            }
        }

        // Validate that all required controls are properly initialized
        private bool ValidateControls()
        {
            return hdnSkillId != null && 
                   txtCategory != null && 
                   txtSkillName != null && 
                   txtSkillIcon != null && 
                   txtProficiency != null && 
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
                string skillId = hdnSkillId?.Value ?? "";
                if (!string.IsNullOrEmpty(skillId))
                {
                    DeleteSkill(skillId);
                    ShowSuccess("Skill deleted successfully!");
                    ResetForm();
                    BindSkillsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error deleting skill: " + ex.Message);
            }
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            BindSkillsGrid();
        }

        protected void gvSkills_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                string skillId = e.CommandArgument.ToString();

                if (e.CommandName == "EditSkill")
                {
                    // Load skill details for editing
                    LoadSkillForEdit(skillId);
                }
                else if (e.CommandName == "DeleteSkill")
                {
                    // Delete skill
                    DeleteSkill(skillId);
                    ShowSuccess("Skill deleted successfully!");
                    BindSkillsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error processing command: " + ex.Message);
            }
        }

        protected void gvSkills_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvSkills.PageIndex = e.NewPageIndex;
            BindSkillsGrid();
        }

        #region Helper Methods

        private void BindSkillsGrid()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Category, SkillName, SkillIcon, Proficiency, 
                               DisplayOrder, Status, CreatedAt
                        FROM Skills 
                        ORDER BY Category, DisplayOrder, SkillName";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        if (gvSkills != null)
                        {
                            gvSkills.DataSource = dt;
                            gvSkills.DataBind();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading skills: {ex.Message}");
                ShowError("Error loading skills data: " + ex.Message);
            }
        }
        

        private void SaveSkill(bool isNewSkill)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    
                    // First, let's check the actual schema of the Skills table
                    try
                    {
                        string schemaQuery = @"
                            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
                            FROM INFORMATION_SCHEMA.COLUMNS 
                            WHERE TABLE_NAME = 'Skills'
                            ORDER BY ORDINAL_POSITION";
                        
                        using (SqlCommand schemaCmd = new SqlCommand(schemaQuery, connection))
                        {
                            using (SqlDataReader schemaReader = schemaCmd.ExecuteReader())
                            {
                                System.Diagnostics.Debug.WriteLine("=== Skills Table Schema ===");
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
                    
                    if (isNewSkill)
                    {
                        // Insert new skill - let SQL Server auto-increment the ID
                        string insertQuery = @"
                            INSERT INTO Skills (
                                Category, SkillName, SkillIcon, Proficiency, 
                                DisplayOrder, Status, CreatedAt
                            ) VALUES (
                                @Category, @SkillName, @SkillIcon, @Proficiency, 
                                @DisplayOrder, @Status, GETDATE()
                            );
                            SELECT SCOPE_IDENTITY();";
                            
                        command = new SqlCommand(insertQuery, connection);
                    }
                    else
                    {
                        // Update existing skill
                        string updateQuery = @"
                            UPDATE Skills SET
                                Category = @Category,
                                SkillName = @SkillName,
                                SkillIcon = @SkillIcon,
                                Proficiency = @Proficiency,
                                DisplayOrder = @DisplayOrder,
                                Status = @Status
                            WHERE Id = @SkillId";
                            
                        command = new SqlCommand(updateQuery, connection);
                        
                        // Convert skill ID safely for updates
                        string skillIdValue = hdnSkillId?.Value ?? "";
                        if (!int.TryParse(skillIdValue, out int skillIdInt))
                        {
                            throw new Exception($"Invalid skill ID: '{skillIdValue}'. Cannot update skill.");
                        }
                        command.Parameters.AddWithValue("@SkillId", skillIdInt);
                    }
                    
                    // Add parameters - ensure we get actual values from controls
                    string category = txtCategory?.Text?.Trim() ?? "";
                    string skillName = txtSkillName?.Text?.Trim() ?? "";
                    string skillIcon = txtSkillIcon?.Text?.Trim() ?? "";
                    string proficiencyText = txtProficiency?.Text?.Trim() ?? "";
                    string status = ddlStatus?.SelectedValue ?? "";
                    string displayOrderText = txtDisplayOrder?.Text?.Trim() ?? "";

                    // Log the values being saved for debugging
                    System.Diagnostics.Debug.WriteLine($"Saving skill - Category: '{category}', SkillName: '{skillName}', Status: '{status}'");
                    System.Diagnostics.Debug.WriteLine($"Proficiency: '{proficiencyText}', Display Order: '{displayOrderText}'");
                    
                    command.Parameters.AddWithValue("@Category", string.IsNullOrEmpty(category) ? DBNull.Value : (object)category);
                    command.Parameters.AddWithValue("@SkillName", string.IsNullOrEmpty(skillName) ? DBNull.Value : (object)skillName);
                    command.Parameters.AddWithValue("@SkillIcon", string.IsNullOrEmpty(skillIcon) ? DBNull.Value : (object)skillIcon);
                    command.Parameters.AddWithValue("@Status", string.IsNullOrEmpty(status) ? DBNull.Value : (object)status);
                    
                    // Handle proficiency
                    if (!string.IsNullOrEmpty(proficiencyText) && int.TryParse(proficiencyText, out int proficiency))
                    {
                        command.Parameters.AddWithValue("@Proficiency", proficiency);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@Proficiency", DBNull.Value);
                    }
                    
                    // Handle display order
                    if (!string.IsNullOrEmpty(displayOrderText) && int.TryParse(displayOrderText, out int displayOrder))
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", DBNull.Value);
                    }
                    
                    if (isNewSkill)
                    {
                        // Execute INSERT and get the new skill ID that was auto-generated
                        var newId = command.ExecuteScalar();
                        if (newId != null && newId != DBNull.Value)
                        {
                            string newIdStr = newId.ToString();
                            if (hdnSkillId != null)
                            {
                                hdnSkillId.Value = newIdStr;
                            }
                            System.Diagnostics.Debug.WriteLine($"New skill created with auto-generated ID: {newIdStr}");
                        }
                        else
                        {
                            System.Diagnostics.Debug.WriteLine("WARNING: ExecuteScalar returned null - skill may not have been created");
                        }
                    }
                    else
                    {
                        // Execute UPDATE
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Skill may not exist.");
                        }
                        System.Diagnostics.Debug.WriteLine($"Updated skill, {rowsAffected} rows affected");
                    }
                    
                    // Log the action
                    string actionType = isNewSkill ? "Created" : "Updated";
                    string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                    System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} {actionType} skill '{category} - {skillName}' (ID: {hdnSkillId?.Value ?? "unknown"})");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while saving skill: " + ex.Message);
            }
        }

        private void LoadSkillForEdit(string skillId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Category, SkillName, SkillIcon, Proficiency, 
                               DisplayOrder, Status
                        FROM Skills 
                        WHERE Id = @SkillId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@SkillId", Convert.ToInt32(skillId));
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                if (hdnSkillId != null) hdnSkillId.Value = reader["Id"].ToString();
                                if (txtCategory != null) txtCategory.Text = reader["Category"]?.ToString() ?? "";
                                if (txtSkillName != null) txtSkillName.Text = reader["SkillName"]?.ToString() ?? "";
                                if (txtSkillIcon != null) txtSkillIcon.Text = reader["SkillIcon"]?.ToString() ?? "";
                                
                                if (txtProficiency != null)
                                {
                                    txtProficiency.Text = reader["Proficiency"] != DBNull.Value 
                                        ? reader["Proficiency"].ToString() 
                                        : "";
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
                                if (lblFormTitle != null) lblFormTitle.Text = "Edit Skill";
                                if (btnDelete != null) btnDelete.Visible = true;
                            }
                            else
                            {
                                ShowError("Skill not found.");
                                ResetForm();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading skill: " + ex.Message);
            }
        }

        private void DeleteSkill(string skillId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM Skills WHERE Id = @SkillId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@SkillId", Convert.ToInt32(skillId));
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Skill not found or already deleted.");
                        }
                        
                        // Log the action
                        string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                        System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} deleted skill with ID: {skillId}");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting skill: " + ex.Message);
            }
        }

        private void ResetForm()
        {
            // Clear all form fields
            if (hdnSkillId != null) hdnSkillId.Value = "";
            if (txtCategory != null) txtCategory.Text = "";
            if (txtSkillName != null) txtSkillName.Text = "";
            if (txtSkillIcon != null) txtSkillIcon.Text = "";
            if (txtProficiency != null) txtProficiency.Text = "";
            if (ddlStatus != null) ddlStatus.SelectedIndex = 1; // Default to "Active"
            if (txtDisplayOrder != null) txtDisplayOrder.Text = "0";

            // Reset form title and hide delete button
            if (lblFormTitle != null) lblFormTitle.Text = "Add New Skill";
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