# Tirelire API

A REST API for managing rotating savings and credit associations (ROSCAs), also known as "Darte" in Morocco or "Tirelire" in French. This platform lets users create and join savings groups with automated payment tracking, KYC verification, and cycle management.

## 📋 Table of Contents

- [Features](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Technology Stack](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Prerequisites](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Installation](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Configuration](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [API Documentation](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Database Models](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Project Structure](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Usage Examples](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)
- [Security](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21)

## ✨ Features

### Core Functionality

- **User Authentication**: Secure registration and login with JWT tokens
- **KYC Verification**: National ID verification with document upload
- **Group Management**: Create and manage savings groups (tontines)
- **Payment Tracking**: Monitor contributions and payment history
- **Cycle Management**: Automated payout rotation system
- **Notifications**: Real-time alerts for payments and cycles
- **Messaging**: In-group communication system

### Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Admin/Particulier)
- File upload validation and sanitization

## 🛠 Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod v4.1.12
- **File Upload**: Multer v2.0.2
- **Password Hashing**: bcryptjs v3.0.2
- **Development**: Nodemon v3.1.10

## 📦 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm package manager

## 🚀 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd Tirelire

```

1. **Install dependencies**

```bash
npm install

```

1. **Create environment file**

```bash
# Create .env file in the root directory
touch .env

```

1. **Configure environment variables** (see [Configuration](https://www.notion.so/cb4369d9154f41a18de6c57a17e0d638?pvs=21))
2. **Start MongoDB**

```bash
# Make sure MongoDB is running locally or provide remote connection string
mongod

```

1. **Run the application**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
node src/server.js

```

The server will start on `http://localhost:3000`

## ⚙️ Configuration

Create a `.env` file in the root directory with these variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/Tirelire

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880

```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api

```

### Authentication Endpoints

### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}

```

**Response:**

```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "Particulier"
    },
    "token": "jwt_token_here"
  }
}

```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}

```

**Response:**

```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "Particulier",
      "isKYCVerified": false,
      "facialVerificationStatus": "pending"
    },
    "token": "jwt_token_here"
  }
}

```

### KYC Endpoints

### Submit KYC Verification

```
POST /api/kyc/submit
Authorization: Bearer {token}
Content-Type: multipart/form-data

nationalIdNumber: "AB123456"
nationalIdImage: [file]

```

**Response:**

```json
{
  "message": "KYC verification has been submitted",
  "data": {
    "user": "user_id",
    "nationalIdNumber": "AB123456",
    "nationalIdImage": "/path/to/image.jpg",
    "status": "pending",
    "submittedAt": "2025-10-17T10:00:00.000Z"
  }
}

```

### Get KYC Status

```
GET /api/kyc/status
Authorization: Bearer {token}

```

**Response:**

```json
{
  "data": {
    "user": "user_id",
    "nationalIdNumber": "AB123456",
    "status": "pending",
    "submittedAt": "2025-10-17T10:00:00.000Z"
  }
}

```

### Group Endpoints

### Create Group

```
POST /api/group
Authorization: Bearer {token}
Content-Type: application/json

{
  "groupName": "Monthly Savings Group",
  "amountPerCycle": 10000,
  "totalCycle": 12,
  "members": ["user_id_1", "user_id_2"],
  "paymentSchedule": ["2025-11-01", "2025-12-01"]
}

```

### Get All Groups

```
GET /api/group
Authorization: Bearer {token}

```

### Get Specific Group

```
GET /api/group/:groupId
Authorization: Bearer {token}

```

### Update Group

```
PATCH /api/group/:groupId
Authorization: Bearer {token}
Content-Type: application/json

{
  "groupName": "Updated Group Name"
}

```

### Delete Group

```
DELETE /api/group/:groupId
Authorization: Bearer {token}

```

## 🗄️ Database Models

### User Model

```jsx
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  nationalIdNumber: String,
  nationalIdImage: String,
  role: Enum["Particulier", "Admin"] (default: "Particulier"),
  isKYCVerified: Boolean (default: false),
  groups: [ObjectId -> Group],
  paymentHistory: [ObjectId -> Payment],
  notifications: [ObjectId -> Notification],
  messages: [ObjectId -> Message],
  facialVerificationStatus: Enum["pending", "verified", "failed"],
  createdAt: Date,
  updatedAt: Date
}

```

### Group Model

```jsx
{
  groupName: String (required),
  createdBy: [ObjectId -> User] (required),
  members: [ObjectId -> User],
  amountPerCycle: Number (required),
  totalCycle: Number (required),
  currentCycle: Number (default: 1),
  paymentSchedule: [Date],
  payments: [ObjectId -> Payment],
  potDistributionOrder: [ObjectId -> User],
  groupFund: Number (default: 0),
  isActive: Boolean (default: true),
  nextPayoutUser: ObjectId -> User,
  messages: [ObjectId -> Message],
  notifications: [ObjectId -> Notification],
  status: Enum["waiting", "active", "completed", "cancelled"],
  createdAt: Date,
  updatedAt: Date
}

```

