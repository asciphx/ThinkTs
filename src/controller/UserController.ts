import {Class,Get,Post,Put,Del,Roles,Service} from "../decorator"
import {W} from '../weblogic'
import {UserService} from "../service/UserService"
import {Context} from "koa"

@Class()//The default is the lowercase name of the entity of the controller
export class UserController{
  @Service(UserService) userSvc:UserService

  @Roles([W.Qx])
  @Get()
  async all(ctx:Context) {
    ctx.body=await this.userSvc.all();
  }
  @Roles([W.Qx])
  @Get("/:id")
  async one(ctx:Context) {
    let v=await this.userSvc.one(ctx.params.id);
    if (!v) {ctx.status = 404;return;}
    ctx.body=v;
  }
  @Post()
  async save(ctx:Context) {//@ts-ignore
    ctx.body=await this.userSvc.save(ctx.request.body);
  }
  @Roles([W.Qx,W.Login])
  @Put("/:id")
  async update(ctx:Context) {//@ts-ignore
    ctx.body=await this.userSvc.update(ctx.params.id,ctx.request.body);
  }
  @Roles([W.Qx])
  @Del("/:id")
  async remove(ctx:Context) {
    ctx.body=await this.userSvc.remove(ctx.params.id);
  }
}