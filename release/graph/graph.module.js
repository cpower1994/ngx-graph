var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { GraphComponent } from './graph.component';
import { ChartCommonModule } from '@swimlane/ngx-charts';
import { MouseWheelDirective } from './mouse-wheel.directive';
import { LayoutService } from './layouts/layout.service';
export { GraphComponent };
var GraphModule = /** @class */ (function () {
    function GraphModule() {
    }
    GraphModule = __decorate([
        NgModule({
            imports: [ChartCommonModule],
            declarations: [GraphComponent, MouseWheelDirective],
            exports: [GraphComponent, MouseWheelDirective],
            providers: [LayoutService]
        })
    ], GraphModule);
    return GraphModule;
}());
export { GraphModule };
//# sourceMappingURL=graph.module.js.map