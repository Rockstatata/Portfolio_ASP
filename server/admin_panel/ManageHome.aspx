<%@ Page Title="Admin Dashboard" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageHome.aspx.cs" Inherits="admin_panel.ManageHome" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Welcome Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">Welcome back, <%= GetCurrentAdminUsername() %>!</h1>
                <p class="admin-card-subtitle">Here's what's happening with your portfolio today.</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-chart-line"></i>
            </div>
        </div>

        <!-- Dashboard Stats -->
        <div class="admin-dashboard-grid">
            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="admin-stat-value" id="projectsCount">0</div>
                <div class="admin-stat-label">Projects</div>
            </div>

            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-building"></i>
                </div>
                <div class="admin-stat-value" id="experienceCount">0</div>
                <div class="admin-stat-label">Experiences</div>
            </div>

            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-code"></i>
                </div>
                <div class="admin-stat-value" id="skillsCount">0</div>
                <div class="admin-stat-label">Skills</div>
            </div>

            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="admin-stat-value" id="contactsCount">0</div>
                <div class="admin-stat-label">Messages</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="admin-stat-value" id="VisitCount">
                    <p class="visitor-paragraph">Visitor Name: <%= VisitorName %></p>
                    <p class="visitor-paragraph">Visit Count: <%= VisitCount %></p>
                    <p class="visitor-paragraph">First Visit (Local): <%= FormatLocal(FirstVisitUtc) %></p>
                    <p class="visitor-paragraph">Last Visit (Local): <%= FormatLocal(LastVisitUtc) %></p>
                </div>
                <div class="admin-stat-label">Visits</div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Quick Actions</h2>
                <p class="admin-card-subtitle">Manage your portfolio content efficiently</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-rocket"></i>
            </div>
        </div>

        <div class="admin-dashboard-grid">
            <a href='<%=ResolveUrl("~/admin/projects") %>' class="admin-stat-card admin-action-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="admin-stat-label">Add New Project</div>
            </a>

            <a href='<%=ResolveUrl("~/admin/experience") %>' class="admin-stat-card admin-action-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="admin-stat-label">Update Experience</div>
            </a>

            <a href='<%=ResolveUrl("~/admin/skills") %>' class="admin-stat-card admin-action-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-cogs"></i>
                </div>
                <div class="admin-stat-label">Manage Skills</div>
            </a>

            <a href='<%=ResolveUrl("~/admin/blogs") %>' class="admin-stat-card admin-action-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-blog"></i>
                </div>
                <div class="admin-stat-label">Write Blog Post</div>
            </a>

            <a href='<%=ResolveUrl("~/admin/contacts") %>' class="admin-stat-card admin-action-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="admin-stat-label">View Messages</div>
            </a>

            <a href='<%=ResolveUrl("~/admin/about") %>' class="admin-stat-card admin-action-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-user-edit"></i>
                </div>
                <div class="admin-stat-label">Update About</div>
            </a>
        </div>
    </div>

    <!-- Home Page Sections Management -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Home Page Sections</h2>
                <p class="admin-card-subtitle">Manage your portfolio homepage content</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-home"></i>
            </div>
        </div>

        <div class="admin-table-container">
            <asp:GridView ID="gvHomeSections" runat="server" AutoGenerateColumns="False"
                OnRowEditing="gvHomeSections_RowEditing" OnRowUpdating="gvHomeSections_RowUpdating"
                OnRowCancelingEdit="gvHomeSections_RowCancelingEdit" DataKeyNames="Id"
                CssClass="admin-table" AllowPaging="true" PageSize="10">
                <Columns>
                    <asp:BoundField DataField="SectionName" HeaderText="Section" ReadOnly="true" />
                    <asp:TemplateField HeaderText="Content">
                        <ItemTemplate>
                            <div style="max-width: 400px; overflow: hidden; text-overflow: ellipsis;">
                                <%# Eval("Content") %>
                            </div>
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:TextBox ID="txtContent" runat="server" Text='<%# Eval("Content") %>'
                                TextMode="MultiLine" Rows="4" CssClass="admin-form-textarea"
                                Style="width: 100%; min-width: 300px;"></asp:TextBox>
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Image Path">
                        <ItemTemplate>
                            <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                                <%# Eval("ImagePath") %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="DisplayOrder" HeaderText="Order" />
                    <asp:TemplateField HeaderText="Active">
                        <ItemTemplate>
                            <span class="<%# Convert.ToBoolean(Eval("IsActive")) ? "text-success" : "text-muted" %>">
                                <i class="fas fa-<%# Convert.ToBoolean(Eval("IsActive")) ? "check-circle" : "times-circle" %>"></i>
                                <%# Convert.ToBoolean(Eval("IsActive")) ? "Yes" : "No" %>
                            </span>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Last Updated">
                        <ItemTemplate>
                            <%# Eval("UpdatedDate") != DBNull.Value ? 
                                Convert.ToDateTime(Eval("UpdatedDate")).ToString("MMM dd, yyyy") : 
                                (Eval("CreatedDate") != DBNull.Value ? Convert.ToDateTime(Eval("CreatedDate")).ToString("MMM dd, yyyy") : "N/A") %>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:CommandField ShowEditButton="True" HeaderText="Actions"
                        EditText="<i class='fas fa-edit'></i>"
                        UpdateText="<i class='fas fa-save'></i>"
                        CancelText="<i class='fas fa-times'></i>" />
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-home" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Home Sections Found</h3>
                        <p>No homepage sections are configured in the database.</p>
                    </div>
                </EmptyDataTemplate>
                <PagerSettings Mode="Numeric" Position="Bottom" />
                <PagerStyle CssClass="admin-pager" />
            </asp:GridView>
        </div>
    </div>

    <script type="text/javascript">
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function () {
            // Animate stats on page load
            setTimeout(() => {
                animateValue('projectsCount', 0, <%= GetProjectsCount() %>, 1000);
                animateValue('experienceCount', 0, <%= GetExperienceCount() %>, 1200);
                animateValue('skillsCount', 0, <%= GetSkillsCount() %>, 1400);
                animateValue('contactsCount', 0, <%= GetContactsCount() %>, 1600);
            }, 500);
        });

        function animateValue(id, start, end, duration) {
            const element = document.getElementById(id);
            if (!element) return;

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
                if (value == end) {
                    clearInterval(timer);
                }
            }

            timer = setInterval(run, stepTime);
            run();
        }
    </script>

    <style>
        .text-success {
            color: #10b981 !important;
        }

        .text-muted {
            color: var(--text-muted-dark) !important;
        }

        .admin-pager {
            text-align: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
        }

            .admin-pager table {
                margin: 0 auto;
            }

            .admin-pager td {
                padding: 0.5rem;
            }

            .admin-pager a,
            .admin-pager span {
                display: inline-block;
                padding: 0.5rem 0.75rem;
                margin: 0 0.25rem;
                border-radius: 0.375rem;
                text-decoration: none;
                color: var(--text-secondary-dark);
                border: 1px solid var(--border-dark);
            }

                .admin-pager a:hover {
                    background: var(--bg-glass-dark);
                    color: var(--color-primary);
                }

            .admin-pager span {
                background: var(--color-primary);
                color: white;
                border-color: var(--color-primary);
            }

        .admin-textarea {
            min-height: 100px;
            resize: vertical;
        }

        /* Custom styling for command field buttons */
        .admin-table a[href*="Edit"] {
            background: var(--bg-glass-dark);
            border: 1px solid var(--border-dark);
            color: var(--text-secondary-dark);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            text-decoration: none;
            margin: 0 0.25rem;
            display: inline-block;
            font-size: 0.75rem;
            transition: all 0.3s ease;
        }

            .admin-table a[href*="Edit"]:hover {
                background: var(--color-primary);
                color: white;
                transform: translateY(-1px);
            }

        .admin-table a[href*="Update"] {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            color: #10b981;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            text-decoration: none;
            margin: 0 0.25rem;
            display: inline-block;
            font-size: 0.75rem;
            transition: all 0.3s ease;
        }

            .admin-table a[href*="Update"]:hover {
                background: rgba(16, 185, 129, 0.2);
                transform: translateY(-1px);
            }

        .admin-table a[href*="Cancel"] {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #ef4444;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            text-decoration: none;
            margin: 0 0.25rem;
            display: inline-block;
            font-size: 0.75rem;
            transition: all 0.3s ease;
        }

            .admin-table a[href*="Cancel"]:hover {
                background: rgba(239, 68, 68, 0.2);
                transform: translateY(-1px);
            }

        .visitor-paragraph {
            font-size: 0.82rem; /* adjust to taste (e.g. 0.75rem — 0.95rem) */
            line-height: 1.15;
            margin: 0.12rem 0;
            color: var(--text-muted-dark);
        }
    </style>
</asp:Content>
