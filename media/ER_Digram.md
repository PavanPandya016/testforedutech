erDiagram
    USER ||--o{ COURSE_ENROLLMENT : enrolls
    USER ||--o{ BLOG_POST : writes
    USER ||--o{ EVENT_REGISTRATION : registers
    USER ||--o{ COURSE_APPLICATION : applies
    USER ||--o{ ACTIVITY_LOG : performs

    COURSE ||--o{ COURSE_MODULE : contains
    COURSE ||--o{ COURSE_ENROLLMENT : has
    COURSE }|--|| CATEGORY : belongs_to

    COURSE_MODULE ||--o{ COURSE_MATERIAL : has

    BLOG_POST }|--|| CATEGORY : categorized_by
    BLOG_POST }|--o{ TAG : tagged_with

    EVENT ||--o{ EVENT_REGISTRATION : has

    USER {
        string username
        string email
        string password
        string firstName
        string lastName
        string phone
        string address
        string gender
        date dateOfBirth
        string profilePicture
        string role
        boolean isActive
        boolean isEmailVerified
    }

    COURSE {
        string title
        string slug
        string description
        string excerpt
        string thumbnail
        string courseType
        number price
        string accessType
        boolean isActive
        boolean isFeatured
        number enrollmentCount
        string level
    }

    COURSE_MODULE {
        string title
        string description
        number order
        boolean isActive
    }

    COURSE_MATERIAL {
        string title
        string materialType
        string file
        string externalLink
        number order
        boolean isActive
        boolean isFree
    }

    COURSE_ENROLLMENT {
        date enrolledAt
        number progress
        boolean isCompleted
    }

    BLOG_POST {
        string title
        string slug
        string content
        string excerpt
        string featuredImage
        string status
        boolean isFeatured
        date publishedAt
        number viewCount
        number readTime
    }

    CATEGORY {
        string name
        string slug
        string description
    }

    TAG {
        string name
        string slug
    }

    EVENT {
        string title
        string slug
        string description
        string eventType
        string thumbnail
        date startDateTime
        date endDateTime
        string meetingLink
        string address
        number maxParticipants
        number registrationCount
        boolean isActive
        boolean isFeatured
    }

    EVENT_REGISTRATION {
        date registeredAt
        string notes
        boolean attended
    }

    INSTRUCTOR {
        string name
        string img
        string studyArea
    }

    COURSE_APPLICATION {
        string courseTitle
        string fullName
        string email
        string phoneNumber
        string educationLevel
        string note
        string status
    }

    ACTIVITY_LOG {
        string action
        string details
        date timestamp
    }
