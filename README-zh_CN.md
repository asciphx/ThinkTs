# ThinkTs
- 支持 **TypeORM**，最好的 Typescript ORM 框架，轻松编写 DAO 层的各类逻辑
- 允许使用静态类型修饰、类型推断，为后端开发和维护提供支持
- 模块化开发，让应用程序更容易分层，提供了易于使用的模块化管理机制
- 最低调编写 AOP 代码，面向切面编程，却轻松实现日志、拦截器、过滤器等功能
- 最快，最迅速，最猛烈构建 MVC、API、websocket、微服务等系统
- 配置大于编码，优先自动实现增删改查以及分页等五个方法，方便权限后台系统搭建
- 服务类能够implements接口，快速定位每个方法，轻松维护代码复杂繁多的service
- 字段级别的rbac，加上可插拔的中间件装饰器，组装功能具有无限的可能
- 支持serverless，在控制器方法引入ROUTER，即可让网页轻松改后台，甚至写入文件
- 可以用各种typeORM允许的关系型数据库，目前先提供mysql，postgres
- 增加socketIo版[默认为此版]，现阶段还在完善，另外普通版跟管理版已放到example目录
## 使用**ThinkTs**让你的controller看起来像是:

```typescript
@Class(["add","del","fix","info"])//or @Class("/admin",……)or @Class("admin",……)
class AdminController extends Controller{
  @Inject(AdminService) readonly adminSvc:AdminService
  @Inject(UserService) readonly userSvc:UserService

  @Middle(W.Log,W.V_B("pwd#6~23|1","account|1#3~10"))
  @app.post("login")
  login(@B body) {
    return this.userSvc.login(body.account,body.pwd)
  }
}
/** Here's how to show EJS template rendering */
class View{
  @Get() @Get("index.html")
  index(ctx:Context){
    html(ctx,{test:"test",author:"asciphx"})
  }
  @Get("login.html")
  login(ctx:Context){
    html(ctx,{test:"test",author:"Login"})
  }
}
```
### 让你的service看起来像是:
```typescript
export class UserService extends Service implements UserFace{
  constructor(
    private user:Repository<User>=Cache["User"],
    private role:Repository<Role>=Cache["Role"]
  ) {
    super({
      leftJoin:{e:"user.roles",a:'role'},
      select:[ 'user.id','user.account', 'role.id','role.name', 'user.photo', 'user.status'],
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where('account like :v', { v: `%${query.account}%` })
          if (query.id) qb.andWhere('id >:i', { i: query.id })
        });
      },
      orderBy: { "user.id": "desc" }
    })
  }
}
```
### 让你的interface看起来像是:
```typescript
export interface UserFace{
  /** register one*/register(entity)
  /** login one*/login(entity)
  /** search all*/all()
}
```
### 让你的entity看起来像是[TypeORM](https://github.com/typeorm/typeorm)中的写法

### Cache用法：[Cache](https://github.com/typeorm/typeorm/blob/master/docs/caching.md)

## 特征
- [x] Class类装饰器默认值为 "/"+实体类名 ,当然也可以自定义
- [x] 自动扫描entity目录，载入到Cache，相当于一个容器,可以避免entity被多次实例化
- [x] 自动扫描controller目录，并且配置Routes路由
- [x] 自动生成配置路由文件以便查阅，在routes目录下，也可删除，或者去ts/config.ts下更改printRoute为false
- [x] 有近似于nest.js架构的速度，还有java:SpringBoot框架的可维护性
- [x] 如不采用typeORM库，也可以使用Sequelize，并重写entity类
- [x] 现在增加基础控制器、服务层，控制器装饰器可以自定义自动实现增删改查以及分页
- [x] 增加参数装饰器，更加便捷美观，并且不会影响到运行速度
- [x] 装饰器可以横着放，并且，可以堆叠，顺序是从右往左依次执行

## 新版自定义JWT鉴权说明
> Headers请求头现在为2个参数，原版jwt不变。现增加一个secret，算法是在cryptoUtil.ts里并由后端额外提供动态secret，此项目只是个高度安全的案例，只要后端代码加强算法并不泄露，就难破解。
> ```javascript
> a:`${token}`
> s:`${secret}`
> ```
> 特别地，localhost:8080/index.html是Postman界面，记住登陆后记录token和sercet，并像上面使用即可。前端目前还在实现中，先暂给大家用Postman尝鲜。
> 在正式环境下启动的指令，windows使用的是`npm run pro`,而Mac或者Linux是`npm run prod`.因本人用win10，暂`npm run pm2`不支持linux或者Mac
> 新增redis，为了每个线程上的服务可同步缓存,在ts/config.ts下设置synchronize，默认6秒，redis密码在config配置，默认6543210
> 允许使用postgres(在ormconfig.js中配置)，win用户得用登录win账户名，我是Asciphx（其他系统记得改下），并且也需在pgsql中创建spring这个database。
> 若启动时出现QueryFailedError请用对应sql文件在查询窗口/工具 内粘贴进去执行（即相当于导入功能），导入暂时还没测，注意mysql必须用utf8mb4编码。
> 由于一般情况下不需要使用redis，所以推出此经典socketIo版，管理版和普通版放到了example目录下，如需使用请覆盖到顶级目录即可
## 目录结构
1. ts:`后端文件入口`
2. ts/controller:`控制层`
3. ts/entity:`实体层`
4. ts/interface:`接口层`
5. ts/service:`服务层`
6. ts/think:`基础层`
7. ts/utils:`工具层`
8. views:`后台ejs模板渲染文件夹`
9. lib:`windows用到linux的rm与cp指令程序，需放环境变量目录`
10. routes:`输出查看的路由文件，每个controller会创建一个`
11. upload:`上传文件的存储目录`
12. dist:`打包后端到正式环境的目录`
13. log:`pm2输出日志目录`
14. example:`存放权限管理的模板，还有普通的模板`

## 权限管理（现已移动到example目录）
[example/Management目录下面直接覆盖到顶层目录即可]
PATH路径，自动生成的（匹配规则）  
增加：POST/admin  
删除：DELETE/admin/  
修改：PUT/admin/  
查询：GET/admin/  
分页：GET/admin  
菜单只包含目录结构，没有请求路径。  路由的上级节点只能是菜单，包含请求路径。  
按钮的上级节点只能是路由，而且必须没有请求路径，是因为按钮的功能都基于spa单页应用。  
put方法实际上跟patch方法等同，如果局部修改也不会影响其他，所以没写patch装饰器。  
ormconfig.js注释中包含是否输出log或错误，取消注释即可使用。 
其中synchronize设置为true是自动同步，若是修改了实体类，自动同步可能会导致修改的字段数据清空。
所以保存之前，重启服务前，先在数据库改，比如字段长度。然后在实体类改成一样的并保存，最后再重启服务。
或，synchronize设置false，修改实体类重启服务则不同步 ，然后手动在数据库修改成与实体类一样的属性。
restful规范中的返回值实际太费带宽，而我认为前端只需判断返回是字符串还是对象，如字符串就直接显示(前端弹窗就行)，
如返回对象，请求状态码一定是200，所以只拿重要数据而不需code状态码和massage提示成功(那两东西完全是浪费流量)。  
该项目离serverless又更近了一步，其实我的目标是serverless！

## **请赞助本项目**
如你觉有收获，请给我打赏

![微信打赏](http://www.91huanwei.com/1.jpg)
![支付宝打赏](http://www.91huanwei.com/0.jpg)
