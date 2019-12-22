function legal(code:number):boolean {
  let repeatedLetter = false;
  const codeStr = code + "";
  for (let i = 1; i < codeStr.length + 1; i++) {
    if (Number(codeStr[i - 1]) > Number(codeStr[i])) {
      return false;
    }
    if (
      !repeatedLetter &&
      codeStr[i - 1] === codeStr[i - 2] &&
      codeStr[i - 2] !== codeStr[i - 3] &&
      codeStr[i] !== codeStr[i - 1]
    ) {
      repeatedLetter = true;
    }
  }
  return repeatedLetter;
}

function countPossibilities(min:number, max:number):number {
  let count = 0;
  for (let code = min; code <= max; code++) {
    if (legal(code)) {
      count += 1;
    }
  }
  return count;
}

// console.log(legal(112233));
// console.log(legal(123444));
// console.log(legal(111122));

const min = 134564;
const max = 585159;
console.log(countPossibilities(min, max));
