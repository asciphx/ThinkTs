import { Class, Inject, app, B, Q, P, Middle } from "../think/decorator";
import Role$ from '../service/Role$';
import { Controller } from '../think/controller';
import { W } from '../weblogic';

@Class(["add", "del", "info", "fix", "page"])
class Role extends Controller {
  @Inject(Role$) readonly role_: Role$

  @app.put(":id(\\d+)")
  fix(@P p,@B b){
    return this.role_.fix(p.id,b);
  }
  @Middle(W.Log,W.V_Q("roles#25|1"))
  @app.get("/perm")//http://localhost:8080/role/perm?roles=admin,super,……
  perm(@Q q){
    return this.role_.perm(q.roles).next().value;
  }
}