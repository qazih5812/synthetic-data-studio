# HackDataV2 — Technical Project Documentation

---

## 1. Cover Page

```
================================================================================
                               HACKDATAV2
                         SYNTHETIC DATA STUDIO
                  Enterprise Synthetic Data Generator
================================================================================
Document Type   : Technical Project Documentation
Project Name    : HackDataV2 Synthetic Data Studio
Version         : 2.0.0
Date            : September 2026
Technology Stack: Next.js 16.3 (Turbopack), TypeScript 5.8, React 19, Tailwind CSS v4,
                  Google Generative AI SDK, jsPDF, PapaParse
Repository Root : hackdatav2/
Environment     : Node.js 20+ Runtime, TypeScript Strict Mode
================================================================================
```

---

## 2. Executive Summary

**HackDataV2 Synthetic Data Studio** is a unified synthetic data platform designed for modern software development, data science, and compliance testing. It allows developers and analysts to generate realistic, structurally valid, and mathematically verified synthetic data across tabular datasets, complex relational multi-table schemas, and business documents.

### The Problem
Traditional test data generation relies on either:
1. **Manual mocking**: Extremely slow, unmaintainable, and prone to edge-case omission.
2. **Production data cloning**: Poses critical regulatory and privacy risks (GDPR, HIPAA, and localized privacy regulations).
3. **Pure LLM row generation**: Suffers from high latency, severe token quota limits, high financial costs, and arithmetic inconsistencies (e.g. totals not matching line items).

### The HackDataV2 Solution
HackDataV2 implements a **hybrid architecture**:
- **AI Intelligence Layer**: Interprets natural language requests and converts them into structured schema blueprints, table relationships, and field definitions.
- **Deterministic High-Speed Generation Engine**: Generates records programmatically using a seedable Linear Congruential Generator (LCG). This provides zero API cost, millisecond generation times, and 100% reproducible test suites.
- **Topological Relational Graph**: Orders table creation so foreign keys reference genuine parent primary keys, eliminating orphan records.
- **Verification & Quality Engine**: Validates schema compliance, uniqueness, null rates, and arithmetic correctness post-generation.

---

## 3. Problem Statement

Modern enterprise engineering teams face persistent bottlenecks when building against data pipelines and databases:
1. **Relational Referential Integrity**: Child tables (e.g. `Orders`) frequently fail referential integrity constraints when test data is generated without topological dependency ordering.
2. **Business Rule Arithmetic**: Generated documents such as invoices or bank statements often display conflicting figures (e.g. `subtotal + tax != total` or `balance != opening + credits - debits`).
3. **Locale Realism**: Mock datasets often default to North American names and addresses, failing QA requirements for regional systems (e.g. Pakistani names, PKR currency, CNIC/NTN formats).
4. **Data Privacy**: Using real customer data in staging environments risks severe regulatory fines and data leaks.

---

## 4. Proposed Solution & Generation Pipeline

HackDataV2 solves this through a deterministic pipeline:

```
[ User Intent ]
       │
       ▼
[ AI Understanding & Analysis (/api/analyze) ]
       │
       ▼
[ Structured Generation Plan & Schema Blueprint ]
       │
       ▼
[ Deterministic PRNG Engine (/api/generate/tabular, /api/generate/relational) ]
       │
       ├── Topological Sort (Parents -> Children)
       ├── Locale Data Mapping (en-US, pk, en-GB, etc.)
       └── Edge Case Injection (Controlled Nulls, Outliers)
       │
       ▼
[ Automated Validation Engine (/api/validate) ]
       │
       ├── Primary Key Uniqueness & Foreign Key Integrity
       ├── Mathematical Assertions & Constraint Verification
       └── Quality Report Card (Score 0-100%, PASS/FAIL/WARN)
       │
       ▼
[ Unified Synthetic Documents & Exports ]
       ├── CSV (PapaParse)
       ├── JSON (Formatted)
       ├── SQL (DDL CREATE TABLE + batch INSERT)
       └── PDF (jsPDF)
```

---

## 5. Competition Requirements Mapping

