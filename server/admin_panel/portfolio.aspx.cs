using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace admin_panel
{
    public partial class portfolio : System.Web.UI.Page
    {
        protected PortfolioService portfolioService;
        
        // Data properties for use in the ASPX page
        public HomeSection HeroSection { get; private set; }
        public HomeSection AboutHomeSection { get; private set; }
        public List<SocialLink> SocialLinks { get; private set; }
        public List<AboutSection> AboutSections { get; private set; }
        public List<StrengthInterest> Strengths { get; private set; }
        public List<StrengthInterest> Interests { get; private set; }
        public List<StrengthInterest> ResearchAreas { get; private set; }
        public List<StrengthInterest> FutureGoals { get; private set; }
        public List<StrengthInterest> LearningAreas { get; private set; }
        public Dictionary<string, List<Skill>> SkillsByCategory { get; private set; }
        public List<TimelineItem> EducationTimeline { get; private set; }
        public List<TimelineItem> WorkTimeline { get; private set; }
        public List<TimelineItem> AllTimeline { get; private set; }
        public List<Project> FeaturedProjects { get; private set; }
        public List<Project> AllProjects { get; private set; }
        public List<Experience> Experiences { get; private set; }
        public List<BlogPost> RecentBlogPosts { get; private set; }
        public Dictionary<string, string> Settings { get; private set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                // Initialize the portfolio service
                portfolioService = new PortfolioService();
                
                if (!IsPostBack)
                {
                    LoadPortfolioData();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in Portfolio Page_Load: {ex.Message}");
                // Load default data on error
                LoadDefaultData();
            }
        }

        private void LoadPortfolioData()
        {
            try
            {
                // Initialize with default data first
                LoadDefaultData();
                
                // Load Hero and About sections
                try { HeroSection = portfolioService.GetHeroSection() ?? HeroSection; } catch { }
                try { AboutHomeSection = portfolioService.GetAboutHomeSection() ?? AboutHomeSection; } catch { }
                
                // Load Social Links
                try { SocialLinks = portfolioService.GetSocialLinks() ?? SocialLinks; } catch { }
                
                // Load About sections
                try { AboutSections = portfolioService.GetAllAboutSections() ?? AboutSections; } catch { }
                
                // Load Strengths & Interests
                try { Strengths = portfolioService.GetStrengths() ?? Strengths; } catch { }
                try { Interests = portfolioService.GetInterests() ?? Interests; } catch { }
                try { ResearchAreas = portfolioService.GetResearchAreas() ?? ResearchAreas; } catch { }
                try { FutureGoals = portfolioService.GetFutureGoals() ?? FutureGoals; } catch { }
                try { LearningAreas = portfolioService.GetLearningAreas() ?? LearningAreas; } catch { }
                
                // Load Skills
                try { SkillsByCategory = portfolioService.GetSkillsByCategory() ?? SkillsByCategory; } catch { }
                
                // Load Timeline
                try { EducationTimeline = portfolioService.GetEducationTimeline() ?? EducationTimeline; } catch { }
                try { WorkTimeline = portfolioService.GetWorkTimeline() ?? WorkTimeline; } catch { }
                try { AllTimeline = portfolioService.GetAllTimeline() ?? AllTimeline; } catch { }
                
                // Load Projects - ensure they're never null
                try 
                { 
                    var featuredProjects = portfolioService.GetFeaturedProjects(6);
                    FeaturedProjects = featuredProjects ?? new List<Project>();
                } 
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Error loading featured projects: {ex.Message}");
                    FeaturedProjects = new List<Project>();
                }
                
                try 
                { 
                    var allProjects = portfolioService.GetAllProjects();
                    AllProjects = allProjects ?? new List<Project>();
                } 
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Error loading all projects: {ex.Message}");
                    AllProjects = new List<Project>();
                }
                
                // Load Experience
                try { Experiences = portfolioService.GetExperiences() ?? Experiences; } catch { }
                
                // Load Blog Posts
                try { RecentBlogPosts = portfolioService.GetRecentBlogPosts(3) ?? RecentBlogPosts; } catch { }
                
                // Load Settings
                try { Settings = portfolioService.GetAllSettings() ?? Settings; } catch { }
                
                System.Diagnostics.Debug.WriteLine("Portfolio data loaded successfully");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading portfolio data: {ex.Message}");
                // LoadDefaultData was already called, so we're safe
            }
        }

        private void LoadDefaultData()
        {
            // Initialize with empty or default data to prevent null reference errors
            HeroSection = new HomeSection
            {
                SectionName = "Hero Section",
                Content = "Welcome to my portfolio! I'm a passionate developer creating innovative digital solutions.",
                ImagePath = "/images/hero-bg.jpg"
            };

            AboutHomeSection = new HomeSection
            {
                SectionName = "About Section",
                Content = "I am a dedicated software developer with expertise in modern web technologies.",
                ImagePath = "/images/about-bg.jpg"
            };

            SocialLinks = new List<SocialLink>();
            AboutSections = new List<AboutSection>();
            Strengths = new List<StrengthInterest>();
            Interests = new List<StrengthInterest>();
            ResearchAreas = new List<StrengthInterest>();
            FutureGoals = new List<StrengthInterest>();
            LearningAreas = new List<StrengthInterest>();
            SkillsByCategory = new Dictionary<string, List<Skill>>();
            EducationTimeline = new List<TimelineItem>();
            WorkTimeline = new List<TimelineItem>();
            AllTimeline = new List<TimelineItem>();
            
            // Initialize with empty lists to prevent null reference errors
            FeaturedProjects = new List<Project>();
            AllProjects = new List<Project>();
            Experiences = new List<Experience>();
            RecentBlogPosts = new List<BlogPost>();
            Settings = new Dictionary<string, string>();
        }

        #region Contact Form Handler

        protected void SubmitContact_Click(object sender, EventArgs e)
        {
            try
            {
                // Get form values from server controls
                string name = txtName.Text.Trim();
                string email = txtEmail.Text.Trim();
                string subject = txtSubject.Text.Trim();
                string message = txtMessage.Text.Trim();

                // Validate required fields
                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(message))
                {
                    // Show validation error
                    ClientScript.RegisterStartupScript(this.GetType(), "contactValidation", 
                        "alert('Please fill in all required fields (Name, Email, and Message).');", true);
                    return;
                }

                // Validate email format
                if (!IsValidEmail(email))
                {
                    ClientScript.RegisterStartupScript(this.GetType(), "contactValidation", 
                        "alert('Please enter a valid email address.');", true);
                    return;
                }

                // Save contact message using the portfolio service
                bool success = portfolioService.SaveContactMessage(name, email, subject, message);
                
                if (success)
                {
                    // Clear form fields
                    txtName.Text = "";
                    txtEmail.Text = "";
                    txtSubject.Text = "";
                    txtMessage.Text = "";
                    
                    // Show success message
                    ClientScript.RegisterStartupScript(this.GetType(), "contactSuccess", 
                        "alert('Thank you for your message! I will get back to you soon.');", true);
                }
                else
                {
                    // Show error message
                    ClientScript.RegisterStartupScript(this.GetType(), "contactError", 
                        "alert('Sorry, there was an error sending your message. Please try again.');", true);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error submitting contact form: {ex.Message}");
                ClientScript.RegisterStartupScript(this.GetType(), "contactError", 
                    "alert('Sorry, there was an error sending your message. Please try again.');", true);
            }
        }

        /// <summary>
        /// Validates email format using basic regex
        /// </summary>
        private bool IsValidEmail(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email)) return false;
                
                // Simple email validation
                return email.Contains("@") && email.Contains(".") && 
                       email.IndexOf("@") < email.LastIndexOf(".") &&
                       email.IndexOf("@") > 0 &&
                       email.LastIndexOf(".") < email.Length - 1;
            }
            catch
            {
                return false;
            }
        }

        #endregion

        #region Helper Methods for ASPX Page

        /// <summary>
        /// Gets a setting value with a default fallback
        /// </summary>
        public string GetSetting(string key, string defaultValue = "")
        {
            if (Settings != null && Settings.ContainsKey(key))
                return Settings[key];
            return defaultValue;
        }

        /// <summary>
        /// Formats a date for display
        /// </summary>
        public string FormatDate(DateTime? date, string format = "MMM yyyy")
        {
            return date?.ToString(format) ?? "N/A";
        }

        /// <summary>
        /// Gets the current year for copyright
        /// </summary>
        public int CurrentYear
        {
            get { return DateTime.Now.Year; }
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
        /// Splits technologies string into array for display
        /// </summary>
        public string[] GetTechnologies(string technologies)
        {
            if (string.IsNullOrEmpty(technologies))
                return new string[0];

            return technologies.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                             .Select(t => t.Trim())
                             .ToArray();
        }

        /// <summary>
        /// Encodes HTML to prevent XSS
        /// </summary>
        public string EncodeHtml(string text)
        {
            return HttpUtility.HtmlEncode(text ?? "");
        }

        /// <summary>
        /// Encodes HTML attribute values
        /// </summary>
        public string EncodeAttribute(string text)
        {
            return HttpUtility.HtmlAttributeEncode(text ?? "");
        }

        #endregion
    }
}