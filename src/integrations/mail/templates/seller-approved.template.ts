export const sellerApprovedTemplate = (name: string, dashboardUrl: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
    <h2>Hello ${name},</h2>
    <p>Your seller account is now active. You can start managing your store and products in NexCart.</p>
    <a href="${dashboardUrl}"
       style="background: #111827; padding: 10px 15px; color: white; text-decoration: none; display: inline-block;">
       Open Seller Dashboard
    </a>
  </div>
`;
