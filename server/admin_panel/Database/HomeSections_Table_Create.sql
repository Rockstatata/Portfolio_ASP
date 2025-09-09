-- Create HomeSections table if it doesn't exist
-- This table stores the content for different sections of the homepage

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='HomeSections' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[HomeSections](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [SectionName] [nvarchar](50) NOT NULL,
        [Content] [nvarchar](max) NULL,
        [ImagePath] [nvarchar](255) NULL,
        [DisplayOrder] [int] NULL,
        [IsActive] [bit] NULL,
        [CreatedDate] [datetime] NULL,
        [UpdatedDate] [datetime] NULL,
    PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

    -- Insert default sections
    INSERT INTO [dbo].[HomeSections] ([SectionName], [Content], [ImagePath], [DisplayOrder], [IsActive], [CreatedDate], [UpdatedDate])
    VALUES 
    ('Hero Section', 'Welcome to my portfolio website. I am a passionate developer creating amazing digital experiences.', '/images/hero-bg.jpg', 1, 1, GETDATE(), GETDATE()),
    ('About Section', 'I am a dedicated software developer with expertise in modern web technologies and a passion for creating innovative solutions.', '/images/about-me.jpg', 2, 1, GETDATE(), GETDATE()),
    ('Skills Section', 'Explore my technical skills and proficiencies in various programming languages and frameworks.', '/images/skills-bg.jpg', 3, 1, GETDATE(), GETDATE()),
    ('Projects Section', 'Check out my latest projects and portfolio work showcasing my development capabilities.', '/images/projects-bg.jpg', 4, 1, GETDATE(), GETDATE()),
    ('Experience Section', 'Learn about my professional experience and career journey in software development.', '/images/experience-bg.jpg', 5, 1, GETDATE(), GETDATE()),
    ('Contact Section', 'Get in touch with me for collaboration opportunities or project inquiries.', '/images/contact-bg.jpg', 6, 1, GETDATE(), GETDATE())

    PRINT 'HomeSections table created and populated with default data.'
END
ELSE
BEGIN
    PRINT 'HomeSections table already exists.'
END
GO