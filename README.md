# Transaction Reconciliation Engine

A production-style backend reconciliation engine built with Node.js, TypeScript, MongoDB, and Express.js.

This system ingests transaction data from multiple CSV sources, validates and normalizes records, performs tolerance-based reconciliation, detects conflicts/unmatched transactions, and generates reconciliation reports in both JSON and CSV formats.

Built as part of the KoinX Backend Take Home Assignment.

---

# Features

- CSV ingestion from multiple transaction sources
- Validation using Zod
- Asset normalization (BTC = Bitcoin)
- Transaction type normalization
- Tolerance-based reconciliation engine
- Conflict detection
- Invalid transaction handling
- REST APIs for reports
- CSV report export
- MongoDB persistence
- Layered backend architecture
- Configurable matching tolerances

---

# Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose
- Zod
- Multer
- csv-parser
- json2csv

---

# Project Architecture

```text
CSV Files
    ↓
CSV Parser
    ↓
Validation Layer (Zod)
    ↓
Normalization Layer
    ↓
MongoDB Storage
    ↓
Reconciliation Engine
    ↓
Report APIs / CSV Export
```

# folder Structure

```text
src
│
├── config
├── controllers
├── engines
├── middlewares
├── models
├── normalizers
├── parsers
├── routes
├── services
├── types
├── utils
├── validators
│
├── app.ts
└── server.ts

```

# Reconciliation Workflow

1. CSV Ingestion

The system accepts:

- user_transactions.csv
- exchange_transactions.csv

Both files are parsed and stored in MongoDB.

2. Validation

Transactions are validated using Zod.

Validation includes:

- Required fields
- Valid timestamps
- Positive quantities
- Numeric price and fee validation

Invalid rows are NOT discarded.

They are:

- stored in MongoDB
- marked with validationStatus = INVALID
- excluded from reconciliation
- available for auditing/debugging

3. Normalization

The engine normalizes assets and transaction types before matching.

Asset Normalization

Examples:

```text
BTC → BTC
Bitcoin → BTC
ETH → ETH
Ethereum → ETH
Transaction Type Normalization
```

Examples:

```text
TRANSFER_IN → TRANSFER
TRANSFER_OUT → TRANSFER
```

# Matching Strategy

### Transactions are matched using:

- Normalized asset comparison
- Normalized transaction type comparison
- Quantity tolerance percentage
- Timestamp tolerance window

### The reconciliation engine supports:

- Case-insensitive matching
- Alias handling
- Approximate timestamp matching
- Approximate quantity matching

# Matching Rules

### A transaction is considered MATCHED when:

- Asset matches
- Type matches
- Timestamp difference is within tolerance
- Quantity difference is within tolerance

### A transaction is considered CONFLICTING when:

- Potential match exists
- But quantity or timestamp exceeds tolerance

### A transaction is considered UNMATCHED when:

- No corresponding transaction is found

# Reconciliation Categories

### MATCHED

Transactions successfully matched between user and exchange data.

### CONFLICTING

Transactions partially matched but exceeded configured tolerances.

Examples:

- Quantity mismatch
- Timestamp mismatch

### UNMATCHED_USER

Transaction exists only in user file.

### UNMATCHED_EXCHANGE

Transaction exists only in exchange file.

# API Endpoints

### POST /api/reconcile

Upload CSV files and trigger reconciliation.

Request

Multipart form-data:

```text
userFile
exchangeFile
```

Response

```json
{
  "success": true,
  "data": {
    "runId": "..."
  }
}
```

### GET /api/report/:runId

Fetch full reconciliation report.

### GET /api/report/:runId/summary

Fetch reconciliation summary.

Example Response

```json
{
  "matched": 21,
  "conflicting": 1,
  "unmatchedUser": 1,
  "unmatchedExchange": 3,
  "invalid": 3
}
```

### GET /api/report/:runId/unmatched

Fetch unmatched transactions only.

### GET /api/report/:runId/export

Export reconciliation report as CSV.

## CSV Export

The engine supports exporting reconciliation results as downloadable CSV reports.

Exported CSV contains:

- category
- reason
- userTransactionId
- exchangeTransactionId
- asset
- quantity

# Environment Variables

Create a .env file:

```env

PORT=3000

MONGO_URI=your_mongodb_connection_string

TIMESTAMP_TOLERANCE_SECONDS=300

QUANTITY_TOLERANCE_PCT=0.01
```

# Setup Instructions

1. Clone Repository

```bash
git clone https://github.com/Kushalchavan/transaction-reconciliation-engine.git
```

2. Install Dependencies

```bash
npm install
```

3. Configure Environment Variables

Create .env file.

4. Run Development Server

```bash
npm run dev
```

# Assumptions & Tradeoffs

- Invalid transactions are stored for audit purposes
- Invalid transactions are excluded from reconciliation
- One exchange transaction can match only one user transaction
- Nearest valid match is prioritized
- Timestamp matching uses configurable tolerance windows
- Asset matching is case-insensitive after normalization

# Sample Invalid Data Handled

The engine correctly handles:

- Negative quantities
- Missing timestamps
- Malformed timestamps
- Asset aliases
- Transaction type aliases

# Key Engineering Decisions

### Why Store Invalid Rows?

Invalid rows are stored instead of discarded because:

- Financial systems require auditability
- Data quality issues must remain traceable
- Users may need debugging visibility

### Why Normalize Data?

External systems often use inconsistent naming conventions.

Normalization ensures:

- consistent reconciliation
- better matching accuracy
- reduced false mismatches

# Author

Kushal Chavan

GitHub:
https://github.com/Kushalchavan
