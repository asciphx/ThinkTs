import { Context } from "koa";
//基础控制器
export abstract class Controller {
  [x: string]: any;
 
  private async add(ctx: Context) {
    return await this.save(ctx.request.body);
  }
  private async del(ctx: Context) {
    return await this.remove(ctx.params.id);
  }
  private async fix(ctx: Context) {
    return await this.update(ctx.params.id, ctx.request.body);
  }
  private async info(ctx: Context) {
    let v = await this.findOne(ctx.params.id);
    if (!v) { ctx.status = 404; return "Not Found"; }
    return v;
  }
  private async page(ctx: Context) {
    return await this.list(ctx.query);
  }
}