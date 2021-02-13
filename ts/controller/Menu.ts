import { Class, app, Inject, Middle, B, P } from "../think/decorator";
import Menu$ from '../service/Menu$';
import { Controller } from '../think/controller';
import { W } from "../weblogic";

@Class(["del", "info", "page"])
class Menu extends Controller {
  @Inject(Menu$) readonly menu: Menu$

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