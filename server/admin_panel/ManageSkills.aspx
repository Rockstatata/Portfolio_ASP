<%@ Page Title="Manage Skills" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageSkills.aspx.cs" Inherits="admin_panel.ManageSkills" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Add/Edit Skills Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">
                    <asp:Label ID="lblFormTitle" runat="server" Text="Add New Skill"></asp:Label>
                </h1>
                <p class="admin-card-subtitle">Create and manage your technical skills</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-code"></i>
            </div>
        </div>
        
        <!-- Skills Form -->
        <div class="admin-form-grid">
            <div class="admin-form-group">
                <label class="admin-form-label">Category *</label>
                <asp:TextBox ID="txtCategory" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., Programming Languages, Frameworks" MaxLength="100"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvCategory" runat="server" 
                    ControlToValidate="txtCategory" ErrorMessage="Category is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="SkillValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Skill Name *</label>
                <asp:TextBox ID="txtSkillName" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., C#, JavaScript, React" MaxLength="100"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvSkillName" runat="server" 
                    ControlToValidate="txtSkillName" ErrorMessage="Skill name is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="SkillValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Skill Icon</label>
                <asp:TextBox ID="txtSkillIcon" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., fab fa-js-square, fas fa-code" MaxLength="500"></asp:TextBox>
                <small class="admin-form-hint">Font Awesome icon class or icon URL</small>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Proficiency (1-100)</label>
                <asp:TextBox ID="txtProficiency" runat="server" CssClass="admin-form-input" 
                            placeholder="85" TextMode="Number" min="1" max="100"></asp:TextBox>
                <asp:RangeValidator ID="rvProficiency" runat="server" 
                    ControlToValidate="txtProficiency" Type="Integer" MinimumValue="1" MaximumValue="100"
                    ErrorMessage="Proficiency must be between 1 and 100" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="SkillValidation"></asp:RangeValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Status</label>
                <asp:DropDownList ID="ddlStatus" runat="server" CssClass="admin-form-select">
                </asp:DropDownList>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Display Order</label>
                <asp:TextBox ID="txtDisplayOrder" runat="server" CssClass="admin-form-input" 
                            placeholder="0" TextMode="Number" Text="0"></asp:TextBox>
            </div>
        </div>
        
        <!-- Form Buttons -->
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <asp:Button ID="btnSave" runat="server" Text="Save Skill" 
                       CssClass="admin-btn admin-btn-primary" OnClick="btnSave_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnCancel" runat="server" Text="Cancel" 
                       CssClass="admin-btn admin-btn-secondary" OnClick="btnCancel_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnDelete" runat="server" Text="Delete" 
                       CssClass="admin-btn admin-btn-danger" OnClick="btnDelete_Click" 
                       OnClientClick="return confirm('Are you sure you want to delete this skill?');" 
                       CausesValidation="false" Visible="false" />
        </div>
        
        <!-- Hidden field for skill ID -->
        <asp:HiddenField ID="hdnSkillId" runat="server" />
        
        <!-- Success/Error Messages -->
        <div style="margin-top: 1rem;">
            <asp:Label ID="lblMessage" runat="server" CssClass="success-message" Visible="false"></asp:Label>
            <asp:Label ID="lblError" runat="server" CssClass="error-message" Visible="false"></asp:Label>
        </div>
    </div>
    
    <!-- Skills List Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Skills Portfolio</h2>
                <p class="admin-card-subtitle">Manage your technical skills and proficiencies</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <asp:Button ID="btnRefresh" runat="server" Text="Refresh" 
                           CssClass="admin-btn admin-btn-secondary" OnClick="btnRefresh_Click" 
                           CausesValidation="false" />
            </div>
        </div>
        
        <div class="admin-table-container">
            <asp:GridView ID="gvSkills" runat="server" AutoGenerateColumns="False" 
                         CssClass="admin-table" DataKeyNames="Id" 
                         OnRowCommand="gvSkills_RowCommand" AllowPaging="true" PageSize="10"
                         OnPageIndexChanging="gvSkills_PageIndexChanging">
                <Columns>
                    <asp:BoundField DataField="Category" HeaderText="Category" SortExpression="Category" />
                    <asp:BoundField DataField="SkillName" HeaderText="Skill Name" SortExpression="SkillName" />
                    <asp:TemplateField HeaderText="Icon">
                        <ItemTemplate>
                            <div style="text-align: center;">
                                <%# !string.IsNullOrEmpty(Eval("SkillIcon")?.ToString()) ? 
                                    $"<i class='{Eval("SkillIcon")}' style='font-size: 1.5rem; color: var(--color-primary);'></i>" : 
                                    "<span style='color: var(--text-muted-dark);'>No Icon</span>" %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Proficiency">
                        <ItemTemplate>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="flex: 1; background: var(--bg-secondary-dark); height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="height: 100%; background: var(--color-primary); width: <%# Eval("Proficiency") ?? 0 %>%; transition: width 0.3s ease;"></div>
                                </div>
                                <span style="font-size: 0.75rem; color: var(--text-muted-dark); min-width: 30px;"><%# Eval("Proficiency") ?? 0 %>%</span>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="Status" HeaderText="Status" />
                    <asp:BoundField DataField="DisplayOrder" HeaderText="Order" />
                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <asp:LinkButton ID="btnEdit" runat="server" 
                                               CommandName="EditSkill" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               ToolTip="Edit Skill">
                                    <i class="fas fa-edit"></i>
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnDeleteSkill" runat="server" 
                                               CommandName="DeleteSkill" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               OnClientClick="return confirm('Are you sure you want to delete this skill?');"
                                               ToolTip="Delete Skill">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-code" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Skills Found</h3>
                        <p>Start by adding your first skill above.</p>
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
        
        .admin-form-hint {
            display: block;
            font-size: 0.75rem;
            color: var(--text-muted-dark);
            margin-top: 0.25rem;
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
