import "reflect-metadata"; import * as Koa from "koa"; import * as path from "path";
import * as koaStatic from "koa-static"; import { ROUTER, _ } from "./think/decorator";
import * as Jwt from "jsonwebtoken"; import * as bodyParser from "koa-bodyparser";
import * as views from "koa-views"; import { NTo10 } from "./utils/crypto"; import "./think/base";
import { Conf, Maps, Redis } from './config'; import Menu$ from './service/Menu$';
import { W } from "./weblogic";
// VideoStream 中间件：处理 /upload/video/ 路径下的媒体文件，支持 206 Range、限速、Last-Modified 缓存
// 需挂在 koaStatic 之前，避免被静态服务中间件拦截
// fristTime 改造成 LRU 缓存，防止角色无限增长导致内存泄漏
const fristTime = (() => {
  const m = new Map<string, number>();
  const MAX = 500;
  return {
    get(k: string) { return m.get(k) || 0; },
    set(k: string, v: number) {
      if (m.size >= MAX) m.delete(m.keys().next().value as string);
      m.set(k, v);
    }
  };
})();

const { unless } = Conf, { noJwt } = Conf, CORS = 'null http://127.0.0.1:3000';
new Koa().use(_([bodyParser({ jsonLimit: Conf.jsonLimit, formLimit: "3mb", textLimit: "2mb" }),
views(path.join(__dirname, Conf.view), { autoRender: false, extension: 'html', map: { html: "ejs" } }) as Koa.Middleware
  , W.VideoStream(path.join(Conf.upload, "video"), { speed: 1024 })
  , koaStatic(path.join(__dirname, Conf.view), { defer: true }), koaStatic(path.join(__dirname, "../" + Conf.upload)),
async (ctx, next) => {
  const { originalUrl } = ctx, { origin } = ctx.request.header; ctx.vary('Origin');
  origin !== undefined && ctx.set('Access-Control-Allow-Origin', CORS.includes(origin) ? origin : "");
  // [优化 1] 合并所有 Header 设置，减少 ctx.set() 调用次数（单次调用约 0.5-2μs）
  ctx.set({
    'Access-Control-Allow-Headers': "content-type,cache-control,x-requested-with,t,s",
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'X-Content-Type-Options': "nosniff",
    'Access-Control-Allow-Credentials': "true",
    'cache-control': "max-age=179,immutable"
  });
  if (ctx.method === 'OPTIONS') { ctx.body = ''; ctx.status = 204; }
  if (noJwt || originalUrl.substr(1, 2) === "s/" || !!unless.exec(originalUrl)) { await next(); return }
  const { s } = ctx.headers, TOKEN: string | string[] = ctx.headers.t;
  // [优化 2] 提前检查并缓存 URL 路径解析结果，避免重复计算
  const urlPath = originalUrl.replace(/[0-9A-Z_]+|(\w+)\?.+$/, "$1");
  let S: string[] = s === undefined ? void 0 : s.toString().match(/[^#]+/g);
  if (TOKEN === undefined || s === undefined) {
    ctx.status = 401; ctx.body = "Headers Error";
  } else {
    try {
      let { payload } = Jwt.verify(TOKEN.toString().replace(/^Bearer /, ""),
        String(NTo10(S[0], Number("0x" + S[1]) / Conf.cipher)), { complete: true }) as any; S = null;
      let ROLE_LIST: Array<any> = Object.entries(payload)[0];
      const PATH = ctx.method + urlPath;
      // LRU 防击穿优化：在 Conf.synchronize 窗口期内且 Maps 已有缓存时，跳过 Redis/DB 查询
      for (let i = 0; i < ROLE_LIST.length; ++i) {
        const ROLE: string = ROLE_LIST[i];
        // 命中：Maps 已有 + 未过窗口期 → 直接判断，不打 Redis
        if (Maps.hasOwnProperty(ROLE) &&
          Date.now() - (fristTime.get(ROLE) || 0) <= Conf.synchronize) {
          if (Maps[ROLE].includes(PATH)) { await next(); return }
          continue; // 该角色无权限，跳过
        }
        // 未命中：过窗口期或首次访问 → 查 Redis 刷新 Maps
        fristTime.set(ROLE, Date.now());
        const cachedUrl = await Redis.get(ROLE);
        if (cachedUrl) {
          Maps[ROLE] = cachedUrl.split(",");
          if (Maps[ROLE].includes(PATH)) { await next(); return }
          continue;
        }
        // Redis 也没有 → 查数据库
        let m: Array<any> = await Menu$
          .prototype.m.createQueryBuilder("m")
          .leftJoin("m.roles", "role")
          .select("m.path")
          .where("role.name = :role", { role: ROLE })
          .getMany();

        if (m.length > 0) {
          m.forEach((e, idx) => { (m[idx] as any) = e.path });
          Maps[ROLE] = m;
          await Redis.set(ROLE, m.toString());
          if (Maps[ROLE].includes(PATH)) { await next(); return }
        } else {
          Maps[ROLE] = []; m = null;
        }
      }
      if (ROLE_LIST[0] === "admin") { await next(); return }
      ROLE_LIST = null;
      ctx.status = 403; ctx.body = `'${PATH}'request is not authorized`;
    } catch (e) {
      const ERR = String(e);
      if (ERR.includes('TokenExpiredError')) {
        ctx.status = 401; ctx.body = "Jwt Expired";
      } else if (ERR.includes('QueryFailedError')) {
        ctx.status = 406; ctx.body = e;
      } else {
        console.error(e); if (ERR === "Error: Connection is closed.") {
          ctx.status = 401;
          ctx.body = "Redis is reconnecting,please try again in a few seconds"; Redis.connect();
        } else { ctx.status = 401; ctx.body = "Authentication Error"; }
      }
    }
  }
}, ROUTER.routes(), ROUTER.allowedMethods()])).listen(Conf.port, "0.0.0.0", () => {
  console.log('\x1B[36;1m%s\x1B[22m', `ThinkTs run on http://127.0.0.1:${Conf.port}/test.html`)
});
setInterval(() => { Conf.secret = 11 + Math.random() * 25 | 0; }, 1414);
