import { Class, Post, Roles, Service } from "../decorator"
import { W } from '../weblogic'
import { AdminService } from "../service/AdminService"
import { Context } from "koa"
import { Controller } from '../controller';
//自动实现curd以及分页,第一参数可省
@Class(["add", "del", "info", "fix", "page"])
class AdminController extends Controller {
  @Service(AdminService) readonly adm_: AdminService
  
}