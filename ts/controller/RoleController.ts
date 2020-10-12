import { Class, Inject, Put, Get, B, R, P, Middle } from "../think/decorator"
import { RoleService } from '../service/RoleService';
import { Controller } from '../think/controller';
import { Request } from "koa"
import { W } from '../weblogic'

@Class(["del", "info", "page", "add"])
class RoleController extends Controller {
  @Inject(RoleService) readonly role_: RoleService

  @Put(":id")
  async fix(@P p,@B b){
    return await this.role_.fix(p.id,b);
  }
  @Middle(W.Log,W.V_Q("roles#25|1"))
  @Get("/perm")//http://localhost:8080/role/perm?roles=admin,super,……
  async perm(@R r:Request){
    return await this.role_.perm(r.query.roles);
  }
}