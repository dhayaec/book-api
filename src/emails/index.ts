type EmailTemplateValues = {
  header: string;
  body: string;
  footer?: string;
};

export const emailTemplate = (args: EmailTemplateValues) => {
  const { header, footer, body } = args;
  return /*html*/ `
  <h1>${header}</h1>
  <h2>${body}</h2>
  <p>${footer}</p>
  `;
};
