import { Console } from "../interfaces/console.interface";

export class ConsoleMapper{
  static ConsoleToNameArray(console: Console){
    return console.console_name
  }

  static ArrayConsoleToNameArray(consoles: Console[]){
    return consoles.map((res) => this.ConsoleToNameArray(res))
  }
}