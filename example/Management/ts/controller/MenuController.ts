import { Class, app, Inject, Middle, B, P } from "../think/decorator";
import { MenuService } from '../service/MenuService';
import { Controller } from '../think/controller';
import { W } from "../weblogic";

@Class(["del", "info", "page"])
class MenuController extends Controller {
  @Inject(MenuService) readonly menu: MenuService

  @app.post()
  add(@B b){
    return this.menu.add(b);
  }
  @Middle(W.Log)
  @app.put(":id(\\d+)")
  fix(@P p,@B b){
    return this.menu.fix(p.id,b);
  }
}