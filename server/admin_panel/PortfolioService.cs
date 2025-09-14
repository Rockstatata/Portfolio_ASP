using System;
using System.Collections.Generic;
using System.Linq;

namespace admin_panel
{
    public class PortfolioService
    {
        private readonly PortfolioDataService _dataService;

        public PortfolioService()
        {
            _dataService = new PortfolioDataService();
        }

        #region Portfolio Data Methods

        /// <summary>
        /// Gets the hero section content for the homepage
        /// </summary>
        public HomeSection GetHeroSection()
        {
            return _dataService.GetHomeSectionByName("Hero Section") ?? CreateDefaultHeroSection();
        }

        /// <summary>
        /// Gets the about section content
        /// </summary>
        public HomeSection GetAboutHomeSection()
        {
            return _dataService.GetHomeSectionByName("About Section") ?? CreateDefaultAboutSection();
        }

        /// <summary>
        /// Gets all active social links for footer/header
        /// </summary>
        public List<SocialLink> GetSocialLinks()
        {
            try
            {
                var links = _dataService.GetSocialLinks();
                if (links == null || !links.Any())
                {
                    links = CreateDefaultSocialLinks();
                }
                return links;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetSocialLinks: {ex.Message}");
                return CreateDefaultSocialLinks();
            }
        }

