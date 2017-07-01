import{ Injectable, Input, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { HttpModule, JsonpModule, Http, Headers } from '@angular/http';
import { BrewTimerComponent } from '../components/brewtimer/brewtimer.component';
import { BrewTimerModel } from '../models/brewtimer.model';
import { TimeRowComponent } from '../components/brewtimer/timerow.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { TimerRowModel } from '../models/timer-row.model';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";
import { Utilities } from '../components/utilities/utilities.component';
import * as moment from 'moment';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class BrewTimerService {    
    private http: Http;
    private timerRowSource = new Subject<TimeRowComponent>();  
    private timerModel = new Subject<TimerRowModel>();
    private brewTimerSource = new Subject<BrewTimerComponent>();
    private subscription: Subscription;
    private isTiming: boolean;

    public brewStartTime = new Subject<string>();
    private brewEndTime = new Subject<string>();

    brewStartTime$ = this.brewStartTime.asObservable();
    brewEndTime$ = this.brewEndTime.asObservable();

    displayBrewTime(totalTime: number) {
        let startTime = moment().format('h:mm:ss a');
        let endTime = moment().add(totalTime, 'minutes').format('h:mm:ss a');
        this.brewStartTime.next(startTime);
        this.brewEndTime.next(endTime);
    }

    timerRow = this.timerRowSource.asObservable();
    brewTimer = this.brewTimerSource.asObservable();    

    // module name subscription

    private currentName = new Subject<string>();
    currentName$ = this.currentName.asObservable();

    displayCurrentName(incomingName: string) {
        this.currentName.next(incomingName);
    }

    private apiUrl = 'http://localhost:4500/api/BrewTimer';

    getBrewTimers(): Promise<BrewTimerModel[]> {

        return this.http.get(this.apiUrl)
            .toPromise()
            .then(response => response.json().data as BrewTimerModel[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    constructor() {
        this.brewStartTime.next('');
        this.brewEndTime.next('');
        
    }
}