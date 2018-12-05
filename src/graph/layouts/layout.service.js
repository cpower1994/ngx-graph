"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var dagre_1 = require('./dagre');
var dagreCluster_1 = require('./dagreCluster');
var dagreNodesOnly_1 = require('./dagreNodesOnly');
var layouts = {
    dagre: dagre_1.DagreLayout,
    dagreCluster: dagreCluster_1.DagreClusterLayout,
    dagreNodesOnly: dagreNodesOnly_1.DagreNodesOnlyLayout
};
var LayoutService = (function () {
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
        core_1.Injectable()
    ], LayoutService);
    return LayoutService;
}());
exports.LayoutService = LayoutService;
//# sourceMappingURL=layout.service.js.map