# HackDataV2 — Synthetic Data Studio

An enterprise synthetic data generation platform designed for modern software development, data science, and compliance testing. HackDataV2 creates realistic, privacy-compliant tabular datasets, multi-table relational databases, and verified business documents on demand.

---

## Key Features

- **Natural Language to Schema Planning**: AI translates conversational prompts into structured table blueprints and field schemas (`/api/analyze`).
- **High-Speed Deterministic Generation**: Zero-cost, millisecond-latency generation using seedable pseudo-random number generators (`/api/generate/tabular`).
- **Topological Relational Integrity**: Preserves parent-child foreign key mappings (e.g. `Customers` $\to$ `Orders` $\to$ `OrderItems`) with guaranteed non-orphan referential integrity (`/api/generate/relational`).
- **Mathematically Verified Documents**: Dedicated generators for commercial invoices ($Total = Subtotal + Tax$) and bank statement ledgers ($Closing = Opening + Credits - Debits$).
- **Multi-Format Export Suite**: Export to CSV (PapaParse), formatted JSON, production-grade SQL (DDL `CREATE TABLE` + batch `INSERT`s), and PDF (jsPDF).
- **Automated Validation & Quality Scoring**: Real-time evaluation of schema validity, primary key uniqueness, foreign key integrity, null rates, and type compliance with composite percentage scores.
- **Strict Privacy Guarantees**: 100% synthetic data derived from locale dictionaries; no real customer data is ever ingested or retained.

---

## Tech Stack

- **Framework**: Next.js 16.3.7 (App Router, Turbopack)
- **Language**: TypeScript 5.8 (Strict Mode)
- **Frontend**: React 19, Tailwind CSS v4, Lucide React
- **Backend**: Next.js Route Handlers (`src/app/api/`)
- **AI Integration**: `@google/generative-ai` (Gemini 3.8 Flash, 2.5 Flash, 1.5 Flash with deterministic fallback engine)
- **Data & Export Utilities**: PapaParse (CSV), jsPDF (PDF export)

---

## Documentation

Project documentation is organized under the `docs/` directory:
- [Technical Project Documentation (Markdown)](./docs/HackDataV2_Technical_Documentation.md)
- [Technical Project Documentation (PDF)](./docs/HackDataV2_Technical_Documentation.pdf)
- [Requirements Audit Matrix](./docs/REQUIREMENTS_AUDIT.md)

*Note: All generated synthetic demonstration files (invoices, statements) are stored in `outputs/documents/` and are labeled `SYNTHETIC DATA — FOR DEMONSTRATION ONLY`.*

---

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or pnpm

### Installation

```bash
# Clone or navigate to the repository root
cd hackdatav2

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Add your Google AI Studio API key:
# GEMINI_API_KEY=your_key_here
```

### Running the Application

```bash
# Start the development server
npm run dev

# Open your browser at
http://localhost:3000
```

### Building for Production

```bash
npm run build
npm run start
```

---

## API Catalog

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service status, version, and AI availability |
| `/api/upload` | `POST` | CSV file upload and schema inference |
| `/api/analyze` | `POST` | Natural language prompt $\to$ structured schema plan |
| `/api/generate/tabular` | `POST` | Seedable deterministic single-table generation |
| `/api/generate/relational` | `POST` | Topological multi-table generation with verified FKs |
| `/api/generate/invoice` | `POST` | Mathematically verified commercial invoice |
| `/api/generate/bank-statement`| `POST` | Chronological bank ledger with non-negative balances |
| `/api/generate/document` | `POST` | AI-assisted & deterministic business document generator |
| `/api/validate` | `POST` | Dataset schema and integrity validator |

---

## License & Attribution

HackDataV2 Synthetic Data Studio — Built for HackDataV2.
All synthetic generation algorithms and schemas are strictly for testing, QA, and demonstration purposes.
