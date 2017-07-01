import { Component, Injectable, Optional } from '@angular/core';
import { WindowRef } from './window-ref.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class VoiceService {
    constructor(      
        private winRef: WindowRef        
    ){}

    speak(text: string):void{
        let win = this.winRef.nativeWindow;
        if(win.speechSynthesis){
            let synth = win.speechSynthesis;
            let voiceMsg = 'time to add ' + text;
            let message = new win.SpeechSynthesisUtterance(voiceMsg);
            localStorage.removeItem('brew-tools-voice-id');
            let voices = win.speechSynthesis.getVoices();
            let voiceId = this.getVoiceId();
            message.voice = voices[voiceId];
            synth.speak(message);
        }
    }

    getVoiceId():number{
        let voiceId = localStorage.getItem('brew-tools-voice-id');
        if(!voiceId){
            localStorage.setItem('brew-tools-voice-id', '3');
        }
        var val = parseInt(localStorage.getItem('brew-tools-voice-id'));
        if(!isNaN(val)){
            return val;
        }
        return 3;
    }
}
