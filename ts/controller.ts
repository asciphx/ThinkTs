import { Context } from "koa";
export interface _ {
    where?: Function;
    orderBy?: {};
}
export abstract class Controller {
  protected static _: _;
  constructor(_:_){
    Controller._=_;
  }
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
    ctx.body = await this.list(ctx,Controller._);
  }
}