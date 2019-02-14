/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class GraphComponent extends BaseChartComponent {
    /**
     * @param {?} el
     * @param {?} zone
     * @param {?} cd
     * @param {?} layoutService
     */
    constructor(el, zone, cd, layoutService) {
        super(el, zone, cd);
        this.el = el;
        this.zone = zone;
        this.cd = cd;
        this.layoutService = layoutService;
        this.legend = false;
        this.nodes = [];
        this.clusters = [];
        this.links = [];
        this.activeEntries = [];
        this.draggingEnabled = true;
        this.panningEnabled = true;
        this.enableZoom = true;
        this.zoomSpeed = 0.1;
        this.minZoomLevel = 0.1;
        this.maxZoomLevel = 4.0;
        this.autoZoom = false;
        this.panOnZoom = true;
        this.autoCenter = false;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.zoomChange = new EventEmitter();
        this.graphSubscription = new Subscription();
        this.subscriptions = [];
        this.margin = [0, 0, 0, 0];
        this.results = [];
        this.isPanning = false;
        this.isDragging = false;
        this.initialized = false;
        this.graphDims = { width: 0, height: 0 };
        this._oldLinks = [];
        this.transformationMatrix = identity();
        this._touchLastX = null;
        this._touchLastY = null;
        this.groupResultsBy = node => node.label;
    }
    /**
     * Get the current zoom level
     * @return {?}
     */
    get zoomLevel() {
        return this.transformationMatrix.a;
    }
    /**
     * Set the current zoom level
     * @param {?} level
     * @return {?}
     */
    set zoomLevel(level) {
        this.zoomTo(Number(level));
    }
    /**
     * Get the current `x` position of the graph
     * @return {?}
     */
    get panOffsetX() {
        return this.transformationMatrix.e;
    }
    /**
     * Set the current `x` position of the graph
     * @param {?} x
     * @return {?}
     */
    set panOffsetX(x) {
        this.panTo(Number(x), null);
    }
    /**
     * Get the current `y` position of the graph
     * @return {?}
     */
    get panOffsetY() {
        return this.transformationMatrix.f;
    }
    /**
     * Set the current `y` position of the graph
     * @param {?} y
     * @return {?}
     */
    set panOffsetY(y) {
        this.panTo(null, Number(y));
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngOnInit() {
        if (this.update$) {
            this.subscriptions.push(this.update$.subscribe(() => {
                this.update();
            }));
        }
        if (this.center$) {
            this.subscriptions.push(this.center$.subscribe(() => {
                this.center();
            }));
        }
        if (this.zoomToFit$) {
            this.subscriptions.push(this.zoomToFit$.subscribe(() => {
                this.zoomToFit();
            }));
        }
        if (this.panToNode$) {
            this.subscriptions.push(this.panToNode$.subscribe((nodeId) => {
                this.panToNodeId(nodeId);
            }));
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const { layout, layoutSettings, nodes, clusters, links } = changes;
        this.setLayout(this.layout);
        if (layoutSettings) {
            this.setLayoutSettings(this.layoutSettings);
        }
        this.update();
    }
    /**
     * @param {?} layout
     * @return {?}
     */
    setLayout(layout) {
        this.initialized = false;
        if (!layout) {
            layout = 'dagre';
        }
        if (typeof layout === 'string') {
            this.layout = this.layoutService.getLayout(layout);
            this.setLayoutSettings(this.layoutSettings);
        }
    }
    /**
     * @param {?} settings
     * @return {?}
     */
    setLayoutSettings(settings) {
        if (this.layout && typeof this.layout !== 'string') {
            this.layout.settings = settings;
            this.update();
        }
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
        this.subscriptions = null;
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        setTimeout(() => this.update());
    }
    /**
     * Base class update implementation for the dag graph
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    update() {
        super.update();
        if (!this.curve) {
            this.curve = shape.curveBundle.beta(1);
        }
        this.zone.run(() => {
            this.dims = calculateViewDimensions({
                width: this.width,
                height: this.height,
                margins: this.margin,
                showLegend: this.legend
            });
            this.seriesDomain = this.getSeriesDomain();
            this.setColors();
            this.legendOptions = this.getLegendOptions();
            this.createGraph();
            this.updateTransform();
            this.initialized = true;
        });
    }
    /**
     * Creates the dagre graph engine
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    createGraph() {
        this.graphSubscription.unsubscribe();
        this.graphSubscription = new Subscription();
        /** @type {?} */
        const initializeNode = n => {
            if (!n.meta) {
                n.meta = {};
            }
            if (!n.id) {
                n.id = id();
            }
            if (!n.dimension) {
                n.dimension = {
                    width: this.nodeWidth ? this.nodeWidth : 30,
                    height: this.nodeHeight ? this.nodeHeight : 30
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
            nodes: [...this.nodes].map(initializeNode),
            clusters: [...(this.clusters || [])].map(initializeNode),
            edges: [...this.links].map(e => {
                if (!e.id) {
                    e.id = id();
                }
                return e;
            })
        };
        requestAnimationFrame(() => this.draw());
    }
    /**
     * Draws the graph using dagre layouts
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    draw() {
        if (!this.layout || typeof this.layout === 'string') {
            return;
        }
        // Calc view dims for the nodes
        this.applyNodeDimensions();
        // Recalc the layout
        /** @type {?} */
        const result = this.layout.run(this.graph);
        /** @type {?} */
        const result$ = result instanceof Observable ? result : of(result);
        this.graphSubscription.add(result$.subscribe(graph => {
            this.graph = graph;
            this.tick();
        }));
        result$.pipe(first(graph => graph.nodes.length > 0)).subscribe(() => this.applyNodeDimensions());
    }
    /**
     * @return {?}
     */
    tick() {
        // Transposes view options to the node
        this.graph.nodes.map(n => {
            n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n.position.y - n.dimension.height / 2 ||
                0})`;
            if (!n.data) {
                n.data = {};
            }
            n.data.color = this.colors.getColor(this.groupResultsBy(n));
        });
        (this.graph.clusters || []).map(n => {
            n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n.position.y - n.dimension.height / 2 ||
                0})`;
            if (!n.data) {
                n.data = {};
            }
            n.data.color = this.colors.getColor(this.groupResultsBy(n));
        });
        // Update the labels to the new positions
        /** @type {?} */
        const newLinks = [];
        for (const edgeLabelId in this.graph.edgeLabels) {
            /** @type {?} */
            const edgeLabel = this.graph.edgeLabels[edgeLabelId];
            /** @type {?} */
            const normKey = edgeLabelId.replace(/[^\w-]*/g, '');
            /** @type {?} */
            let oldLink = this._oldLinks.find(ol => `${ol.source}${ol.target}` === normKey);
            if (!oldLink) {
                oldLink = this.graph.edges.find(nl => `${nl.source}${nl.target}` === normKey) || edgeLabel;
            }
            oldLink.oldLine = oldLink.line;
            /** @type {?} */
            const points = edgeLabel.points;
            /** @type {?} */
            const line = this.generateLine(points);
            /** @type {?} */
            const newLink = Object.assign({}, oldLink);
            newLink.line = line;
            newLink.points = points;
            /** @type {?} */
            const textPos = points[Math.floor(points.length / 2)];
            if (textPos) {
                newLink.textTransform = `translate(${textPos.x || 0},${textPos.y || 0})`;
            }
            newLink.textAngle = 0;
            if (!newLink.oldLine) {
                newLink.oldLine = newLink.line;
            }
            this.calcDominantBaseline(newLink);
            newLinks.push(newLink);
        }
        this.graph.edges = newLinks;
        // Map the old links for animations
        if (this.graph.edges) {
            this._oldLinks = this.graph.edges.map(l => {
                /** @type {?} */
                const newL = Object.assign({}, l);
                newL.oldLine = l.line;
                return newL;
            });
        }
        // Calculate the height/width total
        this.graphDims.width = Math.max(...this.graph.nodes.map(n => n.position.x + n.dimension.width));
        this.graphDims.height = Math.max(...this.graph.nodes.map(n => n.position.y + n.dimension.height));
        if (this.autoZoom) {
            this.zoomToFit();
        }
        if (this.autoCenter) {
            // Auto-center when rendering
            this.center();
        }
        requestAnimationFrame(() => this.redrawLines());
        this.cd.markForCheck();
    }
    /**
     * Measures the node element and applies the dimensions
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    applyNodeDimensions() {
        if (this.nodeElements && this.nodeElements.length) {
            this.nodeElements.map(elem => {
                /** @type {?} */
                const nativeElement = elem.nativeElement;
                /** @type {?} */
                const node = this.graph.nodes.find(n => n.id === nativeElement.id);
                // calculate the height
                /** @type {?} */
                let dims;
                try {
                    dims = nativeElement.getBBox();
                }
                catch (ex) {
                    // Skip drawing if element is not displayed - Firefox would throw an error here
                    return;
                }
                if (this.nodeHeight) {
                    node.dimension.height = node.dimension.height && node.meta.forceDimensions ? node.dimension.height : this.nodeHeight;
                }
                else {
                    node.dimension.height = node.dimension.height && node.meta.forceDimensions ? node.dimension.height : dims.height;
                }
                if (this.nodeMaxHeight) {
                    node.dimension.height = Math.max(node.dimension.height, this.nodeMaxHeight);
                }
                if (this.nodeMinHeight) {
                    node.dimension.height = Math.min(node.dimension.height, this.nodeMinHeight);
                }
                if (this.nodeWidth) {
                    node.dimension.width = node.dimension.width && node.meta.forceDimensions ? node.dimension.width : this.nodeWidth;
                }
                else {
                    // calculate the width
                    if (nativeElement.getElementsByTagName('text').length) {
                        /** @type {?} */
                        let maxTextDims;
                        try {
                            for (const textElem of nativeElement.getElementsByTagName('text')) {
                                /** @type {?} */
                                const currentBBox = textElem.getBBox();
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
                if (this.nodeMaxWidth) {
                    node.dimension.width = Math.max(node.dimension.width, this.nodeMaxWidth);
                }
                if (this.nodeMinWidth) {
                    node.dimension.width = Math.min(node.dimension.width, this.nodeMinWidth);
                }
            });
        }
    }
    /**
     * Redraws the lines when dragged or viewport updated
     *
     * \@memberOf GraphComponent
     * @param {?=} _animate
     * @return {?}
     */
    redrawLines(_animate = true) {
        this.linkElements.map(linkEl => {
            /** @type {?} */
            const edge = this.graph.edges.find(lin => lin.id === linkEl.nativeElement.id);
            if (edge) {
                /** @type {?} */
                const linkSelection = select(linkEl.nativeElement).select('.line');
                linkSelection
                    .attr('d', edge.oldLine)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.line);
                /** @type {?} */
                const textPathSelection = select(this.chartElement.nativeElement).select(`#${edge.id}`);
                textPathSelection
                    .attr('d', edge.oldTextPath)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.textPath);
            }
        });
    }
    /**
     * Calculate the text directions / flipping
     *
     * \@memberOf GraphComponent
     * @param {?} link
     * @return {?}
     */
    calcDominantBaseline(link) {
        /** @type {?} */
        const firstPoint = link.points[0];
        /** @type {?} */
        const lastPoint = link.points[link.points.length - 1];
        link.oldTextPath = link.textPath;
        if (lastPoint.x < firstPoint.x) {
            link.dominantBaseline = 'text-before-edge';
            // reverse text path for when its flipped upside down
            link.textPath = this.generateLine([...link.points].reverse());
        }
        else {
            link.dominantBaseline = 'text-after-edge';
            link.textPath = link.line;
        }
    }
    /**
     * Generate the new line path
     *
     * \@memberOf GraphComponent
     * @param {?} points
     * @return {?}
     */
    generateLine(points) {
        /** @type {?} */
        const lineFunction = shape
            .line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(this.curve);
        return lineFunction(points);
    }
    /**
     * Zoom was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @param {?} direction
     * @return {?}
     */
    onZoom($event, direction) {
        /** @type {?} */
        const zoomFactor = 1 + (direction === 'in' ? this.zoomSpeed : -this.zoomSpeed);
        // Check that zooming wouldn't put us out of bounds
        /** @type {?} */
        const newZoomLevel = this.zoomLevel * zoomFactor;
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
            const mouseX = $event.clientX;
            /** @type {?} */
            const mouseY = $event.clientY;
            // Transform the mouse X/Y into a SVG X/Y
            /** @type {?} */
            const svg = this.chart.nativeElement.querySelector('svg');
            /** @type {?} */
            const svgGroup = svg.querySelector('g.chart');
            /** @type {?} */
            const point = svg.createSVGPoint();
            point.x = mouseX;
            point.y = mouseY;
            /** @type {?} */
            const svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());
            // Panzoom
            this.pan(svgPoint.x, svgPoint.y, true);
            this.zoom(zoomFactor);
            this.pan(-svgPoint.x, -svgPoint.y, true);
        }
        else {
            this.zoom(zoomFactor);
        }
    }
    /**
     * Pan by x/y
     *
     * @param {?} x
     * @param {?} y
     * @param {?=} ignoreZoomLevel
     * @return {?}
     */
    pan(x, y, ignoreZoomLevel = false) {
        /** @type {?} */
        const zoomLevel = ignoreZoomLevel ? 1 : this.zoomLevel;
        this.transformationMatrix = transform(this.transformationMatrix, translate(x / zoomLevel, y / zoomLevel));
        this.updateTransform();
    }
    /**
     * Pan to a fixed x/y
     *
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    panTo(x, y) {
        if (x === null || x === undefined || isNaN(x) || y === null || y === undefined || isNaN(y)) {
            return;
        }
        /** @type {?} */
        const panX = -this.panOffsetX - x * this.zoomLevel + this.dims.width / 2;
        /** @type {?} */
        const panY = -this.panOffsetY - y * this.zoomLevel + this.dims.height / 2;
        this.transformationMatrix = transform(this.transformationMatrix, translate(panX / this.zoomLevel, panY / this.zoomLevel));
        this.updateTransform();
    }
    /**
     * Zoom by a factor
     *
     * @param {?} factor
     * @return {?}
     */
    zoom(factor) {
        this.transformationMatrix = transform(this.transformationMatrix, scale(factor, factor));
        this.zoomChange.emit(this.zoomLevel);
        this.updateTransform();
    }
    /**
     * @return {?}
     */
    zoomIn() {
        this.zoom(1 + this.zoomSpeed);
    }
    /**
     * @return {?}
     */
    zoomOut() {
        this.zoom(1 - this.zoomSpeed);
    }
    /**
     * Zoom to a fixed level
     *
     * @param {?} level
     * @return {?}
     */
    zoomTo(level) {
        this.transformationMatrix.a = isNaN(level) ? this.transformationMatrix.a : Number(level);
        this.transformationMatrix.d = isNaN(level) ? this.transformationMatrix.d : Number(level);
        this.zoomChange.emit(this.zoomLevel);
        this.updateTransform();
    }
    /**
     * Pan was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onPan(event) {
        this.pan(event.movementX, event.movementY);
    }
    /**
     * Drag was invoked from an event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onDrag(event) {
        if (!this.draggingEnabled) {
            return;
        }
        /** @type {?} */
        const node = this.draggingNode;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDrag) {
            this.layout.onDrag(node, event);
        }
        node.position.x += event.movementX / this.zoomLevel;
        node.position.y += event.movementY / this.zoomLevel;
        // move the node
        /** @type {?} */
        const x = node.position.x - node.dimension.width / 2;
        /** @type {?} */
        const y = node.position.y - node.dimension.height / 2;
        node.transform = `translate(${x}, ${y})`;
        for (const link of this.graph.edges) {
            if (link.target === node.id ||
                link.source === node.id ||
                ((/** @type {?} */ (link.target))).id === node.id ||
                ((/** @type {?} */ (link.source))).id === node.id) {
                if (this.layout && typeof this.layout !== 'string') {
                    /** @type {?} */
                    const result = this.layout.updateEdge(this.graph, link);
                    /** @type {?} */
                    const result$ = result instanceof Observable ? result : of(result);
                    this.graphSubscription.add(result$.subscribe(graph => {
                        this.graph = graph;
                        this.redrawEdge(link);
                    }));
                }
            }
        }
        this.redrawLines(false);
    }
    /**
     * @param {?} edge
     * @return {?}
     */
    redrawEdge(edge) {
        /** @type {?} */
        const line = this.generateLine(edge.points);
        this.calcDominantBaseline(edge);
        edge.oldLine = edge.line;
        edge.line = line;
    }
    /**
     * Update the entire view for the new pan position
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    updateTransform() {
        this.transform = toSVG(this.transformationMatrix);
    }
    /**
     * Node was clicked
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onClick(event) {
        this.select.emit(event);
    }
    /**
     * Node was focused
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onActivate(event) {
        if (this.activeEntries.indexOf(event) > -1) {
            return;
        }
        this.activeEntries = [event, ...this.activeEntries];
        this.activate.emit({ value: event, entries: this.activeEntries });
    }
    /**
     * Node was defocused
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onDeactivate(event) {
        /** @type {?} */
        const idx = this.activeEntries.indexOf(event);
        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];
        this.deactivate.emit({ value: event, entries: this.activeEntries });
    }
    /**
     * Get the domain series for the nodes
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    getSeriesDomain() {
        return this.nodes
            .map(d => this.groupResultsBy(d))
            .reduce((nodes, node) => (nodes.indexOf(node) !== -1 ? nodes : nodes.concat([node])), [])
            .sort();
    }
    /**
     * Tracking for the link
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} link
     * @return {?}
     */
    trackLinkBy(index, link) {
        return link.id;
    }
    /**
     * Tracking for the node
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} node
     * @return {?}
     */
    trackNodeBy(index, node) {
        return node.id;
    }
    /**
     * Sets the colors the nodes
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    setColors() {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
    }
    /**
     * Gets the legend options
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    getLegendOptions() {
        return {
            scaleType: 'ordinal',
            domain: this.seriesDomain,
            colors: this.colors
        };
    }
    /**
     * On mouse move event, used for panning and dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @return {?}
     */
    onMouseMove($event) {
        if (this.isPanning && this.panningEnabled) {
            this.onPan($event);
        }
        else if (this.isDragging && this.draggingEnabled) {
            this.onDrag($event);
        }
    }
    /**
     * On touch start event to enable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onTouchStart(event) {
        this._touchLastX = event.changedTouches[0].clientX;
        this._touchLastY = event.changedTouches[0].clientY;
        this.isPanning = true;
    }
    /**
     * On touch move event, used for panning.
     *
     * @param {?} $event
     * @return {?}
     */
    onTouchMove($event) {
        if (this.isPanning && this.panningEnabled) {
            /** @type {?} */
            const clientX = $event.changedTouches[0].clientX;
            /** @type {?} */
            const clientY = $event.changedTouches[0].clientY;
            /** @type {?} */
            const movementX = clientX - this._touchLastX;
            /** @type {?} */
            const movementY = clientY - this._touchLastY;
            this._touchLastX = clientX;
            this._touchLastY = clientY;
            this.pan(movementX, movementY);
        }
    }
    /**
     * On touch end event to disable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onTouchEnd(event) {
        this.isPanning = false;
    }
    /**
     * On mouse up event to disable panning/dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        this.isDragging = false;
        this.isPanning = false;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragEnd) {
            this.layout.onDragEnd(this.draggingNode, event);
        }
    }
    /**
     * On node mouse down to kick off dragging
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    onNodeMouseDown(event, node) {
        if (!this.draggingEnabled) {
            return;
        }
        this.isDragging = true;
        this.draggingNode = node;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragStart) {
            this.layout.onDragStart(node, event);
        }
    }
    /**
     * Center the graph in the viewport
     * @return {?}
     */
    center() {
        this.panTo(this.graphDims.width / 2, this.graphDims.height / 2);
    }
    /**
     * Zooms to fit the entier graph
     * @return {?}
     */
    zoomToFit() {
        /** @type {?} */
        const heightZoom = this.dims.height / this.graphDims.height;
        /** @type {?} */
        const widthZoom = this.dims.width / this.graphDims.width;
        /** @type {?} */
        const zoomLevel = Math.min(heightZoom, widthZoom, 1);
        if (zoomLevel <= this.minZoomLevel || zoomLevel >= this.maxZoomLevel) {
            return;
        }
        if (zoomLevel !== this.zoomLevel) {
            this.zoomLevel = zoomLevel;
            this.updateTransform();
            this.zoomChange.emit(this.zoomLevel);
        }
    }
    /**
     * Pans to the node
     * @param {?} nodeId
     * @return {?}
     */
    panToNodeId(nodeId) {
        /** @type {?} */
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) {
            return;
        }
        this.panTo(node.position.x, node.position.y);
    }
}
GraphComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-graph',
                styles: [`.graph{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.graph .edge{stroke:#666;fill:none}.graph .edge .edge-label{stroke:none;font-size:12px;fill:#251e1e}.graph .panning-rect{fill:transparent;cursor:move;width:1000000px}.graph .node-group .node:focus{outline:0}.graph .cluster rect{opacity:.2}`],
                template: `<ngx-charts-chart
  [view]="[width, height]"
  [showLegend]="legend"
  [legendOptions]="legendOptions"
  (legendLabelClick)="onClick($event)"
  (legendLabelActivate)="onActivate($event)"
  (legendLabelDeactivate)="onDeactivate($event)"
  mouseWheel
  (mouseWheelUp)="onZoom($event, 'in')"
  (mouseWheelDown)="onZoom($event, 'out')"
>
  <svg:g
    *ngIf="initialized && graph"
    [attr.transform]="transform"
    (touchstart)="onTouchStart($event)"
    (touchend)="onTouchEnd($event)"
    class="graph chart"
  >
    <defs>
      <ng-template *ngIf="defsTemplate" [ngTemplateOutlet]="defsTemplate"></ng-template>
      <svg:path
        class="text-path"
        *ngFor="let link of graph.edges"
        [attr.d]="link.textPath"
        [attr.id]="link.id"
      ></svg:path>
    </defs>
    <svg:rect
      class="panning-rect"
      [attr.width]="dims.width * 100"
      [attr.height]="dims.height * 100"
      [attr.transform]="'translate(' + (-dims.width || 0) * 50 + ',' + (-dims.height || 0) * 50 + ')'"
      (mousedown)="isPanning = true"
    />
    <svg:g class="clusters">
      <svg:g
        #clusterElement
        *ngFor="let node of graph.clusters; trackBy: trackNodeBy"
        class="node-group"
        [id]="node.id"
        [attr.transform]="node.transform"
        (click)="onClick(node)"
      >
        <ng-template
          *ngIf="clusterTemplate"
          [ngTemplateOutlet]="clusterTemplate"
          [ngTemplateOutletContext]="{ $implicit: node }"
        ></ng-template>
        <svg:g *ngIf="!clusterTemplate" class="node cluster">
          <svg:rect
            [attr.width]="node.dimension.width"
            [attr.height]="node.dimension.height"
            [attr.fill]="node.data?.color"
          />
          <svg:text alignment-baseline="central" [attr.x]="10" [attr.y]="node.dimension.height / 2">
            {{ node.label }}
          </svg:text>
        </svg:g>
      </svg:g>
    </svg:g>
    <svg:g class="links">
      <svg:g #linkElement *ngFor="let link of graph.edges; trackBy: trackLinkBy" class="link-group" [id]="link.id">
        <ng-template
          *ngIf="linkTemplate"
          [ngTemplateOutlet]="linkTemplate"
          [ngTemplateOutletContext]="{ $implicit: link }"
        ></ng-template>
        <svg:path *ngIf="!linkTemplate" class="edge" [attr.d]="link.line" />
      </svg:g>
    </svg:g>
    <svg:g class="nodes">
      <svg:g
        #nodeElement
        *ngFor="let node of graph.nodes; trackBy: trackNodeBy"
        class="node-group"
        [id]="node.id"
        [attr.transform]="node.transform"
        (click)="onClick(node)"
        (mousedown)="onNodeMouseDown($event, node)"
      >
        <ng-template
          *ngIf="nodeTemplate"
          [ngTemplateOutlet]="nodeTemplate"
          [ngTemplateOutletContext]="{ $implicit: node }"
        ></ng-template>
        <svg:circle
          *ngIf="!nodeTemplate"
          r="10"
          [attr.cx]="node.dimension.width / 2"
          [attr.cy]="node.dimension.height / 2"
          [attr.fill]="node.data?.color"
        />
      </svg:g>
    </svg:g>
  </svg:g>
</ngx-charts-chart>
`,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [trigger('link', [ngTransition('* => *', [animate(500, style({ transform: '*' }))])])]
            },] },
];
/** @nocollapse */
GraphComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: LayoutService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLElBQUksWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLGlCQUFpQixFQUdsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLGNBQWMsRUFDZCxXQUFXLEVBRVgsdUJBQXVCLEVBQ3hCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBSXpELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7Ozs7O0FBS2pDLDRCQU9DOzs7SUFOQyxtQkFB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LENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QixDQUFDLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUM1RyxDQUFDLEdBQUcsQ0FBQztZQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNYLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQ2I7WUFDRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFDSCxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQyxDQUFDLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUM1RyxDQUFDLEdBQUcsQ0FBQztZQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNYLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQ2I7WUFDRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7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OztJQUMzQixzQ0FBOEI7O0lBQzlCLHNDQUE4Qjs7SUFDOUIsd0NBQStCOztJQUMvQixvQ0FBMkI7O0lBQzNCLG1DQUF5Qjs7SUFDekIsc0NBQTRCOztJQUM1QixzQ0FBNEI7O0lBQzVCLGtDQUEwQjs7SUFDMUIsbUNBQTBCOztJQUMxQixvQ0FBNEI7O0lBQzVCLGlDQUFrQzs7SUFDbEMsaUNBQWtDOztJQUNsQyxvQ0FBcUM7O0lBQ3JDLG9DQUFxQzs7SUFDckMsZ0NBQWlDOztJQUNqQyx3Q0FBNkI7O0lBRTdCLGtDQUEyRDs7SUFDM0Qsb0NBQTZEOztJQUM3RCxvQ0FBZ0U7O0lBRWhFLHNDQUE2RDs7SUFDN0Qsc0NBQTZEOztJQUM3RCx5Q0FBbUU7O0lBQ25FLHNDQUE2RDs7SUFFN0QsK0JBQW1FOztJQUNuRSxzQ0FBaUU7O0lBQ2pFLHNDQUFpRTs7SUFFakUsMkNBQXFEOztJQUNyRCx1Q0FBbUM7O0lBQ25DLGdDQUFvQjs7SUFDcEIsOEJBQXFCOztJQUNyQixnQ0FBc0I7O0lBQ3RCLGlDQUFhOztJQUNiLHNDQUFrQjs7SUFDbEIsbUNBQWtCOztJQUNsQix1Q0FBbUI7O0lBQ25CLG1DQUFrQjs7SUFDbEIsb0NBQW1COztJQUNuQixzQ0FBbUI7O0lBQ25CLHFDQUFvQjs7SUFDcEIsK0JBQWE7O0lBQ2IsbUNBQXlDOztJQUN6QyxtQ0FBdUI7O0lBQ3ZCLDhDQUEwQzs7SUFDMUMscUNBQW1COztJQUNuQixxQ0FBbUI7O0lBV25CLHdDQUMyRDs7Ozs7SUFUekQsNEJBQXNCOztJQUN0Qiw4QkFBbUI7O0lBQ25CLDRCQUE0Qjs7Ozs7SUFDNUIsdUNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVuYW1lIHRyYW5zaXRpb24gZHVlIHRvIGNvbmZsaWN0IHdpdGggZDMgdHJhbnNpdGlvblxuaW1wb3J0IHsgYW5pbWF0ZSwgc3R5bGUsIHRyYW5zaXRpb24gYXMgbmdUcmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCYXNlQ2hhcnRDb21wb25lbnQsXG4gIENoYXJ0Q29tcG9uZW50LFxuICBDb2xvckhlbHBlcixcbiAgVmlld0RpbWVuc2lvbnMsXG4gIGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zXG59IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgKiBhcyBzaGFwZSBmcm9tICdkMy1zaGFwZSc7XG5pbXBvcnQgJ2QzLXRyYW5zaXRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBpZGVudGl0eSwgc2NhbGUsIHRvU1ZHLCB0cmFuc2Zvcm0sIHRyYW5zbGF0ZSB9IGZyb20gJ3RyYW5zZm9ybWF0aW9uLW1hdHJpeCc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL2xheW91dHMvbGF5b3V0LnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uL21vZGVscy9lZGdlLm1vZGVsJztcbmltcG9ydCB7IE5vZGUsIENsdXN0ZXJOb2RlIH0gZnJvbSAnLi4vbW9kZWxzL25vZGUubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XG5cbi8qKlxuICogTWF0cml4XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0cml4IHtcbiAgYTogbnVtYmVyO1xuICBiOiBudW1iZXI7XG4gIGM6IG51bWJlcjtcbiAgZDogbnVtYmVyO1xuICBlOiBudW1iZXI7XG4gIGY6IG51bWJlcjtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdyYXBoJyxcbiAgc3R5bGVzOiBbYC5ncmFwaHstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmdyYXBoIC5lZGdle3N0cm9rZTojNjY2O2ZpbGw6bm9uZX0uZ3JhcGggLmVkZ2UgLmVkZ2UtbGFiZWx7c3Ryb2tlOm5vbmU7Zm9udC1zaXplOjEycHg7ZmlsbDojMjUxZTFlfS5ncmFwaCAucGFubmluZy1yZWN0e2ZpbGw6dHJhbnNwYXJlbnQ7Y3Vyc29yOm1vdmU7d2lkdGg6MTAwMDAwMHB4fS5ncmFwaCAubm9kZS1ncm91cCAubm9kZTpmb2N1c3tvdXRsaW5lOjB9LmdyYXBoIC5jbHVzdGVyIHJlY3R7b3BhY2l0eTouMn1gXSxcbiAgdGVtcGxhdGU6IGA8bmd4LWNoYXJ0cy1jaGFydFxuICBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIlxuICBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIlxuICBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCJcbiAgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcbiAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcbiAgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXG4gIG1vdXNlV2hlZWxcbiAgKG1vdXNlV2hlZWxVcCk9XCJvblpvb20oJGV2ZW50LCAnaW4nKVwiXG4gIChtb3VzZVdoZWVsRG93bik9XCJvblpvb20oJGV2ZW50LCAnb3V0JylcIlxuPlxuICA8c3ZnOmdcbiAgICAqbmdJZj1cImluaXRpYWxpemVkICYmIGdyYXBoXCJcbiAgICBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCJcbiAgICAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiXG4gICAgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiXG4gICAgY2xhc3M9XCJncmFwaCBjaGFydFwiXG4gID5cbiAgICA8ZGVmcz5cbiAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImRlZnNUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRlZnNUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8c3ZnOnBhdGhcbiAgICAgICAgY2xhc3M9XCJ0ZXh0LXBhdGhcIlxuICAgICAgICAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlc1wiXG4gICAgICAgIFthdHRyLmRdPVwibGluay50ZXh0UGF0aFwiXG4gICAgICAgIFthdHRyLmlkXT1cImxpbmsuaWRcIlxuICAgICAgPjwvc3ZnOnBhdGg+XG4gICAgPC9kZWZzPlxuICAgIDxzdmc6cmVjdFxuICAgICAgY2xhc3M9XCJwYW5uaW5nLXJlY3RcIlxuICAgICAgW2F0dHIud2lkdGhdPVwiZGltcy53aWR0aCAqIDEwMFwiXG4gICAgICBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKiAxMDBcIlxuICAgICAgW2F0dHIudHJhbnNmb3JtXT1cIid0cmFuc2xhdGUoJyArICgtZGltcy53aWR0aCB8fCAwKSAqIDUwICsgJywnICsgKC1kaW1zLmhlaWdodCB8fCAwKSAqIDUwICsgJyknXCJcbiAgICAgIChtb3VzZWRvd24pPVwiaXNQYW5uaW5nID0gdHJ1ZVwiXG4gICAgLz5cbiAgICA8c3ZnOmcgY2xhc3M9XCJjbHVzdGVyc1wiPlxuICAgICAgPHN2ZzpnXG4gICAgICAgICNjbHVzdGVyRWxlbWVudFxuICAgICAgICAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5jbHVzdGVyczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIlxuICAgICAgICBjbGFzcz1cIm5vZGUtZ3JvdXBcIlxuICAgICAgICBbaWRdPVwibm9kZS5pZFwiXG4gICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKG5vZGUpXCJcbiAgICAgID5cbiAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgKm5nSWY9XCJjbHVzdGVyVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNsdXN0ZXJUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlIH1cIlxuICAgICAgICA+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPHN2ZzpnICpuZ0lmPVwiIWNsdXN0ZXJUZW1wbGF0ZVwiIGNsYXNzPVwibm9kZSBjbHVzdGVyXCI+XG4gICAgICAgICAgPHN2ZzpyZWN0XG4gICAgICAgICAgICBbYXR0ci53aWR0aF09XCJub2RlLmRpbWVuc2lvbi53aWR0aFwiXG4gICAgICAgICAgICBbYXR0ci5oZWlnaHRdPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0XCJcbiAgICAgICAgICAgIFthdHRyLmZpbGxdPVwibm9kZS5kYXRhPy5jb2xvclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3ZnOnRleHQgYWxpZ25tZW50LWJhc2VsaW5lPVwiY2VudHJhbFwiIFthdHRyLnhdPVwiMTBcIiBbYXR0ci55XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIj5cbiAgICAgICAgICAgIHt7IG5vZGUubGFiZWwgfX1cbiAgICAgICAgICA8L3N2Zzp0ZXh0PlxuICAgICAgICA8L3N2ZzpnPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuICAgIDxzdmc6ZyBjbGFzcz1cImxpbmtzXCI+XG4gICAgICA8c3ZnOmcgI2xpbmtFbGVtZW50ICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzOyB0cmFja0J5OiB0cmFja0xpbmtCeVwiIGNsYXNzPVwibGluay1ncm91cFwiIFtpZF09XCJsaW5rLmlkXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICpuZ0lmPVwibGlua1RlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJsaW5rVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbGluayB9XCJcbiAgICAgICAgPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxzdmc6cGF0aCAqbmdJZj1cIiFsaW5rVGVtcGxhdGVcIiBjbGFzcz1cImVkZ2VcIiBbYXR0ci5kXT1cImxpbmsubGluZVwiIC8+XG4gICAgICA8L3N2ZzpnPlxuICAgIDwvc3ZnOmc+XG4gICAgPHN2ZzpnIGNsYXNzPVwibm9kZXNcIj5cbiAgICAgIDxzdmc6Z1xuICAgICAgICAjbm9kZUVsZW1lbnRcbiAgICAgICAgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGgubm9kZXM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCJcbiAgICAgICAgY2xhc3M9XCJub2RlLWdyb3VwXCJcbiAgICAgICAgW2lkXT1cIm5vZGUuaWRcIlxuICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxuICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlKVwiXG4gICAgICAgIChtb3VzZWRvd24pPVwib25Ob2RlTW91c2VEb3duKCRldmVudCwgbm9kZSlcIlxuICAgICAgPlxuICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAqbmdJZj1cIm5vZGVUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibm9kZVRlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUgfVwiXG4gICAgICAgID48L25nLXRlbXBsYXRlPlxuICAgICAgICA8c3ZnOmNpcmNsZVxuICAgICAgICAgICpuZ0lmPVwiIW5vZGVUZW1wbGF0ZVwiXG4gICAgICAgICAgcj1cIjEwXCJcbiAgICAgICAgICBbYXR0ci5jeF09XCJub2RlLmRpbWVuc2lvbi53aWR0aCAvIDJcIlxuICAgICAgICAgIFthdHRyLmN5XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIlxuICAgICAgICAgIFthdHRyLmZpbGxdPVwibm9kZS5kYXRhPy5jb2xvclwiXG4gICAgICAgIC8+XG4gICAgICA8L3N2ZzpnPlxuICAgIDwvc3ZnOmc+XG4gIDwvc3ZnOmc+XG48L25neC1jaGFydHMtY2hhcnQ+XG5gLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ2xpbmsnLCBbbmdUcmFuc2l0aW9uKCcqID0+IConLCBbYW5pbWF0ZSg1MDAsIHN0eWxlKHsgdHJhbnNmb3JtOiAnKicgfSkpXSldKV1cbn0pXG5leHBvcnQgY2xhc3MgR3JhcGhDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbGVnZW5kOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIG5vZGVzOiBOb2RlW10gPSBbXTtcbiAgQElucHV0KCkgY2x1c3RlcnM6IENsdXN0ZXJOb2RlW10gPSBbXTtcbiAgQElucHV0KCkgbGlua3M6IEVkZ2VbXSA9IFtdO1xuICBASW5wdXQoKSBhY3RpdmVFbnRyaWVzOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoKSBjdXJ2ZTogYW55O1xuICBASW5wdXQoKSBkcmFnZ2luZ0VuYWJsZWQgPSB0cnVlO1xuICBASW5wdXQoKSBub2RlSGVpZ2h0OiBudW1iZXI7XG4gIEBJbnB1dCgpIG5vZGVNYXhIZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgbm9kZU1pbkhlaWdodDogbnVtYmVyO1xuICBASW5wdXQoKSBub2RlV2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgbm9kZU1pbldpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIG5vZGVNYXhXaWR0aDogbnVtYmVyO1xuICBASW5wdXQoKSBwYW5uaW5nRW5hYmxlZCA9IHRydWU7XG4gIEBJbnB1dCgpIGVuYWJsZVpvb20gPSB0cnVlO1xuICBASW5wdXQoKSB6b29tU3BlZWQgPSAwLjE7XG4gIEBJbnB1dCgpIG1pblpvb21MZXZlbCA9IDAuMTtcbiAgQElucHV0KCkgbWF4Wm9vbUxldmVsID0gNC4wO1xuICBASW5wdXQoKSBhdXRvWm9vbSA9IGZhbHNlO1xuICBASW5wdXQoKSBwYW5Pblpvb20gPSB0cnVlO1xuICBASW5wdXQoKSBhdXRvQ2VudGVyID0gZmFsc2U7XG4gIEBJbnB1dCgpIHVwZGF0ZSQ6IE9ic2VydmFibGU8YW55PjtcbiAgQElucHV0KCkgY2VudGVyJDogT2JzZXJ2YWJsZTxhbnk+O1xuICBASW5wdXQoKSB6b29tVG9GaXQkOiBPYnNlcnZhYmxlPGFueT47XG4gIEBJbnB1dCgpIHBhblRvTm9kZSQ6IE9ic2VydmFibGU8YW55PjtcbiAgQElucHV0KCkgbGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQ7XG4gIEBJbnB1dCgpIGxheW91dFNldHRpbmdzOiBhbnk7XG5cbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgem9vbUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQENvbnRlbnRDaGlsZCgnbGlua1RlbXBsYXRlJykgbGlua1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKCdub2RlVGVtcGxhdGUnKSBub2RlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoJ2NsdXN0ZXJUZW1wbGF0ZScpIGNsdXN0ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZCgnZGVmc1RlbXBsYXRlJykgZGVmc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBWaWV3Q2hpbGQoQ2hhcnRDb21wb25lbnQsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBjaGFydDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZHJlbignbm9kZUVsZW1lbnQnKSBub2RlRWxlbWVudHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgQFZpZXdDaGlsZHJlbignbGlua0VsZW1lbnQnKSBsaW5rRWxlbWVudHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcblxuICBncmFwaFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBjb2xvcnM6IENvbG9ySGVscGVyO1xuICBkaW1zOiBWaWV3RGltZW5zaW9ucztcbiAgbWFyZ2luID0gWzAsIDAsIDAsIDBdO1xuICByZXN1bHRzID0gW107XG4gIHNlcmllc0RvbWFpbjogYW55O1xuICB0cmFuc2Zvcm06IHN0cmluZztcbiAgbGVnZW5kT3B0aW9uczogYW55O1xuICBpc1Bhbm5pbmcgPSBmYWxzZTtcbiAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICBkcmFnZ2luZ05vZGU6IE5vZGU7XG4gIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIGdyYXBoOiBHcmFwaDtcbiAgZ3JhcGhEaW1zOiBhbnkgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcbiAgX29sZExpbmtzOiBFZGdlW10gPSBbXTtcbiAgdHJhbnNmb3JtYXRpb25NYXRyaXg6IE1hdHJpeCA9IGlkZW50aXR5KCk7XG4gIF90b3VjaExhc3RYID0gbnVsbDtcbiAgX3RvdWNoTGFzdFkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHpvbmU6IE5nWm9uZSxcbiAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZVxuICApIHtcbiAgICBzdXBlcihlbCwgem9uZSwgY2QpO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ3JvdXBSZXN1bHRzQnk6IChub2RlOiBhbnkpID0+IHN0cmluZyA9IG5vZGUgPT4gbm9kZS5sYWJlbDtcblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcbiAgICovXG4gIGdldCB6b29tTGV2ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgKi9cbiAgQElucHV0KCd6b29tTGV2ZWwnKVxuICBzZXQgem9vbUxldmVsKGxldmVsKSB7XG4gICAgdGhpcy56b29tVG8oTnVtYmVyKGxldmVsKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGB4YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIGdldCBwYW5PZmZzZXRYKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IGB4YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIEBJbnB1dCgncGFuT2Zmc2V0WCcpXG4gIHNldCBwYW5PZmZzZXRYKHgpIHtcbiAgICB0aGlzLnBhblRvKE51bWJlcih4KSwgbnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGB5YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIGdldCBwYW5PZmZzZXRZKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmY7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IGB5YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcbiAgICovXG4gIEBJbnB1dCgncGFuT2Zmc2V0WScpXG4gIHNldCBwYW5PZmZzZXRZKHkpIHtcbiAgICB0aGlzLnBhblRvKG51bGwsIE51bWJlcih5KSk7XG4gIH1cblxuICAvKipcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy51cGRhdGUkKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgdGhpcy51cGRhdGUkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2VudGVyJCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMuY2VudGVyJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2VudGVyKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy56b29tVG9GaXQkKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgdGhpcy56b29tVG9GaXQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy56b29tVG9GaXQoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuVG9Ob2RlJCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMucGFuVG9Ob2RlJC5zdWJzY3JpYmUoKG5vZGVJZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5wYW5Ub05vZGVJZChub2RlSWQpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBsYXlvdXQsIGxheW91dFNldHRpbmdzLCBub2RlcywgY2x1c3RlcnMsIGxpbmtzIH0gPSBjaGFuZ2VzO1xuICAgIHRoaXMuc2V0TGF5b3V0KHRoaXMubGF5b3V0KTtcbiAgICBpZiAobGF5b3V0U2V0dGluZ3MpIHtcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBzZXRMYXlvdXQobGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgaWYgKCFsYXlvdXQpIHtcbiAgICAgIGxheW91dCA9ICdkYWdyZSc7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGF5b3V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5sYXlvdXQgPSB0aGlzLmxheW91dFNlcnZpY2UuZ2V0TGF5b3V0KGxheW91dCk7XG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHNldExheW91dFNldHRpbmdzKHNldHRpbmdzOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5sYXlvdXQuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSk7XG4gIH1cblxuICAvKipcbiAgICogQmFzZSBjbGFzcyB1cGRhdGUgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBkYWcgZ3JhcGhcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gICAgaWYgKCF0aGlzLmN1cnZlKSB7XG4gICAgICB0aGlzLmN1cnZlID0gc2hhcGUuY3VydmVCdW5kbGUuYmV0YSgxKTtcbiAgICB9XG5cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luLFxuICAgICAgICBzaG93TGVnZW5kOiB0aGlzLmxlZ2VuZFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc2VyaWVzRG9tYWluID0gdGhpcy5nZXRTZXJpZXNEb21haW4oKTtcbiAgICAgIHRoaXMuc2V0Q29sb3JzKCk7XG4gICAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcblxuICAgICAgdGhpcy5jcmVhdGVHcmFwaCgpO1xuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGRhZ3JlIGdyYXBoIGVuZ2luZVxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGNyZWF0ZUdyYXBoKCk6IHZvaWQge1xuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgIGNvbnN0IGluaXRpYWxpemVOb2RlID0gbiA9PiB7XG4gICAgICBpZiAoIW4ubWV0YSkge1xuICAgICAgICBuLm1ldGEgPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmICghbi5pZCkge1xuICAgICAgICBuLmlkID0gaWQoKTtcbiAgICAgIH1cbiAgICAgIGlmICghbi5kaW1lbnNpb24pIHtcbiAgICAgICAgbi5kaW1lbnNpb24gPSB7XG4gICAgICAgICAgd2lkdGg6IHRoaXMubm9kZVdpZHRoID8gdGhpcy5ub2RlV2lkdGggOiAzMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMubm9kZUhlaWdodCA/IHRoaXMubm9kZUhlaWdodCA6IDMwXG4gICAgICAgIH07XG5cbiAgICAgICAgbi5tZXRhLmZvcmNlRGltZW5zaW9ucyA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbi5tZXRhLmZvcmNlRGltZW5zaW9ucyA9IG4ubWV0YS5mb3JjZURpbWVuc2lvbnMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBuLm1ldGEuZm9yY2VEaW1lbnNpb25zO1xuICAgICAgfVxuICAgICAgbi5wb3NpdGlvbiA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfTtcbiAgICAgIG4uZGF0YSA9IG4uZGF0YSA/IG4uZGF0YSA6IHt9O1xuICAgICAgcmV0dXJuIG47XG4gICAgfTtcblxuICAgIHRoaXMuZ3JhcGggPSB7XG4gICAgICBub2RlczogWy4uLnRoaXMubm9kZXNdLm1hcChpbml0aWFsaXplTm9kZSksXG4gICAgICBjbHVzdGVyczogWy4uLih0aGlzLmNsdXN0ZXJzIHx8IFtdKV0ubWFwKGluaXRpYWxpemVOb2RlKSxcbiAgICAgIGVkZ2VzOiBbLi4udGhpcy5saW5rc10ubWFwKGUgPT4ge1xuICAgICAgICBpZiAoIWUuaWQpIHtcbiAgICAgICAgICBlLmlkID0gaWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZTtcbiAgICAgIH0pXG4gICAgfTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXcoKSk7XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgdGhlIGdyYXBoIHVzaW5nIGRhZ3JlIGxheW91dHNcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBkcmF3KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5sYXlvdXQgfHwgdHlwZW9mIHRoaXMubGF5b3V0ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBDYWxjIHZpZXcgZGltcyBmb3IgdGhlIG5vZGVzXG4gICAgdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCk7XG5cbiAgICAvLyBSZWNhbGMgdGhlIGxheW91dFxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnJ1bih0aGlzLmdyYXBoKTtcbiAgICBjb25zdCByZXN1bHQkID0gcmVzdWx0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSA/IHJlc3VsdCA6IG9mKHJlc3VsdCk7XG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICByZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XG4gICAgICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICAgICAgdGhpcy50aWNrKCk7XG4gICAgICB9KVxuICAgICk7XG4gICAgcmVzdWx0JC5waXBlKGZpcnN0KGdyYXBoID0+IGdyYXBoLm5vZGVzLmxlbmd0aCA+IDApKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCkpO1xuICB9XG5cbiAgdGljaygpIHtcbiAgICAvLyBUcmFuc3Bvc2VzIHZpZXcgb3B0aW9ucyB0byB0aGUgbm9kZVxuICAgIHRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7bi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHxcbiAgICAgICAgMH0pYDtcbiAgICAgIGlmICghbi5kYXRhKSB7XG4gICAgICAgIG4uZGF0YSA9IHt9O1xuICAgICAgfVxuICAgICAgbi5kYXRhLmNvbG9yID0gdGhpcy5jb2xvcnMuZ2V0Q29sb3IodGhpcy5ncm91cFJlc3VsdHNCeShuKSk7XG4gICAgfSk7XG4gICAgKHRoaXMuZ3JhcGguY2x1c3RlcnMgfHwgW10pLm1hcChuID0+IHtcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke24ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8XG4gICAgICAgIDB9KWA7XG4gICAgICBpZiAoIW4uZGF0YSkge1xuICAgICAgICBuLmRhdGEgPSB7fTtcbiAgICAgIH1cbiAgICAgIG4uZGF0YS5jb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBsYWJlbHMgdG8gdGhlIG5ldyBwb3NpdGlvbnNcbiAgICBjb25zdCBuZXdMaW5rcyA9IFtdO1xuICAgIGZvciAoY29uc3QgZWRnZUxhYmVsSWQgaW4gdGhpcy5ncmFwaC5lZGdlTGFiZWxzKSB7XG4gICAgICBjb25zdCBlZGdlTGFiZWwgPSB0aGlzLmdyYXBoLmVkZ2VMYWJlbHNbZWRnZUxhYmVsSWRdO1xuXG4gICAgICBjb25zdCBub3JtS2V5ID0gZWRnZUxhYmVsSWQucmVwbGFjZSgvW15cXHctXSovZywgJycpO1xuICAgICAgbGV0IG9sZExpbmsgPSB0aGlzLl9vbGRMaW5rcy5maW5kKG9sID0+IGAke29sLnNvdXJjZX0ke29sLnRhcmdldH1gID09PSBub3JtS2V5KTtcbiAgICAgIGlmICghb2xkTGluaykge1xuICAgICAgICBvbGRMaW5rID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKG5sID0+IGAke25sLnNvdXJjZX0ke25sLnRhcmdldH1gID09PSBub3JtS2V5KSB8fCBlZGdlTGFiZWw7XG4gICAgICB9XG5cbiAgICAgIG9sZExpbmsub2xkTGluZSA9IG9sZExpbmsubGluZTtcblxuICAgICAgY29uc3QgcG9pbnRzID0gZWRnZUxhYmVsLnBvaW50cztcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShwb2ludHMpO1xuXG4gICAgICBjb25zdCBuZXdMaW5rID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkTGluayk7XG4gICAgICBuZXdMaW5rLmxpbmUgPSBsaW5lO1xuICAgICAgbmV3TGluay5wb2ludHMgPSBwb2ludHM7XG5cbiAgICAgIGNvbnN0IHRleHRQb3MgPSBwb2ludHNbTWF0aC5mbG9vcihwb2ludHMubGVuZ3RoIC8gMildO1xuICAgICAgaWYgKHRleHRQb3MpIHtcbiAgICAgICAgbmV3TGluay50ZXh0VHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RleHRQb3MueCB8fCAwfSwke3RleHRQb3MueSB8fCAwfSlgO1xuICAgICAgfVxuXG4gICAgICBuZXdMaW5rLnRleHRBbmdsZSA9IDA7XG4gICAgICBpZiAoIW5ld0xpbmsub2xkTGluZSkge1xuICAgICAgICBuZXdMaW5rLm9sZExpbmUgPSBuZXdMaW5rLmxpbmU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUobmV3TGluayk7XG4gICAgICBuZXdMaW5rcy5wdXNoKG5ld0xpbmspO1xuICAgIH1cblxuICAgIHRoaXMuZ3JhcGguZWRnZXMgPSBuZXdMaW5rcztcblxuICAgIC8vIE1hcCB0aGUgb2xkIGxpbmtzIGZvciBhbmltYXRpb25zXG4gICAgaWYgKHRoaXMuZ3JhcGguZWRnZXMpIHtcbiAgICAgIHRoaXMuX29sZExpbmtzID0gdGhpcy5ncmFwaC5lZGdlcy5tYXAobCA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0wgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcbiAgICAgICAgbmV3TC5vbGRMaW5lID0gbC5saW5lO1xuICAgICAgICByZXR1cm4gbmV3TDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgaGVpZ2h0L3dpZHRoIHRvdGFsXG4gICAgdGhpcy5ncmFwaERpbXMud2lkdGggPSBNYXRoLm1heCguLi50aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IG4ucG9zaXRpb24ueCArIG4uZGltZW5zaW9uLndpZHRoKSk7XG4gICAgdGhpcy5ncmFwaERpbXMuaGVpZ2h0ID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnkgKyBuLmRpbWVuc2lvbi5oZWlnaHQpKTtcblxuICAgIGlmICh0aGlzLmF1dG9ab29tKSB7XG4gICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmF1dG9DZW50ZXIpIHtcbiAgICAgIC8vIEF1dG8tY2VudGVyIHdoZW4gcmVuZGVyaW5nXG4gICAgICB0aGlzLmNlbnRlcigpO1xuICAgIH1cblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnJlZHJhd0xpbmVzKCkpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZXMgdGhlIG5vZGUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGUgZGltZW5zaW9uc1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGFwcGx5Tm9kZURpbWVuc2lvbnMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubm9kZUVsZW1lbnRzICYmIHRoaXMubm9kZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5ub2RlRWxlbWVudHMubWFwKGVsZW0gPT4ge1xuICAgICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gZWxlbS5uYXRpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gbmF0aXZlRWxlbWVudC5pZCk7XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBoZWlnaHRcbiAgICAgICAgbGV0IGRpbXM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZGltcyA9IG5hdGl2ZUVsZW1lbnQuZ2V0QkJveCgpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIC8vIFNraXAgZHJhd2luZyBpZiBlbGVtZW50IGlzIG5vdCBkaXNwbGF5ZWQgLSBGaXJlZm94IHdvdWxkIHRocm93IGFuIGVycm9yIGhlcmVcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9kZUhlaWdodCkgeyAgICAgICAgICBcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBub2RlLmRpbWVuc2lvbi5oZWlnaHQgJiYgbm9kZS5tZXRhLmZvcmNlRGltZW5zaW9ucyA/IG5vZGUuZGltZW5zaW9uLmhlaWdodCA6IHRoaXMubm9kZUhlaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBub2RlLmRpbWVuc2lvbi5oZWlnaHQgJiYgbm9kZS5tZXRhLmZvcmNlRGltZW5zaW9ucyA/IG5vZGUuZGltZW5zaW9uLmhlaWdodCA6IGRpbXMuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubm9kZU1heEhlaWdodCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWF4KG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWF4SGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ub2RlTWluSGVpZ2h0KSB7XG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gTWF0aC5taW4obm9kZS5kaW1lbnNpb24uaGVpZ2h0LCB0aGlzLm5vZGVNaW5IZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubm9kZVdpZHRoKSB7XG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSAgbm9kZS5kaW1lbnNpb24ud2lkdGggJiYgbm9kZS5tZXRhLmZvcmNlRGltZW5zaW9ucyA/IG5vZGUuZGltZW5zaW9uLndpZHRoIDogdGhpcy5ub2RlV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSB3aWR0aFxuICAgICAgICAgIGlmIChuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgbWF4VGV4dERpbXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRleHRFbGVtIG9mIG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRCQm94ID0gdGV4dEVsZW0uZ2V0QkJveCgpO1xuICAgICAgICAgICAgICAgIGlmICghbWF4VGV4dERpbXMpIHtcbiAgICAgICAgICAgICAgICAgIG1heFRleHREaW1zID0gY3VycmVudEJCb3g7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QkJveC53aWR0aCA+IG1heFRleHREaW1zLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFRleHREaW1zLndpZHRoID0gY3VycmVudEJCb3gud2lkdGg7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJCb3guaGVpZ2h0ID4gbWF4VGV4dERpbXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFRleHREaW1zLmhlaWdodCA9IGN1cnJlbnRCQm94LmhlaWdodDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgIC8vIFNraXAgZHJhd2luZyBpZiBlbGVtZW50IGlzIG5vdCBkaXNwbGF5ZWQgLSBGaXJlZm94IHdvdWxkIHRocm93IGFuIGVycm9yIGhlcmVcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBub2RlLmRpbWVuc2lvbi53aWR0aCAmJiBub2RlLm1ldGEuZm9yY2VEaW1lbnNpb25zID8gbm9kZS5kaW1lbnNpb24ud2lkdGggOiBtYXhUZXh0RGltcy53aWR0aCArIDIwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IG5vZGUuZGltZW5zaW9uLndpZHRoICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi53aWR0aCA6IGRpbXMud2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubm9kZU1heFdpZHRoKSB7XG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi53aWR0aCwgdGhpcy5ub2RlTWF4V2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5vZGVNaW5XaWR0aCkge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5taW4obm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1pbldpZHRoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZHJhd3MgdGhlIGxpbmVzIHdoZW4gZHJhZ2dlZCBvciB2aWV3cG9ydCB1cGRhdGVkXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgcmVkcmF3TGluZXMoX2FuaW1hdGUgPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy5saW5rRWxlbWVudHMubWFwKGxpbmtFbCA9PiB7XG4gICAgICBjb25zdCBlZGdlID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKGxpbiA9PiBsaW4uaWQgPT09IGxpbmtFbC5uYXRpdmVFbGVtZW50LmlkKTtcblxuICAgICAgaWYgKGVkZ2UpIHtcbiAgICAgICAgY29uc3QgbGlua1NlbGVjdGlvbiA9IHNlbGVjdChsaW5rRWwubmF0aXZlRWxlbWVudCkuc2VsZWN0KCcubGluZScpO1xuICAgICAgICBsaW5rU2VsZWN0aW9uXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZExpbmUpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbihfYW5pbWF0ZSA/IDUwMCA6IDApXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLmxpbmUpO1xuXG4gICAgICAgIGNvbnN0IHRleHRQYXRoU2VsZWN0aW9uID0gc2VsZWN0KHRoaXMuY2hhcnRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnNlbGVjdChgIyR7ZWRnZS5pZH1gKTtcbiAgICAgICAgdGV4dFBhdGhTZWxlY3Rpb25cbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2Uub2xkVGV4dFBhdGgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbihfYW5pbWF0ZSA/IDUwMCA6IDApXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLnRleHRQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIHRleHQgZGlyZWN0aW9ucyAvIGZsaXBwaW5nXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgY2FsY0RvbWluYW50QmFzZWxpbmUobGluayk6IHZvaWQge1xuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBsaW5rLnBvaW50c1swXTtcbiAgICBjb25zdCBsYXN0UG9pbnQgPSBsaW5rLnBvaW50c1tsaW5rLnBvaW50cy5sZW5ndGggLSAxXTtcbiAgICBsaW5rLm9sZFRleHRQYXRoID0gbGluay50ZXh0UGF0aDtcblxuICAgIGlmIChsYXN0UG9pbnQueCA8IGZpcnN0UG9pbnQueCkge1xuICAgICAgbGluay5kb21pbmFudEJhc2VsaW5lID0gJ3RleHQtYmVmb3JlLWVkZ2UnO1xuXG4gICAgICAvLyByZXZlcnNlIHRleHQgcGF0aCBmb3Igd2hlbiBpdHMgZmxpcHBlZCB1cHNpZGUgZG93blxuICAgICAgbGluay50ZXh0UGF0aCA9IHRoaXMuZ2VuZXJhdGVMaW5lKFsuLi5saW5rLnBvaW50c10ucmV2ZXJzZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGluay5kb21pbmFudEJhc2VsaW5lID0gJ3RleHQtYWZ0ZXItZWRnZSc7XG4gICAgICBsaW5rLnRleHRQYXRoID0gbGluay5saW5lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSB0aGUgbmV3IGxpbmUgcGF0aFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGdlbmVyYXRlTGluZShwb2ludHMpOiBhbnkge1xuICAgIGNvbnN0IGxpbmVGdW5jdGlvbiA9IHNoYXBlXG4gICAgICAubGluZTxhbnk+KClcbiAgICAgIC54KGQgPT4gZC54KVxuICAgICAgLnkoZCA9PiBkLnkpXG4gICAgICAuY3VydmUodGhpcy5jdXJ2ZSk7XG4gICAgcmV0dXJuIGxpbmVGdW5jdGlvbihwb2ludHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb20gd2FzIGludm9rZWQgZnJvbSBldmVudFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uWm9vbSgkZXZlbnQ6IE1vdXNlRXZlbnQsIGRpcmVjdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSAxICsgKGRpcmVjdGlvbiA9PT0gJ2luJyA/IHRoaXMuem9vbVNwZWVkIDogLXRoaXMuem9vbVNwZWVkKTtcblxuICAgIC8vIENoZWNrIHRoYXQgem9vbWluZyB3b3VsZG4ndCBwdXQgdXMgb3V0IG9mIGJvdW5kc1xuICAgIGNvbnN0IG5ld1pvb21MZXZlbCA9IHRoaXMuem9vbUxldmVsICogem9vbUZhY3RvcjtcbiAgICBpZiAobmV3Wm9vbUxldmVsIDw9IHRoaXMubWluWm9vbUxldmVsIHx8IG5ld1pvb21MZXZlbCA+PSB0aGlzLm1heFpvb21MZXZlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHpvb21pbmcgaXMgZW5hYmxlZCBvciBub3RcbiAgICBpZiAoIXRoaXMuZW5hYmxlWm9vbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhbk9uWm9vbSA9PT0gdHJ1ZSAmJiAkZXZlbnQpIHtcbiAgICAgIC8vIEFic29sdXRlIG1vdXNlIFgvWSBvbiB0aGUgc2NyZWVuXG4gICAgICBjb25zdCBtb3VzZVggPSAkZXZlbnQuY2xpZW50WDtcbiAgICAgIGNvbnN0IG1vdXNlWSA9ICRldmVudC5jbGllbnRZO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gdGhlIG1vdXNlIFgvWSBpbnRvIGEgU1ZHIFgvWVxuICAgICAgY29uc3Qgc3ZnID0gdGhpcy5jaGFydC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgICAgY29uc3Qgc3ZnR3JvdXAgPSBzdmcucXVlcnlTZWxlY3RvcignZy5jaGFydCcpO1xuXG4gICAgICBjb25zdCBwb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgICAgcG9pbnQueCA9IG1vdXNlWDtcbiAgICAgIHBvaW50LnkgPSBtb3VzZVk7XG4gICAgICBjb25zdCBzdmdQb2ludCA9IHBvaW50Lm1hdHJpeFRyYW5zZm9ybShzdmdHcm91cC5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xuXG4gICAgICAvLyBQYW56b29tXG4gICAgICB0aGlzLnBhbihzdmdQb2ludC54LCBzdmdQb2ludC55LCB0cnVlKTtcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcbiAgICAgIHRoaXMucGFuKC1zdmdQb2ludC54LCAtc3ZnUG9pbnQueSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGFuIGJ5IHgveVxuICAgKlxuICAgKiBAcGFyYW0geFxuICAgKiBAcGFyYW0geVxuICAgKi9cbiAgcGFuKHg6IG51bWJlciwgeTogbnVtYmVyLCBpZ25vcmVab29tTGV2ZWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IHpvb21MZXZlbCA9IGlnbm9yZVpvb21MZXZlbCA/IDEgOiB0aGlzLnpvb21MZXZlbDtcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRyYW5zbGF0ZSh4IC8gem9vbUxldmVsLCB5IC8gem9vbUxldmVsKSk7XG5cbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhbiB0byBhIGZpeGVkIHgveVxuICAgKlxuICAgKi9cbiAgcGFuVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoeCA9PT0gbnVsbCB8fCB4ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeCkgfHwgeSA9PT0gbnVsbCB8fCB5ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5YID0gLXRoaXMucGFuT2Zmc2V0WCAtIHggKiB0aGlzLnpvb21MZXZlbCArIHRoaXMuZGltcy53aWR0aCAvIDI7XG4gICAgY29uc3QgcGFuWSA9IC10aGlzLnBhbk9mZnNldFkgLSB5ICogdGhpcy56b29tTGV2ZWwgKyB0aGlzLmRpbXMuaGVpZ2h0IC8gMjtcblxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0oXG4gICAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LFxuICAgICAgdHJhbnNsYXRlKHBhblggLyB0aGlzLnpvb21MZXZlbCwgcGFuWSAvIHRoaXMuem9vbUxldmVsKVxuICAgICk7XG5cbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb20gYnkgYSBmYWN0b3JcbiAgICpcbiAgICovXG4gIHpvb20oZmFjdG9yOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHNjYWxlKGZhY3RvciwgZmFjdG9yKSk7XG4gICAgdGhpcy56b29tQ2hhbmdlLmVtaXQodGhpcy56b29tTGV2ZWwpO1xuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gIH1cblxuICB6b29tSW4oKTogdm9pZCB7XG4gICAgdGhpcy56b29tKDEgKyB0aGlzLnpvb21TcGVlZCk7XG4gIH1cblxuICB6b29tT3V0KCk6IHZvaWQge1xuICAgIHRoaXMuem9vbSgxIC0gdGhpcy56b29tU3BlZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb20gdG8gYSBmaXhlZCBsZXZlbFxuICAgKlxuICAgKi9cbiAgem9vbVRvKGxldmVsOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmEgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmEgOiBOdW1iZXIobGV2ZWwpO1xuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA6IE51bWJlcihsZXZlbCk7XG4gICAgdGhpcy56b29tQ2hhbmdlLmVtaXQodGhpcy56b29tTGV2ZWwpO1xuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gIH1cblxuICAvKipcbiAgICogUGFuIHdhcyBpbnZva2VkIGZyb20gZXZlbnRcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvblBhbihldmVudCk6IHZvaWQge1xuICAgIHRoaXMucGFuKGV2ZW50Lm1vdmVtZW50WCwgZXZlbnQubW92ZW1lbnRZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmFnIHdhcyBpbnZva2VkIGZyb20gYW4gZXZlbnRcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvbkRyYWcoZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmRyYWdnaW5nTm9kZTtcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWcpIHtcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZyhub2RlLCBldmVudCk7XG4gICAgfVxuXG4gICAgbm9kZS5wb3NpdGlvbi54ICs9IGV2ZW50Lm1vdmVtZW50WCAvIHRoaXMuem9vbUxldmVsO1xuICAgIG5vZGUucG9zaXRpb24ueSArPSBldmVudC5tb3ZlbWVudFkgLyB0aGlzLnpvb21MZXZlbDtcblxuICAgIC8vIG1vdmUgdGhlIG5vZGVcbiAgICBjb25zdCB4ID0gbm9kZS5wb3NpdGlvbi54IC0gbm9kZS5kaW1lbnNpb24ud2lkdGggLyAyO1xuICAgIGNvbnN0IHkgPSBub2RlLnBvc2l0aW9uLnkgLSBub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyO1xuICAgIG5vZGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3h9LCAke3l9KWA7XG5cbiAgICBmb3IgKGNvbnN0IGxpbmsgb2YgdGhpcy5ncmFwaC5lZGdlcykge1xuICAgICAgaWYgKFxuICAgICAgICBsaW5rLnRhcmdldCA9PT0gbm9kZS5pZCB8fFxuICAgICAgICBsaW5rLnNvdXJjZSA9PT0gbm9kZS5pZCB8fFxuICAgICAgICAobGluay50YXJnZXQgYXMgYW55KS5pZCA9PT0gbm9kZS5pZCB8fFxuICAgICAgICAobGluay5zb3VyY2UgYXMgYW55KS5pZCA9PT0gbm9kZS5pZFxuICAgICAgKSB7XG4gICAgICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQudXBkYXRlRWRnZSh0aGlzLmdyYXBoLCBsaW5rKTtcbiAgICAgICAgICBjb25zdCByZXN1bHQkID0gcmVzdWx0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSA/IHJlc3VsdCA6IG9mKHJlc3VsdCk7XG4gICAgICAgICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICAgICAgICByZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICAgICAgICAgICAgdGhpcy5yZWRyYXdFZGdlKGxpbmspO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZWRyYXdMaW5lcyhmYWxzZSk7XG4gIH1cblxuICByZWRyYXdFZGdlKGVkZ2U6IEVkZ2UpIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUoZWRnZS5wb2ludHMpO1xuICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUoZWRnZSk7XG4gICAgZWRnZS5vbGRMaW5lID0gZWRnZS5saW5lO1xuICAgIGVkZ2UubGluZSA9IGxpbmU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBlbnRpcmUgdmlldyBmb3IgdGhlIG5ldyBwYW4gcG9zaXRpb25cbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICB1cGRhdGVUcmFuc2Zvcm0oKTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2Zvcm0gPSB0b1NWRyh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb2RlIHdhcyBjbGlja2VkXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25DbGljayhldmVudCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vZGUgd2FzIGZvY3VzZWRcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvbkFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlRW50cmllcy5pbmRleE9mKGV2ZW50KSA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtldmVudCwgLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb2RlIHdhcyBkZWZvY3VzZWRcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvbkRlYWN0aXZhdGUoZXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCk7XG5cbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XG5cbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBldmVudCwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZG9tYWluIHNlcmllcyBmb3IgdGhlIG5vZGVzXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgZ2V0U2VyaWVzRG9tYWluKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlc1xuICAgICAgLm1hcChkID0+IHRoaXMuZ3JvdXBSZXN1bHRzQnkoZCkpXG4gICAgICAucmVkdWNlKChub2Rlczogc3RyaW5nW10sIG5vZGUpOiBhbnlbXSA9PiAobm9kZXMuaW5kZXhPZihub2RlKSAhPT0gLTEgPyBub2RlcyA6IG5vZGVzLmNvbmNhdChbbm9kZV0pKSwgW10pXG4gICAgICAuc29ydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbGlua1xuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIHRyYWNrTGlua0J5KGluZGV4LCBsaW5rKTogYW55IHtcbiAgICByZXR1cm4gbGluay5pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFja2luZyBmb3IgdGhlIG5vZGVcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICB0cmFja05vZGVCeShpbmRleCwgbm9kZSk6IGFueSB7XG4gICAgcmV0dXJuIG5vZGUuaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY29sb3JzIHRoZSBub2Rlc1xuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIHNldENvbG9ycygpOiB2b2lkIHtcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgJ29yZGluYWwnLCB0aGlzLnNlcmllc0RvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxlZ2VuZCBvcHRpb25zXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgZ2V0TGVnZW5kT3B0aW9ucygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBzY2FsZVR5cGU6ICdvcmRpbmFsJyxcbiAgICAgIGRvbWFpbjogdGhpcy5zZXJpZXNEb21haW4sXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBtb3VzZSBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nIGFuZCBkcmFnZ2luZy5cbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZW1vdmUnLCBbJyRldmVudCddKVxuICBvbk1vdXNlTW92ZSgkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xuICAgICAgdGhpcy5vblBhbigkZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XG4gICAgICB0aGlzLm9uRHJhZygkZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPbiB0b3VjaCBzdGFydCBldmVudCB0byBlbmFibGUgcGFubmluZy5cbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICB0aGlzLl90b3VjaExhc3RYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICB0aGlzLl90b3VjaExhc3RZID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcblxuICAgIHRoaXMuaXNQYW5uaW5nID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiB0b3VjaCBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nLlxuICAgKlxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2htb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Ub3VjaE1vdmUoJGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNQYW5uaW5nICYmIHRoaXMucGFubmluZ0VuYWJsZWQpIHtcbiAgICAgIGNvbnN0IGNsaWVudFggPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgIGNvbnN0IGNsaWVudFkgPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgIGNvbnN0IG1vdmVtZW50WCA9IGNsaWVudFggLSB0aGlzLl90b3VjaExhc3RYO1xuICAgICAgY29uc3QgbW92ZW1lbnRZID0gY2xpZW50WSAtIHRoaXMuX3RvdWNoTGFzdFk7XG4gICAgICB0aGlzLl90b3VjaExhc3RYID0gY2xpZW50WDtcbiAgICAgIHRoaXMuX3RvdWNoTGFzdFkgPSBjbGllbnRZO1xuXG4gICAgICB0aGlzLnBhbihtb3ZlbWVudFgsIG1vdmVtZW50WSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIHRvdWNoIGVuZCBldmVudCB0byBkaXNhYmxlIHBhbm5pbmcuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25Ub3VjaEVuZChldmVudCkge1xuICAgIHRoaXMuaXNQYW5uaW5nID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogT24gbW91c2UgdXAgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nL2RyYWdnaW5nLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnKVxuICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCkge1xuICAgICAgdGhpcy5sYXlvdXQub25EcmFnRW5kKHRoaXMuZHJhZ2dpbmdOb2RlLCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIG5vZGUgbW91c2UgZG93biB0byBraWNrIG9mZiBkcmFnZ2luZ1xuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uTm9kZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCwgbm9kZTogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuZHJhZ2dpbmdOb2RlID0gbm9kZTtcblxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KSB7XG4gICAgICB0aGlzLmxheW91dC5vbkRyYWdTdGFydChub2RlLCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENlbnRlciB0aGUgZ3JhcGggaW4gdGhlIHZpZXdwb3J0XG4gICAqL1xuICBjZW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5wYW5Ubyh0aGlzLmdyYXBoRGltcy53aWR0aCAvIDIsIHRoaXMuZ3JhcGhEaW1zLmhlaWdodCAvIDIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb21zIHRvIGZpdCB0aGUgZW50aWVyIGdyYXBoXG4gICAqL1xuICB6b29tVG9GaXQoKTogdm9pZCB7XG4gICAgY29uc3QgaGVpZ2h0Wm9vbSA9IHRoaXMuZGltcy5oZWlnaHQgLyB0aGlzLmdyYXBoRGltcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGhab29tID0gdGhpcy5kaW1zLndpZHRoIC8gdGhpcy5ncmFwaERpbXMud2lkdGg7XG4gICAgY29uc3Qgem9vbUxldmVsID0gTWF0aC5taW4oaGVpZ2h0Wm9vbSwgd2lkdGhab29tLCAxKTtcblxuICAgIGlmICh6b29tTGV2ZWwgPD0gdGhpcy5taW5ab29tTGV2ZWwgfHwgem9vbUxldmVsID49IHRoaXMubWF4Wm9vbUxldmVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh6b29tTGV2ZWwgIT09IHRoaXMuem9vbUxldmVsKSB7XG4gICAgICB0aGlzLnpvb21MZXZlbCA9IHpvb21MZXZlbDtcbiAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICB0aGlzLnpvb21DaGFuZ2UuZW1pdCh0aGlzLnpvb21MZXZlbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBhbnMgdG8gdGhlIG5vZGVcbiAgICogQHBhcmFtIG5vZGVJZCBcbiAgICovXG4gIHBhblRvTm9kZUlkKG5vZGVJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5vZGVJZCk7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wYW5Ubyhub2RlLnBvc2l0aW9uLngsIG5vZGUucG9zaXRpb24ueSk7XG4gIH1cbn1cbiJdfQ==