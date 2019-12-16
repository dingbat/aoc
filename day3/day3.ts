import fs from 'fs';

type Direction = "L" | "R" | "U" | "D";
interface Vector {
  direction: Direction,
  length: number,
}
type Wire = Array<Vector>;

type Point = [number, number];

type Range = [number, number];
type RangeMapInternal = { [key:number]: Array<Range> };
class RangeMap {
  internalMap:RangeMapInternal = {};

  pushRange(index:number, range:Range):void {
    this.internalMap[index] = this.internalMap[index] || [];
    this.internalMap[index].push(range.sort((a, b) => a - b));
  }

  getIntersection(index:number, range:Range):Point | null {
    const sorted = range.sort((a, b) => a - b);
    let intersection = null;

    for (let i = sorted[0]; i <= sorted[1]; i++) {
      (this.internalMap[i] || []).find(existingRange => {
        if (index >= existingRange[0] && index <= existingRange[1]) {
          intersection = [index, i];
          return true;
        }
      });
    }

    return intersection;
  }
}

function followWire(wire:Wire, callback:(prevPoint:Point, nextPoint:Point) => void):void {
  let currentPoint:Point = [0, 0];
  wire.forEach(vector => {
    let [x, y] = currentPoint;

    if (vector.direction === "L") {
      x -= vector.length;
    } else if (vector.direction === "R") {
      x += vector.length;
    } else if (vector.direction === "U") {
      y -= vector.length;
    } else if (vector.direction === "D") {
      y += vector.length;
    }

    const nextPoint:Point = [x, y];
    callback(currentPoint, nextPoint);
    currentPoint = nextPoint;
  });
}

function getIntersections(wire1:Wire, wire2:Wire):Array<Point> {
  const yRangesForRow = new RangeMap();
  const xRangesForColumn = new RangeMap();

  followWire(wire1, (previousPoint, nextPoint) => {
    if (previousPoint[0] === nextPoint[0]) {
      yRangesForRow.pushRange(nextPoint[0], [previousPoint[1], nextPoint[1]]);
    } else if (previousPoint[1] === nextPoint[1]) {
      xRangesForColumn.pushRange(nextPoint[1], [previousPoint[0], nextPoint[0]]);
    } else {
      throw new Error("both x and y moved");
    }
  });

  const intersections:Array<Point> = [];

  followWire(wire2, (previousPoint, nextPoint) => {
    let intersection;
    if (previousPoint[0] === nextPoint[0]) {
      intersection = xRangesForColumn.getIntersection(
        previousPoint[0],
        [previousPoint[1], nextPoint[1]],
      );
    } else if (previousPoint[1] === nextPoint[1]) {
      intersection = yRangesForRow.getIntersection(
        previousPoint[1],
        [previousPoint[0], nextPoint[0]],
      );
    } else {
      throw new Error("both x and y moved");
    }
    if (intersection) {
      intersections.push(intersection);
    }
  });

  return intersections.filter(([x, y]) => x !== 0 && y !== 0);
}

function distanceFromOrigin(point:Point):number {
  return Math.abs(point[0]) + Math.abs(point[1]);
}

function parseWire(wireString:String):Wire {
  return wireString.split(",").map(vector => {
    const direction = vector[0];
    if (direction !== "R" && direction !== "L" && direction !== "U" && direction !== "D") {
      throw new Error("unknown direction " + direction);
    }
    return {
      direction,
      length: Number(vector.substr(1)),
    };
  });
}

// const file = "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83"
// const file = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
const file = fs.readFileSync(process.argv[2], 'utf8').trim();
const [wire1, wire2] = file.split("\n").map(parseWire);
const intersections = getIntersections(wire1, wire2);
const distances = intersections.map(distanceFromOrigin);
console.log(Math.min(...distances));
