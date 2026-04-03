<%@ Page Title="Manage Blogs" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageBlogs.aspx.cs" Inherits="admin_panel.ManageBlogs" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Add/Edit Blog Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h1 class="admin-card-title">
                    <asp:Label ID="lblFormTitle" runat="server" Text="Add New Blog Post"></asp:Label>
                </h1>
                <p class="admin-card-subtitle">Create and manage your blog posts and articles</p>
            </div>
            <div class="admin-stat-icon">
                <i class="fas fa-blog"></i>
            </div>
        </div>
        
        <!-- Blog Form -->
        <div class="admin-form-grid blog-form-layout">
            <!-- Top Row - Title and Status -->
            <div class="admin-form-group">
                <label class="admin-form-label">Title *</label>
                <asp:TextBox ID="txtTitle" runat="server" CssClass="admin-form-input blog-title-input" 
                            placeholder="Enter blog post title..." MaxLength="255"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvTitle" runat="server" 
                    ControlToValidate="txtTitle" ErrorMessage="Title is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="BlogValidation"></asp:RequiredFieldValidator>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Status</label>
                <asp:DropDownList ID="ddlStatus" runat="server" CssClass="admin-form-select">
                </asp:DropDownList>
            </div>
            
            <!-- Second Row - Categories and Tags -->
            <div class="admin-form-group">
                <label class="admin-form-label">Categories</label>
                <asp:TextBox ID="txtCategories" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., Technology, Programming, Web Development" MaxLength="500"></asp:TextBox>
                <small class="admin-form-hint">Separate multiple categories with commas</small>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Tags</label>
                <asp:TextBox ID="txtTags" runat="server" CssClass="admin-form-input" 
                            placeholder="e.g., C#, ASP.NET, JavaScript, React" MaxLength="500"></asp:TextBox>
                <small class="admin-form-hint">Separate multiple tags with commas</small>
            </div>
            
            <!-- Third Row - Publish Date, Read Time, and Image Path -->
            <div class="admin-form-group">
                <label class="admin-form-label">Publish Date</label>
                <asp:TextBox ID="txtPublishDate" runat="server" CssClass="admin-form-input" 
                            TextMode="DateTimeLocal"></asp:TextBox>
                <small class="admin-form-hint">Leave empty to use current date/time</small>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Read Time (minutes)</label>
                <asp:TextBox ID="txtReadTime" runat="server" CssClass="admin-form-input" 
                            placeholder="5" TextMode="Number" min="1" max="999"></asp:TextBox>
                <small class="admin-form-hint">Estimated reading time in minutes</small>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-form-label">Image Path</label>
                <asp:TextBox ID="txtImagePath" runat="server" CssClass="admin-form-input" 
                            placeholder="/images/blog/my-blog-post.jpg" MaxLength="500"></asp:TextBox>
                <small class="admin-form-hint">Path to the blog post featured image</small>
            </div>
            
            <!-- Excerpt Section - Full Width -->
            <div class="admin-form-group excerpt-section">
                <label class="admin-form-label">Excerpt</label>
                <asp:TextBox ID="txtExcerpt" runat="server" CssClass="admin-form-textarea blog-excerpt-editor" 
                            TextMode="MultiLine" Rows="4" MaxLength="500"
                            placeholder="Brief description or teaser for the blog post..."></asp:TextBox>
                <small class="admin-form-hint">Short summary that appears in blog listings (max 500 characters)</small>
            </div>
        </div>
        
        <!-- Content Editor Section - Dedicated Space -->
        <div class="blog-content-section">
            <div class="content-editor-header">
                <label class="admin-form-label content-label">Content *</label>
                <div class="content-editor-tools">
                    <small class="admin-form-hint">Full blog post content (supports HTML and Markdown)</small>
                    <div class="editor-controls">
                        <button type="button" class="editor-btn" onclick="insertFormatting('**', '**')" title="Bold">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button type="button" class="editor-btn" onclick="insertFormatting('*', '*')" title="Italic">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button type="button" class="editor-btn" onclick="insertFormatting('`', '`')" title="Code">
                            <i class="fas fa-code"></i>
                        </button>
                        <button type="button" class="editor-btn" onclick="insertFormatting('\n> ', '')" title="Quote">
                            <i class="fas fa-quote-right"></i>
                        </button>
                        <button type="button" class="editor-btn" onclick="insertFormatting('\n- ', '')" title="List">
                            <i class="fas fa-list"></i>
                        </button>
                        <button type="button" class="editor-btn" onclick="insertFormatting('[Link Text](', ')')" title="Link">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="content-editor-container">
                <asp:TextBox ID="txtContent" runat="server" CssClass="admin-form-textarea blog-content-editor" 
                            TextMode="MultiLine" Rows="25" placeholder="Write your blog post content here...

You can use Markdown formatting:
# Heading 1
## Heading 2
### Heading 3

**Bold text** or *italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

```code
Code block
```

> Quote block

