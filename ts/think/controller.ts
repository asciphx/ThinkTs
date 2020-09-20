//@ts-nocheck
import { Context } from "koa";
//基础控制器
export abstract class Controller {
 
  private async add(ctx: Context) {
    ctx.body = await this.save(ctx.request.body);
  }
  private async del(ctx: Context) {
    ctx.body = await this.remove(ctx.params.id);
  }
  private async fix(ctx: Context) {
    ctx.body = await this.update(ctx.params.id, ctx.request.body);
  }
  private async info(ctx: Context) {
    let v = await this.findOne(ctx.params.id);
    if (!v) { ctx.status = 404; return; }
    ctx.body = v;
  }
  private async page(ctx: Context) {
    ctx.body = await this.list(ctx.query);
  }
}