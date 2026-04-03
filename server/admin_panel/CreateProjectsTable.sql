-- SQL Script to create or verify the Projects table with auto-increment ID
-- Run this in SQL Server Management Studio or similar tool

-- Check if the Projects table exists, if not create it
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Projects')
BEGIN
    CREATE TABLE Projects (
        Id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-increment primary key
        Title NVARCHAR(255) NOT NULL,
        Description NTEXT NULL,
        Technologies NVARCHAR(500) NULL,
        ProjectYear INT NULL,
        Status NVARCHAR(50) NULL,
        DemoLink NVARCHAR(255) NULL,
        SourceLink NVARCHAR(255) NULL,
        ImagePath NVARCHAR(255) NULL,
        DisplayOrder INT NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
    
    PRINT 'Projects table created successfully with auto-increment ID';
END
ELSE
BEGIN
    -- Check if the Id column is set up properly with IDENTITY
    IF NOT EXISTS (
        SELECT * FROM sys.columns c
        JOIN sys.tables t ON c.object_id = t.object_id
        WHERE t.name = 'Projects' 
        AND c.name = 'Id' 
        AND c.is_identity = 1
    )
    BEGIN
        PRINT 'WARNING: Projects table exists but Id column is not set as IDENTITY (auto-increment)';
        PRINT 'You may need to recreate the table or modify the Id column to use IDENTITY(1,1)';
    END
    ELSE
    BEGIN
        PRINT 'Projects table already exists with proper auto-increment Id column';
    END
END

-- Display current table structure
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    CASE WHEN COLUMNPROPERTY(OBJECT_ID(TABLE_SCHEMA + '.' + TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1 
         THEN 'YES' 
         ELSE 'NO' 
    END AS IS_IDENTITY
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Projects'
ORDER BY ORDINAL_POSITION;