import { Context, Middleware } from "koa"; import date from "./utils/date";
import { createHash } from 'crypto';
import { Conf } from "./config"; import * as multer from '@koa/multer';
import * as fs from "fs"; import { Transform, TransformCallback } from "stream";
import { Stats, createReadStream } from "fs";
import { extname, resolve, join, normalize, sep } from "path";
const U = multer({ dest: Conf.upload, limits: { fieldNameSize: 100, fieldSize: 524288, fileSize: 2097152 } }); // 2MB
const fileProcessor = (field: string): Middleware => async (ctx: any, next) => {
  if (ctx.request.file) {
    const { request } = ctx;
    try {
      const originalPath = `${Conf.upload}/${request.file.filename}`;
      try { await fs.promises.access(originalPath); } catch { return await next(); }
      const fileBuffer = await fs.promises.readFile(originalPath);
      const newpath = createHash("md5").update(fileBuffer).digest("hex");
      const extMatch = request.file.mimetype.match(/\/(.*\..+)/);
      if (!extMatch) return await next();
      const fileExt = request.file.mimetype.split('/')[1];
      const fileSize = Math.floor(request.file.size / 19);
      const finalName = `${newpath}${fileSize}.${fileExt}`;
      const newFilePath = `${Conf.upload}/${finalName}`;
      try {
        await fs.promises.access(newFilePath);
        await fs.promises.unlink(originalPath);
      } catch {
        await fs.promises.rename(originalPath, newFilePath);
      }
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
  async Log(ctx: Context, next) {
    const startTime = process.hrtime.bigint();
    try { await next(); } finally {
      const duration = Number(process.hrtime.bigint() - startTime);
      console.log(`\x1B[34;1;4m${ctx.method}\x1B[0;96m${ctx.url} \x1B[95m${duration}ms -> \x1B[92m${date.date2str()}`);
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
  // 用法：W.VideoStream(Conf.upload, { speed: 1024 }) - 匹配 /video/ 前缀, 目录在./upload/video
  //     W.VideoStream('../upload/media', { prefix: '/media/', speed: 2048 }) - 自定义前缀
  VideoStream: (rootDir: string, options?: { speed?: number, prefix?: string }): Middleware => {
    const root = resolve(rootDir) + sep; const prefix = options?.prefix || '/video/';
    const bps = (options?.speed || 1024) << 10; const V_TYPES: Record<string, string> = {
      '.mp4': 'video/mp4', '.webm': 'video/webm', '.ogg': 'video/ogg', '.ogv': 'video/ogg',
      '.mov': 'video/quicktime', '.avi': 'video/x-msvideo', '.mkv': 'video/x-matroska',
      '.flv': 'video/x-flv', '.m4v': 'video/x-m4v', '.ts': 'video/mp2t',
      '.m3u8': 'application/vnd.apple.mpegurl',
      '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.flac': 'audio/flac',
      '.aac': 'audio/aac', '.m4a': 'audio/mp4', '.opus': 'audio/opus'
    };
    // 手动限速传输：不使用 Transform 类，面向过程方式
    const pipeWithThrottle = (rs: fs.ReadStream, res: NodeJS.WritableStream, req: NodeJS.ReadableStream) => {
      let tokens = bps, lastRefill = Date.now(), timer: NodeJS.Timeout | null = null;
      let destroyed = false;
      res.on('close', () => {
        if (!destroyed) {
          destroyed = true;
          if (timer) { clearTimeout(timer); timer = null; }
          rs.destroy();
        }
      });
      const send = (chunk: Buffer) => {
        if (destroyed) return;
        const canWrite = res.write(chunk);
        if (!canWrite) rs.pause();
      };
      const processChunk = (chunk: Buffer) => {
        if (destroyed) return;
        const now = Date.now();
        tokens = Math.min(bps, tokens + (bps * (now - lastRefill)) / 1000);
        lastRefill = now;
        if (tokens >= chunk.length) {
          tokens -= chunk.length;
          send(chunk);
          return;
        }
        const waitMs = Math.max(1, Math.ceil((chunk.length - tokens) / bps * 1000));
        rs.pause();
        timer = setTimeout(() => {
          timer = null;
          if (destroyed) return;
          const n = Date.now();
          tokens = Math.min(bps, tokens + (bps * (n - lastRefill)) / 1000) - chunk.length;
          lastRefill = n;
          send(chunk);
          rs.resume();
        }, waitMs);
        timer.unref();
      };
      rs.on('data', processChunk);
      rs.on('end', () => { if (timer) { clearTimeout(timer); timer = null; } if (!destroyed) res.end(); });
      res.on('drain', () => { if (!destroyed) rs.resume(); });
    };
    return async (ctx: Context, next) => {
      if (!ctx.path.startsWith(prefix)) { await next(); return; }
      const rel = ctx.path.slice(prefix.length).replace(/^\/+/, '');
      const fullPath = normalize(join(root, rel));
      if (!fullPath.startsWith(root)) { ctx.status = 403; return; }
      let st: Stats; try { st = await fs.promises.stat(fullPath); } catch { await next(); return; }
      if (!st.isFile()) { await next(); return; }
      const size = st.size; const mtime = st.mtime;
      // 优先从 URL 路径检测扩展名（解决 .mp4 这类点文件的问题）
      const lowerPath = ctx.path.toLowerCase();
      let ext = '', contentType = 'application/octet-stream';
      for (const [testExt, mimeType] of Object.entries(V_TYPES)) {
        if (lowerPath.endsWith(testExt)) { ext = testExt; contentType = mimeType; break; }
      }
      if (!ext) { contentType = 'application/octet-stream'; }
      ctx.set('Content-Type', contentType);
      ctx.set('Accept-Ranges', 'bytes');
      ctx.set('Last-Modified', mtime.toUTCString());
      ctx.set('Cache-Control', 'public, max-age=86400');
      if (ctx.headers['if-modified-since']) {
        const ims = new Date(ctx.headers['if-modified-since'] as string).getTime();
        if (!isNaN(ims) && Math.floor(ims / 1000) >= Math.floor(mtime.getTime() / 1000)) { ctx.status = 304; return; }
      }
      const range = ctx.headers.range as string | undefined;
      if (range) {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        if (!m) { ctx.status = 416; ctx.set('Content-Range', `bytes */${size}`); return; }
        let start: number, end: number;
        if (m[1] === '' && m[2]) { const n = parseInt(m[2], 10); start = Math.max(0, size - n); end = size - 1; }
        else { start = m[1] ? parseInt(m[1], 10) : 0; end = m[2] ? parseInt(m[2], 10) : size - 1; }
        if (start >= size || end >= size || start > end) { ctx.status = 416; ctx.set('Content-Range', `bytes */${size}`); return; }
        if (ctx.method === 'HEAD') { ctx.status = 206; ctx.set('Content-Range', `bytes ${start}-${end}/${size}`); ctx.set('Content-Length', String(end - start + 1)); return; }
        ctx.respond = false;
        ctx.res.writeHead(206, {
          'Content-Type': contentType,
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Content-Length': end - start + 1,
          'Accept-Ranges': 'bytes',
          'Last-Modified': mtime.toUTCString(),
          'Cache-Control': 'public, max-age=86400'
        });
        const rs = createReadStream(fullPath, { start, end });
        pipeWithThrottle(rs, ctx.res, ctx.req);
        ctx.req.on('close', () => { rs.destroy(); });
        return;
      }
      if (ctx.method === 'HEAD') { ctx.status = 200; ctx.set('Content-Length', String(size)); return; }
      ctx.respond = false;
      ctx.res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': size,
        'Accept-Ranges': 'bytes',
        'Last-Modified': mtime.toUTCString(),
        'Cache-Control': 'public, max-age=86400'
      });
      const rs = createReadStream(fullPath);
      pipeWithThrottle(rs, ctx.res, ctx.req);
      ctx.req.on('close', () => { rs.destroy(); });
    }
  }
}
export { U, W }
