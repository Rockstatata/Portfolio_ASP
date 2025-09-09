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
        // Controls declared manually since designer file might be missing
        protected HiddenField hdnProjectId;
        protected TextBox txtTitle;
        protected TextBox txtDescription;
        protected TextBox txtTechnologies;
        protected TextBox txtProjectYear;
        protected DropDownList ddlStatus;
        protected TextBox txtDemoLink;
        protected TextBox txtSourceLink;
        protected TextBox txtImagePath;
        protected TextBox txtDisplayOrder;
        protected CheckBox chkIsActive;
        protected Button btnSave;
        protected Button btnCancel;
        protected Button btnDelete;
        protected Button btnRefresh;
        protected Label lblFormTitle;
        protected Label lblMessage;
        protected Label lblError;
        protected GridView gvProjects;

        protected void Page_Load(object sender, EventArgs e)
        {
            // Initialize control references
            InitializeControls();

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
                Response.Redirect("~/admin/login", true);
                return;
            }

            if (!IsPostBack)
            {
                // Load projects list
                BindProjectsGrid();
            }
        }

        // Initialize control references manually since designer file might be missing
        private void InitializeControls()
        {
            hdnProjectId = FindControl("hdnProjectId") as HiddenField;
            txtTitle = FindControl("txtTitle") as TextBox;
            txtDescription = FindControl("txtDescription") as TextBox;
            txtTechnologies = FindControl("txtTechnologies") as TextBox;
            txtProjectYear = FindControl("txtProjectYear") as TextBox;
            ddlStatus = FindControl("ddlStatus") as DropDownList;
            txtDemoLink = FindControl("txtDemoLink") as TextBox;
            txtSourceLink = FindControl("txtSourceLink") as TextBox;
            txtImagePath = FindControl("txtImagePath") as TextBox;
            txtDisplayOrder = FindControl("txtDisplayOrder") as TextBox;
            chkIsActive = FindControl("chkIsActive") as CheckBox;
            btnSave = FindControl("btnSave") as Button;
            btnCancel = FindControl("btnCancel") as Button;
            btnDelete = FindControl("btnDelete") as Button;
            btnRefresh = FindControl("btnRefresh") as Button;
            lblFormTitle = FindControl("lblFormTitle") as Label;
            lblMessage = FindControl("lblMessage") as Label;
            lblError = FindControl("lblError") as Label;
            gvProjects = FindControl("gvProjects") as GridView;
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {
            try
            {
                string projectId = hdnProjectId.Value;
                bool isNewProject = string.IsNullOrEmpty(projectId);

                // Validate required fields
                if (string.IsNullOrWhiteSpace(txtTitle.Text))
                {
                    ShowError("Project title is required.");
                    return;
                }

                // Create or update project
                SaveProject(isNewProject);

                // Reset form and refresh grid
                ResetForm();
                BindProjectsGrid();

                ShowSuccess(isNewProject ? "Project added successfully!" : "Project updated successfully!");
            }
            catch (Exception ex)
            {
                ShowError("Error saving project: " + ex.Message);
            }
        }

        protected void btnCancel_Click(object sender, EventArgs e)
        {
            ResetForm();
        }

        protected void btnDelete_Click(object sender, EventArgs e)
        {
            try
            {
                string projectId = hdnProjectId.Value;
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
                // For now, let's create a mock data table
                DataTable dt = new DataTable();
                dt.Columns.Add("Id", typeof(int));
                dt.Columns.Add("Title", typeof(string));
                dt.Columns.Add("Description", typeof(string));
                dt.Columns.Add("Technologies", typeof(string));
                dt.Columns.Add("ProjectYear", typeof(int));
                dt.Columns.Add("Status", typeof(string));
                dt.Columns.Add("DemoLink", typeof(string));
                dt.Columns.Add("SourceLink", typeof(string));
                dt.Columns.Add("ImagePath", typeof(string));
                dt.Columns.Add("DisplayOrder", typeof(int));
                dt.Columns.Add("IsActive", typeof(bool));

                // Add sample data
                dt.Rows.Add(1, "Portfolio Website", "My personal portfolio website", "ASP.NET, C#, HTML, CSS", 
                    2023, "Completed", "https://example.com", "https://github.com/example/portfolio", 
                    "/images/projects/portfolio.jpg", 1, true);

                dt.Rows.Add(2, "E-commerce Platform", "Full-featured e-commerce system", "React, Node.js, MongoDB", 
                    2022, "In Development", "https://ecommerce-demo.com", "https://github.com/example/ecommerce", 
                    "/images/projects/ecommerce.jpg", 2, true);

                // Bind data to grid
                //gvProjects.DataSource = dt;
                //gvProjects.DataBind();

                // TODO: Replace with actual database retrieval
            }
            catch (Exception ex)
            {
                ShowError("Error loading projects: " + ex.Message);
            }
        }

        private void SaveProject(bool isNewProject)
        {
            // TODO: Implement actual database save logic
            // For now, just simulate the save operation
        }

        private void LoadProjectForEdit(string projectId)
        {
            // TODO: Implement actual database retrieval logic
            // For now, just simulate loading a project

            // Simulate project data for ID = 1
            if (projectId == "1")
            {
                hdnProjectId.Value = "1";
                txtTitle.Text = "Portfolio Website";
                txtDescription.Text = "My personal portfolio website";
                txtTechnologies.Text = "ASP.NET, C#, HTML, CSS";
                txtProjectYear.Text = "2023";
                ddlStatus.SelectedValue = "Completed";
                txtDemoLink.Text = "https://example.com";
                txtSourceLink.Text = "https://github.com/example/portfolio";
                txtImagePath.Text = "/images/projects/portfolio.jpg";
                txtDisplayOrder.Text = "1";
                chkIsActive.Checked = true;
            }
            // Simulate project data for ID = 2
            else if (projectId == "2")
            {
                hdnProjectId.Value = "2";
                txtTitle.Text = "E-commerce Platform";
                txtDescription.Text = "Full-featured e-commerce system";
                txtTechnologies.Text = "React, Node.js, MongoDB";
                txtProjectYear.Text = "2022";
                ddlStatus.SelectedValue = "In Development";
                txtDemoLink.Text = "https://ecommerce-demo.com";
                txtSourceLink.Text = "https://github.com/example/ecommerce";
                txtImagePath.Text = "/images/projects/ecommerce.jpg";
                txtDisplayOrder.Text = "2";
                chkIsActive.Checked = true;
            }

            // Update form title and show delete button
            lblFormTitle.Text = "Edit Project";
            btnDelete.Visible = true;
        }

        private void DeleteProject(string projectId)
        {
            // TODO: Implement actual database delete logic
            // For now, just simulate the delete operation
        }

        private void ResetForm()
        {
            // Clear all form fields
            hdnProjectId.Value = "";
            txtTitle.Text = "";
            txtDescription.Text = "";
            txtTechnologies.Text = "";
            txtProjectYear.Text = "";
            ddlStatus.SelectedIndex = 0;
            txtDemoLink.Text = "";
            txtSourceLink.Text = "";
            txtImagePath.Text = "";
            txtDisplayOrder.Text = "0";
            chkIsActive.Checked = true;

            // Reset form title and hide delete button
            lblFormTitle.Text = "Add New Project";
            btnDelete.Visible = false;

            // Hide messages
            lblMessage.Visible = false;
            lblError.Visible = false;
        }

        private void ShowSuccess(string message)
        {
            lblMessage.Text = message;
            lblMessage.Visible = true;
            lblError.Visible = false;
        }

        private void ShowError(string message)
        {
            lblError.Text = message;
            lblError.Visible = true;
            lblMessage.Visible = false;
        }

        #endregion
    }
}