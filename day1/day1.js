"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function greeter(person) {
    return "Hello, " + person;
}
var file = fs_1.default.readFileSync('./day1input.txt', 'utf8');
console.log(greeter("da2n"));
