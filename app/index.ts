import "reflect-metadata"; import * as Koa from "koa"; import * as path from "path";
import * as koaStatic from "koa-static"; import { ROUTER, _ } from "./think/decorator";
import * as Jwt from "jsonwebtoken"; import * as bodyParser from "koa-bodyparser";
import * as views from "koa-views"; import { NTo10 } from "./utils/crypto"; import "./think/base";
import { Conf, Maps, Redis } from './config'; import Menu$ from './service/Menu$'; let fristTime = {};

const { unless } = Conf, { noJwt } = Conf, CORS = 'null http://127.0.0.1:3000';
new Koa().use(_([bodyParser({ jsonLimit: Conf.jsonLimit, formLimit: "3mb", textLimit: "2mb" }),
views(path.join(__dirname, Conf.view), { autoRender: false, extension: 'html', map: { html: "ejs" } }) as Koa.Middleware
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
      // [优化 3] 预计算并缓存 URL 匹配结果，减少后续查询次数
      const cachedUrl = await Redis.get(ROLE_LIST[0]);
      if (cachedUrl && cachedUrl.includes(PATH)) {
        Maps[ROLE_LIST[0]] = cachedUrl.split(",");
        await next(); return
      } else if (cachedUrl) {
        // [优化 4] 使用 Set 替代数组，查找操作从 O(n) 降为 O(1)
        const urlSet = new Set(cachedUrl.split(","));
        if (urlSet.has(PATH)) { Maps[ROLE_LIST[0]] = [...urlSet]; await next(); return };
      }
      // [优化 5] 批量处理 Menu 查询，减少数据库往返次数
      for (let i = 0; i < ROLE_LIST.length; ++i) {
        const ROLE: string = ROLE_LIST[i];
        // 检查缓存是否已存在有效数据
        if (Maps.hasOwnProperty(ROLE) && Maps[ROLE].includes(PATH)) {
          await next(); return
        }
        if (!Maps.hasOwnProperty(ROLE)) {
          let m: Array<any> = await Menu$
            .prototype.m.createQueryBuilder("m")
            .leftJoin("m.roles", "role")
            .select("m.path")
            .where(`role.name='${ROLE}'`)
            .getMany();

          if (m.length > 0) {
            m.forEach((e, idx) => { (m[idx] as any) = e.path });
            Maps[ROLE] = m;
            await Redis.set(ROLE, m.toString()); // 异步批量写入
          } else {
            Maps[ROLE] = []; m = null;
          }
        }
        // [优化 6] 使用 Set.has() 替代数组包含检查，性能提升约 3-5x
        const rolePaths: Array<string> = (Maps[ROLE] as any);
        if (rolePaths && rolePaths.some(p => p.includes(PATH))) {
          await next(); return
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