| Requirement | Implementation Detail | Status |
| :--- | :--- | :--- |
| **Project Setup** | Next.js 16.3.7, Tailwind CSS v4, Lucide React, TypeScript 5.8 | `COMPLETE` |
| **CSV Upload & Inference** | `POST /api/upload` parses CSV, detects PKs, types, and sample data | `COMPLETE` |
| **Schema Inference** | `inferFieldType()`, `inferPrimaryKey()`, `inferForeignKeys()` | `COMPLETE` |
| **Natural Language Input** | `POST /api/analyze` parses freeform requests via Gemini | `COMPLETE` |
| **AI Generation Plan** | Emits table schemas, field types, row counts, and FK mappings | `COMPLETE` |
| **Tabular Generation** | Deterministic generator with seedable PRNG, 1-500 rows | `COMPLETE` |
| **Relational Generation** | Multi-table generation with topological parent-child ordering | `COMPLETE` |
| **PK / FK Integrity** | Enforced by feeding parent generated keys into child FK columns | `COMPLETE` |
| **Constraints Engine** | `validateConstraint()` parses and validates arithmetic and boundary rules | `COMPLETE` |
| **Edge Cases** | Configurable null rates, outliers, and boundary testing values | `COMPLETE` |
| **Validation Engine** | Multi-point automated checks on all generation runs | `COMPLETE` |
| **Quality Report** | Visual report with check metrics, badges, and overall score | `COMPLETE` |
| **Privacy Checks** | Zero real-world customer data stored; uniqueness scoring | `COMPLETE` |
| **Invoice Generation** | Dedicated endpoint with verified math assertions ($Total = Subtotal + Tax$) | `COMPLETE` |
| **Bank Statement** | Chronological ledger with verified non-negative running balances | `COMPLETE` |
| **Locale Support** | `en-US` and `pk` (Pakistan PKR, Pakistani names, cities, phone formats) | `COMPLETE` |
| **AI Provider Fallback** | Multi-model fallback (`gemini-3.8-flash` -> `gemini-2.5-flash` -> offline engine) | `COMPLETE` |
| **Preview** | Paginated tables, multi-table cards, rendered invoice and bank ledgers | `COMPLETE` |
| **Export Suite** | CSV, JSON, SQL (DDL + batch INSERT), and PDF | `COMPLETE` |
| **API Endpoints** | Clean REST JSON endpoints with standardized error formatting | `COMPLETE` |
| **UI/UX** | Dark-mode SaaS application with Dashboard, Generator, and Sidebar | `COMPLETE` |
| **Testing** | Node integration tests, TypeScript type checks, production build | `COMPLETE` |
| **Documentation** | Technical documentation, requirements audit, and setup guide | `COMPLETE` |
| **Deployment** | `next build` static and server route generation; ready for Vercel/Node | `COMPLETE` |

---

## 6. System Features

### 6.1 Interactive Dashboard
- **Key Performance Indicators**: Total generation runs, active datasets, and average quality scores.
- **Generation History**: Recalls the 20 most recent generation jobs with timestamps, row counts, and modes.
- **Quick-Start Templates**: One-click launchers for Tabular, Relational, Invoice, and Bank Statement generators.

### 6.2 Generator Studio
- **Mode Selector**: Tabular, Relational, Document, Invoice, and Bank Statement modes.
- **Configuration Sidebar**: Configures locales, row limits, schema definitions, seeds, and constraints.
- **Interactive Live Preview**: Instant switching between rendered visual layouts, paginated tables, and raw JSON views.

### 6.3 Quality & Validation Card
- Evaluates dataset health automatically after each run.
- Reports status for Schema Validity, PK Uniqueness, FK Referential Integrity, Null Rates, and Type Compliance.

---

## 7. System Architecture

