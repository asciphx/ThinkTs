import { Class, Post, Service, Put, Middle, R, P } from "../think/decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../think/controller';
import { W } from "../weblogic";

@Class(["del", "info", "page"])
class MenuController extends Controller {
  @Service(MenuService) readonly menu: MenuService

  @Post()
  async _(@R r){
    return await this.menu.insert(r.body);
  }
  @Middle(W.Log)
  @Put(":id")
  async $(@P p,@R r){
    return await this.menu.fix(p.id,r.body);
  }
}