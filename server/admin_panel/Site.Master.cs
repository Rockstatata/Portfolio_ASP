using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace admin_panel
{
    public partial class SiteMaster : MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Ensure postbacks keep the friendly URL instead of reverting to the underlying .aspx path
            if (Page != null && Page.Form != null)
            {
                // RawUrl keeps trailing slash if present, which matches how routes are defined
                Page.Form.Action = Request.RawUrl;
            }
        }

        /// <summary>
        /// Determines if the current page should have the active class.
        /// Supports both canonical (/admin/...) and legacy (/something/manage) routes.
        /// </summary>
        protected string GetNavActiveClass(string aspxFileName)
        {
            if (string.IsNullOrEmpty(aspxFileName)) return string.Empty;

            string currentPath = Request.Path.ToLowerInvariant();
            
            // Check for direct ASPX file match
            if (currentPath.EndsWith(aspxFileName.ToLowerInvariant()))
            {
                return "nav-active";
            }
            
            // Check for friendly URL routes
            if (aspxFileName == "ManageHome.aspx" && 
                (currentPath.EndsWith("/admin") || currentPath.EndsWith("/admin/") || currentPath.EndsWith("/dashboard")))
            {
                return "nav-active";
            }
            else if (aspxFileName == "ManageProjects.aspx" && currentPath.Contains("/projects"))
            {
                return "nav-active";
            }
            else if (aspxFileName == "ManageExperiences.aspx" && currentPath.Contains("/experience"))
            {
                return "nav-active";
            }
            else if (aspxFileName == "ManageSkills.aspx" && currentPath.Contains("/skills"))
            {
                return "nav-active";
            }
            else if (aspxFileName == "ManageTimeline.aspx" && currentPath.Contains("/timeline"))
            {
                return "nav-active";
            }
            else if (aspxFileName == "ManageBlogs.aspx" && currentPath.Contains("/blogs"))
            {
                return "nav-active";
            }
            else if (aspxFileName == "ManageContacts.aspx" && currentPath.Contains("/contacts"))
            {
                return "nav-active";
            }
            else if (aspxFileName == "ManageAbout.aspx" && currentPath.Contains("/about"))
            {
                return "nav-active";
            }

            return string.Empty;
        }

        protected string GetLogoutUrl() => ResolveUrl("~/admin/login?logout=1");

        protected string GetUserInitials()
        {
            try
            {
                string fullName = GetCurrentAdminFullName();
                if (string.IsNullOrWhiteSpace(fullName)) return "A";
                var parts = fullName.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length >= 2) return (parts[0][0].ToString() + parts[1][0]).ToUpper();
                return parts[0][0].ToString().ToUpper();
            }
            catch { return "A"; }
        }

        protected string GetCurrentAdminFullName()
        {
            try
            {
                if (Session["AdminFullName"] != null) return Session["AdminFullName"].ToString();
                if (Session["AdminUsername"] != null) return Session["AdminUsername"].ToString();
                return "Administrator";
            }
            catch { return "Administrator"; }
        }
    }
}