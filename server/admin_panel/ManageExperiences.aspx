<%@ Page Title="Manage Experience" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageExperiences.aspx.cs" Inherits="admin_panel.ManageExperiences" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Add/Edit Experience Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">
                    <asp:Label ID="lblFormTitle" runat="server" Text="Add New Experience"></asp:Label>
                </h1>
                <p class="admin-card-subtitle">Create and manage your work experience</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-briefcase"></i>
            </div>
        </div>
        
        <!-- Experience Form -->
        <div class="admin-form-grid">
            <div class="admin-form-group">
                <label class="admin-form-label">Company *</label>
                <asp:TextBox ID="txtCompany" runat="server" CssClass="admin-form-input" 
                            placeholder="Enter company name" MaxLength="255"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvCompany" runat="server" 
                    ControlToValidate="txtCompany" ErrorMessage="Company name is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="ExperienceValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Position *</label>
                <asp:TextBox ID="txtPosition" runat="server" CssClass="admin-form-input" 
                            placeholder="Enter position title" MaxLength="255"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvPosition" runat="server" 
                    ControlToValidate="txtPosition" ErrorMessage="Position is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="ExperienceValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Duration</label>
                <asp:TextBox ID="txtDuration" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., Jan 2020 - Dec 2022" MaxLength="100"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Status *</label>
                <asp:DropDownList ID="ddlStatus" runat="server" CssClass="admin-form-select">
                </asp:DropDownList>
            </div>
            
            <div class="admin-form-group full-width">
                <label class="admin-form-label">Description</label>
                <asp:TextBox ID="txtDescription" runat="server" CssClass="admin-form-textarea" 
                            TextMode="MultiLine" Rows="4" placeholder="Describe your role and the company..."></asp:TextBox>
            </div>
            
            <div class="admin-form-group full-width">
                <label class="admin-form-label">Responsibilities</label>
                <asp:TextBox ID="txtResponsibilities" runat="server" CssClass="admin-form-textarea" 
                            TextMode="MultiLine" Rows="6" placeholder="List your key responsibilities and achievements..."></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Display Order</label>
                <asp:TextBox ID="txtDisplayOrder" runat="server" CssClass="admin-form-input" 
                            placeholder="0" TextMode="Number" Text="0"></asp:TextBox>
            </div>
        </div>
        
        <!-- Form Buttons -->
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <asp:Button ID="btnSave" runat="server" Text="Save Experience" 
                       CssClass="admin-btn admin-btn-primary" OnClick="btnSave_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnCancel" runat="server" Text="Cancel" 
                       CssClass="admin-btn admin-btn-secondary" OnClick="btnCancel_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnDelete" runat="server" Text="Delete" 
                       CssClass="admin-btn admin-btn-danger" OnClick="btnDelete_Click" 
                       OnClientClick="return confirm('Are you sure you want to delete this experience?');" 
                       CausesValidation="false" Visible="false" />
        </div>
        
        <!-- Hidden field for experience ID -->
        <asp:HiddenField ID="hdnExperienceId" runat="server" />
        
        <!-- Success/Error Messages -->
        <div style="margin-top: 1rem;">
            <asp:Label ID="lblMessage" runat="server" CssClass="success-message" Visible="false"></asp:Label>
            <asp:Label ID="lblError" runat="server" CssClass="error-message" Visible="false"></asp:Label>
        </div>
    </div>
    
    <!-- Experience List Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Work Experience</h2>
                <p class="admin-card-subtitle">Manage your professional experience</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <asp:Button ID="btnRefresh" runat="server" Text="Refresh" 
                           CssClass="admin-btn admin-btn-secondary" OnClick="btnRefresh_Click" 
                           CausesValidation="false" />
            </div>
        </div>
        
        <div class="admin-table-container">
            <asp:GridView ID="gvExperience" runat="server" AutoGenerateColumns="False" 
                         CssClass="admin-table" DataKeyNames="Id" 
                         OnRowCommand="gvExperience_RowCommand" AllowPaging="true" PageSize="10"
                         OnPageIndexChanging="gvExperience_PageIndexChanging">
                <Columns>
                    <asp:BoundField DataField="Company" HeaderText="Company" SortExpression="Company" />
                    <asp:BoundField DataField="Position" HeaderText="Position" SortExpression="Position" />
                    <asp:BoundField DataField="Duration" HeaderText="Duration" />
                    <asp:BoundField DataField="Status" HeaderText="Status" />
                    <asp:TemplateField HeaderText="Description">
                        <ItemTemplate>
                            <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <%# Eval("Description") %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="DisplayOrder" HeaderText="Order" />
                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <asp:LinkButton ID="btnEdit" runat="server" 
                                               CommandName="EditExperience" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               ToolTip="Edit Experience">
                                    <i class="fas fa-edit"></i>
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnDeleteExperience" runat="server" 
                                               CommandName="DeleteExperience" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               OnClientClick="return confirm('Are you sure you want to delete this experience?');"
                                               ToolTip="Delete Experience">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-briefcase" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Experience Found</h3>
                        <p>Start by adding your first work experience above.</p>
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
