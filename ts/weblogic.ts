import { Context } from "koa"

export const W = {
  async Log(ctx: Context, next) {
    const start = Date.now();
    await next();
    const used = Date.now() - start;
    console.log(`${ctx.request.method} ${ctx.request.url} used ${used}ms`); 
  },
  async Any(ctx: Context, next) {
    //Anything else
  }
}