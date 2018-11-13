import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as next from 'next';
import * as body from 'koa-better-body';
// import { parse } from 'url';
import { queryStackOverflow } from './db/config';

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const routes = app.getRequestHandler();

const run = () => {
  app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.use(body());

    router.get('*', async ctx => {
      await routes(ctx.req, ctx.res);
      ctx.respond = false;
    });

    // following route is for local testing only
    // router.post('/csp-report', async ctx => {
    //   console.log('CSP Report: ', ctx.request.fields);
    // });

    router.post('/query', async ctx => {
      console.log('Querying stackoverflow: ', process.env, ctx.req);

      queryStackOverflow();
    })

    // remove this line on a real server
    server.use(async (ctx, next) => {
      ctx.set('Content-Security-Policy', "default-src 'none'; script-src 'none'; report-uri https://asia-northeast1-kouzoh-p-veysond.cloudfunctions.net/cspReports");
      await next();
    });

    // this line is potentially dangerous; please be advised
    // server.use(async (ctx, next) => {
    //   ctx.res.statusCode = 200;
    //   await next();
    // });

    server.use(router.routes());

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
}

run();