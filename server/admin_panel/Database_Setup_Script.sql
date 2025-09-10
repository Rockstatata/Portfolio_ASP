-- Portfolio Database Setup Script
-- This script creates the necessary tables for the portfolio website

-- ============================================
-- Create Contacts table for contact form submissions
-- ============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Contacts' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Contacts] (
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [Email] [nvarchar](255) NOT NULL,
        [Subject] [nvarchar](255) NULL,
        [Message] [ntext] NOT NULL,
        [ReceivedDate] [datetime] NOT NULL DEFAULT (getdate()),
        [IsRead] [bit] NOT NULL DEFAULT (0),
        [IsArchived] [bit] NOT NULL DEFAULT (0),
        CONSTRAINT [PK_Contacts] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    PRINT 'Contacts table created successfully.'
END
ELSE
    PRINT 'Contacts table already exists.'

-- ============================================
-- Create or Update HomeSections table
-- ============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='HomeSections' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[HomeSections] (
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [SectionName] [nvarchar](100) NOT NULL,
        [Content] [ntext] NULL,
        [ImagePath] [nvarchar](255) NULL,
        [DisplayOrder] [int] NOT NULL DEFAULT (0),
        CONSTRAINT [PK_HomeSections] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    PRINT 'HomeSections table created successfully.'
    
    -- Insert default home sections
    INSERT INTO [HomeSections] ([SectionName], [Content], [ImagePath], [DisplayOrder])
    VALUES 
        ('Hero Section', 'Welcome to my portfolio! I''m a passionate developer creating innovative digital solutions.', '/images/hero-bg.jpg', 1),
        ('About Section', 'I am a dedicated software developer with expertise in modern web technologies and a passion for creating innovative solutions.', '/images/about-bg.jpg', 2)
    
    PRINT 'Default home sections inserted.'
END
ELSE
    PRINT 'HomeSections table already exists.'

-- ============================================
-- Create or Update SocialLinks table
-- ============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SocialLinks' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[SocialLinks] (
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Platform] [nvarchar](50) NOT NULL,
        [URL] [nvarchar](255) NOT NULL,
        [IconClass] [nvarchar](100) NULL,
        [DisplayOrder] [int] NOT NULL DEFAULT (0),
        CONSTRAINT [PK_SocialLinks] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    PRINT 'SocialLinks table created successfully.'
    
    -- Insert default social links
    INSERT INTO [SocialLinks] ([Platform], [URL], [IconClass], [DisplayOrder])
    VALUES 
        ('GitHub', 'https://github.com/Rockstatata', 'fab fa-github', 1),
        ('LinkedIn', 'https://www.linkedin.com/in/sarwad-hasan-siddiqui/', 'fab fa-linkedin', 2),
        ('Twitter', 'https://x.com/Shspianto', 'fab fa-twitter', 3),
        ('Email', 'mailto:sarwad015@gmail.com', 'fas fa-envelope', 4)
    
    PRINT 'Default social links inserted.'
END
ELSE
    PRINT 'SocialLinks table already exists.'

-- ============================================
-- Create or Update AboutSections table
-- ============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AboutSections' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AboutSections] (
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Title] [nvarchar](255) NOT NULL,
        [Content] [ntext] NULL,
        [SectionType] [nvarchar](50) NULL,
        [DisplayOrder] [int] NOT NULL DEFAULT (0),
        CONSTRAINT [PK_AboutSections] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    PRINT 'AboutSections table created successfully.'
    
    -- Insert default about sections
    INSERT INTO [AboutSections] ([Title], [Content], [SectionType], [DisplayOrder])
    VALUES 
        ('About Me', 'I''m a dedicated third-year Computer Science & Engineering student at KUET, currently working as a Software Developer Intern at Algosoft Technologies Ltd.', 'main', 1),
        ('My Passion', 'My passion lies in building innovative solutions that solve real-world problems. I specialize in full-stack development using the MERN stack, React Native, Python FastAPI, and Laravel.', 'passion', 2),
        ('Future Goals', 'My ultimate dream is to work for NASA and contribute to space exploration through technology. One day, I want my code to reach the stars.', 'goals', 3)
    
    PRINT 'Default about sections inserted.'
END
ELSE
    PRINT 'AboutSections table already exists.'

-- ============================================
-- Create or Update Skills table
-- ============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Skills' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Skills] (
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Category] [nvarchar](100) NOT NULL,
        [SkillName] [nvarchar](100) NOT NULL,
        [SkillIcon] [nvarchar](255) NULL,
        [Proficiency] [int] NOT NULL DEFAULT (0),
        [DisplayOrder] [int] NOT NULL DEFAULT (0),
        CONSTRAINT [PK_Skills] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    PRINT 'Skills table created successfully.'
    
    -- Insert default skills
    INSERT INTO [Skills] ([Category], [SkillName], [SkillIcon], [Proficiency], [DisplayOrder])
    VALUES 
        ('Programming Languages', 'C#', 'devicon-csharp-plain', 90, 1),
        ('Programming Languages', 'JavaScript', 'devicon-javascript-plain', 85, 2),
        ('Programming Languages', 'Python', 'devicon-python-plain', 80, 3),
        ('Web Technologies', 'ASP.NET', 'devicon-dot-net-plain', 90, 1),
        ('Web Technologies', 'React', 'devicon-react-original', 85, 2),
        ('Web Technologies', 'HTML5', 'devicon-html5-plain', 95, 3),
        ('Web Technologies', 'CSS3', 'devicon-css3-plain', 90, 4),
        ('Databases', 'SQL Server', 'devicon-microsoftsqlserver-plain', 85, 1),
        ('Databases', 'MySQL', 'devicon-mysql-plain', 80, 2),
        ('Databases', 'MongoDB', 'devicon-mongodb-plain', 75, 3)
    
    PRINT 'Default skills inserted.'
END
ELSE
    PRINT 'Skills table already exists.'

PRINT '=== Database setup completed successfully! ==='