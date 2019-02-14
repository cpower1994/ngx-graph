/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
// rename transition due to conflict with d3 transition
import { animate, style, transition as ngTransition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation, NgZone, ChangeDetectorRef } from '@angular/core';
import { BaseChartComponent, ChartComponent, ColorHelper, calculateViewDimensions } from '@swimlane/ngx-charts';
import { select } from 'd3-selection';
import * as shape from 'd3-shape';
import 'd3-transition';
import { Observable, Subscription, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { identity, scale, toSVG, transform, translate } from 'transformation-matrix';
import { LayoutService } from './layouts/layout.service';
import { id } from '../utils/id';
/**
 * Matrix
 * @record
 */
export function Matrix() { }
if (false) {
    /** @type {?} */
    Matrix.prototype.a;
    /** @type {?} */
    Matrix.prototype.b;
    /** @type {?} */
    Matrix.prototype.c;
    /** @type {?} */
    Matrix.prototype.d;
    /** @type {?} */
    Matrix.prototype.e;
    /** @type {?} */
    Matrix.prototype.f;
}
var GraphComponent = /** @class */ (function (_super) {
    tslib_1.__extends(GraphComponent, _super);
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
        _this.activate = new EventEmitter();
        _this.deactivate = new EventEmitter();
        _this.zoomChange = new EventEmitter();
        _this.graphSubscription = new Subscription();
        _this.subscriptions = [];
        _this.margin = [0, 0, 0, 0];
        _this.results = [];
        _this.isPanning = false;
        _this.isDragging = false;
        _this.initialized = false;
        _this.graphDims = { width: 0, height: 0 };
        _this._oldLinks = [];
        _this.transformationMatrix = identity();
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
         */
        function () {
            return this.transformationMatrix.a;
        },
        /**
         * Set the current zoom level
         */
        set: /**
         * Set the current zoom level
         * @param {?} level
         * @return {?}
         */
        function (level) {
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
         */
        function () {
            return this.transformationMatrix.e;
        },
        /**
         * Set the current `x` position of the graph
         */
        set: /**
         * Set the current `x` position of the graph
         * @param {?} x
         * @return {?}
         */
        function (x) {
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
         */
        function () {
            return this.transformationMatrix.f;
        },
        /**
         * Set the current `y` position of the graph
         */
        set: /**
         * Set the current `y` position of the graph
         * @param {?} y
         * @return {?}
         */
        function (y) {
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
            for (var _b = tslib_1.__values(this.subscriptions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sub = _c.value;
                sub.unsubscribe();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
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
            _this.dims = calculateViewDimensions({
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
        this.graphSubscription = new Subscription();
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
            nodes: tslib_1.__spread(this.nodes).map(initializeNode),
            clusters: tslib_1.__spread((this.clusters || [])).map(initializeNode),
            edges: tslib_1.__spread(this.links).map(function (e) {
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
        var result$ = result instanceof Observable ? result : of(result);
        this.graphSubscription.add(result$.subscribe(function (graph) {
            _this.graph = graph;
            _this.tick();
        }));
        result$.pipe(first(function (graph) { return graph.nodes.length > 0; })).subscribe(function () { return _this.applyNodeDimensions(); });
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
        this.graphDims.width = Math.max.apply(Math, tslib_1.__spread(this.graph.nodes.map(function (n) { return n.position.x + n.dimension.width; })));
        this.graphDims.height = Math.max.apply(Math, tslib_1.__spread(this.graph.nodes.map(function (n) { return n.position.y + n.dimension.height; })));
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
                                for (var _b = tslib_1.__values(nativeElement.getElementsByTagName('text')), _c = _b.next(); !_c.done; _c = _b.next()) {
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
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                }
                                finally { if (e_2) throw e_2.error; }
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
        if (_animate === void 0) { _animate = true; }
        this.linkElements.map(function (linkEl) {
            /** @type {?} */
            var edge = _this.graph.edges.find(function (lin) { return lin.id === linkEl.nativeElement.id; });
            if (edge) {
                /** @type {?} */
                var linkSelection = select(linkEl.nativeElement).select('.line');
                linkSelection
                    .attr('d', edge.oldLine)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.line);
                /** @type {?} */
                var textPathSelection = select(_this.chartElement.nativeElement).select("#" + edge.id);
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
            link.textPath = this.generateLine(tslib_1.__spread(link.points).reverse());
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
        var lineFunction = shape
            .line()
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
        if (ignoreZoomLevel === void 0) { ignoreZoomLevel = false; }
        /** @type {?} */
        var zoomLevel = ignoreZoomLevel ? 1 : this.zoomLevel;
        this.transformationMatrix = transform(this.transformationMatrix, translate(x / zoomLevel, y / zoomLevel));
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
        this.transformationMatrix = transform(this.transformationMatrix, translate(panX / this.zoomLevel, panY / this.zoomLevel));
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
        this.transformationMatrix = transform(this.transformationMatrix, scale(factor, factor));
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
                ((/** @type {?} */ (link.target))).id === node.id ||
                ((/** @type {?} */ (link.source))).id === node.id) {
                if (this_2.layout && typeof this_2.layout !== 'string') {
                    /** @type {?} */
                    var result = this_2.layout.updateEdge(this_2.graph, link);
                    /** @type {?} */
                    var result$ = result instanceof Observable ? result : of(result);
                    this_2.graphSubscription.add(result$.subscribe(function (graph) {
                        _this.graph = graph;
                        _this.redrawEdge(link);
                    }));
                }
            }
        };
        var this_2 = this;
        try {
            for (var _b = tslib_1.__values(this.graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
                var link = _c.value;
                _loop_2(link);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
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
        this.transform = toSVG(this.transformationMatrix);
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
        this.activeEntries = tslib_1.__spread([event], this.activeEntries);
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
        this.activeEntries = tslib_1.__spread(this.activeEntries);
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
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
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
        { type: Component, args: [{
                    selector: 'ngx-graph',
                    styles: [".graph{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.graph .edge{stroke:#666;fill:none}.graph .edge .edge-label{stroke:none;font-size:12px;fill:#251e1e}.graph .panning-rect{fill:transparent;cursor:move;width:1000000px}.graph .node-group .node:focus{outline:0}.graph .cluster rect{opacity:.2}"],
                    template: "<ngx-charts-chart\n  [view]=\"[width, height]\"\n  [showLegend]=\"legend\"\n  [legendOptions]=\"legendOptions\"\n  (legendLabelClick)=\"onClick($event)\"\n  (legendLabelActivate)=\"onActivate($event)\"\n  (legendLabelDeactivate)=\"onDeactivate($event)\"\n  mouseWheel\n  (mouseWheelUp)=\"onZoom($event, 'in')\"\n  (mouseWheelDown)=\"onZoom($event, 'out')\"\n>\n  <svg:g\n    *ngIf=\"initialized && graph\"\n    [attr.transform]=\"transform\"\n    (touchstart)=\"onTouchStart($event)\"\n    (touchend)=\"onTouchEnd($event)\"\n    class=\"graph chart\"\n  >\n    <defs>\n      <ng-template *ngIf=\"defsTemplate\" [ngTemplateOutlet]=\"defsTemplate\"></ng-template>\n      <svg:path\n        class=\"text-path\"\n        *ngFor=\"let link of graph.edges\"\n        [attr.d]=\"link.textPath\"\n        [attr.id]=\"link.id\"\n      ></svg:path>\n    </defs>\n    <svg:rect\n      class=\"panning-rect\"\n      [attr.width]=\"dims.width * 100\"\n      [attr.height]=\"dims.height * 100\"\n      [attr.transform]=\"'translate(' + (-dims.width || 0) * 50 + ',' + (-dims.height || 0) * 50 + ')'\"\n      (mousedown)=\"isPanning = true\"\n    />\n    <svg:g class=\"clusters\">\n      <svg:g\n        #clusterElement\n        *ngFor=\"let node of graph.clusters; trackBy: trackNodeBy\"\n        class=\"node-group\"\n        [id]=\"node.id\"\n        [attr.transform]=\"node.transform\"\n        (click)=\"onClick(node)\"\n      >\n        <ng-template\n          *ngIf=\"clusterTemplate\"\n          [ngTemplateOutlet]=\"clusterTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: node }\"\n        ></ng-template>\n        <svg:g *ngIf=\"!clusterTemplate\" class=\"node cluster\">\n          <svg:rect\n            [attr.width]=\"node.dimension.width\"\n            [attr.height]=\"node.dimension.height\"\n            [attr.fill]=\"node.data?.color\"\n          />\n          <svg:text alignment-baseline=\"central\" [attr.x]=\"10\" [attr.y]=\"node.dimension.height / 2\">\n            {{ node.label }}\n          </svg:text>\n        </svg:g>\n      </svg:g>\n    </svg:g>\n    <svg:g class=\"links\">\n      <svg:g #linkElement *ngFor=\"let link of graph.edges; trackBy: trackLinkBy\" class=\"link-group\" [id]=\"link.id\">\n        <ng-template\n          *ngIf=\"linkTemplate\"\n          [ngTemplateOutlet]=\"linkTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: link }\"\n        ></ng-template>\n        <svg:path *ngIf=\"!linkTemplate\" class=\"edge\" [attr.d]=\"link.line\" />\n      </svg:g>\n    </svg:g>\n    <svg:g class=\"nodes\">\n      <svg:g\n        #nodeElement\n        *ngFor=\"let node of graph.nodes; trackBy: trackNodeBy\"\n        class=\"node-group\"\n        [id]=\"node.id\"\n        [attr.transform]=\"node.transform\"\n        (click)=\"onClick(node)\"\n        (mousedown)=\"onNodeMouseDown($event, node)\"\n      >\n        <ng-template\n          *ngIf=\"nodeTemplate\"\n          [ngTemplateOutlet]=\"nodeTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: node }\"\n        ></ng-template>\n        <svg:circle\n          *ngIf=\"!nodeTemplate\"\n          r=\"10\"\n          [attr.cx]=\"node.dimension.width / 2\"\n          [attr.cy]=\"node.dimension.height / 2\"\n          [attr.fill]=\"node.data?.color\"\n        />\n      </svg:g>\n    </svg:g>\n  </svg:g>\n</ngx-charts-chart>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    animations: [trigger('link', [ngTransition('* => *', [animate(500, style({ transform: '*' }))])])]
                },] },
    ];
    /** @nocollapse */
    GraphComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: LayoutService }
    ]; };
    GraphComponent.propDecorators = {
        legend: [{ type: Input }],
        nodes: [{ type: Input }],
        clusters: [{ type: Input }],
        links: [{ type: Input }],
        activeEntries: [{ type: Input }],
        curve: [{ type: Input }],
        draggingEnabled: [{ type: Input }],
        nodeHeight: [{ type: Input }],
        nodeMaxHeight: [{ type: Input }],
        nodeMinHeight: [{ type: Input }],
        nodeWidth: [{ type: Input }],
        nodeMinWidth: [{ type: Input }],
        nodeMaxWidth: [{ type: Input }],
        panningEnabled: [{ type: Input }],
        enableZoom: [{ type: Input }],
        zoomSpeed: [{ type: Input }],
        minZoomLevel: [{ type: Input }],
        maxZoomLevel: [{ type: Input }],
        autoZoom: [{ type: Input }],
        panOnZoom: [{ type: Input }],
        autoCenter: [{ type: Input }],
        update$: [{ type: Input }],
        center$: [{ type: Input }],
        zoomToFit$: [{ type: Input }],
        panToNode$: [{ type: Input }],
        layout: [{ type: Input }],
        layoutSettings: [{ type: Input }],
        activate: [{ type: Output }],
        deactivate: [{ type: Output }],
        zoomChange: [{ type: Output }],
        linkTemplate: [{ type: ContentChild, args: ['linkTemplate',] }],
        nodeTemplate: [{ type: ContentChild, args: ['nodeTemplate',] }],
        clusterTemplate: [{ type: ContentChild, args: ['clusterTemplate',] }],
        defsTemplate: [{ type: ContentChild, args: ['defsTemplate',] }],
        chart: [{ type: ViewChild, args: [ChartComponent, { read: ElementRef },] }],
        nodeElements: [{ type: ViewChildren, args: ['nodeElement',] }],
        linkElements: [{ type: ViewChildren, args: ['linkElement',] }],
        groupResultsBy: [{ type: Input }],
        zoomLevel: [{ type: Input, args: ['zoomLevel',] }],
        panOffsetX: [{ type: Input, args: ['panOffsetX',] }],
        panOffsetY: [{ type: Input, args: ['panOffsetY',] }],
        onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }],
        onTouchMove: [{ type: HostListener, args: ['document:touchmove', ['$event'],] }],
        onMouseUp: [{ type: HostListener, args: ['document:mouseup',] }]
    };
    return GraphComponent;
}(BaseChartComponent));
export { GraphComponent };
if (false) {
    /** @type {?} */
    GraphComponent.prototype.legend;
    /** @type {?} */
    GraphComponent.prototype.nodes;
    /** @type {?} */
    GraphComponent.prototype.clusters;
    /** @type {?} */
    GraphComponent.prototype.links;
    /** @type {?} */
    GraphComponent.prototype.activeEntries;
    /** @type {?} */
    GraphComponent.prototype.curve;
    /** @type {?} */
    GraphComponent.prototype.draggingEnabled;
    /** @type {?} */
    GraphComponent.prototype.nodeHeight;
    /** @type {?} */
    GraphComponent.prototype.nodeMaxHeight;
    /** @type {?} */
    GraphComponent.prototype.nodeMinHeight;
    /** @type {?} */
    GraphComponent.prototype.nodeWidth;
    /** @type {?} */
    GraphComponent.prototype.nodeMinWidth;
    /** @type {?} */
    GraphComponent.prototype.nodeMaxWidth;
    /** @type {?} */
    GraphComponent.prototype.panningEnabled;
    /** @type {?} */
    GraphComponent.prototype.enableZoom;
    /** @type {?} */
    GraphComponent.prototype.zoomSpeed;
    /** @type {?} */
    GraphComponent.prototype.minZoomLevel;
    /** @type {?} */
    GraphComponent.prototype.maxZoomLevel;
    /** @type {?} */
    GraphComponent.prototype.autoZoom;
    /** @type {?} */
    GraphComponent.prototype.panOnZoom;
    /** @type {?} */
    GraphComponent.prototype.autoCenter;
    /** @type {?} */
    GraphComponent.prototype.update$;
    /** @type {?} */
    GraphComponent.prototype.center$;
    /** @type {?} */
    GraphComponent.prototype.zoomToFit$;
    /** @type {?} */
    GraphComponent.prototype.panToNode$;
    /** @type {?} */
    GraphComponent.prototype.layout;
    /** @type {?} */
    GraphComponent.prototype.layoutSettings;
    /** @type {?} */
    GraphComponent.prototype.activate;
    /** @type {?} */
    GraphComponent.prototype.deactivate;
    /** @type {?} */
    GraphComponent.prototype.zoomChange;
    /** @type {?} */
    GraphComponent.prototype.linkTemplate;
    /** @type {?} */
    GraphComponent.prototype.nodeTemplate;
    /** @type {?} */
    GraphComponent.prototype.clusterTemplate;
    /** @type {?} */
    GraphComponent.prototype.defsTemplate;
    /** @type {?} */
    GraphComponent.prototype.chart;
    /** @type {?} */
    GraphComponent.prototype.nodeElements;
    /** @type {?} */
    GraphComponent.prototype.linkElements;
    /** @type {?} */
    GraphComponent.prototype.graphSubscription;
    /** @type {?} */
    GraphComponent.prototype.subscriptions;
    /** @type {?} */
    GraphComponent.prototype.colors;
    /** @type {?} */
    GraphComponent.prototype.dims;
    /** @type {?} */
    GraphComponent.prototype.margin;
    /** @type {?} */
    GraphComponent.prototype.results;
    /** @type {?} */
    GraphComponent.prototype.seriesDomain;
    /** @type {?} */
    GraphComponent.prototype.transform;
    /** @type {?} */
    GraphComponent.prototype.legendOptions;
    /** @type {?} */
    GraphComponent.prototype.isPanning;
    /** @type {?} */
    GraphComponent.prototype.isDragging;
    /** @type {?} */
    GraphComponent.prototype.draggingNode;
    /** @type {?} */
    GraphComponent.prototype.initialized;
    /** @type {?} */
    GraphComponent.prototype.graph;
    /** @type {?} */
    GraphComponent.prototype.graphDims;
    /** @type {?} */
    GraphComponent.prototype._oldLinks;
    /** @type {?} */
    GraphComponent.prototype.transformationMatrix;
    /** @type {?} */
    GraphComponent.prototype._touchLastX;
    /** @type {?} */
    GraphComponent.prototype._touchLastY;
    /** @type {?} */
    GraphComponent.prototype.groupResultsBy;
    /**
     * @type {?}
     * @private
     */
    GraphComponent.prototype.el;
    /** @type {?} */
    GraphComponent.prototype.zone;
    /** @type {?} */
    GraphComponent.prototype.cd;
    /**
     * @type {?}
     * @private
     */
    GraphComponent.prototype.layoutService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLFNBQVMsRUFDVCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixpQkFBaUIsRUFHbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixjQUFjLEVBQ2QsV0FBVyxFQUVYLHVCQUF1QixFQUN4QixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXJGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUl6RCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDOzs7OztBQUtqQyw0QkFPQzs7O0lBTkMsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0FBR1o7SUF3R29DLDBDQUFrQjtJQThEcEQsd0JBQ1UsRUFBYyxFQUNmLElBQVksRUFDWixFQUFxQixFQUNwQixhQUE0QjtRQUp0QyxZQU1FLGtCQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQ3BCO1FBTlMsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNmLFVBQUksR0FBSixJQUFJLENBQVE7UUFDWixRQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNwQixtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWpFN0IsWUFBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixXQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLGNBQVEsR0FBa0IsRUFBRSxDQUFDO1FBQzdCLFdBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsbUJBQWEsR0FBVSxFQUFFLENBQUM7UUFFMUIscUJBQWUsR0FBRyxJQUFJLENBQUM7UUFPdkIsb0JBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIsZ0JBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsZUFBUyxHQUFHLEdBQUcsQ0FBQztRQUNoQixrQkFBWSxHQUFHLEdBQUcsQ0FBQztRQUNuQixrQkFBWSxHQUFHLEdBQUcsQ0FBQztRQUNuQixjQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGVBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsZ0JBQVUsR0FBRyxLQUFLLENBQUM7UUFRbEIsY0FBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGdCQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkQsZ0JBQVUsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVdoRSx1QkFBaUIsR0FBaUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRCxtQkFBYSxHQUFtQixFQUFFLENBQUM7UUFHbkMsWUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEIsYUFBTyxHQUFHLEVBQUUsQ0FBQztRQUliLGVBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsZ0JBQVUsR0FBRyxLQUFLLENBQUM7UUFFbkIsaUJBQVcsR0FBRyxLQUFLLENBQUM7UUFFcEIsZUFBUyxHQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDekMsZUFBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QiwwQkFBb0IsR0FBVyxRQUFRLEVBQUUsQ0FBQztRQUMxQyxpQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixpQkFBVyxHQUFHLElBQUksQ0FBQztRQVluQixvQkFBYyxHQUEwQixVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLEVBQVYsQ0FBVSxDQUFDOztJQUgzRCxDQUFDO0lBUUQsc0JBQUkscUNBQVM7UUFIYjs7V0FFRzs7Ozs7UUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQ7O1dBRUc7Ozs7OztRQUNILFVBQ2MsS0FBSztZQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUM7OztPQVJBO0lBYUQsc0JBQUksc0NBQVU7UUFIZDs7V0FFRzs7Ozs7UUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQ7O1dBRUc7Ozs7OztRQUNILFVBQ2UsQ0FBQztZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUM7OztPQVJBO0lBYUQsc0JBQUksc0NBQVU7UUFIZDs7V0FFRzs7Ozs7UUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQ7O1dBRUc7Ozs7OztRQUNILFVBQ2UsQ0FBQztZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUM7OztPQVJBO0lBVUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0gsaUNBQVE7Ozs7Ozs7SUFBUjtRQUFBLGlCQStCQztRQTlCQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUNyQixLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztTQUNIO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDckIsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUNILENBQUM7U0FDSDtRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7Z0JBQ3hCLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBYztnQkFDdkMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FDSCxDQUFDO1NBQ0g7SUFDSCxDQUFDOzs7OztJQUVELG9DQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUN4QixJQUFBLHVCQUFNLEVBQUUsdUNBQWMsRUFBRSxxQkFBSyxFQUFFLDJCQUFRLEVBQUUscUJBQUs7UUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsSUFBSSxjQUFjLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM3QztRQUNELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDOzs7OztJQUVELGtDQUFTOzs7O0lBQVQsVUFBVSxNQUF1QjtRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsTUFBTSxHQUFHLE9BQU8sQ0FBQztTQUNsQjtRQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7Ozs7O0lBRUQsMENBQWlCOzs7O0lBQWpCLFVBQWtCLFFBQWE7UUFDN0IsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHOzs7Ozs7OztJQUNILG9DQUFXOzs7Ozs7O0lBQVg7O1FBQ0UsaUJBQU0sV0FBVyxXQUFFLENBQUM7O1lBQ3BCLEtBQWtCLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsYUFBYSxDQUFBLGdCQUFBLDRCQUFFO2dCQUFqQyxJQUFNLEdBQUcsV0FBQTtnQkFDWixHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDbkI7Ozs7Ozs7OztRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSCx3Q0FBZTs7Ozs7OztJQUFmO1FBQUEsaUJBR0M7UUFGQyxpQkFBTSxlQUFlLFdBQUUsQ0FBQztRQUN4QixVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILCtCQUFNOzs7Ozs7SUFBTjtRQUFBLGlCQXNCQztRQXJCQyxpQkFBTSxNQUFNLFdBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ1osS0FBSSxDQUFDLElBQUksR0FBRyx1QkFBdUIsQ0FBQztnQkFDbEMsS0FBSyxFQUFFLEtBQUksQ0FBQyxLQUFLO2dCQUNqQixNQUFNLEVBQUUsS0FBSSxDQUFDLE1BQU07Z0JBQ25CLE9BQU8sRUFBRSxLQUFJLENBQUMsTUFBTTtnQkFDcEIsVUFBVSxFQUFFLEtBQUksQ0FBQyxNQUFNO2FBQ3hCLENBQUMsQ0FBQztZQUVILEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzNDLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRTdDLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixLQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILG9DQUFXOzs7Ozs7SUFBWDtRQUFBLGlCQXdDQztRQXZDQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7O1lBQ3RDLGNBQWMsR0FBRyxVQUFBLENBQUM7WUFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1gsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7YUFDYjtZQUNELElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNULENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7YUFDYjtZQUNELElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO2dCQUNoQixDQUFDLENBQUMsU0FBUyxHQUFHO29CQUNaLEtBQUssRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUMzQyxNQUFNLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDL0MsQ0FBQztnQkFFRixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7YUFDaEM7aUJBQU07Z0JBQ0wsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2FBQy9GO1lBQ0QsQ0FBQyxDQUFDLFFBQVEsR0FBRztnQkFDWCxDQUFDLEVBQUUsQ0FBQztnQkFDSixDQUFDLEVBQUUsQ0FBQzthQUNMLENBQUM7WUFDRixDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM5QixPQUFPLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsS0FBSyxFQUFFLGlCQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQztZQUMxQyxRQUFRLEVBQUUsaUJBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUM7WUFDeEQsS0FBSyxFQUFFLGlCQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQUEsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ1QsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztpQkFDYjtnQkFDRCxPQUFPLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQztTQUNILENBQUM7UUFFRixxQkFBcUIsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLElBQUksRUFBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSCw2QkFBSTs7Ozs7OztJQUFKO1FBQUEsaUJBaUJDO1FBaEJDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDbkQsT0FBTztTQUNSO1FBQ0QsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOzs7WUFHckIsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7O1lBQ3BDLE9BQU8sR0FBRyxNQUFNLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDbEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7WUFDckIsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUExQixDQUEwQixDQUFDLENBQUM7SUFDbkcsQ0FBQzs7OztJQUVELDZCQUFJOzs7SUFBSjtRQUFBLGlCQStFQztRQTlFQyxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztZQUNwQixDQUFDLENBQUMsU0FBUyxHQUFHLGdCQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDNUcsQ0FBQyxPQUFHLENBQUM7WUFDUCxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDWCxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUNiO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxTQUFTLEdBQUcsZ0JBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUM1RyxDQUFDLE9BQUcsQ0FBQztZQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNYLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQ2I7WUFDRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7OztZQUdHLFFBQVEsR0FBRyxFQUFFO2dDQUNSLFdBQVc7O2dCQUNkLFNBQVMsR0FBRyxPQUFLLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDOztnQkFFOUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQzs7Z0JBQy9DLE9BQU8sR0FBRyxPQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQVEsS0FBSyxPQUFPLEVBQXRDLENBQXNDLENBQUM7WUFDL0UsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixPQUFPLEdBQUcsT0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEtBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBUSxLQUFLLE9BQU8sRUFBdEMsQ0FBc0MsQ0FBQyxJQUFJLFNBQVMsQ0FBQzthQUM1RjtZQUVELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzs7Z0JBRXpCLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTTs7Z0JBQ3pCLElBQUksR0FBRyxPQUFLLFlBQVksQ0FBQyxNQUFNLENBQUM7O2dCQUVoQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztnQkFFbEIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckQsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsT0FBTyxDQUFDLGFBQWEsR0FBRyxnQkFBYSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBRyxDQUFDO2FBQzFFO1lBRUQsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzthQUNoQztZQUVELE9BQUssb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QixDQUFDOztRQTlCRCxLQUFLLElBQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtvQkFBcEMsV0FBVztTQThCckI7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7UUFFNUIsbUNBQW1DO1FBQ25DLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDOztvQkFDL0IsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN0QixPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLG1CQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFoQyxDQUFnQyxDQUFDLEVBQUMsQ0FBQztRQUNoRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksbUJBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQWpDLENBQWlDLENBQUMsRUFBQyxDQUFDO1FBRWxHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsNkJBQTZCO1lBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO1FBRUQscUJBQXFCLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLEVBQUUsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDSCw0Q0FBbUI7Ozs7OztJQUFuQjtRQUFBLGlCQWlFQztRQWhFQyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJOzs7b0JBQ2xCLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYTs7b0JBQ2xDLElBQUksR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxLQUFLLGFBQWEsQ0FBQyxFQUFFLEVBQXpCLENBQXlCLENBQUM7OztvQkFHOUQsSUFBSTtnQkFDUixJQUFJO29CQUNGLElBQUksR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ2hDO2dCQUFDLE9BQU8sRUFBRSxFQUFFO29CQUNYLCtFQUErRTtvQkFDL0UsT0FBTztpQkFDUjtnQkFDRCxJQUFJLEtBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQztpQkFDdEg7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUNsSDtnQkFFRCxJQUFJLEtBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUM3RTtnQkFDRCxJQUFJLEtBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUM3RTtnQkFFRCxJQUFJLEtBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQztpQkFDbkg7cUJBQU07b0JBQ0wsc0JBQXNCO29CQUN0QixJQUFJLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7OzRCQUNqRCxXQUFXLFNBQUE7d0JBQ2YsSUFBSTs7Z0NBQ0YsS0FBdUIsSUFBQSxLQUFBLGlCQUFBLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQSxnQkFBQSw0QkFBRTtvQ0FBOUQsSUFBTSxRQUFRLFdBQUE7O3dDQUNYLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFO29DQUN0QyxJQUFJLENBQUMsV0FBVyxFQUFFO3dDQUNoQixXQUFXLEdBQUcsV0FBVyxDQUFDO3FDQUMzQjt5Q0FBTTt3Q0FDTCxJQUFJLFdBQVcsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRTs0Q0FDekMsV0FBVyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO3lDQUN2Qzt3Q0FDRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRTs0Q0FDM0MsV0FBVyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO3lDQUN6QztxQ0FDRjtpQ0FDRjs7Ozs7Ozs7O3lCQUNGO3dCQUFDLE9BQU8sRUFBRSxFQUFFOzRCQUNYLCtFQUErRTs0QkFDL0UsT0FBTzt5QkFDUjt3QkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO3FCQUMxSDt5QkFBTTt3QkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7cUJBQzlHO2lCQUNGO2dCQUVELElBQUksS0FBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQzFFO2dCQUNELElBQUksS0FBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQzFFO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILG9DQUFXOzs7Ozs7O0lBQVgsVUFBWSxRQUFlO1FBQTNCLGlCQW9CQztRQXBCVyx5QkFBQSxFQUFBLGVBQWU7UUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNOztnQkFDcEIsSUFBSSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQWxDLENBQWtDLENBQUM7WUFFN0UsSUFBSSxJQUFJLEVBQUU7O29CQUNGLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ2xFLGFBQWE7cUJBQ1YsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO3FCQUN2QixVQUFVLEVBQUU7cUJBQ1osUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzVCLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztvQkFFbEIsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQUksSUFBSSxDQUFDLEVBQUksQ0FBQztnQkFDdkYsaUJBQWlCO3FCQUNkLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztxQkFDM0IsVUFBVSxFQUFFO3FCQUNaLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM1QixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBQ0gsNkNBQW9COzs7Ozs7O0lBQXBCLFVBQXFCLElBQUk7O1lBQ2pCLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7WUFDM0IsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUVqQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7WUFFM0MscURBQXFEO1lBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNMLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztZQUMxQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7SUFDSCxxQ0FBWTs7Ozs7OztJQUFaLFVBQWEsTUFBTTs7WUFDWCxZQUFZLEdBQUcsS0FBSzthQUN2QixJQUFJLEVBQU87YUFDWCxDQUFDLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBQzthQUNYLENBQUMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFDO2FBQ1gsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7OztJQUNILCtCQUFNOzs7Ozs7OztJQUFOLFVBQU8sTUFBa0IsRUFBRSxTQUFTOztZQUM1QixVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDOzs7WUFHeEUsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVTtRQUNoRCxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQzFFLE9BQU87U0FDUjtRQUVELHFDQUFxQztRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLE1BQU0sRUFBRTs7O2dCQUUvQixNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU87O2dCQUN2QixNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU87OztnQkFHdkIsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7O2dCQUNuRCxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7O2dCQUV2QyxLQUFLLEdBQUcsR0FBRyxDQUFDLGNBQWMsRUFBRTtZQUNsQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUNqQixLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQzs7Z0JBQ1gsUUFBUSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXpFLFVBQVU7WUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMxQzthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7O0lBQ0gsNEJBQUc7Ozs7Ozs7O0lBQUgsVUFBSSxDQUFTLEVBQUUsQ0FBUyxFQUFFLGVBQWdDO1FBQWhDLGdDQUFBLEVBQUEsdUJBQWdDOztZQUNsRCxTQUFTLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTO1FBQ3RELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRTFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7OztJQUNILDhCQUFLOzs7Ozs7O0lBQUwsVUFBTSxDQUFTLEVBQUUsQ0FBUztRQUN4QixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxRixPQUFPO1NBQ1I7O1lBRUssSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDOztZQUNsRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7UUFFekUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FDbkMsSUFBSSxDQUFDLG9CQUFvQixFQUN6QixTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDeEQsQ0FBQztRQUVGLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0gsNkJBQUk7Ozs7OztJQUFKLFVBQUssTUFBYztRQUNqQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7O0lBRUQsK0JBQU07OztJQUFOO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Ozs7SUFFRCxnQ0FBTzs7O0lBQVA7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7OztJQUNILCtCQUFNOzs7Ozs7SUFBTixVQUFPLEtBQWE7UUFDbEIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBQ0gsOEJBQUs7Ozs7Ozs7SUFBTCxVQUFNLEtBQUs7UUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILCtCQUFNOzs7Ozs7O0lBQU4sVUFBTyxLQUFLO1FBQVosaUJBc0NDOztRQXJDQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN6QixPQUFPO1NBQ1I7O1lBQ0ssSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZO1FBQzlCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7OztZQUc5QyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQzs7WUFDOUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDckQsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFhLENBQUMsVUFBSyxDQUFDLE1BQUcsQ0FBQztnQ0FFOUIsSUFBSTtZQUNiLElBQ0UsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDdkIsQ0FBQyxtQkFBQSxJQUFJLENBQUMsTUFBTSxFQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ25DLENBQUMsbUJBQUEsSUFBSSxDQUFDLE1BQU0sRUFBTyxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQ25DO2dCQUNBLElBQUksT0FBSyxNQUFNLElBQUksT0FBTyxPQUFLLE1BQU0sS0FBSyxRQUFRLEVBQUU7O3dCQUM1QyxNQUFNLEdBQUcsT0FBSyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQUssS0FBSyxFQUFFLElBQUksQ0FBQzs7d0JBQ2pELE9BQU8sR0FBRyxNQUFNLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7b0JBQ2xFLE9BQUssaUJBQWlCLENBQUMsR0FBRyxDQUN4QixPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSzt3QkFDckIsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ25CLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hCLENBQUMsQ0FBQyxDQUNILENBQUM7aUJBQ0g7YUFDRjtRQUNILENBQUM7OztZQWxCRCxLQUFtQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUEsZ0JBQUE7Z0JBQTlCLElBQU0sSUFBSSxXQUFBO3dCQUFKLElBQUk7YUFrQmQ7Ozs7Ozs7OztRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFRCxtQ0FBVTs7OztJQUFWLFVBQVcsSUFBVTs7WUFDYixJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7OztPQUtHOzs7Ozs7OztJQUNILHdDQUFlOzs7Ozs7O0lBQWY7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7OztJQUNILGdDQUFPOzs7Ozs7OztJQUFQLFVBQVEsS0FBSztRQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7O0lBQ0gsbUNBQVU7Ozs7Ozs7O0lBQVYsVUFBVyxLQUFLO1FBQ2QsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUMxQyxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsYUFBYSxxQkFBSSxLQUFLLEdBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBQ0gscUNBQVk7Ozs7Ozs7SUFBWixVQUFhLEtBQUs7O1lBQ1YsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUU3QyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsb0JBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDSCx3Q0FBZTs7Ozs7O0lBQWY7UUFBQSxpQkFLQztRQUpDLE9BQU8sSUFBSSxDQUFDLEtBQUs7YUFDZCxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUF0QixDQUFzQixDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxVQUFDLEtBQWUsRUFBRSxJQUFJLElBQVksT0FBQSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBM0QsQ0FBMkQsRUFBRSxFQUFFLENBQUM7YUFDekcsSUFBSSxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7Ozs7SUFDSCxvQ0FBVzs7Ozs7Ozs7O0lBQVgsVUFBWSxLQUFLLEVBQUUsSUFBSTtRQUNyQixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7OztPQUtHOzs7Ozs7Ozs7O0lBQ0gsb0NBQVc7Ozs7Ozs7OztJQUFYLFVBQVksS0FBSyxFQUFFLElBQUk7UUFDckIsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSCxrQ0FBUzs7Ozs7OztJQUFUO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILHlDQUFnQjs7Ozs7O0lBQWhCO1FBQ0UsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQztJQUNKLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUVILG9DQUFXOzs7Ozs7O0lBRFgsVUFDWSxNQUFrQjtRQUM1QixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BCO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILHFDQUFZOzs7Ozs7O0lBQVosVUFBYSxLQUFLO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDbkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUVuRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBRUgsb0NBQVc7Ozs7OztJQURYLFVBQ1ksTUFBa0I7UUFDNUIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7O2dCQUNuQyxPQUFPLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPOztnQkFDMUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzs7Z0JBQzFDLFNBQVMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVc7O2dCQUN0QyxTQUFTLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXO1lBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1lBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1lBRTNCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBQ0gsbUNBQVU7Ozs7Ozs7SUFBVixVQUFXLEtBQUs7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7SUFFSCxrQ0FBUzs7Ozs7OztJQURULFVBQ1UsS0FBaUI7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDM0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7Ozs7SUFDSCx3Q0FBZTs7Ozs7Ozs7SUFBZixVQUFnQixLQUFpQixFQUFFLElBQVM7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFFekIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7WUFDN0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUVEOztPQUVHOzs7OztJQUNILCtCQUFNOzs7O0lBQU47UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7O09BRUc7Ozs7O0lBQ0gsa0NBQVM7Ozs7SUFBVDs7WUFDUSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNOztZQUNyRCxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLOztZQUNsRCxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUVwRCxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3BFLE9BQU87U0FDUjtRQUVELElBQUksU0FBUyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7SUFFRDs7O09BR0c7Ozs7OztJQUNILG9DQUFXOzs7OztJQUFYLFVBQVksTUFBYzs7WUFDbEIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxNQUFNLEVBQWYsQ0FBZSxDQUFDO1FBQ2xELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Z0JBMy9CRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLE1BQU0sRUFBRSxDQUFDLDZVQUE2VSxDQUFDO29CQUN2VixRQUFRLEVBQUUsc3hHQWdHWDtvQkFDQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25HOzs7O2dCQXhKQyxVQUFVO2dCQVlWLE1BQU07Z0JBQ04saUJBQWlCO2dCQWtCVixhQUFhOzs7eUJBMkhuQixLQUFLO3dCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLO2dDQUNMLEtBQUs7d0JBQ0wsS0FBSztrQ0FDTCxLQUFLOzZCQUNMLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxLQUFLOzRCQUNMLEtBQUs7K0JBQ0wsS0FBSzsrQkFDTCxLQUFLO2lDQUNMLEtBQUs7NkJBQ0wsS0FBSzs0QkFDTCxLQUFLOytCQUNMLEtBQUs7K0JBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFDTCxLQUFLOzBCQUNMLEtBQUs7NkJBQ0wsS0FBSzs2QkFDTCxLQUFLO3lCQUNMLEtBQUs7aUNBQ0wsS0FBSzsyQkFFTCxNQUFNOzZCQUNOLE1BQU07NkJBQ04sTUFBTTsrQkFFTixZQUFZLFNBQUMsY0FBYzsrQkFDM0IsWUFBWSxTQUFDLGNBQWM7a0NBQzNCLFlBQVksU0FBQyxpQkFBaUI7K0JBQzlCLFlBQVksU0FBQyxjQUFjO3dCQUUzQixTQUFTLFNBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTsrQkFDOUMsWUFBWSxTQUFDLGFBQWE7K0JBQzFCLFlBQVksU0FBQyxhQUFhO2lDQStCMUIsS0FBSzs0QkFhTCxLQUFLLFNBQUMsV0FBVzs2QkFlakIsS0FBSyxTQUFDLFlBQVk7NkJBZWxCLEtBQUssU0FBQyxZQUFZOzhCQTZxQmxCLFlBQVksU0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzs4QkF5QjdDLFlBQVksU0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzs0QkE0QjdDLFlBQVksU0FBQyxrQkFBa0I7O0lBZ0VsQyxxQkFBQztDQUFBLEFBNS9CRCxDQXdHb0Msa0JBQWtCLEdBbzVCckQ7U0FwNUJZLGNBQWM7OztJQUN6QixnQ0FBaUM7O0lBQ2pDLCtCQUE0Qjs7SUFDNUIsa0NBQXNDOztJQUN0QywrQkFBNEI7O0lBQzVCLHVDQUFtQzs7SUFDbkMsK0JBQW9COztJQUNwQix5Q0FBZ0M7O0lBQ2hDLG9DQUE0Qjs7SUFDNUIsdUNBQStCOztJQUMvQix1Q0FBK0I7O0lBQy9CLG1DQUEyQjs7SUFDM0Isc0NBQThCOztJQUM5QixzQ0FBOEI7O0lBQzlCLHdDQUErQjs7SUFDL0Isb0NBQTJCOztJQUMzQixtQ0FBeUI7O0lBQ3pCLHNDQUE0Qjs7SUFDNUIsc0NBQTRCOztJQUM1QixrQ0FBMEI7O0lBQzFCLG1DQUEwQjs7SUFDMUIsb0NBQTRCOztJQUM1QixpQ0FBa0M7O0lBQ2xDLGlDQUFrQzs7SUFDbEMsb0NBQXFDOztJQUNyQyxvQ0FBcUM7O0lBQ3JDLGdDQUFpQzs7SUFDakMsd0NBQTZCOztJQUU3QixrQ0FBMkQ7O0lBQzNELG9DQUE2RDs7SUFDN0Qsb0NBQWdFOztJQUVoRSxzQ0FBNkQ7O0lBQzdELHNDQUE2RDs7SUFDN0QseUNBQW1FOztJQUNuRSxzQ0FBNkQ7O0lBRTdELCtCQUFtRTs7SUFDbkUsc0NBQWlFOztJQUNqRSxzQ0FBaUU7O0lBRWpFLDJDQUFxRDs7SUFDckQsdUNBQW1DOztJQUNuQyxnQ0FBb0I7O0lBQ3BCLDhCQUFxQjs7SUFDckIsZ0NBQXNCOztJQUN0QixpQ0FBYTs7SUFDYixzQ0FBa0I7O0lBQ2xCLG1DQUFrQjs7SUFDbEIsdUNBQW1COztJQUNuQixtQ0FBa0I7O0lBQ2xCLG9DQUFtQjs7SUFDbkIsc0NBQW1COztJQUNuQixxQ0FBb0I7O0lBQ3BCLCtCQUFhOztJQUNiLG1DQUF5Qzs7SUFDekMsbUNBQXVCOztJQUN2Qiw4Q0FBMEM7O0lBQzFDLHFDQUFtQjs7SUFDbkIscUNBQW1COztJQVduQix3Q0FDMkQ7Ozs7O0lBVHpELDRCQUFzQjs7SUFDdEIsOEJBQW1COztJQUNuQiw0QkFBNEI7Ozs7O0lBQzVCLHVDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHJlbmFtZSB0cmFuc2l0aW9uIGR1ZSB0byBjb25mbGljdCB3aXRoIGQzIHRyYW5zaXRpb25cbmltcG9ydCB7IGFuaW1hdGUsIHN0eWxlLCB0cmFuc2l0aW9uIGFzIG5nVHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZUNoYXJ0Q29tcG9uZW50LFxuICBDaGFydENvbXBvbmVudCxcbiAgQ29sb3JIZWxwZXIsXG4gIFZpZXdEaW1lbnNpb25zLFxuICBjYWxjdWxhdGVWaWV3RGltZW5zaW9uc1xufSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0ICogYXMgc2hhcGUgZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0ICdkMy10cmFuc2l0aW9uJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaWRlbnRpdHksIHNjYWxlLCB0b1NWRywgdHJhbnNmb3JtLCB0cmFuc2xhdGUgfSBmcm9tICd0cmFuc2Zvcm1hdGlvbi1tYXRyaXgnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uL21vZGVscy9ub2RlLm1vZGVsJztcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vdXRpbHMvaWQnO1xuXG4vKipcbiAqIE1hdHJpeFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdHJpeCB7XG4gIGE6IG51bWJlcjtcbiAgYjogbnVtYmVyO1xuICBjOiBudW1iZXI7XG4gIGQ6IG51bWJlcjtcbiAgZTogbnVtYmVyO1xuICBmOiBudW1iZXI7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1ncmFwaCcsXG4gIHN0eWxlczogW2AuZ3JhcGh7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5ncmFwaCAuZWRnZXtzdHJva2U6IzY2NjtmaWxsOm5vbmV9LmdyYXBoIC5lZGdlIC5lZGdlLWxhYmVse3N0cm9rZTpub25lO2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzI1MWUxZX0uZ3JhcGggLnBhbm5pbmctcmVjdHtmaWxsOnRyYW5zcGFyZW50O2N1cnNvcjptb3ZlO3dpZHRoOjEwMDAwMDBweH0uZ3JhcGggLm5vZGUtZ3JvdXAgLm5vZGU6Zm9jdXN7b3V0bGluZTowfS5ncmFwaCAuY2x1c3RlciByZWN0e29wYWNpdHk6LjJ9YF0sXG4gIHRlbXBsYXRlOiBgPG5neC1jaGFydHMtY2hhcnRcbiAgW3ZpZXddPVwiW3dpZHRoLCBoZWlnaHRdXCJcbiAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcbiAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXG4gIChsZWdlbmRMYWJlbENsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiXG4gIChsZWdlbmRMYWJlbERlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIlxuICBtb3VzZVdoZWVsXG4gIChtb3VzZVdoZWVsVXApPVwib25ab29tKCRldmVudCwgJ2luJylcIlxuICAobW91c2VXaGVlbERvd24pPVwib25ab29tKCRldmVudCwgJ291dCcpXCJcbj5cbiAgPHN2ZzpnXG4gICAgKm5nSWY9XCJpbml0aWFsaXplZCAmJiBncmFwaFwiXG4gICAgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiXG4gICAgKHRvdWNoc3RhcnQpPVwib25Ub3VjaFN0YXJ0KCRldmVudClcIlxuICAgICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxuICAgIGNsYXNzPVwiZ3JhcGggY2hhcnRcIlxuICA+XG4gICAgPGRlZnM+XG4gICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJkZWZzVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJkZWZzVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgPHN2ZzpwYXRoXG4gICAgICAgIGNsYXNzPVwidGV4dC1wYXRoXCJcbiAgICAgICAgKm5nRm9yPVwibGV0IGxpbmsgb2YgZ3JhcGguZWRnZXNcIlxuICAgICAgICBbYXR0ci5kXT1cImxpbmsudGV4dFBhdGhcIlxuICAgICAgICBbYXR0ci5pZF09XCJsaW5rLmlkXCJcbiAgICAgID48L3N2ZzpwYXRoPlxuICAgIDwvZGVmcz5cbiAgICA8c3ZnOnJlY3RcbiAgICAgIGNsYXNzPVwicGFubmluZy1yZWN0XCJcbiAgICAgIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKiAxMDBcIlxuICAgICAgW2F0dHIuaGVpZ2h0XT1cImRpbXMuaGVpZ2h0ICogMTAwXCJcbiAgICAgIFthdHRyLnRyYW5zZm9ybV09XCIndHJhbnNsYXRlKCcgKyAoLWRpbXMud2lkdGggfHwgMCkgKiA1MCArICcsJyArICgtZGltcy5oZWlnaHQgfHwgMCkgKiA1MCArICcpJ1wiXG4gICAgICAobW91c2Vkb3duKT1cImlzUGFubmluZyA9IHRydWVcIlxuICAgIC8+XG4gICAgPHN2ZzpnIGNsYXNzPVwiY2x1c3RlcnNcIj5cbiAgICAgIDxzdmc6Z1xuICAgICAgICAjY2x1c3RlckVsZW1lbnRcbiAgICAgICAgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGguY2x1c3RlcnM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCJcbiAgICAgICAgY2xhc3M9XCJub2RlLWdyb3VwXCJcbiAgICAgICAgW2lkXT1cIm5vZGUuaWRcIlxuICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxuICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlKVwiXG4gICAgICA+XG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICpuZ0lmPVwiY2x1c3RlclRlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjbHVzdGVyVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCJcbiAgICAgICAgPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxzdmc6ZyAqbmdJZj1cIiFjbHVzdGVyVGVtcGxhdGVcIiBjbGFzcz1cIm5vZGUgY2x1c3RlclwiPlxuICAgICAgICAgIDxzdmc6cmVjdFxuICAgICAgICAgICAgW2F0dHIud2lkdGhdPVwibm9kZS5kaW1lbnNpb24ud2lkdGhcIlxuICAgICAgICAgICAgW2F0dHIuaGVpZ2h0XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodFwiXG4gICAgICAgICAgICBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHN2Zzp0ZXh0IGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIiBbYXR0ci54XT1cIjEwXCIgW2F0dHIueV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCI+XG4gICAgICAgICAgICB7eyBub2RlLmxhYmVsIH19XG4gICAgICAgICAgPC9zdmc6dGV4dD5cbiAgICAgICAgPC9zdmc6Zz5cbiAgICAgIDwvc3ZnOmc+XG4gICAgPC9zdmc6Zz5cbiAgICA8c3ZnOmcgY2xhc3M9XCJsaW5rc1wiPlxuICAgICAgPHN2ZzpnICNsaW5rRWxlbWVudCAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlczsgdHJhY2tCeTogdHJhY2tMaW5rQnlcIiBjbGFzcz1cImxpbmstZ3JvdXBcIiBbaWRdPVwibGluay5pZFwiPlxuICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAqbmdJZj1cImxpbmtUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlua1RlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IGxpbmsgfVwiXG4gICAgICAgID48L25nLXRlbXBsYXRlPlxuICAgICAgICA8c3ZnOnBhdGggKm5nSWY9XCIhbGlua1RlbXBsYXRlXCIgY2xhc3M9XCJlZGdlXCIgW2F0dHIuZF09XCJsaW5rLmxpbmVcIiAvPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuICAgIDxzdmc6ZyBjbGFzcz1cIm5vZGVzXCI+XG4gICAgICA8c3ZnOmdcbiAgICAgICAgI25vZGVFbGVtZW50XG4gICAgICAgICpuZ0Zvcj1cImxldCBub2RlIG9mIGdyYXBoLm5vZGVzOyB0cmFja0J5OiB0cmFja05vZGVCeVwiXG4gICAgICAgIGNsYXNzPVwibm9kZS1ncm91cFwiXG4gICAgICAgIFtpZF09XCJub2RlLmlkXCJcbiAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cIm5vZGUudHJhbnNmb3JtXCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSlcIlxuICAgICAgICAobW91c2Vkb3duKT1cIm9uTm9kZU1vdXNlRG93bigkZXZlbnQsIG5vZGUpXCJcbiAgICAgID5cbiAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgKm5nSWY9XCJub2RlVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5vZGVUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlIH1cIlxuICAgICAgICA+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPHN2ZzpjaXJjbGVcbiAgICAgICAgICAqbmdJZj1cIiFub2RlVGVtcGxhdGVcIlxuICAgICAgICAgIHI9XCIxMFwiXG4gICAgICAgICAgW2F0dHIuY3hdPVwibm9kZS5kaW1lbnNpb24ud2lkdGggLyAyXCJcbiAgICAgICAgICBbYXR0ci5jeV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCJcbiAgICAgICAgICBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIlxuICAgICAgICAvPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuICA8L3N2ZzpnPlxuPC9uZ3gtY2hhcnRzLWNoYXJ0PlxuYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdsaW5rJywgW25nVHJhbnNpdGlvbignKiA9PiAqJywgW2FuaW1hdGUoNTAwLCBzdHlsZSh7IHRyYW5zZm9ybTogJyonIH0pKV0pXSldXG59KVxuZXhwb3J0IGNsYXNzIEdyYXBoQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIGxlZ2VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBub2RlczogTm9kZVtdID0gW107XG4gIEBJbnB1dCgpIGNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdID0gW107XG4gIEBJbnB1dCgpIGxpbmtzOiBFZGdlW10gPSBbXTtcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcbiAgQElucHV0KCkgY3VydmU6IGFueTtcbiAgQElucHV0KCkgZHJhZ2dpbmdFbmFibGVkID0gdHJ1ZTtcbiAgQElucHV0KCkgbm9kZUhlaWdodDogbnVtYmVyO1xuICBASW5wdXQoKSBub2RlTWF4SGVpZ2h0OiBudW1iZXI7XG4gIEBJbnB1dCgpIG5vZGVNaW5IZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgbm9kZVdpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIG5vZGVNaW5XaWR0aDogbnVtYmVyO1xuICBASW5wdXQoKSBub2RlTWF4V2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgcGFubmluZ0VuYWJsZWQgPSB0cnVlO1xuICBASW5wdXQoKSBlbmFibGVab29tID0gdHJ1ZTtcbiAgQElucHV0KCkgem9vbVNwZWVkID0gMC4xO1xuICBASW5wdXQoKSBtaW5ab29tTGV2ZWwgPSAwLjE7XG4gIEBJbnB1dCgpIG1heFpvb21MZXZlbCA9IDQuMDtcbiAgQElucHV0KCkgYXV0b1pvb20gPSBmYWxzZTtcbiAgQElucHV0KCkgcGFuT25ab29tID0gdHJ1ZTtcbiAgQElucHV0KCkgYXV0b0NlbnRlciA9IGZhbHNlO1xuICBASW5wdXQoKSB1cGRhdGUkOiBPYnNlcnZhYmxlPGFueT47XG4gIEBJbnB1dCgpIGNlbnRlciQ6IE9ic2VydmFibGU8YW55PjtcbiAgQElucHV0KCkgem9vbVRvRml0JDogT2JzZXJ2YWJsZTxhbnk+O1xuICBASW5wdXQoKSBwYW5Ub05vZGUkOiBPYnNlcnZhYmxlPGFueT47XG4gIEBJbnB1dCgpIGxheW91dDogc3RyaW5nIHwgTGF5b3V0O1xuICBASW5wdXQoKSBsYXlvdXRTZXR0aW5nczogYW55O1xuXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHpvb21DaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBDb250ZW50Q2hpbGQoJ2xpbmtUZW1wbGF0ZScpIGxpbmtUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZCgnbm9kZVRlbXBsYXRlJykgbm9kZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKCdjbHVzdGVyVGVtcGxhdGUnKSBjbHVzdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoJ2RlZnNUZW1wbGF0ZScpIGRlZnNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAVmlld0NoaWxkKENoYXJ0Q29tcG9uZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgY2hhcnQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGRyZW4oJ25vZGVFbGVtZW50Jykgbm9kZUVsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG4gIEBWaWV3Q2hpbGRyZW4oJ2xpbmtFbGVtZW50JykgbGlua0VsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG5cbiAgZ3JhcGhTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgY29sb3JzOiBDb2xvckhlbHBlcjtcbiAgZGltczogVmlld0RpbWVuc2lvbnM7XG4gIG1hcmdpbiA9IFswLCAwLCAwLCAwXTtcbiAgcmVzdWx0cyA9IFtdO1xuICBzZXJpZXNEb21haW46IGFueTtcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XG4gIGxlZ2VuZE9wdGlvbnM6IGFueTtcbiAgaXNQYW5uaW5nID0gZmFsc2U7XG4gIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgZHJhZ2dpbmdOb2RlOiBOb2RlO1xuICBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBncmFwaDogR3JhcGg7XG4gIGdyYXBoRGltczogYW55ID0geyB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XG4gIF9vbGRMaW5rczogRWRnZVtdID0gW107XG4gIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBNYXRyaXggPSBpZGVudGl0eSgpO1xuICBfdG91Y2hMYXN0WCA9IG51bGw7XG4gIF90b3VjaExhc3RZID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXG4gICAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHpvbmUsIGNkKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdyb3VwUmVzdWx0c0J5OiAobm9kZTogYW55KSA9PiBzdHJpbmcgPSBub2RlID0+IG5vZGUubGFiZWw7XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCB6b29tIGxldmVsXG4gICAqL1xuICBnZXQgem9vbUxldmVsKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmE7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcbiAgICovXG4gIEBJbnB1dCgnem9vbUxldmVsJylcbiAgc2V0IHpvb21MZXZlbChsZXZlbCkge1xuICAgIHRoaXMuem9vbVRvKE51bWJlcihsZXZlbCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBnZXQgcGFuT2Zmc2V0WCgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBASW5wdXQoJ3Bhbk9mZnNldFgnKVxuICBzZXQgcGFuT2Zmc2V0WCh4KSB7XG4gICAgdGhpcy5wYW5UbyhOdW1iZXIoeCksIG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBnZXQgcGFuT2Zmc2V0WSgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXG4gICAqL1xuICBASW5wdXQoJ3Bhbk9mZnNldFknKVxuICBzZXQgcGFuT2Zmc2V0WSh5KSB7XG4gICAgdGhpcy5wYW5UbyhudWxsLCBOdW1iZXIoeSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudXBkYXRlJCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMudXBkYXRlJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlciQpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLmNlbnRlciQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNlbnRlcigpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuem9vbVRvRml0JCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMuem9vbVRvRml0JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhblRvTm9kZSQpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLnBhblRvTm9kZSQuc3Vic2NyaWJlKChub2RlSWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucGFuVG9Ob2RlSWQobm9kZUlkKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgbGF5b3V0LCBsYXlvdXRTZXR0aW5ncywgbm9kZXMsIGNsdXN0ZXJzLCBsaW5rcyB9ID0gY2hhbmdlcztcbiAgICB0aGlzLnNldExheW91dCh0aGlzLmxheW91dCk7XG4gICAgaWYgKGxheW91dFNldHRpbmdzKSB7XG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgc2V0TGF5b3V0KGxheW91dDogc3RyaW5nIHwgTGF5b3V0KTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIGlmICghbGF5b3V0KSB7XG4gICAgICBsYXlvdXQgPSAnZGFncmUnO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxheW91dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMubGF5b3V0ID0gdGhpcy5sYXlvdXRTZXJ2aWNlLmdldExheW91dChsYXlvdXQpO1xuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcbiAgICB9XG4gIH1cblxuICBzZXRMYXlvdXRTZXR0aW5ncyhzZXR0aW5nczogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMubGF5b3V0LnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICBzdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJhc2UgY2xhc3MgdXBkYXRlIGltcGxlbWVudGF0aW9uIGZvciB0aGUgZGFnIGdyYXBoXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuICAgIGlmICghdGhpcy5jdXJ2ZSkge1xuICAgICAgdGhpcy5jdXJ2ZSA9IHNoYXBlLmN1cnZlQnVuZGxlLmJldGEoMSk7XG4gICAgfVxuXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLmRpbXMgPSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyh7XG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICBtYXJnaW5zOiB0aGlzLm1hcmdpbixcbiAgICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmRcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNlcmllc0RvbWFpbiA9IHRoaXMuZ2V0U2VyaWVzRG9tYWluKCk7XG4gICAgICB0aGlzLnNldENvbG9ycygpO1xuICAgICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XG5cbiAgICAgIHRoaXMuY3JlYXRlR3JhcGgoKTtcbiAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBkYWdyZSBncmFwaCBlbmdpbmVcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBjcmVhdGVHcmFwaCgpOiB2b2lkIHtcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBjb25zdCBpbml0aWFsaXplTm9kZSA9IG4gPT4ge1xuICAgICAgaWYgKCFuLm1ldGEpIHtcbiAgICAgICAgbi5tZXRhID0ge307XG4gICAgICB9XG4gICAgICBpZiAoIW4uaWQpIHtcbiAgICAgICAgbi5pZCA9IGlkKCk7XG4gICAgICB9XG4gICAgICBpZiAoIW4uZGltZW5zaW9uKSB7XG4gICAgICAgIG4uZGltZW5zaW9uID0ge1xuICAgICAgICAgIHdpZHRoOiB0aGlzLm5vZGVXaWR0aCA/IHRoaXMubm9kZVdpZHRoIDogMzAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLm5vZGVIZWlnaHQgPyB0aGlzLm5vZGVIZWlnaHQgOiAzMFxuICAgICAgICB9O1xuXG4gICAgICAgIG4ubWV0YS5mb3JjZURpbWVuc2lvbnMgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG4ubWV0YS5mb3JjZURpbWVuc2lvbnMgPSBuLm1ldGEuZm9yY2VEaW1lbnNpb25zID09PSB1bmRlZmluZWQgPyB0cnVlIDogbi5tZXRhLmZvcmNlRGltZW5zaW9ucztcbiAgICAgIH1cbiAgICAgIG4ucG9zaXRpb24gPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH07XG4gICAgICBuLmRhdGEgPSBuLmRhdGEgPyBuLmRhdGEgOiB7fTtcbiAgICAgIHJldHVybiBuO1xuICAgIH07XG5cbiAgICB0aGlzLmdyYXBoID0ge1xuICAgICAgbm9kZXM6IFsuLi50aGlzLm5vZGVzXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxuICAgICAgY2x1c3RlcnM6IFsuLi4odGhpcy5jbHVzdGVycyB8fCBbXSldLm1hcChpbml0aWFsaXplTm9kZSksXG4gICAgICBlZGdlczogWy4uLnRoaXMubGlua3NdLm1hcChlID0+IHtcbiAgICAgICAgaWYgKCFlLmlkKSB7XG4gICAgICAgICAgZS5pZCA9IGlkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9KVxuICAgIH07XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIHRoZSBncmFwaCB1c2luZyBkYWdyZSBsYXlvdXRzXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgZHJhdygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubGF5b3V0IHx8IHR5cGVvZiB0aGlzLmxheW91dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQ2FsYyB2aWV3IGRpbXMgZm9yIHRoZSBub2Rlc1xuICAgIHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpO1xuXG4gICAgLy8gUmVjYWxjIHRoZSBsYXlvdXRcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmxheW91dC5ydW4odGhpcy5ncmFwaCk7XG4gICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxuICAgICAgcmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xuICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgICAgIHRoaXMudGljaygpO1xuICAgICAgfSlcbiAgICApO1xuICAgIHJlc3VsdCQucGlwZShmaXJzdChncmFwaCA9PiBncmFwaC5ub2Rlcy5sZW5ndGggPiAwKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpKTtcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgLy8gVHJhbnNwb3NlcyB2aWV3IG9wdGlvbnMgdG8gdGhlIG5vZGVcbiAgICB0aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IHtcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke24ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8XG4gICAgICAgIDB9KWA7XG4gICAgICBpZiAoIW4uZGF0YSkge1xuICAgICAgICBuLmRhdGEgPSB7fTtcbiAgICAgIH1cbiAgICAgIG4uZGF0YS5jb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpO1xuICAgIH0pO1xuICAgICh0aGlzLmdyYXBoLmNsdXN0ZXJzIHx8IFtdKS5tYXAobiA9PiB7XG4gICAgICBuLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtuLnBvc2l0aW9uLnggLSBuLmRpbWVuc2lvbi53aWR0aCAvIDIgfHwgMH0sICR7bi5wb3NpdGlvbi55IC0gbi5kaW1lbnNpb24uaGVpZ2h0IC8gMiB8fFxuICAgICAgICAwfSlgO1xuICAgICAgaWYgKCFuLmRhdGEpIHtcbiAgICAgICAgbi5kYXRhID0ge307XG4gICAgICB9XG4gICAgICBuLmRhdGEuY29sb3IgPSB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgbGFiZWxzIHRvIHRoZSBuZXcgcG9zaXRpb25zXG4gICAgY29uc3QgbmV3TGlua3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGVkZ2VMYWJlbElkIGluIHRoaXMuZ3JhcGguZWRnZUxhYmVscykge1xuICAgICAgY29uc3QgZWRnZUxhYmVsID0gdGhpcy5ncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcblxuICAgICAgY29uc3Qgbm9ybUtleSA9IGVkZ2VMYWJlbElkLnJlcGxhY2UoL1teXFx3LV0qL2csICcnKTtcbiAgICAgIGxldCBvbGRMaW5rID0gdGhpcy5fb2xkTGlua3MuZmluZChvbCA9PiBgJHtvbC5zb3VyY2V9JHtvbC50YXJnZXR9YCA9PT0gbm9ybUtleSk7XG4gICAgICBpZiAoIW9sZExpbmspIHtcbiAgICAgICAgb2xkTGluayA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChubCA9PiBgJHtubC5zb3VyY2V9JHtubC50YXJnZXR9YCA9PT0gbm9ybUtleSkgfHwgZWRnZUxhYmVsO1xuICAgICAgfVxuXG4gICAgICBvbGRMaW5rLm9sZExpbmUgPSBvbGRMaW5rLmxpbmU7XG5cbiAgICAgIGNvbnN0IHBvaW50cyA9IGVkZ2VMYWJlbC5wb2ludHM7XG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUocG9pbnRzKTtcblxuICAgICAgY29uc3QgbmV3TGluayA9IE9iamVjdC5hc3NpZ24oe30sIG9sZExpbmspO1xuICAgICAgbmV3TGluay5saW5lID0gbGluZTtcbiAgICAgIG5ld0xpbmsucG9pbnRzID0gcG9pbnRzO1xuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gcG9pbnRzW01hdGguZmxvb3IocG9pbnRzLmxlbmd0aCAvIDIpXTtcbiAgICAgIGlmICh0ZXh0UG9zKSB7XG4gICAgICAgIG5ld0xpbmsudGV4dFRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0ZXh0UG9zLnggfHwgMH0sJHt0ZXh0UG9zLnkgfHwgMH0pYDtcbiAgICAgIH1cblxuICAgICAgbmV3TGluay50ZXh0QW5nbGUgPSAwO1xuICAgICAgaWYgKCFuZXdMaW5rLm9sZExpbmUpIHtcbiAgICAgICAgbmV3TGluay5vbGRMaW5lID0gbmV3TGluay5saW5lO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKG5ld0xpbmspO1xuICAgICAgbmV3TGlua3MucHVzaChuZXdMaW5rKTtcbiAgICB9XG5cbiAgICB0aGlzLmdyYXBoLmVkZ2VzID0gbmV3TGlua3M7XG5cbiAgICAvLyBNYXAgdGhlIG9sZCBsaW5rcyBmb3IgYW5pbWF0aW9uc1xuICAgIGlmICh0aGlzLmdyYXBoLmVkZ2VzKSB7XG4gICAgICB0aGlzLl9vbGRMaW5rcyA9IHRoaXMuZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xuICAgICAgICBjb25zdCBuZXdMID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XG4gICAgICAgIG5ld0wub2xkTGluZSA9IGwubGluZTtcbiAgICAgICAgcmV0dXJuIG5ld0w7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIGhlaWdodC93aWR0aCB0b3RhbFxuICAgIHRoaXMuZ3JhcGhEaW1zLndpZHRoID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnggKyBuLmRpbWVuc2lvbi53aWR0aCkpO1xuICAgIHRoaXMuZ3JhcGhEaW1zLmhlaWdodCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi55ICsgbi5kaW1lbnNpb24uaGVpZ2h0KSk7XG5cbiAgICBpZiAodGhpcy5hdXRvWm9vbSkge1xuICAgICAgdGhpcy56b29tVG9GaXQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRvQ2VudGVyKSB7XG4gICAgICAvLyBBdXRvLWNlbnRlciB3aGVuIHJlbmRlcmluZ1xuICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5yZWRyYXdMaW5lcygpKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmVzIHRoZSBub2RlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlIGRpbWVuc2lvbnNcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBhcHBseU5vZGVEaW1lbnNpb25zKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm5vZGVFbGVtZW50cyAmJiB0aGlzLm5vZGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubm9kZUVsZW1lbnRzLm1hcChlbGVtID0+IHtcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IGVsZW0ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5hdGl2ZUVsZW1lbnQuaWQpO1xuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0XG4gICAgICAgIGxldCBkaW1zO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGRpbXMgPSBuYXRpdmVFbGVtZW50LmdldEJCb3goKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5vZGVIZWlnaHQpIHsgICAgICAgICAgXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0ICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi5oZWlnaHQgOiB0aGlzLm5vZGVIZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0ICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi5oZWlnaHQgOiBkaW1zLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhIZWlnaHQpIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1heEhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbkhlaWdodCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWluSGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm5vZGVXaWR0aCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gIG5vZGUuZGltZW5zaW9uLndpZHRoICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi53aWR0aCA6IHRoaXMubm9kZVdpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGhcbiAgICAgICAgICBpZiAobmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IG1heFRleHREaW1zO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZXh0RWxlbSBvZiBuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50QkJveCA9IHRleHRFbGVtLmdldEJCb3goKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1heFRleHREaW1zKSB7XG4gICAgICAgICAgICAgICAgICBtYXhUZXh0RGltcyA9IGN1cnJlbnRCQm94O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJCb3gud2lkdGggPiBtYXhUZXh0RGltcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhUZXh0RGltcy53aWR0aCA9IGN1cnJlbnRCQm94LndpZHRoO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCQm94LmhlaWdodCA+IG1heFRleHREaW1zLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhUZXh0RGltcy5oZWlnaHQgPSBjdXJyZW50QkJveC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gbm9kZS5kaW1lbnNpb24ud2lkdGggJiYgbm9kZS5tZXRhLmZvcmNlRGltZW5zaW9ucyA/IG5vZGUuZGltZW5zaW9uLndpZHRoIDogbWF4VGV4dERpbXMud2lkdGggKyAyMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBub2RlLmRpbWVuc2lvbi53aWR0aCAmJiBub2RlLm1ldGEuZm9yY2VEaW1lbnNpb25zID8gbm9kZS5kaW1lbnNpb24ud2lkdGggOiBkaW1zLndpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhXaWR0aCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1heFdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ub2RlTWluV2lkdGgpIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNaW5XaWR0aCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWRyYXdzIHRoZSBsaW5lcyB3aGVuIGRyYWdnZWQgb3Igdmlld3BvcnQgdXBkYXRlZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIHJlZHJhd0xpbmVzKF9hbmltYXRlID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMubGlua0VsZW1lbnRzLm1hcChsaW5rRWwgPT4ge1xuICAgICAgY29uc3QgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChsaW4gPT4gbGluLmlkID09PSBsaW5rRWwubmF0aXZlRWxlbWVudC5pZCk7XG5cbiAgICAgIGlmIChlZGdlKSB7XG4gICAgICAgIGNvbnN0IGxpbmtTZWxlY3Rpb24gPSBzZWxlY3QobGlua0VsLm5hdGl2ZUVsZW1lbnQpLnNlbGVjdCgnLmxpbmUnKTtcbiAgICAgICAgbGlua1NlbGVjdGlvblxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRMaW5lKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5saW5lKTtcblxuICAgICAgICBjb25zdCB0ZXh0UGF0aFNlbGVjdGlvbiA9IHNlbGVjdCh0aGlzLmNoYXJ0RWxlbWVudC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoYCMke2VkZ2UuaWR9YCk7XG4gICAgICAgIHRleHRQYXRoU2VsZWN0aW9uXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZFRleHRQYXRoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS50ZXh0UGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSB0ZXh0IGRpcmVjdGlvbnMgLyBmbGlwcGluZ1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGNhbGNEb21pbmFudEJhc2VsaW5lKGxpbmspOiB2b2lkIHtcbiAgICBjb25zdCBmaXJzdFBvaW50ID0gbGluay5wb2ludHNbMF07XG4gICAgY29uc3QgbGFzdFBvaW50ID0gbGluay5wb2ludHNbbGluay5wb2ludHMubGVuZ3RoIC0gMV07XG4gICAgbGluay5vbGRUZXh0UGF0aCA9IGxpbmsudGV4dFBhdGg7XG5cbiAgICBpZiAobGFzdFBvaW50LnggPCBmaXJzdFBvaW50LngpIHtcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWJlZm9yZS1lZGdlJztcblxuICAgICAgLy8gcmV2ZXJzZSB0ZXh0IHBhdGggZm9yIHdoZW4gaXRzIGZsaXBwZWQgdXBzaWRlIGRvd25cbiAgICAgIGxpbmsudGV4dFBhdGggPSB0aGlzLmdlbmVyYXRlTGluZShbLi4ubGluay5wb2ludHNdLnJldmVyc2UoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWFmdGVyLWVkZ2UnO1xuICAgICAgbGluay50ZXh0UGF0aCA9IGxpbmsubGluZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgdGhlIG5ldyBsaW5lIHBhdGhcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBnZW5lcmF0ZUxpbmUocG9pbnRzKTogYW55IHtcbiAgICBjb25zdCBsaW5lRnVuY3Rpb24gPSBzaGFwZVxuICAgICAgLmxpbmU8YW55PigpXG4gICAgICAueChkID0+IGQueClcbiAgICAgIC55KGQgPT4gZC55KVxuICAgICAgLmN1cnZlKHRoaXMuY3VydmUpO1xuICAgIHJldHVybiBsaW5lRnVuY3Rpb24ocG9pbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tIHdhcyBpbnZva2VkIGZyb20gZXZlbnRcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvblpvb20oJGV2ZW50OiBNb3VzZUV2ZW50LCBkaXJlY3Rpb24pOiB2b2lkIHtcbiAgICBjb25zdCB6b29tRmFjdG9yID0gMSArIChkaXJlY3Rpb24gPT09ICdpbicgPyB0aGlzLnpvb21TcGVlZCA6IC10aGlzLnpvb21TcGVlZCk7XG5cbiAgICAvLyBDaGVjayB0aGF0IHpvb21pbmcgd291bGRuJ3QgcHV0IHVzIG91dCBvZiBib3VuZHNcbiAgICBjb25zdCBuZXdab29tTGV2ZWwgPSB0aGlzLnpvb21MZXZlbCAqIHpvb21GYWN0b3I7XG4gICAgaWYgKG5ld1pvb21MZXZlbCA8PSB0aGlzLm1pblpvb21MZXZlbCB8fCBuZXdab29tTGV2ZWwgPj0gdGhpcy5tYXhab29tTGV2ZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB6b29taW5nIGlzIGVuYWJsZWQgb3Igbm90XG4gICAgaWYgKCF0aGlzLmVuYWJsZVpvb20pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5Pblpvb20gPT09IHRydWUgJiYgJGV2ZW50KSB7XG4gICAgICAvLyBBYnNvbHV0ZSBtb3VzZSBYL1kgb24gdGhlIHNjcmVlblxuICAgICAgY29uc3QgbW91c2VYID0gJGV2ZW50LmNsaWVudFg7XG4gICAgICBjb25zdCBtb3VzZVkgPSAkZXZlbnQuY2xpZW50WTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHRoZSBtb3VzZSBYL1kgaW50byBhIFNWRyBYL1lcbiAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuY2hhcnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICAgIGNvbnN0IHN2Z0dyb3VwID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2cuY2hhcnQnKTtcblxuICAgICAgY29uc3QgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAgIHBvaW50LnggPSBtb3VzZVg7XG4gICAgICBwb2ludC55ID0gbW91c2VZO1xuICAgICAgY29uc3Qgc3ZnUG9pbnQgPSBwb2ludC5tYXRyaXhUcmFuc2Zvcm0oc3ZnR3JvdXAuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcblxuICAgICAgLy8gUGFuem9vbVxuICAgICAgdGhpcy5wYW4oc3ZnUG9pbnQueCwgc3ZnUG9pbnQueSwgdHJ1ZSk7XG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XG4gICAgICB0aGlzLnBhbigtc3ZnUG9pbnQueCwgLXN2Z1BvaW50LnksIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBhbiBieSB4L3lcbiAgICpcbiAgICogQHBhcmFtIHhcbiAgICogQHBhcmFtIHlcbiAgICovXG4gIHBhbih4OiBudW1iZXIsIHk6IG51bWJlciwgaWdub3JlWm9vbUxldmVsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBjb25zdCB6b29tTGV2ZWwgPSBpZ25vcmVab29tTGV2ZWwgPyAxIDogdGhpcy56b29tTGV2ZWw7XG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0cmFuc2xhdGUoeCAvIHpvb21MZXZlbCwgeSAvIHpvb21MZXZlbCkpO1xuXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYW4gdG8gYSBmaXhlZCB4L3lcbiAgICpcbiAgICovXG4gIHBhblRvKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHggPT09IG51bGwgfHwgeCA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHgpIHx8IHkgPT09IG51bGwgfHwgeSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFuWCA9IC10aGlzLnBhbk9mZnNldFggLSB4ICogdGhpcy56b29tTGV2ZWwgKyB0aGlzLmRpbXMud2lkdGggLyAyO1xuICAgIGNvbnN0IHBhblkgPSAtdGhpcy5wYW5PZmZzZXRZIC0geSAqIHRoaXMuem9vbUxldmVsICsgdGhpcy5kaW1zLmhlaWdodCAvIDI7XG5cbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKFxuICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCxcbiAgICAgIHRyYW5zbGF0ZShwYW5YIC8gdGhpcy56b29tTGV2ZWwsIHBhblkgLyB0aGlzLnpvb21MZXZlbClcbiAgICApO1xuXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tIGJ5IGEgZmFjdG9yXG4gICAqXG4gICAqL1xuICB6b29tKGZhY3RvcjogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCBzY2FsZShmYWN0b3IsIGZhY3RvcikpO1xuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbUxldmVsKTtcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICB9XG5cbiAgem9vbUluKCk6IHZvaWQge1xuICAgIHRoaXMuem9vbSgxICsgdGhpcy56b29tU3BlZWQpO1xuICB9XG5cbiAgem9vbU91dCgpOiB2b2lkIHtcbiAgICB0aGlzLnpvb20oMSAtIHRoaXMuem9vbVNwZWVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tIHRvIGEgZml4ZWQgbGV2ZWxcbiAgICpcbiAgICovXG4gIHpvb21UbyhsZXZlbDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hIDogTnVtYmVyKGxldmVsKTtcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgOiBOdW1iZXIobGV2ZWwpO1xuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbUxldmVsKTtcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhbiB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25QYW4oZXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnBhbihldmVudC5tb3ZlbWVudFgsIGV2ZW50Lm1vdmVtZW50WSk7XG4gIH1cblxuICAvKipcbiAgICogRHJhZyB3YXMgaW52b2tlZCBmcm9tIGFuIGV2ZW50XG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25EcmFnKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5kcmFnZ2luZ05vZGU7XG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnKSB7XG4gICAgICB0aGlzLmxheW91dC5vbkRyYWcobm9kZSwgZXZlbnQpO1xuICAgIH1cblxuICAgIG5vZGUucG9zaXRpb24ueCArPSBldmVudC5tb3ZlbWVudFggLyB0aGlzLnpvb21MZXZlbDtcbiAgICBub2RlLnBvc2l0aW9uLnkgKz0gZXZlbnQubW92ZW1lbnRZIC8gdGhpcy56b29tTGV2ZWw7XG5cbiAgICAvLyBtb3ZlIHRoZSBub2RlXG4gICAgY29uc3QgeCA9IG5vZGUucG9zaXRpb24ueCAtIG5vZGUuZGltZW5zaW9uLndpZHRoIC8gMjtcbiAgICBjb25zdCB5ID0gbm9kZS5wb3NpdGlvbi55IC0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMjtcbiAgICBub2RlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xuXG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHRoaXMuZ3JhcGguZWRnZXMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgbGluay50YXJnZXQgPT09IG5vZGUuaWQgfHxcbiAgICAgICAgbGluay5zb3VyY2UgPT09IG5vZGUuaWQgfHxcbiAgICAgICAgKGxpbmsudGFyZ2V0IGFzIGFueSkuaWQgPT09IG5vZGUuaWQgfHxcbiAgICAgICAgKGxpbmsuc291cmNlIGFzIGFueSkuaWQgPT09IG5vZGUuaWRcbiAgICAgICkge1xuICAgICAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnVwZGF0ZUVkZ2UodGhpcy5ncmFwaCwgbGluayk7XG4gICAgICAgICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xuICAgICAgICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAgICAgcmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xuICAgICAgICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgICAgICAgICAgIHRoaXMucmVkcmF3RWRnZShsaW5rKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVkcmF3TGluZXMoZmFsc2UpO1xuICB9XG5cbiAgcmVkcmF3RWRnZShlZGdlOiBFZGdlKSB7XG4gICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKGVkZ2UucG9pbnRzKTtcbiAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKGVkZ2UpO1xuICAgIGVkZ2Uub2xkTGluZSA9IGVkZ2UubGluZTtcbiAgICBlZGdlLmxpbmUgPSBsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgZW50aXJlIHZpZXcgZm9yIHRoZSBuZXcgcGFuIHBvc2l0aW9uXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgdXBkYXRlVHJhbnNmb3JtKCk6IHZvaWQge1xuICAgIHRoaXMudHJhbnNmb3JtID0gdG9TVkcodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XG4gIH1cblxuICAvKipcbiAgICogTm9kZSB3YXMgY2xpY2tlZFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uQ2xpY2soZXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb2RlIHdhcyBmb2N1c2VkXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25BY3RpdmF0ZShldmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCkgPiAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbZXZlbnQsIC4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogTm9kZSB3YXMgZGVmb2N1c2VkXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25EZWFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpO1xuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xuXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRvbWFpbiBzZXJpZXMgZm9yIHRoZSBub2Rlc1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGdldFNlcmllc0RvbWFpbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXNcbiAgICAgIC5tYXAoZCA9PiB0aGlzLmdyb3VwUmVzdWx0c0J5KGQpKVxuICAgICAgLnJlZHVjZSgobm9kZXM6IHN0cmluZ1tdLCBub2RlKTogYW55W10gPT4gKG5vZGVzLmluZGV4T2Yobm9kZSkgIT09IC0xID8gbm9kZXMgOiBub2Rlcy5jb25jYXQoW25vZGVdKSksIFtdKVxuICAgICAgLnNvcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFja2luZyBmb3IgdGhlIGxpbmtcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICB0cmFja0xpbmtCeShpbmRleCwgbGluayk6IGFueSB7XG4gICAgcmV0dXJuIGxpbmsuaWQ7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tpbmcgZm9yIHRoZSBub2RlXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgdHJhY2tOb2RlQnkoaW5kZXgsIG5vZGUpOiBhbnkge1xuICAgIHJldHVybiBub2RlLmlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbG9ycyB0aGUgbm9kZXNcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBzZXRDb2xvcnMoKTogdm9pZCB7XG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsICdvcmRpbmFsJywgdGhpcy5zZXJpZXNEb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsZWdlbmQgb3B0aW9uc1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGdldExlZ2VuZE9wdGlvbnMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgc2NhbGVUeXBlOiAnb3JkaW5hbCcsXG4gICAgICBkb21haW46IHRoaXMuc2VyaWVzRG9tYWluLFxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9yc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogT24gbW91c2UgbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZyBhbmQgZHJhZ2dpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZU1vdmUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNQYW5uaW5nICYmIHRoaXMucGFubmluZ0VuYWJsZWQpIHtcbiAgICAgIHRoaXMub25QYW4oJGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xuICAgICAgdGhpcy5vbkRyYWcoJGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gdG91Y2ggc3RhcnQgZXZlbnQgdG8gZW5hYmxlIHBhbm5pbmcuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgdGhpcy5fdG91Y2hMYXN0WCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgdGhpcy5fdG91Y2hMYXN0WSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XG5cbiAgICB0aGlzLmlzUGFubmluZyA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogT24gdG91Y2ggbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZy5cbiAgICpcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIG9uVG91Y2hNb3ZlKCRldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBjbGllbnRYID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICBjb25zdCBjbGllbnRZID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICBjb25zdCBtb3ZlbWVudFggPSBjbGllbnRYIC0gdGhpcy5fdG91Y2hMYXN0WDtcbiAgICAgIGNvbnN0IG1vdmVtZW50WSA9IGNsaWVudFkgLSB0aGlzLl90b3VjaExhc3RZO1xuICAgICAgdGhpcy5fdG91Y2hMYXN0WCA9IGNsaWVudFg7XG4gICAgICB0aGlzLl90b3VjaExhc3RZID0gY2xpZW50WTtcblxuICAgICAgdGhpcy5wYW4obW92ZW1lbnRYLCBtb3ZlbWVudFkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPbiB0b3VjaCBlbmQgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uVG91Y2hFbmQoZXZlbnQpIHtcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9uIG1vdXNlIHVwIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy9kcmFnZ2luZy5cbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZXVwJylcbiAgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdFbmQpIHtcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCh0aGlzLmRyYWdnaW5nTm9kZSwgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBub2RlIG1vdXNlIGRvd24gdG8ga2ljayBvZmYgZHJhZ2dpbmdcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvbk5vZGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQsIG5vZGU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdnaW5nTm9kZSA9IG5vZGU7XG5cbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdTdGFydCkge1xuICAgICAgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQobm9kZSwgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDZW50ZXIgdGhlIGdyYXBoIGluIHRoZSB2aWV3cG9ydFxuICAgKi9cbiAgY2VudGVyKCk6IHZvaWQge1xuICAgIHRoaXMucGFuVG8odGhpcy5ncmFwaERpbXMud2lkdGggLyAyLCB0aGlzLmdyYXBoRGltcy5oZWlnaHQgLyAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tcyB0byBmaXQgdGhlIGVudGllciBncmFwaFxuICAgKi9cbiAgem9vbVRvRml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGhlaWdodFpvb20gPSB0aGlzLmRpbXMuaGVpZ2h0IC8gdGhpcy5ncmFwaERpbXMuaGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoWm9vbSA9IHRoaXMuZGltcy53aWR0aCAvIHRoaXMuZ3JhcGhEaW1zLndpZHRoO1xuICAgIGNvbnN0IHpvb21MZXZlbCA9IE1hdGgubWluKGhlaWdodFpvb20sIHdpZHRoWm9vbSwgMSk7XG5cbiAgICBpZiAoem9vbUxldmVsIDw9IHRoaXMubWluWm9vbUxldmVsIHx8IHpvb21MZXZlbCA+PSB0aGlzLm1heFpvb21MZXZlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAoem9vbUxldmVsICE9PSB0aGlzLnpvb21MZXZlbCkge1xuICAgICAgdGhpcy56b29tTGV2ZWwgPSB6b29tTGV2ZWw7XG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICAgICAgdGhpcy56b29tQ2hhbmdlLmVtaXQodGhpcy56b29tTGV2ZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQYW5zIHRvIHRoZSBub2RlXG4gICAqIEBwYXJhbSBub2RlSWQgXG4gICAqL1xuICBwYW5Ub05vZGVJZChub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBub2RlSWQpO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucGFuVG8obm9kZS5wb3NpdGlvbi54LCBub2RlLnBvc2l0aW9uLnkpO1xuICB9XG59XG4iXX0=