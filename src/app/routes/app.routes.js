"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var brewtimer_component_1 = require("../components/brewtimer/brewtimer.component");
var not_found_component_1 = require("../components/utilities/not-found.component");
require("rxjs/add/operator/switchMap");
var routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: 'brewtimer', component: brewtimer_component_1.BrewTimerComponent },
    { path: 'home', redirectTo: '' },
    { path: '**', component: not_found_component_1.PageNotFoundComponent }
];
var BrewingRouting = (function () {
    function BrewingRouting(route, router) {
        this.route = route;
        this.router = router;
    }
    BrewingRouting.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var p = params["path"];
            _this.pageTitle = p;
        });
    };
    BrewingRouting.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    return BrewingRouting;
}());
BrewingRouting = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router])
], BrewingRouting);
exports.BrewingRouting = BrewingRouting;
;
//# sourceMappingURL=app.routes.js.map