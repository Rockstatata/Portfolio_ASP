using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace admin_panel
{
    public class PortfolioDataService
    {
        private readonly string _connectionString;

        public PortfolioDataService()
        {
            _connectionString = ConfigurationManager.ConnectionStrings["adminpanel_db"].ConnectionString;
        }

        #region Home Sections

        public List<HomeSection> GetHomeSections()
        {
            var sections = new List<HomeSection>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, SectionName, Content, ImagePath, DisplayOrder 
                        FROM HomeSections 
                        ORDER BY DisplayOrder", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            sections.Add(new HomeSection
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                SectionName = reader["SectionName"] as string ?? string.Empty,
                                Content = reader["Content"] as string ?? string.Empty,
                                ImagePath = reader["ImagePath"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting home sections: {ex.Message}");
            }
            return sections;
        }

        public HomeSection GetHomeSectionByName(string sectionName)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT TOP 1 Id, SectionName, Content, ImagePath, DisplayOrder 
                        FROM HomeSections 
                        WHERE SectionName = @SectionName", conn);
                    
                    cmd.Parameters.AddWithValue("@SectionName", sectionName);
                    conn.Open();
                    
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new HomeSection
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                SectionName = reader["SectionName"] as string ?? string.Empty,
                                Content = reader["Content"] as string ?? string.Empty,
                                ImagePath = reader["ImagePath"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting home section by name: {ex.Message}");
            }
            return null;
        }

        #endregion

        #region Social Links

        public List<SocialLink> GetSocialLinks()
        {
            var links = new List<SocialLink>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Platform, URL, IconClass, DisplayOrder 
                        FROM SocialLinks 
                        ORDER BY DisplayOrder", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            links.Add(new SocialLink
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Platform = reader["Platform"] as string ?? string.Empty,
                                URL = reader["URL"] as string ?? string.Empty,
                                IconClass = reader["IconClass"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting social links: {ex.Message}");
            }
            return links;
        }

        #endregion

        #region About Sections

        public List<AboutSection> GetAboutSections()
        {
            var sections = new List<AboutSection>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Title, Content, SectionType, DisplayOrder 
                        FROM AboutSections 
                        ORDER BY DisplayOrder", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                     
                        while (reader.Read())
                        {
                            sections.Add(new AboutSection
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Title = reader["Title"] as string ?? string.Empty,
                                Content = reader["Content"] as string ?? string.Empty,
                                SectionType = reader["SectionType"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting about sections: {ex.Message}");
            }
            return sections;
        }

        public AboutSection GetAboutSectionByType(string sectionType)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT TOP 1 Id, Title, Content, SectionType, DisplayOrder 
                        FROM AboutSections 
                        WHERE SectionType = @SectionType 
                        ORDER BY DisplayOrder", conn);
                    
                    cmd.Parameters.AddWithValue("@SectionType", sectionType);
                    conn.Open();
                    
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new AboutSection
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Title = reader["Title"] as string ?? string.Empty,
                                Content = reader["Content"] as string ?? string.Empty,
                                SectionType = reader["SectionType"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting about section by type: {ex.Message}");
            }
            return null;
        }

        #endregion

        #region Strengths & Interests

        public List<StrengthInterest> GetStrengthsInterests()
        {
            var items = new List<StrengthInterest>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Category, Description, DisplayOrder 
                        FROM StrengthsInterests 
                        ORDER BY DisplayOrder", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new StrengthInterest
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Category = reader["Category"] as string ?? string.Empty,
                                Description = reader["Description"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting strengths interests: {ex.Message}");
            }
            return items;
        }

        public List<StrengthInterest> GetStrengthsInterestsByCategory(string category)
        {
            var items = new List<StrengthInterest>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Category, Description, DisplayOrder 
                        FROM StrengthsInterests 
                        WHERE Category = @Category 
                        ORDER BY DisplayOrder", conn);
                    
                    cmd.Parameters.AddWithValue("@Category", category);
                    conn.Open();
                    
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new StrengthInterest
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Category = reader["Category"] as string ?? string.Empty,
                                Description = reader["Description"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting strengths interests by category: {ex.Message}");
            }
            return items;
        }

        #endregion

        #region Skills

        public List<Skill> GetSkills()
        {
            var skills = new List<Skill>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Category, SkillName, SkillIcon, Proficiency, DisplayOrder 
                        FROM Skills 
                        ORDER BY Category, DisplayOrder", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            skills.Add(new Skill
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Category = reader["Category"] as string ?? string.Empty,
                                SkillName = reader["SkillName"] as string ?? string.Empty,
                                SkillIcon = reader["SkillIcon"] as string ?? string.Empty,
                                Proficiency = Convert.ToInt32(reader["Proficiency"]),
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting skills: {ex.Message}");
            }
            return skills;
        }

        public List<Skill> GetSkillsByCategory(string category)
        {
            var skills = new List<Skill>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Category, SkillName, SkillIcon, Proficiency, DisplayOrder 
                        FROM Skills 
                        WHERE Category = @Category 
                        ORDER BY DisplayOrder", conn);
                    
                    cmd.Parameters.AddWithValue("@Category", category);
                    conn.Open();
                    
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            skills.Add(new Skill
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Category = reader["Category"] as string ?? string.Empty,
                                SkillName = reader["SkillName"] as string ?? string.Empty,
                                SkillIcon = reader["SkillIcon"] as string ?? string.Empty,
                                Proficiency = Convert.ToInt32(reader["Proficiency"]),
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting skills by category: {ex.Message}");
            }
            return skills;
        }

        #endregion

        #region Timeline

        public List<TimelineItem> GetTimelineItems()
        {
            var items = new List<TimelineItem>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, YearRange, Title, Location, Description, Type, DisplayOrder 
                        FROM Timeline 
                        ORDER BY DisplayOrder ASC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new TimelineItem
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                YearRange = reader["YearRange"] as string ?? string.Empty,
                                Title = reader["Title"] as string ?? string.Empty,
                                Location = reader["Location"] as string ?? string.Empty,
                                Description = reader["Description"] as string ?? string.Empty,
                                Type = reader["Type"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting timeline items: {ex.Message}");
            }
            return items;
        }

        public List<TimelineItem> GetTimelineItemsByType(string type)
        {
            var items = new List<TimelineItem>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, YearRange, Title, Location, Description, Type, DisplayOrder 
                        FROM Timeline 
                        WHERE Type = @Type 
                        ORDER BY DisplayOrder ASC", conn);
                    
                    cmd.Parameters.AddWithValue("@Type", type);
                    conn.Open();
                    
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new TimelineItem
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                YearRange = reader["YearRange"] as string ?? string.Empty,
                                Title = reader["Title"] as string ?? string.Empty,
                                Location = reader["Location"] as string ?? string.Empty,
                                Description = reader["Description"] as string ?? string.Empty,
                                Type = reader["Type"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting timeline items by type: {ex.Message}");
            }
            return items;
        }

        #endregion

        #region Projects

        public List<Project> GetProjects()
        {
            var projects = new List<Project>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Title, Description, ImagePath, Technologies, ProjectYear, DemoLink, SourceLink, Status, DisplayOrder 
                        FROM Projects 
                        ORDER BY DisplayOrder DESC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            projects.Add(new Project
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Title = reader["Title"] as string ?? string.Empty,
                                Description = reader["Description"] as string ?? string.Empty,
                                ImagePath = reader["ImagePath"] as string ?? string.Empty,
                                Technologies = reader["Technologies"] as string ?? string.Empty,
                                ProjectYear = reader["ProjectYear"] == DBNull.Value ? (int?)null : Convert.ToInt32(reader["ProjectYear"]),
                                DemoLink = reader["DemoLink"] as string ?? string.Empty,
                                SourceLink = reader["SourceLink"] as string ?? string.Empty,
                                Status = reader["Status"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting projects: {ex.Message}");
            }
            // Always return a valid list (even if empty)
            return projects ?? new List<Project>();
        }

        public List<Project> GetFeaturedProjects(int count = 6)
        {
            var projects = new List<Project>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand($@"
                        SELECT TOP {count} Id, Title, Description, ImagePath, Technologies, ProjectYear, DemoLink, SourceLink, Status, DisplayOrder 
                        FROM Projects 
                        ORDER BY DisplayOrder DESC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            projects.Add(new Project
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Title = reader["Title"] as string ?? string.Empty,
                                Description = reader["Description"] as string ?? string.Empty,
                                ImagePath = reader["ImagePath"] as string ?? string.Empty,
                                Technologies = reader["Technologies"] as string ?? string.Empty,
                                ProjectYear = reader["ProjectYear"] == DBNull.Value ? (int?)null : Convert.ToInt32(reader["ProjectYear"]),
                                DemoLink = reader["DemoLink"] as string ?? string.Empty,
                                SourceLink = reader["SourceLink"] as string ?? string.Empty,
                                Status = reader["Status"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting featured projects: {ex.Message}");
            }
            // Always return a valid list (even if empty)
            return projects ?? new List<Project>();
        }

        #endregion

        #region Experience

        public List<Experience> GetExperiences()
        {
            var experiences = new List<Experience>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Company, Position, Duration, Description, Responsibilities, DisplayOrder 
                        FROM Experience 
                        ORDER BY DisplayOrder DESC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            experiences.Add(new Experience
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Company = reader["Company"] as string ?? string.Empty,
                                Position = reader["Position"] as string ?? string.Empty,
                                Duration = reader["Duration"] as string ?? string.Empty,
                                Description = reader["Description"] as string ?? string.Empty,
                                Responsibilities = reader["Responsibilities"] as string ?? string.Empty,
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting experiences: {ex.Message}");
            }
            return experiences;
        }

        #endregion

        #region Blog Posts

        public List<BlogPost> GetBlogPosts()
        {
            var posts = new List<BlogPost>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Title, Content, Excerpt, Categories, Tags, PublishDate, ReadTime, ImagePath, Status 
                        FROM BlogPosts 
                        WHERE Status = 'Published'
                        ORDER BY PublishDate DESC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            posts.Add(new BlogPost
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Title = reader["Title"] as string ?? string.Empty,
                                Content = reader["Content"] as string ?? string.Empty,
                                Excerpt = reader["Excerpt"] as string ?? string.Empty,
                                Categories = reader["Categories"] as string ?? string.Empty,
                                Tags = reader["Tags"] as string ?? string.Empty,
                                PublishDate = reader["PublishDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["PublishDate"]),
                                ReadTime = reader["ReadTime"] == DBNull.Value ? (int?)null : Convert.ToInt32(reader["ReadTime"]),
                                ImagePath = reader["ImagePath"] as string ?? string.Empty,
                                Status = reader["Status"] as string ?? string.Empty
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting blog posts: {ex.Message}");
            }
            return posts;
        }

        public List<BlogPost> GetRecentBlogPosts(int count = 3)
        {
            var posts = new List<BlogPost>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand($@"
                        SELECT TOP {count} Id, Title, Content, Excerpt, Categories, Tags, PublishDate, ReadTime, ImagePath, Status 
                        FROM BlogPosts 
                        ORDER BY PublishDate DESC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            posts.Add(new BlogPost
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Title = reader["Title"] as string ?? string.Empty,
                                Content = reader["Content"] as string ?? string.Empty,
                                Excerpt = reader["Excerpt"] as string ?? string.Empty,
                                Categories = reader["Categories"] as string ?? string.Empty,
                                Tags = reader["Tags"] as string ?? string.Empty,
                                PublishDate = reader["PublishDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["PublishDate"]),
                                ReadTime = reader["ReadTime"] == DBNull.Value ? (int?)null : Convert.ToInt32(reader["ReadTime"]),
                                ImagePath = reader["ImagePath"] as string ?? string.Empty,
                                Status = reader["Status"] as string ?? string.Empty
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting recent blog posts: {ex.Message}");
            }
            return posts;
        }

        #endregion

        #region Contacts

        public List<Contact> GetAllContacts()
        {
            var contacts = new List<Contact>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Name, Email, Subject, Message, ReceivedDate, IsRead, Responded
                        FROM Contacts 
                        ORDER BY ReceivedDate DESC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            contacts.Add(new Contact
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = reader["Name"] as string ?? string.Empty,
                                Email = reader["Email"] as string ?? string.Empty,
                                Subject = reader["Subject"] as string ?? string.Empty,
                                Message = reader["Message"] as string ?? string.Empty,
                                ReceivedDate = reader["ReceivedDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["ReceivedDate"]),
                                IsRead = reader["IsRead"] == DBNull.Value ? false : Convert.ToBoolean(reader["IsRead"]),
                                Responded = reader["Responded"] == DBNull.Value ? false : Convert.ToBoolean(reader["Responded"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting contacts: {ex.Message}");
            }
            return contacts;
        }

        public Contact GetContactById(int id)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Name, Email, Subject, Message, ReceivedDate, IsRead, Responded
                        FROM Contacts 
                        WHERE Id = @Id", conn);
                    
                    cmd.Parameters.AddWithValue("@Id", id);
                    conn.Open();
                    
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Contact
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = reader["Name"] as string ?? string.Empty,
                                Email = reader["Email"] as string ?? string.Empty,
                                Subject = reader["Subject"] as string ?? string.Empty,
                                Message = reader["Message"] as string ?? string.Empty,
                                ReceivedDate = reader["ReceivedDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["ReceivedDate"]),
                                IsRead = reader["IsRead"] == DBNull.Value ? false : Convert.ToBoolean(reader["IsRead"]),
                                Responded = reader["Responded"] == DBNull.Value ? false : Convert.ToBoolean(reader["Responded"])
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting contact by ID: {ex.Message}");
            }
            return null;
        }

        public bool MarkContactAsRead(int id)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        UPDATE Contacts 
                        SET IsRead = 1
                        WHERE Id = @Id", conn);
                    
                    cmd.Parameters.AddWithValue("@Id", id);
                    conn.Open();
                    
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error marking contact as read: {ex.Message}");
                return false;
            }
        }

        public bool MarkContactAsResponded(int id)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        UPDATE Contacts 
                        SET Responded = 1
                        WHERE Id = @Id", conn);
                    
                    cmd.Parameters.AddWithValue("@Id", id);
                    conn.Open();
                    
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error marking contact as responded: {ex.Message}");
                return false;
            }
        }

        public bool DeleteContact(int id)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        DELETE FROM Contacts 
                        WHERE Id = @Id", conn);
                    
                    cmd.Parameters.AddWithValue("@Id", id);
                    conn.Open();
                    
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error deleting contact: {ex.Message}");
                return false;
            }
        }

        public List<Contact> GetUnreadContacts()
        {
            var contacts = new List<Contact>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT Id, Name, Email, Subject, Message, ReceivedDate, IsRead, Responded
                        FROM Contacts 
                        WHERE IsRead = 0 OR IsRead IS NULL
                        ORDER BY ReceivedDate DESC", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            contacts.Add(new Contact
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = reader["Name"] as string ?? string.Empty,
                                Email = reader["Email"] as string ?? string.Empty,
                                Subject = reader["Subject"] as string ?? string.Empty,
                                Message = reader["Message"] as string ?? string.Empty,
                                ReceivedDate = reader["ReceivedDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["ReceivedDate"]),
                                IsRead = reader["IsRead"] == DBNull.Value ? false : Convert.ToBoolean(reader["IsRead"]),
                                Responded = reader["Responded"] == DBNull.Value ? false : Convert.ToBoolean(reader["Responded"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting unread contacts: {ex.Message}");
            }
            return contacts;
        }

        public int GetContactsCount()
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand("SELECT COUNT(*) FROM Contacts", conn);
                    conn.Open();
                    return Convert.ToInt32(cmd.ExecuteScalar());
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting contacts count: {ex.Message}");
                return 0;
            }
        }

        public bool SaveContact(Contact contact)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        INSERT INTO Contacts (Name, Email, Subject, Message, ReceivedDate, IsRead, Responded)
                        VALUES (@Name, @Email, @Subject, @Message, @ReceivedDate, @IsRead, @Responded)", conn);
                    
                    cmd.Parameters.AddWithValue("@Name", contact.Name ?? string.Empty);
                    cmd.Parameters.AddWithValue("@Email", contact.Email ?? string.Empty);
                    cmd.Parameters.AddWithValue("@Subject", contact.Subject ?? string.Empty);
                    cmd.Parameters.AddWithValue("@Message", contact.Message ?? string.Empty);
                    cmd.Parameters.AddWithValue("@ReceivedDate", contact.ReceivedDate ?? DateTime.Now);
                    cmd.Parameters.AddWithValue("@IsRead", contact.IsRead);
                    cmd.Parameters.AddWithValue("@Responded", contact.Responded);
                    
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error saving contact: {ex.Message}");
                return false;
            }
        }

        #endregion

        #region Portfolio Settings

        public string GetPortfolioSetting(string key, string defaultValue = "")
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT SettingValue 
                        FROM PortfolioSettings 
                        WHERE SettingKey = @SettingKey", conn);
                    
                    cmd.Parameters.AddWithValue("@SettingKey", key);
                    conn.Open();
                    
                    var result = cmd.ExecuteScalar();
                    return result?.ToString() ?? defaultValue;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting portfolio setting: {ex.Message}");
                return defaultValue;
            }
        }

        public Dictionary<string, string> GetAllPortfolioSettings()
        {
            var settings = new Dictionary<string, string>();
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT SettingKey, SettingValue 
                        FROM PortfolioSettings", conn);
                    
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var key = reader["SettingKey"] as string ?? string.Empty;
                            var value = reader["SettingValue"] as string ?? string.Empty;
                            
                            if (!string.IsNullOrEmpty(key))
                            {
                                settings[key] = value;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error getting all portfolio settings: {ex.Message}");
            }
            return settings;
        }

        #endregion

        #region Helper Methods

        public bool IsTableExists(string tableName)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand(@"
                        SELECT COUNT(*) 
                        FROM INFORMATION_SCHEMA.TABLES 
                        WHERE TABLE_NAME = @TableName", conn);
                    
                    cmd.Parameters.AddWithValue("@TableName", tableName);
                    conn.Open();
                    
                    var count = Convert.ToInt32(cmd.ExecuteScalar());
                    return count > 0;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error checking table existence: {ex.Message}");
                return false;
            }
        }

        #endregion
    }
}