        /// <summary>
        /// Gets about information by section type
        /// </summary>
        public AboutSection GetAboutContent(string sectionType)
        {
            try
            {
                return _dataService.GetAboutSectionByType(sectionType);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetAboutContent: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Gets all about sections for the about page
        /// </summary>
        public List<AboutSection> GetAllAboutSections()
        {
            try
            {
                var sections = _dataService.GetAboutSections();
                return sections ?? new List<AboutSection>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetAllAboutSections: {ex.Message}");
                return new List<AboutSection>();
            }
        }

        /// <summary>
        /// Gets strengths for display
        /// </summary>
        public List<StrengthInterest> GetStrengths()
        {
            try
            {
                var items = _dataService.GetStrengthsInterestsByCategory("Strength");
                return items ?? new List<StrengthInterest>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetStrengths: {ex.Message}");
                return new List<StrengthInterest>();
            }
        }

        /// <summary>
        /// Gets interests for display
        /// </summary>
        public List<StrengthInterest> GetInterests()
        {
            try
            {
                var items = _dataService.GetStrengthsInterestsByCategory("Interest");
                return items ?? new List<StrengthInterest>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetInterests: {ex.Message}");
                return new List<StrengthInterest>();
            }
        }

        /// <summary>
        /// Gets research areas
        /// </summary>
        public List<StrengthInterest> GetResearchAreas()
        {
            try
            {
                var items = _dataService.GetStrengthsInterestsByCategory("Research");
                return items ?? new List<StrengthInterest>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetResearchAreas: {ex.Message}");
                return new List<StrengthInterest>();
            }
        }

        /// <summary>
        /// Gets future goals
        /// </summary>
        public List<StrengthInterest> GetFutureGoals()
        {
            try
            {
                var items = _dataService.GetStrengthsInterestsByCategory("Goal");
                return items ?? new List<StrengthInterest>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetFutureGoals: {ex.Message}");
                return new List<StrengthInterest>();
            }
        }

        /// <summary>
        /// Gets learning areas
        /// </summary>
        public List<StrengthInterest> GetLearningAreas()
        {
            try
            {
                var items = _dataService.GetStrengthsInterestsByCategory("Learning");
                return items ?? new List<StrengthInterest>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetLearningAreas: {ex.Message}");
                return new List<StrengthInterest>();
            }
        }

        /// <summary>
        /// Gets all skills grouped by category
        /// </summary>
        public Dictionary<string, List<Skill>> GetSkillsByCategory()
        {
            try
            {
                var allSkills = _dataService.GetSkills();
                if (allSkills == null || !allSkills.Any())
                {
                    return CreateDefaultSkills();
                }
                
                var groupedSkills = allSkills.GroupBy(s => s.Category)
                                            .ToDictionary(g => g.Key, g => g.ToList());
                
                if (!groupedSkills.Any())
                {
                    groupedSkills = CreateDefaultSkills();
                }
                
                return groupedSkills;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetSkillsByCategory: {ex.Message}");
                return CreateDefaultSkills();
            }
        }

        /// <summary>
        /// Gets skills for a specific category
        /// </summary>
        public List<Skill> GetSkillsByCategory(string category)
        {
            try
            {
                var skills = _dataService.GetSkillsByCategory(category);
                return skills ?? new List<Skill>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetSkillsByCategory({category}): {ex.Message}");
                return new List<Skill>();
            }
        }

        /// <summary>
        /// Gets education timeline items
        /// </summary>
        public List<TimelineItem> GetEducationTimeline()
        {
            try
            {
                var items = _dataService.GetTimelineItemsByType("Education");
                return items ?? new List<TimelineItem>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetEducationTimeline: {ex.Message}");
                return new List<TimelineItem>();
            }
        }

        /// <summary>
        /// Gets work timeline items
        /// </summary>
        public List<TimelineItem> GetWorkTimeline()
        {
            try
            {
                var items = _dataService.GetTimelineItemsByType("Work");
                return items ?? new List<TimelineItem>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetWorkTimeline: {ex.Message}");
                return new List<TimelineItem>();
            }
        }

        /// <summary>
        /// Gets all timeline items
        /// </summary>
        public List<TimelineItem> GetAllTimeline()
        {
            try
            {
                var items = _dataService.GetTimelineItems();
                return items ?? new List<TimelineItem>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetAllTimeline: {ex.Message}");
                return new List<TimelineItem>();
            }
        }

        /// <summary>
        /// Gets featured projects for homepage
        /// </summary>
        public List<Project> GetFeaturedProjects(int count = 6)
        {
            try
            {
                var projects = _dataService.GetFeaturedProjects(count);
                if (projects == null || !projects.Any())
                {
                    projects = CreateDefaultProjects().Take(count).ToList();
                }
                return projects;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetFeaturedProjects: {ex.Message}");
                // Return default projects if there's an error
                return CreateDefaultProjects().Take(count).ToList();
            }
        }

        /// <summary>
        /// Gets all projects
        /// </summary>
        public List<Project> GetAllProjects()
        {
            try
            {
                var projects = _dataService.GetProjects();
                if (projects == null || !projects.Any())
                {
                    projects = CreateDefaultProjects();
                }
                return projects;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetAllProjects: {ex.Message}");
                // Return default projects if there's an error
                return CreateDefaultProjects();
            }
        }

        /// <summary>
        /// Gets work experiences
        /// </summary>
        public List<Experience> GetExperiences()
        {
            try
            {
                var experiences = _dataService.GetExperiences();
                return experiences ?? new List<Experience>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetExperiences: {ex.Message}");
                return new List<Experience>();
            }
        }

        /// <summary>
        /// Gets recent blog posts for homepage
        /// </summary>
        public List<BlogPost> GetRecentBlogPosts(int count = 3)
        {
            try
            {
                var posts = _dataService.GetRecentBlogPosts(count);
                return posts ?? new List<BlogPost>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetRecentBlogPosts: {ex.Message}");
                return new List<BlogPost>();
            }
        }

        /// <summary>
        /// Gets all published blog posts
        /// </summary>
        public List<BlogPost> GetAllBlogPosts()
        {
            try
            {
                var posts = _dataService.GetBlogPosts();
                return posts ?? new List<BlogPost>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetAllBlogPosts: {ex.Message}");
                return new List<BlogPost>();
            }
        }

        /// <summary>
        /// Saves a contact form submission
        /// </summary>
        public bool SaveContactMessage(string name, string email, string subject, string message)
        {
            try
            {
                var contact = new Contact
                {
                    Name = name,
                    Email = email,
                    Subject = subject,
                    Message = message,
                    ReceivedDate = DateTime.Now,
                    IsRead = false,
                    Responded = false
                };

                return _dataService.SaveContact(contact);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in SaveContactMessage: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Gets a portfolio setting value
        /// </summary>
        public string GetSetting(string key, string defaultValue = "")
        {
            try
            {
                return _dataService.GetPortfolioSetting(key, defaultValue);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetSetting({key}): {ex.Message}");
                return defaultValue;
            }
        }

        /// <summary>
        /// Gets all portfolio settings
        /// </summary>
        public Dictionary<string, string> GetAllSettings()
        {
            try
            {
                var settings = _dataService.GetAllPortfolioSettings();
                return settings ?? new Dictionary<string, string>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in GetAllSettings: {ex.Message}");
                return new Dictionary<string, string>();
            }
        }

        #endregion

        #region Default Data Methods (Fallback when database is empty)

        private HomeSection CreateDefaultHeroSection()
        {
            return new HomeSection
            {
                Id = 1,
                SectionName = "Hero Section",
                Content = "Welcome to my portfolio! I'm a passionate developer creating innovative digital solutions.",
                ImagePath = "/images/hero-bg.jpg",
                DisplayOrder = 1
            };
        }

        private HomeSection CreateDefaultAboutSection()
        {
            return new HomeSection
            {
                Id = 2,
                SectionName = "About Section",
                Content = "I am a dedicated software developer with expertise in modern web technologies and a passion for creating innovative solutions.",
                ImagePath = "/images/about-bg.jpg",
                DisplayOrder = 2
            };
        }

        private List<SocialLink> CreateDefaultSocialLinks()
        {
            return new List<SocialLink>
            {
                new SocialLink { Id = 1, Platform = "GitHub", URL = "#", IconClass = "fab fa-github", DisplayOrder = 1 },
                new SocialLink { Id = 2, Platform = "LinkedIn", URL = "#", IconClass = "fab fa-linkedin", DisplayOrder = 2 },
                new SocialLink { Id = 3, Platform = "Twitter", URL = "#", IconClass = "fab fa-twitter", DisplayOrder = 3 },
                new SocialLink { Id = 4, Platform = "Email", URL = "mailto:your@email.com", IconClass = "fas fa-envelope", DisplayOrder = 4 }
            };
        }

        private Dictionary<string, List<Skill>> CreateDefaultSkills()
        {
            var skills = new Dictionary<string, List<Skill>>
            {
                ["Programming Languages"] = new List<Skill>
                {
                    new Skill { Id = 1, Category = "Programming Languages", SkillName = "C#", SkillIcon = "devicon-csharp-plain", Proficiency = 90, DisplayOrder = 1 },
                    new Skill { Id = 2, Category = "Programming Languages", SkillName = "JavaScript", SkillIcon = "devicon-javascript-plain", Proficiency = 85, DisplayOrder = 2 },
                    new Skill { Id = 3, Category = "Programming Languages", SkillName = "Python", SkillIcon = "devicon-python-plain", Proficiency = 80, DisplayOrder = 3 }
                },
                ["Web Technologies"] = new List<Skill>
                {
                    new Skill { Id = 4, Category = "Web Technologies", SkillName = "ASP.NET", SkillIcon = "devicon-dot-net-plain", Proficiency = 90, DisplayOrder = 1 },
                    new Skill { Id = 5, Category = "Web Technologies", SkillName = "HTML5", SkillIcon = "devicon-html5-plain", Proficiency = 95, DisplayOrder = 2 },
                    new Skill { Id = 6, Category = "Web Technologies", SkillName = "CSS3", SkillIcon = "devicon-css3-plain", Proficiency = 90, DisplayOrder = 3 }
                },
                ["Databases"] = new List<Skill>
                {
                    new Skill { Id = 7, Category = "Databases", SkillName = "SQL Server", SkillIcon = "devicon-microsoftsqlserver-plain", Proficiency = 85, DisplayOrder = 1 },
                    new Skill { Id = 8, Category = "Databases", SkillName = "MySQL", SkillIcon = "devicon-mysql-plain", Proficiency = 80, DisplayOrder = 2 }
                }
            };

            return skills;
        }

        private List<Project> CreateDefaultProjects()
        {
            return new List<Project>
            {
                new Project
                {
                    Id = 1,
                    Title = "Portfolio Website",
                    Description = "A responsive portfolio website built with ASP.NET Web Forms",
                    ImagePath = "/images/project-portfolio.jpg",
                    Technologies = "ASP.NET, C#, SQL Server, HTML5, CSS3, JavaScript",
                    ProjectYear = DateTime.Now.Year,
                    DemoLink = "#",
                    SourceLink = "#",
                    Status = "Completed",
                    DisplayOrder = 1
                },
                new Project
                {
                    Id = 2,
                    Title = "Admin Panel",
                    Description = "Content management system for portfolio administration",
                    ImagePath = "/images/project-admin.jpg",
                    Technologies = "ASP.NET, C#, SQL Server, Bootstrap",
                    ProjectYear = DateTime.Now.Year,
                    DemoLink = "#",
                    SourceLink = "#",
                    Status = "Completed",
                    DisplayOrder = 2
                }
            };
        }

        #endregion

        #region Utility Methods

        /// <summary>
        /// Checks if database tables exist
        /// </summary>
        public bool IsDatabaseReady()
        {
            try
            {
                var requiredTables = new[] { "HomeSections", "SocialLinks", "AboutSections", "Skills", "Projects" };
                foreach (var table in requiredTables)
                {
                    if (!_dataService.IsTableExists(table))
                    {
                        return false;
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Gets the current year for copyright
        /// </summary>
        public int GetCurrentYear()
        {
            return DateTime.Now.Year;
        }

        /// <summary>
        /// Formats a date for display
        /// </summary>
        public string FormatDate(DateTime? date, string format = "MMM yyyy")
        {
            return date?.ToString(format) ?? "N/A";
        }

        /// <summary>
        /// Truncates text to specified length
        /// </summary>
        public string TruncateText(string text, int maxLength)
        {
            if (string.IsNullOrEmpty(text) || text.Length <= maxLength)
                return text;

            return text.Substring(0, maxLength).Trim() + "...";
        }

        /// <summary>
        /// Splits technologies string into array
        /// </summary>
        public string[] GetTechnologiesArray(string technologies)
        {
            if (string.IsNullOrEmpty(technologies))
                return new string[0];

            return technologies.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                             .Select(t => t.Trim())
                             .ToArray();
        }

        #endregion
    }
}