import { Context } from "koa";
//基础控制器
export abstract class Controller {
  [x: string]: any;
  async add(ctx: Context) {
    ctx.body = await this.save(ctx.request.body);
  }
  async del(ctx: Context) {
    ctx.body = await this.remove(ctx.params.id);
  }
  async fix(ctx: Context) {
    ctx.body = await this.update(ctx.params.id, ctx.request.body);
  }
  async info(ctx: Context) {
    let v = await this.findOne(ctx.params.id);
    if (!v) { ctx.status = 404; return; }
    ctx.body = v;
  }
  async page(ctx: Context) {
    ctx.body = await this.list(ctx.query);
  }
}