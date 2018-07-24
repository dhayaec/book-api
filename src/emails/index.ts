export const emailTemplate = (args: EmailTemplateValues) => {
  const { header, footer, body } = args;
  return /*html*/ `
  <h1>${header}</h1>
  <h2>${body}</h2>
  <p>${footer}</p>
  `;
};
