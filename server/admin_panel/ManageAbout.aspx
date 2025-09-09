<%@ Page Title="Manage About" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageAbout.aspx.cs" Inherits="admin_panel.ManageAbout" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- About Sections Management -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">
                    <asp:Label ID="lblSectionFormTitle" runat="server" Text="Add New About Section"></asp:Label>
                </h1>
                <p class="admin-card-subtitle">Manage about page sections and content</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-user-circle"></i>
            </div>
        </div>
        
        <!-- About Section Form -->
        <div class="admin-form-grid">
            <div class="admin-form-group">
                <label class="admin-form-label">Section Type *</label>
                <asp:DropDownList ID="ddlSectionType" runat="server" CssClass="admin-form-select">
                    <asp:ListItem Value="">Select Section Type</asp:ListItem>
                    <asp:ListItem Value="intro">Introduction</asp:ListItem>
                    <asp:ListItem Value="passion">Passion</asp:ListItem>
                    <asp:ListItem Value="skills">Skills Overview</asp:ListItem>
                    <asp:ListItem Value="databases">Database Experience</asp:ListItem>
                    <asp:ListItem Value="dream">Dream & Goals</asp:ListItem>
                </asp:DropDownList>
                <asp:RequiredFieldValidator ID="rfvSectionType" runat="server" 
                    ControlToValidate="ddlSectionType" ErrorMessage="Section type is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="SectionValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Title</label>
                <asp:TextBox ID="txtSectionTitle" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., About Me, My Passion" MaxLength="255"></asp:TextBox>
            </div>
            
            <div class="admin-form-group" style="grid-column: 1 / -1;">
                <label class="admin-form-label">Content</label>
                <asp:TextBox ID="txtSectionContent" runat="server" CssClass="admin-form-textarea" 
                            placeholder="Enter the section content..." TextMode="MultiLine" Rows="5"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Display Order</label>
                <asp:TextBox ID="txtSectionDisplayOrder" runat="server" CssClass="admin-form-input" 
                            placeholder="0" TextMode="Number" Text="0"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Status</label>
                <asp:DropDownList ID="ddlSectionStatus" runat="server" CssClass="admin-form-select">
                    <asp:ListItem Value="True" Selected="True">Active</asp:ListItem>
                    <asp:ListItem Value="False">Inactive</asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>
        
        <!-- Section Form Buttons -->
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <asp:Button ID="btnSaveSection" runat="server" Text="Save Section" 
                       CssClass="admin-btn admin-btn-primary" OnClick="btnSaveSection_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnCancelSection" runat="server" Text="Cancel" 
                       CssClass="admin-btn admin-btn-secondary" OnClick="btnCancelSection_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnDeleteSection" runat="server" Text="Delete" 
                       CssClass="admin-btn admin-btn-danger" OnClick="btnDeleteSection_Click" 
                       OnClientClick="return confirm('Are you sure you want to delete this section?');" 
                       CausesValidation="false" Visible="false" />
        </div>
        
        <!-- Hidden field for section ID -->
        <asp:HiddenField ID="hdnSectionId" runat="server" />
    </div>

    <!-- About Sections List -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">About Sections</h2>
                <p class="admin-card-subtitle">Manage your about page sections</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <asp:Button ID="btnRefreshSections" runat="server" Text="Refresh" 
                           CssClass="admin-btn admin-btn-secondary" OnClick="btnRefreshSections_Click" 
                           CausesValidation="false" />
            </div>
        </div>
        
        <div class="admin-table-container">
            <asp:GridView ID="gvSections" runat="server" AutoGenerateColumns="False" 
                         CssClass="admin-table" DataKeyNames="Id" 
                         OnRowCommand="gvSections_RowCommand" AllowPaging="true" PageSize="10"
                         OnPageIndexChanging="gvSections_PageIndexChanging">
                <Columns>
                    <asp:BoundField DataField="SectionType" HeaderText="Type" SortExpression="SectionType" />
                    <asp:BoundField DataField="Title" HeaderText="Title" SortExpression="Title" />
                    <asp:TemplateField HeaderText="Content">
                        <ItemTemplate>
                            <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <%# Eval("Content") %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="DisplayOrder" HeaderText="Order" />
                    <asp:TemplateField HeaderText="Status">
                        <ItemTemplate>
                            <span class="<%# Convert.ToBoolean(Eval("IsActive")) ? "text-success" : "text-muted" %>">
                                <%# Convert.ToBoolean(Eval("IsActive")) ? "Active" : "Inactive" %>
                            </span>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <asp:LinkButton ID="btnEditSection" runat="server" 
                                               CommandName="EditSection" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               ToolTip="Edit Section">
                                    <i class="fas fa-edit"></i>
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnDeleteSectionGrid" runat="server" 
                                               CommandName="DeleteSection" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               OnClientClick="return confirm('Are you sure you want to delete this section?');"
                                               ToolTip="Delete Section">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-user-circle" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No About Sections Found</h3>
                        <p>Start by adding your first about section above.</p>
                    </div>
                </EmptyDataTemplate>
                <PagerSettings Mode="Numeric" Position="Bottom" />
                <PagerStyle CssClass="admin-pager" />
            </asp:GridView>
        </div>
    </div>

    <!-- Strengths & Interests Management -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">
                    <asp:Label ID="lblStrengthFormTitle" runat="server" Text="Add New Strength/Interest"></asp:Label>
                </h1>
                <p class="admin-card-subtitle">Manage your strengths, interests, and goals</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-star"></i>
            </div>
        </div>
        
        <!-- Strengths/Interests Form -->
        <div class="admin-form-grid">
            <div class="admin-form-group">
                <label class="admin-form-label">Category *</label>
                <asp:DropDownList ID="ddlStrengthCategory" runat="server" CssClass="admin-form-select">
                    <asp:ListItem Value="">Select Category</asp:ListItem>
                    <asp:ListItem Value="Strengths">Strengths</asp:ListItem>
                    <asp:ListItem Value="Research Interests">Research Interests</asp:ListItem>
                    <asp:ListItem Value="Future Goals">Future Goals</asp:ListItem>
                    <asp:ListItem Value="Current Focus">Current Focus</asp:ListItem>
                </asp:DropDownList>
                <asp:RequiredFieldValidator ID="rfvStrengthCategory" runat="server" 
                    ControlToValidate="ddlStrengthCategory" ErrorMessage="Category is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="StrengthValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Name/Title *</label>
                <asp:TextBox ID="txtStrengthName" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., Problem Solving, Machine Learning" MaxLength="100"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvStrengthName" runat="server" 
                    ControlToValidate="txtStrengthName" ErrorMessage="Name is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="StrengthValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group" style="grid-column: 1 / -1;">
                <label class="admin-form-label">Description</label>
                <asp:TextBox ID="txtStrengthDescription" runat="server" CssClass="admin-form-textarea" 
                            placeholder="Describe this strength or interest..." TextMode="MultiLine" Rows="3" MaxLength="500"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Display Order</label>
                <asp:TextBox ID="txtStrengthDisplayOrder" runat="server" CssClass="admin-form-input" 
                            placeholder="0" TextMode="Number" Text="0"></asp:TextBox>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Status</label>
                <asp:DropDownList ID="ddlStrengthStatus" runat="server" CssClass="admin-form-select">
                    <asp:ListItem Value="True" Selected="True">Active</asp:ListItem>
                    <asp:ListItem Value="False">Inactive</asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>
        
        <!-- Strength Form Buttons -->
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <asp:Button ID="btnSaveStrength" runat="server" Text="Save Item" 
                       CssClass="admin-btn admin-btn-primary" OnClick="btnSaveStrength_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnCancelStrength" runat="server" Text="Cancel" 
                       CssClass="admin-btn admin-btn-secondary" OnClick="btnCancelStrength_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnDeleteStrength" runat="server" Text="Delete" 
                       CssClass="admin-btn admin-btn-danger" OnClick="btnDeleteStrength_Click" 
                       OnClientClick="return confirm('Are you sure you want to delete this item?');" 
                       CausesValidation="false" Visible="false" />
        </div>
        
        <!-- Hidden field for strength ID -->
        <asp:HiddenField ID="hdnStrengthId" runat="server" />
    </div>

    <!-- Strengths & Interests List -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Strengths & Interests</h2>
                <p class="admin-card-subtitle">Manage your professional strengths and interests</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <asp:Button ID="btnRefreshStrengths" runat="server" Text="Refresh" 
                           CssClass="admin-btn admin-btn-secondary" OnClick="btnRefreshStrengths_Click" 
                           CausesValidation="false" />
            </div>
        </div>
        
        <div class="admin-table-container">
            <asp:GridView ID="gvStrengths" runat="server" AutoGenerateColumns="False" 
                         CssClass="admin-table" DataKeyNames="Id" 
                         OnRowCommand="gvStrengths_RowCommand" AllowPaging="true" PageSize="10"
                         OnPageIndexChanging="gvStrengths_PageIndexChanging">
                <Columns>
                    <asp:BoundField DataField="Category" HeaderText="Category" SortExpression="Category" />
                    <asp:BoundField DataField="SkillName" HeaderText="Name" SortExpression="SkillName" />
                    <asp:TemplateField HeaderText="Description">
                        <ItemTemplate>
                            <div style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <%# Eval("Description") %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="DisplayOrder" HeaderText="Order" />
                    <asp:TemplateField HeaderText="Status">
                        <ItemTemplate>
                            <span class="<%# Convert.ToBoolean(Eval("IsActive")) ? "text-success" : "text-muted" %>">
                                <%# Convert.ToBoolean(Eval("IsActive")) ? "Active" : "Inactive" %>
                            </span>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <asp:LinkButton ID="btnEditStrength" runat="server" 
                                               CommandName="EditStrength" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               ToolTip="Edit Item">
                                    <i class="fas fa-edit"></i>
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnDeleteStrengthGrid" runat="server" 
                                               CommandName="DeleteStrength" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               OnClientClick="return confirm('Are you sure you want to delete this item?');"
                                               ToolTip="Delete Item">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-star" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Strengths/Interests Found</h3>
                        <p>Start by adding your first strength or interest above.</p>
                    </div>
                </EmptyDataTemplate>
                <PagerSettings Mode="Numeric" Position="Bottom" />
                <PagerStyle CssClass="admin-pager" />
            </asp:GridView>
        </div>
    </div>

    <!-- Success/Error Messages -->
    <div style="margin: 1rem 0;">
        <asp:Label ID="lblMessage" runat="server" CssClass="success-message" Visible="false"></asp:Label>
        <asp:Label ID="lblError" runat="server" CssClass="error-message" Visible="false"></asp:Label>
    </div>

    <style>
        .text-success { color: #10b981 !important; }
        .text-muted { color: var(--text-muted-dark) !important; }
        
        .admin-form-textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-dark);
            border-radius: 0.5rem;
            background: var(--bg-secondary-dark);
            color: var(--text-primary-dark);
            font-family: inherit;
            font-size: 0.875rem;
            resize: vertical;
            min-height: 100px;
        }

        .admin-form-textarea:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
