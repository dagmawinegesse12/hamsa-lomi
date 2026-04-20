import { formatCurrency, formatDate } from "@/lib/utils/format";

export function buildReceiptHtml(input: { receiptNumber: string; memberName: string; amount: number; paidAt: Date }) {
  return `
    <html>
      <body>
        <h1>Edir Payment Receipt</h1>
        <p>Receipt: ${input.receiptNumber}</p>
        <p>Member: ${input.memberName}</p>
        <p>Amount: ${formatCurrency(input.amount)}</p>
        <p>Paid: ${formatDate(input.paidAt)}</p>
      </body>
    </html>
  `;
}
