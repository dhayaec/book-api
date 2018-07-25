import { Request, Response } from 'express';
import { renderEmail } from '../utils/emails/emails';

export const testEmail = async (_: Request, res: Response) => {
  const random = Math.random().toString();
  const email = renderEmail({
    subject: random,
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ' +
      'Ipsum cum distinctio temporibus error, nulla molestiae id est ' +
      'laudantium tempore eos ut sunt sed magnam incidunt porro necessitatibus' +
      'beatae! Eius, magni!',
    salutation: 'Hello dude'
  });
  res.send(email);
};