The architecture separates UI orchestration, AI planning, deterministic execution, and export formatting:

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Client (React 19)                │
│   Dashboard  │  Generator Studio  │  Live Preview  │ Export │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│             Next.js 16 App Router (Node.js Runtime)         │
│                                                             │
│  /api/health       /api/upload          /api/analyze        │
│  /api/validate     /api/generate/tabular                    │
│  /api/generate/relational   /api/generate/invoice           │
│  /api/generate/bank-statement   /api/generate/document      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│     AI Intelligence Layer   ││  Deterministic Engine (Pure) │
│  - Gemini 3.8 / 2.5 Flash   ││  - SeededRandom (LCG)        │
│  - Natural Language Planner ││  - Topological Sorter        │
│  - JSON Schema Constrained  ││  - Rule & Constraint Engine  │
│  - Model Fallback Cascade   ││  - Locale Provider (US, PK)  │
└─────────────────────────────┘└──────────────┬───────────────┘
                                              │
┌─────────────────────────────────────────────▼───────────────┐
│              Validation & Export Layer                      │
│  - PapaParse (CSV)          - jsPDF (PDF Documentation)     │
│  - SQL Generator (DDL)      - JSON Serializer               │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Technology Stack

### Frontend & Application Framework
- **Framework**: Next.js 16.3.7 (App Router, Turbopack)
- **Language**: TypeScript 5.8 (Strict Mode)
- **UI Components**: React 19.3.0
- **Styling**: Tailwind CSS v4.3.3 + Vanilla CSS design tokens
- **Icons**: Lucide React 1.48.0

### Backend & API
- **Runtime**: Node.js 20+
- **API Architecture**: Next.js Route Handlers (`src/app/api/`)
- **JSON Parser & Sanitizer**: Custom fault-tolerant truncation recovery (`gemini-json.ts`)

### AI Integration
- **SDK**: `@google/generative-ai` v0.24.1
- **Models**: `gemini-3.8-flash`, `gemini-2.5-flash`, `gemini-1.5-flash`
- **Output Mode**: `responseMimeType: 'application/json'`

### Data Generation & Utilities
- **Deterministic PRNG**: Linear Congruential Generator ($a = 16807, m = 2^{31}-1$)
- **CSV Engine**: PapaParse 5.7.0
- **PDF Engine**: jsPDF 4.2.1

---

## 9. AI Architecture & Programmatic Separation

A core architectural principle of HackDataV2 is **isolating AI to high-level planning** while delegating row generation to deterministic algorithms:

### What AI Does:
1. **Intent Extraction**: Translates requests like *"Generate a hospital patient registry in Pakistan"* into entity relations.
2. **Schema Generation**: Infers field names, primary keys, and data types.
3. **Constraint Identification**: Proposes business rules (e.g. `discharge_date >= admission_date`).

### What AI Does NOT Do:
1. **Bulk Row Generation**: Large structured datasets (e.g. 5,000 customers or 20,000 orders) are **never** generated via LLM token streams. This eliminates:
   - Token exhaustion and truncation errors.
   - High API charges.
   - Latency bottlenecks.
2. **Direct Arithmetic Computations**: Totals and balances are computed mathematically in code.

---

## 10. Schema Inference & CSV Upload

The schema inference engine (`POST /api/upload`) parses uploaded CSV files and determines:
1. **Column Detection**: Extracts clean header names.
2. **Data Type Inference**: Analyzes sampled values using regular expressions and heuristics:
   - Integer, Float, Boolean, Date, Email, Phone, Currency, Salary.
3. **Primary Key Detection**: Identifies columns with 100% uniqueness and zero nulls named `id` or ending in `_id`.
4. **Foreign Key Suggestions**: Detects columns matching `[table]_id` or referencing known entities.

---

## 11. Tabular Data Generation

The tabular generator (`POST /api/generate/tabular`) supports:
- **Primitive Types**: `integer`, `float`, `boolean`, `string`, `date`, `datetime`, `timestamp`.
- **Domain Types**: `name`, `first_name`, `last_name`, `email`, `phone`, `address`, `city`, `country`, `company`, `role`, `salary`, `status`, `currency`.
- **Reproducibility**: Providing a `seed` guarantees identical output across repeated runs.
- **Configurable Row Count**: Fast generation up to 500 rows per batch.

---

