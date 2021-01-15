import { Class, Inject, app, B, R, P, Middle } from "../think/decorator";
import { RoleService } from '../service/RoleService';
import { Controller } from '../think/controller';
import { W } from '../weblogic';import { Request } from "koa";

@Class(["add", "del", "info", "fix", "page"])
class RoleController extends Controller {
  @Inject(RoleService) readonly role_: RoleService

  @app.put(":id(\\d+)")
  fix(@P p,@B b){
    return this.role_.fix(p.id,b);
  }
  @Middle(W.Log,W.V_.q("roles#25|1"))
  @app.get("/perm")//http://localhost:8080/role/perm?roles=admin,super,……
  perm(@R r:Request){
    return this.role_.perm(r.query.roles);
  }
}