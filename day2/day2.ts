import fs from 'fs';

type Op = 1 | 2 | 99;
type MemoryCell = Op | number;
type Memory = Array<MemoryCell>;

function truthbot(opcodes:Memory):Memory {
  let head;
  for (head = 0; head < opcodes.length; head += 4) {
    const op:Op = opcodes[head] as Op;
    const arg1 = opcodes[opcodes[head + 1]];
    const arg2 = opcodes[opcodes[head + 2]];
    if (op === 1) {
      opcodes[opcodes[head + 3]] = arg1 + arg2;
    }
    else if (op === 2) {
      opcodes[opcodes[head + 3]] = arg1 * arg2;
    }
    else if (op === 99) {
      break;
    }
    else {
      throw new Error(`Unknown opcode ${opcodes[head]}`);
    }
  }
  return opcodes;
}

function run(opcodes:Memory, noun:MemoryCell, verb:MemoryCell):MemoryCell {
  const copy = [...opcodes];
  copy[1] = noun;
  copy[2] = verb;
  return truthbot(copy)[0];
}

function part1(opcodes:Memory):MemoryCell {
  return run(opcodes, 12, 2);
}

function part2(opcodes:Memory):[MemoryCell, MemoryCell] {
  for (let noun = 0; noun < 1000; noun += 1) {
    for (let verb = 0; verb < 1000; verb += 1) {
      if (run(opcodes, noun, verb) === 19690720) {
        return [noun, verb];
      }
    }
  }
  throw new Error("Couldn't find noun and verb for target");
}

const file:string = fs.readFileSync(process.argv[2], 'utf8');
const opcodes:Memory = file.trim().split(",").map(Number);

console.log(part1(opcodes));
console.log(part2(opcodes));
