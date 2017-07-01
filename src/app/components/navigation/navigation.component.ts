import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { BrewTimerComponent } from '../brewtimer/brewtimer.component';
import { BrewTimerService } from '../../services/brewtimer.service';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Utilities } from '../utilities/utilities.component';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'brew-navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['navigation.component.css']
})


export class NavigationComponent implements OnDestroy, OnInit { 
    public startTimeDisplay: string;
    public totalTime: number;
    private currentTime: string;

    @Input()
    brewStartTime: string;

    @Input()
    brewEndTime: string;

    @Input()
    public currentRouteDisplay: string;

    private subscription: Subscription;
    
    private startCurrentTimer(): void {
        let utils = new Utilities();
        let current = moment();
        let timer = TimerObservable.create(0, 1000);
        this.subscription = timer.subscribe(t => {
            this.currentTime = current.add(1, 'seconds').format('dddd, MMMM Do YYYY, h:mm:ss a');
        });
    }

    selected = '';
    items=[
        { text: 'Home', routerLink: 'home', routerLinkActive: 'active' },
        { text: 'Brew Timers', routerLink: 'brewtimer', routerLinkActive: 'active' },
        { text: 'Settings', routerLink: 'settings', routerLinkActive: 'active' },            
        { text: 'Sign Out', routerLink: 'logout', routerLinkActive: 'active' }

    ];



    select(text: string) {
        this.selected = text;
        this.currentRouteDisplay = text;
    }

    public menutoggle: string = 'menu-hide';

    public toggleMenu(): void {
        if (this.menutoggle === 'menu-hide') {
            this.menutoggle = 'menu-show';
        } else {
            this.menutoggle = 'menu-hide';
        }
    }

    ngOnInit() {
        this.startCurrentTimer();
        this.timerService.displayCurrentName('Home');
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    constructor(private timerService: BrewTimerService) {
        
        this.timerService.currentName$.subscribe(name => {
            this.currentRouteDisplay = name;
        });

        //timerService.brewStartTime$.subscribe(time => {
        //    this.brewStartTime = time;
        //});

        //timerService.brewEndTime$.subscribe(time => {
        //    this.brewEndTime = time;
        //});
    }
}