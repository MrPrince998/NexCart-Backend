export interface OrderReceiptTemplateData {
  userName: string;
  orderNumber: string;
  orderUrl?: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}

const formatAmount = (amount: number) => `$${amount.toFixed(2)}`;

export const orderReceiptTemplate = (data: OrderReceiptTemplateData) => {
  const rows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0;">${item.productName} x ${item.quantity}</td>
          <td style="padding: 8px 0; text-align: right;">${formatAmount(item.lineTotal)}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
      <h2>Thanks for your order, ${data.userName}</h2>
      <p>Your order <strong>${data.orderNumber}</strong> has been received.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${rows}
        <tr><td style="padding-top: 16px;">Subtotal</td><td style="padding-top: 16px; text-align: right;">${formatAmount(data.subtotal)}</td></tr>
        <tr><td>Shipping</td><td style="text-align: right;">${formatAmount(data.shippingTotal)}</td></tr>
        <tr><td>Discount</td><td style="text-align: right;">-${formatAmount(data.discountTotal)}</td></tr>
        <tr><td>Tax</td><td style="text-align: right;">${formatAmount(data.taxTotal)}</td></tr>
        <tr><td style="padding-top: 12px; font-weight: bold;">Total</td><td style="padding-top: 12px; text-align: right; font-weight: bold;">${formatAmount(data.total)}</td></tr>
      </table>
      ${
        data.orderUrl
          ? `<p><a href="${data.orderUrl}" style="color: #111827;">View your order</a></p>`
          : ''
      }
    </div>
  `;
};
