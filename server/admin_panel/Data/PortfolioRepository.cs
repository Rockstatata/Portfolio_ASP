using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using admin_panel.Models;

namespace admin_panel.Data
{
    public class PortfolioRepository
    {
        private readonly string _connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;

        public List<HomeSection> GetHomeSections()
        {
            var sections = new List<HomeSection>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, SectionName, Content, ImagePath FROM HomeSections WHERE IsActive = 1 ORDER BY DisplayOrder", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        sections.Add(new HomeSection
                        {
                            Id = (int)reader["Id"],
                            SectionName = reader["SectionName"].ToString(),
                            Content = reader["Content"].ToString(),
                            ImagePath = reader["ImagePath"].ToString()
                        });
                    }
                }
            }
            return sections;
        }

        public List<SocialLink> GetSocialLinks()
        {
            var links = new List<SocialLink>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, Platform, URL, IconClass FROM SocialLinks WHERE IsActive = 1 ORDER BY DisplayOrder", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        links.Add(new SocialLink
                        {
                            Id = (int)reader["Id"],
                            Platform = reader["Platform"].ToString(),
                            URL = reader["URL"].ToString(),
                            IconClass = reader["IconClass"].ToString()
                        });
                    }
                }
            }
            return links;
        }

        public AboutSection GetAboutSection(string sectionType)
        {
            AboutSection section = null;
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT TOP 1 Id, Title, Subtitle, Content, SectionType FROM AboutSections WHERE SectionType = @SectionType AND IsActive = 1", conn);
                cmd.Parameters.AddWithValue("@SectionType", sectionType);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        section = new AboutSection
                        {
                            Id = (int)reader["Id"],
                            Title = reader["Title"].ToString(),
                            Subtitle = reader["Subtitle"].ToString(),
                            Content = reader["Content"].ToString(),
                            SectionType = reader["SectionType"].ToString()
                        };
                    }
                }
            }
            return section;
        }
        
        public List<StrengthInterest> GetStrengthsInterests(string category)
        {
            var items = new List<StrengthInterest>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, Category, Title, Description, ColorClass, Icon FROM StrengthsInterests WHERE Category = @Category AND IsActive = 1 ORDER BY DisplayOrder", conn);
                cmd.Parameters.AddWithValue("@Category", category);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        items.Add(new StrengthInterest
                        {
                            Id = (int)reader["Id"],
                            Category = reader["Category"].ToString(),
                            Title = reader["Title"].ToString(),
                            Description = reader["Description"].ToString(),
                            ColorClass = reader["ColorClass"].ToString(),
                            Icon = reader["Icon"].ToString()
                        });
                    }
                }
            }
            return items;
        }

        public List<Skill> GetSkills()
        {
            var skills = new List<Skill>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, Category, SkillName, SkillIcon, Proficiency FROM Skills WHERE IsActive = 1 ORDER BY Category, DisplayOrder", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        skills.Add(new Skill
                        {
                            Id = (int)reader["Id"],
                            Category = reader["Category"].ToString(),
                            SkillName = reader["SkillName"].ToString(),
                            SkillIcon = reader["SkillIcon"].ToString(),
                            Proficiency = (int)reader["Proficiency"]
                        });
                    }
                }
            }
            return skills;
        }

        public List<TimelineItem> GetTimeline()
        {
            var items = new List<TimelineItem>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, YearRange, Title, Location, Description, Type FROM Timeline WHERE IsActive = 1 ORDER BY DisplayOrder", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        items.Add(new TimelineItem
                        {
                            Id = (int)reader["Id"],
                            YearRange = reader["YearRange"].ToString(),
                            Title = reader["Title"].ToString(),
                            Location = reader["Location"].ToString(),
                            Description = reader["Description"].ToString(),
                            Type = reader["Type"].ToString()
                        });
                    }
                }
            }
            return items;
        }

        public List<Project> GetProjects()
        {
            var projects = new List<Project>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, Title, Description, ImagePath, Technologies, ProjectYear, DemoLink, SourceLink, Status FROM Projects WHERE IsActive = 1 ORDER BY DisplayOrder", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        projects.Add(new Project
                        {
                            Id = (int)reader["Id"],
                            Title = reader["Title"].ToString(),
                            Description = reader["Description"].ToString(),
                            ImagePath = reader["ImagePath"].ToString(),
                            Technologies = reader["Technologies"].ToString(),
                            ProjectYear = reader["ProjectYear"] as int? ?? 0,
                            DemoLink = reader["DemoLink"].ToString(),
                            SourceLink = reader["SourceLink"].ToString(),
                            Status = reader["Status"].ToString()
                        });
                    }
                }
            }
            return projects;
        }

        public List<Experience> GetExperiences()
        {
            var experiences = new List<Experience>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, Company, Position, Duration, Description, Responsibilities FROM Experience WHERE IsActive = 1 ORDER BY DisplayOrder", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        experiences.Add(new Experience
                        {
                            Id = (int)reader["Id"],
                            Company = reader["Company"].ToString(),
                            Position = reader["Position"].ToString(),
                            Duration = reader["Duration"].ToString(),
                            Description = reader["Description"].ToString(),
                            Responsibilities = reader["Responsibilities"].ToString()
                        });
                    }
                }
            }
            return experiences;
        }

        public List<BlogPost> GetBlogPosts()
        {
            var posts = new List<BlogPost>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, Title, Content, Excerpt, Categories, Tags, PublishDate, ReadTime, ImagePath, Status FROM BlogPosts WHERE IsActive = 1 AND Status = 'Published' ORDER BY PublishDate DESC", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        posts.Add(new BlogPost
                        {
                            Id = (int)reader["Id"],
                            Title = reader["Title"].ToString(),
                            Content = reader["Content"].ToString(),
                            Excerpt = reader["Excerpt"].ToString(),
                            Categories = reader["Categories"].ToString(),
                            Tags = reader["Tags"].ToString(),
                            PublishDate = reader["PublishDate"] as DateTime? ?? DateTime.MinValue,
                            ReadTime = reader["ReadTime"] as int? ?? 0,
                            ImagePath = reader["ImagePath"].ToString(),
                            Status = reader["Status"].ToString()
                        });
                    }
                }
            }
            return posts;
        }

        public void AddContact(Contact contact)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("INSERT INTO Contacts (Name, Email, Subject, Message) VALUES (@Name, @Email, @Subject, @Message)", conn);
                cmd.Parameters.AddWithValue("@Name", contact.Name);
                cmd.Parameters.AddWithValue("@Email", contact.Email);
                cmd.Parameters.AddWithValue("@Subject", (object)contact.Subject ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Message", contact.Message);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}
