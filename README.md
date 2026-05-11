A production-grade, full-stack serverless event management platform built entirely on AWS.

## Architecture Overview

```
[React + Vite Frontend]
        │
  [CloudFront CDN]
        │
  [API Gateway REST]
        │
  [Lambda Functions (Node.js 18)]
   ┌────┴──────────────────────────────────────┐
   │                                            │
[Cognito Auth]  [RDS PostgreSQL + Prisma]  [S3 + CloudFront]
                                                │
                                      [Secrets Manager / SSM]
                                                │
                                    [SES Email] ← [SQS Queue] ← [Registration]
                                                │           └──→ [DLQ]
                                      [EventBridge Scheduler]
                                                │
                                       [Reminder Lambda → SES]
                                                │
                                          [CloudWatch Logs]
                                                │
                                        [GitHub Actions CI/CD]
```

---

## Tech Stack used

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion |
| Backend | Node.js 18, AWS Lambda, Serverless Framework |
| API | AWS API Gateway (REST) |
| Auth | AWS Cognito User Pools + aws-amplify |
| Database | PostgreSQL on AWS RDS + Prisma ORM |
| File Storage | Amazon S3 + Pre-signed URLs |
| CDN | Amazon CloudFront |
| Email | AWS SES |
| Scheduling | Amazon EventBridge (daily cron) |
| Async Queue | Amazon SQS + Dead Letter Queue |
| Secrets | AWS SSM Parameter Store |
| Monitoring | AWS CloudWatch Logs |
| CI/CD | GitHub Actions |

---

## Prerequisites

Make sure these are installed before starting:

```powershell
# Run in PowerShell (as Administrator if needed)
node --version        # v18 or v20
npm --version         # v9+
aws --version         # AWS CLI v2
git --version
```

Install global tools:
```powershell
npm install -g serverless
npm install -g prisma
```

---

## Phase 1 — AWS Setup & RDS Database

### 1.1 Configure AWS CLI
```powershell
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output (json)
```

### 1.2 Create RDS PostgreSQL Instance
```powershell
# In PowerShell
aws rds create-db-instance `
  --db-instance-identifier cloudwave-db `
  --db-instance-class db.t3.micro `
  --engine postgres `
  --master-username cloudwave `
  --master-user-password YOUR_STRONG_PASSWORD `
  --allocated-storage 20 `
  --publicly-accessible `
  --region us-east-1
```

### 1.3 Store Secrets in SSM Parameter Store
```powershell
# Database URL
aws ssm put-parameter `
  --name "/cloudwave/dev/database-url" `
  --value "postgresql://cloudwave:PASSWORD@YOUR_RDS_ENDPOINT:5432/cloudwave" `
  --type "SecureString" `
  --region us-east-1

# SES From Email
aws ssm put-parameter `
  --name "/cloudwave/dev/ses-from-email" `
  --value "noreply@yourdomain.com" `
  --type "String" `
  --region us-east-1
```

---

## Phase 2 — Backend Setup

### 2.1 Install dependencies
```powershell
# In PowerShell - navigate to backend folder
cd cloudwave-events\backend
npm install
```

### 2.2 Copy and configure environment
```powershell
copy .env.example .env
# Edit .env with your actual values using Notepad or VS Code
```

### 2.3 Generate Prisma client and run migrations
```powershell
npx prisma generate
npx prisma migrate dev --name init
```

### 2.4 Deploy backend to AWS
```powershell
npx serverless deploy --stage dev
```

After deploy, copy the API Gateway URL from the output.

---

## Phase 3 — Frontend Setup

### 3.1 Install dependencies
```powershell
cd ..\frontend
npm install
```

### 3.2 Configure environment
```powershell
copy .env.example .env
# Fill in VITE_API_URL, VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_CLIENT_ID
```

### 3.3 Run locally
```powershell
npm run dev
# Opens at http://localhost:3000
```

### 3.4 Build for production
```powershell
npm run build
```

---

## ⚙️ Phase 4 — SES Email Setup

