var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
import { id } from '../utils';
var GraphComponent = /** @class */ (function (_super) {
    __extends(GraphComponent, _super);
    function GraphComponent(el, zone, cd, layoutService) {
        var _this = _super.call(this, el, zone, cd) || this;
        _this.el = el;
        _this.zone = zone;
        _this.cd = cd;
        _this.layoutService = layoutService;
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
        get: function () {
            return this.transformationMatrix.a;
        },
        /**
         * Set the current zoom level
         */
        set: function (level) {
            this.zoomTo(Number(level));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphComponent.prototype, "panOffsetX", {
        /**
         * Get the current `x` position of the graph
         */
        get: function () {
            return this.transformationMatrix.e;
        },
        /**
         * Set the current `x` position of the graph
         */
        set: function (x) {
            this.panTo(Number(x), null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphComponent.prototype, "panOffsetY", {
        /**
         * Get the current `y` position of the graph
         */
        get: function () {
            return this.transformationMatrix.f;
        },
        /**
         * Set the current `y` position of the graph
         */
        set: function (y) {
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
    GraphComponent.prototype.ngOnInit = function () {
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
    };
    GraphComponent.prototype.ngOnChanges = function (changes) {
        var layout = changes.layout, layoutSettings = changes.layoutSettings, nodes = changes.nodes, clusters = changes.clusters, edges = changes.edges;
        if (layout) {
            this.setLayout(this.layout);
        }
        if (layoutSettings) {
            this.setLayoutSettings(this.layoutSettings);
        }
        if (nodes || clusters || edges) {
            this.update();
        }
    };
    GraphComponent.prototype.setLayout = function (layout) {
        this.initialized = false;
        if (!layout) {
            layout = 'dagre';
        }
        if (typeof layout === 'string') {
            this.layout = this.layoutService.getLayout(layout);
            this.setLayoutSettings(this.layoutSettings);
        }
    };
    GraphComponent.prototype.setLayoutSettings = function (settings) {
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
    GraphComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
        this.subscriptions = null;
    };
    /**
     * Angular lifecycle event
     *
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        _super.prototype.ngAfterViewInit.call(this);
        setTimeout(function () { return _this.update(); });
    };
    /**
     * Base class update implementation for the dag graph
     *
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.update = function () {
        var _this = this;
        _super.prototype.update.call(this);
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
     * Draws the graph using dagre layouts
     *
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.draw = function () {
        var _this = this;
        if (!this.layout || typeof this.layout === 'string') {
            return;
        }
        // Calc view dims for the nodes
        this.applyNodeDimensions();
        // Recalc the layout
        var result = this.layout.run(this.graph);
        var result$ = result instanceof Observable ? result : of(result);
        this.graphSubscription.add(result$.subscribe(function (graph) {
            _this.graph = graph;
            _this.tick();
        }));
        result$
            .pipe(first(function (graph) { return graph.nodes.length > 0; }))
            .subscribe(function () { return _this.applyNodeDimensions(); });
    };
    GraphComponent.prototype.tick = function () {
        var _this = this;
        // Transposes view options to the node
        this.graph.nodes.map(function (n) {
            n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 || 0) + ")";
            if (!n.data) {
                n.data = {};
            }
            n.data = {
                color: _this.colors.getColor(_this.groupResultsBy(n))
            };
        });
        (this.graph.clusters || []).map(function (n) {
            n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 || 0) + ")";
            if (!n.data) {
                n.data = {};
            }
            n.data = {
                color: _this.colors.getColor(_this.groupResultsBy(n))
            };
        });
        // Update the labels to the new positions
        var newLinks = [];
        var _loop_1 = function (edgeLabelId) {
            var edgeLabel = this_1.graph.edgeLabels[edgeLabelId];
            var normKey = edgeLabelId.replace(/[^\w-]*/g, '');
            var oldLink = this_1._oldLinks.find(function (ol) { return "" + ol.source + ol.target === normKey; });
            if (!oldLink) {
                oldLink = this_1.graph.edges.find(function (nl) { return "" + nl.source + nl.target === normKey; }) || edgeLabel;
            }
            oldLink.oldLine = oldLink.line;
            var points = edgeLabel.points;
            var line = this_1.generateLine(points);
            var newLink = Object.assign({}, oldLink);
            newLink.line = line;
            newLink.points = points;
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
                var newL = Object.assign({}, l);
                newL.oldLine = l.line;
                return newL;
            });
        }
        // Calculate the height/width total
        this.graphDims.width = Math.max.apply(Math, this.graph.nodes.map(function (n) { return n.position.x + n.dimension.width; }));
        this.graphDims.height = Math.max.apply(Math, this.graph.nodes.map(function (n) { return n.position.y + n.dimension.height; }));
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
    GraphComponent.prototype.applyNodeDimensions = function () {
        var _this = this;
        if (this.nodeElements && this.nodeElements.length) {
            this.nodeElements.map(function (elem) {
                var nativeElement = elem.nativeElement;
                var node = _this.graph.nodes.find(function (n) { return n.id === nativeElement.id; });
                // calculate the height
                var dims;
                try {
                    dims = nativeElement.getBoundingClientRect();
                }
                catch (ex) {
                    // Skip drawing if element is not displayed - Firefox would throw an error here
                    return;
                }
                if (_this.nodeHeight) {
                    node.dimension.height = _this.nodeHeight;
                }
                else {
                    node.dimension.height = dims.height;
                }
                if (_this.nodeMaxHeight)
                    node.dimension.height = Math.max(node.dimension.height, _this.nodeMaxHeight);
                if (_this.nodeMinHeight)
                    node.dimension.height = Math.min(node.dimension.height, _this.nodeMinHeight);
                if (_this.nodeWidth) {
                    node.dimension.width = _this.nodeWidth;
                }
                else {
                    // calculate the width
                    if (nativeElement.getElementsByTagName('text').length) {
                        var textDims = void 0;
                        try {
                            textDims = nativeElement.getElementsByTagName('text')[0].getBBox();
                        }
                        catch (ex) {
                            // Skip drawing if element is not displayed - Firefox would throw an error here
                            return;
                        }
                        node.dimension.width = textDims.width + 20;
                    }
                    else {
                        node.dimension.width = dims.width;
                    }
                }
                if (_this.nodeMaxWidth)
                    node.dimension.width = Math.max(node.dimension.width, _this.nodeMaxWidth);
                if (_this.nodeMinWidth)
                    node.dimension.width = Math.min(node.dimension.width, _this.nodeMinWidth);
            });
        }
    };
    /**
     * Redraws the lines when dragged or viewport updated
     *
     * @param {boolean} [animate=true]
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.redrawLines = function (_animate) {
        var _this = this;
        if (_animate === void 0) { _animate = true; }
        this.linkElements.map(function (linkEl) {
            var edge = _this.graph.edges.find(function (lin) { return lin.id === linkEl.nativeElement.id; });
            if (edge) {
                var linkSelection = select(linkEl.nativeElement).select('.line');
                linkSelection
                    .attr('d', edge.oldLine)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.line);
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
     * Creates the dagre graph engine
     *
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.createGraph = function () {
        var _this = this;
        this.graphSubscription.unsubscribe();
        this.graphSubscription = new Subscription();
        var initializeNode = function (n) {
            if (!n.id) {
                n.id = id();
            }
            n.dimension = {
                width: 30,
                height: 30
            };
            n.position = {
                x: 0,
                y: 0
            };
            n.data = n.data ? n.data : {};
            return n;
        };
        this.graph = {
            nodes: this.nodes.slice().map(initializeNode),
            clusters: (this.clusters || []).slice().map(initializeNode),
            edges: this.links.slice().map(function (e) {
                if (!e.id) {
                    e.id = id();
                }
                return e;
            })
        };
        requestAnimationFrame(function () { return _this.draw(); });
    };
    /**
     * Calculate the text directions / flipping
     *
     * @param {any} link
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.calcDominantBaseline = function (link) {
        var firstPoint = link.points[0];
        var lastPoint = link.points[link.points.length - 1];
        link.oldTextPath = link.textPath;
        if (lastPoint.x < firstPoint.x) {
            link.dominantBaseline = 'text-before-edge';
            // reverse text path for when its flipped upside down
            link.textPath = this.generateLine(link.points.slice().reverse());
        }
        else {
            link.dominantBaseline = 'text-after-edge';
            link.textPath = link.line;
        }
    };
    /**
     * Generate the new line path
     *
     * @param {any} points
     * @returns {*}
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.generateLine = function (points) {
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
     * @param {MouseEvent} $event
     * @param {any} direction
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onZoom = function ($event, direction) {
        var zoomFactor = 1 + (direction === 'in' ? this.zoomSpeed : -this.zoomSpeed);
        // Check that zooming wouldn't put us out of bounds
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
            var mouseX = $event.clientX;
            var mouseY = $event.clientY;
            // Transform the mouse X/Y into a SVG X/Y
            var svg = this.chart.nativeElement.querySelector('svg');
            var svgGroup = svg.querySelector('g.chart');
            var point = svg.createSVGPoint();
            point.x = mouseX;
            point.y = mouseY;
            var svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());
            // Panzoom
            var NO_ZOOM_LEVEL = 1;
            this.pan(svgPoint.x, svgPoint.y, NO_ZOOM_LEVEL);
            this.zoom(zoomFactor);
            this.pan(-svgPoint.x, -svgPoint.y, NO_ZOOM_LEVEL);
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
    GraphComponent.prototype.pan = function (x, y, zoomLevel) {
        if (zoomLevel === void 0) { zoomLevel = this.zoomLevel; }
        this.transformationMatrix = transform(this.transformationMatrix, translate(x / zoomLevel, y / zoomLevel));
        this.updateTransform();
    };
    /**
     * Pan to a fixed x/y
     *
     * @param x
     * @param y
     */
    GraphComponent.prototype.panTo = function (x, y) {
        this.transformationMatrix.e = x === null || x === undefined || isNaN(x) ? this.transformationMatrix.e : Number(x);
        this.transformationMatrix.f = y === null || y === undefined || isNaN(y) ? this.transformationMatrix.f : Number(y);
        this.updateTransform();
    };
    /**
     * Zoom by a factor
     *
     * @param factor Zoom multiplicative factor (1.1 for zooming in 10%, for instance)
     */
    GraphComponent.prototype.zoom = function (factor) {
        this.transformationMatrix = transform(this.transformationMatrix, scale(factor, factor));
        this.updateTransform();
    };
    GraphComponent.prototype.zoomIn = function () {
        this.zoom(1 + this.zoomSpeed);
    };
    GraphComponent.prototype.zoomOut = function () {
        this.zoom(1 - this.zoomSpeed);
    };
    /**
     * Zoom to a fixed level
     *
     * @param level
     */
    GraphComponent.prototype.zoomTo = function (level) {
        this.transformationMatrix.a = isNaN(level) ? this.transformationMatrix.a : Number(level);
        this.transformationMatrix.d = isNaN(level) ? this.transformationMatrix.d : Number(level);
        this.updateTransform();
    };
    /**
     * Pan was invoked from event
     *
     * @param {any} event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onPan = function (event) {
        this.pan(event.movementX, event.movementY);
    };
    /**
     * Drag was invoked from an event
     *
     * @param {any} event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onDrag = function (event) {
        var _this = this;
        if (!this.draggingEnabled) {
            return;
        }
        var node = this.draggingNode;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDrag) {
            this.layout.onDrag(node, event);
        }
        node.position.x += event.movementX / this.zoomLevel;
        node.position.y += event.movementY / this.zoomLevel;
        // move the node
        var x = node.position.x - node.dimension.width / 2;
        var y = node.position.y - node.dimension.height / 2;
        node.transform = "translate(" + x + ", " + y + ")";
        var _loop_2 = function (link) {
            if (link.target === node.id || link.source === node.id ||
                link.target.id === node.id || link.source.id === node.id) {
                if (this_2.layout && typeof this_2.layout !== 'string') {
                    var result = this_2.layout.updateEdge(this_2.graph, link);
                    var result$ = result instanceof Observable ? result : of(result);
                    this_2.graphSubscription.add(result$.subscribe(function (graph) {
                        _this.graph = graph;
                        _this.redrawEdge(link);
                    }));
                }
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = this.graph.edges; _i < _a.length; _i++) {
            var link = _a[_i];
            _loop_2(link);
        }
        this.redrawLines(false);
    };
    GraphComponent.prototype.redrawEdge = function (edge) {
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
    GraphComponent.prototype.updateTransform = function () {
        this.transform = toSVG(this.transformationMatrix);
    };
    /**
     * Node was clicked
     *
     * @param {any} event
     * @returns {void}
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onClick = function (event) {
        this.select.emit(event);
    };
    /**
     * Node was focused
     *
     * @param {any} event
     * @returns {void}
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onActivate = function (event) {
        if (this.activeEntries.indexOf(event) > -1)
            return;
        this.activeEntries = [event].concat(this.activeEntries);
        this.activate.emit({ value: event, entries: this.activeEntries });
    };
    /**
     * Node was defocused
     *
     * @param {any} event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onDeactivate = function (event) {
        var idx = this.activeEntries.indexOf(event);
        this.activeEntries.splice(idx, 1);
        this.activeEntries = this.activeEntries.slice();
        this.deactivate.emit({ value: event, entries: this.activeEntries });
    };
    /**
     * Get the domain series for the nodes
     *
     * @returns {any[]}
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.getSeriesDomain = function () {
        var _this = this;
        return this.nodes
            .map(function (d) { return _this.groupResultsBy(d); })
            .reduce(function (nodes, node) { return (nodes.includes(node) ? nodes : nodes.concat([node])); }, [])
            .sort();
    };
    /**
     * Tracking for the link
     *
     * @param {any} index
     * @param {any} link
     * @returns {*}
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.trackLinkBy = function (index, link) {
        return link.id;
    };
    /**
     * Tracking for the node
     *
     * @param {any} index
     * @param {any} node
     * @returns {*}
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.trackNodeBy = function (index, node) {
        return node.id;
    };
    /**
     * Sets the colors the nodes
     *
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.setColors = function () {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
    };
    /**
     * Gets the legend options
     *
     * @returns {*}
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.getLegendOptions = function () {
        return {
            scaleType: 'ordinal',
            domain: this.seriesDomain,
            colors: this.colors
        };
    };
    /**
     * On mouse move event, used for panning and dragging.
     *
     * @param {MouseEvent} $event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onMouseMove = function ($event) {
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
     * @param {TouchEvent} $event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onTouchStart = function (event) {
        this._touchLastX = event.changedTouches[0].clientX;
        this._touchLastY = event.changedTouches[0].clientY;
        this.isPanning = true;
    };
    /**
     * On touch move event, used for panning.
     *
     * @param {TouchEvent} $event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onTouchMove = function ($event) {
        if (this.isPanning && this.panningEnabled) {
            var clientX = $event.changedTouches[0].clientX;
            var clientY = $event.changedTouches[0].clientY;
            var movementX = clientX - this._touchLastX;
            var movementY = clientY - this._touchLastY;
            this._touchLastX = clientX;
            this._touchLastY = clientY;
            this.pan(movementX, movementY);
        }
    };
    /**
     * On touch end event to disable panning.
     *
     * @param {TouchEvent} $event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onTouchEnd = function (event) {
        this.isPanning = false;
    };
    /**
     * On mouse up event to disable panning/dragging.
     *
     * @param {MouseEvent} event
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onMouseUp = function (event) {
        this.isDragging = false;
        this.isPanning = false;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragEnd) {
            this.layout.onDragEnd(this.draggingNode, event);
        }
    };
    /**
     * On node mouse down to kick off dragging
     *
     * @param {MouseEvent} event
     * @param {*} node
     *
     * @memberOf GraphComponent
     */
    GraphComponent.prototype.onNodeMouseDown = function (event, node) {
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
    GraphComponent.prototype.center = function () {
        this.panTo(this.dims.width / 2 - this.graphDims.width * this.zoomLevel / 2, this.dims.height / 2 - this.graphDims.height * this.zoomLevel / 2);
    };
    /**
     * Zooms to fit the entier graph
     */
    GraphComponent.prototype.zoomToFit = function () {
        var heightZoom = this.dims.height / this.graphDims.height;
        var widthZoom = this.dims.width / this.graphDims.width;
        var zoomLevel = Math.min(heightZoom, widthZoom, 1);
        if (zoomLevel !== this.zoomLevel) {
            this.zoomLevel = zoomLevel;
            this.updateTransform();
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], GraphComponent.prototype, "legend", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], GraphComponent.prototype, "nodes", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], GraphComponent.prototype, "clusters", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], GraphComponent.prototype, "links", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], GraphComponent.prototype, "activeEntries", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GraphComponent.prototype, "curve", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], GraphComponent.prototype, "draggingEnabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "nodeHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "nodeMaxHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "nodeMinHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "nodeWidth", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "nodeMinWidth", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "nodeMaxWidth", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], GraphComponent.prototype, "panningEnabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], GraphComponent.prototype, "enableZoom", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "zoomSpeed", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "minZoomLevel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GraphComponent.prototype, "maxZoomLevel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], GraphComponent.prototype, "autoZoom", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], GraphComponent.prototype, "panOnZoom", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], GraphComponent.prototype, "autoCenter", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], GraphComponent.prototype, "update$", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], GraphComponent.prototype, "center$", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], GraphComponent.prototype, "zoomToFit$", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GraphComponent.prototype, "layout", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GraphComponent.prototype, "layoutSettings", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], GraphComponent.prototype, "activate", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], GraphComponent.prototype, "deactivate", void 0);
    __decorate([
        ContentChild('linkTemplate'),
        __metadata("design:type", TemplateRef)
    ], GraphComponent.prototype, "linkTemplate", void 0);
    __decorate([
        ContentChild('nodeTemplate'),
        __metadata("design:type", TemplateRef)
    ], GraphComponent.prototype, "nodeTemplate", void 0);
    __decorate([
        ContentChild('clusterTemplate'),
        __metadata("design:type", TemplateRef)
    ], GraphComponent.prototype, "clusterTemplate", void 0);
    __decorate([
        ContentChild('defsTemplate'),
        __metadata("design:type", TemplateRef)
    ], GraphComponent.prototype, "defsTemplate", void 0);
    __decorate([
        ViewChild(ChartComponent, { read: ElementRef }),
        __metadata("design:type", ElementRef)
    ], GraphComponent.prototype, "chart", void 0);
    __decorate([
        ViewChildren('nodeElement'),
        __metadata("design:type", QueryList)
    ], GraphComponent.prototype, "nodeElements", void 0);
    __decorate([
        ViewChildren('linkElement'),
        __metadata("design:type", QueryList)
    ], GraphComponent.prototype, "linkElements", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], GraphComponent.prototype, "groupResultsBy", void 0);
    __decorate([
        Input('zoomLevel'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], GraphComponent.prototype, "zoomLevel", null);
    __decorate([
        Input('panOffsetX'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], GraphComponent.prototype, "panOffsetX", null);
    __decorate([
        Input('panOffsetY'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], GraphComponent.prototype, "panOffsetY", null);
    __decorate([
        HostListener('document:mousemove', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], GraphComponent.prototype, "onMouseMove", null);
    __decorate([
        HostListener('document:touchmove', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [TouchEvent]),
        __metadata("design:returntype", void 0)
    ], GraphComponent.prototype, "onTouchMove", null);
    __decorate([
        HostListener('document:mouseup'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], GraphComponent.prototype, "onMouseUp", null);
    GraphComponent = __decorate([
        Component({
            selector: 'ngx-graph',
            styleUrls: ['./graph.component.scss'],
            template: "\n  <div class=\"zoom-buttons\">\n    <button (click)=\"zoomIn()\"><img src=\"src/assets/icons8-zoom-in-26.png\"></button>\n    <button (click)=\"zoomOut()\"><img src=\"src/assets/icons8-zoom-out-26.png\"></button>\n  </div>\n  <ngx-charts-chart [view]=\"[width, height]\" [showLegend]=\"legend\" [legendOptions]=\"legendOptions\" (legendLabelClick)=\"onClick($event)\"\n  (legendLabelActivate)=\"onActivate($event)\" (legendLabelDeactivate)=\"onDeactivate($event)\"\n  >\n  <svg:g *ngIf=\"initialized && graph\" [attr.transform]=\"transform\" (touchstart)=\"onTouchStart($event)\" (touchend)=\"onTouchEnd($event)\"\n    class=\"graph chart\">\n    <defs>\n      <ng-template *ngIf=\"defsTemplate\" [ngTemplateOutlet]=\"defsTemplate\">\n      </ng-template>\n      <svg:path class=\"text-path\" *ngFor=\"let link of graph.edges\" [attr.d]=\"link.textPath\" [attr.id]=\"link.id\">\n      </svg:path>\n    </defs>\n    <svg:rect class=\"panning-rect\" [attr.width]=\"dims.width * 100\" [attr.height]=\"dims.height * 100\" [attr.transform]=\"'translate(' + ((-dims.width || 0) * 50) +',' + ((-dims.height || 0) *50) + ')' \"\n      (mousedown)=\"isPanning = true\" />\n      <svg:g class=\"clusters\">\n        <svg:g #clusterElement *ngFor=\"let node of graph.clusters; trackBy: trackNodeBy\" class=\"node-group\" [id]=\"node.id\" [attr.transform]=\"node.transform\"\n          (click)=\"onClick(node)\">\n          <ng-template *ngIf=\"clusterTemplate\" [ngTemplateOutlet]=\"clusterTemplate\" [ngTemplateOutletContext]=\"{ $implicit: node }\">\n          </ng-template>\n          <svg:g *ngIf=\"!clusterTemplate\" class=\"node cluster\">\n            <svg:rect [attr.width]=\"node.dimension.width\" [attr.height]=\"node.dimension.height\" [attr.fill]=\"node.data?.color\" />\n            <svg:text alignment-baseline=\"central\" [attr.x]=\"10\" [attr.y]=\"node.dimension.height / 2\">{{node.label}}</svg:text>\n          </svg:g>\n        </svg:g>\n      </svg:g>\n      <svg:g class=\"links\">\n      <svg:g #linkElement *ngFor=\"let link of graph.edges; trackBy: trackLinkBy\" class=\"link-group\" [id]=\"link.id\">\n        <ng-template *ngIf=\"linkTemplate\" [ngTemplateOutlet]=\"linkTemplate\" [ngTemplateOutletContext]=\"{ $implicit: link }\">\n        </ng-template>\n        <svg:path *ngIf=\"!linkTemplate\" class=\"edge\" [attr.d]=\"link.line\" />\n      </svg:g>\n    </svg:g>\n    <svg:g class=\"nodes\">\n      <svg:g #nodeElement *ngFor=\"let node of graph.nodes; trackBy: trackNodeBy\" class=\"node-group\" [id]=\"node.id\" [attr.transform]=\"node.transform\"\n        (click)=\"onClick(node)\" (mousedown)=\"onNodeMouseDown($event, node)\">\n        <ng-template *ngIf=\"nodeTemplate\" [ngTemplateOutlet]=\"nodeTemplate\" [ngTemplateOutletContext]=\"{ $implicit: node }\">\n        </ng-template>\n        <svg:circle *ngIf=\"!nodeTemplate\" r=\"10\" [attr.cx]=\"node.dimension.width / 2\" [attr.cy]=\"node.dimension.height / 2\" [attr.fill]=\"node.data?.color\"\n        />\n      </svg:g>\n    </svg:g>\n  </svg:g>\n</ngx-charts-chart>\n  ",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [trigger('link', [ngTransition('* => *', [animate(500, style({ transform: '*' }))])])]
        }),
        __metadata("design:paramtypes", [ElementRef,
            NgZone,
            ChangeDetectorRef,
            LayoutService])
    ], GraphComponent);
    return GraphComponent;
}(BaseChartComponent));
export { GraphComponent };
//# sourceMappingURL=graph.component.js.map