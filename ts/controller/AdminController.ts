import { Class, Post, Roles, Service, Get } from "../decorator"
import { AdminService } from "../service/AdminService"
import { Context } from "koa"
import { Controller } from '../controller';
import { html } from "../utils/tool";
//自动实现curd以及分页,第一参数可省
@Class(["add", "del", "info", "fix", "page"])
class AdminController extends Controller {
  @Service(AdminService) readonly adm_: AdminService
  
  @Get("sql")//sql查询实例
  async sql(ctx:Context){
    ctx.body = await this.adm_.sql(ctx.query);
  }

  @Get("index.html")//返回静态html示例
  async index(ctx:Context){
    ctx.body= await html(ctx, { path: "admin" })
  }
}