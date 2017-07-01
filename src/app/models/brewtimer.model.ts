import { TimeRowModel } from './timerow.model';

export class BrewTimerModel{
  id: number;
  timerType: number;
  name: string;
  time: number;
  phrase: string;
  timeRows: TimeRowModel[];
}
