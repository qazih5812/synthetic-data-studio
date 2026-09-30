import { unparse } from 'papaparse';
import { Mode } from '@/components/Workspace';

async function getJsPDF() {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
}

/**
 * Export data to CSV. Supports Tabular arrays, Relational multi-table,
 * Bank Statement transactions, and Invoice line items.
 */
export const exportToCSV = (data: any, mode: Mode) => {
  if (!data) {
    alert('No data to export.');
    return;
  }

  if (mode === 'tabular') {
    if (!Array.isArray(data) || data.length === 0) {
      alert('No tabular rows to export.');
      return;
    }
    const csv = unparse(data);
    downloadFile(csv, 'tabular_data.csv', 'text/csv');
  } else if (mode === 'relational') {
    if (typeof data !== 'object' || Array.isArray(data)) {
      alert('Invalid relational data format.');
      return;
    }
    let combined = '';
    for (const [table, rows] of Object.entries(data)) {
      combined += `-- Table: ${table} --\n`;
      combined += unparse(rows as any[]);
      combined += '\n\n';
    }
    downloadFile(combined, 'relational_data.csv', 'text/csv');
  } else if (mode === 'bank-statement') {
    if (!data.transactions || !Array.isArray(data.transactions)) {
      alert('No transaction records found to export.');
      return;
    }
    const csv = unparse(data.transactions);
    downloadFile(csv, 'bank_statement_transactions.csv', 'text/csv');
  } else if (mode === 'invoice') {
    if (!data.lineItems || !Array.isArray(data.lineItems)) {
      alert('No invoice line items found to export.');
      return;
    }
    const csv = unparse(data.lineItems);
    const filename = `${data.invoiceNumber || 'invoice'}_items.csv`;
    downloadFile(csv, filename, 'text/csv');
  } else {
    // Generic fallback for document or other structures
    const rows = Array.isArray(data) ? data : [data];
    const csv = unparse(rows);
    downloadFile(csv, `${mode}_data.csv`, 'text/csv');
  }
};

/**
 * Export structured JSON formatted with 2-space indentation.
 */
export const exportToJSON = (data: any, mode: Mode) => {
  if (!data) {
    alert('No data to export.');
    return;
  }
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${mode}_data.json`, 'application/json');
};

/**
 * Export SQL DDL and INSERT statements compatible with PostgreSQL / MySQL.
 */
export const exportToSQL = (data: any, mode: Mode) => {
  if (!data) {
    alert('No data to export.');
    return;
  }

  let sql = `-- ========================================================\n`;
  sql += `-- HackDataV2 Synthetic Data Studio — SQL Export\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Mode: ${mode}\n`;
  sql += `-- ========================================================\n\n`;

  function inferSqlType(val: any): string {
    if (val === null || val === undefined) return 'VARCHAR(255)';
    if (typeof val === 'number') {
      return Number.isInteger(val) ? 'INTEGER' : 'NUMERIC(12,2)';
    }
    if (typeof val === 'boolean') return 'BOOLEAN';
    if (typeof val === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return 'DATE';
      if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return 'TIMESTAMP';
      if (val.length > 255) return 'TEXT';
      return 'VARCHAR(255)';
    }
    return 'TEXT';
  }

  function escapeSqlVal(val: any): string {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    return `'${String(val).replace(/'/g, "''")}'`;
  }

  function generateTableSql(tableName: string, rows: any[]): string {
    if (!rows || rows.length === 0) return `-- Empty table: ${tableName}\n\n`;

    const sample = rows[0];
    const columns = Object.keys(sample);

    let ddl = `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
    const colDefs = columns.map(col => {
      const type = inferSqlType(sample[col]);
      const isPk = col.toLowerCase() === 'id' ? ' PRIMARY KEY' : '';
      return `  "${col}" ${type}${isPk}`;
    });
    ddl += colDefs.join(',\n') + '\n);\n\n';

    let inserts = '';
    const chunkSize = 50;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      inserts += `INSERT INTO "${tableName}" ("${columns.join('", "')}") VALUES\n`;
      const valRows = chunk.map(row => {
        const vals = columns.map(c => escapeSqlVal(row[c]));
        return `  (${vals.join(', ')})`;
      });
      inserts += valRows.join(',\n') + ';\n\n';
    }

    return ddl + inserts;
  }

  if (mode === 'tabular' && Array.isArray(data)) {
    sql += generateTableSql('synthetic_tabular', data);
  } else if (mode === 'relational' && typeof data === 'object' && !Array.isArray(data)) {
    for (const [table, rows] of Object.entries(data)) {
      if (Array.isArray(rows)) {
        sql += generateTableSql(table, rows);
      }
    }
  } else if (mode === 'bank-statement' && data.transactions) {
    sql += generateTableSql('bank_statement_transactions', data.transactions);
  } else if (mode === 'invoice' && data.lineItems) {
    sql += generateTableSql('invoice_items', data.lineItems);
  } else {
    const rows = Array.isArray(data) ? data : [data];
    sql += generateTableSql('exported_data', rows);
  }

  downloadFile(sql, `${mode}_export.sql`, 'application/sql');
};

/**
 * Export document or dataset as PDF using jsPDF.
 */
export const exportToPDF = async (data: any, mode: Mode) => {
  try {
    const jsPDF = await getJsPDF();
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('HackDataV2 — Synthetic Data Studio', 15, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()} | Mode: ${mode.toUpperCase()}`, 15, 28);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 32, 195, 32);

    const element = document.getElementById('preview-content-container');

    if (element && mode !== 'tabular' && mode !== 'relational') {
      const { default: html2canvas } = await import('html2canvas');
      // Save original style to restore later
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;
      
      // Temporarily modify styles to capture full content
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      
      // Restore original styles
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      doc.addImage(imgData, 'PNG', 15, 40, imgWidth, imgHeight);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);

      const formattedText = JSON.stringify(data, null, 2);
      const lines = doc.splitTextToSize(formattedText, 180);

      let y = 40;
      for (let i = 0; i < lines.length; i++) {
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(lines[i], 15, y);
        y += 4.5;
      }
    }

    doc.save(`${mode}_export.pdf`);
  } catch (e: any) {
    console.error('[exportToPDF] Error:', e.message);
    throw new Error(`PDF export failed: ${e.message}`);
  }
};

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
