import { Request, Response } from 'express';
import { renderEmail } from '../utils/emails/emails';

export const testEmail = async (req: Request, res: Response) => {
  const { session } = req;

  !session!.views ? (session!.views = 1) : (session!.views += 1);

  const random = Math.random().toString();
  const email = renderEmail({
    subject: random,
    message:
      'This is an example email message. This email system uses ' +
      'native template literal syntax proviced by ecmascript 6 ',
    salutation: 'Hello dude you have ' + req.session!.views + ' views!',
  });
  res.send(email);
};
