using System;

namespace admin_panel
{
    // Admin Users Model
    public class AdminUser
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // Home Sections Model - Updated to match database schema
    public class HomeSection
    {
        public int Id { get; set; }
        public string SectionName { get; set; }
        public string Content { get; set; }
        public string ImagePath { get; set; }
        public int DisplayOrder { get; set; }
        // Removed IsActive, CreatedDate, UpdatedDate as they might not exist in actual database
    }

    // Social Links Model - Updated to match database schema
    public class SocialLink
    {
        public int Id { get; set; }
        public string Platform { get; set; }
        public string URL { get; set; }
        public string IconClass { get; set; }
        public int DisplayOrder { get; set; }
        // Removed IsActive, CreatedDate as they might not exist in actual database
    }

    // About Sections Model - Updated to match database schema
    public class AboutSection
    {
        public int Id { get; set; }
        public string Title { get; set; }
        // Removed Subtitle as it's not in the database query
        public string Content { get; set; }
        public string SectionType { get; set; }
        public int DisplayOrder { get; set; }
        // Removed IsActive, CreatedDate, UpdatedDate as they might not exist in actual database
    }

    // Strengths & Interests Model - Updated to match database schema
    public class StrengthInterest
    {
        public int Id { get; set; }
        public string Category { get; set; }
        // Removed Title as it's not in the database query - using Description instead
        public string Description { get; set; }
        public int DisplayOrder { get; set; }
        // Removed ColorClass, Icon, IsActive, CreatedDate as they might not exist in actual database
        
        // Property to use Description as Title for display purposes
        public string Title => Description;
    }

    // Skills Model - Updated to match database schema
    public class Skill
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string SkillName { get; set; }
        public string SkillIcon { get; set; }
        public int Proficiency { get; set; }
        public int DisplayOrder { get; set; }
        // Removed IsActive, CreatedDate as they might not exist in actual database
    }

    // Timeline Model - Updated to match database schema
    public class TimelineItem
    {
        public int Id { get; set; }
        public string YearRange { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public int DisplayOrder { get; set; }
        // Removed IsActive, CreatedDate as they might not exist in actual database
    }

    // Projects Model - Updated to match database schema
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public string Technologies { get; set; }
        public int? ProjectYear { get; set; }
        public string DemoLink { get; set; }
        public string SourceLink { get; set; }
        public string Status { get; set; }
        public int DisplayOrder { get; set; }
        // Removed IsActive, CreatedDate as they might not exist in actual database
    }

    // Experience Model - Updated to match database schema
    public class Experience
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Position { get; set; }
        public string Duration { get; set; }
        public string Description { get; set; }
        public string Responsibilities { get; set; }
        public int DisplayOrder { get; set; }
        // Removed IsActive, CreatedDate as they might not exist in actual database
    }

    // Blog Posts Model - Updated to match database schema
    public class BlogPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Excerpt { get; set; }
        public string Categories { get; set; }
        public string Tags { get; set; }
        public DateTime? PublishDate { get; set; }
        public int? ReadTime { get; set; }
        public string ImagePath { get; set; }
        public string Status { get; set; }
        // Removed IsActive, CreatedDate, UpdatedDate as they might not exist in actual database
    }

    // Contacts Model - Updated to match database schema
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public bool IsRead { get; set; }
        public bool Responded { get; set; }
    }

    // Portfolio Settings Model
    public class PortfolioSetting
    {
        public int Id { get; set; }
        public string SettingKey { get; set; }
        public string SettingValue { get; set; }
        public string Description { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}