### KYCVerification Model

```jsx
{
  user: ObjectId -> User (required),
  nationalIdNumber: String (required),
  nationalIdImage: String (required),
  status: Enum["pending", "approved", "rejected", "under_review"],
  reviewedBy: ObjectId -> User,
  reviewedAt: Date,
  rejectionReason: String,
  verificationNotes: String,
  submittedAt: Date
}

```

### Payment Model

```jsx
{
  amount: Number (required),
  paidBy: ObjectId -> User (required),
  group: ObjectId -> Group (required),
  cycleNumber: Number,
  paymentDate: Date (required),
  status: Enum["pending", "completed", "failed"],
  confirmedBy: ObjectId -> User,
  createdAt: Date,
  updatedAt: Date
}

```

### Message Model

```jsx
{
  group: ObjectId -> Group (required),
  sender: ObjectId -> User (required),
  content: String,
  type: Enum["text", "audio"],
  audioUrl: String,
  readBy: [ObjectId -> User],
  createdAt: Date
}

```

### Notification Model

```jsx
{
  recipientUser: ObjectId -> User,
  recipientGroup: ObjectId -> Group,
  type: Enum["paymentReminder", "cycleStart", "cycleEnd", "message", "info", "alert"],
  message: String (required),
  scheduledAt: Date,
  sentAt: Date,
  isSent: Boolean (default: false),
  link: String,
  createdAt: Date,
  updatedAt: Date
}

```

## 📁 Project Structure

```
Tirelire/
├── src/
│   ├── config/
│   │   └── MongodbConnection.js    # Database connection configuration
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── group.controller.js     # Group management logic
│   │   └── kyc.controller.js       # KYC verification logic
│   ├── middlewares/
│   │   ├── admin.js                # Admin authorization
│   │   ├── auth.js                 # JWT authentication
│   │   └── upload.js               # File upload configuration
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Group.js                # Group schema
│   │   ├── KYCVerification.model.js # KYC schema
│   │   ├── Payment.js              # Payment schema
│   │   ├── Message.js              # Message schema
│   │   └── Notification.js         # Notification schema
│   ├── routes/
│   │   ├── auth.routes.js          # Authentication routes
│   │   ├── group.routes.js         # Group routes
│   │   └── kyc.routes.js           # KYC routes
│   ├── services/
│   │   ├── group.service.js        # Group business logic
│   │   └── kyc.service.js          # KYC business logic
│   ├── utils/
│   │   └── generateToken.js        # JWT token generation
│   ├── validation/
│   │   ├── kyc.validation.js       # KYC validation schemas
│   │   └── validation.js           # General validation schemas
│   ├── app.js                      # Express app configuration
│   │   └── server.js                   # Server entry point
├── public/
│   └── uploads/
│       └── kyc/                    # KYC document uploads
├── .env                            # Environment variables
├── package.json                    # Dependencies and scripts
└── README.md                       # This file

```

## 💡 Usage Examples

### Complete User Flow

1. **Register a new user**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "password": "securePass123"
  }'

```

1. **Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securePass123"
  }'

```

1. **Submit KYC**

```bash
curl -X POST http://localhost:3000/api/kyc/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "nationalIdNumber=AB123456" \
  -F "nationalIdImage=@/path/to/id.jpg"

```

1. **Create a group** (after KYC approval)

```bash
curl -X POST http://localhost:3000/api/group \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupName": "Friends Savings Circle",
    "amountPerCycle": 5000,
    "totalCycle": 10
  }'

```

## 🔒 Security

### Security Measures

1. **Password Security**
    - Passwords hashed using bcrypt (12 salt rounds)
    - Never stored or transmitted in plain text
2. **JWT Authentication**
    - Stateless token-based authentication
    - Tokens expire after 7 days (configurable)
    - Tokens include user ID in payload
3. **Authorization**
    - Role-based access control (RBAC)
    - Admin-only routes protected
    - User-specific data access restrictions
4. **File Upload Security**
    - File type validation (images only)
    - File size limits (5MB max)
    - Secure file naming with timestamps
    - Isolated upload directory
5. **Input Validation**
    - Zod schema validation for all inputs
    - Email format validation
    - Password strength requirements

### Best Practices

- Always use HTTPS in production
- Update dependencies regularly
- Implement rate limiting for API endpoints
- Use environment variables for sensitive data
- Enable MongoDB authentication in production
- Handle errors properly without exposing sensitive information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Development Team — *Initial work*

## 🙏 Acknowledgments

- Express.js community
- MongoDB team
- All contributors and testers

---

**Note**: This is a development version. For production deployment, ensure proper security configurations, environment variables, and infrastructure setup.