import { Context } from "koa"
import date from "./utils/date"
export const W = {
  async Log(ctx: Context, next) {
    const start = Date.now();
    await next();
    console.log(`${ctx.method}${ctx.url} used ${Date.now() - start}ms -> ${date.date2str()}`); 
  },
  V_B(...o:Array<string>):Function {
    return async (ctx: Context, next) => {
      let b=Object.keys(ctx.request.body),i=0
      for (let p of o)
        if (p === b[i++]) null; else {
          ctx.status = 412;ctx.body = "body isn't verified";b = null;return
        }
      b = null;
      await next();
    }
  },
  V_Q(...o:Array<string>):Function {
    return async (ctx: Context, next) => {
      let b=Object.keys(ctx.query),i=0
      for (let p of o)
        if (p === b[i++]) null; else {
          ctx.status = 412;ctx.body = "query isn't verified";b = null;return
        }
      b = null;
      await next();
    }
  }
}