## 12. Relational Generation & Referential Integrity

Relational data requires parent-child coherence. HackDataV2 achieves this via a topological graph:
1. **Dependency Analysis**: Parent tables (e.g. `Customers`) are generated before dependent tables (e.g. `Orders`).
2. **Key Extraction**: Primary keys from `Customers` are collected in an in-memory registry.
3. **Key Injection**: When `Orders` rows are generated, the `customer_id` field randomly samples genuine IDs from the parent table.
4. **Child Tables**: `OrderItems` selects actual `order_id` values from generated orders.

This guarantees:
$$\forall \text{ order} \in \text{Orders}, \quad \text{order.customer\_id} \in \text{Customers.id}$$

---

## 13. Constraint Engine

The constraint engine (`validateConstraint`) parses and enforces business rules:
- **Comparison Constraints**: `age >= 18`, `salary > 0`, `quantity >= 1`.
- **Date Sequencing**: `end_date >= start_date`, `due_date >= invoice_date`.
- **Arithmetic Assertions**: `total == subtotal + tax`.

The engine reports a compliance percentage and pinpoints specific violating rows if edge cases violate business logic.

---

## 14. Edge Case Lab

To test downstream systems under realistic conditions, HackDataV2 allows controlled injection of anomalies:
- **Null Values**: Configurable null probability per column (primary keys remain non-null).
- **Outliers**: Extreme values (e.g. salaries $> 10 \times \text{median}$).
- **Rare Categories**: Infrequently occurring status codes or states.
- **Safety**: Primary and foreign key referential integrity is preserved even when edge cases are active.

---

## 15. Validation Engine

Every dataset undergoes automated validation prior to rendering:
1. **Schema Check**: Confirms expected columns exist and types match declarations.
2. **Primary Key Uniqueness**: Checks that primary key columns contain zero duplicates.
3. **Foreign Key Integrity**: Confirms all foreign key values exist in the parent table.
4. **Null Rate Analysis**: Computes null percentage across all cells.
5. **Type Verification**: Verifies numbers, dates, and emails adhere to expected patterns.

---

## 16. Quality Report

The UI displays an interactive **Quality Report** summarizing verification results:
- **Score**: $0\%$ to $100\%$ composite fidelity rating.
- **Status Indicators**:
  - `PASS` (Green checkmark)
  - `WARN` (Yellow alert)
  - `FAIL` (Red cross)
- **Check Metrics**: Explicit counters (e.g. `15/15 valid FKs`, `0.0% nulls`).

---

## 17. Privacy & Security

HackDataV2 enforces strict privacy safeguards:
- **Pure Synthetic Data**: All names, addresses, phone numbers, and records are synthesized from locale dictionaries; no real personal data is collected or stored.
- **Zero Client Key Exposure**: `GEMINI_API_KEY` is accessed exclusively in server-side route handlers.
- **No Production Cloning**: Synthetic generators remove the need to sanitize or mask sensitive production databases.

---

## 18. Synthetic Document Generation

> **IMPORTANT DISTINCTION:**
> Generated documents (Invoices, Bank Statements, SOWs) represent **SYNTHETIC TEST DATA** for software demonstration and testing. They are **NOT** project documentation.

All generated business documents include the prominent visual watermark:
`"SYNTHETIC DATA — FOR DEMONSTRATION ONLY"`

### Supported Document Types:
1. **Commercial Invoice**:
   - Includes issuer, client, invoice number, date, line items (qty, unit price, amount), subtotal, tax, and total.
   - Enforces $Total = Subtotal + Tax$.
2. **Bank Statement**:
   - Includes bank header, account holder, account number, period, and transaction ledger.
   - Enforces non-negative solvency and running balance math:
     $$Balance_t = Balance_{t-1} + Credit_t - Debit_t$$
3. **Contracts & SOWs**:
   - Service agreements, scopes of work, and medical summaries generated via structured templates.

---

## 19. Same Synthetic World Consistency

When an invoice or bank statement is generated, its entities align with the active synthetic world:
- The customer on the invoice matches an actual customer in the generated relational database.
- The order ID and line item totals mirror the relational order records.
- Bank statement debits reflect transaction amounts generated in purchase records.

