const week = {0:"\u65e5",1:"\u4e00",2:"\u4e8c",3:"\u4e09",4:"\u56db",5:"\u4e94",6:"\u516d"};
export default {
  /**简易的获取时间
  * @param time:Date.now()
  */
  formateDate(time:number){
    if(!time) return '';let date = new Date(time)
    let r = date.getFullYear()+'-'+(date.getMonth()+1).toString().padStart(2,'0')+'-'+date.getDate().toString().padStart(2,'0')+' '+date.getHours().toString().padStart(2,'0')+':'+date.getMinutes().toString().padStart(2,'0')+':'+date.getSeconds().toString().padStart(2,'0')
    date = null;return r
  },
  /* 
  * date2str("YYYY-MM-DD hh:mm:ss.S",new Date) => 2019-08-02 下午 08:09:04.423 
  * date2str("YYYY-MM-DD EE HH:mm:ss") => 2019-08-10 周六 20:09:04       
  * 其他格式 MM/DD/YYYY HH  MM/DD/YYYY
  */
  date2str(f:string="YYYY-MM-DD EEE hh:mm:ss",date:Date=new Date){
    let o = {"M+":date.getMonth()+1,"D+":date.getDate(),"h+":date.getHours()===12?12:date.getHours()%12,
    "H+":date.getHours(),"m+":date.getMinutes(),"s+":date.getSeconds(),"S":date.getMilliseconds()};
    if(/(Y+)/.test(f))f=f.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length));
    if(/(E+)/.test(f))f=f.replace(RegExp.$1,(RegExp.$1.length>2 ?"\u661f\u671f":RegExp.$1.length>1?"\u5468":"")
      +week[date.getDay()]);
    if(/(h+)/.test(f))f=f.replace(/(?=h+)/,date.getHours()>12?"\u4E0B\u5348 ":"\u4E0A\u5348 ")
    for(let k in o)
      if(new RegExp("("+ k +")").test(f))
        f=f.replace(RegExp.$1,RegExp.$1.length===1?o[k]:("00"+o[k]).substr((""+o[k]).length));
    o=date=null;return f;
  }
}
