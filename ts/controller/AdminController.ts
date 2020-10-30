import { Class, Inject, Get, Q } from "../think/decorator";
import { AdminService } from "../service/AdminService";
import { Context } from "koa";
import { Controller } from '../think/controller';
import { html } from "../utils/tool";

@Class(["add", "del", "info", "fix", "page"])
class AdminController extends Controller {
  @Inject(AdminService) readonly adm_: AdminService
  
  @Get("sql")
  sql(@Q q){
    return this.adm_.sql(q);
  }

  @Get("index.html")
  index(ctx:Context){
    return html(ctx, { path: "admin" })
  }
}