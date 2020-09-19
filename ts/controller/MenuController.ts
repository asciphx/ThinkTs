import { Class, Post, Service, Put } from "../decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../controller';
import { Context } from "koa";

@Class(["del", "info", "page"])
class MenuController extends Controller {
  @Service(MenuService) readonly menu: MenuService

  @Post()
  async _(ctx:Context){
    ctx.body = await this.menu.insert(ctx.request.body);
  }
  @Put(":id")
  async $(ctx:Context){
    ctx.body = await this.menu.fix(ctx.params.id,ctx.request.body);
  }
}