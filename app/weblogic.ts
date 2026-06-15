import { Context, Middleware } from "koa"; import date from "./utils/date";
import { createHash } from 'crypto';
import { Conf } from "./config"; import * as multer from '@koa/multer';
import * as fs from "fs"; import { Transform, TransformCallback } from "stream";
import { Stats, createReadStream } from "fs";
import { extname, resolve, join, normalize, sep } from "path";
// 优化文件上传限制 - 使用更合理的数值
const U = multer({ dest: Conf.upload, limits: { fieldNameSize: 100, fieldSize: 524288, fileSize: 2097152 } }); // 2MB
// 优化文件处理工具函数
const fileProcessor = (field: string): Middleware => async (ctx: any, next) => {
  if (ctx.request.file) {
    const { request } = ctx;
    try {
      // 异步读取文件，避免阻塞主线程
      const originalPath = `${Conf.upload}/${request.file.filename}`;
      try { await fs.promises.access(originalPath); } catch { return await next(); }
      // 异步读取文件计算 MD5
      const fileBuffer = await fs.promises.readFile(originalPath);
      const newpath = createHash("md5").update(fileBuffer).digest("hex");
      const extMatch = request.file.mimetype.match(/\/(.*\..+)/);
      if (!extMatch) return await next();
      // 构建新文件名
      const fileExt = request.file.mimetype.split('/')[1];
      const fileSize = Math.floor(request.file.size / 19);
      const finalName = `${newpath}${fileSize}.${fileExt}`;
      const newFilePath = `${Conf.upload}/${finalName}`;
      // 原子性重命名操作
      try {
        await fs.promises.access(newFilePath);
        await fs.promises.unlink(originalPath);
      } catch {
        await fs.promises.rename(originalPath, newFilePath);
      }
      // 设置文件路径到请求体
      if (request.body && request.body[field]) {
        request.body[field] = finalName.slice(String(Conf.upload).length + 1);
      }
    } catch (error: any) {
      console.error(`File upload error for field ${field}:`, error.message);
    } finally {
      await next();
    }
  } else if (ctx.request.body && ctx.request.body[field] !== undefined) {
    delete ctx.request.body[field];
  }
};

