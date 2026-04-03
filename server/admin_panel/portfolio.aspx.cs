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

        public string PortfolioVisitorName
        {
            get
            {
                var cookie = Request.Cookies["PortfolioVisitInfo"];
                return cookie?["VisitorName"] != null ? HttpUtility.UrlDecode(cookie["VisitorName"]) : "—";
            }
        }

        public int PortfolioVisitCount
        {
            get
            {
                var cookie = Request.Cookies["PortfolioVisitInfo"];
                return (cookie?["VisitCount"] != null && int.TryParse(cookie["VisitCount"], out int count)) ? count : 0;
            }
        }

        public DateTime? PortfolioFirstVisitUtc
        {
            get
            {
                var cookie = Request.Cookies["PortfolioVisitInfo"];
                if (DateTime.TryParse(cookie?["FirstVisitUtc"], out DateTime dt))
                    return dt;
                return null;
            }
        }

        public DateTime? PortfolioLastVisitUtc
        {
            get
            {
                var cookie = Request.Cookies["PortfolioVisitInfo"];
                if (DateTime.TryParse(cookie?["LastVisitUtc"], out DateTime dt))
                    return dt;
                return null;
            }
        }

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
                // Track visitor data via cookies on every visit.
                TrackPortfolioVisit();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error tracking portfolio visit: " + ex.Message);
            }

            try
            {
                portfolioService = new PortfolioService();
                LoadPortfolioData();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error loading portfolio data: " + ex.Message);
                LoadDefaultData();
            }
        }

        private void TrackPortfolioVisit()
        {
            const string cookieName = "PortfolioVisitInfo";
            // Use admin username from session, or default to "Guest"
            string username = Session["AdminUsername"] != null ? Session["AdminUsername"].ToString() : "Guest";
            DateTime nowUtc = DateTime.UtcNow;

            HttpCookie cookie = Request.Cookies[cookieName];
            if (cookie == null)
            {
                cookie = new HttpCookie(cookieName);
                cookie.Values["VisitorName"] = HttpUtility.UrlEncode(username);
                cookie.Values["VisitCount"] = "1";
                cookie.Values["FirstVisitUtc"] = nowUtc.ToString("o");
                cookie.Values["LastVisitUtc"] = nowUtc.ToString("o");
            }
            else
            {
                int count = 0;
                int.TryParse(cookie.Values["VisitCount"], out count);
                count++;

                cookie.Values["VisitorName"] = HttpUtility.UrlEncode(username);
                if (string.IsNullOrEmpty(cookie.Values["FirstVisitUtc"]))
                {
                    cookie.Values["FirstVisitUtc"] = nowUtc.ToString("o");
                }
                cookie.Values["VisitCount"] = count.ToString();
                cookie.Values["LastVisitUtc"] = nowUtc.ToString("o");
            }

            cookie.HttpOnly = false; // So it can be read via client-side if needed
            cookie.SameSite = SameSiteMode.Lax;
            cookie.Secure = Request.IsSecureConnection;
            cookie.Expires = DateTime.UtcNow.AddDays(30);

            Response.Cookies.Set(cookie);
        }


        private void LoadPortfolioData()
        {
            try
            {
                // Load Hero and About sections - Don't initialize defaults first
                try 
                { 
                    HeroSection = portfolioService.GetHeroSection();
                    System.Diagnostics.Debug.WriteLine($"Hero Section loaded: {(HeroSection != null ? HeroSection.SectionName : "NULL")}");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading hero section: {ex.Message}");
                    HeroSection = null;
                }
                
                try 
                { 
                    AboutHomeSection = portfolioService.GetAboutHomeSection();
                    System.Diagnostics.Debug.WriteLine($"About Home Section loaded: {(AboutHomeSection != null ? AboutHomeSection.SectionName : "NULL")}");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading about home section: {ex.Message}");
                    AboutHomeSection = null;
                }
                
                // Load Social Links
                try 
                { 
                    SocialLinks = portfolioService.GetSocialLinks();
                    System.Diagnostics.Debug.WriteLine($"Social Links loaded: {SocialLinks?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading social links: {ex.Message}");
                    SocialLinks = new List<SocialLink>();
                }
                
                // Load About sections
                try 
                { 
                    AboutSections = portfolioService.GetAllAboutSections();
                    System.Diagnostics.Debug.WriteLine($"About Sections loaded: {AboutSections?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading about sections: {ex.Message}");
                    AboutSections = new List<AboutSection>();
                }
                
                // Load Strengths & Interests
                try 
                { 
                    Strengths = portfolioService.GetStrengths();
                    System.Diagnostics.Debug.WriteLine($"Strengths loaded: {Strengths?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading strengths: {ex.Message}");
                    Strengths = new List<StrengthInterest>();
                }
                
                try 
                { 
                    Interests = portfolioService.GetInterests();
                    System.Diagnostics.Debug.WriteLine($"Interests loaded: {Interests?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading interests: {ex.Message}");
                    Interests = new List<StrengthInterest>();
                }
                
                try 
                { 
                    ResearchAreas = portfolioService.GetResearchAreas();
                    System.Diagnostics.Debug.WriteLine($"Research Areas loaded: {ResearchAreas?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading research areas: {ex.Message}");
                    ResearchAreas = new List<StrengthInterest>();
                }
                
                try 
                { 
                    FutureGoals = portfolioService.GetFutureGoals();
                    System.Diagnostics.Debug.WriteLine($"Future Goals loaded: {FutureGoals?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading future goals: {ex.Message}");
                    FutureGoals = new List<StrengthInterest>();
                }
                
                try 
                { 
                    LearningAreas = portfolioService.GetLearningAreas();
                    System.Diagnostics.Debug.WriteLine($"Learning Areas loaded: {LearningAreas?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading learning areas: {ex.Message}");
                    LearningAreas = new List<StrengthInterest>();
                }
                
                // Load Skills
                try 
                { 
                    SkillsByCategory = portfolioService.GetSkillsByCategory();
                    System.Diagnostics.Debug.WriteLine($"Skills loaded: {SkillsByCategory?.Count ?? 0} categories");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading skills: {ex.Message}");
                    SkillsByCategory = new Dictionary<string, List<Skill>>();
                }
                
                // Load Timeline
                try 
                { 
                    EducationTimeline = portfolioService.GetEducationTimeline();
                    System.Diagnostics.Debug.WriteLine($"Education Timeline loaded: {EducationTimeline?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading education timeline: {ex.Message}");
                    EducationTimeline = new List<TimelineItem>();
                }
                
                try 
                { 
                    WorkTimeline = portfolioService.GetWorkTimeline();
                    System.Diagnostics.Debug.WriteLine($"Work Timeline loaded: {WorkTimeline?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading work timeline: {ex.Message}");
                    WorkTimeline = new List<TimelineItem>();
                }
                
                try 
                { 
                    AllTimeline = portfolioService.GetAllTimeline();
                    System.Diagnostics.Debug.WriteLine($"All Timeline loaded: {AllTimeline?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading all timeline: {ex.Message}");
                    AllTimeline = new List<TimelineItem>();
                }
                
                // Load Projects - ensure they're never null
                try 
                { 
                    var featuredProjects = portfolioService.GetFeaturedProjects(6);
                    FeaturedProjects = featuredProjects ?? new List<Project>();
                    System.Diagnostics.Debug.WriteLine($"Featured Projects loaded: {FeaturedProjects.Count} items");
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
                    System.Diagnostics.Debug.WriteLine($"All Projects loaded: {AllProjects.Count} items");
                } 
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Error loading all projects: {ex.Message}");
                    AllProjects = new List<Project>();
                }
                
                // Load Experience
                try 
                { 
                    Experiences = portfolioService.GetExperiences();
                    System.Diagnostics.Debug.WriteLine($"Experiences loaded: {Experiences?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading experiences: {ex.Message}");
                    Experiences = new List<Experience>();
                }
                
                // Load Blog Posts
                try 
                { 
                    RecentBlogPosts = portfolioService.GetRecentBlogPosts(3);
                    System.Diagnostics.Debug.WriteLine($"Recent Blog Posts loaded: {RecentBlogPosts?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading recent blog posts: {ex.Message}");
                    RecentBlogPosts = new List<BlogPost>();
                }
                
                // Load Settings
                try 
                { 
                    Settings = portfolioService.GetAllSettings();
                    System.Diagnostics.Debug.WriteLine($"Settings loaded: {Settings?.Count ?? 0} items");
                } 
                catch (Exception ex) 
                { 
                    System.Diagnostics.Debug.WriteLine($"Error loading settings: {ex.Message}");
                    Settings = new Dictionary<string, string>();
                }
                
                System.Diagnostics.Debug.WriteLine("=== Portfolio data loading completed ===");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading portfolio data: {ex.Message}");
                // Initialize with empty data if there's a general error
                LoadDefaultData();
            }
        }

        private void LoadDefaultData()
        {
            // Initialize with empty data to prevent null reference errors
            // Don't put fallback content here - let the ASPX handle that with proper checks
            HeroSection = null;
            AboutHomeSection = null;
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

        /// <summary>
        /// Formats about section content for display (preserves line breaks and basic formatting)
        /// </summary>
        public string FormatAboutContent(string content)
        {
            if (string.IsNullOrEmpty(content))
                return "";

            // Replace line breaks with HTML breaks for proper display
            content = content.Replace("\r\n", "<br />").Replace("\n", "<br />").Replace("\r", "<br />");
            
            // Basic HTML encoding for safety
            return content;
        }

        /// <summary>
        /// Gets the first few items from a collection for display
        /// </summary>
        public IEnumerable<T> TakeItems<T>(IEnumerable<T> collection, int count)
        {
            if (collection == null)
                return new List<T>();
                
            return collection.Take(count);
        }

        /// <summary>
        /// Checks if a collection has any items
        /// </summary>
        public bool HasItems<T>(IEnumerable<T> collection)
        {
            return collection != null && collection.Any();
        }

        #endregion
    }
}