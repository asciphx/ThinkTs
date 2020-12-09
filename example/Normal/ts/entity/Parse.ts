import { Entity, Column, PrimaryColumn } from "typeorm";
@Entity()
export class Parse {
  @PrimaryColumn({comment: "键", length: 9 ,unique:true}) keyword: string;
  @Column({comment: "选项值"}) keywordDESC: string;
  @Column({comment: "描述", length: 7}) parameterName: string;
  constructor(keyword: string, keywordDESC?: string, parameterName?: string) {
    this.keyword = keyword; this.keywordDESC = keywordDESC;
    this.parameterName = parameterName ? parameterName : keyword;
  }
}