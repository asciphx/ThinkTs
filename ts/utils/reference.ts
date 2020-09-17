const paraFilter = obj => {
  for (const i in obj) {
    if (obj[i] === undefined || obj[i] === '' || obj[i] === null) delete obj[i];
  }
  return obj;
}

const sortAsci=(obj:Object)=>{
	let arr = new Array(),num = 0;
	for (let i in obj)arr[num++]=i;
	let a = arr.sort(),s = {};
	for (let i in a)s[a[i]] = obj[a[i]];
	return s;
}

export { paraFilter, sortAsci }