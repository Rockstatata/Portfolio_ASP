<%@ Page Title="Manage Contacts" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageContacts.aspx.cs" Inherits="admin_panel.ManageContacts" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Page Header -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">Contact Messages</h1>
                <p class="admin-card-subtitle">Manage and respond to portfolio contact messages</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-envelope"></i>
            </div>
        </div>

        <!-- Contact Stats -->
        <div class="admin-dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="admin-stat-value">
                    <asp:Label ID="lblTotalContacts" runat="server" Text="0"></asp:Label>
                </div>
                <div class="admin-stat-label">Total Messages</div>
            </div>

            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-envelope-open"></i>
                </div>
                <div class="admin-stat-value">
                    <asp:Label ID="lblUnreadContacts" runat="server" Text="0"></asp:Label>
                </div>
                <div class="admin-stat-label">Unread Messages</div>
            </div>

            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-reply"></i>
                </div>
                <div class="admin-stat-value">
                    <asp:Label ID="lblRespondedContacts" runat="server" Text="0"></asp:Label>
                </div>
                <div class="admin-stat-label">Responded</div>
            </div>

            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-calendar-day"></i>
                </div>
                <div class="admin-stat-value">
                    <asp:Label ID="lblTodayContacts" runat="server" Text="0"></asp:Label>
                </div>
                <div class="admin-stat-label">Today</div>
            </div>
        </div>
    </div>

    <!-- Filters & Actions -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Filter & Actions</h2>
                <p class="admin-card-subtitle">Filter messages and perform bulk actions</p>
            </div>
        </div>

        <div class="admin-filters">
            <div class="admin-filter-group">
                <label class="admin-label">Filter by Status:</label>
                <asp:DropDownList ID="ddlStatusFilter" runat="server" CssClass="admin-form-select" AutoPostBack="true" OnSelectedIndexChanged="ddlStatusFilter_SelectedIndexChanged">
                    <asp:ListItem Text="All Messages" Value="all" Selected="True"></asp:ListItem>
                    <asp:ListItem Text="Unread Only" Value="unread"></asp:ListItem>
                    <asp:ListItem Text="Read Only" Value="read"></asp:ListItem>
                    <asp:ListItem Text="Responded" Value="responded"></asp:ListItem>
                    <asp:ListItem Text="Not Responded" Value="not_responded"></asp:ListItem>
                </asp:DropDownList>
            </div>

            <div class="admin-filter-group">
                <label class="admin-label">Search Messages:</label>
                <div class="admin-search-group">
                    <asp:TextBox ID="txtSearch" runat="server" CssClass="admin-form-input" placeholder="Search by name, email, or subject..."></asp:TextBox>
                    <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="admin-btn-primary" OnClick="btnSearch_Click" />
                </div>
            </div>
        </div>
    </div>

    <!-- Contact Messages List -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Messages</h2>
                <p class="admin-card-subtitle">All contact messages from your portfolio</p>
            </div>
        </div>

        <div class="admin-table-container">
            <asp:GridView ID="gvContacts" runat="server" AutoGenerateColumns="False"
                OnRowCommand="gvContacts_RowCommand" DataKeyNames="Id"
                CssClass="admin-table" AllowPaging="true" PageSize="15"
                OnPageIndexChanging="gvContacts_PageIndexChanging">
                <Columns>
                    <asp:TemplateField HeaderText="Status" ItemStyle-Width="80px">
                        <ItemTemplate>
                            <div class="contact-status-indicators">
                                <span class="status-indicator <%# Convert.ToBoolean(Eval("IsRead")) ? "read" : "unread" %>">
                                    <i class="fas fa-<%# Convert.ToBoolean(Eval("IsRead")) ? "envelope-open" : "envelope" %>"></i>
                                </span>
                                <%# Convert.ToBoolean(Eval("Responded")) ? 
                                    "<span class='status-indicator responded'><i class='fas fa-reply'></i></span>" : 
                                    "" %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>

                    <asp:TemplateField HeaderText="Contact Info">
                        <ItemTemplate>
                            <div class="contact-info">
                                <div class="contact-name"><%# Eval("Name") %></div>
                                <div class="contact-email"><%# Eval("Email") %></div>
                                <div class="contact-date"><%# Eval("ReceivedDate") != DBNull.Value ? Convert.ToDateTime(Eval("ReceivedDate")).ToString("MMM dd, yyyy HH:mm") : "N/A" %></div>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>

                    <asp:TemplateField HeaderText="Subject & Message">
                        <ItemTemplate>
                            <div class="message-preview">
                                <div class="message-subject"><%# !string.IsNullOrEmpty(Eval("Subject").ToString()) ? Eval("Subject") : "No Subject" %></div>
                                <div class="message-content"><%# TruncateMessage(Eval("Message").ToString(), 100) %></div>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>

                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div class="contact-actions">
                                <asp:LinkButton ID="btnView" runat="server" 
                                    CommandName="ViewContact" CommandArgument='<%# Eval("Id") %>'
                                    CssClass="admin-action-btn view">
                                    <i class="fas fa-eye"></i>
                                </asp:LinkButton>

                                <asp:LinkButton ID="btnMarkRead" runat="server" 
                                    CommandName="MarkAsRead" CommandArgument='<%# Eval("Id") %>'
                                    CssClass="admin-action-btn read"
                                    Visible='<%# !Convert.ToBoolean(Eval("IsRead")) %>'>
                                    <i class="fas fa-envelope-open"></i>
                                </asp:LinkButton>

                                <asp:LinkButton ID="btnMarkResponded" runat="server" 
                                    CommandName="MarkAsResponded" CommandArgument='<%# Eval("Id") %>'
                                    CssClass="admin-action-btn respond"
                                    Visible='<%# !Convert.ToBoolean(Eval("Responded")) %>'>
                                    <i class="fas fa-reply"></i>
                                </asp:LinkButton>

                                <asp:LinkButton ID="btnDelete" runat="server" 
                                    CommandName="DeleteContact" CommandArgument='<%# Eval("Id") %>'
                                    CssClass="admin-action-btn delete"
                                    OnClientClick="return confirm('Are you sure?');">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>

                                <a href="mailto:<%# Eval("Email") %>" class="admin-action-btn email">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 3rem;">
                        <i class="fas fa-inbox" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Messages Found</h3>
                        <p>No contact messages available.</p>
                    </div>
                </EmptyDataTemplate>

                <PagerSettings Mode="NumericFirstLast" Position="Bottom" />
                <PagerStyle CssClass="admin-pager" />
            </asp:GridView>
        </div>
    </div>

    <!-- Success/Error Messages -->
    <asp:Panel ID="pnlMessage" runat="server" Visible="false" CssClass="admin-message">
        <asp:Label ID="lblMessage" runat="server"></asp:Label>
    </asp:Panel>

    <!-- Contact-specific styles -->
    <style>
        /* Contact Status Indicators */
        .contact-status-indicators {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }

        .status-indicator {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 0.75rem;
        }

        .status-indicator.unread {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .status-indicator.read {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .status-indicator.responded {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }

        /* Contact Information Display */
        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .contact-name {
            font-weight: 600;
            color: var(--text-primary-dark);
        }

        .contact-email {
            font-size: 0.875rem;
            color: var(--color-primary);
        }

        .contact-date {
            font-size: 0.75rem;
            color: var(--text-muted-dark);
        }

        /* Message Preview */
        .message-preview {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .message-subject {
            font-weight: 500;
            color: var(--text-primary-dark);
        }

        .message-content {
            font-size: 0.875rem;
            color: var(--text-secondary-dark);
            line-height: 1.4;
        }

        /* Action Buttons */
        .contact-actions {
            display: flex;
            gap: 0.375rem;
            flex-wrap: wrap;
        }

        .admin-action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 0.375rem;
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
        }

        .admin-action-btn.view {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .admin-action-btn.view:hover {
            background: rgba(59, 130, 246, 0.2);
            transform: translateY(-1px);
        }

        .admin-action-btn.read {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .admin-action-btn.read:hover {
            background: rgba(34, 197, 94, 0.2);
            transform: translateY(-1px);
        }

        .admin-action-btn.respond {
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
            border: 1px solid rgba(168, 85, 247, 0.2);
        }

        .admin-action-btn.respond:hover {
            background: rgba(168, 85, 247, 0.2);
            transform: translateY(-1px);
        }

        .admin-action-btn.delete {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .admin-action-btn.delete:hover {
            background: rgba(239, 68, 68, 0.2);
            transform: translateY(-1px);
        }

        .admin-action-btn.email {
            background: rgba(251, 146, 60, 0.1);
            color: #fb923c;
            border: 1px solid rgba(251, 146, 60, 0.2);
        }

        .admin-action-btn.email:hover {
            background: rgba(251, 146, 60, 0.2);
            transform: translateY(-1px);
        }

        /* Filter Controls */
        .admin-filters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .admin-filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .admin-search-group {
            display: flex;
            gap: 0.5rem;
        }

        .admin-search-group .admin-form-input {
            flex: 1;
        }

        /* Message Panel */
        .admin-message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: opacity 0.3s ease;
        }

        .admin-message.success {
            background: linear-gradient(135deg, #10b981, #059669);
        }

        .admin-message.error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .contact-actions {
                justify-content: center;
            }

            .admin-filters {
                grid-template-columns: 1fr;
            }

            .admin-dashboard-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }

        @media (max-width: 480px) {
            .admin-dashboard-grid {
                grid-template-columns: 1fr !important;
            }
            
            .contact-info {
                font-size: 0.875rem;
            }
            
            .admin-action-btn {
                width: 28px;
                height: 28px;
                font-size: 0.75rem;
            }
        }
    </style>

    <!-- JavaScript functionality -->
    <script type="text/javascript">
        // Auto-hide messages after 5 seconds
        document.addEventListener('DOMContentLoaded', function () {
            const messagePanel = document.querySelector('.admin-message');
            if (messagePanel) {
                setTimeout(() => {
                    messagePanel.style.opacity = '0';
                    setTimeout(() => messagePanel.style.display = 'none', 300);
                }, 5000);
            }

            // Animate statistics
            setTimeout(animateContactStats, 500);
        });

        // Modal functions
        function showMessageModal(contactData) {
            // For now, show details in an alert (can be enhanced with a proper modal later)
            const details = `Contact Details:
Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}
Received: ${contactData.receivedDate}
Status: ${contactData.isRead ? 'Read' : 'Unread'}${contactData.responded ? ', Responded' : ''}

Message:
${contactData.message}`;
            
            alert(details);
        }

        // Statistics animation
        function animateContactStats() {
            const statElements = document.querySelectorAll('.admin-stat-value label');
            
            statElements.forEach((element, index) => {
                const finalValue = parseInt(element.textContent) || 0;
                animateValue(element, 0, finalValue, 1000 + (index * 200));
            });
        }

        function animateValue(element, start, end, duration) {
            const range = end - start;
            const minTimer = 50;
            let stepTime = Math.abs(Math.floor(duration / range));
            stepTime = Math.max(stepTime, minTimer);
            
            const startTime = new Date().getTime();
            const endTime = startTime + duration;
            let timer;

            function run() {
                const now = new Date().getTime();
                const remaining = Math.max((endTime - now) / duration, 0);
                const value = Math.round(end - (remaining * range));
                element.textContent = value;
                
                if (value === end) {
                    clearInterval(timer);
                }
            }

            timer = setInterval(run, stepTime);
            run();
        }
    </script>
</asp:Content>
