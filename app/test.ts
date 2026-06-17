// test.ts - index.ts 的精简版，仅用于测试 VideoStream 中间件的 206 / 限速 / 缓存功能
// 移除了：MySQL（createConnection）、Redis、TypeORM 路由、JWT 鉴权、LRU 缓存
// 保留了：Koa 基础、CORS、koaStatic（dist + upload）、VideoStream 核心
import "reflect-metadata";
import * as Koa from "koa";
import * as path from "path";
import * as koaStatic from "koa-static";
import * as bodyParser from "koa-bodyparser";
import * as views from "koa-views";
import { W } from "./weblogic";
import { ROUTER, _ } from "./think/decorator"; import "./view";
import { Conf, Maps, Redis } from './config';
const PORT = Number(process.env.PORT) || 8080;

new Koa().use(_([
  bodyParser({ jsonLimit: "10mb", formLimit: "10mb", textLimit: "10mb" }),
  views(path.join(__dirname, Conf.view), { autoRender: false, extension: 'html', map: { html: "ejs" } }) as Koa.Middleware
  , W.VideoStream(path.join(Conf.upload, "video"), { speed: 1024 })
  , koaStatic(path.join(__dirname, Conf.view), { defer: true }), koaStatic(path.join(__dirname, "../" + Conf.upload)),
  // CORS 头，方便跨域调试
  async (ctx, next) => {
    const { origin } = ctx.request.header;
    ctx.vary('Origin');
    if (origin !== undefined) ctx.set({
      'Access-Control-Allow-Headers': "content-type,cache-control,x-requested-with,range",
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      'Access-Control-Expose-Headers': "Content-Range,Accept-Ranges,Content-Length",
      'Access-Control-Allow-Credentials': "true",
      'cache-control': "max-age=3600,immutable"
    });
    if (ctx.method === 'OPTIONS') { ctx.body = ''; ctx.status = 204; return; }
    await next();
  }, ROUTER.routes(), ROUTER.allowedMethods()
])).listen(PORT, "0.0.0.0", () => {
  console.log('\x1B[36;1m%s\x1B[22m', `[Test] VideoStream server running on http://127.0.0.1:${PORT}`);
  console.log(`[Test] Try:`);
  console.log(`  curl -I  http://127.0.0.1:${PORT}/video/test.mp4`);
  console.log(`  curl -I -H "Range: bytes=0-1023" http://127.0.0.1:${PORT}/video/test.mp4`);
  console.log(`  curl -I -H "Range: bytes=1048576-3145727" http://127.0.0.1:${PORT}/video/test.mp4`);
  console.log(`  curl -I -H "Range: bytes=-1024" http://127.0.0.1:${PORT}/video/test.mp4`);
  console.log(`  curl -I -H "Range: bytes=99999999-" http://127.0.0.1:${PORT}/video/test.mp4  # expect 416`);
});
