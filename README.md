<div align="center">
  <img src="frontend/public/razorpay-official-logo.png" alt="Razorpay" height="60" />
</div>

# RPAI — Razor Pay Artificial Intelligence

> **AI-Powered Financial Intelligence & Payment Operations Platform**
> Live Project Link: **https://rpai-official.netlify.app/**

Live Project Link: **[https://rpai.netlify.app/](https://rpai.netlify.app/)**

RPAI is a professional, full-stack financial platform providing two connected intelligence layers:
1. **PAYMENT INTELLIGENCE**: Live Razorpay Test Mode checkout, deterministic fraud risk engine, automated payment recovery, bank reconciliation, and governance audit trails.
2. **CREDIT INTELLIGENCE (CreditGrow AI)**: AI-generated Business Credit Readiness scoring (0–100), transparent factor breakdowns, 6 specialized RPAi AI Agents, credit simulation, and responsible lending controls for individuals and MSMEs.

---

## 📋 Table of Contents

1. [Architecture & Tech Stack](#-architecture--tech-stack)
2. [Project Structure](#-project-structure)
3. [Quick Start & Local Setup](#-quick-start--local-setup)
4. [Database Schemas](#-database-schemas)
5. [API Documentation](#-api-documentation)
6. [Razorpay Test Mode Integration](#-razorpay-test-mode-integration)
7. [Webhook Configuration Guide](#-webhook-configuration-guide)
8. [AI Tools & Grounding System](#-ai-tools--grounding-system)
9. [End-to-End Testing Guide (Test Flows 1–9)](#-end-to-end-testing-guide)
10. [Security & PCI-DSS Compliance](#-security--pci-dss-compliance)

---

## 🏗 Tech Stack & Architecture

### Backend
- **Runtime**: Node.js v18+ with Express & TypeScript
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT Tokens & `bcrypt` Password Hashing (Salt rounds: 12)
- **Validation**: `Zod` Schema Validation
- **Payment Gateway**: Server-side `razorpay` SDK & HMAC SHA256 Signature Verification
- **Security**: `helmet`, `cors`, Express Rate Limiter, Raw-body Webhook Buffer Verification

### Frontend
- **Framework**: Vite + React 18 with TypeScript
- **Styling**: TailwindCSS with custom financial banking UI tokens (`banking-card-shadow`, `banking-card-hover`)
- **Visualizations**: `Recharts` for risk line charts, payment status distribution, and volume trends
- **Routing**: React Router v6 with `MainLayout` & `AuthLayout` guards

---

## 📁 Project Structure

```
RPAI/
├── backend/
│   ├── src/
│   │   ├── agents/          # Controlled AI Tools & Query Execution Engine
│   │   ├── config/          # Environment variables & Mongoose database setup
│   │   ├── controllers/     # Express route handlers (Auth, Payments, Actions, Risk, etc.)
│   │   ├── fraud/           # Deterministic Rule-Based Risk Engine (0-100 score)
│   │   ├── middleware/      # Auth JWT, Rate Limiting, Error Handling
│   │   ├── models/          # Mongoose Schemas (User, Transaction, RiskAnalysis, AuditLog, etc.)
│   │   ├── razorpay/        # Razorpay SDK initialization, order creation, refund & signature helpers
│   │   ├── routes/          # API route definitions (/auth, /payments, /actions, /risk, /ai, /audit)
│   │   ├── utils/           # Response formatters, logger
│   │   ├── webhooks/        # Raw-body Razorpay webhook receiver & signature verification
│   │   ├── app.ts           # Express app setup & security middlewares
│   │   └── server.ts        # HTTP server listener
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── charts/          # Recharts components (TransactionChart, RiskDistributionChart, etc.)
│   │   ├── components/      # UI elements (Button, Table, Card, Modal, EmptyState, ErrorState, Tooltip, Skeleton)
│   │   ├── contexts/        # React Contexts (AuthContext, SidebarContext, TestModeContext)
│   │   ├── layouts/         # MainLayout (Header + Sidebar + Outlet) & AuthLayout
│   │   ├── pages/           # Platform pages (Dashboard, Payments, RiskCenter, Recovery, Reconciliation, AiAssistant, AuditLogs)
│   │   ├── services/        # Axios API client
│   │   ├── utils/           # Formatters (INR currency, dates, risk badges)
│   │   └── App.tsx          # Application routing configuration
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance running on `mongodb://localhost:27017` (or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env to set your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET if using live test credentials
npm run dev
```
Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🗄 Database Schemas

### 1. `User` Schema
Stores merchant profile credentials securely:
- `fullName`: `String` (Required)
- `merchantName`: `String` (Required)
- `email`: `String` (Unique, Required)
- `passwordHash`: `String` (bcrypt hashed, min 12 salt rounds)
- `mobileNumber`: `String`
- `businessCategory`: `String`
- `country`: `String` (Default: `'India'`)
- `role`: `'merchant'` | `'admin'`

### 2. `Transaction` Schema
Stores payment telemetry & gateway status:
- `merchantId`: `String` (Indexed)
- `transactionId`: `String` (Unique, Primary ID)
- `razorpayOrderId`: `String` (Server-side order ID)
- `razorpayPaymentId`: `String` (Returned after checkout)
- `amount`: `Number` (Rupees)
- `amountInPaise`: `Number`
- `currency`: `String` (`'INR'`)
- `paymentMethod`: `'card'` | `'upi'` | `'netbanking'` | `'wallet'` | `'pending'`
- `status`: `'CREATED'` | `'AUTHORIZED'` | `'CAPTURED'` | `'FAILED'` | `'HELD'` | `'REFUNDED'`
- `riskScore`: `Number` (`0 - 100`)
- `riskLevel`: `'low'` | `'medium'` | `'high'` | `'critical'`
- `riskReasons`: `[String]`
- `failureReason`: `String`

### 3. `RiskAnalysis` Schema
Deterministic fraud evaluation records:
- `paymentId`: `String` (Unique)
- `riskScore`: `Number` (`0 - 100`)
- `riskCategory`: `'low'` | `'medium'` | `'high'` | `'critical'`
- `factors`: `[String]`
- `aiExplanation`: `String`
- `recommendedAction`: `String`

### 4. `ReconciliationRun` Schema
3-way reconciliation batches:
- `batchId`: `String` (Unique)
- `totalTransactions`: `Number`
- `matched`: `Number`
- `mismatched`: `Number`
- `totalDifference`: `Number`
- `items`: `[ReconciliationItem]` (Contains `internalAmount`, `razorpayAmount`, `difference`, `aiExplanation`)

### 5. `AuditLog` Schema
Immutable platform governance record:
- `actorType`: `'AI'` | `'HUMAN'` | `'SYSTEM'`
- `actor`: `String` (Email or Agent Name)
- `action`: `String` (`'HOLD_PAYMENT'`, `'REFUND_PAYMENT'`, `'RUN_RECONCILIATION'`, etc.)
- `category`: `'payment'` | `'risk'` | `'recovery'` | `'auth'` | `'system'` | `'settings'`
- `transactionId`: `String`
- `details`: `String`
- `reason`: `String`
- `result`: `'SUCCESS'` | `'FAILED'`
- `ipAddress`: `String`

---

## 📡 API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create RPAI merchant account (bcrypt salt 12)
- `POST /api/auth/login` — Login with email/password, returns JWT token
- `GET /api/auth/me` — Get active session merchant profile

### Payments (`/api/payments`)
- `POST /api/payments/create-order` — Create Razorpay order (converts Rupees to Paise)
- `POST /api/payments/verify` — Verify Razorpay HMAC SHA256 payment signature & capture
- `POST /api/payments/fail` — Record payment failure & trigger risk analysis
- `GET /api/payments` — Search, filter, and paginate merchant payments

### Controlled Actions (`/api/actions`) — Require Confirmation
- `POST /api/actions/hold` — Set internal RPAI review status to HELD
- `POST /api/actions/release` — Release internal hold back to CAPTURED
- `POST /api/actions/refund` — Execute Razorpay Refund API call
- `POST /api/actions/recovery` — Create new Razorpay order linked to failed payment
- `POST /api/actions/create-link` — Generate smart recovery payment link
- `POST /api/actions/reconcile` — Run bank statement reconciliation batch

### AI Assistant (`/api/ai`)
- `POST /api/ai/ask` — Natural language query engine using grounded tool execution

### Governance Audit (`/api/audit`)
- `GET /api/audit` — Get audit log history with actor and category filters
- `GET /api/audit/security-status` — System health check for DB, Gateway, Webhooks, and AI
- `GET /api/audit/timeline/:paymentId` — Sequential event timeline for specific transaction

---

## 💳 Razorpay Test Mode Integration

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/) and switch to **Test Mode**.
2. Navigate to **Account & Settings &rarr; API Keys** and generate a Key ID and Key Secret.
3. Add the keys to `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_YourKeyId
   RAZORPAY_KEY_SECRET=YourKeySecret
   ```
4. Configure frontend `VITE_RAZORPAY_KEY_ID` in `frontend/.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyId
   ```
5. Standard Razorpay Checkout handles sensitive card numbers. **RPAI backend verifies payment signatures server-side** using HMAC SHA256 matching:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id}, \text{key\_secret})$$

---

## 🔔 Webhook Configuration Guide

1. Go to **Razorpay Dashboard &rarr; Settings &rarr; Webhooks &rarr; Add New Webhook**.
2. Set Webhook URL: `https://your-domain.com/api/webhooks/razorpay`
3. Enter Secret: `your_webhook_secret_here`
4. Select Events:
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
5. Copy secret into `backend/.env` under `RAZORPAY_WEBHOOK_SECRET`.
6. RPAI captures raw request body buffers to verify signatures securely:
   $$\text{Webhook Signature} = \text{HMAC-SHA256}(\text{rawBody}, \text{webhookSecret})$$

---

## 🤖 AI Tools & Grounding System

RPAI utilizes a **Controlled AI Tool Registry** (`/backend/src/agents/index.ts`). The LLM does **not** make direct database mutations or invent fraud scores.

### Registered Tools
1. `get_transaction(id)` — Fetch transaction record by ID
2. `search_transactions(query)` — Filter payments by status, customer, or amount
3. `get_customer_history(email)` — Aggregate customer spend & failed attempts
4. `get_risk_analysis(paymentId)` — Retrieve deterministic risk factors & scores
5. `get_dashboard_metrics()` — Get volume, success rate, and refund stats
6. `get_failed_payments()` — Get list of 3DS drops & failures
7. `get_recoverable_payments()` — Identify recovery candidates
8. `get_audit_log()` — Retrieve actor governance history
9. `run_reconciliation()` — Run 3-way matching engine

### Grounding Rules
- **No Hallucinations**: If data does not exist, AI responds *"I couldn't find matching records."*
- **Confirmation Requirement**: Sensitive actions (Hold, Refund, Recovery) present interactive confirmation buttons (`[Confirm Hold]`, `[Confirm Refund]`). Backend code executes only after explicit merchant button click.

---

## 🧪 End-to-End Testing Guide

Execute the following 9 test flows to verify platform stability:

### Test Flow 1: Account Registration & Auth
- Navigate to `/register` and create an account.
- Sign in at `/login`. Verify JWT token storage and dynamic header greeting.

### Test Flow 2: Razorpay Test Mode Payment
- Navigate to `/payments/create` and initiate a ₹45,000 checkout.
- Complete payment in Razorpay Checkout modal using Test Mode credentials.
- Verify server-side HMAC signature validation, MongoDB transaction update, and dashboard volume update.

### Test Flow 3: Controlled Payment Failure
- Initiate a test payment and choose **Fail** in Razorpay Checkout modal.
- Verify status changes to `FAILED` and transaction appears in Recovery Center.

### Test Flow 4: Suspicious Transaction Risk Scoring
- Perform a high-value transaction (₹1,28,000) with rapid retry attempts.
- Verify risk score computes deterministically (`89/100 CRITICAL`) with evidence factors in Risk Center.

### Test Flow 5: AI Grounded Tool Query
- Open `/ai-assistant` and ask: *"Show today's failed payments"*.
- Verify response matches actual database records.

### Test Flow 6: Transaction Risk AI Explanation
- In `/ai-assistant`, ask: *"Why was transaction pay_MkkX9102bc flagged?"*.
- Verify AI lists exact evidence points (3DS timeout, velocity burst, location anomaly).

### Test Flow 7: Safe Action Execution with Confirmation
- Ask AI: *"Hold transaction pay_MkkX9102bc"*.
- Verify AI displays `[Confirm Hold]` button. Click button to update status to `HELD` and verify Audit Log entry.

### Test Flow 8: Razorpay Refund Processing
- Select a captured payment and click **Refund**. Confirm in modal.
- Verify Razorpay Refund API call executes, status changes to `REFUNDED`, and audit entry is created.

### Test Flow 9: Reconciliation Engine Batch
- Navigate to `/reconciliation` and click **Run Reconciliation**.
- Verify 3-way matching executes, displaying matched vs mismatched records and writing an audit log entry.

---

## 🛡 Security & PCI-DSS Compliance

- **PCI-DSS Zero-PAN Storage Rule**: RPAI **never** stores full credit/debit card numbers, CVVs, PINs, or card passwords. Sensitive card information is handled entirely by Razorpay Checkout.
- **Secret Isolation**: `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` exist solely on the server backend `.env` file.
- **Rate Limiting**: Express API rate limiter enforces 100 requests per 15-minute window per IP endpoint.
- **Audit Governance**: Every system, human, and AI action records `actorType`, `actor`, `action`, `transactionId`, `details`, `reason`, `result`, and `ipAddress`.