```powershell
# Verify your sender email in SES
aws ses verify-email-identity `
  --email-address noreply@yourdomain.com `
  --region us-east-1

# Verify a test recipient (while in SES sandbox)
aws ses verify-email-identity `
  --email-address your@email.com `
  --region us-east-1
```

---

## Phase 5 — Frontend CloudFront Deployment

```powershell
# Create S3 bucket for frontend
aws s3 mb s3://cloudwave-frontend-YOUR_ACCOUNT_ID --region us-east-1

# Build and deploy
cd frontend
npm run build
aws s3 sync dist/ s3://cloudwave-frontend-YOUR_ACCOUNT_ID --delete
```

Create a CloudFront distribution pointing to this S3 bucket via the AWS Console.

---

## Phase 6 — CI/CD Setup (GitHub Actions)

Add these secrets to your GitHub repository (`Settings → Secrets → Actions`):

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | `us-east-1` |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `VITE_API_URL` | API Gateway URL |
| `VITE_COGNITO_USER_POOL_ID` | From Cognito console |
| `VITE_COGNITO_CLIENT_ID` | From Cognito console |
| `FRONTEND_S3_BUCKET` | S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |
| `SERVERLESS_ACCESS_KEY` | From serverless.com dashboard |

---

## API Endpoints

### Events
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/events` | Public | List all events (supports `?search=`, `?page=`, `?limit=`) |
| `GET` | `/events/{id}` | Public | Get single event |
| `POST` | `/events` |  Required | Create event |
| `PUT` | `/events/{id}` |  Required | Update event (owner only) |
| `DELETE` | `/events/{id}` |  Required | Delete event (owner only) |

### Registrations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/events/{id}/register` |  Required | Register for event |
| `GET` | `/registrations/me` |  Required | Get my registrations |
| `PATCH` | `/registrations/{id}/cancel` |  Required | Cancel registration |

### Files
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/files/presigned-url` |  Required | Get S3 pre-signed upload URL |

---

##  Database Schema

```
User          — Synced from Cognito on registration
Event         — Created by authenticated users
Registration  — Links users to events (unique constraint prevents duplicates)
```

---

##  Async Flow (SQS)

```
User Registers
    │
    ▼
Registration saved to DB
    │
    ▼
Message sent to SQS Queue
    │
    ▼
processEmailQueue Lambda triggered
    │
    ▼
Confirmation email sent via SES
    │
    ▼ (on failure after 3 retries)
Message moved to DLQ
```

---

##  EventBridge Scheduler

Runs daily at **9:00 AM UTC**. Finds all events happening tomorrow and sends reminder emails to every confirmed registrant.

---

##  Project Structure

```
cloudwave-events/
├── backend/
│   ├── src/
│   │   ├── functions/         # Lambda handlers
│   │   │   ├── auth/          # Cognito PostConfirmation trigger
│   │   │   ├── events/        # CRUD operations
│   │   │   ├── registrations/ # Register, list, cancel
│   │   │   ├── files/         # S3 pre-signed URLs
│   │   │   ├── notifications/ # SQS email processor
│   │   │   └── scheduler/     # EventBridge reminder job
│   │   ├── libs/              # Shared utilities (db, s3, ses, sqs)
│   │   ├── middleware/        # JWT auth verifier
│   │   └── prisma/            # Schema + migrations
│   └── serverless.yml         # Infrastructure as Code
├── frontend/
│   └── src/
│       ├── pages/             # Route-level components
│       ├── components/        # Reusable UI components
│       ├── context/           # React Auth context
│       └── api/               # Axios layer
├── .github/workflows/         # CI/CD pipelines
└── README.md
```

---

##  Security Highlights

- JWT tokens validated server-side on every protected Lambda
- Secrets stored in SSM Parameter Store (never hardcoded)
- S3 files accessed via pre-signed URLs (no public bucket)
- Content served via CloudFront (S3 not directly exposed)
- Cognito handles all password policies and token lifecycle

---

##  CloudWatch Monitoring

All Lambda functions log structured output with `[functionName]` prefixes. View logs:

```powershell
# PowerShell
aws logs tail /aws/lambda/cloudwave-events-backend-dev-getEvents --follow
```

---

*Built as the AWS Serverless Bootcamp capstone project.*
