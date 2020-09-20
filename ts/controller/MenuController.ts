import { Class, Post, Service, Put, Middle } from "../think/decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../think/controller';
import { Context } from "koa";
import { W } from "../weblogic";

@Class(["del", "info", "page"])
class MenuController extends Controller {
  @Service(MenuService) readonly menu: MenuService

  @Post()
  async _(ctx:Context){
    ctx.body = await this.menu.insert(ctx.request.body);
  }
  @Middle(W.Log)
  @Put(":id")
  async $(ctx:Context){
    ctx.body = await this.menu.fix(ctx.params.id,ctx.request.body);
  }
}