---

## 20. User Interface & Screen Architecture

The UI is built with a responsive dark-mode aesthetic:
1. **Sidebar Navigation**: Mode selection and screen switching.
2. **Dashboard Screen**: Generation metrics, history list, and quick starters.
3. **Generator Screen**: Dual-pane workspace with configuration sidebar on the left and preview pane on the right.
4. **Live Preview Panel**:
   - Paginated data tables.
   - Multi-table relational cards.
   - Formatted Invoice and Bank Statement cards.
   - Raw JSON editor with syntax coloring.
5. **Quality Report Card**: Real-time status badges and scores.

---

## 21. API Documentation

### `GET /api/health`
- **Description**: Returns service health, version, and AI configuration status.
- **Response**: `200 OK`
  ```json
  { "status": "ok", "service": "HackDataV2 Synthetic Data Studio", "version": "2.0.0", "ai": "configured" }
  ```

### `POST /api/upload`
- **Description**: Analyzes uploaded CSV files for schema inference.
- **Request**: `multipart/form-data` with `file` field.
- **Response**: `200 OK` with inferred schema and preview rows.

### `POST /api/analyze`
- **Description**: Translates natural language requests into structured generation plans.
- **Request**: `{ "prompt": "Pakistani e-commerce store with orders", "locale": "pk" }`
- **Response**: `200 OK` with domain, tables, fields, and constraints.

### `POST /api/generate/tabular`
- **Description**: Generates deterministic tabular datasets.
- **Request**: `{ "schema": "id:id, name:name, email:email", "rowCount": 20, "seed": 42 }`
- **Response**: `200 OK` with `data` array and `validation` summary.

### `POST /api/generate/relational`
- **Description**: Generates multi-table relational datasets with verified foreign keys.
- **Request**: `{ "schema": "Customers(id, name), Orders(id, customer_id, total:price)", "rowCount": 10 }`
- **Response**: `200 OK` with table dictionaries and referential integrity metrics.

### `POST /api/generate/invoice`
- **Description**: Generates a mathematically verified invoice.
- **Request**: `{ "locale": "pk", "lineItemCount": 4, "taxRate": 17 }`
- **Response**: `200 OK` with invoice object, line items, and arithmetic check.

### `POST /api/generate/bank-statement`
- **Description**: Generates a bank statement ledger with verified running balances.
- **Request**: `{ "locale": "pk", "months": 3, "openingBalance": 50000 }`
- **Response**: `200 OK` with transaction ledger and solvency validation.

### `POST /api/generate/document`
- **Description**: Generates unstructured and structured business documents.
- **Request**: `{ "query": "Software consulting agreement", "locale": "en-US" }`
- **Response**: `200 OK` with structured document and validation metrics.

### `POST /api/validate`
- **Description**: Standalone endpoint for evaluating datasets against schemas and rules.
- **Request**: `{ "mode": "tabular", "data": [...], "schema": [...] }`
- **Response**: `200 OK` with checks and overall score.

---

## 22. Database Design & Relational Model

The relational generator supports multi-tier entity structures:

```
┌─────────────────────────┐
│        Customers        │
├─────────────────────────┤
│ id (PK, Integer)        │
│ name (String)           │
│ email (Email)           │
│ city (City)             │
│ phone (Phone)           │
└────────────┬────────────┘
             │ 1:N
             ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│         Orders          │       │      Bank Accounts      │
├─────────────────────────┤       ├─────────────────────────┤
│ id (PK, Integer)        │       │ account_no (PK, String) │
│ customer_id (FK -> Cust)│◄──────┤ customer_id (FK -> Cust)│
│ order_date (Date)       │       │ balance (Float)         │
│ total (Price)           │       └────────────┬────────────┘
│ status (Status)         │                    │ 1:N
└────────────┬────────────┘                    ▼
             │ 1:N                ┌─────────────────────────┐
             ▼                    │      Transactions       │
┌─────────────────────────┐       ├─────────────────────────┤
│       OrderItems        │       │ tx_id (PK, String)      │
├─────────────────────────┤       │ account_no (FK -> Acct) │
│ id (PK, Integer)        │       │ debit / credit (Float)  │
│ order_id (FK -> Orders) │       │ running_balance (Float) │
│ product (String)        │       └─────────────────────────┘
│ quantity (Integer)      │
│ unit_price (Price)      │
└─────────────────────────┘
```

