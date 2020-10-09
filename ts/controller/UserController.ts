import { Class, Post, Middle, Service, Put, R, P } from "../think/decorator"
import { W } from '../weblogic'
import { UserService } from "../service/UserService"
import { Controller } from '../think/controller';

@Class("user",["del", "info", "page"])
class UserController extends Controller {
  @Service(UserService) readonly u_: UserService
  
  @Middle(W.Log)
  @Post("register")
  async register(@R r) {
    return await this.u_.register(r.body)
    .then(r=>r.status===409?r.mes:{code: 200, mes: `第${r.raw.insertId}位注册成功`});
  }
  @Middle(W.Log)
  @Post("login")
  async login(@R r) {
    return await this.u_.login(r.body.account,r.body.pwd)
    .then(r=>r.status?r.mes:r).catch(e=>console.error(e))
  }
  @Put(":id")
  async fix(@P p,@R r){
    return await this.u_.fix(p.id,r.body).then(r =>r.raw.changedRows?'已修改':'未修改')
  }
}