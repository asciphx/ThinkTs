import { Class, Post, Inject, Put, Middle, B, P } from "../think/decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../think/controller';
import { W } from "../weblogic";

@Class(["del", "info", "page"])
class MenuController extends Controller {
  @Inject(MenuService) readonly menu: MenuService

  @Post()
  async add(@B b){
    return await this.menu.add(b);
  }
  @Middle(W.Log)
  @Put(":id")
  async fix(@P p,@B b){
    return await this.menu.fix(p.id,b);
  }
}