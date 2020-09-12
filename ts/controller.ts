import { Get, Post, Put, Del } from "./decorator";import { Context } from "koa";
interface PageOp {
  current?: number;// 当前页
  count?: number;// 每页多少
  total?: number;// 总数
  pageNum?: number;// 页数
}
export abstract class Controller {
  [x: string]: any;
  protected pageOption: PageOp;
  @Post()
  async add(ctx: Context) {
    ctx.body = await this.save(ctx.request.body);
  }
  @Del(":id")
  async delete(ctx: Context) {
    ctx.body = await this.remove(ctx.params.id);
  }
  @Put(":id")
  async modify(ctx: Context) {
    ctx.body = await this.update(ctx.params.id, ctx.request.body);
  }
  @Get(":id")
  async search(ctx: Context) {
    let v = await this.findOne(ctx.params.id);
    if (!v) { ctx.status = 404; return; }
    ctx.body = v;
  }
}