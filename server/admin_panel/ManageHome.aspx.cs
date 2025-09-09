using System;
using System.Collections.Generic;
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

            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/managehome.aspx") || path.EndsWith("/managehome"))
            {
                Response.Redirect("~/admin/dashboard", true);
                return;
            }
            if (!IsPostBack)
            {
                LoadHomeSections();
            }
        }
        
        protected void gvHomeSections_RowEditing(object sender, GridViewEditEventArgs e)
        {
            gvHomeSections.EditIndex = e.NewEditIndex;
            LoadHomeSections();
        }

        protected void gvHomeSections_RowUpdating(object sender, GridViewUpdateEventArgs e)
        {
            // TODO: Add row updating logic
            gvHomeSections.EditIndex = -1;
            LoadHomeSections();
        }

        protected void gvHomeSections_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
        {
            gvHomeSections.EditIndex = -1;
            LoadHomeSections();
        }
        
        private void LoadHomeSections()
        {
            // TODO: Load data from database
            // For now, using sample data
            var sampleData = new[]
            {
                new { Id = 1, SectionName = "Hero Section", Content = "Welcome to my portfolio", IsActive = true },
                new { Id = 2, SectionName = "About Section", Content = "I am a software developer", IsActive = true },
                new { Id = 3, SectionName = "Skills Section", Content = "My technical skills", IsActive = true }
            };
            
            gvHomeSections.DataSource = sampleData;
            gvHomeSections.DataBind();
        }
        
        // Helper methods for the new dashboard design
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
            // TODO: Get actual count from database
            return 12;
        }
        
        protected int GetExperienceCount()
        {
            // TODO: Get actual count from database
            return 5;
        }
        
        protected int GetSkillsCount()
        {
            // TODO: Get actual count from database
            return 24;
        }
        
        protected int GetContactsCount()
        {
            // TODO: Get actual count from database
            return 8;
        }
    }
}