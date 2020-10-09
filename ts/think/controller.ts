import { Context } from "koa";

export abstract class Controller {
  [x: string]: any;
 
  private async _add(ctx: Context) {
    return await this._save(ctx.request.body);
  }
  private async _del(ctx: Context) {
    return await this._remove(ctx.params.id);
  }
  private async _fix(ctx: Context) {
    return await this._update(ctx.params.id, ctx.request.body);
  }
  private async _info(ctx: Context) {
    let v = await this._findOne(ctx.params.id);
    if (!v) { ctx.status = 404; return "Not Found"; }
    return v;
  }
  private async _page(ctx: Context) {
    return await this._list(ctx.query);
  }
}