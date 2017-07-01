import { Injectable, Input, Output } from '@angular/core';
import { BrewTimerModel } from '../models/brewtimer.model';
import { TimeRowModel } from '../models/timerow.model';

@Injectable()
export class MockData {
    private _amount: number;
    private list: TimeRowModel[];

    @Output()
    public getBrewTimer(): BrewTimerModel {
        let list = this.getTimeRows();
        let brewTimer = new BrewTimerModel();
        brewTimer.timeRows = list;

        return brewTimer;
    }

    private getTimeRows(): Array<TimeRowModel> {
        let list = new Array<TimeRowModel>();
        let counter = this._amount;
        while (counter > 0) {
            let timeRow = new TimeRowModel("", 0);
            list.push(timeRow);
            counter--;
        }

        return list;
    }

    constructor(public amount: number) {
        this._amount = amount;
    }
}