const W = {
  // 优化日志中间件 - 使用 Buffer 替代字符串拼接
  async Log(ctx: Context, next) {
    const startTime = process.hrtime.bigint(); // 高精度时间测量
    try {
      await next();
    } finally {
      const duration = Number(process.hrtime.bigint() - startTime);
      // 使用字符串模板避免多次拼接
      console.log(
        `\x1B[34;1;4m${ctx.method}\x1B[0;96m${ctx.url} \x1B[95m${duration}ms -> \x1B[92m${date.date2str()}`
      );
    }
  },
  // 优化文件处理 - 异步版本
  pic(field: string): Middleware {
    return fileProcessor(field);
  },
  /*Verify链式校验，V_B/V_Q分别校验body/query，非全检测，只要遇到错的就弹出，省开销
   *O是Valid字段，L代表length，R为是否必填(|0或不写是可选字段)[|1表示必填]未填是Invalid字段
   *name#5表示字段为name长度为0~5非必填，如果有则检验长度，现在可顺带着过滤无效字段*/
  V_B: (...a: Array<string>): Middleware => {
    const O = [""], R = [0], L0 = [0], L1 = [0]; let L = []
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
        L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
        R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3]) || 0,
        L[i] && (L[i].length === 1 ? (L0[i] = 0, L1[i] = Number(L[i][0])) : (L0[i] = Number(L[i][0]), L1[i] = Number(L[i][1])))
    }); a = L = null;
    return async (ctx: Context, next) => {
      let c = ctx.request.body, l = 0, b = Object.keys(c).filter(v => O.includes(v) ? true : l = 1), i = 0;
      if (l === 0) b = b.sort(); else { ctx.status = 422; ctx.body = `Invalid field!`; b = c = null; return };
      for (let p of O) {
        if (p === b[i]) {
          if (L1[l])
            if (L0[l] > c[p].length || c[p].length > L1[l]) {
              ctx.status = 422; ctx.body = `The length of the field[${p}] is ${L0[l]} to ${L1[l]}`; b = c = null; return
            }
          ++i;
        } else if (R[l] === 1) {
          ctx.status = 412; ctx.body = `The field[${p}] isn't null`; b = c = null; return
        } else if (R[i] === 0 && b[i] === undefined) ++i; ++l
      } b = c = null;
      await next();
    }
  },
  V_Q: (...a: Array<string>): Middleware => {
    const O = [""], R = [0], L0 = [0], L1 = [0]; let L = []
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
        L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
        R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3]) || 0,
        L[i] && (L[i].length === 1 ? (L0[i] = 0, L1[i] = Number(L[i][0])) : (L0[i] = Number(L[i][0]), L1[i] = Number(L[i][1])))
    }); a = L = null;
    return async (ctx: Context, next) => {
      let c = ctx.query, l = 0, b = Object.keys(c).filter(v => O.includes(v) ? true : l = 1), i = 0;
      if (l === 0) b = b.sort(); else { ctx.status = 422; ctx.body = `Invalid field!`; b = c = null; return };
      for (let p of O) {
        if (p === b[i]) {
          if (L1[l])
            if (L0[l] > c[p].length || c[p].length > L1[l]) {
              ctx.status = 422; ctx.body = `The length of the field[${p}] is ${L0[l]} to ${L1[l]}`; b = c = null; return
            }
          ++i;
        } else if (R[l] === 1) {
          ctx.status = 412; ctx.body = `The field[${p}] isn't null`; b = c = null; return
        } else if (R[i] === 0 && b[i] === undefined) ++i; ++l
      } b = c = null;
      await next();
    }
  },
  // 视频/音频流中间件：支持 HTTP Range（206）、限速、Last-Modified 缓存
  // 用法：W.VideoStream(Conf.upload, { speed: 1024 }) - 匹配 /upload/video/ 前缀
  //     W.VideoStream('/path/to/media', { prefix: '/media/', speed: 2048 }) - 自定义前缀
  VideoStream: (rootDir: string, options?: { speed?: number, prefix?: string }): Middleware => {
    const root = resolve(rootDir) + sep; const prefix = options?.prefix || '/upload/video/';
    const bps = (options?.speed || 1024) * 1024; const V_TYPES: Record<string, string> = {
      '.mp4': 'video/mp4', '.webm': 'video/webm', '.ogg': 'video/ogg', '.ogv': 'video/ogg',
      '.mov': 'video/quicktime', '.avi': 'video/x-msvideo', '.mkv': 'video/x-matroska',
      '.flv': 'video/x-flv', '.m4v': 'video/x-m4v', '.ts': 'video/mp2t',
      '.m3u8': 'application/vnd.apple.mpegurl',
      '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.flac': 'audio/flac',
      '.aac': 'audio/aac', '.m4a': 'audio/mp4', '.opus': 'audio/opus'
    };
    // 限速 Transform 流：按 1s 窗口节流，确保不超出 bps
    const Throttle = (): Transform => {
      const t: any = new Transform({
        transform(chunk: Buffer, _e: BufferEncoding, cb: TransformCallback) {
          const now = Date.now(), b: number = t._b = (t._b || 0) + chunk.length, lt: number = t._t || now;
          if (now - lt >= 1000) { t._t = now; t._b = chunk.length; t.push(chunk); cb(); return; }
          if (b <= bps) { t.push(chunk); cb(); }
          else setTimeout(() => { t._t = Date.now(); t._b = chunk.length; t.push(chunk); cb(); }, 1000 - (now - lt));
        }
      }); return t;
    };
    return async (ctx: Context, next) => {
      // 只处理 prefix 前缀的路径，其他交给下游（如 koaStatic）
      if (!ctx.path.startsWith(prefix)) { await next(); return; }
      // 拼接物理路径并防路径穿越
      const rel = ctx.path.slice(prefix.length).replace(/^\/+/, '');
      const fullPath = normalize(join(root, rel));
      if (!fullPath.startsWith(root)) { ctx.status = 403; return; }
      // 异步 stat，文件不存在透传
      let st: Stats; try { st = await fs.promises.stat(fullPath); } catch { await next(); return; }
      if (!st.isFile()) { await next(); return; }
      const ext = extname(fullPath).toLowerCase();
      const size = st.size; const mtime = st.mtime;
      // 公共响应头
      ctx.set('Content-Type', V_TYPES[ext] || 'application/octet-stream');
      ctx.set('Accept-Ranges', 'bytes');
      ctx.set('Last-Modified', mtime.toUTCString());
      ctx.set('Cache-Control', 'public, max-age=86400');
      // 处理 If-Modified-Since（304 缓存验证）。HTTP Date 精度只到秒，所以用秒比较
      if (ctx.headers['if-modified-since']) {
        const ims = new Date(ctx.headers['if-modified-since'] as string).getTime();
        if (!isNaN(ims) && Math.floor(ims / 1000) >= Math.floor(mtime.getTime() / 1000)) { ctx.status = 304; return; }
      }
      // Range 请求 → 206 部分内容（先检查 Range，因为 HEAD+Range 也要返回 206）
      const range = ctx.headers.range as string | undefined;
      if (range) {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        if (!m) { ctx.status = 416; ctx.set('Content-Range', `bytes */${size}`); return; }
        // 后缀形式 bytes=-N 表示最后 N 字节：start=size-N, end=size-1
        // 完整形式 bytes=S-E：start=S, end=E
        // 开放形式 bytes=S-：start=S, end=size-1
        let start: number, end: number;
        if (m[1] === '' && m[2]) {
          // suffix 形式
          const n = parseInt(m[2], 10);
          start = Math.max(0, size - n);
          end = size - 1;
        } else {
          start = m[1] ? parseInt(m[1], 10) : 0;
          end = m[2] ? parseInt(m[2], 10) : size - 1;
        }
        // 边界检查
        if (start >= size || end >= size || start > end) {
          ctx.status = 416; ctx.set('Content-Range', `bytes */${size}`); return;
        }
        // HEAD 请求：写头不写体
        if (ctx.method === 'HEAD') { ctx.status = 206; ctx.set('Content-Range', `bytes ${start}-${end}/${size}`); ctx.set('Content-Length', String(end - start + 1)); return; }
        // 手动 writeHead 写头部（避免 ctx.body 机制下未发送）
        ctx.respond = false;  // 告诉 Koa 本次响应已手动处理
        ctx.res.writeHead(206, {
          'Content-Type': V_TYPES[ext] || 'application/octet-stream',
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Content-Length': end - start + 1,
          'Accept-Ranges': 'bytes',
          'Last-Modified': mtime.toUTCString(),
          'Cache-Control': 'public, max-age=86400'
        });
        const rs = createReadStream(fullPath, { start, end });
        rs.pipe(Throttle()).pipe(ctx.res);
        // 客户端断开时及时销毁流，避免文件句柄泄露
        ctx.req.on('close', () => { rs.destroy(); });
        return;
      }
      // HEAD 请求：仅返回头不返回体（Koa 会自动处理）
      if (ctx.method === 'HEAD') { ctx.status = 200; ctx.set('Content-Length', String(size)); return; }
      // 普通 GET：返回完整文件（也限速）
      ctx.respond = false;
      ctx.res.writeHead(200, {
        'Content-Type': V_TYPES[ext] || 'application/octet-stream',
        'Content-Length': size,
        'Accept-Ranges': 'bytes',
        'Last-Modified': mtime.toUTCString(),
        'Cache-Control': 'public, max-age=86400'
      });
      const rs = createReadStream(fullPath); rs.pipe(Throttle()).pipe(ctx.res);
      ctx.req.on('close', () => { rs.destroy(); });
    }
  }
}
export { U, W }
