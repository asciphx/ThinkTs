interface Pagination {
  current?: number;// 当前页
  count?: number;// 条数
  total?: number;// 总页数
  size?: number;// 每页多少条
}
export class Page {
	private current:number=1;private total:number;private count:number;private size:number=10;
	public get():Pagination{return {current:this.current,count:this.count,total:this.total,size:this.size}}
	constructor(current:number,size:number,count:number){
    this.current=current<1?1:current;
    this.count=count<1?1:count;
		this.size=size<1?1:size;
    this.total=Math.ceil(count/size);
		this.current=this.current>=this.total?this.total:this.current;
	}
}
