using System;
using System.Collections.Generic;
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
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/managetimeline.aspx") || path.EndsWith("/managetimeline"))
            {
                Response.Redirect("~/admin/timeline/", true);
                return;
            }
        }
    }
}