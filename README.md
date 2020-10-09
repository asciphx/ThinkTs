## ThinkTs
- Support **typeorm**, the best typescript ORM framework, and easily write all kinds of logic of Dao layer
- Allow static type modification and type inference to support back-end development and maintenance
- Modular development makes the application easier to layer and provides an easy-to-use modular management mechanism
- AOP code is written in a low-key way, but it is easy to realize log, interceptor, filter and other functions
- MVC, API, websocket, microservice and other systems are constructed fastest, good and most fiercely
- The configuration is greater than the code, and priority is given to automatically implement five methods, such as adding, deleting, modifying and querying, and pagination, to facilitate the establishment of authority background system
- With the field level RBAC and pluggable middleware decorator, the assembly function has unlimited possibilities
### With ThinkTs your controller look like this:
```typescript
@Class(["add","del","fix","info","page"])//or @Class("/admin",……)or @Class("admin",……)
class AdminController extends Controller{
  @Inject(AdminService) readonly adminSvc:AdminService
  @Inject(UserService) readonly userSvc:AdminService

  @Middle(W.Log)
  @Post("login")
  async login(@R request) {
    return await this.userSvc.login(request.body);
  }
}
/** Here's how to show EJS template rendering */
class View{
  @Get()
  @Get("index.html")
  async index(ctx:Context){
    await html(ctx,{test:"test",author:"asciphx"})
  }
  @Get("login.html")
  async login(ctx:Context){
    await html(ctx,{test:"test",author:"Login"})
  }
}
```
#### And your service looks like this:
```typescript
export class UserService extends Service implements UserFace{
  constructor(
    private user:Repository<User>=Cache[User.name],
    private role:Repository<Role>=Cache[Role.name]
  ) {
    super({
      leftJoin:{e:"user.roles",a:'role'},
      addSelect:['role.id','role.name'],
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
#### And your interface looks like this:
```typescript
export interface UserFace{
  /** register one*/register(entity)
  /** login one*/login(entity)
}
```
### Finally, please refer to the entity class writing method of [TypeORM](https://github.com/typeorm/typeorm)

### Features
- [x] The default value of class class decorator is`/`+ entity class name, which can also be customized
- [x] automatically scan controller directory and configure routes route
- [x] automatically scan the entity directory and load it into Cache, which is equivalent to a container, which can avoid multiple instances of entity
- [x] automatically generate the configuration route file for reference, which is under the routes directory
- [x] automatic implementation of addition, deletion, modification and query
- [x] now add the basic controller and service layer. The controller decorator can be customized to automatically add, delete, modify, query and pagination.
- [x] the controller can now customize the name of the service class variable to be called.
- [x] In order to reduce memory overhead and instance calls, we have implemented the containerization of entity classes.

## New version of custom JWT authentication description

> The header request header now has two parameters, and the original JWT does not change. Now add a secret. Secret is now provided by the back end. The algorithm is in the cryptoUtil.ts in
> ```javascript
> a:`${token}`
> s:`${secret}`
> ```
> In particular, localhost:8080/index.html It is the postman interface. Remember to record token and sercet after login and use it as above. The front-end is still in implementation. Let's use postman for a while.
> For instructions started in a formal environment, windows uses NPM run pro, while MAC or Linux uses NPM run prod
> Because I use windows 10, PM2 does not support Linux or Mac temporarily. If you need to use it, please rewrite it and test it yourself
### Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

## Authority management
menu path,automatically generated(Matching rule)

Add：POST/admin  
Delete：DELETE/admin/  
Modification：PUT/admin/  
Query：GET/admin/  
Pagination：GET/admin  

### Directory structure
1. ts: ` back end file entry`
2. ts/controller: ` control layer`
3. ts/entity:`entity layer`
4. ts/interface: ` interface layer`
5. ts/service: `service layer`
6. ts/think: `base layer`
7. ts/utils: ` tool layer`
8. views: ` background EJS template rendering folder`
9. routes: ` output the route file to view. Each controller will create one`
10. Lib: ` Windows uses the RM and CP instructions of Linux, and needs to put the environment variable directory`

### Other
> Built by the world's No.1 man, Asciphx  
> Please wait this project will generate a blog project
