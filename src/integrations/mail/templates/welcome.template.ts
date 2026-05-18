export const welcomeTemplate = (
  name: string,
  message = 'Your NexCart account has been successfully created.',
) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Welcome ${name}</h2>
    <p>${message}</p>
    <p>We're excited to have you onboard.</p>
  </div>
`;
