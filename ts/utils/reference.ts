const paraFilter = obj => {
  for (const i in obj) {
    if (obj[i] === undefined || obj[i] === '' || obj[i] === null) delete obj[i];
  }
  return obj;
}
export { paraFilter }