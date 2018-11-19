require('dotenv').config();

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as next from 'next';
import * as body from 'koa-better-body';
import { insertReport, queryStackOverflow } from './db/config';

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

    // local csp report testing
    router.post('/csp-report', async ctx => {
      const report = ctx.request.fields['csp-report'];
      const userAgent = ctx.req.headers['user-agent'];
      console.log('CSP Report and userAgent: ', report, userAgent);
      insertReport(report, userAgent);
    });

    // local route tests BigQuery
    router.post('/query', async ctx => {
      console.log('Querying stackoverflow: ', ctx.req);

      queryStackOverflow();
    })

    // remove this line on a real server (possibly)
    server.use(async (ctx, next) => {
      ctx.set('Content-Security-Policy', `default-src 'none'; script-src 'none'; report-uri ${process.env.REPORT_URI1}`);
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