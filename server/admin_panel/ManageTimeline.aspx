<%@ Page Title="Manage Timeline" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageTimeline.aspx.cs" Inherits="admin_panel.ManageTimeline" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Add/Edit Timeline Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">
                    <asp:Label ID="lblFormTitle" runat="server" Text="Add New Timeline Entry"></asp:Label>
                </h1>
                <p class="admin-card-subtitle">Create and manage your timeline events and milestones</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-clock"></i>
            </div>
        </div>
        
        <!-- Timeline Form -->
        <div class="admin-form-grid">
            <div class="admin-form-group">
                <label class="admin-form-label">Year Range *</label>
                <asp:TextBox ID="txtYearRange" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., 2020-2023, 2021, 2019-Present" MaxLength="50"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvYearRange" runat="server" 
                    ControlToValidate="txtYearRange" ErrorMessage="Year range is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="TimelineValidation"></asp:RequiredFieldValidator>
                <small class="admin-form-hint">Enter the time period (e.g., "2020-2023" or "2021")</small>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Title *</label>
                <asp:TextBox ID="txtTitle" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., Software Developer, Graduated College" MaxLength="255"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvTitle" runat="server" 
                    ControlToValidate="txtTitle" ErrorMessage="Title is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="TimelineValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Location</label>
                <asp:TextBox ID="txtLocation" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., New York, NY, Remote" MaxLength="255"></asp:TextBox>
                <small class="admin-form-hint">City, state, or "Remote" if applicable</small>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Type *</label>
                <asp:DropDownList ID="ddlType" runat="server" CssClass="admin-form-select">
                </asp:DropDownList>
                <asp:RequiredFieldValidator ID="rfvType" runat="server" 
                    ControlToValidate="ddlType" ErrorMessage="Type is required" InitialValue=""
                    CssClass="error-message" Display="Dynamic" ValidationGroup="TimelineValidation"></asp:RequiredFieldValidator>
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
                <small class="admin-form-hint">Lower numbers appear first</small>
            </div>
            
            <div class="admin-form-group full-width">
                <label class="admin-form-label">Description</label>
                <asp:TextBox ID="txtDescription" runat="server" CssClass="admin-form-textarea" 
                            TextMode="MultiLine" Rows="6" placeholder="Describe this timeline event, achievements, or key highlights..."></asp:TextBox>
                <small class="admin-form-hint">Detailed description of the event or milestone</small>
            </div>
        </div>
        
        <!-- Form Buttons -->
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <asp:Button ID="btnSave" runat="server" Text="Save Timeline Entry" 
                       CssClass="admin-btn admin-btn-primary" OnClick="btnSave_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnCancel" runat="server" Text="Cancel" 
                       CssClass="admin-btn admin-btn-secondary" OnClick="btnCancel_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnDelete" runat="server" Text="Delete" 
                       CssClass="admin-btn admin-btn-danger" OnClick="btnDelete_Click" 
                       OnClientClick="return confirm('Are you sure you want to delete this timeline entry?');" 
                       CausesValidation="false" Visible="false" />
        </div>
        
        <!-- Hidden field for timeline ID -->
        <asp:HiddenField ID="hdnTimelineId" runat="server" />
        
        <!-- Success/Error Messages -->
        <div style="margin-top: 1rem;">
            <asp:Label ID="lblMessage" runat="server" CssClass="success-message" Visible="false"></asp:Label>
            <asp:Label ID="lblError" runat="server" CssClass="error-message" Visible="false"></asp:Label>
        </div>
    </div>
    
    <!-- Timeline List Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Timeline Events</h2>
                <p class="admin-card-subtitle">Manage your life and career timeline</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <asp:Button ID="btnRefresh" runat="server" Text="Refresh" 
                           CssClass="admin-btn admin-btn-secondary" OnClick="btnRefresh_Click" 
                           CausesValidation="false" />
            </div>
        </div>
        
        <div class="admin-table-container">
            <asp:GridView ID="gvTimeline" runat="server" AutoGenerateColumns="False" 
                         CssClass="admin-table" DataKeyNames="Id" 
                         OnRowCommand="gvTimeline_RowCommand" AllowPaging="true" PageSize="10"
                         OnPageIndexChanging="gvTimeline_PageIndexChanging">
                <Columns>
                    <asp:BoundField DataField="YearRange" HeaderText="Year Range" SortExpression="YearRange" />
                    <asp:BoundField DataField="Title" HeaderText="Title" SortExpression="Title" />
                    <asp:BoundField DataField="Location" HeaderText="Location" />
                    <asp:BoundField DataField="Type" HeaderText="Type" />
                    <asp:TemplateField HeaderText="Description">
                        <ItemTemplate>
                            <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <%# Eval("Description") %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="Status" HeaderText="Status" />
                    <asp:BoundField DataField="DisplayOrder" HeaderText="Order" />
                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <asp:LinkButton ID="btnEdit" runat="server" 
                                               CommandName="EditTimeline" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               ToolTip="Edit Timeline Entry">
                                    <i class="fas fa-edit"></i>
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnDeleteTimeline" runat="server" 
                                               CommandName="DeleteTimeline" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               OnClientClick="return confirm('Are you sure you want to delete this timeline entry?');"
                                               ToolTip="Delete Timeline Entry">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-clock" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Timeline Events Found</h3>
                        <p>Start by adding your first timeline event above.</p>
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
