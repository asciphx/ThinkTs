import {Context} from "koa"

export const W={
  async Qx(ctx:Context, next){
      await next();
  },
  async Login(ctx:Context, next){
    //session
    if (!ctx.session?.user) {console.log("not login!");return ctx.redirect('/');}await next();
  }
}