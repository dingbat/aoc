import fs from 'fs';

function fuel(mass: number):number {
  const fuelNeeded = Math.floor(mass / 3.0) - 2;
  if (fuelNeeded <= 0) {
    return 0;
  }
  return fuelNeeded + fuel(fuelNeeded);
}

const file:string = fs.readFileSync(process.argv[2], 'utf8');
const stringArray:Array<string> = file.trim().split("\n");
const numberArray:Array<number> = stringArray.map(n => Number(n));
const fuelAmounts:Array<number> = numberArray.map(fuel);
const sum:number = fuelAmounts.reduce((sum, num) => sum + num, 0);
console.log(sum);
