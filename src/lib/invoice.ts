import { jsPDF } from "jspdf";

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;
  agentName: string;
  agencyName?: string | null;
  agentPhone?: string | null;
  itemLabel: string;
  propertyTitle?: string | null;
  amountMAD: number;
  paymentReference: string;
  provider: string;
}

export function generateInvoicePdf(data: InvoiceData): Buffer {
  const doc = new jsPDF();
  const line = 12;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("3A9AR.MA - Facture / Invoice", 20, line + 4);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.invoiceNumber, 20, line + 12);
  doc.text(`Date: ${data.issueDate.toISOString().slice(0, 10)}`, 20, line + 17);

  doc.setFont("helvetica", "bold");
  doc.text("Emetteur / From:", 20, line + 26);
  doc.setFont("helvetica", "normal");
  doc.text("AR3AR Immobilier S.A.R.L", 20, line + 31);
  doc.text("Casablanca, Maroc - RC: 123456 - ICE: 001234567890123", 20, line + 36);

  doc.setFont("helvetica", "bold");
  doc.text("Client:", 140, line + 26);
  doc.setFont("helvetica", "normal");
  doc.text(data.agentName, 140, line + 31);
  if (data.agencyName) doc.text(data.agencyName, 140, line + 36);
  if (data.agentPhone) doc.text(`Tel: ${data.agentPhone}`, 140, line + 41);

  let y = line + 52;
  doc.setFont("helvetica", "bold");
  doc.text("Designation", 20, y);
  doc.text("Montant (MAD)", 130, y);
  doc.text("Total (MAD)", 180, y);
  doc.line(20, y + 2, 190, y + 2);

  y += 8;
  doc.setFont("helvetica", "normal");
  const label = data.propertyTitle ? `${data.itemLabel} - ${data.propertyTitle}` : data.itemLabel;
  doc.text(label, 20, y, { maxWidth: 105 });
  doc.text(data.amountMAD.toFixed(2), 130, y);
  doc.text(data.amountMAD.toFixed(2), 180, y);

  y += 14;
  doc.line(20, y, 190, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", 130, y);
  doc.text(`${data.amountMAD.toFixed(2)} MAD`, 180, y);

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Reference paiement: ${data.paymentReference} (${data.provider})`, 20, y);
  y += 6;
  doc.text("Merci de votre confiance. / Thank you for your business.", 20, y);

  return Buffer.from(doc.output("arraybuffer"));
}
