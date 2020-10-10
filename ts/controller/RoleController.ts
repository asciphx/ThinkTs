import { Class, Inject, Put, Get, Q, R, P, Middle } from "../think/decorator"
import { RoleService } from '../service/RoleService';
import { Controller } from '../think/controller';
import { Request } from "koa"
import { W } from '../weblogic'

@Class(["del", "info", "page", "add"])
class RoleController extends Controller {
  @Inject(RoleService) readonly role_: RoleService

  @Put(":id")
  async fix(@P p,@R r:Request){
    return await this.role_.fix(p.id,r.body);
  }
  @Middle(W.Log,W.V_Q("roles"))
  @Get("/perm")//http://localhost:8080/role/perm?roles=admin,super,……
  async perm(@Q q){
    return await this.role_.perm(q.roles);
  }
}