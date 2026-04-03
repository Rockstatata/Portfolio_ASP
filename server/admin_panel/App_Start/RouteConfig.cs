using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.FriendlyUrls;

namespace admin_panel
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            var settings = new FriendlyUrlSettings();
            settings.AutoRedirectMode = RedirectMode.Permanent;
            routes.EnableFriendlyUrls(settings);

            // Admin routes
            routes.MapPageRoute("LoginRoute", "admin/login", "~/Login.aspx");
            routes.MapPageRoute("AdminHomeRoute", "admin", "~/ManageHome.aspx");
            routes.MapPageRoute("DashboardRoute", "admin/dashboard", "~/ManageHome.aspx");
            
            // Management routes (all lowercase, consistent naming)
            routes.MapPageRoute("ProjectsRoute", "admin/projects", "~/ManageProjects.aspx");
            routes.MapPageRoute("ExperienceRoute", "admin/experience", "~/ManageExperiences.aspx");
            routes.MapPageRoute("SkillsRoute", "admin/skills", "~/ManageSkills.aspx");
            routes.MapPageRoute("TimelineRoute", "admin/timeline", "~/ManageTimeline.aspx");
            routes.MapPageRoute("BlogsRoute", "admin/blogs", "~/ManageBlogs.aspx");
            routes.MapPageRoute("ContactsRoute", "admin/contacts", "~/ManageContacts.aspx");
            routes.MapPageRoute("AboutRoute", "admin/about", "~/ManageAbout.aspx");
        }
    }
}
