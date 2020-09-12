export class Page {
	private current:number=1;private total:number;private count:number;private pageNum:number=10;
	public toObject():object{return {current:this.current,count:this.count,total:this.total,pageNum:this.pageNum}}
	constructor(currentPage:number, pageSize:number,size:number,startPage:number){
		this.current=currentPage;this.count=size;
        startPage<0?startPage=0:undefined;
		if (size <= 0) {this.current = 1;};
		currentPage<=0?currentPage=1:undefined;
        pageSize<1?pageSize=1:undefined;
        size<0?size=0:undefined;this.pageNum = pageSize;
        this.count = size;this.total=Math.ceil(size/pageSize);
		this.total==0?this.total=1:undefined;
		this.current = (this.current >= this.total ? this.total:this.current);
	}
}
