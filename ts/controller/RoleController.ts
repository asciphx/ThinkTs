import { Class, Inject, Put, Get, Q, R, P } from "../think/decorator"
import { RoleService } from '../service/RoleService';
import { Controller } from '../think/controller';
import { Request } from "koa"

@Class(["del", "info", "page", "add"])
class RoleController extends Controller {
  @Inject(RoleService) readonly role_: RoleService

  @Put(":id")
  async fix(@P p,@R r:Request){
    return await this.role_.fix(p.id,r.body);
  }
  @Get("/perm")//http://localhost:8080/role/perm?roles=admin,normal,……
  async perm(@Q q:{roles:string}){
    return await this.role_.perm(q.roles);
  }
}