(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('dagre'), require('d3-force'), require('rxjs'), require('webcola'), require('d3-dispatch'), require('d3-timer'), require('@angular/core'), require('@angular/animations'), require('@swimlane/ngx-charts'), require('d3-selection'), require('d3-shape'), require('d3-transition'), require('rxjs/operators'), require('transformation-matrix')) :
    typeof define === 'function' && define.amd ? define('@swimlane/ngx-graph', ['exports', 'dagre', 'd3-force', 'rxjs', 'webcola', 'd3-dispatch', 'd3-timer', '@angular/core', '@angular/animations', '@swimlane/ngx-charts', 'd3-selection', 'd3-shape', 'd3-transition', 'rxjs/operators', 'transformation-matrix'], factory) :
    (factory((global.swimlane = global.swimlane || {}, global.swimlane['ngx-graph'] = {}),null,null,global.rxjs,null,null,null,global.ng.core,global.ng.animations,null,null,null,null,global.rxjs.operators,null));
}(this, (function (exports,dagre,d3Force,rxjs,webcola,d3Dispatch,d3Timer,core,animations,ngxCharts,d3Selection,shape,d3Transition,operators,transformationMatrix) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var cache = {};
    /**
     * Generates a short id.
     *
     * @return {?}
     */
    function id() {
        /** @type {?} */
        var newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
        newId = "a" + newId;
        // ensure not already used
        if (!cache[newId]) {
            cache[newId] = true;
            return newId;
        }
        return id();
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var Orientation = {
        LEFT_TO_RIGHT: 'LR',
        RIGHT_TO_LEFT: 'RL',
        TOP_TO_BOTTOM: 'TB',
        BOTTOM_TO_TOM: 'BT',
    };
    var DagreLayout = /** @class */ (function () {
        function DagreLayout() {
            this.defaultSettings = {
                orientation: Orientation.LEFT_TO_RIGHT,
                marginX: 20,
                marginY: 20,
                edgePadding: 100,
                rankPadding: 100,
                nodePadding: 50,
                multigraph: true,
                compound: true
            };
            this.settings = {};
        }
        /**
         * @param {?} graph
         * @return {?}
         */
        DagreLayout.prototype.run = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                this.createDagreGraph(graph);
                dagre.layout(this.dagreGraph);
                graph.edgeLabels = this.dagreGraph._edgeLabels;
                var _loop_1 = function (dagreNodeId) {
                    /** @type {?} */
                    var dagreNode = this_1.dagreGraph._nodes[dagreNodeId];
                    /** @type {?} */
                    var node = graph.nodes.find(function (n) { return n.id === dagreNode.id; });
                    node.position = {
                        x: dagreNode.x,
                        y: dagreNode.y
                    };
                    node.dimension = {
                        width: dagreNode.width,
                        height: dagreNode.height
                    };
                };
                var this_1 = this;
                for (var dagreNodeId in this.dagreGraph._nodes) {
                    _loop_1(dagreNodeId);
                }
                return graph;
            };
        /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
        DagreLayout.prototype.updateEdge = /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
            function (graph, edge) {
                /** @type {?} */
                var sourceNode = graph.nodes.find(function (n) { return n.id === edge.source; });
                /** @type {?} */
                var targetNode = graph.nodes.find(function (n) { return n.id === edge.target; });
                // determine new arrow position
                /** @type {?} */
                var dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
                /** @type {?} */
                var startingPoint = {
                    x: sourceNode.position.x,
                    y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
                };
                /** @type {?} */
                var endingPoint = {
                    x: targetNode.position.x,
                    y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
                };
                // generate new points
                edge.points = [startingPoint, endingPoint];
                return graph;
            };
        /**
         * @param {?} graph
         * @return {?}
         */
        DagreLayout.prototype.createDagreGraph = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                var e_1, _a, e_2, _b;
                /** @type {?} */
                var settings = Object.assign({}, this.defaultSettings, this.settings);
                this.dagreGraph = new dagre.graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
                this.dagreGraph.setGraph({
                    rankdir: settings.orientation,
                    marginx: settings.marginX,
                    marginy: settings.marginY,
                    edgesep: settings.edgePadding,
                    ranksep: settings.rankPadding,
                    nodesep: settings.nodePadding,
                    align: settings.align,
                    acyclicer: settings.acyclicer,
                    ranker: settings.ranker,
                    multigraph: settings.multigraph,
                    compound: settings.compound
                });
                // Default to assigning a new object as a label for each new edge.
                this.dagreGraph.setDefaultEdgeLabel(function () {
                    return {
                    /* empty */
                    };
                });
                this.dagreNodes = graph.nodes.map(function (n) {
                    /** @type {?} */
                    var node = Object.assign({}, n);
                    node.width = n.dimension.width;
                    node.height = n.dimension.height;
                    node.x = n.position.x;
                    node.y = n.position.y;
                    return node;
                });
                this.dagreEdges = graph.edges.map(function (l) {
                    /** @type {?} */
                    var newLink = Object.assign({}, l);
                    if (!newLink.id) {
                        newLink.id = id();
                    }
                    return newLink;
                });
                try {
                    for (var _c = __values(this.dagreNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var node = _d.value;
                        if (!node.width) {
                            node.width = 20;
                        }
                        if (!node.height) {
                            node.height = 30;
                        }
                        // update dagre
                        this.dagreGraph.setNode(node.id, node);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return))
                            _a.call(_c);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                try {
                    // update dagre
                    for (var _e = __values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var edge = _f.value;
                        if (settings.multigraph) {
                            this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
                        }
                        else {
                            this.dagreGraph.setEdge(edge.source, edge.target);
                        }
                    }
                }
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return))
                            _b.call(_e);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
                }
                return this.dagreGraph;
            };
        return DagreLayout;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var DagreClusterLayout = /** @class */ (function () {
        function DagreClusterLayout() {
            this.defaultSettings = {
                orientation: Orientation.LEFT_TO_RIGHT,
                marginX: 20,
                marginY: 20,
                edgePadding: 100,
                rankPadding: 100,
                nodePadding: 50,
                multigraph: true,
                compound: true
            };
            this.settings = {};
        }
        /**
         * @param {?} graph
         * @return {?}
         */
        DagreClusterLayout.prototype.run = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                var _this = this;
                this.createDagreGraph(graph);
                dagre.layout(this.dagreGraph);
                graph.edgeLabels = this.dagreGraph._edgeLabels;
                /** @type {?} */
                var dagreToOutput = function (node) {
                    /** @type {?} */
                    var dagreNode = _this.dagreGraph._nodes[node.id];
                    return __assign({}, node, { position: {
                            x: dagreNode.x,
                            y: dagreNode.y
                        }, dimension: {
                            width: dagreNode.width,
                            height: dagreNode.height
                        } });
                };
                graph.clusters = (graph.clusters || []).map(dagreToOutput);
                graph.nodes = graph.nodes.map(dagreToOutput);
                return graph;
            };
        /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
        DagreClusterLayout.prototype.updateEdge = /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
            function (graph, edge) {
                /** @type {?} */
                var sourceNode = graph.nodes.find(function (n) { return n.id === edge.source; });
                /** @type {?} */
                var targetNode = graph.nodes.find(function (n) { return n.id === edge.target; });
                // determine new arrow position
                /** @type {?} */
                var dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
                /** @type {?} */
                var startingPoint = {
                    x: sourceNode.position.x,
                    y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
                };
                /** @type {?} */
                var endingPoint = {
                    x: targetNode.position.x,
                    y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
                };
                // generate new points
                edge.points = [startingPoint, endingPoint];
                return graph;
            };
        /**
         * @param {?} graph
         * @return {?}
         */
        DagreClusterLayout.prototype.createDagreGraph = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                var _this = this;
                var e_1, _a, e_2, _b, e_3, _c;
                /** @type {?} */
                var settings = Object.assign({}, this.defaultSettings, this.settings);
                this.dagreGraph = new dagre.graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
                this.dagreGraph.setGraph({
                    rankdir: settings.orientation,
                    marginx: settings.marginX,
                    marginy: settings.marginY,
                    edgesep: settings.edgePadding,
                    ranksep: settings.rankPadding,
                    nodesep: settings.nodePadding,
                    align: settings.align,
                    acyclicer: settings.acyclicer,
                    ranker: settings.ranker,
                    multigraph: settings.multigraph,
                    compound: settings.compound
                });
                // Default to assigning a new object as a label for each new edge.
                this.dagreGraph.setDefaultEdgeLabel(function () {
                    return {
                    /* empty */
                    };
                });
                this.dagreNodes = graph.nodes.map(function (n) {
                    /** @type {?} */
                    var node = Object.assign({}, n);
                    node.width = n.dimension.width;
                    node.height = n.dimension.height;
                    node.x = n.position.x;
                    node.y = n.position.y;
                    return node;
                });
                this.dagreClusters = graph.clusters || [];
                this.dagreEdges = graph.edges.map(function (l) {
                    /** @type {?} */
                    var newLink = Object.assign({}, l);
                    if (!newLink.id) {
                        newLink.id = id();
                    }
                    return newLink;
                });
                try {
                    for (var _d = __values(this.dagreNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var node = _e.value;
                        this.dagreGraph.setNode(node.id, node);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return))
                            _a.call(_d);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                var _loop_1 = function (cluster) {
                    this_1.dagreGraph.setNode(cluster.id, cluster);
                    cluster.childNodeIds.forEach(function (childNodeId) {
                        _this.dagreGraph.setParent(childNodeId, cluster.id);
                    });
                };
                var this_1 = this;
                try {
                    for (var _f = __values(this.dagreClusters), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var cluster = _g.value;
                        _loop_1(cluster);
                    }
                }
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return))
                            _b.call(_f);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
                }
                try {
                    // update dagre
                    for (var _h = __values(this.dagreEdges), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var edge = _j.value;
                        if (settings.multigraph) {
                            this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
                        }
                        else {
                            this.dagreGraph.setEdge(edge.source, edge.target);
                        }
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_j && !_j.done && (_c = _h.return))
                            _c.call(_h);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
                }
                return this.dagreGraph;
            };
        return DagreClusterLayout;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var Orientation$1 = {
        LEFT_TO_RIGHT: 'LR',
        RIGHT_TO_LEFT: 'RL',
        TOP_TO_BOTTOM: 'TB',
        BOTTOM_TO_TOM: 'BT',
    };
    /** @type {?} */
    var DEFAULT_EDGE_NAME = '\x00';
    /** @type {?} */
    var EDGE_KEY_DELIM = '\x01';
    var DagreNodesOnlyLayout = /** @class */ (function () {
        function DagreNodesOnlyLayout() {
            this.defaultSettings = {
                orientation: Orientation$1.LEFT_TO_RIGHT,
                marginX: 20,
                marginY: 20,
                edgePadding: 100,
                rankPadding: 100,
                nodePadding: 50,
                curveDistance: 20,
                multigraph: true,
                compound: true
            };
            this.settings = {};
        }
        /**
         * @param {?} graph
         * @return {?}
         */
        DagreNodesOnlyLayout.prototype.run = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                var e_1, _a;
                this.createDagreGraph(graph);
                dagre.layout(this.dagreGraph);
                graph.edgeLabels = this.dagreGraph._edgeLabels;
                var _loop_1 = function (dagreNodeId) {
                    /** @type {?} */
                    var dagreNode = this_1.dagreGraph._nodes[dagreNodeId];
                    /** @type {?} */
                    var node = graph.nodes.find(function (n) { return n.id === dagreNode.id; });
                    node.position = {
                        x: dagreNode.x,
                        y: dagreNode.y
                    };
                    node.dimension = {
                        width: dagreNode.width,
                        height: dagreNode.height
                    };
                };
                var this_1 = this;
                for (var dagreNodeId in this.dagreGraph._nodes) {
                    _loop_1(dagreNodeId);
                }
                try {
                    for (var _b = __values(graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var edge = _c.value;
                        this.updateEdge(graph, edge);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                return graph;
            };
        /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
        DagreNodesOnlyLayout.prototype.updateEdge = /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
            function (graph, edge) {
                var _a, _b, _c, _d;
                /** @type {?} */
                var sourceNode = graph.nodes.find(function (n) { return n.id === edge.source; });
                /** @type {?} */
                var targetNode = graph.nodes.find(function (n) { return n.id === edge.target; });
                /** @type {?} */
                var rankAxis = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x';
                /** @type {?} */
                var orderAxis = rankAxis === 'y' ? 'x' : 'y';
                /** @type {?} */
                var rankDimension = rankAxis === 'y' ? 'height' : 'width';
                // determine new arrow position
                /** @type {?} */
                var dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
                /** @type {?} */
                var startingPoint = (_a = {},
                    _a[orderAxis] = sourceNode.position[orderAxis],
                    _a[rankAxis] = sourceNode.position[rankAxis] - dir * (sourceNode.dimension[rankDimension] / 2),
                    _a);
                /** @type {?} */
                var endingPoint = (_b = {},
                    _b[orderAxis] = targetNode.position[orderAxis],
                    _b[rankAxis] = targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2),
                    _b);
                /** @type {?} */
                var curveDistance = this.settings.curveDistance || this.defaultSettings.curveDistance;
                // generate new points
                edge.points = [
                    startingPoint,
                    (_c = {},
                        _c[orderAxis] = startingPoint[orderAxis],
                        _c[rankAxis] = startingPoint[rankAxis] - dir * curveDistance,
                        _c),
                    (_d = {},
                        _d[orderAxis] = endingPoint[orderAxis],
                        _d[rankAxis] = endingPoint[rankAxis] + dir * curveDistance,
                        _d),
                    endingPoint
                ];
                /** @type {?} */
                var edgeLabelId = "" + edge.source + EDGE_KEY_DELIM + edge.target + EDGE_KEY_DELIM + DEFAULT_EDGE_NAME;
                /** @type {?} */
                var matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
                if (matchingEdgeLabel) {
                    matchingEdgeLabel.points = edge.points;
                }
                return graph;
            };
        /**
         * @param {?} graph
         * @return {?}
         */
        DagreNodesOnlyLayout.prototype.createDagreGraph = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                var e_2, _a, e_3, _b;
                /** @type {?} */
                var settings = Object.assign({}, this.defaultSettings, this.settings);
                this.dagreGraph = new dagre.graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
                this.dagreGraph.setGraph({
                    rankdir: settings.orientation,
                    marginx: settings.marginX,
                    marginy: settings.marginY,
                    edgesep: settings.edgePadding,
                    ranksep: settings.rankPadding,
                    nodesep: settings.nodePadding,
                    align: settings.align,
                    acyclicer: settings.acyclicer,
                    ranker: settings.ranker,
                    multigraph: settings.multigraph,
                    compound: settings.compound
                });
                // Default to assigning a new object as a label for each new edge.
                this.dagreGraph.setDefaultEdgeLabel(function () {
                    return {
                    /* empty */
                    };
                });
                this.dagreNodes = graph.nodes.map(function (n) {
                    /** @type {?} */
                    var node = Object.assign({}, n);
                    node.width = n.dimension.width;
                    node.height = n.dimension.height;
                    node.x = n.position.x;
                    node.y = n.position.y;
                    return node;
                });
                this.dagreEdges = graph.edges.map(function (l) {
                    /** @type {?} */
                    var newLink = Object.assign({}, l);
                    if (!newLink.id) {
                        newLink.id = id();
                    }
                    return newLink;
                });
                try {
                    for (var _c = __values(this.dagreNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var node = _d.value;
                        if (!node.width) {
                            node.width = 20;
                        }
                        if (!node.height) {
                            node.height = 30;
                        }
                        // update dagre
                        this.dagreGraph.setNode(node.id, node);
                    }
                }
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return))
                            _a.call(_c);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
                }
                try {
                    // update dagre
                    for (var _e = __values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var edge = _f.value;
                        if (settings.multigraph) {
                            this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
                        }
                        else {
                            this.dagreGraph.setEdge(edge.source, edge.target);
                        }
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return))
                            _b.call(_e);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
                }
                return this.dagreGraph;
            };
        return DagreNodesOnlyLayout;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @param {?} maybeNode
     * @return {?}
     */
    function toD3Node(maybeNode) {
        if (typeof maybeNode === 'string') {
            return {
                id: maybeNode,
                x: 0,
                y: 0
            };
        }
        return maybeNode;
    }
    var D3ForceDirectedLayout = /** @class */ (function () {
        function D3ForceDirectedLayout() {
            this.defaultSettings = {
                force: d3Force.forceSimulation()
                    .force('charge', d3Force.forceManyBody().strength(-150))
                    .force('collide', d3Force.forceCollide(5)),
                forceLink: d3Force.forceLink()
                    .id(function (node) { return node.id; })
                    .distance(function () { return 100; })
            };
            this.settings = {};
            this.outputGraph$ = new rxjs.Subject();
        }
        /**
         * @param {?} graph
         * @return {?}
         */
        D3ForceDirectedLayout.prototype.run = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                var _this = this;
                this.inputGraph = graph;
                this.d3Graph = {
                    nodes: ( /** @type {?} */(__spread(this.inputGraph.nodes.map(function (n) { return (__assign({}, n)); })))),
                    edges: ( /** @type {?} */(__spread(this.inputGraph.edges.map(function (e) { return (__assign({}, e)); }))))
                };
                this.outputGraph = {
                    nodes: [],
                    edges: [],
                    edgeLabels: []
                };
                this.outputGraph$.next(this.outputGraph);
                this.settings = Object.assign({}, this.defaultSettings, this.settings);
                if (this.settings.force) {
                    this.settings.force
                        .nodes(this.d3Graph.nodes)
                        .force('link', this.settings.forceLink.links(this.d3Graph.edges))
                        .alpha(0.5)
                        .restart()
                        .on('tick', function () {
                        _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
                    });
                }
                return this.outputGraph$.asObservable();
            };
        /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
        D3ForceDirectedLayout.prototype.updateEdge = /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
            function (graph, edge) {
                var _this = this;
                /** @type {?} */
                var settings = Object.assign({}, this.defaultSettings, this.settings);
                if (settings.force) {
                    settings.force
                        .nodes(this.d3Graph.nodes)
                        .force('link', settings.forceLink.links(this.d3Graph.edges))
                        .alpha(0.5)
                        .restart()
                        .on('tick', function () {
                        _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
                    });
                }
                return this.outputGraph$.asObservable();
            };
        /**
         * @param {?} d3Graph
         * @return {?}
         */
        D3ForceDirectedLayout.prototype.d3GraphToOutputGraph = /**
         * @param {?} d3Graph
         * @return {?}
         */
            function (d3Graph) {
                this.outputGraph.nodes = this.d3Graph.nodes.map(function (node) {
                    return (__assign({}, node, { id: node.id || id(), position: {
                            x: node.x,
                            y: node.y
                        }, dimension: {
                            width: (node.dimension && node.dimension.width) || 20,
                            height: (node.dimension && node.dimension.height) || 20
                        }, transform: "translate(" + (node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0) + ", " + (node.y -
                            ((node.dimension && node.dimension.height) || 20) / 2 || 0) + ")" }));
                });
                this.outputGraph.edges = this.d3Graph.edges.map(function (edge) {
                    return (__assign({}, edge, { source: toD3Node(edge.source).id, target: toD3Node(edge.target).id, points: [
                            {
                                x: toD3Node(edge.source).x,
                                y: toD3Node(edge.source).y
                            },
                            {
                                x: toD3Node(edge.target).x,
                                y: toD3Node(edge.target).y
                            }
                        ] }));
                });
                this.outputGraph.edgeLabels = this.outputGraph.edges;
                return this.outputGraph;
            };
        /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
        D3ForceDirectedLayout.prototype.onDragStart = /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
            function (draggingNode, $event) {
                this.settings.force.alphaTarget(0.3).restart();
                /** @type {?} */
                var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
                if (!node) {
                    return;
                }
                this.draggingStart = { x: $event.x - node.x, y: $event.y - node.y };
                node.fx = $event.x - this.draggingStart.x;
                node.fy = $event.y - this.draggingStart.y;
            };
        /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
        D3ForceDirectedLayout.prototype.onDrag = /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
            function (draggingNode, $event) {
                if (!draggingNode) {
                    return;
                }
                /** @type {?} */
                var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
                if (!node) {
                    return;
                }
                node.fx = $event.x - this.draggingStart.x;
                node.fy = $event.y - this.draggingStart.y;
            };
        /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
        D3ForceDirectedLayout.prototype.onDragEnd = /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
            function (draggingNode, $event) {
                if (!draggingNode) {
                    return;
                }
                /** @type {?} */
                var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
                if (!node) {
                    return;
                }
                this.settings.force.alphaTarget(0);
                node.fx = undefined;
                node.fy = undefined;
            };
        return D3ForceDirectedLayout;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @param {?} nodes
     * @param {?} nodeRef
     * @return {?}
     */
    function toNode(nodes, nodeRef) {
        if (typeof nodeRef === 'number') {
            return nodes[nodeRef];
        }
        return nodeRef;
    }
    var ColaForceDirectedLayout = /** @class */ (function () {
        function ColaForceDirectedLayout() {
            this.defaultSettings = {
                force: webcola.d3adaptor(__assign({}, d3Dispatch, d3Force, d3Timer))
                    .linkDistance(150)
                    .avoidOverlaps(true),
                viewDimensions: {
                    width: 600,
                    height: 600,
                    xOffset: 0
                }
            };
            this.settings = {};
            this.outputGraph$ = new rxjs.Subject();
        }
        /**
         * @param {?} graph
         * @return {?}
         */
        ColaForceDirectedLayout.prototype.run = /**
         * @param {?} graph
         * @return {?}
         */
            function (graph) {
                var _this = this;
                this.inputGraph = graph;
                if (!this.inputGraph.clusters) {
                    this.inputGraph.clusters = [];
                }
                this.internalGraph = {
                    nodes: ( /** @type {?} */(__spread(this.inputGraph.nodes.map(function (n) { return (__assign({}, n, { width: n.dimension ? n.dimension.width : 20, height: n.dimension ? n.dimension.height : 20 })); })))),
                    groups: __spread(this.inputGraph.clusters.map(function (cluster) {
                        return ({
                            padding: 5,
                            groups: cluster.childNodeIds
                                .map(function (nodeId) { return ( /** @type {?} */(_this.inputGraph.clusters.findIndex(function (node) { return node.id === nodeId; }))); })
                                .filter(function (x) { return x >= 0; }),
                            leaves: cluster.childNodeIds
                                .map(function (nodeId) { return ( /** @type {?} */(_this.inputGraph.nodes.findIndex(function (node) { return node.id === nodeId; }))); })
                                .filter(function (x) { return x >= 0; })
                        });
                    })),
                    links: ( /** @type {?} */(__spread(this.inputGraph.edges
                        .map(function (e) {
                        /** @type {?} */
                        var sourceNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.source === node.id; });
                        /** @type {?} */
                        var targetNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.target === node.id; });
                        if (sourceNodeIndex === -1 || targetNodeIndex === -1) {
                            return undefined;
                        }
                        return __assign({}, e, { source: sourceNodeIndex, target: targetNodeIndex });
                    })
                        .filter(function (x) { return !!x; })))),
                    groupLinks: __spread(this.inputGraph.edges
                        .map(function (e) {
                        /** @type {?} */
                        var sourceNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.source === node.id; });
                        /** @type {?} */
                        var targetNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.target === node.id; });
                        if (sourceNodeIndex >= 0 && targetNodeIndex >= 0) {
                            return undefined;
                        }
                        return e;
                    })
                        .filter(function (x) { return !!x; }))
                };
                this.outputGraph = {
                    nodes: [],
                    clusters: [],
                    edges: [],
                    edgeLabels: []
                };
                this.outputGraph$.next(this.outputGraph);
                this.settings = Object.assign({}, this.defaultSettings, this.settings);
                if (this.settings.force) {
                    this.settings.force = this.settings.force
                        .nodes(this.internalGraph.nodes)
                        .groups(this.internalGraph.groups)
                        .links(this.internalGraph.links)
                        .alpha(0.5)
                        .on('tick', function () {
                        if (_this.settings.onTickListener) {
                            _this.settings.onTickListener(_this.internalGraph);
                        }
                        _this.outputGraph$.next(_this.internalGraphToOutputGraph(_this.internalGraph));
                    });
                    if (this.settings.viewDimensions) {
                        this.settings.force = this.settings.force.size([
                            this.settings.viewDimensions.width,
                            this.settings.viewDimensions.height
                        ]);
                    }
                    if (this.settings.forceModifierFn) {
                        this.settings.force = this.settings.forceModifierFn(this.settings.force);
                    }
                    this.settings.force.start();
                }
                return this.outputGraph$.asObservable();
            };
        /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
        ColaForceDirectedLayout.prototype.updateEdge = /**
         * @param {?} graph
         * @param {?} edge
         * @return {?}
         */
            function (graph, edge) {
                /** @type {?} */
                var settings = Object.assign({}, this.defaultSettings, this.settings);
                if (settings.force) {
                    settings.force.start();
                }
                return this.outputGraph$.asObservable();
            };
        /**
         * @param {?} internalGraph
         * @return {?}
         */
        ColaForceDirectedLayout.prototype.internalGraphToOutputGraph = /**
         * @param {?} internalGraph
         * @return {?}
         */
            function (internalGraph) {
                var _this = this;
                this.outputGraph.nodes = internalGraph.nodes.map(function (node) {
                    return (__assign({}, node, { id: node.id || id(), position: {
                            x: node.x,
                            y: node.y
                        }, dimension: {
                            width: (node.dimension && node.dimension.width) || 20,
                            height: (node.dimension && node.dimension.height) || 20
                        }, transform: "translate(" + (node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0) + ", " + (node.y -
                            ((node.dimension && node.dimension.height) || 20) / 2 || 0) + ")" }));
                });
                this.outputGraph.edges = internalGraph.links
                    .map(function (edge) {
                    /** @type {?} */
                    var source = toNode(internalGraph.nodes, edge.source);
                    /** @type {?} */
                    var target = toNode(internalGraph.nodes, edge.target);
                    return __assign({}, edge, { source: source.id, target: target.id, points: [
                            (( /** @type {?} */(source.bounds))).rayIntersection(target.bounds.cx(), target.bounds.cy()),
                            (( /** @type {?} */(target.bounds))).rayIntersection(source.bounds.cx(), source.bounds.cy())
                        ] });
                })
                    .concat(internalGraph.groupLinks.map(function (groupLink) {
                    /** @type {?} */
                    var sourceNode = internalGraph.nodes.find(function (foundNode) { return (( /** @type {?} */(foundNode))).id === groupLink.source; });
                    /** @type {?} */
                    var targetNode = internalGraph.nodes.find(function (foundNode) { return (( /** @type {?} */(foundNode))).id === groupLink.target; });
                    /** @type {?} */
                    var source = sourceNode || internalGraph.groups.find(function (foundGroup) { return (( /** @type {?} */(foundGroup))).id === groupLink.source; });
                    /** @type {?} */
                    var target = targetNode || internalGraph.groups.find(function (foundGroup) { return (( /** @type {?} */(foundGroup))).id === groupLink.target; });
                    return __assign({}, groupLink, { source: source.id, target: target.id, points: [
                            (( /** @type {?} */(source.bounds))).rayIntersection(target.bounds.cx(), target.bounds.cy()),
                            (( /** @type {?} */(target.bounds))).rayIntersection(source.bounds.cx(), source.bounds.cy())
                        ] });
                }));
                this.outputGraph.clusters = internalGraph.groups.map(function (group, index) {
                    /** @type {?} */
                    var inputGroup = _this.inputGraph.clusters[index];
                    return __assign({}, inputGroup, { dimension: {
                            width: group.bounds ? group.bounds.width() : 20,
                            height: group.bounds ? group.bounds.height() : 20
                        }, position: {
                            x: group.bounds ? group.bounds.x + group.bounds.width() / 2 : 0,
                            y: group.bounds ? group.bounds.y + group.bounds.height() / 2 : 0
                        } });
                });
                this.outputGraph.edgeLabels = this.outputGraph.edges;
                return this.outputGraph;
            };
        /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
        ColaForceDirectedLayout.prototype.onDragStart = /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
            function (draggingNode, $event) {
                /** @type {?} */
                var nodeIndex = this.outputGraph.nodes.findIndex(function (foundNode) { return foundNode.id === draggingNode.id; });
                /** @type {?} */
                var node = this.internalGraph.nodes[nodeIndex];
                if (!node) {
                    return;
                }
                this.draggingStart = { x: node.x - $event.x, y: node.y - $event.y };
                node.fixed = 1;
                this.settings.force.start();
            };
        /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
        ColaForceDirectedLayout.prototype.onDrag = /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
            function (draggingNode, $event) {
                if (!draggingNode) {
                    return;
                }
                /** @type {?} */
                var nodeIndex = this.outputGraph.nodes.findIndex(function (foundNode) { return foundNode.id === draggingNode.id; });
                /** @type {?} */
                var node = this.internalGraph.nodes[nodeIndex];
                if (!node) {
                    return;
                }
                node.x = this.draggingStart.x + $event.x;
                node.y = this.draggingStart.y + $event.y;
            };
        /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
        ColaForceDirectedLayout.prototype.onDragEnd = /**
         * @param {?} draggingNode
         * @param {?} $event
         * @return {?}
         */
            function (draggingNode, $event) {
                if (!draggingNode) {
                    return;
                }
                /** @type {?} */
                var nodeIndex = this.outputGraph.nodes.findIndex(function (foundNode) { return foundNode.id === draggingNode.id; });
                /** @type {?} */
                var node = this.internalGraph.nodes[nodeIndex];
                if (!node) {
                    return;
                }
                node.fixed = 0;
            };
        return ColaForceDirectedLayout;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var layouts = {
        dagre: DagreLayout,
        dagreCluster: DagreClusterLayout,
        dagreNodesOnly: DagreNodesOnlyLayout,
        d3ForceDirected: D3ForceDirectedLayout,
        colaForceDirected: ColaForceDirectedLayout
    };
    var LayoutService = /** @class */ (function () {
        function LayoutService() {
        }
        /**
         * @param {?} name
         * @return {?}
         */
        LayoutService.prototype.getLayout = /**
         * @param {?} name
         * @return {?}
         */
            function (name) {
                if (layouts[name]) {
                    return new layouts[name]();
                }
                else {
                    throw new Error("Unknown layout type '" + name + "'");
                }
            };
        LayoutService.decorators = [
            { type: core.Injectable },
        ];
        return LayoutService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GraphComponent = /** @class */ (function (_super) {
        __extends(GraphComponent, _super);
        function GraphComponent(el, zone, cd, layoutService) {
            var _this = _super.call(this, el, zone, cd) || this;
            _this.el = el;
            _this.zone = zone;
            _this.cd = cd;
            _this.layoutService = layoutService;
            _this.legend = false;
            _this.nodes = [];
            _this.clusters = [];
            _this.links = [];
            _this.activeEntries = [];
            _this.draggingEnabled = true;
            _this.panningEnabled = true;
            _this.enableZoom = true;
            _this.zoomSpeed = 0.1;
            _this.minZoomLevel = 0.1;
            _this.maxZoomLevel = 4.0;
            _this.autoZoom = false;
            _this.panOnZoom = true;
            _this.autoCenter = false;
            _this.activate = new core.EventEmitter();
            _this.deactivate = new core.EventEmitter();
            _this.zoomChange = new core.EventEmitter();
            _this.graphSubscription = new rxjs.Subscription();
            _this.subscriptions = [];
            _this.margin = [0, 0, 0, 0];
            _this.results = [];
            _this.isPanning = false;
            _this.isDragging = false;
            _this.initialized = false;
            _this.graphDims = { width: 0, height: 0 };
            _this._oldLinks = [];
            _this.transformationMatrix = transformationMatrix.identity();
            _this._touchLastX = null;
            _this._touchLastY = null;
            _this.groupResultsBy = function (node) { return node.label; };
            return _this;
        }
        Object.defineProperty(GraphComponent.prototype, "zoomLevel", {
            /**
             * Get the current zoom level
             */
            get: /**
             * Get the current zoom level
             * @return {?}
             */ function () {
                return this.transformationMatrix.a;
            },
            /**
             * Set the current zoom level
             */
            set: /**
             * Set the current zoom level
             * @param {?} level
             * @return {?}
             */ function (level) {
                this.zoomTo(Number(level));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphComponent.prototype, "panOffsetX", {
            /**
             * Get the current `x` position of the graph
             */
            get: /**
             * Get the current `x` position of the graph
             * @return {?}
             */ function () {
                return this.transformationMatrix.e;
            },
            /**
             * Set the current `x` position of the graph
             */
            set: /**
             * Set the current `x` position of the graph
             * @param {?} x
             * @return {?}
             */ function (x) {
                this.panTo(Number(x), null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphComponent.prototype, "panOffsetY", {
            /**
             * Get the current `y` position of the graph
             */
            get: /**
             * Get the current `y` position of the graph
             * @return {?}
             */ function () {
                return this.transformationMatrix.f;
            },
            /**
             * Set the current `y` position of the graph
             */
            set: /**
             * Set the current `y` position of the graph
             * @param {?} y
             * @return {?}
             */ function (y) {
                this.panTo(null, Number(y));
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Angular lifecycle event
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Angular lifecycle event
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.ngOnInit = /**
         * Angular lifecycle event
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.update$) {
                    this.subscriptions.push(this.update$.subscribe(function () {
                        _this.update();
                    }));
                }
                if (this.center$) {
                    this.subscriptions.push(this.center$.subscribe(function () {
                        _this.center();
                    }));
                }
                if (this.zoomToFit$) {
                    this.subscriptions.push(this.zoomToFit$.subscribe(function () {
                        _this.zoomToFit();
                    }));
                }
                if (this.panToNode$) {
                    this.subscriptions.push(this.panToNode$.subscribe(function (nodeId) {
                        _this.panToNodeId(nodeId);
                    }));
                }
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        GraphComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                var layout = changes.layout, layoutSettings = changes.layoutSettings, nodes = changes.nodes, clusters = changes.clusters, links = changes.links;
                this.setLayout(this.layout);
                if (layoutSettings) {
                    this.setLayoutSettings(this.layoutSettings);
                }
                this.update();
            };
        /**
         * @param {?} layout
         * @return {?}
         */
        GraphComponent.prototype.setLayout = /**
         * @param {?} layout
         * @return {?}
         */
            function (layout) {
                this.initialized = false;
                if (!layout) {
                    layout = 'dagre';
                }
                if (typeof layout === 'string') {
                    this.layout = this.layoutService.getLayout(layout);
                    this.setLayoutSettings(this.layoutSettings);
                }
            };
        /**
         * @param {?} settings
         * @return {?}
         */
        GraphComponent.prototype.setLayoutSettings = /**
         * @param {?} settings
         * @return {?}
         */
            function (settings) {
                if (this.layout && typeof this.layout !== 'string') {
                    this.layout.settings = settings;
                    this.update();
                }
            };
        /**
         * Angular lifecycle event
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Angular lifecycle event
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.ngOnDestroy = /**
         * Angular lifecycle event
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var e_1, _a;
                _super.prototype.ngOnDestroy.call(this);
                try {
                    for (var _b = __values(this.subscriptions), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var sub = _c.value;
                        sub.unsubscribe();
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                this.subscriptions = null;
            };
        /**
         * Angular lifecycle event
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Angular lifecycle event
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.ngAfterViewInit = /**
         * Angular lifecycle event
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var _this = this;
                _super.prototype.ngAfterViewInit.call(this);
                setTimeout(function () { return _this.update(); });
            };
        /**
         * Base class update implementation for the dag graph
         *
         * @memberOf GraphComponent
         */
        /**
         * Base class update implementation for the dag graph
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.update = /**
         * Base class update implementation for the dag graph
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var _this = this;
                _super.prototype.update.call(this);
                if (!this.curve) {
                    this.curve = shape.curveBundle.beta(1);
                }
                this.zone.run(function () {
                    _this.dims = ngxCharts.calculateViewDimensions({
                        width: _this.width,
                        height: _this.height,
                        margins: _this.margin,
                        showLegend: _this.legend
                    });
                    _this.seriesDomain = _this.getSeriesDomain();
                    _this.setColors();
                    _this.legendOptions = _this.getLegendOptions();
                    _this.createGraph();
                    _this.updateTransform();
                    _this.initialized = true;
                });
            };
        /**
         * Creates the dagre graph engine
         *
         * @memberOf GraphComponent
         */
        /**
         * Creates the dagre graph engine
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.createGraph = /**
         * Creates the dagre graph engine
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var _this = this;
                this.graphSubscription.unsubscribe();
                this.graphSubscription = new rxjs.Subscription();
                /** @type {?} */
                var initializeNode = function (n) {
                    if (!n.meta) {
                        n.meta = {};
                    }
                    if (!n.id) {
                        n.id = id();
                    }
                    if (!n.dimension) {
                        n.dimension = {
                            width: _this.nodeWidth ? _this.nodeWidth : 30,
                            height: _this.nodeHeight ? _this.nodeHeight : 30
                        };
                        n.meta.forceDimensions = false;
                    }
                    else {
                        n.meta.forceDimensions = n.meta.forceDimensions === undefined ? true : n.meta.forceDimensions;
                    }
                    n.position = {
                        x: 0,
                        y: 0
                    };
                    n.data = n.data ? n.data : {};
                    return n;
                };
                this.graph = {
                    nodes: __spread(this.nodes).map(initializeNode),
                    clusters: __spread((this.clusters || [])).map(initializeNode),
                    edges: __spread(this.links).map(function (e) {
                        if (!e.id) {
                            e.id = id();
                        }
                        return e;
                    })
                };
                requestAnimationFrame(function () { return _this.draw(); });
            };
        /**
         * Draws the graph using dagre layouts
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Draws the graph using dagre layouts
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.draw = /**
         * Draws the graph using dagre layouts
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var _this = this;
                if (!this.layout || typeof this.layout === 'string') {
                    return;
                }
                // Calc view dims for the nodes
                this.applyNodeDimensions();
                // Recalc the layout
                /** @type {?} */
                var result = this.layout.run(this.graph);
                /** @type {?} */
                var result$ = result instanceof rxjs.Observable ? result : rxjs.of(result);
                this.graphSubscription.add(result$.subscribe(function (graph) {
                    _this.graph = graph;
                    _this.tick();
                }));
                result$.pipe(operators.first(function (graph) { return graph.nodes.length > 0; })).subscribe(function () { return _this.applyNodeDimensions(); });
            };
        /**
         * @return {?}
         */
        GraphComponent.prototype.tick = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // Transposes view options to the node
                this.graph.nodes.map(function (n) {
                    n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 ||
                        0) + ")";
                    if (!n.data) {
                        n.data = {};
                    }
                    n.data.color = _this.colors.getColor(_this.groupResultsBy(n));
                });
                (this.graph.clusters || []).map(function (n) {
                    n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 ||
                        0) + ")";
                    if (!n.data) {
                        n.data = {};
                    }
                    n.data.color = _this.colors.getColor(_this.groupResultsBy(n));
                });
                // Update the labels to the new positions
                /** @type {?} */
                var newLinks = [];
                var _loop_1 = function (edgeLabelId) {
                    /** @type {?} */
                    var edgeLabel = this_1.graph.edgeLabels[edgeLabelId];
                    /** @type {?} */
                    var normKey = edgeLabelId.replace(/[^\w-]*/g, '');
                    /** @type {?} */
                    var oldLink = this_1._oldLinks.find(function (ol) { return "" + ol.source + ol.target === normKey; });
                    if (!oldLink) {
                        oldLink = this_1.graph.edges.find(function (nl) { return "" + nl.source + nl.target === normKey; }) || edgeLabel;
                    }
                    oldLink.oldLine = oldLink.line;
                    /** @type {?} */
                    var points = edgeLabel.points;
                    /** @type {?} */
                    var line = this_1.generateLine(points);
                    /** @type {?} */
                    var newLink = Object.assign({}, oldLink);
                    newLink.line = line;
                    newLink.points = points;
                    /** @type {?} */
                    var textPos = points[Math.floor(points.length / 2)];
                    if (textPos) {
                        newLink.textTransform = "translate(" + (textPos.x || 0) + "," + (textPos.y || 0) + ")";
                    }
                    newLink.textAngle = 0;
                    if (!newLink.oldLine) {
                        newLink.oldLine = newLink.line;
                    }
                    this_1.calcDominantBaseline(newLink);
                    newLinks.push(newLink);
                };
                var this_1 = this;
                for (var edgeLabelId in this.graph.edgeLabels) {
                    _loop_1(edgeLabelId);
                }
                this.graph.edges = newLinks;
                // Map the old links for animations
                if (this.graph.edges) {
                    this._oldLinks = this.graph.edges.map(function (l) {
                        /** @type {?} */
                        var newL = Object.assign({}, l);
                        newL.oldLine = l.line;
                        return newL;
                    });
                }
                // Calculate the height/width total
                this.graphDims.width = Math.max.apply(Math, __spread(this.graph.nodes.map(function (n) { return n.position.x + n.dimension.width; })));
                this.graphDims.height = Math.max.apply(Math, __spread(this.graph.nodes.map(function (n) { return n.position.y + n.dimension.height; })));
                if (this.autoZoom) {
                    this.zoomToFit();
                }
                if (this.autoCenter) {
                    // Auto-center when rendering
                    this.center();
                }
                requestAnimationFrame(function () { return _this.redrawLines(); });
                this.cd.markForCheck();
            };
        /**
         * Measures the node element and applies the dimensions
         *
         * @memberOf GraphComponent
         */
        /**
         * Measures the node element and applies the dimensions
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.applyNodeDimensions = /**
         * Measures the node element and applies the dimensions
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.nodeElements && this.nodeElements.length) {
                    this.nodeElements.map(function (elem) {
                        var e_2, _a;
                        /** @type {?} */
                        var nativeElement = elem.nativeElement;
                        /** @type {?} */
                        var node = _this.graph.nodes.find(function (n) { return n.id === nativeElement.id; });
                        // calculate the height
                        /** @type {?} */
                        var dims;
                        try {
                            dims = nativeElement.getBBox();
                        }
                        catch (ex) {
                            // Skip drawing if element is not displayed - Firefox would throw an error here
                            return;
                        }
                        if (_this.nodeHeight) {
                            node.dimension.height = node.dimension.height && node.meta.forceDimensions ? node.dimension.height : _this.nodeHeight;
                        }
                        else {
                            node.dimension.height = node.dimension.height && node.meta.forceDimensions ? node.dimension.height : dims.height;
                        }
                        if (_this.nodeMaxHeight) {
                            node.dimension.height = Math.max(node.dimension.height, _this.nodeMaxHeight);
                        }
                        if (_this.nodeMinHeight) {
                            node.dimension.height = Math.min(node.dimension.height, _this.nodeMinHeight);
                        }
                        if (_this.nodeWidth) {
                            node.dimension.width = node.dimension.width && node.meta.forceDimensions ? node.dimension.width : _this.nodeWidth;
                        }
                        else {
                            // calculate the width
                            if (nativeElement.getElementsByTagName('text').length) {
                                /** @type {?} */
                                var maxTextDims = void 0;
                                try {
                                    try {
                                        for (var _b = __values(nativeElement.getElementsByTagName('text')), _c = _b.next(); !_c.done; _c = _b.next()) {
                                            var textElem = _c.value;
                                            /** @type {?} */
                                            var currentBBox = textElem.getBBox();
                                            if (!maxTextDims) {
                                                maxTextDims = currentBBox;
                                            }
                                            else {
                                                if (currentBBox.width > maxTextDims.width) {
                                                    maxTextDims.width = currentBBox.width;
                                                }
                                                if (currentBBox.height > maxTextDims.height) {
                                                    maxTextDims.height = currentBBox.height;
                                                }
                                            }
                                        }
                                    }
                                    catch (e_2_1) {
                                        e_2 = { error: e_2_1 };
                                    }
                                    finally {
                                        try {
                                            if (_c && !_c.done && (_a = _b.return))
                                                _a.call(_b);
                                        }
                                        finally {
                                            if (e_2)
                                                throw e_2.error;
                                        }
                                    }
                                }
                                catch (ex) {
                                    // Skip drawing if element is not displayed - Firefox would throw an error here
                                    return;
                                }
                                node.dimension.width = node.dimension.width && node.meta.forceDimensions ? node.dimension.width : maxTextDims.width + 20;
                            }
                            else {
                                node.dimension.width = node.dimension.width && node.meta.forceDimensions ? node.dimension.width : dims.width;
                            }
                        }
                        if (_this.nodeMaxWidth) {
                            node.dimension.width = Math.max(node.dimension.width, _this.nodeMaxWidth);
                        }
                        if (_this.nodeMinWidth) {
                            node.dimension.width = Math.min(node.dimension.width, _this.nodeMinWidth);
                        }
                    });
                }
            };
        /**
         * Redraws the lines when dragged or viewport updated
         *
         * @memberOf GraphComponent
         */
        /**
         * Redraws the lines when dragged or viewport updated
         *
         * \@memberOf GraphComponent
         * @param {?=} _animate
         * @return {?}
         */
        GraphComponent.prototype.redrawLines = /**
         * Redraws the lines when dragged or viewport updated
         *
         * \@memberOf GraphComponent
         * @param {?=} _animate
         * @return {?}
         */
            function (_animate) {
                var _this = this;
                if (_animate === void 0) {
                    _animate = true;
                }
                this.linkElements.map(function (linkEl) {
                    /** @type {?} */
                    var edge = _this.graph.edges.find(function (lin) { return lin.id === linkEl.nativeElement.id; });
                    if (edge) {
                        /** @type {?} */
                        var linkSelection = d3Selection.select(linkEl.nativeElement).select('.line');
                        linkSelection
                            .attr('d', edge.oldLine)
                            .transition()
                            .duration(_animate ? 500 : 0)
                            .attr('d', edge.line);
                        /** @type {?} */
                        var textPathSelection = d3Selection.select(_this.chartElement.nativeElement).select("#" + edge.id);
                        textPathSelection
                            .attr('d', edge.oldTextPath)
                            .transition()
                            .duration(_animate ? 500 : 0)
                            .attr('d', edge.textPath);
                    }
                });
            };
        /**
         * Calculate the text directions / flipping
         *
         * @memberOf GraphComponent
         */
        /**
         * Calculate the text directions / flipping
         *
         * \@memberOf GraphComponent
         * @param {?} link
         * @return {?}
         */
        GraphComponent.prototype.calcDominantBaseline = /**
         * Calculate the text directions / flipping
         *
         * \@memberOf GraphComponent
         * @param {?} link
         * @return {?}
         */
            function (link) {
                /** @type {?} */
                var firstPoint = link.points[0];
                /** @type {?} */
                var lastPoint = link.points[link.points.length - 1];
                link.oldTextPath = link.textPath;
                if (lastPoint.x < firstPoint.x) {
                    link.dominantBaseline = 'text-before-edge';
                    // reverse text path for when its flipped upside down
                    link.textPath = this.generateLine(__spread(link.points).reverse());
                }
                else {
                    link.dominantBaseline = 'text-after-edge';
                    link.textPath = link.line;
                }
            };
        /**
         * Generate the new line path
         *
         * @memberOf GraphComponent
         */
        /**
         * Generate the new line path
         *
         * \@memberOf GraphComponent
         * @param {?} points
         * @return {?}
         */
        GraphComponent.prototype.generateLine = /**
         * Generate the new line path
         *
         * \@memberOf GraphComponent
         * @param {?} points
         * @return {?}
         */
            function (points) {
                /** @type {?} */
                var lineFunction = shape.line()
                    .x(function (d) { return d.x; })
                    .y(function (d) { return d.y; })
                    .curve(this.curve);
                return lineFunction(points);
            };
        /**
         * Zoom was invoked from event
         *
         * @memberOf GraphComponent
         */
        /**
         * Zoom was invoked from event
         *
         * \@memberOf GraphComponent
         * @param {?} $event
         * @param {?} direction
         * @return {?}
         */
        GraphComponent.prototype.onZoom = /**
         * Zoom was invoked from event
         *
         * \@memberOf GraphComponent
         * @param {?} $event
         * @param {?} direction
         * @return {?}
         */
            function ($event, direction) {
                /** @type {?} */
                var zoomFactor = 1 + (direction === 'in' ? this.zoomSpeed : -this.zoomSpeed);
                // Check that zooming wouldn't put us out of bounds
                /** @type {?} */
                var newZoomLevel = this.zoomLevel * zoomFactor;
                if (newZoomLevel <= this.minZoomLevel || newZoomLevel >= this.maxZoomLevel) {
                    return;
                }
                // Check if zooming is enabled or not
                if (!this.enableZoom) {
                    return;
                }
                if (this.panOnZoom === true && $event) {
                    // Absolute mouse X/Y on the screen
                    /** @type {?} */
                    var mouseX = $event.clientX;
                    /** @type {?} */
                    var mouseY = $event.clientY;
                    // Transform the mouse X/Y into a SVG X/Y
                    /** @type {?} */
                    var svg = this.chart.nativeElement.querySelector('svg');
                    /** @type {?} */
                    var svgGroup = svg.querySelector('g.chart');
                    /** @type {?} */
                    var point = svg.createSVGPoint();
                    point.x = mouseX;
                    point.y = mouseY;
                    /** @type {?} */
                    var svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());
                    // Panzoom
                    this.pan(svgPoint.x, svgPoint.y, true);
                    this.zoom(zoomFactor);
                    this.pan(-svgPoint.x, -svgPoint.y, true);
                }
                else {
                    this.zoom(zoomFactor);
                }
            };
        /**
         * Pan by x/y
         *
         * @param x
         * @param y
         */
        /**
         * Pan by x/y
         *
         * @param {?} x
         * @param {?} y
         * @param {?=} ignoreZoomLevel
         * @return {?}
         */
        GraphComponent.prototype.pan = /**
         * Pan by x/y
         *
         * @param {?} x
         * @param {?} y
         * @param {?=} ignoreZoomLevel
         * @return {?}
         */
            function (x, y, ignoreZoomLevel) {
                if (ignoreZoomLevel === void 0) {
                    ignoreZoomLevel = false;
                }
                /** @type {?} */
                var zoomLevel = ignoreZoomLevel ? 1 : this.zoomLevel;
                this.transformationMatrix = transformationMatrix.transform(this.transformationMatrix, transformationMatrix.translate(x / zoomLevel, y / zoomLevel));
                this.updateTransform();
            };
        /**
         * Pan to a fixed x/y
         *
         */
        /**
         * Pan to a fixed x/y
         *
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        GraphComponent.prototype.panTo = /**
         * Pan to a fixed x/y
         *
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
            function (x, y) {
                if (x === null || x === undefined || isNaN(x) || y === null || y === undefined || isNaN(y)) {
                    return;
                }
                /** @type {?} */
                var panX = -this.panOffsetX - x * this.zoomLevel + this.dims.width / 2;
                /** @type {?} */
                var panY = -this.panOffsetY - y * this.zoomLevel + this.dims.height / 2;
                this.transformationMatrix = transformationMatrix.transform(this.transformationMatrix, transformationMatrix.translate(panX / this.zoomLevel, panY / this.zoomLevel));
                this.updateTransform();
            };
        /**
         * Zoom by a factor
         *
         */
        /**
         * Zoom by a factor
         *
         * @param {?} factor
         * @return {?}
         */
        GraphComponent.prototype.zoom = /**
         * Zoom by a factor
         *
         * @param {?} factor
         * @return {?}
         */
            function (factor) {
                this.transformationMatrix = transformationMatrix.transform(this.transformationMatrix, transformationMatrix.scale(factor, factor));
                this.zoomChange.emit(this.zoomLevel);
                this.updateTransform();
            };
        /**
         * @return {?}
         */
        GraphComponent.prototype.zoomIn = /**
         * @return {?}
         */
            function () {
                this.zoom(1 + this.zoomSpeed);
            };
        /**
         * @return {?}
         */
        GraphComponent.prototype.zoomOut = /**
         * @return {?}
         */
            function () {
                this.zoom(1 - this.zoomSpeed);
            };
        /**
         * Zoom to a fixed level
         *
         */
        /**
         * Zoom to a fixed level
         *
         * @param {?} level
         * @return {?}
         */
        GraphComponent.prototype.zoomTo = /**
         * Zoom to a fixed level
         *
         * @param {?} level
         * @return {?}
         */
            function (level) {
                this.transformationMatrix.a = isNaN(level) ? this.transformationMatrix.a : Number(level);
                this.transformationMatrix.d = isNaN(level) ? this.transformationMatrix.d : Number(level);
                this.zoomChange.emit(this.zoomLevel);
                this.updateTransform();
            };
        /**
         * Pan was invoked from event
         *
         * @memberOf GraphComponent
         */
        /**
         * Pan was invoked from event
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onPan = /**
         * Pan was invoked from event
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.pan(event.movementX, event.movementY);
            };
        /**
         * Drag was invoked from an event
         *
         * @memberOf GraphComponent
         */
        /**
         * Drag was invoked from an event
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onDrag = /**
         * Drag was invoked from an event
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                var _this = this;
                var e_3, _a;
                if (!this.draggingEnabled) {
                    return;
                }
                /** @type {?} */
                var node = this.draggingNode;
                if (this.layout && typeof this.layout !== 'string' && this.layout.onDrag) {
                    this.layout.onDrag(node, event);
                }
                node.position.x += event.movementX / this.zoomLevel;
                node.position.y += event.movementY / this.zoomLevel;
                // move the node
                /** @type {?} */
                var x = node.position.x - node.dimension.width / 2;
                /** @type {?} */
                var y = node.position.y - node.dimension.height / 2;
                node.transform = "translate(" + x + ", " + y + ")";
                var _loop_2 = function (link) {
                    if (link.target === node.id ||
                        link.source === node.id ||
                        (( /** @type {?} */(link.target))).id === node.id ||
                        (( /** @type {?} */(link.source))).id === node.id) {
                        if (this_2.layout && typeof this_2.layout !== 'string') {
                            /** @type {?} */
                            var result = this_2.layout.updateEdge(this_2.graph, link);
                            /** @type {?} */
                            var result$ = result instanceof rxjs.Observable ? result : rxjs.of(result);
                            this_2.graphSubscription.add(result$.subscribe(function (graph) {
                                _this.graph = graph;
                                _this.redrawEdge(link);
                            }));
                        }
                    }
                };
                var this_2 = this;
                try {
                    for (var _b = __values(this.graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var link = _c.value;
                        _loop_2(link);
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
                }
                this.redrawLines(false);
            };
        /**
         * @param {?} edge
         * @return {?}
         */
        GraphComponent.prototype.redrawEdge = /**
         * @param {?} edge
         * @return {?}
         */
            function (edge) {
                /** @type {?} */
                var line = this.generateLine(edge.points);
                this.calcDominantBaseline(edge);
                edge.oldLine = edge.line;
                edge.line = line;
            };
        /**
         * Update the entire view for the new pan position
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Update the entire view for the new pan position
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.updateTransform = /**
         * Update the entire view for the new pan position
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                this.transform = transformationMatrix.toSVG(this.transformationMatrix);
            };
        /**
         * Node was clicked
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Node was clicked
         *
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onClick = /**
         * Node was clicked
         *
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.select.emit(event);
            };
        /**
         * Node was focused
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Node was focused
         *
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onActivate = /**
         * Node was focused
         *
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.activeEntries.indexOf(event) > -1) {
                    return;
                }
                this.activeEntries = __spread([event], this.activeEntries);
                this.activate.emit({ value: event, entries: this.activeEntries });
            };
        /**
         * Node was defocused
         *
         * @memberOf GraphComponent
         */
        /**
         * Node was defocused
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onDeactivate = /**
         * Node was defocused
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                /** @type {?} */
                var idx = this.activeEntries.indexOf(event);
                this.activeEntries.splice(idx, 1);
                this.activeEntries = __spread(this.activeEntries);
                this.deactivate.emit({ value: event, entries: this.activeEntries });
            };
        /**
         * Get the domain series for the nodes
         *
         * @memberOf GraphComponent
         */
        /**
         * Get the domain series for the nodes
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.getSeriesDomain = /**
         * Get the domain series for the nodes
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                var _this = this;
                return this.nodes
                    .map(function (d) { return _this.groupResultsBy(d); })
                    .reduce(function (nodes, node) { return (nodes.indexOf(node) !== -1 ? nodes : nodes.concat([node])); }, [])
                    .sort();
            };
        /**
         * Tracking for the link
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Tracking for the link
         *
         *
         * \@memberOf GraphComponent
         * @param {?} index
         * @param {?} link
         * @return {?}
         */
        GraphComponent.prototype.trackLinkBy = /**
         * Tracking for the link
         *
         *
         * \@memberOf GraphComponent
         * @param {?} index
         * @param {?} link
         * @return {?}
         */
            function (index, link) {
                return link.id;
            };
        /**
         * Tracking for the node
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Tracking for the node
         *
         *
         * \@memberOf GraphComponent
         * @param {?} index
         * @param {?} node
         * @return {?}
         */
        GraphComponent.prototype.trackNodeBy = /**
         * Tracking for the node
         *
         *
         * \@memberOf GraphComponent
         * @param {?} index
         * @param {?} node
         * @return {?}
         */
            function (index, node) {
                return node.id;
            };
        /**
         * Sets the colors the nodes
         *
         *
         * @memberOf GraphComponent
         */
        /**
         * Sets the colors the nodes
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.setColors = /**
         * Sets the colors the nodes
         *
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                this.colors = new ngxCharts.ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
            };
        /**
         * Gets the legend options
         *
         * @memberOf GraphComponent
         */
        /**
         * Gets the legend options
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
        GraphComponent.prototype.getLegendOptions = /**
         * Gets the legend options
         *
         * \@memberOf GraphComponent
         * @return {?}
         */
            function () {
                return {
                    scaleType: 'ordinal',
                    domain: this.seriesDomain,
                    colors: this.colors
                };
            };
        /**
         * On mouse move event, used for panning and dragging.
         *
         * @memberOf GraphComponent
         */
        /**
         * On mouse move event, used for panning and dragging.
         *
         * \@memberOf GraphComponent
         * @param {?} $event
         * @return {?}
         */
        GraphComponent.prototype.onMouseMove = /**
         * On mouse move event, used for panning and dragging.
         *
         * \@memberOf GraphComponent
         * @param {?} $event
         * @return {?}
         */
            function ($event) {
                if (this.isPanning && this.panningEnabled) {
                    this.onPan($event);
                }
                else if (this.isDragging && this.draggingEnabled) {
                    this.onDrag($event);
                }
            };
        /**
         * On touch start event to enable panning.
         *
         * @memberOf GraphComponent
         */
        /**
         * On touch start event to enable panning.
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onTouchStart = /**
         * On touch start event to enable panning.
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this._touchLastX = event.changedTouches[0].clientX;
                this._touchLastY = event.changedTouches[0].clientY;
                this.isPanning = true;
            };
        /**
         * On touch move event, used for panning.
         *
         */
        /**
         * On touch move event, used for panning.
         *
         * @param {?} $event
         * @return {?}
         */
        GraphComponent.prototype.onTouchMove = /**
         * On touch move event, used for panning.
         *
         * @param {?} $event
         * @return {?}
         */
            function ($event) {
                if (this.isPanning && this.panningEnabled) {
                    /** @type {?} */
                    var clientX = $event.changedTouches[0].clientX;
                    /** @type {?} */
                    var clientY = $event.changedTouches[0].clientY;
                    /** @type {?} */
                    var movementX = clientX - this._touchLastX;
                    /** @type {?} */
                    var movementY = clientY - this._touchLastY;
                    this._touchLastX = clientX;
                    this._touchLastY = clientY;
                    this.pan(movementX, movementY);
                }
            };
        /**
         * On touch end event to disable panning.
         *
         * @memberOf GraphComponent
         */
        /**
         * On touch end event to disable panning.
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onTouchEnd = /**
         * On touch end event to disable panning.
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.isPanning = false;
            };
        /**
         * On mouse up event to disable panning/dragging.
         *
         * @memberOf GraphComponent
         */
        /**
         * On mouse up event to disable panning/dragging.
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
        GraphComponent.prototype.onMouseUp = /**
         * On mouse up event to disable panning/dragging.
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.isDragging = false;
                this.isPanning = false;
                if (this.layout && typeof this.layout !== 'string' && this.layout.onDragEnd) {
                    this.layout.onDragEnd(this.draggingNode, event);
                }
            };
        /**
         * On node mouse down to kick off dragging
         *
         * @memberOf GraphComponent
         */
        /**
         * On node mouse down to kick off dragging
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @param {?} node
         * @return {?}
         */
        GraphComponent.prototype.onNodeMouseDown = /**
         * On node mouse down to kick off dragging
         *
         * \@memberOf GraphComponent
         * @param {?} event
         * @param {?} node
         * @return {?}
         */
            function (event, node) {
                if (!this.draggingEnabled) {
                    return;
                }
                this.isDragging = true;
                this.draggingNode = node;
                if (this.layout && typeof this.layout !== 'string' && this.layout.onDragStart) {
                    this.layout.onDragStart(node, event);
                }
            };
        /**
         * Center the graph in the viewport
         */
        /**
         * Center the graph in the viewport
         * @return {?}
         */
        GraphComponent.prototype.center = /**
         * Center the graph in the viewport
         * @return {?}
         */
            function () {
                this.panTo(this.graphDims.width / 2, this.graphDims.height / 2);
            };
        /**
         * Zooms to fit the entier graph
         */
        /**
         * Zooms to fit the entier graph
         * @return {?}
         */
        GraphComponent.prototype.zoomToFit = /**
         * Zooms to fit the entier graph
         * @return {?}
         */
            function () {
                /** @type {?} */
                var heightZoom = this.dims.height / this.graphDims.height;
                /** @type {?} */
                var widthZoom = this.dims.width / this.graphDims.width;
                /** @type {?} */
                var zoomLevel = Math.min(heightZoom, widthZoom, 1);
                if (zoomLevel <= this.minZoomLevel || zoomLevel >= this.maxZoomLevel) {
                    return;
                }
                if (zoomLevel !== this.zoomLevel) {
                    this.zoomLevel = zoomLevel;
                    this.updateTransform();
                    this.zoomChange.emit(this.zoomLevel);
                }
            };
        /**
         * Pans to the node
         * @param nodeId
         */
        /**
         * Pans to the node
         * @param {?} nodeId
         * @return {?}
         */
        GraphComponent.prototype.panToNodeId = /**
         * Pans to the node
         * @param {?} nodeId
         * @return {?}
         */
            function (nodeId) {
                /** @type {?} */
                var node = this.nodes.find(function (n) { return n.id === nodeId; });
                if (!node) {
                    return;
                }
                this.panTo(node.position.x, node.position.y);
            };
        GraphComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'ngx-graph',
                        styles: [".graph{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.graph .edge{stroke:#666;fill:none}.graph .edge .edge-label{stroke:none;font-size:12px;fill:#251e1e}.graph .panning-rect{fill:transparent;cursor:move;width:1000000px}.graph .node-group .node:focus{outline:0}.graph .cluster rect{opacity:.2}"],
                        template: "<ngx-charts-chart\n  [view]=\"[width, height]\"\n  [showLegend]=\"legend\"\n  [legendOptions]=\"legendOptions\"\n  (legendLabelClick)=\"onClick($event)\"\n  (legendLabelActivate)=\"onActivate($event)\"\n  (legendLabelDeactivate)=\"onDeactivate($event)\"\n  mouseWheel\n  (mouseWheelUp)=\"onZoom($event, 'in')\"\n  (mouseWheelDown)=\"onZoom($event, 'out')\"\n>\n  <svg:g\n    *ngIf=\"initialized && graph\"\n    [attr.transform]=\"transform\"\n    (touchstart)=\"onTouchStart($event)\"\n    (touchend)=\"onTouchEnd($event)\"\n    class=\"graph chart\"\n  >\n    <defs>\n      <ng-template *ngIf=\"defsTemplate\" [ngTemplateOutlet]=\"defsTemplate\"></ng-template>\n      <svg:path\n        class=\"text-path\"\n        *ngFor=\"let link of graph.edges\"\n        [attr.d]=\"link.textPath\"\n        [attr.id]=\"link.id\"\n      ></svg:path>\n    </defs>\n    <svg:rect\n      class=\"panning-rect\"\n      [attr.width]=\"dims.width * 100\"\n      [attr.height]=\"dims.height * 100\"\n      [attr.transform]=\"'translate(' + (-dims.width || 0) * 50 + ',' + (-dims.height || 0) * 50 + ')'\"\n      (mousedown)=\"isPanning = true\"\n    />\n    <svg:g class=\"clusters\">\n      <svg:g\n        #clusterElement\n        *ngFor=\"let node of graph.clusters; trackBy: trackNodeBy\"\n        class=\"node-group\"\n        [id]=\"node.id\"\n        [attr.transform]=\"node.transform\"\n        (click)=\"onClick(node)\"\n      >\n        <ng-template\n          *ngIf=\"clusterTemplate\"\n          [ngTemplateOutlet]=\"clusterTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: node }\"\n        ></ng-template>\n        <svg:g *ngIf=\"!clusterTemplate\" class=\"node cluster\">\n          <svg:rect\n            [attr.width]=\"node.dimension.width\"\n            [attr.height]=\"node.dimension.height\"\n            [attr.fill]=\"node.data?.color\"\n          />\n          <svg:text alignment-baseline=\"central\" [attr.x]=\"10\" [attr.y]=\"node.dimension.height / 2\">\n            {{ node.label }}\n          </svg:text>\n        </svg:g>\n      </svg:g>\n    </svg:g>\n    <svg:g class=\"links\">\n      <svg:g #linkElement *ngFor=\"let link of graph.edges; trackBy: trackLinkBy\" class=\"link-group\" [id]=\"link.id\">\n        <ng-template\n          *ngIf=\"linkTemplate\"\n          [ngTemplateOutlet]=\"linkTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: link }\"\n        ></ng-template>\n        <svg:path *ngIf=\"!linkTemplate\" class=\"edge\" [attr.d]=\"link.line\" />\n      </svg:g>\n    </svg:g>\n    <svg:g class=\"nodes\">\n      <svg:g\n        #nodeElement\n        *ngFor=\"let node of graph.nodes; trackBy: trackNodeBy\"\n        class=\"node-group\"\n        [id]=\"node.id\"\n        [attr.transform]=\"node.transform\"\n        (click)=\"onClick(node)\"\n        (mousedown)=\"onNodeMouseDown($event, node)\"\n      >\n        <ng-template\n          *ngIf=\"nodeTemplate\"\n          [ngTemplateOutlet]=\"nodeTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: node }\"\n        ></ng-template>\n        <svg:circle\n          *ngIf=\"!nodeTemplate\"\n          r=\"10\"\n          [attr.cx]=\"node.dimension.width / 2\"\n          [attr.cy]=\"node.dimension.height / 2\"\n          [attr.fill]=\"node.data?.color\"\n        />\n      </svg:g>\n    </svg:g>\n  </svg:g>\n</ngx-charts-chart>\n",
                        encapsulation: core.ViewEncapsulation.None,
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        animations: [animations.trigger('link', [animations.transition('* => *', [animations.animate(500, animations.style({ transform: '*' }))])])]
                    },] },
        ];
        /** @nocollapse */
        GraphComponent.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.NgZone },
                { type: core.ChangeDetectorRef },
                { type: LayoutService }
            ];
        };
        GraphComponent.propDecorators = {
            legend: [{ type: core.Input }],
            nodes: [{ type: core.Input }],
            clusters: [{ type: core.Input }],
            links: [{ type: core.Input }],
            activeEntries: [{ type: core.Input }],
            curve: [{ type: core.Input }],
            draggingEnabled: [{ type: core.Input }],
            nodeHeight: [{ type: core.Input }],
            nodeMaxHeight: [{ type: core.Input }],
            nodeMinHeight: [{ type: core.Input }],
            nodeWidth: [{ type: core.Input }],
            nodeMinWidth: [{ type: core.Input }],
            nodeMaxWidth: [{ type: core.Input }],
            panningEnabled: [{ type: core.Input }],
            enableZoom: [{ type: core.Input }],
            zoomSpeed: [{ type: core.Input }],
            minZoomLevel: [{ type: core.Input }],
            maxZoomLevel: [{ type: core.Input }],
            autoZoom: [{ type: core.Input }],
            panOnZoom: [{ type: core.Input }],
            autoCenter: [{ type: core.Input }],
            update$: [{ type: core.Input }],
            center$: [{ type: core.Input }],
            zoomToFit$: [{ type: core.Input }],
            panToNode$: [{ type: core.Input }],
            layout: [{ type: core.Input }],
            layoutSettings: [{ type: core.Input }],
            activate: [{ type: core.Output }],
            deactivate: [{ type: core.Output }],
            zoomChange: [{ type: core.Output }],
            linkTemplate: [{ type: core.ContentChild, args: ['linkTemplate',] }],
            nodeTemplate: [{ type: core.ContentChild, args: ['nodeTemplate',] }],
            clusterTemplate: [{ type: core.ContentChild, args: ['clusterTemplate',] }],
            defsTemplate: [{ type: core.ContentChild, args: ['defsTemplate',] }],
            chart: [{ type: core.ViewChild, args: [ngxCharts.ChartComponent, { read: core.ElementRef },] }],
            nodeElements: [{ type: core.ViewChildren, args: ['nodeElement',] }],
            linkElements: [{ type: core.ViewChildren, args: ['linkElement',] }],
            groupResultsBy: [{ type: core.Input }],
            zoomLevel: [{ type: core.Input, args: ['zoomLevel',] }],
            panOffsetX: [{ type: core.Input, args: ['panOffsetX',] }],
            panOffsetY: [{ type: core.Input, args: ['panOffsetY',] }],
            onMouseMove: [{ type: core.HostListener, args: ['document:mousemove', ['$event'],] }],
            onTouchMove: [{ type: core.HostListener, args: ['document:touchmove', ['$event'],] }],
            onMouseUp: [{ type: core.HostListener, args: ['document:mouseup',] }]
        };
        return GraphComponent;
    }(ngxCharts.BaseChartComponent));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Mousewheel directive
     * https://github.com/SodhanaLibrary/angular2-examples/blob/master/app/mouseWheelDirective/mousewheel.directive.ts
     *
     * @export
     */
    var MouseWheelDirective = /** @class */ (function () {
        function MouseWheelDirective() {
            this.mouseWheelUp = new core.EventEmitter();
            this.mouseWheelDown = new core.EventEmitter();
        }
        /**
         * @param {?} event
         * @return {?}
         */
        MouseWheelDirective.prototype.onMouseWheelChrome = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.mouseWheelFunc(event);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        MouseWheelDirective.prototype.onMouseWheelFirefox = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.mouseWheelFunc(event);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        MouseWheelDirective.prototype.onMouseWheelIE = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.mouseWheelFunc(event);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        MouseWheelDirective.prototype.mouseWheelFunc = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (window.event) {
                    event = window.event;
                }
                /** @type {?} */
                var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
                if (delta > 0) {
                    this.mouseWheelUp.emit(event);
                }
                else if (delta < 0) {
                    this.mouseWheelDown.emit(event);
                }
                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault) {
                    event.preventDefault();
                }
            };
        MouseWheelDirective.decorators = [
            { type: core.Directive, args: [{ selector: '[mouseWheel]' },] },
        ];
        MouseWheelDirective.propDecorators = {
            mouseWheelUp: [{ type: core.Output }],
            mouseWheelDown: [{ type: core.Output }],
            onMouseWheelChrome: [{ type: core.HostListener, args: ['mousewheel', ['$event'],] }],
            onMouseWheelFirefox: [{ type: core.HostListener, args: ['DOMMouseScroll', ['$event'],] }],
            onMouseWheelIE: [{ type: core.HostListener, args: ['onmousewheel', ['$event'],] }]
        };
        return MouseWheelDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GraphModule = /** @class */ (function () {
        function GraphModule() {
        }
        GraphModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [ngxCharts.ChartCommonModule],
                        declarations: [GraphComponent, MouseWheelDirective],
                        exports: [GraphComponent, MouseWheelDirective],
                        providers: [LayoutService]
                    },] },
        ];
        return GraphModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxGraphModule = /** @class */ (function () {
        function NgxGraphModule() {
        }
        NgxGraphModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [ngxCharts.NgxChartsModule],
                        exports: [GraphModule]
                    },] },
        ];
        return NgxGraphModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.NgxGraphModule = NgxGraphModule;
    exports.ɵa = GraphComponent;
    exports.ɵb = GraphModule;
    exports.ɵc = LayoutService;
    exports.ɵd = MouseWheelDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWdyYXBoLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi91dGlscy9pZC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZUNsdXN0ZXIudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZDNGb3JjZURpcmVjdGVkLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9sYXlvdXRzL2NvbGFGb3JjZURpcmVjdGVkLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9sYXlvdXRzL2xheW91dC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL21vdXNlLXdoZWVsLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvZ3JhcGgubW9kdWxlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9uZ3gtZ3JhcGgubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiY29uc3QgY2FjaGUgPSB7fTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBzaG9ydCBpZC5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZCgpOiBzdHJpbmcge1xuICBsZXQgbmV3SWQgPSAoJzAwMDAnICsgKChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMzYsIDQpKSA8PCAwKS50b1N0cmluZygzNikpLnNsaWNlKC00KTtcblxuICBuZXdJZCA9IGBhJHtuZXdJZH1gO1xuXG4gIC8vIGVuc3VyZSBub3QgYWxyZWFkeSB1c2VkXG4gIGlmICghY2FjaGVbbmV3SWRdKSB7XG4gICAgY2FjaGVbbmV3SWRdID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV3SWQ7XG4gIH1cblxuICByZXR1cm4gaWQoKTtcbn1cbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuXG5leHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XG4gIExFRlRfVE9fUklHSFQgPSAnTFInLFxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcbiAgVE9QX1RPX0JPVFRPTSA9ICdUQicsXG4gIEJPVFRPTV9UT19UT00gPSAnQlQnXG59XG5leHBvcnQgZW51bSBBbGlnbm1lbnQge1xuICBDRU5URVIgPSAnQycsXG4gIFVQX0xFRlQgPSAnVUwnLFxuICBVUF9SSUdIVCA9ICdVUicsXG4gIERPV05fTEVGVCA9ICdETCcsXG4gIERPV05fUklHSFQgPSAnRFInXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XG4gIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb247XG4gIG1hcmdpblg/OiBudW1iZXI7XG4gIG1hcmdpblk/OiBudW1iZXI7XG4gIGVkZ2VQYWRkaW5nPzogbnVtYmVyO1xuICByYW5rUGFkZGluZz86IG51bWJlcjtcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XG4gIGFsaWduPzogQWxpZ25tZW50O1xuICBhY3ljbGljZXI/OiAnZ3JlZWR5JyB8IHVuZGVmaW5lZDtcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcbiAgbXVsdGlncmFwaD86IGJvb2xlYW47XG4gIGNvbXBvdW5kPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIERhZ3JlTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge1xuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxuICAgIG1hcmdpblg6IDIwLFxuICAgIG1hcmdpblk6IDIwLFxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcbiAgICBub2RlUGFkZGluZzogNTAsXG4gICAgbXVsdGlncmFwaDogdHJ1ZSxcbiAgICBjb21wb3VuZDogdHJ1ZVxuICB9O1xuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xuXG4gIGRhZ3JlR3JhcGg6IGFueTtcbiAgZGFncmVOb2RlczogYW55O1xuICBkYWdyZUVkZ2VzOiBhbnk7XG5cbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xuXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcblxuICAgIGZvciAoY29uc3QgZGFncmVOb2RlSWQgaW4gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlcykge1xuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XG4gICAgICBjb25zdCBub2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGRhZ3JlTm9kZS5pZCk7XG4gICAgICBub2RlLnBvc2l0aW9uID0ge1xuICAgICAgICB4OiBkYWdyZU5vZGUueCxcbiAgICAgICAgeTogZGFncmVOb2RlLnlcbiAgICAgIH07XG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcbiAgICAgICAgd2lkdGg6IGRhZ3JlTm9kZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xuXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb24ueSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgPyAtMSA6IDE7XG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcbiAgICAgIHg6IHNvdXJjZU5vZGUucG9zaXRpb24ueCxcbiAgICAgIHk6IHNvdXJjZU5vZGUucG9zaXRpb24ueSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxuICAgIH07XG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XG4gICAgICB4OiB0YXJnZXROb2RlLnBvc2l0aW9uLngsXG4gICAgICB5OiB0YXJnZXROb2RlLnBvc2l0aW9uLnkgKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcbiAgICB9O1xuXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xuICAgIGVkZ2UucG9pbnRzID0gW3N0YXJ0aW5nUG9pbnQsIGVuZGluZ1BvaW50XTtcbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKHtjb21wb3VuZDogc2V0dGluZ3MuY29tcG91bmQsIG11bHRpZ3JhcGg6IHNldHRpbmdzLm11bHRpZ3JhcGh9KTtcbiAgICBcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXIsXG4gICAgICBtdWx0aWdyYXBoOiBzZXR0aW5ncy5tdWx0aWdyYXBoLFxuICAgICAgY29tcG91bmQ6IHNldHRpbmdzLmNvbXBvdW5kXG4gICAgfSk7XG5cbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvKiBlbXB0eSAqL1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0xpbms7XG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcbiAgICAgICAgbm9kZS53aWR0aCA9IDIwO1xuICAgICAgfVxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xuICAgICAgICBub2RlLmhlaWdodCA9IDMwO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgZGFncmVcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYWdyZVxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5tdWx0aWdyYXBoKSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCwgZWRnZSwgZWRnZS5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XG4gIH1cbn1cbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBEYWdyZVNldHRpbmdzLCBPcmllbnRhdGlvbiB9IGZyb20gJy4vZGFncmUnO1xuXG5leHBvcnQgY2xhc3MgRGFncmVDbHVzdGVyTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge1xuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxuICAgIG1hcmdpblg6IDIwLFxuICAgIG1hcmdpblk6IDIwLFxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcbiAgICBub2RlUGFkZGluZzogNTAsXG4gICAgbXVsdGlncmFwaDogdHJ1ZSxcbiAgICBjb21wb3VuZDogdHJ1ZVxuICB9O1xuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xuXG4gIGRhZ3JlR3JhcGg6IGFueTtcbiAgZGFncmVOb2RlczogTm9kZVtdO1xuICBkYWdyZUNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdO1xuICBkYWdyZUVkZ2VzOiBhbnk7XG5cbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xuXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcblxuICAgIGNvbnN0IGRhZ3JlVG9PdXRwdXQgPSBub2RlID0+IHtcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbbm9kZS5pZF07XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5ub2RlLFxuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHg6IGRhZ3JlTm9kZS54LFxuICAgICAgICAgIHk6IGRhZ3JlTm9kZS55XG4gICAgICAgIH0sXG4gICAgICAgIGRpbWVuc2lvbjoge1xuICAgICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgICBncmFwaC5jbHVzdGVycyA9IChncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKGRhZ3JlVG9PdXRwdXQpO1xuICAgIGdyYXBoLm5vZGVzID0gZ3JhcGgubm9kZXMubWFwKGRhZ3JlVG9PdXRwdXQpO1xuXG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XG5cbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbi55IDw9IHRhcmdldE5vZGUucG9zaXRpb24ueSA/IC0xIDogMTtcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xuICAgICAgeDogc291cmNlTm9kZS5wb3NpdGlvbi54LFxuICAgICAgeTogc291cmNlTm9kZS5wb3NpdGlvbi55IC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXG4gICAgfTtcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcbiAgICAgIHg6IHRhcmdldE5vZGUucG9zaXRpb24ueCxcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxuICAgIH07XG5cbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXG4gICAgZWRnZS5wb2ludHMgPSBbc3RhcnRpbmdQb2ludCwgZW5kaW5nUG9pbnRdO1xuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoeyBjb21wb3VuZDogc2V0dGluZ3MuY29tcG91bmQsIG11bHRpZ3JhcGg6IHNldHRpbmdzLm11bHRpZ3JhcGggfSk7XG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyLFxuICAgICAgbXVsdGlncmFwaDogc2V0dGluZ3MubXVsdGlncmFwaCxcbiAgICAgIGNvbXBvdW5kOiBzZXR0aW5ncy5jb21wb3VuZFxuICAgIH0pO1xuXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLyogZW1wdHkgKi9cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAoKG46IE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVDbHVzdGVycyA9IGdyYXBoLmNsdXN0ZXJzIHx8IFtdO1xuXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3TGluaztcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2x1c3RlciBvZiB0aGlzLmRhZ3JlQ2x1c3RlcnMpIHtcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKGNsdXN0ZXIuaWQsIGNsdXN0ZXIpO1xuICAgICAgY2x1c3Rlci5jaGlsZE5vZGVJZHMuZm9yRWFjaChjaGlsZE5vZGVJZCA9PiB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRQYXJlbnQoY2hpbGROb2RlSWQsIGNsdXN0ZXIuaWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhZ3JlXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xuICAgICAgaWYgKHNldHRpbmdzLm11bHRpZ3JhcGgpIHtcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0LCBlZGdlLCBlZGdlLmlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5cbmV4cG9ydCBlbnVtIE9yaWVudGF0aW9uIHtcbiAgTEVGVF9UT19SSUdIVCA9ICdMUicsXG4gIFJJR0hUX1RPX0xFRlQgPSAnUkwnLFxuICBUT1BfVE9fQk9UVE9NID0gJ1RCJyxcbiAgQk9UVE9NX1RPX1RPTSA9ICdCVCdcbn1cbmV4cG9ydCBlbnVtIEFsaWdubWVudCB7XG4gIENFTlRFUiA9ICdDJyxcbiAgVVBfTEVGVCA9ICdVTCcsXG4gIFVQX1JJR0hUID0gJ1VSJyxcbiAgRE9XTl9MRUZUID0gJ0RMJyxcbiAgRE9XTl9SSUdIVCA9ICdEUidcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEYWdyZVNldHRpbmdzIHtcbiAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbjtcbiAgbWFyZ2luWD86IG51bWJlcjtcbiAgbWFyZ2luWT86IG51bWJlcjtcbiAgZWRnZVBhZGRpbmc/OiBudW1iZXI7XG4gIHJhbmtQYWRkaW5nPzogbnVtYmVyO1xuICBub2RlUGFkZGluZz86IG51bWJlcjtcbiAgYWxpZ24/OiBBbGlnbm1lbnQ7XG4gIGFjeWNsaWNlcj86ICdncmVlZHknIHwgdW5kZWZpbmVkO1xuICByYW5rZXI/OiAnbmV0d29yay1zaW1wbGV4JyB8ICd0aWdodC10cmVlJyB8ICdsb25nZXN0LXBhdGgnO1xuICBtdWx0aWdyYXBoPzogYm9vbGVhbjtcbiAgY29tcG91bmQ/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgZXh0ZW5kcyBEYWdyZVNldHRpbmdzIHtcbiAgY3VydmVEaXN0YW5jZT86IG51bWJlcjtcbn1cblxuY29uc3QgREVGQVVMVF9FREdFX05BTUUgPSAnXFx4MDAnO1xuY29uc3QgR1JBUEhfTk9ERSA9ICdcXHgwMCc7XG5jb25zdCBFREdFX0tFWV9ERUxJTSA9ICdcXHgwMSc7XG5cbmV4cG9ydCBjbGFzcyBEYWdyZU5vZGVzT25seUxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVOb2Rlc09ubHlTZXR0aW5ncyA9IHtcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcbiAgICBtYXJnaW5YOiAyMCxcbiAgICBtYXJnaW5ZOiAyMCxcbiAgICBlZGdlUGFkZGluZzogMTAwLFxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXG4gICAgbm9kZVBhZGRpbmc6IDUwLFxuICAgIGN1cnZlRGlzdGFuY2U6IDIwLFxuICAgIG11bHRpZ3JhcGg6IHRydWUsXG4gICAgY29tcG91bmQ6IHRydWVcbiAgfTtcbiAgc2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7fTtcblxuICBkYWdyZUdyYXBoOiBhbnk7XG4gIGRhZ3JlTm9kZXM6IGFueTtcbiAgZGFncmVFZGdlczogYW55O1xuXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcblxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XG5cbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbZGFncmVOb2RlSWRdO1xuICAgICAgY29uc3Qgbm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBkYWdyZU5vZGUuaWQpO1xuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgeDogZGFncmVOb2RlLngsXG4gICAgICAgIHk6IGRhZ3JlTm9kZS55XG4gICAgICB9O1xuICAgICAgbm9kZS5kaW1lbnNpb24gPSB7XG4gICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxuICAgICAgfTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBlZGdlIG9mIGdyYXBoLmVkZ2VzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUVkZ2UoZ3JhcGgsIGVkZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xuICAgIGNvbnN0IHJhbmtBeGlzOiAneCcgfCAneScgPSB0aGlzLnNldHRpbmdzLm9yaWVudGF0aW9uID09PSAnQlQnIHx8IHRoaXMuc2V0dGluZ3Mub3JpZW50YXRpb24gPT09ICdUQicgPyAneScgOiAneCc7XG4gICAgY29uc3Qgb3JkZXJBeGlzOiAneCcgfCAneScgPSByYW5rQXhpcyA9PT0gJ3knID8gJ3gnIDogJ3knO1xuICAgIGNvbnN0IHJhbmtEaW1lbnNpb24gPSByYW5rQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSA/IC0xIDogMTtcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xuICAgICAgW29yZGVyQXhpc106IHNvdXJjZU5vZGUucG9zaXRpb25bb3JkZXJBeGlzXSxcbiAgICAgIFtyYW5rQXhpc106IHNvdXJjZU5vZGUucG9zaXRpb25bcmFua0F4aXNdIC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uW3JhbmtEaW1lbnNpb25dIC8gMilcbiAgICB9O1xuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xuICAgICAgW29yZGVyQXhpc106IHRhcmdldE5vZGUucG9zaXRpb25bb3JkZXJBeGlzXSxcbiAgICAgIFtyYW5rQXhpc106IHRhcmdldE5vZGUucG9zaXRpb25bcmFua0F4aXNdICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uW3JhbmtEaW1lbnNpb25dIC8gMilcbiAgICB9O1xuXG4gICAgY29uc3QgY3VydmVEaXN0YW5jZSA9IHRoaXMuc2V0dGluZ3MuY3VydmVEaXN0YW5jZSB8fCB0aGlzLmRlZmF1bHRTZXR0aW5ncy5jdXJ2ZURpc3RhbmNlO1xuICAgIC8vIGdlbmVyYXRlIG5ldyBwb2ludHNcbiAgICBlZGdlLnBvaW50cyA9IFtcbiAgICAgIHN0YXJ0aW5nUG9pbnQsXG4gICAgICB7XG4gICAgICAgIFtvcmRlckF4aXNdOiBzdGFydGluZ1BvaW50W29yZGVyQXhpc10sXG4gICAgICAgIFtyYW5rQXhpc106IHN0YXJ0aW5nUG9pbnRbcmFua0F4aXNdIC0gZGlyICogY3VydmVEaXN0YW5jZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgW29yZGVyQXhpc106IGVuZGluZ1BvaW50W29yZGVyQXhpc10sXG4gICAgICAgIFtyYW5rQXhpc106IGVuZGluZ1BvaW50W3JhbmtBeGlzXSArIGRpciAqIGN1cnZlRGlzdGFuY2VcbiAgICAgIH0sXG4gICAgICBlbmRpbmdQb2ludFxuICAgIF07XG4gICAgY29uc3QgZWRnZUxhYmVsSWQgPSBgJHtlZGdlLnNvdXJjZX0ke0VER0VfS0VZX0RFTElNfSR7ZWRnZS50YXJnZXR9JHtFREdFX0tFWV9ERUxJTX0ke0RFRkFVTFRfRURHRV9OQU1FfWA7XG4gICAgY29uc3QgbWF0Y2hpbmdFZGdlTGFiZWwgPSBncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcbiAgICBpZiAobWF0Y2hpbmdFZGdlTGFiZWwpIHtcbiAgICAgIG1hdGNoaW5nRWRnZUxhYmVsLnBvaW50cyA9IGVkZ2UucG9pbnRzO1xuICAgIH1cbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKHsgY29tcG91bmQ6IHNldHRpbmdzLmNvbXBvdW5kLCBtdWx0aWdyYXBoOiBzZXR0aW5ncy5tdWx0aWdyYXBoIH0pO1xuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlcixcbiAgICAgIG11bHRpZ3JhcGg6IHNldHRpbmdzLm11bHRpZ3JhcGgsXG4gICAgICBjb21wb3VuZDogc2V0dGluZ3MuY29tcG91bmRcbiAgICB9KTtcblxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8qIGVtcHR5ICovXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XG4gICAgICBub2RlLmhlaWdodCA9IG4uZGltZW5zaW9uLmhlaWdodDtcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3TGluaztcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcbiAgICAgIGlmICghbm9kZS53aWR0aCkge1xuICAgICAgICBub2RlLndpZHRoID0gMjA7XG4gICAgICB9XG4gICAgICBpZiAoIW5vZGUuaGVpZ2h0KSB7XG4gICAgICAgIG5vZGUuaGVpZ2h0ID0gMzA7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBkYWdyZVxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhZ3JlXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xuICAgICAgaWYgKHNldHRpbmdzLm11bHRpZ3JhcGgpIHtcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0LCBlZGdlLCBlZGdlLmlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL25vZGUubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XG5pbXBvcnQgeyBmb3JjZUNvbGxpZGUsIGZvcmNlTGluaywgZm9yY2VNYW55Qm9keSwgZm9yY2VTaW11bGF0aW9uIH0gZnJvbSAnZDMtZm9yY2UnO1xuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGludGVyZmFjZSBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyB7XG4gIGZvcmNlPzogYW55O1xuICBmb3JjZUxpbms/OiBhbnk7XG59XG5leHBvcnQgaW50ZXJmYWNlIEQzTm9kZSB7XG4gIGlkPzogc3RyaW5nO1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgZng/OiBudW1iZXI7XG4gIGZ5PzogbnVtYmVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBEM0VkZ2Uge1xuICBzb3VyY2U6IHN0cmluZyB8IEQzTm9kZTtcbiAgdGFyZ2V0OiBzdHJpbmcgfCBEM05vZGU7XG59XG5leHBvcnQgaW50ZXJmYWNlIEQzR3JhcGgge1xuICBub2RlczogRDNOb2RlW107XG4gIGVkZ2VzOiBEM0VkZ2VbXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTWVyZ2VkTm9kZSBleHRlbmRzIEQzTm9kZSwgTm9kZSB7XG4gIGlkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0QzTm9kZShtYXliZU5vZGU6IHN0cmluZyB8IEQzTm9kZSk6IEQzTm9kZSB7XG4gIGlmICh0eXBlb2YgbWF5YmVOb2RlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogbWF5YmVOb2RlLFxuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICB9XG4gIHJldHVybiBtYXliZU5vZGU7XG59XG5cbmV4cG9ydCBjbGFzcyBEM0ZvcmNlRGlyZWN0ZWRMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xuICBkZWZhdWx0U2V0dGluZ3M6IEQzRm9yY2VEaXJlY3RlZFNldHRpbmdzID0ge1xuICAgIGZvcmNlOiBmb3JjZVNpbXVsYXRpb248YW55PigpXG4gICAgICAuZm9yY2UoJ2NoYXJnZScsIGZvcmNlTWFueUJvZHkoKS5zdHJlbmd0aCgtMTUwKSlcbiAgICAgIC5mb3JjZSgnY29sbGlkZScsIGZvcmNlQ29sbGlkZSg1KSksXG4gICAgZm9yY2VMaW5rOiBmb3JjZUxpbms8YW55LCBhbnk+KClcbiAgICAgIC5pZChub2RlID0+IG5vZGUuaWQpXG4gICAgICAuZGlzdGFuY2UoKCkgPT4gMTAwKVxuICB9O1xuICBzZXR0aW5nczogRDNGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7fTtcblxuICBpbnB1dEdyYXBoOiBHcmFwaDtcbiAgb3V0cHV0R3JhcGg6IEdyYXBoO1xuICBkM0dyYXBoOiBEM0dyYXBoO1xuICBvdXRwdXRHcmFwaCQ6IFN1YmplY3Q8R3JhcGg+ID0gbmV3IFN1YmplY3QoKTtcblxuICBkcmFnZ2luZ1N0YXJ0OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH07XG5cbiAgcnVuKGdyYXBoOiBHcmFwaCk6IE9ic2VydmFibGU8R3JhcGg+IHtcbiAgICB0aGlzLmlucHV0R3JhcGggPSBncmFwaDtcbiAgICB0aGlzLmQzR3JhcGggPSB7XG4gICAgICBub2RlczogWy4uLnRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5tYXAobiA9PiAoeyAuLi5uIH0pKV0gYXMgYW55LFxuICAgICAgZWRnZXM6IFsuLi50aGlzLmlucHV0R3JhcGguZWRnZXMubWFwKGUgPT4gKHsgLi4uZSB9KSldIGFzIGFueVxuICAgIH07XG4gICAgdGhpcy5vdXRwdXRHcmFwaCA9IHtcbiAgICAgIG5vZGVzOiBbXSxcbiAgICAgIGVkZ2VzOiBbXSxcbiAgICAgIGVkZ2VMYWJlbHM6IFtdXG4gICAgfTtcbiAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMub3V0cHV0R3JhcGgpO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZm9yY2UpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2VcbiAgICAgICAgLm5vZGVzKHRoaXMuZDNHcmFwaC5ub2RlcylcbiAgICAgICAgLmZvcmNlKCdsaW5rJywgdGhpcy5zZXR0aW5ncy5mb3JjZUxpbmsubGlua3ModGhpcy5kM0dyYXBoLmVkZ2VzKSlcbiAgICAgICAgLmFscGhhKDAuNSlcbiAgICAgICAgLnJlc3RhcnQoKVxuICAgICAgICAub24oJ3RpY2snLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLmQzR3JhcGhUb091dHB1dEdyYXBoKHRoaXMuZDNHcmFwaCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IE9ic2VydmFibGU8R3JhcGg+IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICBpZiAoc2V0dGluZ3MuZm9yY2UpIHtcbiAgICAgIHNldHRpbmdzLmZvcmNlXG4gICAgICAgIC5ub2Rlcyh0aGlzLmQzR3JhcGgubm9kZXMpXG4gICAgICAgIC5mb3JjZSgnbGluaycsIHNldHRpbmdzLmZvcmNlTGluay5saW5rcyh0aGlzLmQzR3JhcGguZWRnZXMpKVxuICAgICAgICAuYWxwaGEoMC41KVxuICAgICAgICAucmVzdGFydCgpXG4gICAgICAgIC5vbigndGljaycsICgpID0+IHtcbiAgICAgICAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMuZDNHcmFwaFRvT3V0cHV0R3JhcGgodGhpcy5kM0dyYXBoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoJC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGQzR3JhcGhUb091dHB1dEdyYXBoKGQzR3JhcGg6IEQzR3JhcGgpOiBHcmFwaCB7XG4gICAgdGhpcy5vdXRwdXRHcmFwaC5ub2RlcyA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5tYXAoKG5vZGU6IE1lcmdlZE5vZGUpID0+ICh7XG4gICAgICAuLi5ub2RlLFxuICAgICAgaWQ6IG5vZGUuaWQgfHwgaWQoKSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IG5vZGUueCxcbiAgICAgICAgeTogbm9kZS55XG4gICAgICB9LFxuICAgICAgZGltZW5zaW9uOiB7XG4gICAgICAgIHdpZHRoOiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwLFxuICAgICAgICBoZWlnaHQ6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwXG4gICAgICB9LFxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7bm9kZS54IC0gKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjApIC8gMiB8fCAwfSwgJHtub2RlLnkgLVxuICAgICAgICAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLmhlaWdodCkgfHwgMjApIC8gMiB8fCAwfSlgXG4gICAgfSkpO1xuXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlcyA9IHRoaXMuZDNHcmFwaC5lZGdlcy5tYXAoZWRnZSA9PiAoe1xuICAgICAgLi4uZWRnZSxcbiAgICAgIHNvdXJjZTogdG9EM05vZGUoZWRnZS5zb3VyY2UpLmlkLFxuICAgICAgdGFyZ2V0OiB0b0QzTm9kZShlZGdlLnRhcmdldCkuaWQsXG4gICAgICBwb2ludHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHg6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS54LFxuICAgICAgICAgIHk6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS55XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB4OiB0b0QzTm9kZShlZGdlLnRhcmdldCkueCxcbiAgICAgICAgICB5OiB0b0QzTm9kZShlZGdlLnRhcmdldCkueVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSkpO1xuXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlTGFiZWxzID0gdGhpcy5vdXRwdXRHcmFwaC5lZGdlcztcbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaDtcbiAgfVxuXG4gIG9uRHJhZ1N0YXJ0KGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5zZXR0aW5ncy5mb3JjZS5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kcmFnZ2luZ1N0YXJ0ID0geyB4OiAkZXZlbnQueCAtIG5vZGUueCwgeTogJGV2ZW50LnkgLSBub2RlLnkgfTtcbiAgICBub2RlLmZ4ID0gJGV2ZW50LnggLSB0aGlzLmRyYWdnaW5nU3RhcnQueDtcbiAgICBub2RlLmZ5ID0gJGV2ZW50LnkgLSB0aGlzLmRyYWdnaW5nU3RhcnQueTtcbiAgfVxuXG4gIG9uRHJhZyhkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghZHJhZ2dpbmdOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmQzR3JhcGgubm9kZXMuZmluZChkM05vZGUgPT4gZDNOb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBub2RlLmZ4ID0gJGV2ZW50LnggLSB0aGlzLmRyYWdnaW5nU3RhcnQueDtcbiAgICBub2RlLmZ5ID0gJGV2ZW50LnkgLSB0aGlzLmRyYWdnaW5nU3RhcnQueTtcbiAgfVxuXG4gIG9uRHJhZ0VuZChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghZHJhZ2dpbmdOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmQzR3JhcGgubm9kZXMuZmluZChkM05vZGUgPT4gZDNOb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UuYWxwaGFUYXJnZXQoMCk7XG4gICAgbm9kZS5meCA9IHVuZGVmaW5lZDtcbiAgICBub2RlLmZ5ID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcbmltcG9ydCB7IE5vZGUsIENsdXN0ZXJOb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL25vZGUubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XG5pbXBvcnQgeyBkM2FkYXB0b3IsIElEM1N0eWxlTGF5b3V0QWRhcHRvciwgTGF5b3V0IGFzIENvbGFMYXlvdXQsIEdyb3VwLCBJbnB1dE5vZGUsIExpbmssIFJlY3RhbmdsZSB9IGZyb20gJ3dlYmNvbGEnO1xuaW1wb3J0ICogYXMgZDNEaXNwYXRjaCBmcm9tICdkMy1kaXNwYXRjaCc7XG5pbXBvcnQgKiBhcyBkM0ZvcmNlIGZyb20gJ2QzLWZvcmNlJztcbmltcG9ydCAqIGFzIGQzVGltZXIgZnJvbSAnZDMtdGltZXInO1xuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnQHN3aW1sYW5lL25neC1jaGFydHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbGFGb3JjZURpcmVjdGVkU2V0dGluZ3Mge1xuICBmb3JjZT86IENvbGFMYXlvdXQgJiBJRDNTdHlsZUxheW91dEFkYXB0b3I7XG4gIGZvcmNlTW9kaWZpZXJGbj86IChmb3JjZTogQ29sYUxheW91dCAmIElEM1N0eWxlTGF5b3V0QWRhcHRvcikgPT4gQ29sYUxheW91dCAmIElEM1N0eWxlTGF5b3V0QWRhcHRvcjtcbiAgb25UaWNrTGlzdGVuZXI/OiAoaW50ZXJuYWxHcmFwaDogQ29sYUdyYXBoKSA9PiB2b2lkO1xuICB2aWV3RGltZW5zaW9ucz86IFZpZXdEaW1lbnNpb25zO1xufVxuZXhwb3J0IGludGVyZmFjZSBDb2xhR3JhcGgge1xuICBncm91cHM6IEdyb3VwW107XG4gIG5vZGVzOiBJbnB1dE5vZGVbXTtcbiAgbGlua3M6IEFycmF5PExpbms8bnVtYmVyPj47XG59XG5leHBvcnQgZnVuY3Rpb24gdG9Ob2RlKG5vZGVzOiBJbnB1dE5vZGVbXSwgbm9kZVJlZjogSW5wdXROb2RlIHwgbnVtYmVyKTogSW5wdXROb2RlIHtcbiAgaWYgKHR5cGVvZiBub2RlUmVmID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBub2Rlc1tub2RlUmVmXTtcbiAgfVxuICByZXR1cm4gbm9kZVJlZjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbGFGb3JjZURpcmVjdGVkTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcbiAgZGVmYXVsdFNldHRpbmdzOiBDb2xhRm9yY2VEaXJlY3RlZFNldHRpbmdzID0ge1xuICAgIGZvcmNlOiBkM2FkYXB0b3Ioe1xuICAgICAgLi4uZDNEaXNwYXRjaCxcbiAgICAgIC4uLmQzRm9yY2UsXG4gICAgICAuLi5kM1RpbWVyXG4gICAgfSlcbiAgICAgIC5saW5rRGlzdGFuY2UoMTUwKVxuICAgICAgLmF2b2lkT3ZlcmxhcHModHJ1ZSksXG4gICAgdmlld0RpbWVuc2lvbnM6IHtcbiAgICAgIHdpZHRoOiA2MDAsXG4gICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgIHhPZmZzZXQ6IDBcbiAgICB9XG4gIH07XG4gIHNldHRpbmdzOiBDb2xhRm9yY2VEaXJlY3RlZFNldHRpbmdzID0ge307XG5cbiAgaW5wdXRHcmFwaDogR3JhcGg7XG4gIG91dHB1dEdyYXBoOiBHcmFwaDtcbiAgaW50ZXJuYWxHcmFwaDogQ29sYUdyYXBoICYgeyBncm91cExpbmtzPzogRWRnZVtdIH07XG4gIG91dHB1dEdyYXBoJDogU3ViamVjdDxHcmFwaD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGRyYWdnaW5nU3RhcnQ6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcblxuICBydW4oZ3JhcGg6IEdyYXBoKTogT2JzZXJ2YWJsZTxHcmFwaD4ge1xuICAgIHRoaXMuaW5wdXRHcmFwaCA9IGdyYXBoO1xuICAgIGlmICghdGhpcy5pbnB1dEdyYXBoLmNsdXN0ZXJzKSB7XG4gICAgICB0aGlzLmlucHV0R3JhcGguY2x1c3RlcnMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5pbnRlcm5hbEdyYXBoID0ge1xuICAgICAgbm9kZXM6IFtcbiAgICAgICAgLi4udGhpcy5pbnB1dEdyYXBoLm5vZGVzLm1hcChuID0+ICh7XG4gICAgICAgICAgLi4ubixcbiAgICAgICAgICB3aWR0aDogbi5kaW1lbnNpb24gPyBuLmRpbWVuc2lvbi53aWR0aCA6IDIwLFxuICAgICAgICAgIGhlaWdodDogbi5kaW1lbnNpb24gPyBuLmRpbWVuc2lvbi5oZWlnaHQgOiAyMFxuICAgICAgICB9KSlcbiAgICAgIF0gYXMgYW55LFxuICAgICAgZ3JvdXBzOiBbXG4gICAgICAgIC4uLnRoaXMuaW5wdXRHcmFwaC5jbHVzdGVycy5tYXAoXG4gICAgICAgICAgKGNsdXN0ZXIpOiBHcm91cCA9PiAoe1xuICAgICAgICAgICAgcGFkZGluZzogNSxcbiAgICAgICAgICAgIGdyb3VwczogY2x1c3Rlci5jaGlsZE5vZGVJZHNcbiAgICAgICAgICAgICAgLm1hcChub2RlSWQgPT4gPGFueT50aGlzLmlucHV0R3JhcGguY2x1c3RlcnMuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKSlcbiAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHggPj0gMCksXG4gICAgICAgICAgICBsZWF2ZXM6IGNsdXN0ZXIuY2hpbGROb2RlSWRzXG4gICAgICAgICAgICAgIC5tYXAobm9kZUlkID0+IDxhbnk+dGhpcy5pbnB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZCkpXG4gICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4ID49IDApXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgXSxcbiAgICAgIGxpbmtzOiBbXG4gICAgICAgIC4uLnRoaXMuaW5wdXRHcmFwaC5lZGdlc1xuICAgICAgICAgIC5tYXAoZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VOb2RlSW5kZXggPSB0aGlzLmlucHV0R3JhcGgubm9kZXMuZmluZEluZGV4KG5vZGUgPT4gZS5zb3VyY2UgPT09IG5vZGUuaWQpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZUluZGV4ID0gdGhpcy5pbnB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChub2RlID0+IGUudGFyZ2V0ID09PSBub2RlLmlkKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VOb2RlSW5kZXggPT09IC0xIHx8IHRhcmdldE5vZGVJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmUsXG4gICAgICAgICAgICAgIHNvdXJjZTogc291cmNlTm9kZUluZGV4LFxuICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldE5vZGVJbmRleFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoeCA9PiAhIXgpXG4gICAgICBdIGFzIGFueSxcbiAgICAgIGdyb3VwTGlua3M6IFtcbiAgICAgICAgLi4udGhpcy5pbnB1dEdyYXBoLmVkZ2VzXG4gICAgICAgICAgLm1hcChlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZU5vZGVJbmRleCA9IHRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgobm9kZSA9PiBlLnNvdXJjZSA9PT0gbm9kZS5pZCk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlSW5kZXggPSB0aGlzLmlucHV0R3JhcGgubm9kZXMuZmluZEluZGV4KG5vZGUgPT4gZS50YXJnZXQgPT09IG5vZGUuaWQpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZU5vZGVJbmRleCA+PSAwICYmIHRhcmdldE5vZGVJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoeCA9PiAhIXgpXG4gICAgICBdXG4gICAgfTtcbiAgICB0aGlzLm91dHB1dEdyYXBoID0ge1xuICAgICAgbm9kZXM6IFtdLFxuICAgICAgY2x1c3RlcnM6IFtdLFxuICAgICAgZWRnZXM6IFtdLFxuICAgICAgZWRnZUxhYmVsczogW11cbiAgICB9O1xuICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5vdXRwdXRHcmFwaCk7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5mb3JjZSkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5mb3JjZSA9IHRoaXMuc2V0dGluZ3MuZm9yY2VcbiAgICAgICAgLm5vZGVzKHRoaXMuaW50ZXJuYWxHcmFwaC5ub2RlcylcbiAgICAgICAgLmdyb3Vwcyh0aGlzLmludGVybmFsR3JhcGguZ3JvdXBzKVxuICAgICAgICAubGlua3ModGhpcy5pbnRlcm5hbEdyYXBoLmxpbmtzKVxuICAgICAgICAuYWxwaGEoMC41KVxuICAgICAgICAub24oJ3RpY2snLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Mub25UaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3Mub25UaWNrTGlzdGVuZXIodGhpcy5pbnRlcm5hbEdyYXBoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLmludGVybmFsR3JhcGhUb091dHB1dEdyYXBoKHRoaXMuaW50ZXJuYWxHcmFwaCkpO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnZpZXdEaW1lbnNpb25zKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UgPSB0aGlzLnNldHRpbmdzLmZvcmNlLnNpemUoW1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Mudmlld0RpbWVuc2lvbnMud2lkdGgsXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy52aWV3RGltZW5zaW9ucy5oZWlnaHRcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5mb3JjZU1vZGlmaWVyRm4pIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5mb3JjZSA9IHRoaXMuc2V0dGluZ3MuZm9yY2VNb2RpZmllckZuKHRoaXMuc2V0dGluZ3MuZm9yY2UpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXR0aW5ncy5mb3JjZS5zdGFydCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoJC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogT2JzZXJ2YWJsZTxHcmFwaD4ge1xuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmIChzZXR0aW5ncy5mb3JjZSkge1xuICAgICAgc2V0dGluZ3MuZm9yY2Uuc3RhcnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBpbnRlcm5hbEdyYXBoVG9PdXRwdXRHcmFwaChpbnRlcm5hbEdyYXBoOiBhbnkpOiBHcmFwaCB7XG4gICAgdGhpcy5vdXRwdXRHcmFwaC5ub2RlcyA9IGludGVybmFsR3JhcGgubm9kZXMubWFwKG5vZGUgPT4gKHtcbiAgICAgIC4uLm5vZGUsXG4gICAgICBpZDogbm9kZS5pZCB8fCBpZCgpLFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogbm9kZS54LFxuICAgICAgICB5OiBub2RlLnlcbiAgICAgIH0sXG4gICAgICBkaW1lbnNpb246IHtcbiAgICAgICAgd2lkdGg6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjAsXG4gICAgICAgIGhlaWdodDogKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLmhlaWdodCkgfHwgMjBcbiAgICAgIH0sXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtub2RlLnggLSAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCkgLyAyIHx8IDB9LCAke25vZGUueSAtXG4gICAgICAgICgobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMCkgLyAyIHx8IDB9KWBcbiAgICB9KSk7XG5cbiAgICB0aGlzLm91dHB1dEdyYXBoLmVkZ2VzID0gaW50ZXJuYWxHcmFwaC5saW5rc1xuICAgICAgLm1hcChlZGdlID0+IHtcbiAgICAgICAgY29uc3Qgc291cmNlOiBhbnkgPSB0b05vZGUoaW50ZXJuYWxHcmFwaC5ub2RlcywgZWRnZS5zb3VyY2UpO1xuICAgICAgICBjb25zdCB0YXJnZXQ6IGFueSA9IHRvTm9kZShpbnRlcm5hbEdyYXBoLm5vZGVzLCBlZGdlLnRhcmdldCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uZWRnZSxcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZS5pZCxcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldC5pZCxcbiAgICAgICAgICBwb2ludHM6IFtcbiAgICAgICAgICAgIChzb3VyY2UuYm91bmRzIGFzIFJlY3RhbmdsZSkucmF5SW50ZXJzZWN0aW9uKHRhcmdldC5ib3VuZHMuY3goKSwgdGFyZ2V0LmJvdW5kcy5jeSgpKSxcbiAgICAgICAgICAgICh0YXJnZXQuYm91bmRzIGFzIFJlY3RhbmdsZSkucmF5SW50ZXJzZWN0aW9uKHNvdXJjZS5ib3VuZHMuY3goKSwgc291cmNlLmJvdW5kcy5jeSgpKVxuICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgICAuY29uY2F0KFxuICAgICAgICBpbnRlcm5hbEdyYXBoLmdyb3VwTGlua3MubWFwKGdyb3VwTGluayA9PiB7XG4gICAgICAgICAgY29uc3Qgc291cmNlTm9kZSA9IGludGVybmFsR3JhcGgubm9kZXMuZmluZChmb3VuZE5vZGUgPT4gKGZvdW5kTm9kZSBhcyBhbnkpLmlkID09PSBncm91cExpbmsuc291cmNlKTtcbiAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gaW50ZXJuYWxHcmFwaC5ub2Rlcy5maW5kKGZvdW5kTm9kZSA9PiAoZm91bmROb2RlIGFzIGFueSkuaWQgPT09IGdyb3VwTGluay50YXJnZXQpO1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9XG4gICAgICAgICAgICBzb3VyY2VOb2RlIHx8IGludGVybmFsR3JhcGguZ3JvdXBzLmZpbmQoZm91bmRHcm91cCA9PiAoZm91bmRHcm91cCBhcyBhbnkpLmlkID09PSBncm91cExpbmsuc291cmNlKTtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPVxuICAgICAgICAgICAgdGFyZ2V0Tm9kZSB8fCBpbnRlcm5hbEdyYXBoLmdyb3Vwcy5maW5kKGZvdW5kR3JvdXAgPT4gKGZvdW5kR3JvdXAgYXMgYW55KS5pZCA9PT0gZ3JvdXBMaW5rLnRhcmdldCk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmdyb3VwTGluayxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLmlkLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQuaWQsXG4gICAgICAgICAgICBwb2ludHM6IFtcbiAgICAgICAgICAgICAgKHNvdXJjZS5ib3VuZHMgYXMgUmVjdGFuZ2xlKS5yYXlJbnRlcnNlY3Rpb24odGFyZ2V0LmJvdW5kcy5jeCgpLCB0YXJnZXQuYm91bmRzLmN5KCkpLFxuICAgICAgICAgICAgICAodGFyZ2V0LmJvdW5kcyBhcyBSZWN0YW5nbGUpLnJheUludGVyc2VjdGlvbihzb3VyY2UuYm91bmRzLmN4KCksIHNvdXJjZS5ib3VuZHMuY3koKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIHRoaXMub3V0cHV0R3JhcGguY2x1c3RlcnMgPSBpbnRlcm5hbEdyYXBoLmdyb3Vwcy5tYXAoXG4gICAgICAoZ3JvdXAsIGluZGV4KTogQ2x1c3Rlck5vZGUgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dEdyb3VwID0gdGhpcy5pbnB1dEdyYXBoLmNsdXN0ZXJzW2luZGV4XTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pbnB1dEdyb3VwLFxuICAgICAgICAgIGRpbWVuc2lvbjoge1xuICAgICAgICAgICAgd2lkdGg6IGdyb3VwLmJvdW5kcyA/IGdyb3VwLmJvdW5kcy53aWR0aCgpIDogMjAsXG4gICAgICAgICAgICBoZWlnaHQ6IGdyb3VwLmJvdW5kcyA/IGdyb3VwLmJvdW5kcy5oZWlnaHQoKSA6IDIwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgeDogZ3JvdXAuYm91bmRzID8gZ3JvdXAuYm91bmRzLnggKyBncm91cC5ib3VuZHMud2lkdGgoKSAvIDIgOiAwLFxuICAgICAgICAgICAgeTogZ3JvdXAuYm91bmRzID8gZ3JvdXAuYm91bmRzLnkgKyBncm91cC5ib3VuZHMuaGVpZ2h0KCkgLyAyIDogMFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICApO1xuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZUxhYmVscyA9IHRoaXMub3V0cHV0R3JhcGguZWRnZXM7XG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGg7XG4gIH1cblxuICBvbkRyYWdTdGFydChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMub3V0cHV0R3JhcGgubm9kZXMuZmluZEluZGV4KGZvdW5kTm9kZSA9PiBmb3VuZE5vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuaW50ZXJuYWxHcmFwaC5ub2Rlc1tub2RlSW5kZXhdO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRyYWdnaW5nU3RhcnQgPSB7IHg6IG5vZGUueCAtICRldmVudC54LCB5OiBub2RlLnkgLSAkZXZlbnQueSB9O1xuICAgIG5vZGUuZml4ZWQgPSAxO1xuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2Uuc3RhcnQoKTtcbiAgfVxuXG4gIG9uRHJhZyhkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghZHJhZ2dpbmdOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMub3V0cHV0R3JhcGgubm9kZXMuZmluZEluZGV4KGZvdW5kTm9kZSA9PiBmb3VuZE5vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuaW50ZXJuYWxHcmFwaC5ub2Rlc1tub2RlSW5kZXhdO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBub2RlLnggPSB0aGlzLmRyYWdnaW5nU3RhcnQueCArICRldmVudC54O1xuICAgIG5vZGUueSA9IHRoaXMuZHJhZ2dpbmdTdGFydC55ICsgJGV2ZW50Lnk7XG4gIH1cblxuICBvbkRyYWdFbmQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm91dHB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChmb3VuZE5vZGUgPT4gZm91bmROb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmludGVybmFsR3JhcGgubm9kZXNbbm9kZUluZGV4XTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBub2RlLmZpeGVkID0gMDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBEYWdyZUxheW91dCB9IGZyb20gJy4vZGFncmUnO1xuaW1wb3J0IHsgRGFncmVDbHVzdGVyTGF5b3V0IH0gZnJvbSAnLi9kYWdyZUNsdXN0ZXInO1xuaW1wb3J0IHsgRGFncmVOb2Rlc09ubHlMYXlvdXQgfSBmcm9tICcuL2RhZ3JlTm9kZXNPbmx5JztcbmltcG9ydCB7IEQzRm9yY2VEaXJlY3RlZExheW91dCB9IGZyb20gJy4vZDNGb3JjZURpcmVjdGVkJztcbmltcG9ydCB7IENvbGFGb3JjZURpcmVjdGVkTGF5b3V0IH0gZnJvbSAnLi9jb2xhRm9yY2VEaXJlY3RlZCc7XG5cbmNvbnN0IGxheW91dHMgPSB7XG4gIGRhZ3JlOiBEYWdyZUxheW91dCxcbiAgZGFncmVDbHVzdGVyOiBEYWdyZUNsdXN0ZXJMYXlvdXQsXG4gIGRhZ3JlTm9kZXNPbmx5OiBEYWdyZU5vZGVzT25seUxheW91dCxcbiAgZDNGb3JjZURpcmVjdGVkOiBEM0ZvcmNlRGlyZWN0ZWRMYXlvdXQsXG4gIGNvbGFGb3JjZURpcmVjdGVkOiBDb2xhRm9yY2VEaXJlY3RlZExheW91dFxufTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExheW91dFNlcnZpY2Uge1xuICBnZXRMYXlvdXQobmFtZTogc3RyaW5nKTogTGF5b3V0IHtcbiAgICBpZiAobGF5b3V0c1tuYW1lXSkge1xuICAgICAgcmV0dXJuIG5ldyBsYXlvdXRzW25hbWVdKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBsYXlvdXQgdHlwZSAnJHtuYW1lfSdgKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIHJlbmFtZSB0cmFuc2l0aW9uIGR1ZSB0byBjb25mbGljdCB3aXRoIGQzIHRyYW5zaXRpb25cbmltcG9ydCB7IGFuaW1hdGUsIHN0eWxlLCB0cmFuc2l0aW9uIGFzIG5nVHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZUNoYXJ0Q29tcG9uZW50LFxuICBDaGFydENvbXBvbmVudCxcbiAgQ29sb3JIZWxwZXIsXG4gIFZpZXdEaW1lbnNpb25zLFxuICBjYWxjdWxhdGVWaWV3RGltZW5zaW9uc1xufSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0ICogYXMgc2hhcGUgZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0ICdkMy10cmFuc2l0aW9uJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaWRlbnRpdHksIHNjYWxlLCB0b1NWRywgdHJhbnNmb3JtLCB0cmFuc2xhdGUgfSBmcm9tICd0cmFuc2Zvcm1hdGlvbi1tYXRyaXgnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uL21vZGVscy9ub2RlLm1vZGVsJztcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vdXRpbHMvaWQnO1xuXG4vKipcbiAqIE1hdHJpeFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdHJpeCB7XG4gIGE6IG51bWJlcjtcbiAgYjogbnVtYmVyO1xuICBjOiBudW1iZXI7XG4gIGQ6IG51bWJlcjtcbiAgZTogbnVtYmVyO1xuICBmOiBudW1iZXI7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1ncmFwaCcsXG4gIHN0eWxlczogW2AuZ3JhcGh7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5ncmFwaCAuZWRnZXtzdHJva2U6IzY2NjtmaWxsOm5vbmV9LmdyYXBoIC5lZGdlIC5lZGdlLWxhYmVse3N0cm9rZTpub25lO2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzI1MWUxZX0uZ3JhcGggLnBhbm5pbmctcmVjdHtmaWxsOnRyYW5zcGFyZW50O2N1cnNvcjptb3ZlO3dpZHRoOjEwMDAwMDBweH0uZ3JhcGggLm5vZGUtZ3JvdXAgLm5vZGU6Zm9jdXN7b3V0bGluZTowfS5ncmFwaCAuY2x1c3RlciByZWN0e29wYWNpdHk6LjJ9YF0sXG4gIHRlbXBsYXRlOiBgPG5neC1jaGFydHMtY2hhcnRcbiAgW3ZpZXddPVwiW3dpZHRoLCBoZWlnaHRdXCJcbiAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcbiAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXG4gIChsZWdlbmRMYWJlbENsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiXG4gIChsZWdlbmRMYWJlbERlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIlxuICBtb3VzZVdoZWVsXG4gIChtb3VzZVdoZWVsVXApPVwib25ab29tKCRldmVudCwgJ2luJylcIlxuICAobW91c2VXaGVlbERvd24pPVwib25ab29tKCRldmVudCwgJ291dCcpXCJcbj5cbiAgPHN2ZzpnXG4gICAgKm5nSWY9XCJpbml0aWFsaXplZCAmJiBncmFwaFwiXG4gICAgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiXG4gICAgKHRvdWNoc3RhcnQpPVwib25Ub3VjaFN0YXJ0KCRldmVudClcIlxuICAgICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxuICAgIGNsYXNzPVwiZ3JhcGggY2hhcnRcIlxuICA+XG4gICAgPGRlZnM+XG4gICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJkZWZzVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJkZWZzVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgPHN2ZzpwYXRoXG4gICAgICAgIGNsYXNzPVwidGV4dC1wYXRoXCJcbiAgICAgICAgKm5nRm9yPVwibGV0IGxpbmsgb2YgZ3JhcGguZWRnZXNcIlxuICAgICAgICBbYXR0ci5kXT1cImxpbmsudGV4dFBhdGhcIlxuICAgICAgICBbYXR0ci5pZF09XCJsaW5rLmlkXCJcbiAgICAgID48L3N2ZzpwYXRoPlxuICAgIDwvZGVmcz5cbiAgICA8c3ZnOnJlY3RcbiAgICAgIGNsYXNzPVwicGFubmluZy1yZWN0XCJcbiAgICAgIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKiAxMDBcIlxuICAgICAgW2F0dHIuaGVpZ2h0XT1cImRpbXMuaGVpZ2h0ICogMTAwXCJcbiAgICAgIFthdHRyLnRyYW5zZm9ybV09XCIndHJhbnNsYXRlKCcgKyAoLWRpbXMud2lkdGggfHwgMCkgKiA1MCArICcsJyArICgtZGltcy5oZWlnaHQgfHwgMCkgKiA1MCArICcpJ1wiXG4gICAgICAobW91c2Vkb3duKT1cImlzUGFubmluZyA9IHRydWVcIlxuICAgIC8+XG4gICAgPHN2ZzpnIGNsYXNzPVwiY2x1c3RlcnNcIj5cbiAgICAgIDxzdmc6Z1xuICAgICAgICAjY2x1c3RlckVsZW1lbnRcbiAgICAgICAgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGguY2x1c3RlcnM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCJcbiAgICAgICAgY2xhc3M9XCJub2RlLWdyb3VwXCJcbiAgICAgICAgW2lkXT1cIm5vZGUuaWRcIlxuICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxuICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlKVwiXG4gICAgICA+XG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICpuZ0lmPVwiY2x1c3RlclRlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjbHVzdGVyVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCJcbiAgICAgICAgPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxzdmc6ZyAqbmdJZj1cIiFjbHVzdGVyVGVtcGxhdGVcIiBjbGFzcz1cIm5vZGUgY2x1c3RlclwiPlxuICAgICAgICAgIDxzdmc6cmVjdFxuICAgICAgICAgICAgW2F0dHIud2lkdGhdPVwibm9kZS5kaW1lbnNpb24ud2lkdGhcIlxuICAgICAgICAgICAgW2F0dHIuaGVpZ2h0XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodFwiXG4gICAgICAgICAgICBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHN2Zzp0ZXh0IGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIiBbYXR0ci54XT1cIjEwXCIgW2F0dHIueV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCI+XG4gICAgICAgICAgICB7eyBub2RlLmxhYmVsIH19XG4gICAgICAgICAgPC9zdmc6dGV4dD5cbiAgICAgICAgPC9zdmc6Zz5cbiAgICAgIDwvc3ZnOmc+XG4gICAgPC9zdmc6Zz5cbiAgICA8c3ZnOmcgY2xhc3M9XCJsaW5rc1wiPlxuICAgICAgPHN2ZzpnICNsaW5rRWxlbWVudCAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlczsgdHJhY2tCeTogdHJhY2tMaW5rQnlcIiBjbGFzcz1cImxpbmstZ3JvdXBcIiBbaWRdPVwibGluay5pZFwiPlxuICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAqbmdJZj1cImxpbmtUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlua1RlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IGxpbmsgfVwiXG4gICAgICAgID48L25nLXRlbXBsYXRlPlxuICAgICAgICA8c3ZnOnBhdGggKm5nSWY9XCIhbGlua1RlbXBsYXRlXCIgY2xhc3M9XCJlZGdlXCIgW2F0dHIuZF09XCJsaW5rLmxpbmVcIiAvPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuICAgIDxzdmc6ZyBjbGFzcz1cIm5vZGVzXCI+XG4gICAgICA8c3ZnOmdcbiAgICAgICAgI25vZGVFbGVtZW50XG4gICAgICAgICpuZ0Zvcj1cImxldCBub2RlIG9mIGdyYXBoLm5vZGVzOyB0cmFja0J5OiB0cmFja05vZGVCeVwiXG4gICAgICAgIGNsYXNzPVwibm9kZS1ncm91cFwiXG4gICAgICAgIFtpZF09XCJub2RlLmlkXCJcbiAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cIm5vZGUudHJhbnNmb3JtXCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSlcIlxuICAgICAgICAobW91c2Vkb3duKT1cIm9uTm9kZU1vdXNlRG93bigkZXZlbnQsIG5vZGUpXCJcbiAgICAgID5cbiAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgKm5nSWY9XCJub2RlVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5vZGVUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlIH1cIlxuICAgICAgICA+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPHN2ZzpjaXJjbGVcbiAgICAgICAgICAqbmdJZj1cIiFub2RlVGVtcGxhdGVcIlxuICAgICAgICAgIHI9XCIxMFwiXG4gICAgICAgICAgW2F0dHIuY3hdPVwibm9kZS5kaW1lbnNpb24ud2lkdGggLyAyXCJcbiAgICAgICAgICBbYXR0ci5jeV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCJcbiAgICAgICAgICBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIlxuICAgICAgICAvPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuICA8L3N2ZzpnPlxuPC9uZ3gtY2hhcnRzLWNoYXJ0PlxuYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdsaW5rJywgW25nVHJhbnNpdGlvbignKiA9PiAqJywgW2FuaW1hdGUoNTAwLCBzdHlsZSh7IHRyYW5zZm9ybTogJyonIH0pKV0pXSldXG59KVxuZXhwb3J0IGNsYXNzIEdyYXBoQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIGxlZ2VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBub2RlczogTm9kZVtdID0gW107XG4gIEBJbnB1dCgpIGNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdID0gW107XG4gIEBJbnB1dCgpIGxpbmtzOiBFZGdlW10gPSBbXTtcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcbiAgQElucHV0KCkgY3VydmU6IGFueTtcbiAgQElucHV0KCkgZHJhZ2dpbmdFbmFibGVkID0gdHJ1ZTtcbiAgQElucHV0KCkgbm9kZUhlaWdodDogbnVtYmVyO1xuICBASW5wdXQoKSBub2RlTWF4SGVpZ2h0OiBudW1iZXI7XG4gIEBJbnB1dCgpIG5vZGVNaW5IZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgbm9kZVdpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIG5vZGVNaW5XaWR0aDogbnVtYmVyO1xuICBASW5wdXQoKSBub2RlTWF4V2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgcGFubmluZ0VuYWJsZWQgPSB0cnVlO1xuICBASW5wdXQoKSBlbmFibGVab29tID0gdHJ1ZTtcbiAgQElucHV0KCkgem9vbVNwZWVkID0gMC4xO1xuICBASW5wdXQoKSBtaW5ab29tTGV2ZWwgPSAwLjE7XG4gIEBJbnB1dCgpIG1heFpvb21MZXZlbCA9IDQuMDtcbiAgQElucHV0KCkgYXV0b1pvb20gPSBmYWxzZTtcbiAgQElucHV0KCkgcGFuT25ab29tID0gdHJ1ZTtcbiAgQElucHV0KCkgYXV0b0NlbnRlciA9IGZhbHNlO1xuICBASW5wdXQoKSB1cGRhdGUkOiBPYnNlcnZhYmxlPGFueT47XG4gIEBJbnB1dCgpIGNlbnRlciQ6IE9ic2VydmFibGU8YW55PjtcbiAgQElucHV0KCkgem9vbVRvRml0JDogT2JzZXJ2YWJsZTxhbnk+O1xuICBASW5wdXQoKSBwYW5Ub05vZGUkOiBPYnNlcnZhYmxlPGFueT47XG4gIEBJbnB1dCgpIGxheW91dDogc3RyaW5nIHwgTGF5b3V0O1xuICBASW5wdXQoKSBsYXlvdXRTZXR0aW5nczogYW55O1xuXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHpvb21DaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBDb250ZW50Q2hpbGQoJ2xpbmtUZW1wbGF0ZScpIGxpbmtUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZCgnbm9kZVRlbXBsYXRlJykgbm9kZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKCdjbHVzdGVyVGVtcGxhdGUnKSBjbHVzdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoJ2RlZnNUZW1wbGF0ZScpIGRlZnNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAVmlld0NoaWxkKENoYXJ0Q29tcG9uZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgY2hhcnQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGRyZW4oJ25vZGVFbGVtZW50Jykgbm9kZUVsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG4gIEBWaWV3Q2hpbGRyZW4oJ2xpbmtFbGVtZW50JykgbGlua0VsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG5cbiAgZ3JhcGhTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgY29sb3JzOiBDb2xvckhlbHBlcjtcbiAgZGltczogVmlld0RpbWVuc2lvbnM7XG4gIG1hcmdpbiA9IFswLCAwLCAwLCAwXTtcbiAgcmVzdWx0cyA9IFtdO1xuICBzZXJpZXNEb21haW46IGFueTtcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XG4gIGxlZ2VuZE9wdGlvbnM6IGFueTtcbiAgaXNQYW5uaW5nID0gZmFsc2U7XG4gIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgZHJhZ2dpbmdOb2RlOiBOb2RlO1xuICBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBncmFwaDogR3JhcGg7XG4gIGdyYXBoRGltczogYW55ID0geyB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XG4gIF9vbGRMaW5rczogRWRnZVtdID0gW107XG4gIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBNYXRyaXggPSBpZGVudGl0eSgpO1xuICBfdG91Y2hMYXN0WCA9IG51bGw7XG4gIF90b3VjaExhc3RZID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXG4gICAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHpvbmUsIGNkKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdyb3VwUmVzdWx0c0J5OiAobm9kZTogYW55KSA9PiBzdHJpbmcgPSBub2RlID0+IG5vZGUubGFiZWw7XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCB6b29tIGxldmVsXG4gICAqL1xuICBnZXQgem9vbUxldmVsKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmE7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcbiAgICovXG4gIEBJbnB1dCgnem9vbUxldmVsJylcbiAgc2V0IHpvb21MZXZlbChsZXZlbCkge1xuICAgIHRoaXMuem9vbVRvKE51bWJlcihsZXZlbCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBnZXQgcGFuT2Zmc2V0WCgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBASW5wdXQoJ3Bhbk9mZnNldFgnKVxuICBzZXQgcGFuT2Zmc2V0WCh4KSB7XG4gICAgdGhpcy5wYW5UbyhOdW1iZXIoeCksIG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBnZXQgcGFuT2Zmc2V0WSgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBASW5wdXQoJ3Bhbk9mZnNldFknKVxuICBzZXQgcGFuT2Zmc2V0WSh5KSB7XG4gICAgdGhpcy5wYW5UbyhudWxsLCBOdW1iZXIoeSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudXBkYXRlJCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMudXBkYXRlJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlciQpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLmNlbnRlciQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNlbnRlcigpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuem9vbVRvRml0JCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMuem9vbVRvRml0JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhblRvTm9kZSQpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLnBhblRvTm9kZSQuc3Vic2NyaWJlKChub2RlSWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucGFuVG9Ob2RlSWQobm9kZUlkKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgbGF5b3V0LCBsYXlvdXRTZXR0aW5ncywgbm9kZXMsIGNsdXN0ZXJzLCBsaW5rcyB9ID0gY2hhbmdlcztcbiAgICB0aGlzLnNldExheW91dCh0aGlzLmxheW91dCk7XG4gICAgaWYgKGxheW91dFNldHRpbmdzKSB7XG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgc2V0TGF5b3V0KGxheW91dDogc3RyaW5nIHwgTGF5b3V0KTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIGlmICghbGF5b3V0KSB7XG4gICAgICBsYXlvdXQgPSAnZGFncmUnO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxheW91dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMubGF5b3V0ID0gdGhpcy5sYXlvdXRTZXJ2aWNlLmdldExheW91dChsYXlvdXQpO1xuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcbiAgICB9XG4gIH1cblxuICBzZXRMYXlvdXRTZXR0aW5ncyhzZXR0aW5nczogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMubGF5b3V0LnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICBzdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJhc2UgY2xhc3MgdXBkYXRlIGltcGxlbWVudGF0aW9uIGZvciB0aGUgZGFnIGdyYXBoXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuICAgIGlmICghdGhpcy5jdXJ2ZSkge1xuICAgICAgdGhpcy5jdXJ2ZSA9IHNoYXBlLmN1cnZlQnVuZGxlLmJldGEoMSk7XG4gICAgfVxuXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLmRpbXMgPSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyh7XG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICBtYXJnaW5zOiB0aGlzLm1hcmdpbixcbiAgICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmRcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNlcmllc0RvbWFpbiA9IHRoaXMuZ2V0U2VyaWVzRG9tYWluKCk7XG4gICAgICB0aGlzLnNldENvbG9ycygpO1xuICAgICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XG5cbiAgICAgIHRoaXMuY3JlYXRlR3JhcGgoKTtcbiAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBkYWdyZSBncmFwaCBlbmdpbmVcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBjcmVhdGVHcmFwaCgpOiB2b2lkIHtcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBjb25zdCBpbml0aWFsaXplTm9kZSA9IG4gPT4ge1xuICAgICAgaWYgKCFuLm1ldGEpIHtcbiAgICAgICAgbi5tZXRhID0ge307XG4gICAgICB9XG4gICAgICBpZiAoIW4uaWQpIHtcbiAgICAgICAgbi5pZCA9IGlkKCk7XG4gICAgICB9XG4gICAgICBpZiAoIW4uZGltZW5zaW9uKSB7XG4gICAgICAgIG4uZGltZW5zaW9uID0ge1xuICAgICAgICAgIHdpZHRoOiB0aGlzLm5vZGVXaWR0aCA/IHRoaXMubm9kZVdpZHRoIDogMzAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLm5vZGVIZWlnaHQgPyB0aGlzLm5vZGVIZWlnaHQgOiAzMFxuICAgICAgICB9O1xuXG4gICAgICAgIG4ubWV0YS5mb3JjZURpbWVuc2lvbnMgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG4ubWV0YS5mb3JjZURpbWVuc2lvbnMgPSBuLm1ldGEuZm9yY2VEaW1lbnNpb25zID09PSB1bmRlZmluZWQgPyB0cnVlIDogbi5tZXRhLmZvcmNlRGltZW5zaW9ucztcbiAgICAgIH1cbiAgICAgIG4ucG9zaXRpb24gPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH07XG4gICAgICBuLmRhdGEgPSBuLmRhdGEgPyBuLmRhdGEgOiB7fTtcbiAgICAgIHJldHVybiBuO1xuICAgIH07XG5cbiAgICB0aGlzLmdyYXBoID0ge1xuICAgICAgbm9kZXM6IFsuLi50aGlzLm5vZGVzXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxuICAgICAgY2x1c3RlcnM6IFsuLi4odGhpcy5jbHVzdGVycyB8fCBbXSldLm1hcChpbml0aWFsaXplTm9kZSksXG4gICAgICBlZGdlczogWy4uLnRoaXMubGlua3NdLm1hcChlID0+IHtcbiAgICAgICAgaWYgKCFlLmlkKSB7XG4gICAgICAgICAgZS5pZCA9IGlkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9KVxuICAgIH07XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIHRoZSBncmFwaCB1c2luZyBkYWdyZSBsYXlvdXRzXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgZHJhdygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubGF5b3V0IHx8IHR5cGVvZiB0aGlzLmxheW91dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQ2FsYyB2aWV3IGRpbXMgZm9yIHRoZSBub2Rlc1xuICAgIHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpO1xuXG4gICAgLy8gUmVjYWxjIHRoZSBsYXlvdXRcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmxheW91dC5ydW4odGhpcy5ncmFwaCk7XG4gICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxuICAgICAgcmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xuICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgICAgIHRoaXMudGljaygpO1xuICAgICAgfSlcbiAgICApO1xuICAgIHJlc3VsdCQucGlwZShmaXJzdChncmFwaCA9PiBncmFwaC5ub2Rlcy5sZW5ndGggPiAwKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpKTtcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgLy8gVHJhbnNwb3NlcyB2aWV3IG9wdGlvbnMgdG8gdGhlIG5vZGVcbiAgICB0aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IHtcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke24ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8XG4gICAgICAgIDB9KWA7XG4gICAgICBpZiAoIW4uZGF0YSkge1xuICAgICAgICBuLmRhdGEgPSB7fTtcbiAgICAgIH1cbiAgICAgIG4uZGF0YS5jb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpO1xuICAgIH0pO1xuICAgICh0aGlzLmdyYXBoLmNsdXN0ZXJzIHx8IFtdKS5tYXAobiA9PiB7XG4gICAgICBuLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtuLnBvc2l0aW9uLnggLSBuLmRpbWVuc2lvbi53aWR0aCAvIDIgfHwgMH0sICR7bi5wb3NpdGlvbi55IC0gbi5kaW1lbnNpb24uaGVpZ2h0IC8gMiB8fFxuICAgICAgICAwfSlgO1xuICAgICAgaWYgKCFuLmRhdGEpIHtcbiAgICAgICAgbi5kYXRhID0ge307XG4gICAgICB9XG4gICAgICBuLmRhdGEuY29sb3IgPSB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgbGFiZWxzIHRvIHRoZSBuZXcgcG9zaXRpb25zXG4gICAgY29uc3QgbmV3TGlua3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGVkZ2VMYWJlbElkIGluIHRoaXMuZ3JhcGguZWRnZUxhYmVscykge1xuICAgICAgY29uc3QgZWRnZUxhYmVsID0gdGhpcy5ncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcblxuICAgICAgY29uc3Qgbm9ybUtleSA9IGVkZ2VMYWJlbElkLnJlcGxhY2UoL1teXFx3LV0qL2csICcnKTtcbiAgICAgIGxldCBvbGRMaW5rID0gdGhpcy5fb2xkTGlua3MuZmluZChvbCA9PiBgJHtvbC5zb3VyY2V9JHtvbC50YXJnZXR9YCA9PT0gbm9ybUtleSk7XG4gICAgICBpZiAoIW9sZExpbmspIHtcbiAgICAgICAgb2xkTGluayA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChubCA9PiBgJHtubC5zb3VyY2V9JHtubC50YXJnZXR9YCA9PT0gbm9ybUtleSkgfHwgZWRnZUxhYmVsO1xuICAgICAgfVxuXG4gICAgICBvbGRMaW5rLm9sZExpbmUgPSBvbGRMaW5rLmxpbmU7XG5cbiAgICAgIGNvbnN0IHBvaW50cyA9IGVkZ2VMYWJlbC5wb2ludHM7XG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUocG9pbnRzKTtcblxuICAgICAgY29uc3QgbmV3TGluayA9IE9iamVjdC5hc3NpZ24oe30sIG9sZExpbmspO1xuICAgICAgbmV3TGluay5saW5lID0gbGluZTtcbiAgICAgIG5ld0xpbmsucG9pbnRzID0gcG9pbnRzO1xuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gcG9pbnRzW01hdGguZmxvb3IocG9pbnRzLmxlbmd0aCAvIDIpXTtcbiAgICAgIGlmICh0ZXh0UG9zKSB7XG4gICAgICAgIG5ld0xpbmsudGV4dFRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0ZXh0UG9zLnggfHwgMH0sJHt0ZXh0UG9zLnkgfHwgMH0pYDtcbiAgICAgIH1cblxuICAgICAgbmV3TGluay50ZXh0QW5nbGUgPSAwO1xuICAgICAgaWYgKCFuZXdMaW5rLm9sZExpbmUpIHtcbiAgICAgICAgbmV3TGluay5vbGRMaW5lID0gbmV3TGluay5saW5lO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKG5ld0xpbmspO1xuICAgICAgbmV3TGlua3MucHVzaChuZXdMaW5rKTtcbiAgICB9XG5cbiAgICB0aGlzLmdyYXBoLmVkZ2VzID0gbmV3TGlua3M7XG5cbiAgICAvLyBNYXAgdGhlIG9sZCBsaW5rcyBmb3IgYW5pbWF0aW9uc1xuICAgIGlmICh0aGlzLmdyYXBoLmVkZ2VzKSB7XG4gICAgICB0aGlzLl9vbGRMaW5rcyA9IHRoaXMuZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xuICAgICAgICBjb25zdCBuZXdMID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XG4gICAgICAgIG5ld0wub2xkTGluZSA9IGwubGluZTtcbiAgICAgICAgcmV0dXJuIG5ld0w7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIGhlaWdodC93aWR0aCB0b3RhbFxuICAgIHRoaXMuZ3JhcGhEaW1zLndpZHRoID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnggKyBuLmRpbWVuc2lvbi53aWR0aCkpO1xuICAgIHRoaXMuZ3JhcGhEaW1zLmhlaWdodCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi55ICsgbi5kaW1lbnNpb24uaGVpZ2h0KSk7XG5cbiAgICBpZiAodGhpcy5hdXRvWm9vbSkge1xuICAgICAgdGhpcy56b29tVG9GaXQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRvQ2VudGVyKSB7XG4gICAgICAvLyBBdXRvLWNlbnRlciB3aGVuIHJlbmRlcmluZ1xuICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5yZWRyYXdMaW5lcygpKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmVzIHRoZSBub2RlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlIGRpbWVuc2lvbnNcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBhcHBseU5vZGVEaW1lbnNpb25zKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm5vZGVFbGVtZW50cyAmJiB0aGlzLm5vZGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubm9kZUVsZW1lbnRzLm1hcChlbGVtID0+IHtcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IGVsZW0ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5hdGl2ZUVsZW1lbnQuaWQpO1xuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0XG4gICAgICAgIGxldCBkaW1zO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGRpbXMgPSBuYXRpdmVFbGVtZW50LmdldEJCb3goKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5vZGVIZWlnaHQpIHsgICAgICAgICAgXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0ICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi5oZWlnaHQgOiB0aGlzLm5vZGVIZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0ICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi5oZWlnaHQgOiBkaW1zLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhIZWlnaHQpIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1heEhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbkhlaWdodCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWluSGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm5vZGVXaWR0aCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gIG5vZGUuZGltZW5zaW9uLndpZHRoICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi53aWR0aCA6IHRoaXMubm9kZVdpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGhcbiAgICAgICAgICBpZiAobmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IG1heFRleHREaW1zO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZXh0RWxlbSBvZiBuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50QkJveCA9IHRleHRFbGVtLmdldEJCb3goKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1heFRleHREaW1zKSB7XG4gICAgICAgICAgICAgICAgICBtYXhUZXh0RGltcyA9IGN1cnJlbnRCQm94O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJCb3gud2lkdGggPiBtYXhUZXh0RGltcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhUZXh0RGltcy53aWR0aCA9IGN1cnJlbnRCQm94LndpZHRoO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCQm94LmhlaWdodCA+IG1heFRleHREaW1zLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhUZXh0RGltcy5oZWlnaHQgPSBjdXJyZW50QkJveC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gbm9kZS5kaW1lbnNpb24ud2lkdGggJiYgbm9kZS5tZXRhLmZvcmNlRGltZW5zaW9ucyA/IG5vZGUuZGltZW5zaW9uLndpZHRoIDogbWF4VGV4dERpbXMud2lkdGggKyAyMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBub2RlLmRpbWVuc2lvbi53aWR0aCAmJiBub2RlLm1ldGEuZm9yY2VEaW1lbnNpb25zID8gbm9kZS5kaW1lbnNpb24ud2lkdGggOiBkaW1zLndpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhXaWR0aCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1heFdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ub2RlTWluV2lkdGgpIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNaW5XaWR0aCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWRyYXdzIHRoZSBsaW5lcyB3aGVuIGRyYWdnZWQgb3Igdmlld3BvcnQgdXBkYXRlZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIHJlZHJhd0xpbmVzKF9hbmltYXRlID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMubGlua0VsZW1lbnRzLm1hcChsaW5rRWwgPT4ge1xuICAgICAgY29uc3QgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChsaW4gPT4gbGluLmlkID09PSBsaW5rRWwubmF0aXZlRWxlbWVudC5pZCk7XG5cbiAgICAgIGlmIChlZGdlKSB7XG4gICAgICAgIGNvbnN0IGxpbmtTZWxlY3Rpb24gPSBzZWxlY3QobGlua0VsLm5hdGl2ZUVsZW1lbnQpLnNlbGVjdCgnLmxpbmUnKTtcbiAgICAgICAgbGlua1NlbGVjdGlvblxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRMaW5lKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5saW5lKTtcblxuICAgICAgICBjb25zdCB0ZXh0UGF0aFNlbGVjdGlvbiA9IHNlbGVjdCh0aGlzLmNoYXJ0RWxlbWVudC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoYCMke2VkZ2UuaWR9YCk7XG4gICAgICAgIHRleHRQYXRoU2VsZWN0aW9uXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZFRleHRQYXRoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS50ZXh0UGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSB0ZXh0IGRpcmVjdGlvbnMgLyBmbGlwcGluZ1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGNhbGNEb21pbmFudEJhc2VsaW5lKGxpbmspOiB2b2lkIHtcbiAgICBjb25zdCBmaXJzdFBvaW50ID0gbGluay5wb2ludHNbMF07XG4gICAgY29uc3QgbGFzdFBvaW50ID0gbGluay5wb2ludHNbbGluay5wb2ludHMubGVuZ3RoIC0gMV07XG4gICAgbGluay5vbGRUZXh0UGF0aCA9IGxpbmsudGV4dFBhdGg7XG5cbiAgICBpZiAobGFzdFBvaW50LnggPCBmaXJzdFBvaW50LngpIHtcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWJlZm9yZS1lZGdlJztcblxuICAgICAgLy8gcmV2ZXJzZSB0ZXh0IHBhdGggZm9yIHdoZW4gaXRzIGZsaXBwZWQgdXBzaWRlIGRvd25cbiAgICAgIGxpbmsudGV4dFBhdGggPSB0aGlzLmdlbmVyYXRlTGluZShbLi4ubGluay5wb2ludHNdLnJldmVyc2UoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWFmdGVyLWVkZ2UnO1xuICAgICAgbGluay50ZXh0UGF0aCA9IGxpbmsubGluZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgdGhlIG5ldyBsaW5lIHBhdGhcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBnZW5lcmF0ZUxpbmUocG9pbnRzKTogYW55IHtcbiAgICBjb25zdCBsaW5lRnVuY3Rpb24gPSBzaGFwZVxuICAgICAgLmxpbmU8YW55PigpXG4gICAgICAueChkID0+IGQueClcbiAgICAgIC55KGQgPT4gZC55KVxuICAgICAgLmN1cnZlKHRoaXMuY3VydmUpO1xuICAgIHJldHVybiBsaW5lRnVuY3Rpb24ocG9pbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tIHdhcyBpbnZva2VkIGZyb20gZXZlbnRcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvblpvb20oJGV2ZW50OiBNb3VzZUV2ZW50LCBkaXJlY3Rpb24pOiB2b2lkIHtcbiAgICBjb25zdCB6b29tRmFjdG9yID0gMSArIChkaXJlY3Rpb24gPT09ICdpbicgPyB0aGlzLnpvb21TcGVlZCA6IC10aGlzLnpvb21TcGVlZCk7XG5cbiAgICAvLyBDaGVjayB0aGF0IHpvb21pbmcgd291bGRuJ3QgcHV0IHVzIG91dCBvZiBib3VuZHNcbiAgICBjb25zdCBuZXdab29tTGV2ZWwgPSB0aGlzLnpvb21MZXZlbCAqIHpvb21GYWN0b3I7XG4gICAgaWYgKG5ld1pvb21MZXZlbCA8PSB0aGlzLm1pblpvb21MZXZlbCB8fCBuZXdab29tTGV2ZWwgPj0gdGhpcy5tYXhab29tTGV2ZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB6b29taW5nIGlzIGVuYWJsZWQgb3Igbm90XG4gICAgaWYgKCF0aGlzLmVuYWJsZVpvb20pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5Pblpvb20gPT09IHRydWUgJiYgJGV2ZW50KSB7XG4gICAgICAvLyBBYnNvbHV0ZSBtb3VzZSBYL1kgb24gdGhlIHNjcmVlblxuICAgICAgY29uc3QgbW91c2VYID0gJGV2ZW50LmNsaWVudFg7XG4gICAgICBjb25zdCBtb3VzZVkgPSAkZXZlbnQuY2xpZW50WTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHRoZSBtb3VzZSBYL1kgaW50byBhIFNWRyBYL1lcbiAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuY2hhcnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgIGNvbnN0IHN2Z0dyb3VwID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2cuY2hhcnQnKTtcblxuICAgICAgY29uc3QgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAgIHBvaW50LnggPSBtb3VzZVg7XG4gICAgICBwb2ludC55ID0gbW91c2VZO1xuICAgICAgY29uc3Qgc3ZnUG9pbnQgPSBwb2ludC5tYXRyaXhUcmFuc2Zvcm0oc3ZnR3JvdXAuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcblxuICAgICAgLy8gUGFuem9vbVxuICAgICAgdGhpcy5wYW4oc3ZnUG9pbnQueCwgc3ZnUG9pbnQueSwgdHJ1ZSk7XG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XG4gICAgICB0aGlzLnBhbigtc3ZnUG9pbnQueCwgLXN2Z1BvaW50LnksIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBhbiBieSB4L3lcbiAgICpcbiAgICogQHBhcmFtIHhcbiAgICogQHBhcmFtIHlcbiAgICovXG4gIHBhbih4OiBudW1iZXIsIHk6IG51bWJlciwgaWdub3JlWm9vbUxldmVsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBjb25zdCB6b29tTGV2ZWwgPSBpZ25vcmVab29tTGV2ZWwgPyAxIDogdGhpcy56b29tTGV2ZWw7XG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0cmFuc2xhdGUoeCAvIHpvb21MZXZlbCwgeSAvIHpvb21MZXZlbCkpO1xuXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYW4gdG8gYSBmaXhlZCB4L3lcbiAgICpcbiAgICovXG4gIHBhblRvKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHggPT09IG51bGwgfHwgeCA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHgpIHx8IHkgPT09IG51bGwgfHwgeSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFuWCA9IC10aGlzLnBhbk9mZnNldFggLSB4ICogdGhpcy56b29tTGV2ZWwgKyB0aGlzLmRpbXMud2lkdGggLyAyO1xuICAgIGNvbnN0IHBhblkgPSAtdGhpcy5wYW5PZmZzZXRZIC0geSAqIHRoaXMuem9vbUxldmVsICsgdGhpcy5kaW1zLmhlaWdodCAvIDI7XG5cbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKFxuICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCxcbiAgICAgIHRyYW5zbGF0ZShwYW5YIC8gdGhpcy56b29tTGV2ZWwsIHBhblkgLyB0aGlzLnpvb21MZXZlbClcbiAgICApO1xuXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tIGJ5IGEgZmFjdG9yXG4gICAqXG4gICAqL1xuICB6b29tKGZhY3RvcjogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCBzY2FsZShmYWN0b3IsIGZhY3RvcikpO1xuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbUxldmVsKTtcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICB9XG5cbiAgem9vbUluKCk6IHZvaWQge1xuICAgIHRoaXMuem9vbSgxICsgdGhpcy56b29tU3BlZWQpO1xuICB9XG5cbiAgem9vbU91dCgpOiB2b2lkIHtcbiAgICB0aGlzLnpvb20oMSAtIHRoaXMuem9vbVNwZWVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tIHRvIGEgZml4ZWQgbGV2ZWxcbiAgICpcbiAgICovXG4gIHpvb21UbyhsZXZlbDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hIDogTnVtYmVyKGxldmVsKTtcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgOiBOdW1iZXIobGV2ZWwpO1xuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbUxldmVsKTtcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhbiB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25QYW4oZXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnBhbihldmVudC5tb3ZlbWVudFgsIGV2ZW50Lm1vdmVtZW50WSk7XG4gIH1cblxuICAvKipcbiAgICogRHJhZyB3YXMgaW52b2tlZCBmcm9tIGFuIGV2ZW50XG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25EcmFnKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5kcmFnZ2luZ05vZGU7XG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnKSB7XG4gICAgICB0aGlzLmxheW91dC5vbkRyYWcobm9kZSwgZXZlbnQpO1xuICAgIH1cblxuICAgIG5vZGUucG9zaXRpb24ueCArPSBldmVudC5tb3ZlbWVudFggLyB0aGlzLnpvb21MZXZlbDtcbiAgICBub2RlLnBvc2l0aW9uLnkgKz0gZXZlbnQubW92ZW1lbnRZIC8gdGhpcy56b29tTGV2ZWw7XG5cbiAgICAvLyBtb3ZlIHRoZSBub2RlXG4gICAgY29uc3QgeCA9IG5vZGUucG9zaXRpb24ueCAtIG5vZGUuZGltZW5zaW9uLndpZHRoIC8gMjtcbiAgICBjb25zdCB5ID0gbm9kZS5wb3NpdGlvbi55IC0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMjtcbiAgICBub2RlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xuXG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHRoaXMuZ3JhcGguZWRnZXMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgbGluay50YXJnZXQgPT09IG5vZGUuaWQgfHxcbiAgICAgICAgbGluay5zb3VyY2UgPT09IG5vZGUuaWQgfHxcbiAgICAgICAgKGxpbmsudGFyZ2V0IGFzIGFueSkuaWQgPT09IG5vZGUuaWQgfHxcbiAgICAgICAgKGxpbmsuc291cmNlIGFzIGFueSkuaWQgPT09IG5vZGUuaWRcbiAgICAgICkge1xuICAgICAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnVwZGF0ZUVkZ2UodGhpcy5ncmFwaCwgbGluayk7XG4gICAgICAgICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xuICAgICAgICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAgICAgcmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xuICAgICAgICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgICAgICAgICAgIHRoaXMucmVkcmF3RWRnZShsaW5rKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVkcmF3TGluZXMoZmFsc2UpO1xuICB9XG5cbiAgcmVkcmF3RWRnZShlZGdlOiBFZGdlKSB7XG4gICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKGVkZ2UucG9pbnRzKTtcbiAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKGVkZ2UpO1xuICAgIGVkZ2Uub2xkTGluZSA9IGVkZ2UubGluZTtcbiAgICBlZGdlLmxpbmUgPSBsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgZW50aXJlIHZpZXcgZm9yIHRoZSBuZXcgcGFuIHBvc2l0aW9uXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgdXBkYXRlVHJhbnNmb3JtKCk6IHZvaWQge1xuICAgIHRoaXMudHJhbnNmb3JtID0gdG9TVkcodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XG4gIH1cblxuICAvKipcbiAgICogTm9kZSB3YXMgY2xpY2tlZFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uQ2xpY2soZXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb2RlIHdhcyBmb2N1c2VkXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25BY3RpdmF0ZShldmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCkgPiAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbZXZlbnQsIC4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogTm9kZSB3YXMgZGVmb2N1c2VkXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25EZWFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpO1xuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xuXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRvbWFpbiBzZXJpZXMgZm9yIHRoZSBub2Rlc1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGdldFNlcmllc0RvbWFpbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXNcbiAgICAgIC5tYXAoZCA9PiB0aGlzLmdyb3VwUmVzdWx0c0J5KGQpKVxuICAgICAgLnJlZHVjZSgobm9kZXM6IHN0cmluZ1tdLCBub2RlKTogYW55W10gPT4gKG5vZGVzLmluZGV4T2Yobm9kZSkgIT09IC0xID8gbm9kZXMgOiBub2Rlcy5jb25jYXQoW25vZGVdKSksIFtdKVxuICAgICAgLnNvcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFja2luZyBmb3IgdGhlIGxpbmtcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICB0cmFja0xpbmtCeShpbmRleCwgbGluayk6IGFueSB7XG4gICAgcmV0dXJuIGxpbmsuaWQ7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tpbmcgZm9yIHRoZSBub2RlXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgdHJhY2tOb2RlQnkoaW5kZXgsIG5vZGUpOiBhbnkge1xuICAgIHJldHVybiBub2RlLmlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbG9ycyB0aGUgbm9kZXNcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBzZXRDb2xvcnMoKTogdm9pZCB7XG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsICdvcmRpbmFsJywgdGhpcy5zZXJpZXNEb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsZWdlbmQgb3B0aW9uc1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGdldExlZ2VuZE9wdGlvbnMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgc2NhbGVUeXBlOiAnb3JkaW5hbCcsXG4gICAgICBkb21haW46IHRoaXMuc2VyaWVzRG9tYWluLFxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9yc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogT24gbW91c2UgbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZyBhbmQgZHJhZ2dpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZU1vdmUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNQYW5uaW5nICYmIHRoaXMucGFubmluZ0VuYWJsZWQpIHtcbiAgICAgIHRoaXMub25QYW4oJGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xuICAgICAgdGhpcy5vbkRyYWcoJGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gdG91Y2ggc3RhcnQgZXZlbnQgdG8gZW5hYmxlIHBhbm5pbmcuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgdGhpcy5fdG91Y2hMYXN0WCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgdGhpcy5fdG91Y2hMYXN0WSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XG5cbiAgICB0aGlzLmlzUGFubmluZyA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogT24gdG91Y2ggbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZy5cbiAgICpcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIG9uVG91Y2hNb3ZlKCRldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBjbGllbnRYID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICBjb25zdCBjbGllbnRZID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICBjb25zdCBtb3ZlbWVudFggPSBjbGllbnRYIC0gdGhpcy5fdG91Y2hMYXN0WDtcbiAgICAgIGNvbnN0IG1vdmVtZW50WSA9IGNsaWVudFkgLSB0aGlzLl90b3VjaExhc3RZO1xuICAgICAgdGhpcy5fdG91Y2hMYXN0WCA9IGNsaWVudFg7XG4gICAgICB0aGlzLl90b3VjaExhc3RZID0gY2xpZW50WTtcblxuICAgICAgdGhpcy5wYW4obW92ZW1lbnRYLCBtb3ZlbWVudFkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPbiB0b3VjaCBlbmQgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uVG91Y2hFbmQoZXZlbnQpIHtcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9uIG1vdXNlIHVwIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy9kcmFnZ2luZy5cbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZXVwJylcbiAgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdFbmQpIHtcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCh0aGlzLmRyYWdnaW5nTm9kZSwgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBub2RlIG1vdXNlIGRvd24gdG8ga2ljayBvZmYgZHJhZ2dpbmdcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvbk5vZGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQsIG5vZGU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdnaW5nTm9kZSA9IG5vZGU7XG5cbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdTdGFydCkge1xuICAgICAgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQobm9kZSwgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDZW50ZXIgdGhlIGdyYXBoIGluIHRoZSB2aWV3cG9ydFxuICAgKi9cbiAgY2VudGVyKCk6IHZvaWQge1xuICAgIHRoaXMucGFuVG8odGhpcy5ncmFwaERpbXMud2lkdGggLyAyLCB0aGlzLmdyYXBoRGltcy5oZWlnaHQgLyAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tcyB0byBmaXQgdGhlIGVudGllciBncmFwaFxuICAgKi9cbiAgem9vbVRvRml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGhlaWdodFpvb20gPSB0aGlzLmRpbXMuaGVpZ2h0IC8gdGhpcy5ncmFwaERpbXMuaGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoWm9vbSA9IHRoaXMuZGltcy53aWR0aCAvIHRoaXMuZ3JhcGhEaW1zLndpZHRoO1xuICAgIGNvbnN0IHpvb21MZXZlbCA9IE1hdGgubWluKGhlaWdodFpvb20sIHdpZHRoWm9vbSwgMSk7XG5cbiAgICBpZiAoem9vbUxldmVsIDw9IHRoaXMubWluWm9vbUxldmVsIHx8IHpvb21MZXZlbCA+PSB0aGlzLm1heFpvb21MZXZlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAoem9vbUxldmVsICE9PSB0aGlzLnpvb21MZXZlbCkge1xuICAgICAgdGhpcy56b29tTGV2ZWwgPSB6b29tTGV2ZWw7XG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICAgICAgdGhpcy56b29tQ2hhbmdlLmVtaXQodGhpcy56b29tTGV2ZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQYW5zIHRvIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWQgXG4gICAqL1xuICBwYW5Ub05vZGVJZChub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBub2RlSWQpO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucGFuVG8obm9kZS5wb3NpdGlvbi54LCBub2RlLnBvc2l0aW9uLnkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIE91dHB1dCwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBNb3VzZXdoZWVsIGRpcmVjdGl2ZVxuICogaHR0cHM6Ly9naXRodWIuY29tL1NvZGhhbmFMaWJyYXJ5L2FuZ3VsYXIyLWV4YW1wbGVzL2Jsb2IvbWFzdGVyL2FwcC9tb3VzZVdoZWVsRGlyZWN0aXZlL21vdXNld2hlZWwuZGlyZWN0aXZlLnRzXG4gKlxuICogQGV4cG9ydFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbW91c2VXaGVlbF0nIH0pXG5leHBvcnQgY2xhc3MgTW91c2VXaGVlbERpcmVjdGl2ZSB7XG4gIEBPdXRwdXQoKVxuICBtb3VzZVdoZWVsVXAgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKVxuICBtb3VzZVdoZWVsRG93biA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZVdoZWVsQ2hyb21lKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZVdoZWVsRmlyZWZveChldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdvbm1vdXNld2hlZWwnLCBbJyRldmVudCddKVxuICBvbk1vdXNlV2hlZWxJRShldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XG4gIH1cblxuICBtb3VzZVdoZWVsRnVuYyhldmVudDogYW55KTogdm9pZCB7XG4gICAgaWYgKHdpbmRvdy5ldmVudCkge1xuICAgICAgZXZlbnQgPSB3aW5kb3cuZXZlbnQ7XG4gICAgfVxuXG4gICAgY29uc3QgZGVsdGEgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZXZlbnQud2hlZWxEZWx0YSB8fCAtZXZlbnQuZGV0YWlsKSk7XG4gICAgaWYgKGRlbHRhID4gMCkge1xuICAgICAgdGhpcy5tb3VzZVdoZWVsVXAuZW1pdChldmVudCk7XG4gICAgfSBlbHNlIGlmIChkZWx0YSA8IDApIHtcbiAgICAgIHRoaXMubW91c2VXaGVlbERvd24uZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgLy8gZm9yIElFXG4gICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcblxuICAgIC8vIGZvciBDaHJvbWUgYW5kIEZpcmVmb3hcbiAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JhcGhDb21wb25lbnQgfSBmcm9tICcuL2dyYXBoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGFydENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcbmltcG9ydCB7IE1vdXNlV2hlZWxEaXJlY3RpdmUgfSBmcm9tICcuL21vdXNlLXdoZWVsLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcbmV4cG9ydCB7IEdyYXBoQ29tcG9uZW50IH07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDaGFydENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0dyYXBoQ29tcG9uZW50LCBNb3VzZVdoZWVsRGlyZWN0aXZlXSxcbiAgZXhwb3J0czogW0dyYXBoQ29tcG9uZW50LCBNb3VzZVdoZWVsRGlyZWN0aXZlXSxcbiAgcHJvdmlkZXJzOiBbTGF5b3V0U2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgR3JhcGhNb2R1bGUge31cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmFwaE1vZHVsZSB9IGZyb20gJy4vZ3JhcGgvZ3JhcGgubW9kdWxlJztcbmltcG9ydCB7IE5neENoYXJ0c01vZHVsZSB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcblxuZXhwb3J0ICogZnJvbSAnLi9tb2RlbHMvaW5kZXgnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTmd4Q2hhcnRzTW9kdWxlXSxcbiAgZXhwb3J0czogW0dyYXBoTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHcmFwaE1vZHVsZSB7fVxuIl0sIm5hbWVzIjpbImRhZ3JlLmxheW91dCIsImRhZ3JlLmdyYXBobGliIiwidHNsaWJfMS5fX3ZhbHVlcyIsIk9yaWVudGF0aW9uIiwiZm9yY2VTaW11bGF0aW9uIiwiZm9yY2VNYW55Qm9keSIsImZvcmNlQ29sbGlkZSIsImZvcmNlTGluayIsIlN1YmplY3QiLCJkM2FkYXB0b3IiLCJJbmplY3RhYmxlIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJFdmVudEVtaXR0ZXIiLCJTdWJzY3JpcHRpb24iLCJpZGVudGl0eSIsInNoYXBlLmN1cnZlQnVuZGxlIiwiY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMiLCJ0c2xpYl8xLl9fc3ByZWFkIiwiT2JzZXJ2YWJsZSIsIm9mIiwiZmlyc3QiLCJzZWxlY3QiLCJzaGFwZVxuICAgICAgICAgICAgICAgIC5saW5lIiwidHJhbnNmb3JtIiwidHJhbnNsYXRlIiwic2NhbGUiLCJ0b1NWRyIsIkNvbG9ySGVscGVyIiwiQ29tcG9uZW50IiwiVmlld0VuY2Fwc3VsYXRpb24iLCJDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSIsInRyaWdnZXIiLCJuZ1RyYW5zaXRpb24iLCJhbmltYXRlIiwic3R5bGUiLCJFbGVtZW50UmVmIiwiTmdab25lIiwiQ2hhbmdlRGV0ZWN0b3JSZWYiLCJJbnB1dCIsIk91dHB1dCIsIkNvbnRlbnRDaGlsZCIsIlZpZXdDaGlsZCIsIkNoYXJ0Q29tcG9uZW50IiwiVmlld0NoaWxkcmVuIiwiSG9zdExpc3RlbmVyIiwiQmFzZUNoYXJ0Q29tcG9uZW50IiwiRGlyZWN0aXZlIiwiTmdNb2R1bGUiLCJDaGFydENvbW1vbk1vZHVsZSIsIk5neENoYXJ0c01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0E7SUFFQSxJQUFJLGFBQWEsR0FBRyxVQUFTLENBQUMsRUFBRSxDQUFDO1FBQzdCLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYzthQUNoQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1RSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDL0Us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