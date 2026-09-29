const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generatePdfDocumentation() {
  const mdPath = path.join(__dirname, '..', 'docs', 'HackDataV2_Technical_Documentation.md');
  const pdfPath = path.join(__dirname, '..', 'docs', 'HackDataV2_Technical_Documentation.pdf');

  if (!fs.existsSync(mdPath)) {
    console.error('Markdown documentation not found at:', mdPath);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const maxWidth = pageWidth - margin * 2;

  let y = 24;
  let pageNum = 1;

  function checkPageBreak(spaceNeeded = 10) {
    if (y + spaceNeeded > pageHeight - 20) {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`HackDataV2 Technical Project Documentation — Page ${pageNum}`, margin, pageHeight - 10);
      doc.addPage();
      pageNum++;
      y = 20;
    }
  }

  // Cover Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text('HackDataV2 — Technical Project Documentation', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Official System Architecture, Implementation Audit & Technical Specifications', margin, y);
  y += 4;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      checkPageBreak(16);
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138); // Deep Navy Blue
      doc.text(line.replace('## ', ''), margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
    } else if (line.startsWith('### ')) {
      checkPageBreak(12);
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      doc.text(line.replace('### ', ''), margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
    } else if (line.startsWith('```')) {
      // Code or preformatted block
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);

      for (const cl of codeLines) {
        checkPageBreak(5);
        doc.text(cl.slice(0, 100), margin + 4, y);
        y += 4;
      }
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      y += 2;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      checkPageBreak(6);
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      const wrapped = doc.splitTextToSize(`• ${line.slice(2)}`, maxWidth - 4);
      for (const wl of wrapped) {
        checkPageBreak(5);
        doc.text(wl, margin + 4, y);
        y += 4.5;
      }
    } else if (line.trim().length === 0) {
      y += 2;
    } else {
      checkPageBreak(6);
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const wrapped = doc.splitTextToSize(line, maxWidth);
      for (const wl of wrapped) {
        checkPageBreak(5);
        doc.text(wl, margin, y);
        y += 4.5;
      }
    }
  }

  // Footer on final page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`HackDataV2 Technical Project Documentation — Page ${pageNum}`, margin, pageHeight - 10);

  const pdfBuffer = doc.output('arraybuffer');
  fs.writeFileSync(pdfPath, Buffer.from(pdfBuffer));
  console.log(`✓ Technical Documentation PDF generated successfully at:\n  ${pdfPath} (${pageNum} pages)`);
}

generatePdfDocumentation();
