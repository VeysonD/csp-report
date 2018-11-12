import * as helmet from 'koa-helmet';
import * as uuidv4 from 'uuid/v4';

export const csp = (app) => {
  app.use((ctx, next) => {
    ctx.res.nonce = Buffer.from(uuidv4()).toString('base64');
    next();
  });

  const nonce = (ctx, _) => `'nonce-${ctx.res.nonce}'`;
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
