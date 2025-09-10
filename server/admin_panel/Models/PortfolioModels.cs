using System;

namespace admin_panel.Models
{
    public class HomeSection
    {
        public int Id { get; set; }
        public string SectionName { get; set; }
        public string Content { get; set; }
        public string ImagePath { get; set; }
    }

    public class SocialLink
    {
        public int Id { get; set; }
        public string Platform { get; set; }
        public string URL { get; set; }
        public string IconClass { get; set; }
    }

    public class AboutSection
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Content { get; set; }
        public string SectionType { get; set; }
    }

    public class StrengthInterest
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ColorClass { get; set; }
        public string Icon { get; set; }
    }

    public class Skill
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string SkillName { get; set; }
        public string SkillIcon { get; set; }
        public int Proficiency { get; set; }
    }

    public class TimelineItem
    {
        public int Id { get; set; }
        public string YearRange { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
    }

    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public string Technologies { get; set; }
        public int ProjectYear { get; set; }
        public string DemoLink { get; set; }
        public string SourceLink { get; set; }
        public string Status { get; set; }
    }

    public class Experience
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Position { get; set; }
        public string Duration { get; set; }
        public string Description { get; set; }
        public string Responsibilities { get; set; }
    }

    public class BlogPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Excerpt { get; set; }
        public string Categories { get; set; }
        public string Tags { get; set; }
        public DateTime PublishDate { get; set; }
        public int ReadTime { get; set; }
        public string ImagePath { get; set; }
        public string Status { get; set; }
    }

    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}
