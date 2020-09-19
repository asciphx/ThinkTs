import { Context } from "koa"

export const W = {
  async Log(ctx: Context, next) {
    const start = Date.now();
    await next();
    console.log(`${ctx.request.method}${ctx.request.url} used ${Date.now() - start}ms`); 
  },
  async Any(ctx: Context, next) {
    //Anything else
  }
}