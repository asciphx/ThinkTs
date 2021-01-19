## ThinkTs
- Support **typeorm**, the best typescript ORM framework, and easily write all kinds of logic of Dao layer
- Allow static type modification and type inference to support back-end development and maintenance
- Modular development makes the application easier to layer and provides an easy-to-use modular management mechanism
- AOP code is written in a low-key way, but it is easy to realize log, interceptor, filter and other functions
- MVC, API, websocket, microservice and other systems are constructed fastest, good and most fiercely
- The configuration is greater than the code, and priority is given to automatically implement five methods, such as adding, deleting, modifying and querying, and pagination, to facilitate the establishment of authority background system
- With the field level RBAC and pluggable middleware decorator, the assembly function has unlimited possibilities
- Support for serverless, the introduction of router in the controller method, you can easily change the background page, or even write to a file
- Multiple databases are allowed, as long as it is a relational database allowed by typeorm. Currently, MySQL and Postgres have been provided
- Add the example directory of socketio demo[the default is management Version (the default password of Redis is 6543210)]
- Method override can be used to replace the curdp method generated automatically, so that there is no need to worry about whether there is redundancy in the routing
- From the ES6 magic function generator generator, plus the whole asynchronous to further improve efficiency, so stable, extremely fast
### With ThinkTs your controller look like this:
```typescript
@Class(["add","del","fix","info","page"])//or @Class("/admin",……)or @Class("admin",……)
class AdminController extends Controller{
  @Inject(AdminService) readonly a_:AdminService
  @Inject(UserService) readonly u_:UserService

  @Middle(W.Log,W.V_B("account|1#3~10","pwd#6~23|1"))
  @app.post("register")
  add(@B body) {
    return this.u_.register(body.account,body.pwd)
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
#### And your service looks like this:
```typescript
export class UserService extends Service implements UserFace{
  constructor(
    private user:Repository<User>=Cache["User"],
    private role:Repository<Role>=Cache["Role"]
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

### [Cache](https://github.com/typeorm/typeorm/blob/master/docs/caching.md)

### Features
- [x] The default value of class class decorator is`/`+ entity class name, which can also be customized
- [x] Automatically scan controller directory and configure routes route
- [x] Automatically scan the entity directory and load it into Cache, which is equivalent to a container, which can avoid multiple instances of entity
- [x] Automatically generate the configuration route file for reference, which is under the routes directory
- [x] Automatic implementation of addition, deletion, modification and query
- [x] Now add the basic controller and service layer. The controller decorator can be customized to automatically add, delete, modify, query and pagination.
- [x] The controller can now customize the name of the service class variable to be called.
- [x] In order to reduce memory overhead and instance calls, we have implemented the containerization of entity classes.
- [x] Add parameter decorator, more convenient and beautiful, and will not affect the running speed
- [x] decorators can be placed horizontally, and can be stacked, and the order is from right to left
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

The return value in restful specification actually costs too much bandwidth. However, I think the front end only needs to judge whether the return is a string or an object. For example, the string is displayed directly (the front-end pop-up window is OK),
If an object is returned, the request status code must be 200, so only the important data is taken without the code status code and mass message to indicate success (those two things are totally a waste of traffic).


### Directory structure
1. ts: `back end file entry`
2. ts/controller: `control layer`
3. ts/entity:`entity layer`
4. ts/interface: `interface layer`
5. ts/service: `service layer`
6. ts/think: `base layer`
7. ts/utils: `tool layer`
8. views: `background EJS template rendering folder`
9. lib: `Windows uses the RM and CP instructions of Linux, and needs to put the environment variable directory`
10. routes: `output the route file to view. Each controller will create one`
11. upload: `the storage directory of the uploaded file`
12. dist: `package back end to formal environment directory`
13. log: `PM2 output log directory`
14. Example: `save the template of permission management, as well as the common template`

### Other
> Built by the world's No.1 man, Asciphx  
> Please wait this project will generate a blog project
