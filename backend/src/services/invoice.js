import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INVOICE_ISSUER, INVOICE_ISSUER_EMAIL } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateInvoicePDF({ invoiceId, buyer, seller, item, amount }) {
  const filename = `invoice-${invoiceId}.pdf`;
  const filepath = path.join(__dirname, `../../invoices/${filename}`);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filepath));

  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${invoiceId}`);
  doc.text(`Issuer: ${INVOICE_ISSUER} (${INVOICE_ISSUER_EMAIL})`);
  doc.text(`Buyer: ${buyer.name} <${buyer.email}>`);
  doc.text(`Seller: ${seller.name} <${seller.email}>`);
  doc.moveDown();
  doc.text(`Item: ${item}`);
  doc.text(`Amount: ₹${amount}`);
  doc.end();

  return filepath;
}
