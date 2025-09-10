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
    public partial class ManageContacts : AdminBasePage
    {
        private PortfolioDataService dataService;

        protected void Page_Load(object sender, EventArgs e)
        {
            dataService = new PortfolioDataService();
            
            // Handle redirects from old URLs
            string path = Request.Url.AbsolutePath.ToLowerInvariant();
            if (path.EndsWith("/managecontacts.aspx") || path.EndsWith("/managecontacts"))
            {
                Response.Redirect("~/admin/contacts/", true);
                return;
            }

            if (!IsPostBack)
            {
                LoadContactStats();
                LoadContactMessages();
            }
        }

        #region Data Loading Methods

        private void LoadContactStats()
        {
            try
            {
                var allContacts = dataService.GetAllContacts();
                var unreadContacts = dataService.GetUnreadContacts();
                var todayContacts = allContacts.Where(c => c.ReceivedDate.HasValue && 
                    c.ReceivedDate.Value.Date == DateTime.Today).ToList();
                var respondedContacts = allContacts.Where(c => c.Responded).ToList();

                lblTotalContacts.Text = allContacts.Count.ToString();
                lblUnreadContacts.Text = unreadContacts.Count.ToString();
                lblRespondedContacts.Text = respondedContacts.Count.ToString();
                lblTodayContacts.Text = todayContacts.Count.ToString();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading contact stats: {ex.Message}");
                ShowMessage("Error loading contact statistics: " + ex.Message, "error");
            }
        }

        private void LoadContactMessages()
        {
            try
            {
                List<Contact> contacts;
                string filterValue = ddlStatusFilter.SelectedValue;
                string searchTerm = txtSearch.Text.Trim();

                // Get filtered contacts based on status
                switch (filterValue)
                {
                    case "unread":
                        contacts = dataService.GetUnreadContacts();
                        break;
                    case "read":
                        contacts = dataService.GetAllContacts().Where(c => c.IsRead).ToList();
                        break;
                    case "responded":
                        contacts = dataService.GetAllContacts().Where(c => c.Responded).ToList();
                        break;
                    case "not_responded":
                        contacts = dataService.GetAllContacts().Where(c => !c.Responded).ToList();
                        break;
                    default:
                        contacts = dataService.GetAllContacts();
                        break;
                }

                // Apply search filter if provided
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    searchTerm = searchTerm.ToLowerInvariant();
                    contacts = contacts.Where(c =>
                        (c.Name != null && c.Name.ToLowerInvariant().Contains(searchTerm)) ||
                        (c.Email != null && c.Email.ToLowerInvariant().Contains(searchTerm)) ||
                        (c.Subject != null && c.Subject.ToLowerInvariant().Contains(searchTerm)) ||
                        (c.Message != null && c.Message.ToLowerInvariant().Contains(searchTerm))
                    ).ToList();
                }

                gvContacts.DataSource = contacts;
                gvContacts.DataBind();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading contacts: {ex.Message}");
                ShowMessage("Error loading contact messages: " + ex.Message, "error");
                
                // Show empty grid on error
                gvContacts.DataSource = new List<Contact>();
                gvContacts.DataBind();
            }
        }

        #endregion

        #region Event Handlers

        protected void ddlStatusFilter_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadContactMessages();
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            LoadContactMessages();
        }

        protected void gvContacts_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            {
                int contactId = Convert.ToInt32(e.CommandArgument);

                switch (e.CommandName)
                {
                    case "ViewContact":
                        ViewContactDetails(contactId);
                        break;

                    case "MarkAsRead":
                        MarkContactAsRead(contactId);
                        break;

                    case "MarkAsResponded":
                        MarkContactAsResponded(contactId);
                        break;

                    case "DeleteContact":
                        DeleteContact(contactId);
                        break;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in RowCommand: {ex.Message}");
                ShowMessage("Error performing action: " + ex.Message, "error");
            }
        }

        protected void gvContacts_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvContacts.PageIndex = e.NewPageIndex;
            LoadContactMessages();
        }

        #endregion

        #region Action Methods

        private void ViewContactDetails(int contactId)
        {
            try
            {
                var contact = dataService.GetContactById(contactId);
                if (contact != null)
                {
                    // Mark as read when viewed
                    if (!contact.IsRead)
                    {
                        dataService.MarkContactAsRead(contactId);
                    }

                    // Build JavaScript to show modal with contact data
                    string script = $@"
                        showMessageModal({{
                            name: '{HttpUtility.JavaScriptStringEncode(contact.Name)}',
                            email: '{HttpUtility.JavaScriptStringEncode(contact.Email)}',
                            subject: '{HttpUtility.JavaScriptStringEncode(contact.Subject ?? "")}',
                            message: '{HttpUtility.JavaScriptStringEncode(contact.Message)}',
                            receivedDate: '{(contact.ReceivedDate?.ToString("MMM dd, yyyy HH:mm") ?? "N/A")}',
                            isRead: {contact.IsRead.ToString().ToLower()},
                            responded: {contact.Responded.ToString().ToLower()}
                        }});
                    ";

                    ClientScript.RegisterStartupScript(this.GetType(), "ShowModal", script, true);
                    
                    // Refresh data to update read status
                    LoadContactStats();
                    LoadContactMessages();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error viewing contact: {ex.Message}");
                ShowMessage("Error viewing contact details: " + ex.Message, "error");
            }
        }

        private void MarkContactAsRead(int contactId)
        {
            try
            {
                bool success = dataService.MarkContactAsRead(contactId);
                if (success)
                {
                    ShowMessage("Message marked as read successfully.", "success");
                    LogAdminAction("Marked Contact as Read", $"Contact ID: {contactId}");
                }
                else
                {
                    ShowMessage("Failed to mark message as read.", "error");
                }
                
                LoadContactStats();
                LoadContactMessages();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error marking as read: {ex.Message}");
                ShowMessage("Error marking message as read: " + ex.Message, "error");
            }
        }

        private void MarkContactAsResponded(int contactId)
        {
            try
            {
                bool success = dataService.MarkContactAsResponded(contactId);
                if (success)
                {
                    ShowMessage("Message marked as responded successfully.", "success");
                    LogAdminAction("Marked Contact as Responded", $"Contact ID: {contactId}");
                }
                else
                {
                    ShowMessage("Failed to mark message as responded.", "error");
                }
                
                LoadContactStats();
                LoadContactMessages();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error marking as responded: {ex.Message}");
                ShowMessage("Error marking message as responded: " + ex.Message, "error");
            }
        }

        private void DeleteContact(int contactId)
        {
            try
            {
                bool success = dataService.DeleteContact(contactId);
                if (success)
                {
                    ShowMessage("Message deleted successfully.", "success");
                    LogAdminAction("Deleted Contact", $"Contact ID: {contactId}");
                }
                else
                {
                    ShowMessage("Failed to delete message.", "error");
                }
                
                LoadContactStats();
                LoadContactMessages();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error deleting contact: {ex.Message}");
                ShowMessage("Error deleting message: " + ex.Message, "error");
            }
        }

        #endregion

        #region Helper Methods

        protected string TruncateMessage(string message, int maxLength)
        {
            if (string.IsNullOrEmpty(message))
                return "No message content";

            if (message.Length <= maxLength)
                return message;

            return message.Substring(0, maxLength) + "...";
        }

        private void ShowMessage(string message, string type)
        {
            pnlMessage.Visible = true;
            pnlMessage.CssClass = $"admin-message {type}";
            lblMessage.Text = message;
        }

        #endregion
    }
}