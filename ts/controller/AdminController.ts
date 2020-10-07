import { Class, Service, Get } from "../think/decorator"
import { AdminService } from "../service/AdminService"
import { Context } from "koa"
import { Controller } from '../think/controller';
import { html } from "../utils/tool";

@Class(["add", "del", "info", "fix", "page"])
class AdminController extends Controller {
  @Service(AdminService) readonly adm_: AdminService
  
  @Get("sql")
  async sql(ctx:Context){
    return await this.adm_.sql(ctx.query);
  }

  @Get("index.html")
  async index(ctx:Context){
    return await html(ctx, { path: "admin" })
  }
}