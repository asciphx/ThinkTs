import { Brackets } from "typeorm"
import { Parse } from "../entity/Parse";
import $, { Inject } from "../think/service";

export default class Parse$ extends $ {
  constructor(
    private parse=Inject(Parse)
  ) {
    super({
      where: (query:{keyword:string}) => new Brackets(qb => {
        if (query.keyword) qb.where(`keyword like '%${query.keyword}%'`)
      })
    });
  }
}