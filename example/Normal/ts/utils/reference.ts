/**
 * 将Object内部空的键，移除
 * @param obj
 */
const paraFilter = (obj:Object) => {
  for (const i in obj) {
    if (obj[i] === undefined || obj[i] === '' || obj[i] === null) delete obj[i];
  }
  return obj;
}

/**
 * 将Object内部的键按照asci码来排序
 * @param obj
 */
const sortAsci=(obj:Object)=>{
	let arr = new Array(),num = 0;
	for (let i in obj)arr[num++]=i;
	let a = arr.sort(),s = {};
	for (let i in a)s[a[i]] = obj[a[i]];
	return s;
}

export { paraFilter, sortAsci }