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

    // Home Sections Model
    public class HomeSection
    {
        public int Id { get; set; }
        public string SectionName { get; set; }
        public string Content { get; set; }
        public string ImagePath { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    // Social Links Model
    public class SocialLink
    {
        public int Id { get; set; }
        public string Platform { get; set; }
        public string URL { get; set; }
        public string IconClass { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // About Sections Model
    public class AboutSection
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Content { get; set; }
        public string SectionType { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    // Strengths & Interests Model
    public class StrengthInterest
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ColorClass { get; set; }
        public string Icon { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // Skills Model
    public class Skill
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string SkillName { get; set; }
        public string SkillIcon { get; set; }
        public int Proficiency { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // Timeline Model
    public class TimelineItem
    {
        public int Id { get; set; }
        public string YearRange { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // Projects Model
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
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // Experience Model
    public class Experience
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Position { get; set; }
        public string Duration { get; set; }
        public string Description { get; set; }
        public string Responsibilities { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // Blog Posts Model
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
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
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