import {Class,Get,Post,Put,Del,Roles,Service} from "../decorator"
import {W} from '../weblogic'
import {UserService} from "../service/UserService"
import {Context} from "koa"

@Class()//The default is the lowercase name of the entity of the controller
export class UserController{
  @Service(UserService) readonly userSvc:UserService

  @Post("/register")
  async register(ctx:Context) {
    ctx.body=await this.userSvc.register(ctx.request.body);
  }
  @Post("/login")
  async login(ctx:Context) {
    ctx.body=await this.userSvc.login(ctx.request.body);
  }
  @Roles(W.Qx)
  @Get()
  async all(ctx:Context) {
    ctx.body=await this.userSvc.all();
  }
  @Roles(W.Qx)
  @Get("/:id")
  async one(ctx:Context) {
    let v=await this.userSvc.one(ctx.params.id);
    if (!v) {ctx.status = 404;return;}
    ctx.body=v;
  }
  @Post()
  async save(ctx:Context) {
    ctx.body=await this.userSvc.save(ctx.request.body);
  }
  @Roles(W.Qx)
  @Put("/:id")
  async update(ctx:Context) {
    ctx.body=await this.userSvc.update(ctx.params.id,ctx.request.body);
  }
  @Roles(W.Qx)
  @Del("/:id")
  async remove(ctx:Context) {
    ctx.body=await this.userSvc.remove(ctx.params.id);
  }
}