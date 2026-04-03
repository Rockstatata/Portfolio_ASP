-- Simple Contacts Table Creation Script
-- This creates a minimal Contacts table that will work with the portfolio contact form

-- Create Contacts table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Contacts' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Contacts] (
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [Email] [nvarchar](255) NOT NULL,
        [Subject] [nvarchar](255) NULL,
        [Message] [ntext] NOT NULL,
        CONSTRAINT [PK_Contacts] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    PRINT 'Basic Contacts table created successfully.'
END
ELSE
BEGIN
    PRINT 'Contacts table already exists.'
    
    -- Check if we need to add missing columns to existing table
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Contacts' AND COLUMN_NAME = 'Subject')
    BEGIN
        ALTER TABLE Contacts ADD Subject NVARCHAR(255) NULL
        PRINT 'Added Subject column to Contacts table.'
    END
    
    -- Show current structure
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Contacts'
    ORDER BY ORDINAL_POSITION
END

PRINT 'Contacts table is ready for use.'