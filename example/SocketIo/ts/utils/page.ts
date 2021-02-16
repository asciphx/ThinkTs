interface Pagination {
  page?: number;// 当前页[参数]
  size?: number;// 每页多少条[参数]
  count?: number;// 条数
}
export class Page {
	private page:number=1;private count:number;private size:number=10;
	public get():Pagination{return {page:this.page,count:this.count,size:this.size}}
	constructor(page:number,size:number,count:number){
    this.page=page<1?1:page;
		this.size=size<1?1:size;
		this.count=count;
	}
}
