import {Component, Input, Output, OnInit, ViewChildren, QueryList} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import {TimerRowModel} from '../../models/timer-row.model';
import {TimeRowComponent} from './timerow.component';
import {NavigationComponent} from '../navigation/navigation.component';
import {BrewTimerService} from '../../services/brewtimer.service';
import {VoiceService} from '../../services/voice.service';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../utilities/utilities.component';
import { BrewTimerModel } from '../../models/brewtimer.model';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'brew-timer',
  templateUrl: 'brewtimer.component.html',
  styleUrls: ['brewtimer.component.css'],
  providers: [Utilities, AnimationService, BrewTimerService]
})

export class BrewTimerComponent implements OnInit {
    public addStyle: string = 'zoomInDown';
    public deleteStyle: string = 'zoomOutUp';
    private animator: AnimationBuilder;
    public totalTime: number = 90;
    private remainingTime: string; 
    public currentAdditive: string = '';
    public nextAdditive: string = '';
    private subscription: Subscription;    
    private startTime: string;
    private finishTime: string;
    private timerCss: string;    
    private isTiming: boolean;
    private timerRowsIndex: number;
    private steps: any[] = [];
    private disabledStart: boolean;
    private timerType: number;
    private timerTypeDisplay: string;
    public phrase: string;
    public cardState: string = '';
    public name: string = '';
    public timerTypes: any;
    public brewTimerList: BrewTimerModel[];
    public typesEnum = [
        { "type": "Brew", "id": 1 },
        { "type": "Mash", "id": 2 },
        { "type": "Other", "id": 3 }
    ];   


    @ViewChildren(TimeRowComponent) rows: QueryList<TimeRowComponent>;
    timerRows: TimeRowComponent[] = [];

    ngOnInit() {        
        this.timerService.displayCurrentName('Brew Timers');
        this.disabledStart = !this.timerRowsValid();
        this.timerType = 1;
        this.timerTypeDisplay = this.typesEnum[(this.timerType-1)].type;
        this.phrase = 'time to ';        
    }

    ngAfterViewInit(){
        this.rows.changes.subscribe((r) => {
            this.timerRows;
        });  
         
    }

    onRowDeleted(timerComponent: TimeRowComponent){
        let elem = document.getElementById(timerComponent.model.id);
        this.animator.setType(this.deleteStyle).hide(elem).then(
            el => {
                let index = this.timerRows.findIndex((elem) => (elem === timerComponent));
                if(index !== -1){
                    this.timerRows.splice(index, 1);
                }    
            }
        )            
    }
    
    onTimerCompleted(timerComponent: TimeRowComponent) {        
        this.timerRowsIndex++;
        if (this.timerRowsIndex >= this.timerRows.length){
            return;
        }

        this.displaySteps();
        this.startRowTimer();        
    }    

    onFormInvalid() {
        console.log('invalid form');
    }

    toggleTimerType(type: string): void {
        this.timerTypeDisplay = type;
        switch (type.toLowerCase()) {
            case 'mash':
                this.timerType = 1;
                this.phrase = 'time to stir';
                break;
            case 'brew':
                this.timerType = 2;
                this.phrase = 'time to add ';
                break;            
            case 'other':
                this.timerType = 3;
                this.phrase = 'time to ';
                break;
        }

        console.log(this.phrase);
    }

    saveTimer() {

    }

    openTimer() {
        this.timerService.getBrewTimers().then(brewTimers => this.brewTimerList = brewTimers);
        alert('open');
    }

    testSound() {
        this.voiceService.speak(this.phrase);
    }

    displaySteps(): void {                
        let message = this.steps[this.timerRowsIndex];
        this.currentAdditive = message.current;
        this.nextAdditive = message.next;        
    }
    
    startTiming(): void{
        this.displaySteps();
        this.timerService.displayBrewTime(this.totalTime);

        this.startBaseTimer();        
        this.startRowTimer();
    }    
       
