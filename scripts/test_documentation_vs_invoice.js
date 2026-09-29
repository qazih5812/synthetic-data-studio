/**
 * test_documentation_vs_invoice.js
 *
 * Regression test script verifying:
 * 1. POST /api/documentation/generate generates genuine Technical Project Documentation
 *    and NEVER produces commercial invoice fields (invoiceNumber, subtotal, taxAmount, etc.).
 * 2. POST /api/generate/invoice still functions independently as a synthetic demonstration generator.
 */

async function runRegressionTests() {
  console.log('================================================================');
  console.log(' HACKDATAV2 REGRESSION SUITE: DOCUMENTATION VS INVOICE SEPARATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // ── TEST 1: Technical Documentation Generation ─────────────────────────────
  console.log('[TEST 1] Testing POST /api/documentation/generate...');
  try {
    const docRes = await fetch('http://localhost:3000/api/documentation/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    assert(docRes.ok, `HTTP Status is 200 (received ${docRes.status})`);
    const doc = await docRes.json();

    assert(doc.success === true, 'Response success is true');
    assert(
      doc.documentType === 'technical_project_documentation',
      `documentType is "technical_project_documentation" (received "${doc.documentType}")`
    );
    assert(doc.title.includes('Technical Project Documentation'), 'Title indicates Technical Documentation');
    assert(doc.sectionsCount === 32, `Contains 32 technical documentation chapters (found ${doc.sectionsCount})`);

    // Verify ABSENCE of invoice fields in documentation root
    assert(doc.invoiceNumber === undefined, 'No "invoiceNumber" field in documentation output');
    assert(doc.issuer === undefined, 'No "issuer" field in documentation output');
    assert(doc.lineItems === undefined, 'No "lineItems" field in documentation output');
    assert(doc.subtotal === undefined, 'No "subtotal" field in documentation output');
    assert(doc.taxAmount === undefined, 'No "taxAmount" field in documentation output');
    assert(doc.taxLabel === undefined, 'No "taxLabel" field in documentation output');

    // Verify presence of technical topics in markdown
    assert(doc.markdown.includes('Topological Relational Integrity') || doc.markdown.includes('System Architecture'), 'Markdown contains system architecture documentation');
    assert(doc.markdown.includes('Next.js 16'), 'Markdown documents real Next.js 16 technology stack');

  } catch (err) {
    console.error('Test 1 failed with error:', err.message);
    failed++;
  }

  // ── TEST 2: Direct PDF Retrieval for Technical Documentation ───────────────
  console.log('\n[TEST 2] Testing GET /api/documentation/generate?download=pdf...');
  try {
    const pdfRes = await fetch('http://localhost:3000/api/documentation/generate?download=pdf');
    assert(pdfRes.ok, `HTTP Status is 200 (received ${pdfRes.status})`);
    const contentType = pdfRes.headers.get('content-type');
    assert(contentType && contentType.includes('application/pdf'), `Content-Type is application/pdf (received "${contentType}")`);
    const disposition = pdfRes.headers.get('content-disposition');
    assert(disposition && disposition.includes('HackDataV2_Technical_Documentation.pdf'), `Attachment filename is HackDataV2_Technical_Documentation.pdf`);
  } catch (err) {
    console.error('Test 2 failed with error:', err.message);
    failed++;
  }

  // ── TEST 3: Synthetic Business Invoice Generation Still Works ──────────────
  console.log('\n[TEST 3] Testing POST /api/generate/invoice...');
  try {
    const invRes = await fetch('http://localhost:3000/api/generate/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: 'pk', lineItemCount: 3, taxRate: 17, seed: 99 }),
    });

    assert(invRes.ok, `HTTP Status is 200 (received ${invRes.status})`);
    const inv = await invRes.json();

    assert(inv.data !== undefined, 'Invoice data object exists');
    assert(inv.data.documentType === 'Invoice', `Synthetic documentType is "Invoice" (received "${inv.data.documentType}")`);
    assert(inv.data.disclaimer === 'SYNTHETIC DATA — FOR DEMONSTRATION ONLY', 'Invoice carries synthetic disclaimer watermark');
    assert(Array.isArray(inv.data.lineItems), 'Invoice contains lineItems array');
    assert(inv.data.summary.subtotal > 0, `Subtotal is computed (${inv.data.summary.subtotal})`);
    assert(inv.data.summary.total > inv.data.summary.subtotal, `Total includes tax (${inv.data.summary.total})`);
    assert(inv.validation && inv.validation.passed === true, 'Invoice arithmetic validation passed 100%');
  } catch (err) {
    console.error('Test 3 failed with error:', err.message);
    failed++;
  }

  console.log('\n================================================================');
  console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runRegressionTests();
