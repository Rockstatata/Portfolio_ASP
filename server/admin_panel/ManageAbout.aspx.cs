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
    public partial class ManageAbout : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"=== ManageAbout Page_Load called - IsPostBack: {IsPostBack} ===");
            
            // Handle URL redirection to maintain canonical URLs
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/manageabout.aspx") || path.EndsWith("/manageabout"))
            {
                Response.Redirect("~/admin/about", true);
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
                System.Diagnostics.Debug.WriteLine("First page load - binding grids");
                // Load data grids
                BindSectionsGrid();
                BindStrengthsGrid();
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("PostBack detected - page is processing form submission");
            }
        }

        #region About Sections CRUD Operations

        protected void btnSaveSection_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine("=== btnSaveSection_Click method called ===");
            
            try
            {
                // Ensure all controls are properly initialized
                if (!ValidateSectionControls())
                {
                    ShowError("Form controls are not properly initialized. Please refresh the page.");
                    return;
                }

                // Get section ID from hidden field and determine if this is a new section
                string sectionIdValue = hdnSectionId?.Value ?? "";
                bool isNewSection = string.IsNullOrEmpty(sectionIdValue);

                // Validate required fields
                if (string.IsNullOrWhiteSpace(ddlSectionType?.SelectedValue))
                {
                    ShowError("Section type is required.");
                    return;
                }

                // Validate display order if provided
                if (!string.IsNullOrWhiteSpace(txtSectionDisplayOrder?.Text))
                {
                    if (!int.TryParse(txtSectionDisplayOrder.Text, out int order) || order < 0)
                    {
                        ShowError("Display order must be a non-negative number.");
                        return;
                    }
                }

                // Save section
                SaveSection(isNewSection);

                // Reset form and refresh grid
                ResetSectionForm();
                BindSectionsGrid();

                // Show success message
                ShowSuccess(isNewSection ? "About section added successfully!" : "About section updated successfully!");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"=== btnSaveSection_Click ERROR: {ex.Message} ===");
                ShowError("Error saving section: " + ex.Message);
            }
        }

        protected void btnCancelSection_Click(object sender, EventArgs e)
        {
            ResetSectionForm();
        }

        protected void btnDeleteSection_Click(object sender, EventArgs e)
        {
            try
            {
                string sectionId = hdnSectionId?.Value ?? "";
                if (!string.IsNullOrEmpty(sectionId))
                {
                    DeleteSection(sectionId);
                    ShowSuccess("About section deleted successfully!");
                    ResetSectionForm();
                    BindSectionsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error deleting section: " + ex.Message);
            }
        }

        protected void btnRefreshSections_Click(object sender, EventArgs e)
        {
            BindSectionsGrid();
        }

        protected void gvSections_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                string sectionId = e.CommandArgument.ToString();

                if (e.CommandName == "EditSection")
                {
                    LoadSectionForEdit(sectionId);
                }
                else if (e.CommandName == "DeleteSection")
                {
                    DeleteSection(sectionId);
                    ShowSuccess("About section deleted successfully!");
                    BindSectionsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error processing section command: " + ex.Message);
            }
        }

        protected void gvSections_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvSections.PageIndex = e.NewPageIndex;
            BindSectionsGrid();
        }

        #endregion

        #region Strengths & Interests CRUD Operations

        protected void btnSaveStrength_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.WriteLine("=== btnSaveStrength_Click method called ===");
            
            try
            {
                // Ensure all controls are properly initialized
                if (!ValidateStrengthControls())
                {
                    ShowError("Form controls are not properly initialized. Please refresh the page.");
                    return;
                }

                // Get strength ID from hidden field and determine if this is a new item
                string strengthIdValue = hdnStrengthId?.Value ?? "";
                bool isNewStrength = string.IsNullOrEmpty(strengthIdValue);

                // Validate required fields
                if (string.IsNullOrWhiteSpace(ddlStrengthCategory?.SelectedValue))
                {
                    ShowError("Category is required.");
                    return;
                }

                if (string.IsNullOrWhiteSpace(txtStrengthName?.Text))
                {
                    ShowError("Name is required.");
                    return;
                }

                // Validate display order if provided
                if (!string.IsNullOrWhiteSpace(txtStrengthDisplayOrder?.Text))
                {
                    if (!int.TryParse(txtStrengthDisplayOrder.Text, out int order) || order < 0)
                    {
                        ShowError("Display order must be a non-negative number.");
                        return;
                    }
                }

                // Save strength
                SaveStrength(isNewStrength);

                // Reset form and refresh grid
                ResetStrengthForm();
                BindStrengthsGrid();

                // Show success message
                ShowSuccess(isNewStrength ? "Strength/Interest added successfully!" : "Strength/Interest updated successfully!");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"=== btnSaveStrength_Click ERROR: {ex.Message} ===");
                ShowError("Error saving item: " + ex.Message);
            }
        }

        protected void btnCancelStrength_Click(object sender, EventArgs e)
        {
            ResetStrengthForm();
        }

        protected void btnDeleteStrength_Click(object sender, EventArgs e)
        {
            try
            {
                string strengthId = hdnStrengthId?.Value ?? "";
                if (!string.IsNullOrEmpty(strengthId))
                {
                    DeleteStrength(strengthId);
                    ShowSuccess("Strength/Interest deleted successfully!");
                    ResetStrengthForm();
                    BindStrengthsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error deleting item: " + ex.Message);
            }
        }

        protected void btnRefreshStrengths_Click(object sender, EventArgs e)
        {
            BindStrengthsGrid();
        }

        protected void gvStrengths_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                string strengthId = e.CommandArgument.ToString();

                if (e.CommandName == "EditStrength")
                {
                    LoadStrengthForEdit(strengthId);
                }
                else if (e.CommandName == "DeleteStrength")
                {
                    DeleteStrength(strengthId);
                    ShowSuccess("Strength/Interest deleted successfully!");
                    BindStrengthsGrid();
                }
            }
            catch (Exception ex)
            {
                ShowError("Error processing strength command: " + ex.Message);
            }
        }

        protected void gvStrengths_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvStrengths.PageIndex = e.NewPageIndex;
            BindStrengthsGrid();
        }

        #endregion

        #region Helper Methods - About Sections

        private void BindSectionsGrid()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, SectionType, Title, Content, DisplayOrder, IsActive, 
                               CreatedDate, UpdatedDate
                        FROM AboutSections 
                        ORDER BY DisplayOrder, SectionType";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        if (gvSections != null)
                        {
                            gvSections.DataSource = dt;
                            gvSections.DataBind();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading about sections: {ex.Message}");
                ShowError("Error loading about sections data: " + ex.Message);
            }
        }

        private void SaveSection(bool isNewSection)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command;
                    
                    if (isNewSection)
                    {
                        string insertQuery = @"
                            INSERT INTO AboutSections (
                                SectionType, Title, Content, DisplayOrder, IsActive, 
                                CreatedDate, UpdatedDate
                            ) VALUES (
                                @SectionType, @Title, @Content, @DisplayOrder, @IsActive, 
                                GETDATE(), GETDATE()
                            );
                            SELECT SCOPE_IDENTITY();";
                        
                        command = new SqlCommand(insertQuery, connection);
                    }
                    else
                    {
                        string updateQuery = @"
                            UPDATE AboutSections SET
                                SectionType = @SectionType,
                                Title = @Title,
                                Content = @Content,
                                DisplayOrder = @DisplayOrder,
                                IsActive = @IsActive,
                                UpdatedDate = GETDATE()
                            WHERE Id = @SectionId";
                        
                        command = new SqlCommand(updateQuery, connection);
                        
                        string sectionIdValue = hdnSectionId?.Value ?? "";
                        if (!int.TryParse(sectionIdValue, out int sectionIdInt))
                        {
                            throw new Exception($"Invalid section ID: '{sectionIdValue}'. Cannot update section.");
                        }
                        command.Parameters.AddWithValue("@SectionId", sectionIdInt);
                    }
                    
                    // Add parameters
                    string sectionType = ddlSectionType?.SelectedValue ?? "";
                    string title = txtSectionTitle?.Text?.Trim() ?? "";
                    string content = txtSectionContent?.Text?.Trim() ?? "";
                    string displayOrderText = txtSectionDisplayOrder?.Text?.Trim() ?? "";
                    bool isActive = ddlSectionStatus?.SelectedValue == "True";

                    command.Parameters.AddWithValue("@SectionType", string.IsNullOrEmpty(sectionType) ? DBNull.Value : (object)sectionType);
                    command.Parameters.AddWithValue("@Title", string.IsNullOrEmpty(title) ? DBNull.Value : (object)title);
                    command.Parameters.AddWithValue("@Content", string.IsNullOrEmpty(content) ? DBNull.Value : (object)content);
                    command.Parameters.AddWithValue("@IsActive", isActive);
                    
                    // Handle display order
                    if (!string.IsNullOrEmpty(displayOrderText) && int.TryParse(displayOrderText, out int displayOrder))
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", 0);
                    }
                    
                    if (isNewSection)
                    {
                        var newId = command.ExecuteScalar();
                        if (newId != null && newId != DBNull.Value)
                        {
                            if (hdnSectionId != null)
                            {
                                hdnSectionId.Value = newId.ToString();
                            }
                        }
                    }
                    else
                    {
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Section may not exist.");
                        }
                    }
                    
                    string actionType = isNewSection ? "Created" : "Updated";
                    string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                    System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} {actionType} about section '{sectionType}' (ID: {hdnSectionId?.Value ?? "unknown"})");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while saving section: " + ex.Message);
            }
        }

        private void LoadSectionForEdit(string sectionId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, SectionType, Title, Content, DisplayOrder, IsActive
                        FROM AboutSections 
                        WHERE Id = @SectionId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@SectionId", Convert.ToInt32(sectionId));
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                if (hdnSectionId != null) hdnSectionId.Value = reader["Id"].ToString();
                                
                                if (ddlSectionType != null)
                                {
                                    string sectionType = reader["SectionType"]?.ToString() ?? "";
                                    if (ddlSectionType.Items.FindByValue(sectionType) != null)
                                    {
                                        ddlSectionType.SelectedValue = sectionType;
                                    }
                                }
                                
                                if (txtSectionTitle != null) txtSectionTitle.Text = reader["Title"]?.ToString() ?? "";
                                if (txtSectionContent != null) txtSectionContent.Text = reader["Content"]?.ToString() ?? "";
                                
                                if (txtSectionDisplayOrder != null)
                                {
                                    txtSectionDisplayOrder.Text = reader["DisplayOrder"] != DBNull.Value 
                                        ? reader["DisplayOrder"].ToString() 
                                        : "0";
                                }
                                
                                if (ddlSectionStatus != null)
                                {
                                    bool isActive = reader["IsActive"] != DBNull.Value && Convert.ToBoolean(reader["IsActive"]);
                                    ddlSectionStatus.SelectedValue = isActive.ToString();
                                }
                                
                                // Update form title and show delete button
                                if (lblSectionFormTitle != null) lblSectionFormTitle.Text = "Edit About Section";
                                if (btnDeleteSection != null) btnDeleteSection.Visible = true;
                            }
                            else
                            {
                                ShowError("Section not found.");
                                ResetSectionForm();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading section: " + ex.Message);
            }
        }

        private void DeleteSection(string sectionId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM AboutSections WHERE Id = @SectionId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@SectionId", Convert.ToInt32(sectionId));
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Section not found or already deleted.");
                        }
                        
                        string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                        System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} deleted about section with ID: {sectionId}");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting section: " + ex.Message);
            }
        }

        private void ResetSectionForm()
        {
            if (hdnSectionId != null) hdnSectionId.Value = "";
            if (ddlSectionType != null) ddlSectionType.SelectedIndex = 0;
            if (txtSectionTitle != null) txtSectionTitle.Text = "";
            if (txtSectionContent != null) txtSectionContent.Text = "";
            if (txtSectionDisplayOrder != null) txtSectionDisplayOrder.Text = "0";
            if (ddlSectionStatus != null) ddlSectionStatus.SelectedValue = "True";

            if (lblSectionFormTitle != null) lblSectionFormTitle.Text = "Add New About Section";
            if (btnDeleteSection != null) btnDeleteSection.Visible = false;
        }

        private bool ValidateSectionControls()
        {
            return hdnSectionId != null && 
                   ddlSectionType != null && 
                   txtSectionTitle != null && 
                   txtSectionContent != null && 
                   txtSectionDisplayOrder != null && 
                   ddlSectionStatus != null;
        }

        #endregion

        #region Helper Methods - Strengths & Interests

        private void BindStrengthsGrid()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Category, SkillName, Description, DisplayOrder, IsActive, 
                               CreatedDate
                        FROM StrengthsInterests 
                        ORDER BY Category, DisplayOrder, SkillName";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        connection.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(command);
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        
                        if (gvStrengths != null)
                        {
                            gvStrengths.DataSource = dt;
                            gvStrengths.DataBind();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading strengths/interests: {ex.Message}");
                ShowError("Error loading strengths/interests data: " + ex.Message);
            }
        }

        private void SaveStrength(bool isNewStrength)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command;
                    
                    if (isNewStrength)
                    {
                        string insertQuery = @"
                            INSERT INTO StrengthsInterests (
                                Category, SkillName, Description, DisplayOrder, IsActive, 
                                CreatedDate
                            ) VALUES (
                                @Category, @SkillName, @Description, @DisplayOrder, @IsActive, 
                                GETDATE()
                            );
                            SELECT SCOPE_IDENTITY();";
                        
                        command = new SqlCommand(insertQuery, connection);
                    }
                    else
                    {
                        string updateQuery = @"
                            UPDATE StrengthsInterests SET
                                Category = @Category,
                                SkillName = @SkillName,
                                Description = @Description,
                                DisplayOrder = @DisplayOrder,
                                IsActive = @IsActive
                            WHERE Id = @StrengthId";
                        
                        command = new SqlCommand(updateQuery, connection);
                        
                        string strengthIdValue = hdnStrengthId?.Value ?? "";
                        if (!int.TryParse(strengthIdValue, out int strengthIdInt))
                        {
                            throw new Exception($"Invalid strength ID: '{strengthIdValue}'. Cannot update item.");
                        }
                        command.Parameters.AddWithValue("@StrengthId", strengthIdInt);
                    }
                    
                    // Add parameters
                    string category = ddlStrengthCategory?.SelectedValue ?? "";
                    string skillName = txtStrengthName?.Text?.Trim() ?? "";
                    string description = txtStrengthDescription?.Text?.Trim() ?? "";
                    string displayOrderText = txtStrengthDisplayOrder?.Text?.Trim() ?? "";
                    bool isActive = ddlStrengthStatus?.SelectedValue == "True";

                    command.Parameters.AddWithValue("@Category", string.IsNullOrEmpty(category) ? DBNull.Value : (object)category);
                    command.Parameters.AddWithValue("@SkillName", string.IsNullOrEmpty(skillName) ? DBNull.Value : (object)skillName);
                    command.Parameters.AddWithValue("@Description", string.IsNullOrEmpty(description) ? DBNull.Value : (object)description);
                    command.Parameters.AddWithValue("@IsActive", isActive);
                    
                    // Handle display order
                    if (!string.IsNullOrEmpty(displayOrderText) && int.TryParse(displayOrderText, out int displayOrder))
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@DisplayOrder", 0);
                    }
                    
                    if (isNewStrength)
                    {
                        var newId = command.ExecuteScalar();
                        if (newId != null && newId != DBNull.Value)
                        {
                            if (hdnStrengthId != null)
                            {
                                hdnStrengthId.Value = newId.ToString();
                            }
                        }
                    }
                    else
                    {
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            throw new Exception("No rows were updated. Item may not exist.");
                        }
                    }
                    
                    string actionType = isNewStrength ? "Created" : "Updated";
                    string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                    System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} {actionType} strength/interest '{category} - {skillName}' (ID: {hdnStrengthId?.Value ?? "unknown"})");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database error: {ex}");
                throw new Exception("Database error while saving item: " + ex.Message);
            }
        }

        private void LoadStrengthForEdit(string strengthId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT Id, Category, SkillName, Description, DisplayOrder, IsActive
                        FROM StrengthsInterests 
                        WHERE Id = @StrengthId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@StrengthId", Convert.ToInt32(strengthId));
                        
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                if (hdnStrengthId != null) hdnStrengthId.Value = reader["Id"].ToString();
                                
                                if (ddlStrengthCategory != null)
                                {
                                    string category = reader["Category"]?.ToString() ?? "";
                                    if (ddlStrengthCategory.Items.FindByValue(category) != null)
                                    {
                                        ddlStrengthCategory.SelectedValue = category;
                                    }
                                }
                                
                                if (txtStrengthName != null) txtStrengthName.Text = reader["SkillName"]?.ToString() ?? "";
                                if (txtStrengthDescription != null) txtStrengthDescription.Text = reader["Description"]?.ToString() ?? "";
                                
                                if (txtStrengthDisplayOrder != null)
                                {
                                    txtStrengthDisplayOrder.Text = reader["DisplayOrder"] != DBNull.Value 
                                        ? reader["DisplayOrder"].ToString() 
                                        : "0";
                                }
                                
                                if (ddlStrengthStatus != null)
                                {
                                    bool isActive = reader["IsActive"] != DBNull.Value && Convert.ToBoolean(reader["IsActive"]);
                                    ddlStrengthStatus.SelectedValue = isActive.ToString();
                                }
                                
                                // Update form title and show delete button
                                if (lblStrengthFormTitle != null) lblStrengthFormTitle.Text = "Edit Strength/Interest";
                                if (btnDeleteStrength != null) btnDeleteStrength.Visible = true;
                            }
                            else
                            {
                                ShowError("Item not found.");
                                ResetStrengthForm();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading item: " + ex.Message);
            }
        }

        private void DeleteStrength(string strengthId)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM StrengthsInterests WHERE Id = @StrengthId";
                    
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@StrengthId", Convert.ToInt32(strengthId));
                        
                        connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Item not found or already deleted.");
                        }
                        
                        string username = Session["AdminUsername"]?.ToString() ?? "Unknown";
                        System.Diagnostics.Debug.WriteLine($"{DateTime.Now}: {username} deleted strength/interest with ID: {strengthId}");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting item: " + ex.Message);
            }
        }

        private void ResetStrengthForm()
        {
            if (hdnStrengthId != null) hdnStrengthId.Value = "";
            if (ddlStrengthCategory != null) ddlStrengthCategory.SelectedIndex = 0;
            if (txtStrengthName != null) txtStrengthName.Text = "";
            if (txtStrengthDescription != null) txtStrengthDescription.Text = "";
            if (txtStrengthDisplayOrder != null) txtStrengthDisplayOrder.Text = "0";
            if (ddlStrengthStatus != null) ddlStrengthStatus.SelectedValue = "True";

            if (lblStrengthFormTitle != null) lblStrengthFormTitle.Text = "Add New Strength/Interest";
            if (btnDeleteStrength != null) btnDeleteStrength.Visible = false;
        }

        private bool ValidateStrengthControls()
        {
            return hdnStrengthId != null && 
                   ddlStrengthCategory != null && 
                   txtStrengthName != null && 
                   txtStrengthDescription != null && 
                   txtStrengthDisplayOrder != null && 
                   ddlStrengthStatus != null;
        }

        #endregion

        #region Common Helper Methods

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