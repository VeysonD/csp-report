import * as helmet from 'helmet';
import * as uuidv4 from 'uuid/v4';

export const csp = (app: any) => {
  app.use((_, res, next) => {
    res.locals.nonce = Buffer.from(uuidv4()).toString('base64');
    next();
  });

  const nonce = (_, res) => `'nonce-${res.locals.nonce}'`;
  const scriptSrc = [nonce, "'strict-dynamic'", "'unsafe-inline'", 'https:'];

  if (process.env.NODE_ENV !== 'production') {
    scriptSrc.push("'unsafe-eval'");
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          baseUri: ['localhost:8080'],
          objectSrc: ["'none'"],
          scriptSrc
        }
      }
    })
  );
}
