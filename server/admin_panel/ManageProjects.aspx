<%@ Page Title="Manage Projects" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageProjects.aspx.cs" Inherits="admin_panel.ManageProjects" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Add/Edit Project Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">
                    <asp:Label ID="lblFormTitle" runat="server" Text="Add New Project"></asp:Label>
                </h1>
                <p class="admin-card-subtitle">Create and manage your portfolio projects</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-briefcase"></i>
            </div>
        </div>
        
        <!-- Project Form -->
        <div class="admin-form-grid">
            <div class="admin-form-group">
                <label class="admin-form-label">Project Title *</label>
                <asp:TextBox ID="txtTitle" runat="server" CssClass="admin-form-input" 
                            placeholder="Enter project title" MaxLength="255"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvTitle" runat="server" 
                    ControlToValidate="txtTitle" ErrorMessage="Project title is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="ProjectValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Project Year</label>
                <asp:TextBox ID="txtProjectYear" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., 2024" TextMode="Number"></asp:TextBox>
                <asp:RangeValidator ID="rvProjectYear" runat="server" 
                    ControlToValidate="txtProjectYear" MinimumValue="2000" MaximumValue="2030" 
                    Type="Integer" ErrorMessage="Please enter a valid year (2000-2030)" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="ProjectValidation"></asp:RangeValidator>
            </div>
            
            <div class="admin-form-group full-width">
                <label class="admin-form-label">Description</label>
                <asp:TextBox ID="txtDescription" runat="server" CssClass="admin-form-textarea" 
                            TextMode="MultiLine" Rows="4" placeholder="Describe your project..."></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Technologies Used</label>
                <asp:TextBox ID="txtTechnologies" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., React, Node.js, MongoDB" MaxLength="500"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Status *</label>
                <asp:DropDownList ID="ddlStatus" runat="server" CssClass="admin-form-select">
                </asp:DropDownList>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Demo Link</label>
                <asp:TextBox ID="txtDemoLink" runat="server" CssClass="admin-form-input" 
                            placeholder="https://demo.example.com" MaxLength="255"></asp:TextBox>
                <asp:RegularExpressionValidator ID="revDemoLink" runat="server" 
                    ControlToValidate="txtDemoLink" 
                    ValidationExpression="^(https?://)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*/?$" 
                    ErrorMessage="Please enter a valid URL" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="ProjectValidation"></asp:RegularExpressionValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Source Code Link</label>
                <asp:TextBox ID="txtSourceLink" runat="server" CssClass="admin-form-input" 
                            placeholder="https://github.com/username/repo" MaxLength="255"></asp:TextBox>
                <asp:RegularExpressionValidator ID="revSourceLink" runat="server" 
                    ControlToValidate="txtSourceLink" 
                    ValidationExpression="^(https?://)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*/?$" 
                    ErrorMessage="Please enter a valid URL" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="ProjectValidation"></asp:RegularExpressionValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Image Path</label>
                <asp:TextBox ID="txtImagePath" runat="server" CssClass="admin-form-input" 
                            placeholder="/images/projects/project1.jpg" MaxLength="255"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Display Order</label>
                <asp:TextBox ID="txtDisplayOrder" runat="server" CssClass="admin-form-input" 
                            placeholder="0" TextMode="Number" Text="0"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Active Status</label>
                <asp:CheckBox ID="chkIsActive" runat="server" Text="  Active" Checked="true" />
            </div>
        </div>
        
        <!-- Form Buttons -->
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <asp:Button ID="btnSave" runat="server" Text="Save Project" 
                       CssClass="admin-btn admin-btn-primary" OnClick="btnSave_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnCancel" runat="server" Text="Cancel" 
                       CssClass="admin-btn admin-btn-secondary" OnClick="btnCancel_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnDelete" runat="server" Text="Delete" 
                       CssClass="admin-btn admin-btn-danger" OnClick="btnDelete_Click" 
                       OnClientClick="return confirm('Are you sure you want to delete this project?');" 
                       CausesValidation="false" Visible="false" />
        </div>
        
        <!-- Hidden field for project ID -->
        <asp:HiddenField ID="hdnProjectId" runat="server" />
        
        <!-- Success/Error Messages -->
        <div style="margin-top: 1rem;">
            <asp:Label ID="lblMessage" runat="server" CssClass="success-message" Visible="false"></asp:Label>
            <asp:Label ID="lblError" runat="server" CssClass="error-message" Visible="false"></asp:Label>
        </div>
    </div>
    
    <!-- Projects List Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Existing Projects</h2>
                <p class="admin-card-subtitle">Manage your portfolio projects</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <asp:Button ID="btnRefresh" runat="server" Text="Refresh" 
                           CssClass="admin-btn admin-btn-secondary" OnClick="btnRefresh_Click" 
                           CausesValidation="false" />
            </div>
        </div>
        
        <div class="admin-table-container">
            <asp:GridView ID="gvProjects" runat="server" AutoGenerateColumns="False" 
                         CssClass="admin-table" DataKeyNames="Id" 
                         OnRowCommand="gvProjects_RowCommand" AllowPaging="true" PageSize="10"
                         OnPageIndexChanging="gvProjects_PageIndexChanging">
                <Columns>
                    <asp:BoundField DataField="Title" HeaderText="Title" SortExpression="Title" />
                    <asp:BoundField DataField="Technologies" HeaderText="Technologies" />
                    <asp:BoundField DataField="ProjectYear" HeaderText="Year" />
                    <asp:BoundField DataField="Status" HeaderText="Status" />
                    <asp:TemplateField HeaderText="Active">
                        <ItemTemplate>
                            <span class="<%# Convert.ToBoolean(Eval("IsActive")) ? "text-success" : "text-muted" %>">
                                <i class="fas fa-<%# Convert.ToBoolean(Eval("IsActive")) ? "check-circle" : "times-circle" %>"></i>
                                <%# Convert.ToBoolean(Eval("IsActive")) ? "Yes" : "No" %>
                            </span>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Links">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <%# !string.IsNullOrEmpty(Eval("DemoLink")?.ToString()) ? 
                                    $"<a href='{Eval("DemoLink")}' target='_blank' class='admin-btn admin-btn-secondary' style='padding: 0.25rem 0.5rem; font-size: 0.75rem;'><i class='fas fa-external-link-alt'></i></a>" : "" %>
                                <%# !string.IsNullOrEmpty(Eval("SourceLink")?.ToString()) ? 
                                    $"<a href='{Eval("SourceLink")}' target='_blank' class='admin-btn admin-btn-secondary' style='padding: 0.25rem 0.5rem; font-size: 0.75rem;'><i class='fab fa-github'></i></a>" : "" %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <asp:LinkButton ID="btnEdit" runat="server" 
                                               CommandName="EditProject" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               ToolTip="Edit Project">
                                    <i class="fas fa-edit"></i>
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnDeleteProject" runat="server" 
                                               CommandName="DeleteProject" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               OnClientClick="return confirm('Are you sure you want to delete this project?');"
                                               ToolTip="Delete Project">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-briefcase" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Projects Found</h3>
                        <p>Start by adding your first project above.</p>
                    </div>
                </EmptyDataTemplate>
                <PagerSettings Mode="Numeric" Position="Bottom" />
                <PagerStyle CssClass="admin-pager" />
            </asp:GridView>
        </div>
    </div>

    <style>
        .text-success { color: #10b981 !important; }
        .text-muted { color: var(--text-muted-dark) !important; }
        
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
        
        .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        .success-message {
            color: #10b981;
            font-size: 0.875rem;
            padding: 0.75rem;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 0.5rem;
        }
    </style>
</asp:Content>
