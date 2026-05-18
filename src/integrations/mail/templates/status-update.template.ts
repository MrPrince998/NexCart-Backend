interface StatusUpdateTemplateData {
  userName: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export const statusUpdateTemplate = (data: StatusUpdateTemplateData) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
    <h2>${data.title}</h2>
    <p>Hello ${data.userName},</p>
    <p>${data.message}</p>
    ${
      data.actionUrl
        ? `<a href="${data.actionUrl}" style="background: #111827; padding: 10px 15px; color: white; text-decoration: none; display: inline-block;">${data.actionText ?? 'View details'}</a>`
        : ''
    }
  </div>
`;
