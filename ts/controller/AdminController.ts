import { Class, Service, Get } from "../decorator"
import { AdminService } from "../service/AdminService"
import { Context } from "koa"
import { Controller } from '../controller';
import { html } from "../utils/tool";

@Class(["add", "del", "info", "fix", "page"])
class AdminController extends Controller {
  @Service(AdminService) readonly adm_: AdminService
  
  @Get("sql")
  async sql(ctx:Context){
    ctx.body = await this.adm_.sql(ctx.query);
  }

  @Get("index.html")
  async index(ctx:Context){
    ctx.body= await html(ctx, { path: "admin" })
  }
}