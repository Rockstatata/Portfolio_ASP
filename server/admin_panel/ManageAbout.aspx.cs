using System;
using System.Collections.Generic;
using System.IO;
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
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/manageabout.aspx") || path.EndsWith("/manageabout"))
            {
                Response.Redirect("~/admin/about/", true);
                return;
            }
        }
    }
}