type EmailTemplate = {
  subject: string;
  emailContent: string;
};

type EmailContent = {
  subject: string;
  salutation: string;
  messageBody: string;
  footer?: string;
};

type EmailRendererProps = {
  subject: string;
  salutation?: string;
  message: string;
  footer?: string;
};
