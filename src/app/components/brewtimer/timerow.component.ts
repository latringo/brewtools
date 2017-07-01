import { NgModule, Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";
import { TimerRowModel } from '../../models/timer-row.model';
import { BrewTimerComponent } from './brewtimer.component';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { VoiceService } from '../../services/voice.service';
import { BrewTimerService } from '../../services/brewtimer.service';
import { Utilities } from '../utilities/utilities.component';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'timer-row',
    templateUrl: 'timerow.component.html',
    providers: [BrewTimerService, Utilities, TimerRowModel, VoiceService]    
})

export class TimeRowComponent implements OnDestroy, OnInit, OnChanges {    
    @Input() row: TimerRowModel = this.model;    
    @Input() baseId: number;
    @Input() id: string;
    @Input() name: string;
    @Input() timerLength: number;
    @Input() timerStart: number;
    @Input() baseSeconds: number;
    @Input() timerComponent: TimeRowComponent;    

    private subscription: Subscription;
    public utils: Utilities;
    public timerCss: string = 'status-normal'; 
    public remainingTime: string = '999';
    public timeToFire: string;
    public startTimeDisplay: string;
    public startTime: number;
        
    public validForm: boolean;
    public timerLengthHelp: string = "Time in minutes to add.";
    public nameInputHelp: string = 'Add name of the additive.';
    public nameStatusStyle: string = 'text-muted status-normal';
    public timerStatusStyle: string = 'text-muted status-normal';
    private activeClass: string = '';
    private actionState: string = '';

    fb: FormBuilder;
    timeRowForm: FormGroup;

    private getTimerDelay(): number {
        let parentTimer = this.row.parentTimerLength * 60;
        let thisTimer = this.row.timerLength * 60;
        let value = parentTimer - thisTimer;
        return value;
    }

    public getTimeToFire(): void {
        let result = this.utils.formatTime(this.getTimerDelay());
        this.row.timeToFire = result;
    }

    @Output()
    rowDeleted: EventEmitter<TimeRowComponent> = new EventEmitter();

    deleteRow(row: TimeRowComponent):void {
        this.rowDeleted.emit();
    }

    @Output()
    timerCompleted: EventEmitter<TimeRowComponent> = new EventEmitter();
    timerComplete():void {
        this.timerCompleted.emit(this);
        this.activeClass = '';
        this.actionState = 'completed';
    }

    @Output()
    formInvalid: EventEmitter<boolean> = new EventEmitter();

    setTimeToFire(currentTime: number) {
        this.row.timeToFire = this.utils.formatTime(currentTime);
    }

    @Output()
    public startTimer(): boolean {        
        let currentTime = (this.row.parentTimerLength - this.row.timerLength) * 60;
        this.row.timeToFire = this.utils.formatTime(currentTime);
        
        let timer = TimerObservable.create(0, 1000);

        let subscription = timer.subscribe(t => {
            currentTime--;
            this.setTimeToFire(currentTime);
            
            this.row.timerCss = 'status-normal';
            this.activeClass = 'active-start';

            if (currentTime < (5 * 60)) {
                this.row.timerCss = 'status-five-minutes';
                this.activeClass = 'active-five';
            }

            if (currentTime < (1 * 60)) {
                this.row.timerCss = 'status-one-minute';
                this.activeClass = 'active-one';
            }

            if (currentTime === 0) {
                this.row.timerCss = 'status-complete';
                this.voiceService.speak(this.row.name);
                subscription.unsubscribe();
                this.timerComplete();
                return true;
            }
            
            return false;
        })

        return false;
    }
    
    public stopTimer(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private formatTime(seconds: number): string {
        return this.utils.formatTime(seconds);
    }

    public getFormValidity() {
        //var retVal = this.timerForm.valid;
        //if (!retVal) {
        //    retVal = false;
        //}
        //return retVal;
    }
   
    subscribeToFormChanges() {
        //const formValueChanges$ = this.timerForm.valueChanges;
        //formValueChanges$.subscribe(x => function () {
        //    this.validForm = this.timerForm.valid;
        //    this.formInvalid.emit();
        //});
    }

    buildForm(): void {
        this.timeRowForm = this.fb.group({
            'nameInput': [this.row.name, [
                Validators.required
            ]
            ],
            'timerLengthInput': [this.row.timerLength, [
                Validators.required,
                Validators.pattern(/^\d+$/)
            ]
            ]
        });

        this.timeRowForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onValueChanged(data?: any) {
        if (!this.timeRowForm) { return; }
        const form = this.timeRowForm;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                    this.formInvalid.emit(false);
                }
            }
        }
    }

    formErrors = { 'nameInput': '', 'timerLengthInput': '' }

    validationMessages = {
        'nameInput': {
            'required': 'Additive name is required'
        },
        'timerLengthInput': {
            'required': 'When does this timer hit?',
            'pattern': 'Only use numbers'
        }
    }

    ngOnInit() {
        this.getTimeToFire();
        this.buildForm();
        this.actionState = 'active'
        this.row.validForm = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        let c = changes;
    }

    ngDoCheck() {
        //let nameValid = this.timerForm.controls['nameInput'].valid;
        //if (!nameValid) {
        //    this.nameInputHelp = 'Add additive name.';
        //    this.nameStatusStyle = 'status-error';
        //} else {
        //    this.nameInputHelp = 'Name of the additive.';
        //    this.nameStatusStyle = 'text-muted status-normal';            
        //}

        //let timerValid = this.timerForm.controls['timerLengthInput'].valid;
        //if (!timerValid) {
        //    this.timerLengthHelp = 'Please add a valid number';
        //    this.timerStatusStyle = 'status-error';
        //} else {
        //    this.timerLengthHelp = 'Time in minutes to add.';
        //    this.timerStatusStyle = 'text-muted status-normal';            
        //}

        //let isValid = nameValid === true && timerValid === true;
        //this.row.validForm = isValid;
        //this.formInvalid.emit();
    }

    ngOnDestroy() {        
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }
    
    constructor(
        public model: TimerRowModel,
        private timerService: BrewTimerService,
        public voiceService: VoiceService
    ){
        this.baseSeconds = model.baseSeconds; 
        this.utils = new Utilities();
        this.fb = new FormBuilder();        
    }
}
