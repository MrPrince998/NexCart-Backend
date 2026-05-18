export const verificationTemplate = (
  name: string,
  verificationLink: string,
  title = 'Verify your email',
  message = 'Please confirm your email address to finish setting up your NexCart account.',
  buttonText = 'Verify Email',
) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
    <h2>${title}</h2>
    <p>Hello ${name},</p>
    <p>${message}</p>
    <a href="${verificationLink}"
       style="background: #111827; padding: 10px 15px; color: white; text-decoration: none; display: inline-block;">
       ${buttonText}
    </a>
    <p style="color: #6b7280;">If you did not request this, you can ignore this email.</p>
  </div>
`;
