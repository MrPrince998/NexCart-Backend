export const reviewRequestTemplate = (
  name: string,
  orderNumber: string,
  reviewUrl: string,
) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
    <h2>How was your order?</h2>
    <p>Hello ${name},</p>
    <p>Your order ${orderNumber} has been delivered. Share a quick review to help other NexCart shoppers.</p>
    <a href="${reviewUrl}"
       style="background: #111827; padding: 10px 15px; color: white; text-decoration: none; display: inline-block;">
       Leave a Review
    </a>
  </div>
`;