---

## 23. Security & Compliance

1. **Environment Isolation**: API credentials are stored in `.env.local` and never passed to the browser bundle.
2. **File Sanitization**: Uploaded CSV files are processed in-memory without persistent disk execution, mitigating file inclusion vulnerabilities.
3. **CORS & Rate Limiting**: Next.js route handlers manage requests within boundary limits.
4. **Input Boundary Enforcement**: Row count inputs are clamped between 1 and 500 to prevent denial-of-service memory spikes.

---

## 24. Verification & Testing Summary

All features have been tested and verified:
- **Build Verification**: `next build` executed with **0 errors** across all static and dynamic routes.
- **API Health Check**: `GET /api/health` returned `200 OK` with AI configured.
- **Tabular Generation**: Successfully generated 500-row datasets with 100% uniqueness and zero orphan cells.
- **Relational Integrity**: 100% of generated orders mapped directly to genuine customer primary keys.
- **Mathematical Consistency**: Invoice line items sum to subtotal, tax applies accurately, and bank ledgers maintain exact balances.
- **Document Resilience**: Tested AI failure modes; deterministic fallback successfully produced documents without 500 errors.

---

## 25. Deployment & Execution Guide

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Add GEMINI_API_KEY=your_key

# 3. Start local development server
npm run dev
# Server accessible at http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

### Deployment Status
- **Current State**: Locally tested and verified on Node.js / Windows.
- **Target Hosting**: Ready for immediate deployment to Vercel, AWS ECS, or Docker containers.

---

## 26. Known Limitations

1. **In-Memory Scale**: Current in-memory generator caps single-batch generation at 500 rows for optimal sub-second browser latency. (Larger batches require streaming or background queues).
2. **Deep Relational Hierarchies**: Relational schemas currently support up to 4 tiers of parent-child dependencies efficiently.
3. **Local Storage Persistence**: History is maintained in the current browser session. A persistent database (e.g. PostgreSQL) would be required for team multi-tenancy.

---

## 27. Future Improvements

1. **Streaming CSV/Parquet Export**: Enable background jobs for 100,000+ row datasets streamed directly to S3.
2. **Custom LLM Fine-Tuning**: Support self-hosted open-source models (e.g. Llama 3) via Ollama/vLLM.
3. **Visual Schema Builder**: Drag-and-drop node graph canvas for building relational table schemas.
4. **Multi-User Collaboration**: Shared team workspaces and schema templates.

---

## 28. Complete Demo Workflow

To demonstrate HackDataV2 in a competition or evaluation setting:
1. **Launch Studio**: Open `http://localhost:3000` to view the Dashboard.
2. **Natural Language Plan**:
   - Navigate to **Generator** $\to$ select **Relational**.
   - Input: *"Pakistani E-Commerce store with Customers, Orders, and Items"*.
   - Review auto-populated table schemas with foreign key mappings.
3. **Generate Dataset**:
   - Set Locale to `pk (Pakistani)`, Row Count to `20`, Seed to `42`.
   - Click **Generate Data**.
4. **Inspect Quality Report**:
   - Confirm $100\%$ score across Schema Validity, PK Uniqueness, and FK Integrity.
5. **Verify Business Documents**:
   - Switch mode to **Invoice** $\to$ Generate Invoice $\to$ Observe exact subtotal and tax math.
   - Switch mode to **Bank Statement** $\to$ Generate Statement $\to$ Verify running balance.
6. **Export Data**:
   - Click **SQL** to download `relational_export.sql` containing DDL and batch INSERT statements.
   - Click **CSV** to download structured tables.
   - Click **PDF** to download the document summary.
