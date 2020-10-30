import { Context } from "koa";

export abstract class Controller {
  [x: string]: any;
 
  private _add(ctx: Context) {
    return this._save(ctx.request.body);
  }
  private _del(ctx: Context) {
    return this._remove(ctx.params.id);
  }
  private _fix(ctx: Context) {
    return this._update(ctx.params.id, ctx.request.body);
  }
  private _info(ctx: Context) {
    let v = this._findOne(ctx.params.id);
    if (!v) { ctx.status = 404; return "Not Found"; }
    return v;
  }
  private _page(ctx: Context) {
    return this._list(ctx.query);
  }
}