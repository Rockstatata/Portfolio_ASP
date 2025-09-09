using System;
using System.Collections.Generic;
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
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/manageblogs.aspx") || path.EndsWith("/manageblogs"))
            {
                Response.Redirect("~/admin/blogs/", true);
                return;
            }
        }
    }
}