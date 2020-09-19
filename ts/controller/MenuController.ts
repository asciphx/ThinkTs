import { Class, Post, Roles, Service, Put } from "../decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../controller';
import { Context } from "koa";

@Class(["add", "del", "info", "page"])
class MenuController extends Controller {
  @Service(MenuService) readonly menu: MenuService

  @Put(":id")
  async $(ctx:Context){
    ctx.body = await this.menu.fix(ctx.params.id,ctx.request.body);
  }
}