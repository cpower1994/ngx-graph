var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { DagreLayout } from './dagre';
import { DagreClusterLayout } from './dagreCluster';
import { DagreNodesOnlyLayout } from './dagreNodesOnly';
var layouts = {
    dagre: DagreLayout,
    dagreCluster: DagreClusterLayout,
    dagreNodesOnly: DagreNodesOnlyLayout,
};
var LayoutService = /** @class */ (function () {
    function LayoutService() {
    }
    LayoutService.prototype.getLayout = function (name) {
        if (layouts[name]) {
            return new layouts[name]();
        }
        else {
            throw new Error("Unknown layout type '" + name + "'");
        }
    };
    LayoutService = __decorate([
        Injectable()
    ], LayoutService);
    return LayoutService;
}());
export { LayoutService };
//# sourceMappingURL=layout.service.js.map