using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace admin_panel
{
    public partial class ManageContacts : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/managecontacts.aspx") || path.EndsWith("/managecontacts"))
            {
                Response.Redirect("~/admin/contacts/", true);
                return;
            }
        }
    }
}