<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="portfolio-simple.aspx.cs" Inherits="admin_panel.portfolio_simple" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sarwad Hasan Siddiqui - Portfolio</title>
    <link href="Content/styles.css" rel="stylesheet" />
</head>
<body class="body-base">
    <form id="form1" runat="server">
        
        <!-- Home Section -->
        <section id="home" class="home-section">
            <div class="container">
                <div class="home-grid">
                    <div class="home-text-content">
                        <% if (HomeSections != null && HomeSections.Any()) { %>
                            <% foreach (var section in HomeSections.Where(s => s.SectionName == "Hero")) { %>
                                <div class="status-badge">
                                    <div class="status-dot"></div>
                                    <span class="status-text">Available for Hire</span>
                                </div>
                                
                                <div class="name-section">
                                    <h1 class="main-heading">SARWAD HASAN SIDDIQUI</h1>
                                </div>
                                
                                <div class="role-section">
                                    <h2 class="tagline">Full Stack Developer</h2>
                                    <p class="description">
                                        <%= section.Content ?? "Passionate about creating innovative solutions" %>
                                    </p>
                                </div>
                            <% } %>
                        <% } else { %>
                            <div class="status-badge">
                                <div class="status-dot"></div>
                                <span class="status-text">Available for Hire</span>
                            </div>
                            
                            <div class="name-section">
                                <h1 class="main-heading">SARWAD HASAN SIDDIQUI</h1>
                            </div>
                            
                            <div class="role-section">
                                <h2 class="tagline">Full Stack Developer</h2>
                                <p class="description">Passionate about creating innovative solutions</p>
                            </div>
                        <% } %>
                    </div>
                    
                    <div class="profile-display">
                        <div class="profile-container">
                            <img src="Images/profile.jpg" alt="Sarwad Hasan Siddiqui" class="profile-image" />
                        </div>
                        
                        <div class="social-links">
                            <% if (SocialLinks != null) { %>
                                <% foreach(var link in SocialLinks) { %>
                                    <a href="<%= link.URL %>" target="_blank" class="social-link">
                                        <%= link.Platform %>
                                    </a>
                                <% } %>
                            <% } %>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <div class="about-header">
                    <h2 class="about-title">About Me</h2>
                </div>
                
                <div class="about-content">
                    <% if (AboutMe != null) { %>
                        <h3><%= AboutMe.Title %></h3>
                        <p><%= AboutMe.Content %></p>
                    <% } else { %>
                        <h3>About Me</h3>
                        <p>Information loading...</p>
                    <% } %>
                </div>

                <% if (Strengths != null && Strengths.Any()) { %>
                    <div class="strengths-section">
                        <h3>My Strengths</h3>
                        <div class="strengths-grid">
                            <% foreach(var strength in Strengths) { %>
                                <div class="strength-item">
                                    <h4><%= strength.Title %></h4>
                                    <p><%= strength.Description %></p>
                                </div>
                            <% } %>
                        </div>
                    </div>
                <% } %>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills" class="section">
            <div class="container">
                <div class="skills-header">
                    <h1 class="section-title">Skills</h1>
                </div>
                
                <% if (Skills != null && Skills.Any()) { %>
                    <% foreach (var category in Skills.Select(s => s.Category).Distinct()) { %>
                        <div class="skills-category">
                            <h3><%= category %></h3>
                            <div class="skills-grid">
                                <% foreach (var skill in Skills.Where(s => s.Category == category)) { %>
                                    <div class="skill-item">
                                        <span><%= skill.SkillName %></span>
                                        <span>(<%= skill.Proficiency %>%)</span>
                                    </div>
                                <% } %>
                            </div>
                        </div>
                    <% } %>
                <% } else { %>
                    <p>Skills loading...</p>
                <% } %>
            </div>
        </section>

        <!-- Timeline Section -->
        <section id="timeline" class="section">
            <div class="container">
                <div class="timeline-header">
                    <h1 class="section-title">Timeline</h1>
                </div>
                
                <% if (Timeline != null && Timeline.Any()) { %>
                    <div class="timeline-content">
                        <% foreach(var item in Timeline) { %>
                            <div class="timeline-item">
                                <div class="timeline-year"><%= item.YearRange %></div>
                                <div class="timeline-title"><%= item.Title %></div>
                                <div class="timeline-location"><%= item.Location %></div>
                                <div class="timeline-description"><%= item.Description %></div>
                            </div>
                        <% } %>
                    </div>
                <% } else { %>
                    <p>Timeline loading...</p>
                <% } %>
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="section">
            <div class="container">
                <div class="projects-header">
                    <h1 class="section-title">Projects</h1>
                </div>
                
                <% if (Projects != null && Projects.Any()) { %>
                    <div class="projects-grid">
                        <% foreach(var project in Projects) { %>
                            <div class="project-card">
                                <h3><%= project.Title %></h3>
                                <p><%= project.Description %></p>
                                <div class="project-meta">
                                    <span>Year: <%= project.ProjectYear %></span>
                                    <span>Tech: <%= project.Technologies %></span>
                                </div>
                                <div class="project-links">
                                    <% if (!string.IsNullOrEmpty(project.DemoLink)) { %>
                                        <a href="<%= project.DemoLink %>" target="_blank">Demo</a>
                                    <% } %>
                                    <% if (!string.IsNullOrEmpty(project.SourceLink)) { %>
                                        <a href="<%= project.SourceLink %>" target="_blank">Source</a>
                                    <% } %>
                                </div>
                            </div>
                        <% } %>
                    </div>
                <% } else { %>
                    <p>Projects loading...</p>
                <% } %>
            </div>
        </section>

        <!-- Experience Section -->
        <section id="experience" class="section">
            <div class="container">
                <div class="experience-header">
                    <h1 class="section-title">Experience</h1>
                </div>
                
                <% if (Experiences != null && Experiences.Any()) { %>
                    <div class="experience-grid">
                        <% foreach(var exp in Experiences) { %>
                            <div class="experience-card">
                                <h3><%= exp.Position %> at <%= exp.Company %></h3>
                                <div class="experience-duration"><%= exp.Duration %></div>
                                <p><%= exp.Description %></p>
                            </div>
                        <% } %>
                    </div>
                <% } else { %>
                    <p>Experience loading...</p>
                <% } %>
            </div>
        </section>

        <!-- Blog Section -->
        <section id="blog" class="section">
            <div class="container">
                <div class="blog-header">
                    <h1 class="section-title">Blog</h1>
                </div>
                
                <% if (BlogPosts != null && BlogPosts.Any()) { %>
                    <div class="blog-grid">
                        <% foreach(var post in BlogPosts) { %>
                            <div class="blog-card">
                                <h3><%= post.Title %></h3>
                                <p><%= post.Excerpt %></p>
                                <div class="blog-meta">
                                    <span><%= post.PublishDate.ToString("MMM d, yyyy") %></span>
                                    <span><%= post.ReadTime %> min read</span>
                                </div>
                            </div>
                        <% } %>
                    </div>
                <% } else { %>
                    <p>Blog posts loading...</p>
                <% } %>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="section">
            <div class="container">
                <div class="contact-header">
                    <h1 class="section-title">Contact</h1>
                </div>
                
                <div class="contact-form">
                    <input type="text" name="name" placeholder="Your Name" required />
                    <input type="email" name="email" placeholder="Your Email" required />
                    <input type="text" name="subject" placeholder="Subject" />
                    <textarea name="message" placeholder="Your message..." rows="6" required></textarea>
                    <asp:Button runat="server" ID="btnSubmit" Text="SEND" CssClass="contact-submit-btn" OnClick="ContactSubmit_Click" />
                </div>
            </div>
        </section>

        <!-- Debug Info -->
        <div style="padding: 20px; background: #f0f0f0; margin: 20px;">
            <h3>Debug Information:</h3>
            <p>Home Sections: <%= HomeSections != null ? HomeSections.Count.ToString() : "null" %></p>
            <p>Social Links: <%= SocialLinks != null ? SocialLinks.Count.ToString() : "null" %></p>
            <p>Skills: <%= Skills != null ? Skills.Count.ToString() : "null" %></p>
            <p>Timeline: <%= Timeline != null ? Timeline.Count.ToString() : "null" %></p>
            <p>Projects: <%= Projects != null ? Projects.Count.ToString() : "null" %></p>
            <p>Experiences: <%= Experiences != null ? Experiences.Count.ToString() : "null" %></p>
            <p>Blog Posts: <%= BlogPosts != null ? BlogPosts.Count.ToString() : "null" %></p>
        </div>

    </form>
</body>
</html>