import { Component, Input, Output, Injectable } from '@angular/core';
import * as moment from 'moment';

declare var momentFormat: any;

@Injectable()
export class Utilities { 
    
    formatTime(counter: number):string{
        let date = new Date(counter * 1000);
        let hh:any = date.getUTCHours();
        let mm:any = date.getUTCMinutes();
        let ss:any = date.getSeconds();
        
        if (hh < 10) { hh = "0" + hh };
        if (mm < 10) { mm = "0" + mm };
        if (ss < 10) { ss = "0" + ss };
        var time = hh + ":" + mm + ":" + ss;
        return time;
    }

    formatSessionTime(counter: number):string{
        return this.formatTime(counter);
    }

    formatAdditiveTime(counter: number): string {
        return this.formatTime(counter);
    }

    formatRemainingTime(seconds: number, startTime: Date): string{
        let retVal = '';
        let startSeconds = startTime.getSeconds();
        let timeRemaining = startSeconds - seconds;
        retVal = moment(timeRemaining).format('h:mm:ss a');
        retVal = timeRemaining.toString();
        return retVal;
    }

    formatRemainingSessionTime(remainingTime: number, startTime: Date): string {
        let sTime = moment(startTime).unix();
        let currentTime = moment().unix();
        let diffTime = sTime - currentTime;
        let duration = moment.duration(diffTime, 'seconds');
        let newDuration = moment.duration(duration.asSeconds() - remainingTime, 'seconds');
        let h = moment.duration(newDuration).hours();
        let m = moment.duration(newDuration).minutes();
        let s = moment.duration(newDuration).seconds();
        let hDisplay = h.toString().trim().length === 1 ? '0' + h.toString() : h.toString();
        let mDisplay = m.toString().trim().length === 1 ? '0' + m.toString() : m.toString();
        let sDisplay = s.toString().trim().length === 1 ? '0' + s.toString() : s.toString();
        return hDisplay + ':' + mDisplay + ':' + sDisplay;

        //http://stackoverflow.com/questions/36461089/time-countdown-in-angular-2
        //let currentTime = moment().unix();
        //let diffTime:any = startTime - currentTime;

        //let timeDisplay = currentTime.format('H:mm:ss');
        //return timeDisplay;
        //let sessionDuration = moment.duration(baseSeconds, 'seconds');
        //let timeDisplay = sessionDuration.subtract(remainingTime);
        //return moment(timeDisplay.asSeconds()).format('H:mm:ss');//.toString();            
    }

   constructor(){}
}