export const passwordResetTemplate = (name: string, resetLink: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Hello ${name},</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}" 
       style="background: #3498db; padding: 10px 15px; color: white; text-decoration: none;">
       Reset Password
    </a>
    <p>If you didn’t request this, ignore this email.</p>
  </div>
`;
