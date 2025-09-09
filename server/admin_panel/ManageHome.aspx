<%@ Page Title="Admin Dashboard" Language="C#" AutoEventWireup="true" CodeBehind="ManageHome.aspx.cs" Inherits="admin_panel.ManageHome" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Dashboard - Portfolio Admin Panel</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Admin Styles -->
    <link href="~/Content/adminstyles.css" rel="stylesheet" type="text/css" />
    
    <!-- Three.js and Vanta.js for animated background -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/tengbao/vanta/dist/vanta.net.min.js"></script>
</head>
<body class="admin-body">
    <!-- Vanta.js Background -->
    <div class="vanta-bg" id="vanta-bg"></div>
    
    <form id="form1" runat="server">
        <!-- Floating Navbar -->
        <div class="admin-navbar-container">
            <div class="admin-navbar-content">
                <div class="admin-navbar-flex">
                    <!-- Brand + Dashboard Merged -->
                    <div class="admin-navbar-brand">
                        <a href="ManageHome.aspx" class="admin-brand-dashboard-link nav-active">
                            <i class="fas fa-chart-line brand-icon"></i>
                            <span class="brand-dashboard-text">Dashboard</span>
                        </a>
                    </div>
                    
                    <!-- Desktop Navigation -->
                    <div class="admin-desktop-nav">
                        <a href="ManageProjects.aspx" class="admin-nav-link">
                            <i class="fas fa-briefcase"></i> <span class="nav-text">Projects</span>
                        </a>
                        <a href="ManageExperiences.aspx" class="admin-nav-link">
                            <i class="fas fa-building"></i> <span class="nav-text">Experience</span>
                        </a>
                        <a href="ManageSkills.aspx" class="admin-nav-link">
                            <i class="fas fa-code"></i> <span class="nav-text">Skills</span>
                        </a>
                        <a href="ManageTimeline.aspx" class="admin-nav-link">
                            <i class="fas fa-clock"></i> <span class="nav-text">Timeline</span>
                        </a>
                        <a href="ManageBlogs.aspx" class="admin-nav-link">
                            <i class="fas fa-blog"></i> <span class="nav-text">Blogs</span>
                        </a>
                        <a href="ManageContacts.aspx" class="admin-nav-link">
                            <i class="fas fa-envelope"></i> <span class="nav-text">Contacts</span>
                        </a>
                        <a href="ManageAbout.aspx" class="admin-nav-link">
                            <i class="fas fa-user"></i> <span class="nav-text">About</span>
                        </a>
                    </div>
                    
                    <!-- User Actions -->
                    <div class="admin-nav-actions">
                        <div class="admin-user-info">
                            <div class="admin-user-avatar">
                                A
                            </div>
                        </div>
                        <a href="Login.aspx?logout=1" class="admin-logout-btn">
                            <i class="fas fa-sign-out-alt"></i>
                        </a>
                        
                        <!-- Mobile Menu Toggle -->
                        <button type="button" class="admin-mobile-menu-toggle" onclick="toggleMobileMenu()">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Menu -->
                <div id="mobile-menu" class="admin-mobile-menu hidden">
                    <div class="mobile-menu-content">
                        <a href="ManageHome.aspx" class="mobile-nav-link nav-active">
                            <i class="fas fa-home"></i> Dashboard
                        </a>
                        <a href="ManageProjects.aspx" class="mobile-nav-link">
                            <i class="fas fa-briefcase"></i> Projects
                        </a>
                        <a href="ManageExperiences.aspx" class="mobile-nav-link">
                            <i class="fas fa-building"></i> Experience
                        </a>
                        <a href="ManageSkills.aspx" class="mobile-nav-link">
                            <i class="fas fa-code"></i> Skills
                        </a>
                        <a href="ManageTimeline.aspx" class="mobile-nav-link">
                            <i class="fas fa-clock"></i> Timeline
                        </a>
                        <a href="ManageBlogs.aspx" class="mobile-nav-link">
                            <i class="fas fa-blog"></i> Blogs
                        </a>
                        <a href="ManageContacts.aspx" class="mobile-nav-link">
                            <i class="fas fa-envelope"></i> Contacts
                        </a>
                        <a href="ManageAbout.aspx" class="mobile-nav-link">
                            <i class="fas fa-user"></i> About
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="admin-main-content">
            <div class="admin-container">
                <!-- Welcome Section -->
                <div class="admin-card">
                    <div class="admin-card-header">
                        <div>
                            <h1 class="admin-card-title">Welcome back, <%= GetCurrentAdminUsername() %>!</h1>
                            <p class="admin-card-subtitle">Here's what's happening with your portfolio today.</p>
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
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="admin-card">
                    <div class="admin-card-header">
                        <div>
                            <h2 class="admin-card-title">Quick Actions</h2>
                            <p class="admin-card-subtitle">Manage your portfolio content efficiently</p>
                        </div>
                    </div>
                    
                    <div class="admin-dashboard-grid">
                        <a href="ManageProjects.aspx" class="admin-stat-card admin-action-card">
                            <div class="admin-stat-icon">
                                <i class="fas fa-plus"></i>
                            </div>
                            <div class="admin-stat-label">Add New Project</div>
                        </a>
                        
                        <a href="ManageExperiences.aspx" class="admin-stat-card admin-action-card">
                            <div class="admin-stat-icon">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <div class="admin-stat-label">Update Experience</div>
                        </a>
                        
                        <a href="ManageSkills.aspx" class="admin-stat-card admin-action-card">
                            <div class="admin-stat-icon">
                                <i class="fas fa-cogs"></i>
                            </div>
                            <div class="admin-stat-label">Manage Skills</div>
                        </a>
                        
                        <a href="ManageBlogs.aspx" class="admin-stat-card admin-action-card">
                            <div class="admin-stat-icon">
                                <i class="fas fa-blog"></i>
                            </div>
                            <div class="admin-stat-label">Write Blog Post</div>
                        </a>
                        
                        <a href="ManageContacts.aspx" class="admin-stat-card admin-action-card">
                            <div class="admin-stat-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <div class="admin-stat-label">View Messages</div>
                        </a>
                        
                        <a href="ManageAbout.aspx" class="admin-stat-card admin-action-card">
                            <div class="admin-stat-icon">
                                <i class="fas fa-user-edit"></i>
                            </div>
                            <div class="admin-stat-label">Update About</div>
                        </a>
                    </div>
                </div>
                
                <!-- Home Sections Management -->
                <div class="admin-card">
                    <div class="admin-card-header">
                        <div>
                            <h2 class="admin-card-title">Home Page Sections</h2>
                            <p class="admin-card-subtitle">Manage your portfolio homepage content</p>
                        </div>
                    </div>
                    
                    <div class="admin-table-container">
                        <asp:GridView ID="gvHomeSections" runat="server" AutoGenerateColumns="False"
                            OnRowEditing="gvHomeSections_RowEditing" OnRowUpdating="gvHomeSections_RowUpdating"
                            OnRowCancelingEdit="gvHomeSections_RowCancelingEdit" DataKeyNames="Id"
                            CssClass="admin-table">
                            <Columns>
                                <asp:BoundField DataField="SectionName" HeaderText="Section" ReadOnly="true" />
                                <asp:TemplateField HeaderText="Content">
                                    <ItemTemplate>
                                        <asp:Label ID="lblContent" runat="server" Text='<%# Eval("Content") %>'></asp:Label>
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox ID="txtContent" runat="server" Text='<%# Eval("Content") %>'
                                            TextMode="MultiLine" Rows="3" CssClass="admin-form-input admin-textarea"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateField>
                                <asp:CheckBoxField DataField="IsActive" HeaderText="Active" />
                                <asp:CommandField ShowEditButton="True" />
                            </Columns>
                        </asp:GridView>
                    </div>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
            // Initialize Vanta.js background with proper configuration
            function initVantaBackground() {
                if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
                    setTimeout(initVantaBackground, 100);
                    return;
                }

                try {
                    // Destroy existing instance if any
                    if (window.vantaEffect) {
                        window.vantaEffect.destroy();
                    }

                    // Check device capabilities
                    const isMobile = window.innerWidth < 768;
                    const isLowPerformance = navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;

                    window.vantaEffect = VANTA.NET({
                        el: "#vanta-bg",
                        mouseControls: !isMobile,
                        touchControls: isMobile,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: isMobile ? 0.8 : 1.0,
                        scaleMobile: 0.7,
                        color: 0xd14d72, // Portfolio primary color
                        backgroundColor: 0x1a1625, // Portfolio background
                        points: isMobile || isLowPerformance ? 6 : 10,
                        maxDistance: isMobile ? 18 : 25,
                        spacing: isMobile ? 20 : 16,
                        showDots: !isMobile
                    });

                    console.log('✅ Vanta.js initialized successfully');
                } catch (error) {
                    console.error('❌ Vanta.js initialization failed:', error);
                    // Fallback background
                    document.getElementById('vanta-bg').style.background = 
                        'linear-gradient(135deg, #1a1625 0%, #2d1b4e 50%, #1a1625 100%)';
                }
            }

            // Initialize on page load
            document.addEventListener('DOMContentLoaded', function() {
                initVantaBackground();
                
                // Animate stats on page load
                setTimeout(() => {
                    animateValue('projectsCount', 0, <%= GetProjectsCount() %>, 1000);
                    animateValue('experienceCount', 0, <%= GetExperienceCount() %>, 1200);
                    animateValue('skillsCount', 0, <%= GetSkillsCount() %>, 1400);
                    animateValue('contactsCount', 0, <%= GetContactsCount() %>, 1600);
                }, 500);
            });

            // Resize handler
            window.addEventListener('resize', function() {
                if (window.vantaEffect && typeof window.vantaEffect.resize === 'function') {
                    window.vantaEffect.resize();
                }
            });

            // Toggle mobile menu
            function toggleMobileMenu() {
                const menu = document.getElementById('mobile-menu');
                const toggle = document.querySelector('.admin-mobile-menu-toggle');
                
                if (menu) {
                    menu.classList.toggle('hidden');
                    
                    // Update aria attributes
                    const isOpen = !menu.classList.contains('hidden');
                    toggle.setAttribute('aria-expanded', isOpen);
                    menu.setAttribute('aria-hidden', !isOpen);
                    
                    // Close on click outside
                    if (isOpen) {
                        document.addEventListener('click', closeMobileMenuOnOutsideClick);
                    } else {
                        document.removeEventListener('click', closeMobileMenuOnOutsideClick);
                    }
                }
            }

            function closeMobileMenuOnOutsideClick(e) {
                const menu = document.getElementById('mobile-menu');
                const toggle = document.querySelector('.admin-mobile-menu-toggle');
                
                if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                    menu.classList.add('hidden');
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.setAttribute('aria-hidden', 'true');
                    document.removeEventListener('click', closeMobileMenuOnOutsideClick);
                }
            }
            
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
    </form>
</body>
</html>
