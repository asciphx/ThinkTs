import {Class,Get,Post,Put,Del,Roles,Service} from "../decorator"
import {W} from '../weblogic'
import { AdminService } from '../service/AdminService';
import { UserService } from '../service/UserService';

@Class("/admin")
export class AdminController{
  @Service(AdminService) readonly adminSvc:AdminService
  @Service(UserService) readonly userSvc:AdminService
  
  @Roles(W.Qx)
  @Get()
  async all(ctx) {
    let adminList=await this.adminSvc.all()
    let userList=await this.userSvc.all()
    ctx.body=[...adminList,...userList]
  }
  @Roles(W.Login)
  @Get("/:id")
  async one(ctx) {
    let v=await this.adminSvc.one(ctx.params.id);
    if (!v) {ctx.status=404;return;}
    ctx.body=v;
  }
  @Post()
  async save(ctx) {
    ctx.body=await this.adminSvc.save(ctx.request.body);
  }
  @Roles(W.Qx,W.Login)
  @Put("/:id")
  async update(ctx) {
    ctx.body=await this.adminSvc.update(ctx.params.id,ctx.request.body);
  }
  @Roles(W.Qx)
  @Del("/:id")
  async remove(ctx) {
    ctx.body=await this.adminSvc.remove(ctx.params.id);
  }
}