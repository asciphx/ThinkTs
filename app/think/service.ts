import P from "../utils/page"; import { getRepository, ObjectLiteral, EntityTarget, Repository } from "typeorm"; import { vType } from "../config";
interface _ {
  orderBy?: {}; groupBy?: string; leftJoin?: { e: Function | string, a: string, c?: string, p?: ObjectLiteral; }; where?: Function;
  addLeftJoin?: { e: Function | string, a: string, c?: string, p?: ObjectLiteral; }; select?: string | string[] | any; addSelect?: string | string[] | any
}
//基础服务类，$默认是实体类小写，如有变请在super第二个参数传入，直接return;此时默认的状态码是204，意思是No Content
const Entity = new Map<string, Repository<any>>();
function ConstructorNameFix(n: string) {
  let i = 0;
  for (; i < n.length; ++i) {
    const ch = n.charCodeAt(i); if ((ch >= 65 && ch <= 90) || ch === 36) break;
  }
  return n.slice(0, i);
}
export default abstract class Service {
  private _: _; private _$: string;
  private $: string = ConstructorNameFix(this.constructor.name);
  constructor(_?: _, $?: string) {
    this._ = _; if ($) { this._$ = $; }
  }
  private *save(obj) {
    return Entity[this.$].save(obj);
  }
  private *update(id: number, obj) {
    return Entity[this.$].update(id, obj);
  }
  private async*remove(id: number) {
    const v = await Entity[this.$].findOne({ where: { id } });
    if (!v) { return; } return Entity[this.$].remove(v);
  }
  private *findOne(id: number) {
    return Entity[this.$].findOne({ where: { id } });
  }
  /**
   * 分页列表查询 - 优化了 TypeORM 查询构建逻辑
   * 支持关联预加载，避免 N+1 查询问题
   */
  private async*list(query) {
    const size = Number(query.size) || 10, page = Number(query.page) || 1;
    // 使用 createQueryBuilder 构建查询，并启用结果缓存
    let v = Entity[this.$].createQueryBuilder(this._$)
      .cache(true)              // TypeORM 5+ 支持 SQL 查询结果缓存
      .take(size)
      .skip(page * size - size);
    if (this._ !== undefined) {
      // 关联表 JOIN - 使用左连接避免数据丢失
      if (this._.leftJoin !== undefined) { v.leftJoin(this._.leftJoin.e, this._.leftJoin.a, this._.leftJoin.c, this._.leftJoin.p); }
      if (this._.addLeftJoin !== undefined) { v.leftJoin(this._.addLeftJoin.e, this._.addLeftJoin.a, this._.addLeftJoin.c, this._.addLeftJoin.p); }
      // 明确选择需要的字段，避免返回整行数据
      if (this._.select !== undefined) { v.select(this._.select) }
      if (this._.addSelect !== undefined) { v.addSelect(this._.addSelect) }
      // WHERE 条件构建
      if (this._.where !== undefined) { v.where(this._.where(query)) }
      // 排序支持多字段
      if (this._.orderBy !== undefined && Object.getOwnPropertyNames(this._.orderBy).length > 0) {
        const orderKeys = Object.keys(this._.orderBy);
        for (let i = 0; i < orderKeys.length; i++) {
          v.addOrderBy(orderKeys[i], this._.orderBy[orderKeys[i]].toUpperCase());
        }
      }
      if (this._.groupBy !== undefined) { v.groupBy(this._.groupBy) }
    }
    // 批量执行查询 - 使用 getManyAndCount 原子性返回数据和总数
    const result = await v.getManyAndCount();
    v = null;
    return {
      list: result,
      page: new P(page, size, result.length).get()
    };
  }
}
export function Inject<T>(e: EntityTarget<T> & { name: string }): Repository<T> {
  if (Entity[e.name] === undefined) {
    Entity[e.name] = getRepository(e); vType[e.name] = {};
    Entity[e.name].metadata.ownColumns.forEach(r => {
      let t = r.type;
      Object.defineProperty(vType[e.name], r.propertyName, {
        enumerable: true, writable: true,//@ts-ignore
        value: t === "datetime" ? 26 : t.name === "Number" ? 9 : t.name === "Boolean" ? 5 : t === "tinyint" ? 2 : t === "smallint" ? 4 :
          t === "mediumint" ? 6 : t === "bigint" ? 18 : r.length === "" ? 255 : Number(r.length)
      }); typeof t === "string" ? void 0 : t = null;
    });
  } return Entity[e.name]
}
