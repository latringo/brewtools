import { NgModule, OnInit, OnDestroy } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { BrewTimerComponent } from '../components/brewtimer/brewtimer.component';
import { HomeComponent } from '../components/home/home.component';
import { PageNotFoundComponent } from '../components/utilities/not-found.component';
import 'rxjs/add/operator/switchMap';

const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: 'brewtimer', component: BrewTimerComponent },
    { path: 'home', redirectTo: '' },
    { path: '**', component: PageNotFoundComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class BrewingRouting implements OnInit, OnDestroy{
    pageTitle: string;
    sub: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ){}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let p = params["path"];
            this.pageTitle = p;
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
};