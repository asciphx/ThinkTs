import { Class, Post, Roles, Service } from "../decorator"
import { W } from '../weblogic'
import { AdminService } from "../service/AdminService"
import { Context } from "koa"
import { Controller } from '../controller';

@Class(["add", "del", "info", "page"])
class AdminController extends Controller {
  @Service(AdminService) readonly adm_: AdminService
  
}