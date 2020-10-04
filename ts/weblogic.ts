import { Context } from "koa"
import date from "./utils/date"

export const W = {
  async Log(ctx: Context, next) {
    const start = Date.now();
    await next();
    console.log(`${ctx.method}${ctx.url} used ${Date.now() - start}ms -> ${date.date2str()}`); 
  },
  async Any(ctx: Context, next) {
    //Anything else
  }
}