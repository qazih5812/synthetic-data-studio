<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<br />

<div align="center">
  <h1 align="center">HackDataV2 — Synthetic Data Studio</h1>
  <p align="center">
    <strong>An Enterprise-Grade AI-Powered Synthetic Data Generation Platform</strong>
  </p>
</div>

HackDataV2 is an advanced web platform designed for software engineers, data scientists, and QA testers to generate highly realistic, secure, and structured synthetic data on demand. Powered by **Google Gemini AI** with a robust **Deterministic Fallback Engine**, it completely eliminates the need for manual data entry while ensuring 100% privacy compliance.

---

## 🌟 Core Modules

### 1. Tabular Data Generator 📊
- **Purpose**: Generates single tables of flat data (e.g., Users, Products, Logs) based on custom schema definitions.
- **Use Case**: Instantly populate bulk data for database seeding, CSV imports, or functional testing.

### 2. Relational Graph Generator 🔗
- **Purpose**: Generates multiple interconnected tables while preserving strict **Foreign Key (FK)** integrity (e.g., *Customers* $\to$ *Orders* $\to$ *OrderItems*).
- **Use Case**: Stress-testing complex SQL databases and relational topological structures.

### 3. Synthetic Document 📄
- **Purpose**: Creates realistic structured documents such as corporate Contracts, NDAs, and Statements of Work (SOWs).
- **Use Case**: Training NLP models or testing PDF parsers and document processing pipelines.

### 4. Synthetic Invoice 🧾
- **Purpose**: Generates mathematically verified billing data complete with line items, unit prices, quantities, taxes, and perfectly calculated subtotals/totals.
- **Use Case**: Testing E-commerce platforms, ERP systems, and accounting software.

### 5. Synthetic Statement (Bank Ledger) 🏦
- **Purpose**: Generates chronological bank account statements featuring realistic running balances, credits, and debits without going into a negative balance.
- **Use Case**: FinTech application testing and financial dashboard visualization.

---

## 🔥 Top Winning Features

1. **Hybrid AI & Deterministic Engine**: Primarily driven by **Gemini 3.8 Flash**. If the AI API is unavailable, the system automatically routes to a zero-cost, millisecond-latency deterministic fallback engine.
2. **Multi-Language Support (Locales)**: Generate region-specific data (e.g., US English, Urdu) directly via prompt context, ensuring culturally accurate names, cities, and textual formats.
3. **Data Quality & Validation Report**: Every generation includes an automated real-time quality audit assessing schema validity, null rates, Primary Key (PK) uniqueness, and type compliance.
4. **Multi-Format Export Suite**: Export your generated datasets to **CSV, JSON, SQL** (with `CREATE TABLE` and `INSERT` statements), and **PDF** directly from the UI.
5. **Secure Workspace**: Built-in authentication module to protect your data studio and APIs from unauthorized access.

---

## 💻 Tech Stack & UI/UX

- **Framework**: Next.js (App Router, Turbopack) for blazing fast performance.
- **Styling**: Tailwind CSS v4 featuring a premium **Glassmorphism** design language. 
- **Theming**: Fully responsive UI with perfectly synchronized **Dark & Light Mode** themes.
- **Backend APIs**: Next.js Serverless Route Handlers (`/api/generate/*`).
- **Data & Export Utilities**: PapaParse (CSV), jsPDF (PDF export).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone or navigate to the repository
cd hackdatav2

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Add your Google AI Studio API key in .env.local:
# GEMINI_API_KEY="your_api_key_here"
```

### Run the Application

```bash
# Start the development server
npm run dev

# Open your browser at
http://localhost:3000
```

---

## 📡 API Catalog

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service status, version, and AI availability |
| `/api/upload` | `POST` | CSV file upload and schema inference |
| `/api/analyze` | `POST` | Natural language prompt $\to$ structured schema plan |
| `/api/generate/tabular` | `POST` | Seedable deterministic & AI single-table generation |
| `/api/generate/relational` | `POST` | Topological multi-table generation with verified FKs |
| `/api/generate/invoice` | `POST` | Mathematically verified commercial invoice |
| `/api/generate/bank-statement`| `POST` | Chronological bank ledger with non-negative balances |
| `/api/generate/document` | `POST` | AI-assisted & deterministic business document generator |
| `/api/validate` | `POST` | Dataset schema and integrity validator |

---

## ⚖️ License & Attribution

HackDataV2 Synthetic Data Studio — Built for HackDataV2.
*Note: All generated synthetic data, algorithms, and documents are strictly for testing, QA, and demonstration purposes. No real user data is ever ingested or retained.*
