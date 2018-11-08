import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as next from 'next';
import * as csp from './csp';
// import { parse } from 'url';

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const routes = app.getRequestHandler();

const run = () => {
  app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    console.log('What does the csp look like: ', csp);
    // csp(server);

    router.get('*', async ctx => {
      await routes(ctx.req, ctx.res);
      ctx.respond = false;
    });

    router.post('/csp-report', async ctx => {
      console.log('What does the ctx request look like: ', ctx.req);
    });

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    })

    server.use(router.routes());

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
}

run();