[Link text](https://example.com)

---

Happy writing! 🚀"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvContent" runat="server" 
                    ControlToValidate="txtContent" ErrorMessage="Content is required" 
                    CssClass="error-message" Display="Dynamic" ValidationGroup="BlogValidation"></asp:RequiredFieldValidator>
            </div>
            
            <!-- Character Counter -->
            <div class="content-stats">
                <span id="charCount" class="stat-item">Characters: 0</span>
                <span id="wordCount" class="stat-item">Words: 0</span>
                <span id="readTimeCalc" class="stat-item">Est. read time: 0 min</span>
            </div>
        </div>
        
        <!-- Form Buttons -->
        <div class="form-actions">
            <asp:Button ID="btnSave" runat="server" Text="Save Blog Post" 
                       CssClass="admin-btn admin-btn-primary" OnClick="btnSave_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnCancel" runat="server" Text="Cancel" 
                       CssClass="admin-btn admin-btn-secondary" OnClick="btnCancel_Click" 
                       CausesValidation="false" />
            <asp:Button ID="btnDelete" runat="server" Text="Delete" 
                       CssClass="admin-btn admin-btn-danger" OnClick="btnDelete_Click" 
                       OnClientClick="return confirm('Are you sure you want to delete this blog post?');" 
                       CausesValidation="false" Visible="false" />
        </div>
        
        <!-- Hidden field for blog ID -->
        <asp:HiddenField ID="hdnBlogId" runat="server" />
        
        <!-- Success/Error Messages -->
        <div class="message-container">
            <asp:Label ID="lblMessage" runat="server" CssClass="success-message" Visible="false"></asp:Label>
            <asp:Label ID="lblError" runat="server" CssClass="error-message" Visible="false"></asp:Label>
        </div>
    </div>
    
    <!-- Blog Posts List Section -->
    <div class="admin-card">
        <div class="admin-card-header">
            <div>
                <h2 class="admin-card-title">Blog Posts</h2>
                <p class="admin-card-subtitle">Manage your published and draft blog posts</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <asp:Button ID="btnRefresh" runat="server" Text="Refresh" 
                           CssClass="admin-btn admin-btn-secondary" OnClick="btnRefresh_Click" 
                           CausesValidation="false" />
            </div>
        </div>
        
        <div class="admin-table-container">
            <asp:GridView ID="gvBlogs" runat="server" AutoGenerateColumns="False" 
                         CssClass="admin-table" DataKeyNames="Id" 
                         OnRowCommand="gvBlogs_RowCommand" AllowPaging="true" PageSize="10"
                         OnPageIndexChanging="gvBlogs_PageIndexChanging">
                <Columns>
                    <asp:BoundField DataField="Title" HeaderText="Title" SortExpression="Title" />
                    <asp:TemplateField HeaderText="Excerpt">
                        <ItemTemplate>
                            <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <%# Eval("Excerpt") %>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="Categories" HeaderText="Categories" />
                    <asp:BoundField DataField="Status" HeaderText="Status" />
                    <asp:TemplateField HeaderText="Publish Date">
                        <ItemTemplate>
                            <%# Eval("PublishDate") != DBNull.Value ? 
                                Convert.ToDateTime(Eval("PublishDate")).ToString("MMM dd, yyyy") : 
                                "Not Set" %>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="ReadTime" HeaderText="Read Time" />
                    <asp:TemplateField HeaderText="Created">
                        <ItemTemplate>
                            <%# Eval("CreatedAt") != DBNull.Value ? 
                                Convert.ToDateTime(Eval("CreatedAt")).ToString("MMM dd, yyyy") : 
                                "Unknown" %>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Actions">
                        <ItemTemplate>
                            <div style="display: flex; gap: 0.5rem;">
                                <asp:LinkButton ID="btnEdit" runat="server" 
                                               CommandName="EditBlog" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               ToolTip="Edit Blog Post">
                                    <i class="fas fa-edit"></i>
                                </asp:LinkButton>
                                <asp:LinkButton ID="btnDeleteBlog" runat="server" 
                                               CommandName="DeleteBlog" CommandArgument='<%# Eval("Id") %>'
                                               CssClass="admin-btn admin-btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                               OnClientClick="return confirm('Are you sure you want to delete this blog post?');"
                                               ToolTip="Delete Blog Post">
                                    <i class="fas fa-trash"></i>
                                </asp:LinkButton>
                            </div>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <EmptyDataTemplate>
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted-dark);">
                        <i class="fas fa-blog" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Blog Posts Found</h3>
                        <p>Start by creating your first blog post above.</p>
                    </div>
                </EmptyDataTemplate>
                <PagerSettings Mode="Numeric" Position="Bottom" />
                <PagerStyle CssClass="admin-pager" />
            </asp:GridView>
        </div>
    </div>

    <style>
        /* Enhanced Blog Form Layout */
        .blog-form-layout {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .blog-form-layout .admin-form-group:nth-child(1) {
            grid-column: 1 / 2;
        }
        
        .blog-form-layout .admin-form-group:nth-child(2) {
            grid-column: 2 / 3;
        }
        
        .blog-form-layout .admin-form-group:nth-child(3),
        .blog-form-layout .admin-form-group:nth-child(4) {
            grid-column: span 1;
        }
        
        .blog-form-layout .admin-form-group:nth-child(5),
        .blog-form-layout .admin-form-group:nth-child(6),
        .blog-form-layout .admin-form-group:nth-child(7) {
            grid-column: span 1;
        }
        
        .excerpt-section {
            grid-column: 1 / -1 !important;
        }
        
        /* Enhanced Title Input */
        .blog-title-input {
            font-size: 1.1rem;
            font-weight: 500;
            padding: 0.875rem;
        }
        
        /* Content Editor Section */
        .blog-content-section {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-dark);
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        
        .content-editor-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .content-label {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
        }
        
        .content-editor-tools {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
        }
        
        .editor-controls {
            display: flex;
            gap: 0.25rem;
            flex-wrap: wrap;
        }
        
        .editor-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border-dark);
            color: var(--text-secondary-dark);
            padding: 0.375rem 0.5rem;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.75rem;
        }
        
        .editor-btn:hover {
            background: var(--color-primary);
            color: white;
            border-color: var(--color-primary);
        }
        
        .content-editor-container {
            position: relative;
            width: 100%;
        }
        
        /* Enhanced Content Editor - FIXED WIDTH ISSUE */
        .blog-content-editor {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
            box-sizing: border-box !important;
            min-height: 600px !important;
            font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-size: 0.9rem !important;
            line-height: 1.7 !important;
            padding: 1.25rem !important;
            border: 2px solid var(--border-dark) !important;
            border-radius: 0.5rem !important;
            background: rgba(0, 0, 0, 0.2) !important;
            color: var(--text-primary-dark) !important;
            resize: vertical !important;
            transition: border-color 0.3s ease !important;
        }
        
        .blog-content-editor:focus {
            border-color: var(--color-primary) !important;
            box-shadow: 0 0 0 3px rgba(209, 77, 114, 0.1) !important;
            outline: none !important;
        }
        
        .blog-excerpt-editor {
            width: 100%;
            box-sizing: border-box;
            font-size: 0.9rem;
            line-height: 1.6;
            padding: 0.875rem;
            border: 1px solid var(--border-dark);
            background: rgba(255, 255, 255, 0.05);
        }
        
        /* Content Stats */
        .content-stats {
            display: flex;
            justify-content: space-between;
            margin-top: 0.75rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 0.375rem;
            border: 1px solid var(--border-dark);
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .stat-item {
            font-size: 0.8125rem;
            color: var(--text-muted-dark);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .stat-item:before {
            content: '';
            width: 6px;
            height: 6px;
            background: var(--color-primary);
            border-radius: 50%;
        }
        
        /* Form Actions */
        .form-actions {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 0.5rem;
            border: 1px solid var(--border-dark);
        }
        
        .message-container {
            margin-top: 1rem;
        }
        
        /* Enhanced Form Hints */
        .admin-form-hint {
            display: block;
            font-size: 0.75rem;
            color: var(--text-muted-dark);
            margin-top: 0.25rem;
            font-style: italic;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .blog-form-layout {
                grid-template-columns: 1fr;
            }
            
            .blog-form-layout .admin-form-group {
                grid-column: 1 !important;
            }
            
            .content-editor-header {
                flex-direction: column;
                align-items: stretch;
            }
            
            .content-editor-tools {
                align-items: stretch;
            }
            
            .editor-controls {
                justify-content: center;
            }
            
            .content-stats {
                flex-direction: column;
                text-align: center;
            }
            
            .form-actions {
                flex-direction: column;
            }
        }
        
        /* Existing Styles */
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

    <script type="text/javascript">
        // Content Editor Functions
        function insertFormatting(startTag, endTag) {
            var textArea = document.getElementById('<%= txtContent.ClientID %>');
            var start = textArea.selectionStart;
            var end = textArea.selectionEnd;
            var selectedText = textArea.value.substring(start, end);
            var replacement = startTag + selectedText + endTag;
            
            textArea.value = textArea.value.substring(0, start) + replacement + textArea.value.substring(end);
            textArea.focus();
            textArea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
            
            updateContentStats();
        }
        
        function updateContentStats() {
            var contentArea = document.getElementById('<%= txtContent.ClientID %>');
            var content = contentArea.value;
            var charCount = content.length;
            var wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
            var readTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed: 200 words per minute
            
            document.getElementById('charCount').textContent = 'Characters: ' + charCount.toLocaleString();
            document.getElementById('wordCount').textContent = 'Words: ' + wordCount.toLocaleString();
            document.getElementById('readTimeCalc').textContent = 'Est. read time: ' + readTime + ' min';
            
            // Auto-update read time field if it's empty
            var readTimeField = document.getElementById('<%= txtReadTime.ClientID %>');
            if (readTimeField && readTimeField.value === '') {
                readTimeField.value = readTime;
            }
        }
        
        // Initialize content stats on page load
        document.addEventListener('DOMContentLoaded', function() {
            var contentArea = document.getElementById('<%= txtContent.ClientID %>');
            if (contentArea) {
                contentArea.addEventListener('input', updateContentStats);
                contentArea.addEventListener('keyup', updateContentStats);
                updateContentStats(); // Initial load
            }
        });
    </script>
</asp:Content>