    startRowTimer(): void {
        let row = this.timerRows[this.timerRowsIndex];              
        row.startTimer();
    }    

    startBaseTimer():void{
        let baseSeconds = this.totalTime * 60;
        if(isNaN(baseSeconds)) return;
        this.startTime = moment().format('h:mm:ss a');  
        this.finishTime = moment().add(this.totalTime, 'minutes').format('h:mm:ss a');  
        this.isTiming = true;

        let durationTill: any = moment.duration(0, 'seconds').asSeconds();
        let durationAfter = moment.duration(0, 'seconds').asSeconds();
                
        let utils = new Utilities();

        let timer = TimerObservable.create(durationTill, 1000);
        this.subscription = timer.subscribe(t => {  
            this.timerCss = 'status-normal';
            let checkTime = baseSeconds - t;
            if (checkTime < (5 * 60)) {
                this.timerCss = 'status-five-minutes';
            }

            if (checkTime < (1 * 60)) {
                this.timerCss = 'status-one-minute';
            }

            if (t >= baseSeconds) {
                this.timerCss = 'status-complete';
                this.voiceService.speak('all done');
                this.subscription.unsubscribe();
                this.isTiming = false;
            }           
            
            this.remainingTime = utils.formatSessionTime(checkTime);
        });
    }
        
    addTimerRow(): void {                
        let baseId = this.timerRows.length + 1
        let model = new TimerRowModel();
        let id = 'timerow_' + baseId.toString();
        let currentStep = '';
        let nextStep = '';
        model.id = id;
        model.name = 'Additive #' + baseId.toString();
        model.baseId = baseId;
        model.timerLength = (this.totalTime - 10);
        model.timerLengthDisplay = model.timerLength.toString() + ' display';
        model.animationEntrance = this.addStyle;
        model.animationExit = this.deleteStyle;
        model.parentTimerLength = this.totalTime;
        model.timeToFire = this.getTimerDelay(model.timerLength).toString();
        let timeRow = new TimeRowComponent(
            model, 
            this.timerService, 
            this.voiceService
        );               

        timeRow.timerCompleted.subscribe(() => this.onTimerCompleted(timeRow));
        timeRow.rowDeleted.subscribe(() => this.onRowDeleted(timeRow));
        timeRow.formInvalid.subscribe(() => this.timerRowsValid());

        this.timerRows.push(timeRow);
        this.disabledStart = !this.timerRowsValid();
        this.updateCurrentNextList();
    }    

    private updateCurrentNextList(): void {
        //this.steps = [];
        let timerList = this.timerRows;        
        let currentStep = '';
        let nextStep = '';

        timerList.forEach(row => {
            let id = (row.row.baseId - 1);
                        
            if (id === 0) {
                currentStep = 'Main timer started';
            } else {
                currentStep = timerList[id-1].row.name;
            }

            if (id > timerList.length) {
                nextStep = 'Completed';
            } else {
                nextStep = timerList[id].row.name;
            }
            let entry = { 'current': currentStep, 'next': nextStep };
            this.steps.push(entry);
        })

    }

    private getTimerDelay(timerLength: number): number {
        let parentTimer = this.totalTime * 60;        
        let value = parentTimer - timerLength;
        return value;
    }

    public timerRowsValid(): boolean {
        let retVal = false;

        for (let row of this.timerRows) {
            retVal = !row.row.validForm;
            if (retVal === undefined) {
                retVal = true;
                break;
            }
        }

        if (this.timerRows.length === 0) {
            retVal = false;
        }
        
        return retVal;
    }

    constructor(
        private animationService: AnimationService,
        private timerService: BrewTimerService,
        private voiceService: VoiceService      
    )
    {        
        this.animator = animationService.builder();
        this.timerRowsValid();
        this.timerRowsIndex = 0;
        let entry = { 'current': '\xa0', 'next': 'Add timers' };
        this.steps.push(entry);
        this.displaySteps();
    }
}