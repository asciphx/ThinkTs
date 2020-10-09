import { Class, Post, Inject, Put, Middle, R, P } from "../think/decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../think/controller';
import { W } from "../weblogic";

@Class(["del", "info", "page"])
class MenuController extends Controller {
  @Inject(MenuService) readonly menu: MenuService

  @Post()
  async add(@R r){
    return await this.menu.add(r.body);
  }
  @Middle(W.Log)
  @Put(":id")
  async fix(@P p,@R r){
    return await this.menu.fix(p.id,r.body);
  }
}