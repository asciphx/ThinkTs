import {Class,Get,Post,Put,Del,Roles,Service} from "../decorator"
import {W} from '../weblogic'
import { _AdminUserService } from '../service/_AdminUserService';

@Class("/admin&user")
export class _AdminUserController{
  @Service(_AdminUserService) readonly adminUserSvc:_AdminUserService
  
  @Roles(W.Qx)
  @Get()
  async all(ctx) {
    ctx.body=await this.adminUserSvc.all()
  }
}