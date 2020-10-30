import { Class, Inject, Put, Get, B, R, P, Middle } from "../think/decorator";
import { RoleService } from '../service/RoleService';
import { Controller } from '../think/controller';
import { W } from '../weblogic';import { Request } from "koa";

@Class(["del", "info", "page", "add"])
class RoleController extends Controller {
  @Inject(RoleService) readonly role_: RoleService

  @Put(":id")
  fix(@P p,@B b){
    return this.role_.fix(p.id,b);
  }
  @Middle(W.Log,W.V_Q("roles#25|1"))
  @Get("/perm")//http://localhost:8080/role/perm?roles=admin,super,……
  perm(@R r:Request){
    return this.role_.perm(r.query.roles);
  }
}