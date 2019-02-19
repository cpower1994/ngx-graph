import { layout, graphlib } from 'dagre';
import * as d3Force from 'd3-force';
import { forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { Subject, Observable, Subscription, of } from 'rxjs';
import { d3adaptor } from 'webcola';
import * as d3Dispatch from 'd3-dispatch';
import * as d3Timer from 'd3-timer';
import { Injectable, ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewChildren, ViewEncapsulation, NgZone, ChangeDetectorRef, Directive, NgModule } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { BaseChartComponent, ChartComponent, ColorHelper, calculateViewDimensions, ChartCommonModule, NgxChartsModule } from '@swimlane/ngx-charts';
import { select } from 'd3-selection';
import { curveBundle, line } from 'd3-shape';
import 'd3-transition';
import { first } from 'rxjs/operators';
import { identity, scale, toSVG, transform, translate } from 'transformation-matrix';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const cache = {};
/**
 * Generates a short id.
 *
 * @return {?}
 */
function id() {
    /** @type {?} */
    let newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    newId = `a${newId}`;
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
const Orientation = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
class DagreLayout {
    constructor() {
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
    run(graph) {
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        for (const dagreNodeId in this.dagreGraph._nodes) {
            /** @type {?} */
            const dagreNode = this.dagreGraph._nodes[dagreNodeId];
            /** @type {?} */
            const node = graph.nodes.find(n => n.id === dagreNode.id);
            node.position = {
                x: dagreNode.x,
                y: dagreNode.y
            };
            node.dimension = {
                width: dagreNode.width,
                height: dagreNode.height
            };
        }
        return graph;
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        /** @type {?} */
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        // determine new arrow position
        /** @type {?} */
        const dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        /** @type {?} */
        const startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
        };
        /** @type {?} */
        const endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
        };
        // generate new points
        edge.points = [startingPoint, endingPoint];
        return graph;
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    createDagreGraph(graph) {
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
        this.dagreGraph = new graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
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
        this.dagreGraph.setDefaultEdgeLabel(() => {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map(n => {
            /** @type {?} */
            const node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreEdges = graph.edges.map(l => {
            /** @type {?} */
            const newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        for (const node of this.dagreNodes) {
            if (!node.width) {
                node.width = 20;
            }
            if (!node.height) {
                node.height = 30;
            }
            // update dagre
            this.dagreGraph.setNode(node.id, node);
        }
        // update dagre
        for (const edge of this.dagreEdges) {
            if (settings.multigraph) {
                this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
            }
            else {
                this.dagreGraph.setEdge(edge.source, edge.target);
            }
        }
        return this.dagreGraph;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class DagreClusterLayout {
    constructor() {
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
    run(graph) {
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        /** @type {?} */
        const dagreToOutput = node => {
            /** @type {?} */
            const dagreNode = this.dagreGraph._nodes[node.id];
            return Object.assign({}, node, { position: {
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
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        /** @type {?} */
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        // determine new arrow position
        /** @type {?} */
        const dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        /** @type {?} */
        const startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
        };
        /** @type {?} */
        const endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
        };
        // generate new points
        edge.points = [startingPoint, endingPoint];
        return graph;
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    createDagreGraph(graph) {
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
        this.dagreGraph = new graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
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
        this.dagreGraph.setDefaultEdgeLabel(() => {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map((n) => {
            /** @type {?} */
            const node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreClusters = graph.clusters || [];
        this.dagreEdges = graph.edges.map(l => {
            /** @type {?} */
            const newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        for (const node of this.dagreNodes) {
            this.dagreGraph.setNode(node.id, node);
        }
        for (const cluster of this.dagreClusters) {
            this.dagreGraph.setNode(cluster.id, cluster);
            cluster.childNodeIds.forEach(childNodeId => {
                this.dagreGraph.setParent(childNodeId, cluster.id);
            });
        }
        // update dagre
        for (const edge of this.dagreEdges) {
            if (settings.multigraph) {
                this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
            }
            else {
                this.dagreGraph.setEdge(edge.source, edge.target);
            }
        }
        return this.dagreGraph;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const Orientation$1 = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
/** @type {?} */
const DEFAULT_EDGE_NAME = '\x00';
/** @type {?} */
const EDGE_KEY_DELIM = '\x01';
class DagreNodesOnlyLayout {
    constructor() {
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
    run(graph) {
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        for (const dagreNodeId in this.dagreGraph._nodes) {
            /** @type {?} */
            const dagreNode = this.dagreGraph._nodes[dagreNodeId];
            /** @type {?} */
            const node = graph.nodes.find(n => n.id === dagreNode.id);
            node.position = {
                x: dagreNode.x,
                y: dagreNode.y
            };
            node.dimension = {
                width: dagreNode.width,
                height: dagreNode.height
            };
        }
        for (const edge of graph.edges) {
            this.updateEdge(graph, edge);
        }
        return graph;
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        /** @type {?} */
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        /** @type {?} */
        const rankAxis = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x';
        /** @type {?} */
        const orderAxis = rankAxis === 'y' ? 'x' : 'y';
        /** @type {?} */
        const rankDimension = rankAxis === 'y' ? 'height' : 'width';
        // determine new arrow position
        /** @type {?} */
        const dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
        /** @type {?} */
        const startingPoint = {
            [orderAxis]: sourceNode.position[orderAxis],
            [rankAxis]: sourceNode.position[rankAxis] - dir * (sourceNode.dimension[rankDimension] / 2)
        };
        /** @type {?} */
        const endingPoint = {
            [orderAxis]: targetNode.position[orderAxis],
            [rankAxis]: targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2)
        };
        /** @type {?} */
        const curveDistance = this.settings.curveDistance || this.defaultSettings.curveDistance;
        // generate new points
        edge.points = [
            startingPoint,
            {
                [orderAxis]: startingPoint[orderAxis],
                [rankAxis]: startingPoint[rankAxis] - dir * curveDistance
            },
            {
                [orderAxis]: endingPoint[orderAxis],
                [rankAxis]: endingPoint[rankAxis] + dir * curveDistance
            },
            endingPoint
        ];
        /** @type {?} */
        const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;
        /** @type {?} */
        const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
        if (matchingEdgeLabel) {
            matchingEdgeLabel.points = edge.points;
        }
        return graph;
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    createDagreGraph(graph) {
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
        this.dagreGraph = new graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
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
        this.dagreGraph.setDefaultEdgeLabel(() => {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map(n => {
            /** @type {?} */
            const node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreEdges = graph.edges.map(l => {
            /** @type {?} */
            const newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        for (const node of this.dagreNodes) {
            if (!node.width) {
                node.width = 20;
            }
            if (!node.height) {
                node.height = 30;
            }
            // update dagre
            this.dagreGraph.setNode(node.id, node);
        }
        // update dagre
        for (const edge of this.dagreEdges) {
            if (settings.multigraph) {
                this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
            }
            else {
                this.dagreGraph.setEdge(edge.source, edge.target);
            }
        }
        return this.dagreGraph;
    }
}

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
class D3ForceDirectedLayout {
    constructor() {
        this.defaultSettings = {
            force: forceSimulation()
                .force('charge', forceManyBody().strength(-150))
                .force('collide', forceCollide(5)),
            forceLink: forceLink()
                .id(node => node.id)
                .distance(() => 100)
        };
        this.settings = {};
        this.outputGraph$ = new Subject();
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    run(graph) {
        this.inputGraph = graph;
        this.d3Graph = {
            nodes: (/** @type {?} */ ([...this.inputGraph.nodes.map(n => (Object.assign({}, n)))])),
            edges: (/** @type {?} */ ([...this.inputGraph.edges.map(e => (Object.assign({}, e)))]))
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
                .on('tick', () => {
                this.outputGraph$.next(this.d3GraphToOutputGraph(this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
        if (settings.force) {
            settings.force
                .nodes(this.d3Graph.nodes)
                .force('link', settings.forceLink.links(this.d3Graph.edges))
                .alpha(0.5)
                .restart()
                .on('tick', () => {
                this.outputGraph$.next(this.d3GraphToOutputGraph(this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    }
    /**
     * @param {?} d3Graph
     * @return {?}
     */
    d3GraphToOutputGraph(d3Graph) {
        this.outputGraph.nodes = this.d3Graph.nodes.map((node) => (Object.assign({}, node, { id: node.id || id(), position: {
                x: node.x,
                y: node.y
            }, dimension: {
                width: (node.dimension && node.dimension.width) || 20,
                height: (node.dimension && node.dimension.height) || 20
            }, transform: `translate(${node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0}, ${node.y -
                ((node.dimension && node.dimension.height) || 20) / 2 || 0})` })));
        this.outputGraph.edges = this.d3Graph.edges.map(edge => (Object.assign({}, edge, { source: toD3Node(edge.source).id, target: toD3Node(edge.target).id, points: [
                {
                    x: toD3Node(edge.source).x,
                    y: toD3Node(edge.source).y
                },
                {
                    x: toD3Node(edge.target).x,
                    y: toD3Node(edge.target).y
                }
            ] })));
        this.outputGraph.edgeLabels = this.outputGraph.edges;
        return this.outputGraph;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDragStart(draggingNode, $event) {
        this.settings.force.alphaTarget(0.3).restart();
        /** @type {?} */
        const node = this.d3Graph.nodes.find(d3Node => d3Node.id === draggingNode.id);
        if (!node) {
            return;
        }
        this.draggingStart = { x: $event.x - node.x, y: $event.y - node.y };
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDrag(draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        const node = this.d3Graph.nodes.find(d3Node => d3Node.id === draggingNode.id);
        if (!node) {
            return;
        }
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDragEnd(draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        const node = this.d3Graph.nodes.find(d3Node => d3Node.id === draggingNode.id);
        if (!node) {
            return;
        }
        this.settings.force.alphaTarget(0);
        node.fx = undefined;
        node.fy = undefined;
    }
}

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
class ColaForceDirectedLayout {
    constructor() {
        this.defaultSettings = {
            force: d3adaptor(Object.assign({}, d3Dispatch, d3Force, d3Timer))
                .linkDistance(150)
                .avoidOverlaps(true),
            viewDimensions: {
                width: 600,
                height: 600,
                xOffset: 0
            }
        };
        this.settings = {};
        this.outputGraph$ = new Subject();
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    run(graph) {
        this.inputGraph = graph;
        if (!this.inputGraph.clusters) {
            this.inputGraph.clusters = [];
        }
        this.internalGraph = {
            nodes: (/** @type {?} */ ([
                ...this.inputGraph.nodes.map(n => (Object.assign({}, n, { width: n.dimension ? n.dimension.width : 20, height: n.dimension ? n.dimension.height : 20 })))
            ])),
            groups: [
                ...this.inputGraph.clusters.map((cluster) => ({
                    padding: 5,
                    groups: cluster.childNodeIds
                        .map(nodeId => (/** @type {?} */ (this.inputGraph.clusters.findIndex(node => node.id === nodeId))))
                        .filter(x => x >= 0),
                    leaves: cluster.childNodeIds
                        .map(nodeId => (/** @type {?} */ (this.inputGraph.nodes.findIndex(node => node.id === nodeId))))
                        .filter(x => x >= 0)
                }))
            ],
            links: (/** @type {?} */ ([
                ...this.inputGraph.edges
                    .map(e => {
                    /** @type {?} */
                    const sourceNodeIndex = this.inputGraph.nodes.findIndex(node => e.source === node.id);
                    /** @type {?} */
                    const targetNodeIndex = this.inputGraph.nodes.findIndex(node => e.target === node.id);
                    if (sourceNodeIndex === -1 || targetNodeIndex === -1) {
                        return undefined;
                    }
                    return Object.assign({}, e, { source: sourceNodeIndex, target: targetNodeIndex });
                })
                    .filter(x => !!x)
            ])),
            groupLinks: [
                ...this.inputGraph.edges
                    .map(e => {
                    /** @type {?} */
                    const sourceNodeIndex = this.inputGraph.nodes.findIndex(node => e.source === node.id);
                    /** @type {?} */
                    const targetNodeIndex = this.inputGraph.nodes.findIndex(node => e.target === node.id);
                    if (sourceNodeIndex >= 0 && targetNodeIndex >= 0) {
                        return undefined;
                    }
                    return e;
                })
                    .filter(x => !!x)
            ]
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
                .on('tick', () => {
                if (this.settings.onTickListener) {
                    this.settings.onTickListener(this.internalGraph);
                }
                this.outputGraph$.next(this.internalGraphToOutputGraph(this.internalGraph));
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
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
        if (settings.force) {
            settings.force.start();
        }
        return this.outputGraph$.asObservable();
    }
    /**
     * @param {?} internalGraph
     * @return {?}
     */
    internalGraphToOutputGraph(internalGraph) {
        this.outputGraph.nodes = internalGraph.nodes.map(node => (Object.assign({}, node, { id: node.id || id(), position: {
                x: node.x,
                y: node.y
            }, dimension: {
                width: (node.dimension && node.dimension.width) || 20,
                height: (node.dimension && node.dimension.height) || 20
            }, transform: `translate(${node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0}, ${node.y -
                ((node.dimension && node.dimension.height) || 20) / 2 || 0})` })));
        this.outputGraph.edges = internalGraph.links
            .map(edge => {
            /** @type {?} */
            const source = toNode(internalGraph.nodes, edge.source);
            /** @type {?} */
            const target = toNode(internalGraph.nodes, edge.target);
            return Object.assign({}, edge, { source: source.id, target: target.id, points: [
                    ((/** @type {?} */ (source.bounds))).rayIntersection(target.bounds.cx(), target.bounds.cy()),
                    ((/** @type {?} */ (target.bounds))).rayIntersection(source.bounds.cx(), source.bounds.cy())
                ] });
        })
            .concat(internalGraph.groupLinks.map(groupLink => {
            /** @type {?} */
            const sourceNode = internalGraph.nodes.find(foundNode => ((/** @type {?} */ (foundNode))).id === groupLink.source);
            /** @type {?} */
            const targetNode = internalGraph.nodes.find(foundNode => ((/** @type {?} */ (foundNode))).id === groupLink.target);
            /** @type {?} */
            const source = sourceNode || internalGraph.groups.find(foundGroup => ((/** @type {?} */ (foundGroup))).id === groupLink.source);
            /** @type {?} */
            const target = targetNode || internalGraph.groups.find(foundGroup => ((/** @type {?} */ (foundGroup))).id === groupLink.target);
            return Object.assign({}, groupLink, { source: source.id, target: target.id, points: [
                    ((/** @type {?} */ (source.bounds))).rayIntersection(target.bounds.cx(), target.bounds.cy()),
                    ((/** @type {?} */ (target.bounds))).rayIntersection(source.bounds.cx(), source.bounds.cy())
                ] });
        }));
        this.outputGraph.clusters = internalGraph.groups.map((group, index) => {
            /** @type {?} */
            const inputGroup = this.inputGraph.clusters[index];
            return Object.assign({}, inputGroup, { dimension: {
                    width: group.bounds ? group.bounds.width() : 20,
                    height: group.bounds ? group.bounds.height() : 20
                }, position: {
                    x: group.bounds ? group.bounds.x + group.bounds.width() / 2 : 0,
                    y: group.bounds ? group.bounds.y + group.bounds.height() / 2 : 0
                } });
        });
        this.outputGraph.edgeLabels = this.outputGraph.edges;
        return this.outputGraph;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDragStart(draggingNode, $event) {
        /** @type {?} */
        const nodeIndex = this.outputGraph.nodes.findIndex(foundNode => foundNode.id === draggingNode.id);
        /** @type {?} */
        const node = this.internalGraph.nodes[nodeIndex];
        if (!node) {
            return;
        }
        this.draggingStart = { x: node.x - $event.x, y: node.y - $event.y };
        node.fixed = 1;
        this.settings.force.start();
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDrag(draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        const nodeIndex = this.outputGraph.nodes.findIndex(foundNode => foundNode.id === draggingNode.id);
        /** @type {?} */
        const node = this.internalGraph.nodes[nodeIndex];
        if (!node) {
            return;
        }
        node.x = this.draggingStart.x + $event.x;
        node.y = this.draggingStart.y + $event.y;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDragEnd(draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        const nodeIndex = this.outputGraph.nodes.findIndex(foundNode => foundNode.id === draggingNode.id);
        /** @type {?} */
        const node = this.internalGraph.nodes[nodeIndex];
        if (!node) {
            return;
        }
        node.fixed = 0;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const layouts = {
    dagre: DagreLayout,
    dagreCluster: DagreClusterLayout,
    dagreNodesOnly: DagreNodesOnlyLayout,
    d3ForceDirected: D3ForceDirectedLayout,
    colaForceDirected: ColaForceDirectedLayout
};
class LayoutService {
    /**
     * @param {?} name
     * @return {?}
     */
    getLayout(name) {
        if (layouts[name]) {
            return new layouts[name]();
        }
        else {
            throw new Error(`Unknown layout type '${name}'`);
        }
    }
}
LayoutService.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GraphComponent extends BaseChartComponent {
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
        const { layout: layout$$1, layoutSettings, nodes, clusters, links } = changes;
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
    setLayout(layout$$1) {
        this.initialized = false;
        if (!layout$$1) {
            layout$$1 = 'dagre';
        }
        if (typeof layout$$1 === 'string') {
            this.layout = this.layoutService.getLayout(layout$$1);
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
            this.curve = curveBundle.beta(1);
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
            const line$$1 = this.generateLine(points);
            /** @type {?} */
            const newLink = Object.assign({}, oldLink);
            newLink.line = line$$1;
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
        const lineFunction = line()
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
        const line$$1 = this.generateLine(edge.points);
        this.calcDominantBaseline(edge);
        edge.oldLine = edge.line;
        edge.line = line$$1;
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
                animations: [trigger('link', [transition('* => *', [animate(500, style({ transform: '*' }))])])]
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
class MouseWheelDirective {
    constructor() {
        this.mouseWheelUp = new EventEmitter();
        this.mouseWheelDown = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelChrome(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelFirefox(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelIE(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    mouseWheelFunc(event) {
        if (window.event) {
            event = window.event;
        }
        /** @type {?} */
        const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
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
    }
}
MouseWheelDirective.decorators = [
    { type: Directive, args: [{ selector: '[mouseWheel]' },] },
];
MouseWheelDirective.propDecorators = {
    mouseWheelUp: [{ type: Output }],
    mouseWheelDown: [{ type: Output }],
    onMouseWheelChrome: [{ type: HostListener, args: ['mousewheel', ['$event'],] }],
    onMouseWheelFirefox: [{ type: HostListener, args: ['DOMMouseScroll', ['$event'],] }],
    onMouseWheelIE: [{ type: HostListener, args: ['onmousewheel', ['$event'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GraphModule {
}
GraphModule.decorators = [
    { type: NgModule, args: [{
                imports: [ChartCommonModule],
                declarations: [GraphComponent, MouseWheelDirective],
                exports: [GraphComponent, MouseWheelDirective],
                providers: [LayoutService]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxGraphModule {
}
NgxGraphModule.decorators = [
    { type: NgModule, args: [{
                imports: [NgxChartsModule],
                exports: [GraphModule]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxGraphModule, GraphComponent as ɵa, GraphModule as ɵb, LayoutService as ɵc, MouseWheelDirective as ɵd };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWdyYXBoLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi91dGlscy9pZC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZUNsdXN0ZXIudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZDNGb3JjZURpcmVjdGVkLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9sYXlvdXRzL2NvbGFGb3JjZURpcmVjdGVkLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9sYXlvdXRzL2xheW91dC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL21vdXNlLXdoZWVsLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvZ3JhcGgubW9kdWxlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9uZ3gtZ3JhcGgubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNhY2hlID0ge307XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgc2hvcnQgaWQuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaWQoKTogc3RyaW5nIHtcbiAgbGV0IG5ld0lkID0gKCcwMDAwJyArICgoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDM2LCA0KSkgPDwgMCkudG9TdHJpbmcoMzYpKS5zbGljZSgtNCk7XG5cbiAgbmV3SWQgPSBgYSR7bmV3SWR9YDtcblxuICAvLyBlbnN1cmUgbm90IGFscmVhZHkgdXNlZFxuICBpZiAoIWNhY2hlW25ld0lkXSkge1xuICAgIGNhY2hlW25ld0lkXSA9IHRydWU7XG4gICAgcmV0dXJuIG5ld0lkO1xuICB9XG5cbiAgcmV0dXJuIGlkKCk7XG59XG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcblxuZXhwb3J0IGVudW0gT3JpZW50YXRpb24ge1xuICBMRUZUX1RPX1JJR0hUID0gJ0xSJyxcbiAgUklHSFRfVE9fTEVGVCA9ICdSTCcsXG4gIFRPUF9UT19CT1RUT00gPSAnVEInLFxuICBCT1RUT01fVE9fVE9NID0gJ0JUJ1xufVxuZXhwb3J0IGVudW0gQWxpZ25tZW50IHtcbiAgQ0VOVEVSID0gJ0MnLFxuICBVUF9MRUZUID0gJ1VMJyxcbiAgVVBfUklHSFQgPSAnVVInLFxuICBET1dOX0xFRlQgPSAnREwnLFxuICBET1dOX1JJR0hUID0gJ0RSJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlU2V0dGluZ3Mge1xuICBvcmllbnRhdGlvbj86IE9yaWVudGF0aW9uO1xuICBtYXJnaW5YPzogbnVtYmVyO1xuICBtYXJnaW5ZPzogbnVtYmVyO1xuICBlZGdlUGFkZGluZz86IG51bWJlcjtcbiAgcmFua1BhZGRpbmc/OiBudW1iZXI7XG4gIG5vZGVQYWRkaW5nPzogbnVtYmVyO1xuICBhbGlnbj86IEFsaWdubWVudDtcbiAgYWN5Y2xpY2VyPzogJ2dyZWVkeScgfCB1bmRlZmluZWQ7XG4gIHJhbmtlcj86ICduZXR3b3JrLXNpbXBsZXgnIHwgJ3RpZ2h0LXRyZWUnIHwgJ2xvbmdlc3QtcGF0aCc7XG4gIG11bHRpZ3JhcGg/OiBib29sZWFuO1xuICBjb21wb3VuZD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBEYWdyZUxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHtcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcbiAgICBtYXJnaW5YOiAyMCxcbiAgICBtYXJnaW5ZOiAyMCxcbiAgICBlZGdlUGFkZGluZzogMTAwLFxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXG4gICAgbm9kZVBhZGRpbmc6IDUwLFxuICAgIG11bHRpZ3JhcGg6IHRydWUsXG4gICAgY29tcG91bmQ6IHRydWVcbiAgfTtcbiAgc2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7fTtcblxuICBkYWdyZUdyYXBoOiBhbnk7XG4gIGRhZ3JlTm9kZXM6IGFueTtcbiAgZGFncmVFZGdlczogYW55O1xuXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcblxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XG5cbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbZGFncmVOb2RlSWRdO1xuICAgICAgY29uc3Qgbm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBkYWdyZU5vZGUuaWQpO1xuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgeDogZGFncmVOb2RlLngsXG4gICAgICAgIHk6IGRhZ3JlTm9kZS55XG4gICAgICB9O1xuICAgICAgbm9kZS5kaW1lbnNpb24gPSB7XG4gICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcblxuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ID8gLTEgOiAxO1xuICAgIGNvbnN0IHN0YXJ0aW5nUG9pbnQgPSB7XG4gICAgICB4OiBzb3VyY2VOb2RlLnBvc2l0aW9uLngsXG4gICAgICB5OiBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgLSBkaXIgKiAoc291cmNlTm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcbiAgICB9O1xuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xuICAgICAgeDogdGFyZ2V0Tm9kZS5wb3NpdGlvbi54LFxuICAgICAgeTogdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXG4gICAgfTtcblxuICAgIC8vIGdlbmVyYXRlIG5ldyBwb2ludHNcbiAgICBlZGdlLnBvaW50cyA9IFtzdGFydGluZ1BvaW50LCBlbmRpbmdQb2ludF07XG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCh7Y29tcG91bmQ6IHNldHRpbmdzLmNvbXBvdW5kLCBtdWx0aWdyYXBoOiBzZXR0aW5ncy5tdWx0aWdyYXBofSk7XG4gICAgXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyLFxuICAgICAgbXVsdGlncmFwaDogc2V0dGluZ3MubXVsdGlncmFwaCxcbiAgICAgIGNvbXBvdW5kOiBzZXR0aW5ncy5jb21wb3VuZFxuICAgIH0pO1xuXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLyogZW1wdHkgKi9cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAobiA9PiB7XG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XG4gICAgICBjb25zdCBuZXdMaW5rOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdMaW5rO1xuICAgIH0pO1xuXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xuICAgICAgaWYgKCFub2RlLndpZHRoKSB7XG4gICAgICAgIG5vZGUud2lkdGggPSAyMDtcbiAgICAgIH1cbiAgICAgIGlmICghbm9kZS5oZWlnaHQpIHtcbiAgICAgICAgbm9kZS5oZWlnaHQgPSAzMDtcbiAgICAgIH1cblxuICAgICAgLy8gdXBkYXRlIGRhZ3JlXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZGFncmVcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgdGhpcy5kYWdyZUVkZ2VzKSB7XG4gICAgICBpZiAoc2V0dGluZ3MubXVsdGlncmFwaCkge1xuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQsIGVkZ2UsIGVkZ2UuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xuICB9XG59XG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcbmltcG9ydCB7IE5vZGUsIENsdXN0ZXJOb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL25vZGUubW9kZWwnO1xuaW1wb3J0IHsgRGFncmVTZXR0aW5ncywgT3JpZW50YXRpb24gfSBmcm9tICcuL2RhZ3JlJztcblxuZXhwb3J0IGNsYXNzIERhZ3JlQ2x1c3RlckxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHtcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcbiAgICBtYXJnaW5YOiAyMCxcbiAgICBtYXJnaW5ZOiAyMCxcbiAgICBlZGdlUGFkZGluZzogMTAwLFxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXG4gICAgbm9kZVBhZGRpbmc6IDUwLFxuICAgIG11bHRpZ3JhcGg6IHRydWUsXG4gICAgY29tcG91bmQ6IHRydWVcbiAgfTtcbiAgc2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7fTtcblxuICBkYWdyZUdyYXBoOiBhbnk7XG4gIGRhZ3JlTm9kZXM6IE5vZGVbXTtcbiAgZGFncmVDbHVzdGVyczogQ2x1c3Rlck5vZGVbXTtcbiAgZGFncmVFZGdlczogYW55O1xuXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcblxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XG5cbiAgICBjb25zdCBkYWdyZVRvT3V0cHV0ID0gbm9kZSA9PiB7XG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW25vZGUuaWRdO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ubm9kZSxcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICB4OiBkYWdyZU5vZGUueCxcbiAgICAgICAgICB5OiBkYWdyZU5vZGUueVxuICAgICAgICB9LFxuICAgICAgICBkaW1lbnNpb246IHtcbiAgICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gICAgZ3JhcGguY2x1c3RlcnMgPSAoZ3JhcGguY2x1c3RlcnMgfHwgW10pLm1hcChkYWdyZVRvT3V0cHV0KTtcbiAgICBncmFwaC5ub2RlcyA9IGdyYXBoLm5vZGVzLm1hcChkYWdyZVRvT3V0cHV0KTtcblxuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xuXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb24ueSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgPyAtMSA6IDE7XG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcbiAgICAgIHg6IHNvdXJjZU5vZGUucG9zaXRpb24ueCxcbiAgICAgIHk6IHNvdXJjZU5vZGUucG9zaXRpb24ueSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxuICAgIH07XG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XG4gICAgICB4OiB0YXJnZXROb2RlLnBvc2l0aW9uLngsXG4gICAgICB5OiB0YXJnZXROb2RlLnBvc2l0aW9uLnkgKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcbiAgICB9O1xuXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xuICAgIGVkZ2UucG9pbnRzID0gW3N0YXJ0aW5nUG9pbnQsIGVuZGluZ1BvaW50XTtcbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKHsgY29tcG91bmQ6IHNldHRpbmdzLmNvbXBvdW5kLCBtdWx0aWdyYXBoOiBzZXR0aW5ncy5tdWx0aWdyYXBoIH0pO1xuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlcixcbiAgICAgIG11bHRpZ3JhcGg6IHNldHRpbmdzLm11bHRpZ3JhcGgsXG4gICAgICBjb21wb3VuZDogc2V0dGluZ3MuY29tcG91bmRcbiAgICB9KTtcblxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8qIGVtcHR5ICovXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKChuOiBOb2RlKSA9PiB7XG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhZ3JlQ2x1c3RlcnMgPSBncmFwaC5jbHVzdGVycyB8fCBbXTtcblxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0xpbms7XG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNsdXN0ZXIgb2YgdGhpcy5kYWdyZUNsdXN0ZXJzKSB7XG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShjbHVzdGVyLmlkLCBjbHVzdGVyKTtcbiAgICAgIGNsdXN0ZXIuY2hpbGROb2RlSWRzLmZvckVhY2goY2hpbGROb2RlSWQgPT4ge1xuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0UGFyZW50KGNoaWxkTm9kZUlkLCBjbHVzdGVyLmlkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYWdyZVxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5tdWx0aWdyYXBoKSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCwgZWRnZSwgZWRnZS5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XG4gIH1cbn1cbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuXG5leHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XG4gIExFRlRfVE9fUklHSFQgPSAnTFInLFxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcbiAgVE9QX1RPX0JPVFRPTSA9ICdUQicsXG4gIEJPVFRPTV9UT19UT00gPSAnQlQnXG59XG5leHBvcnQgZW51bSBBbGlnbm1lbnQge1xuICBDRU5URVIgPSAnQycsXG4gIFVQX0xFRlQgPSAnVUwnLFxuICBVUF9SSUdIVCA9ICdVUicsXG4gIERPV05fTEVGVCA9ICdETCcsXG4gIERPV05fUklHSFQgPSAnRFInXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XG4gIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb247XG4gIG1hcmdpblg/OiBudW1iZXI7XG4gIG1hcmdpblk/OiBudW1iZXI7XG4gIGVkZ2VQYWRkaW5nPzogbnVtYmVyO1xuICByYW5rUGFkZGluZz86IG51bWJlcjtcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XG4gIGFsaWduPzogQWxpZ25tZW50O1xuICBhY3ljbGljZXI/OiAnZ3JlZWR5JyB8IHVuZGVmaW5lZDtcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcbiAgbXVsdGlncmFwaD86IGJvb2xlYW47XG4gIGNvbXBvdW5kPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEYWdyZU5vZGVzT25seVNldHRpbmdzIGV4dGVuZHMgRGFncmVTZXR0aW5ncyB7XG4gIGN1cnZlRGlzdGFuY2U/OiBudW1iZXI7XG59XG5cbmNvbnN0IERFRkFVTFRfRURHRV9OQU1FID0gJ1xceDAwJztcbmNvbnN0IEdSQVBIX05PREUgPSAnXFx4MDAnO1xuY29uc3QgRURHRV9LRVlfREVMSU0gPSAnXFx4MDEnO1xuXG5leHBvcnQgY2xhc3MgRGFncmVOb2Rlc09ubHlMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7XG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXG4gICAgbWFyZ2luWDogMjAsXG4gICAgbWFyZ2luWTogMjAsXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcbiAgICByYW5rUGFkZGluZzogMTAwLFxuICAgIG5vZGVQYWRkaW5nOiA1MCxcbiAgICBjdXJ2ZURpc3RhbmNlOiAyMCxcbiAgICBtdWx0aWdyYXBoOiB0cnVlLFxuICAgIGNvbXBvdW5kOiB0cnVlXG4gIH07XG4gIHNldHRpbmdzOiBEYWdyZU5vZGVzT25seVNldHRpbmdzID0ge307XG5cbiAgZGFncmVHcmFwaDogYW55O1xuICBkYWdyZU5vZGVzOiBhbnk7XG4gIGRhZ3JlRWRnZXM6IGFueTtcblxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XG5cbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xuXG4gICAgZm9yIChjb25zdCBkYWdyZU5vZGVJZCBpbiB0aGlzLmRhZ3JlR3JhcGguX25vZGVzKSB7XG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW2RhZ3JlTm9kZUlkXTtcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcbiAgICAgIG5vZGUucG9zaXRpb24gPSB7XG4gICAgICAgIHg6IGRhZ3JlTm9kZS54LFxuICAgICAgICB5OiBkYWdyZU5vZGUueVxuICAgICAgfTtcbiAgICAgIG5vZGUuZGltZW5zaW9uID0ge1xuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRhZ3JlTm9kZS5oZWlnaHRcbiAgICAgIH07XG4gICAgfVxuICAgIGZvciAoY29uc3QgZWRnZSBvZiBncmFwaC5lZGdlcykge1xuICAgICAgdGhpcy51cGRhdGVFZGdlKGdyYXBoLCBlZGdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcbiAgICBjb25zdCByYW5rQXhpczogJ3gnIHwgJ3knID0gdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ0JUJyB8fCB0aGlzLnNldHRpbmdzLm9yaWVudGF0aW9uID09PSAnVEInID8gJ3knIDogJ3gnO1xuICAgIGNvbnN0IG9yZGVyQXhpczogJ3gnIHwgJ3knID0gcmFua0F4aXMgPT09ICd5JyA/ICd4JyA6ICd5JztcbiAgICBjb25zdCByYW5rRGltZW5zaW9uID0gcmFua0F4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPyAtMSA6IDE7XG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcbiAgICAgIFtvcmRlckF4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXG4gICAgICBbcmFua0F4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXG4gICAgfTtcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcbiAgICAgIFtvcmRlckF4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXG4gICAgICBbcmFua0F4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXG4gICAgfTtcblxuICAgIGNvbnN0IGN1cnZlRGlzdGFuY2UgPSB0aGlzLnNldHRpbmdzLmN1cnZlRGlzdGFuY2UgfHwgdGhpcy5kZWZhdWx0U2V0dGluZ3MuY3VydmVEaXN0YW5jZTtcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXG4gICAgZWRnZS5wb2ludHMgPSBbXG4gICAgICBzdGFydGluZ1BvaW50LFxuICAgICAge1xuICAgICAgICBbb3JkZXJBeGlzXTogc3RhcnRpbmdQb2ludFtvcmRlckF4aXNdLFxuICAgICAgICBbcmFua0F4aXNdOiBzdGFydGluZ1BvaW50W3JhbmtBeGlzXSAtIGRpciAqIGN1cnZlRGlzdGFuY2VcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFtvcmRlckF4aXNdOiBlbmRpbmdQb2ludFtvcmRlckF4aXNdLFxuICAgICAgICBbcmFua0F4aXNdOiBlbmRpbmdQb2ludFtyYW5rQXhpc10gKyBkaXIgKiBjdXJ2ZURpc3RhbmNlXG4gICAgICB9LFxuICAgICAgZW5kaW5nUG9pbnRcbiAgICBdO1xuICAgIGNvbnN0IGVkZ2VMYWJlbElkID0gYCR7ZWRnZS5zb3VyY2V9JHtFREdFX0tFWV9ERUxJTX0ke2VkZ2UudGFyZ2V0fSR7RURHRV9LRVlfREVMSU19JHtERUZBVUxUX0VER0VfTkFNRX1gO1xuICAgIGNvbnN0IG1hdGNoaW5nRWRnZUxhYmVsID0gZ3JhcGguZWRnZUxhYmVsc1tlZGdlTGFiZWxJZF07XG4gICAgaWYgKG1hdGNoaW5nRWRnZUxhYmVsKSB7XG4gICAgICBtYXRjaGluZ0VkZ2VMYWJlbC5wb2ludHMgPSBlZGdlLnBvaW50cztcbiAgICB9XG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCh7IGNvbXBvdW5kOiBzZXR0aW5ncy5jb21wb3VuZCwgbXVsdGlncmFwaDogc2V0dGluZ3MubXVsdGlncmFwaCB9KTtcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXIsXG4gICAgICBtdWx0aWdyYXBoOiBzZXR0aW5ncy5tdWx0aWdyYXBoLFxuICAgICAgY29tcG91bmQ6IHNldHRpbmdzLmNvbXBvdW5kXG4gICAgfSk7XG5cbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvKiBlbXB0eSAqL1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0xpbms7XG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcbiAgICAgICAgbm9kZS53aWR0aCA9IDIwO1xuICAgICAgfVxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xuICAgICAgICBub2RlLmhlaWdodCA9IDMwO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgZGFncmVcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYWdyZVxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5tdWx0aWdyYXBoKSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCwgZWRnZSwgZWRnZS5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XG4gIH1cbn1cbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xuaW1wb3J0IHsgZm9yY2VDb2xsaWRlLCBmb3JjZUxpbmssIGZvcmNlTWFueUJvZHksIGZvcmNlU2ltdWxhdGlvbiB9IGZyb20gJ2QzLWZvcmNlJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRDNGb3JjZURpcmVjdGVkU2V0dGluZ3Mge1xuICBmb3JjZT86IGFueTtcbiAgZm9yY2VMaW5rPzogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBEM05vZGUge1xuICBpZD86IHN0cmluZztcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIGZ4PzogbnVtYmVyO1xuICBmeT86IG51bWJlcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRDNFZGdlIHtcbiAgc291cmNlOiBzdHJpbmcgfCBEM05vZGU7XG4gIHRhcmdldDogc3RyaW5nIHwgRDNOb2RlO1xufVxuZXhwb3J0IGludGVyZmFjZSBEM0dyYXBoIHtcbiAgbm9kZXM6IEQzTm9kZVtdO1xuICBlZGdlczogRDNFZGdlW107XG59XG5leHBvcnQgaW50ZXJmYWNlIE1lcmdlZE5vZGUgZXh0ZW5kcyBEM05vZGUsIE5vZGUge1xuICBpZDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9EM05vZGUobWF5YmVOb2RlOiBzdHJpbmcgfCBEM05vZGUpOiBEM05vZGUge1xuICBpZiAodHlwZW9mIG1heWJlTm9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IG1heWJlTm9kZSxcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuICByZXR1cm4gbWF5YmVOb2RlO1xufVxuXG5leHBvcnQgY2xhc3MgRDNGb3JjZURpcmVjdGVkTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcbiAgZGVmYXVsdFNldHRpbmdzOiBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHtcbiAgICBmb3JjZTogZm9yY2VTaW11bGF0aW9uPGFueT4oKVxuICAgICAgLmZvcmNlKCdjaGFyZ2UnLCBmb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoLTE1MCkpXG4gICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBmb3JjZUNvbGxpZGUoNSkpLFxuICAgIGZvcmNlTGluazogZm9yY2VMaW5rPGFueSwgYW55PigpXG4gICAgICAuaWQobm9kZSA9PiBub2RlLmlkKVxuICAgICAgLmRpc3RhbmNlKCgpID0+IDEwMClcbiAgfTtcbiAgc2V0dGluZ3M6IEQzRm9yY2VEaXJlY3RlZFNldHRpbmdzID0ge307XG5cbiAgaW5wdXRHcmFwaDogR3JhcGg7XG4gIG91dHB1dEdyYXBoOiBHcmFwaDtcbiAgZDNHcmFwaDogRDNHcmFwaDtcbiAgb3V0cHV0R3JhcGgkOiBTdWJqZWN0PEdyYXBoPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgZHJhZ2dpbmdTdGFydDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xuXG4gIHJ1bihncmFwaDogR3JhcGgpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XG4gICAgdGhpcy5pbnB1dEdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5kM0dyYXBoID0ge1xuICAgICAgbm9kZXM6IFsuLi50aGlzLmlucHV0R3JhcGgubm9kZXMubWFwKG4gPT4gKHsgLi4ubiB9KSldIGFzIGFueSxcbiAgICAgIGVkZ2VzOiBbLi4udGhpcy5pbnB1dEdyYXBoLmVkZ2VzLm1hcChlID0+ICh7IC4uLmUgfSkpXSBhcyBhbnlcbiAgICB9O1xuICAgIHRoaXMub3V0cHV0R3JhcGggPSB7XG4gICAgICBub2RlczogW10sXG4gICAgICBlZGdlczogW10sXG4gICAgICBlZGdlTGFiZWxzOiBbXVxuICAgIH07XG4gICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLm91dHB1dEdyYXBoKTtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvcmNlKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmZvcmNlXG4gICAgICAgIC5ub2Rlcyh0aGlzLmQzR3JhcGgubm9kZXMpXG4gICAgICAgIC5mb3JjZSgnbGluaycsIHRoaXMuc2V0dGluZ3MuZm9yY2VMaW5rLmxpbmtzKHRoaXMuZDNHcmFwaC5lZGdlcykpXG4gICAgICAgIC5hbHBoYSgwLjUpXG4gICAgICAgIC5yZXN0YXJ0KClcbiAgICAgICAgLm9uKCd0aWNrJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5kM0dyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmQzR3JhcGgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKHNldHRpbmdzLmZvcmNlKSB7XG4gICAgICBzZXR0aW5ncy5mb3JjZVxuICAgICAgICAubm9kZXModGhpcy5kM0dyYXBoLm5vZGVzKVxuICAgICAgICAuZm9yY2UoJ2xpbmsnLCBzZXR0aW5ncy5mb3JjZUxpbmsubGlua3ModGhpcy5kM0dyYXBoLmVkZ2VzKSlcbiAgICAgICAgLmFscGhhKDAuNSlcbiAgICAgICAgLnJlc3RhcnQoKVxuICAgICAgICAub24oJ3RpY2snLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLmQzR3JhcGhUb091dHB1dEdyYXBoKHRoaXMuZDNHcmFwaCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBkM0dyYXBoVG9PdXRwdXRHcmFwaChkM0dyYXBoOiBEM0dyYXBoKTogR3JhcGgge1xuICAgIHRoaXMub3V0cHV0R3JhcGgubm9kZXMgPSB0aGlzLmQzR3JhcGgubm9kZXMubWFwKChub2RlOiBNZXJnZWROb2RlKSA9PiAoe1xuICAgICAgLi4ubm9kZSxcbiAgICAgIGlkOiBub2RlLmlkIHx8IGlkKCksXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiBub2RlLngsXG4gICAgICAgIHk6IG5vZGUueVxuICAgICAgfSxcbiAgICAgIGRpbWVuc2lvbjoge1xuICAgICAgICB3aWR0aDogKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCxcbiAgICAgICAgaGVpZ2h0OiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMFxuICAgICAgfSxcbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke25vZGUueCAtICgobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwKSAvIDIgfHwgMH0sICR7bm9kZS55IC1cbiAgICAgICAgKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwKSAvIDIgfHwgMH0pYFxuICAgIH0pKTtcblxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZXMgPSB0aGlzLmQzR3JhcGguZWRnZXMubWFwKGVkZ2UgPT4gKHtcbiAgICAgIC4uLmVkZ2UsXG4gICAgICBzb3VyY2U6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS5pZCxcbiAgICAgIHRhcmdldDogdG9EM05vZGUoZWRnZS50YXJnZXQpLmlkLFxuICAgICAgcG9pbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB4OiB0b0QzTm9kZShlZGdlLnNvdXJjZSkueCxcbiAgICAgICAgICB5OiB0b0QzTm9kZShlZGdlLnNvdXJjZSkueVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgeDogdG9EM05vZGUoZWRnZS50YXJnZXQpLngsXG4gICAgICAgICAgeTogdG9EM05vZGUoZWRnZS50YXJnZXQpLnlcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pKTtcblxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZUxhYmVscyA9IHRoaXMub3V0cHV0R3JhcGguZWRnZXM7XG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGg7XG4gIH1cblxuICBvbkRyYWdTdGFydChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UuYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZHJhZ2dpbmdTdGFydCA9IHsgeDogJGV2ZW50LnggLSBub2RlLngsIHk6ICRldmVudC55IC0gbm9kZS55IH07XG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XG4gICAgbm9kZS5meSA9ICRldmVudC55IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lnk7XG4gIH1cblxuICBvbkRyYWcoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XG4gICAgbm9kZS5meSA9ICRldmVudC55IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lnk7XG4gIH1cblxuICBvbkRyYWdFbmQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldHRpbmdzLmZvcmNlLmFscGhhVGFyZ2V0KDApO1xuICAgIG5vZGUuZnggPSB1bmRlZmluZWQ7XG4gICAgbm9kZS5meSA9IHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xuaW1wb3J0IHsgZDNhZGFwdG9yLCBJRDNTdHlsZUxheW91dEFkYXB0b3IsIExheW91dCBhcyBDb2xhTGF5b3V0LCBHcm91cCwgSW5wdXROb2RlLCBMaW5rLCBSZWN0YW5nbGUgfSBmcm9tICd3ZWJjb2xhJztcbmltcG9ydCAqIGFzIGQzRGlzcGF0Y2ggZnJvbSAnZDMtZGlzcGF0Y2gnO1xuaW1wb3J0ICogYXMgZDNGb3JjZSBmcm9tICdkMy1mb3JjZSc7XG5pbXBvcnQgKiBhcyBkM1RpbWVyIGZyb20gJ2QzLXRpbWVyJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBWaWV3RGltZW5zaW9ucyB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb2xhRm9yY2VEaXJlY3RlZFNldHRpbmdzIHtcbiAgZm9yY2U/OiBDb2xhTGF5b3V0ICYgSUQzU3R5bGVMYXlvdXRBZGFwdG9yO1xuICBmb3JjZU1vZGlmaWVyRm4/OiAoZm9yY2U6IENvbGFMYXlvdXQgJiBJRDNTdHlsZUxheW91dEFkYXB0b3IpID0+IENvbGFMYXlvdXQgJiBJRDNTdHlsZUxheW91dEFkYXB0b3I7XG4gIG9uVGlja0xpc3RlbmVyPzogKGludGVybmFsR3JhcGg6IENvbGFHcmFwaCkgPT4gdm9pZDtcbiAgdmlld0RpbWVuc2lvbnM/OiBWaWV3RGltZW5zaW9ucztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29sYUdyYXBoIHtcbiAgZ3JvdXBzOiBHcm91cFtdO1xuICBub2RlczogSW5wdXROb2RlW107XG4gIGxpbmtzOiBBcnJheTxMaW5rPG51bWJlcj4+O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvTm9kZShub2RlczogSW5wdXROb2RlW10sIG5vZGVSZWY6IElucHV0Tm9kZSB8IG51bWJlcik6IElucHV0Tm9kZSB7XG4gIGlmICh0eXBlb2Ygbm9kZVJlZiA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbm9kZXNbbm9kZVJlZl07XG4gIH1cbiAgcmV0dXJuIG5vZGVSZWY7XG59XG5cbmV4cG9ydCBjbGFzcyBDb2xhRm9yY2VEaXJlY3RlZExheW91dCBpbXBsZW1lbnRzIExheW91dCB7XG4gIGRlZmF1bHRTZXR0aW5nczogQ29sYUZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHtcbiAgICBmb3JjZTogZDNhZGFwdG9yKHtcbiAgICAgIC4uLmQzRGlzcGF0Y2gsXG4gICAgICAuLi5kM0ZvcmNlLFxuICAgICAgLi4uZDNUaW1lclxuICAgIH0pXG4gICAgICAubGlua0Rpc3RhbmNlKDE1MClcbiAgICAgIC5hdm9pZE92ZXJsYXBzKHRydWUpLFxuICAgIHZpZXdEaW1lbnNpb25zOiB7XG4gICAgICB3aWR0aDogNjAwLFxuICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICB4T2Zmc2V0OiAwXG4gICAgfVxuICB9O1xuICBzZXR0aW5nczogQ29sYUZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHt9O1xuXG4gIGlucHV0R3JhcGg6IEdyYXBoO1xuICBvdXRwdXRHcmFwaDogR3JhcGg7XG4gIGludGVybmFsR3JhcGg6IENvbGFHcmFwaCAmIHsgZ3JvdXBMaW5rcz86IEVkZ2VbXSB9O1xuICBvdXRwdXRHcmFwaCQ6IFN1YmplY3Q8R3JhcGg+ID0gbmV3IFN1YmplY3QoKTtcblxuICBkcmFnZ2luZ1N0YXJ0OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH07XG5cbiAgcnVuKGdyYXBoOiBHcmFwaCk6IE9ic2VydmFibGU8R3JhcGg+IHtcbiAgICB0aGlzLmlucHV0R3JhcGggPSBncmFwaDtcbiAgICBpZiAoIXRoaXMuaW5wdXRHcmFwaC5jbHVzdGVycykge1xuICAgICAgdGhpcy5pbnB1dEdyYXBoLmNsdXN0ZXJzID0gW107XG4gICAgfVxuICAgIHRoaXMuaW50ZXJuYWxHcmFwaCA9IHtcbiAgICAgIG5vZGVzOiBbXG4gICAgICAgIC4uLnRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5tYXAobiA9PiAoe1xuICAgICAgICAgIC4uLm4sXG4gICAgICAgICAgd2lkdGg6IG4uZGltZW5zaW9uID8gbi5kaW1lbnNpb24ud2lkdGggOiAyMCxcbiAgICAgICAgICBoZWlnaHQ6IG4uZGltZW5zaW9uID8gbi5kaW1lbnNpb24uaGVpZ2h0IDogMjBcbiAgICAgICAgfSkpXG4gICAgICBdIGFzIGFueSxcbiAgICAgIGdyb3VwczogW1xuICAgICAgICAuLi50aGlzLmlucHV0R3JhcGguY2x1c3RlcnMubWFwKFxuICAgICAgICAgIChjbHVzdGVyKTogR3JvdXAgPT4gKHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDUsXG4gICAgICAgICAgICBncm91cHM6IGNsdXN0ZXIuY2hpbGROb2RlSWRzXG4gICAgICAgICAgICAgIC5tYXAobm9kZUlkID0+IDxhbnk+dGhpcy5pbnB1dEdyYXBoLmNsdXN0ZXJzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZCkpXG4gICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4ID49IDApLFxuICAgICAgICAgICAgbGVhdmVzOiBjbHVzdGVyLmNoaWxkTm9kZUlkc1xuICAgICAgICAgICAgICAubWFwKG5vZGVJZCA9PiA8YW55PnRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBub2RlSWQpKVxuICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geCA+PSAwKVxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgIF0sXG4gICAgICBsaW5rczogW1xuICAgICAgICAuLi50aGlzLmlucHV0R3JhcGguZWRnZXNcbiAgICAgICAgICAubWFwKGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlTm9kZUluZGV4ID0gdGhpcy5pbnB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChub2RlID0+IGUuc291cmNlID09PSBub2RlLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGVJbmRleCA9IHRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgobm9kZSA9PiBlLnRhcmdldCA9PT0gbm9kZS5pZCk7XG4gICAgICAgICAgICBpZiAoc291cmNlTm9kZUluZGV4ID09PSAtMSB8fCB0YXJnZXROb2RlSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5lLFxuICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZU5vZGVJbmRleCxcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXROb2RlSW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKHggPT4gISF4KVxuICAgICAgXSBhcyBhbnksXG4gICAgICBncm91cExpbmtzOiBbXG4gICAgICAgIC4uLnRoaXMuaW5wdXRHcmFwaC5lZGdlc1xuICAgICAgICAgIC5tYXAoZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VOb2RlSW5kZXggPSB0aGlzLmlucHV0R3JhcGgubm9kZXMuZmluZEluZGV4KG5vZGUgPT4gZS5zb3VyY2UgPT09IG5vZGUuaWQpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZUluZGV4ID0gdGhpcy5pbnB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChub2RlID0+IGUudGFyZ2V0ID09PSBub2RlLmlkKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VOb2RlSW5kZXggPj0gMCAmJiB0YXJnZXROb2RlSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKHggPT4gISF4KVxuICAgICAgXVxuICAgIH07XG4gICAgdGhpcy5vdXRwdXRHcmFwaCA9IHtcbiAgICAgIG5vZGVzOiBbXSxcbiAgICAgIGNsdXN0ZXJzOiBbXSxcbiAgICAgIGVkZ2VzOiBbXSxcbiAgICAgIGVkZ2VMYWJlbHM6IFtdXG4gICAgfTtcbiAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMub3V0cHV0R3JhcGgpO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZm9yY2UpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UgPSB0aGlzLnNldHRpbmdzLmZvcmNlXG4gICAgICAgIC5ub2Rlcyh0aGlzLmludGVybmFsR3JhcGgubm9kZXMpXG4gICAgICAgIC5ncm91cHModGhpcy5pbnRlcm5hbEdyYXBoLmdyb3VwcylcbiAgICAgICAgLmxpbmtzKHRoaXMuaW50ZXJuYWxHcmFwaC5saW5rcylcbiAgICAgICAgLmFscGhhKDAuNSlcbiAgICAgICAgLm9uKCd0aWNrJywgKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm9uVGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLm9uVGlja0xpc3RlbmVyKHRoaXMuaW50ZXJuYWxHcmFwaCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5pbnRlcm5hbEdyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmludGVybmFsR3JhcGgpKTtcbiAgICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy52aWV3RGltZW5zaW9ucykge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmZvcmNlID0gdGhpcy5zZXR0aW5ncy5mb3JjZS5zaXplKFtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnZpZXdEaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3Mudmlld0RpbWVuc2lvbnMuaGVpZ2h0XG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZm9yY2VNb2RpZmllckZuKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UgPSB0aGlzLnNldHRpbmdzLmZvcmNlTW9kaWZpZXJGbih0aGlzLnNldHRpbmdzLmZvcmNlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2Uuc3RhcnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IE9ic2VydmFibGU8R3JhcGg+IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICBpZiAoc2V0dGluZ3MuZm9yY2UpIHtcbiAgICAgIHNldHRpbmdzLmZvcmNlLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgaW50ZXJuYWxHcmFwaFRvT3V0cHV0R3JhcGgoaW50ZXJuYWxHcmFwaDogYW55KTogR3JhcGgge1xuICAgIHRoaXMub3V0cHV0R3JhcGgubm9kZXMgPSBpbnRlcm5hbEdyYXBoLm5vZGVzLm1hcChub2RlID0+ICh7XG4gICAgICAuLi5ub2RlLFxuICAgICAgaWQ6IG5vZGUuaWQgfHwgaWQoKSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IG5vZGUueCxcbiAgICAgICAgeTogbm9kZS55XG4gICAgICB9LFxuICAgICAgZGltZW5zaW9uOiB7XG4gICAgICAgIHdpZHRoOiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwLFxuICAgICAgICBoZWlnaHQ6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwXG4gICAgICB9LFxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7bm9kZS54IC0gKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjApIC8gMiB8fCAwfSwgJHtub2RlLnkgLVxuICAgICAgICAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLmhlaWdodCkgfHwgMjApIC8gMiB8fCAwfSlgXG4gICAgfSkpO1xuXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlcyA9IGludGVybmFsR3JhcGgubGlua3NcbiAgICAgIC5tYXAoZWRnZSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZTogYW55ID0gdG9Ob2RlKGludGVybmFsR3JhcGgubm9kZXMsIGVkZ2Uuc291cmNlKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0OiBhbnkgPSB0b05vZGUoaW50ZXJuYWxHcmFwaC5ub2RlcywgZWRnZS50YXJnZXQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmVkZ2UsXG4gICAgICAgICAgc291cmNlOiBzb3VyY2UuaWQsXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQuaWQsXG4gICAgICAgICAgcG9pbnRzOiBbXG4gICAgICAgICAgICAoc291cmNlLmJvdW5kcyBhcyBSZWN0YW5nbGUpLnJheUludGVyc2VjdGlvbih0YXJnZXQuYm91bmRzLmN4KCksIHRhcmdldC5ib3VuZHMuY3koKSksXG4gICAgICAgICAgICAodGFyZ2V0LmJvdW5kcyBhcyBSZWN0YW5nbGUpLnJheUludGVyc2VjdGlvbihzb3VyY2UuYm91bmRzLmN4KCksIHNvdXJjZS5ib3VuZHMuY3koKSlcbiAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICAgLmNvbmNhdChcbiAgICAgICAgaW50ZXJuYWxHcmFwaC5ncm91cExpbmtzLm1hcChncm91cExpbmsgPT4ge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBpbnRlcm5hbEdyYXBoLm5vZGVzLmZpbmQoZm91bmROb2RlID0+IChmb3VuZE5vZGUgYXMgYW55KS5pZCA9PT0gZ3JvdXBMaW5rLnNvdXJjZSk7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGludGVybmFsR3JhcGgubm9kZXMuZmluZChmb3VuZE5vZGUgPT4gKGZvdW5kTm9kZSBhcyBhbnkpLmlkID09PSBncm91cExpbmsudGFyZ2V0KTtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPVxuICAgICAgICAgICAgc291cmNlTm9kZSB8fCBpbnRlcm5hbEdyYXBoLmdyb3Vwcy5maW5kKGZvdW5kR3JvdXAgPT4gKGZvdW5kR3JvdXAgYXMgYW55KS5pZCA9PT0gZ3JvdXBMaW5rLnNvdXJjZSk7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID1cbiAgICAgICAgICAgIHRhcmdldE5vZGUgfHwgaW50ZXJuYWxHcmFwaC5ncm91cHMuZmluZChmb3VuZEdyb3VwID0+IChmb3VuZEdyb3VwIGFzIGFueSkuaWQgPT09IGdyb3VwTGluay50YXJnZXQpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5ncm91cExpbmssXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZS5pZCxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LmlkLFxuICAgICAgICAgICAgcG9pbnRzOiBbXG4gICAgICAgICAgICAgIChzb3VyY2UuYm91bmRzIGFzIFJlY3RhbmdsZSkucmF5SW50ZXJzZWN0aW9uKHRhcmdldC5ib3VuZHMuY3goKSwgdGFyZ2V0LmJvdW5kcy5jeSgpKSxcbiAgICAgICAgICAgICAgKHRhcmdldC5ib3VuZHMgYXMgUmVjdGFuZ2xlKS5yYXlJbnRlcnNlY3Rpb24oc291cmNlLmJvdW5kcy5jeCgpLCBzb3VyY2UuYm91bmRzLmN5KCkpXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICB0aGlzLm91dHB1dEdyYXBoLmNsdXN0ZXJzID0gaW50ZXJuYWxHcmFwaC5ncm91cHMubWFwKFxuICAgICAgKGdyb3VwLCBpbmRleCk6IENsdXN0ZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXRHcm91cCA9IHRoaXMuaW5wdXRHcmFwaC5jbHVzdGVyc1tpbmRleF07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaW5wdXRHcm91cCxcbiAgICAgICAgICBkaW1lbnNpb246IHtcbiAgICAgICAgICAgIHdpZHRoOiBncm91cC5ib3VuZHMgPyBncm91cC5ib3VuZHMud2lkdGgoKSA6IDIwLFxuICAgICAgICAgICAgaGVpZ2h0OiBncm91cC5ib3VuZHMgPyBncm91cC5ib3VuZHMuaGVpZ2h0KCkgOiAyMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgIHg6IGdyb3VwLmJvdW5kcyA/IGdyb3VwLmJvdW5kcy54ICsgZ3JvdXAuYm91bmRzLndpZHRoKCkgLyAyIDogMCxcbiAgICAgICAgICAgIHk6IGdyb3VwLmJvdW5kcyA/IGdyb3VwLmJvdW5kcy55ICsgZ3JvdXAuYm91bmRzLmhlaWdodCgpIC8gMiA6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLm91dHB1dEdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLm91dHB1dEdyYXBoLmVkZ2VzO1xuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoO1xuICB9XG5cbiAgb25EcmFnU3RhcnQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm91dHB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChmb3VuZE5vZGUgPT4gZm91bmROb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmludGVybmFsR3JhcGgubm9kZXNbbm9kZUluZGV4XTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kcmFnZ2luZ1N0YXJ0ID0geyB4OiBub2RlLnggLSAkZXZlbnQueCwgeTogbm9kZS55IC0gJGV2ZW50LnkgfTtcbiAgICBub2RlLmZpeGVkID0gMTtcbiAgICB0aGlzLnNldHRpbmdzLmZvcmNlLnN0YXJ0KCk7XG4gIH1cblxuICBvbkRyYWcoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm91dHB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChmb3VuZE5vZGUgPT4gZm91bmROb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmludGVybmFsR3JhcGgubm9kZXNbbm9kZUluZGV4XTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS54ID0gdGhpcy5kcmFnZ2luZ1N0YXJ0LnggKyAkZXZlbnQueDtcbiAgICBub2RlLnkgPSB0aGlzLmRyYWdnaW5nU3RhcnQueSArICRldmVudC55O1xuICB9XG5cbiAgb25EcmFnRW5kKGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5vdXRwdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgoZm91bmROb2RlID0+IGZvdW5kTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBjb25zdCBub2RlID0gdGhpcy5pbnRlcm5hbEdyYXBoLm5vZGVzW25vZGVJbmRleF07XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5maXhlZCA9IDA7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgRGFncmVMYXlvdXQgfSBmcm9tICcuL2RhZ3JlJztcbmltcG9ydCB7IERhZ3JlQ2x1c3RlckxheW91dCB9IGZyb20gJy4vZGFncmVDbHVzdGVyJztcbmltcG9ydCB7IERhZ3JlTm9kZXNPbmx5TGF5b3V0IH0gZnJvbSAnLi9kYWdyZU5vZGVzT25seSc7XG5pbXBvcnQgeyBEM0ZvcmNlRGlyZWN0ZWRMYXlvdXQgfSBmcm9tICcuL2QzRm9yY2VEaXJlY3RlZCc7XG5pbXBvcnQgeyBDb2xhRm9yY2VEaXJlY3RlZExheW91dCB9IGZyb20gJy4vY29sYUZvcmNlRGlyZWN0ZWQnO1xuXG5jb25zdCBsYXlvdXRzID0ge1xuICBkYWdyZTogRGFncmVMYXlvdXQsXG4gIGRhZ3JlQ2x1c3RlcjogRGFncmVDbHVzdGVyTGF5b3V0LFxuICBkYWdyZU5vZGVzT25seTogRGFncmVOb2Rlc09ubHlMYXlvdXQsXG4gIGQzRm9yY2VEaXJlY3RlZDogRDNGb3JjZURpcmVjdGVkTGF5b3V0LFxuICBjb2xhRm9yY2VEaXJlY3RlZDogQ29sYUZvcmNlRGlyZWN0ZWRMYXlvdXRcbn07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMYXlvdXRTZXJ2aWNlIHtcbiAgZ2V0TGF5b3V0KG5hbWU6IHN0cmluZyk6IExheW91dCB7XG4gICAgaWYgKGxheW91dHNbbmFtZV0pIHtcbiAgICAgIHJldHVybiBuZXcgbGF5b3V0c1tuYW1lXSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbGF5b3V0IHR5cGUgJyR7bmFtZX0nYCk7XG4gICAgfVxuICB9XG59XG4iLCIvLyByZW5hbWUgdHJhbnNpdGlvbiBkdWUgdG8gY29uZmxpY3Qgd2l0aCBkMyB0cmFuc2l0aW9uXG5pbXBvcnQgeyBhbmltYXRlLCBzdHlsZSwgdHJhbnNpdGlvbiBhcyBuZ1RyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VDaGFydENvbXBvbmVudCxcbiAgQ2hhcnRDb21wb25lbnQsXG4gIENvbG9ySGVscGVyLFxuICBWaWV3RGltZW5zaW9ucyxcbiAgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnNcbn0gZnJvbSAnQHN3aW1sYW5lL25neC1jaGFydHMnO1xuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCAqIGFzIHNoYXBlIGZyb20gJ2QzLXNoYXBlJztcbmltcG9ydCAnZDMtdHJhbnNpdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlkZW50aXR5LCBzY2FsZSwgdG9TVkcsIHRyYW5zZm9ybSwgdHJhbnNsYXRlIH0gZnJvbSAndHJhbnNmb3JtYXRpb24tbWF0cml4JztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4vbGF5b3V0cy9sYXlvdXQuc2VydmljZSc7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi9tb2RlbHMvbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcblxuLyoqXG4gKiBNYXRyaXhcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRyaXgge1xuICBhOiBudW1iZXI7XG4gIGI6IG51bWJlcjtcbiAgYzogbnVtYmVyO1xuICBkOiBudW1iZXI7XG4gIGU6IG51bWJlcjtcbiAgZjogbnVtYmVyO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZ3JhcGgnLFxuICBzdHlsZXM6IFtgLmdyYXBoey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZ3JhcGggLmVkZ2V7c3Ryb2tlOiM2NjY7ZmlsbDpub25lfS5ncmFwaCAuZWRnZSAuZWRnZS1sYWJlbHtzdHJva2U6bm9uZTtmb250LXNpemU6MTJweDtmaWxsOiMyNTFlMWV9LmdyYXBoIC5wYW5uaW5nLXJlY3R7ZmlsbDp0cmFuc3BhcmVudDtjdXJzb3I6bW92ZTt3aWR0aDoxMDAwMDAwcHh9LmdyYXBoIC5ub2RlLWdyb3VwIC5ub2RlOmZvY3Vze291dGxpbmU6MH0uZ3JhcGggLmNsdXN0ZXIgcmVjdHtvcGFjaXR5Oi4yfWBdLFxuICB0ZW1wbGF0ZTogYDxuZ3gtY2hhcnRzLWNoYXJ0XG4gIFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiXG4gIFtzaG93TGVnZW5kXT1cImxlZ2VuZFwiXG4gIFtsZWdlbmRPcHRpb25zXT1cImxlZ2VuZE9wdGlvbnNcIlxuICAobGVnZW5kTGFiZWxDbGljayk9XCJvbkNsaWNrKCRldmVudClcIlxuICAobGVnZW5kTGFiZWxBY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxuICAobGVnZW5kTGFiZWxEZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCJcbiAgbW91c2VXaGVlbFxuICAobW91c2VXaGVlbFVwKT1cIm9uWm9vbSgkZXZlbnQsICdpbicpXCJcbiAgKG1vdXNlV2hlZWxEb3duKT1cIm9uWm9vbSgkZXZlbnQsICdvdXQnKVwiXG4+XG4gIDxzdmc6Z1xuICAgICpuZ0lmPVwiaW5pdGlhbGl6ZWQgJiYgZ3JhcGhcIlxuICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIlxuICAgICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQpXCJcbiAgICAodG91Y2hlbmQpPVwib25Ub3VjaEVuZCgkZXZlbnQpXCJcbiAgICBjbGFzcz1cImdyYXBoIGNoYXJ0XCJcbiAgPlxuICAgIDxkZWZzPlxuICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwiZGVmc1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGVmc1RlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxzdmc6cGF0aFxuICAgICAgICBjbGFzcz1cInRleHQtcGF0aFwiXG4gICAgICAgICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzXCJcbiAgICAgICAgW2F0dHIuZF09XCJsaW5rLnRleHRQYXRoXCJcbiAgICAgICAgW2F0dHIuaWRdPVwibGluay5pZFwiXG4gICAgICA+PC9zdmc6cGF0aD5cbiAgICA8L2RlZnM+XG4gICAgPHN2ZzpyZWN0XG4gICAgICBjbGFzcz1cInBhbm5pbmctcmVjdFwiXG4gICAgICBbYXR0ci53aWR0aF09XCJkaW1zLndpZHRoICogMTAwXCJcbiAgICAgIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodCAqIDEwMFwiXG4gICAgICBbYXR0ci50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZSgnICsgKC1kaW1zLndpZHRoIHx8IDApICogNTAgKyAnLCcgKyAoLWRpbXMuaGVpZ2h0IHx8IDApICogNTAgKyAnKSdcIlxuICAgICAgKG1vdXNlZG93bik9XCJpc1Bhbm5pbmcgPSB0cnVlXCJcbiAgICAvPlxuICAgIDxzdmc6ZyBjbGFzcz1cImNsdXN0ZXJzXCI+XG4gICAgICA8c3ZnOmdcbiAgICAgICAgI2NsdXN0ZXJFbGVtZW50XG4gICAgICAgICpuZ0Zvcj1cImxldCBub2RlIG9mIGdyYXBoLmNsdXN0ZXJzOyB0cmFja0J5OiB0cmFja05vZGVCeVwiXG4gICAgICAgIGNsYXNzPVwibm9kZS1ncm91cFwiXG4gICAgICAgIFtpZF09XCJub2RlLmlkXCJcbiAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cIm5vZGUudHJhbnNmb3JtXCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSlcIlxuICAgICAgPlxuICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAqbmdJZj1cImNsdXN0ZXJUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY2x1c3RlclRlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUgfVwiXG4gICAgICAgID48L25nLXRlbXBsYXRlPlxuICAgICAgICA8c3ZnOmcgKm5nSWY9XCIhY2x1c3RlclRlbXBsYXRlXCIgY2xhc3M9XCJub2RlIGNsdXN0ZXJcIj5cbiAgICAgICAgICA8c3ZnOnJlY3RcbiAgICAgICAgICAgIFthdHRyLndpZHRoXT1cIm5vZGUuZGltZW5zaW9uLndpZHRoXCJcbiAgICAgICAgICAgIFthdHRyLmhlaWdodF09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHRcIlxuICAgICAgICAgICAgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzdmc6dGV4dCBhbGlnbm1lbnQtYmFzZWxpbmU9XCJjZW50cmFsXCIgW2F0dHIueF09XCIxMFwiIFthdHRyLnldPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMlwiPlxuICAgICAgICAgICAge3sgbm9kZS5sYWJlbCB9fVxuICAgICAgICAgIDwvc3ZnOnRleHQ+XG4gICAgICAgIDwvc3ZnOmc+XG4gICAgICA8L3N2ZzpnPlxuICAgIDwvc3ZnOmc+XG4gICAgPHN2ZzpnIGNsYXNzPVwibGlua3NcIj5cbiAgICAgIDxzdmc6ZyAjbGlua0VsZW1lbnQgKm5nRm9yPVwibGV0IGxpbmsgb2YgZ3JhcGguZWRnZXM7IHRyYWNrQnk6IHRyYWNrTGlua0J5XCIgY2xhc3M9XCJsaW5rLWdyb3VwXCIgW2lkXT1cImxpbmsuaWRcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgKm5nSWY9XCJsaW5rVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxpbmtUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBsaW5rIH1cIlxuICAgICAgICA+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPHN2ZzpwYXRoICpuZ0lmPVwiIWxpbmtUZW1wbGF0ZVwiIGNsYXNzPVwiZWRnZVwiIFthdHRyLmRdPVwibGluay5saW5lXCIgLz5cbiAgICAgIDwvc3ZnOmc+XG4gICAgPC9zdmc6Zz5cbiAgICA8c3ZnOmcgY2xhc3M9XCJub2Rlc1wiPlxuICAgICAgPHN2ZzpnXG4gICAgICAgICNub2RlRWxlbWVudFxuICAgICAgICAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5ub2RlczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIlxuICAgICAgICBjbGFzcz1cIm5vZGUtZ3JvdXBcIlxuICAgICAgICBbaWRdPVwibm9kZS5pZFwiXG4gICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKG5vZGUpXCJcbiAgICAgICAgKG1vdXNlZG93bik9XCJvbk5vZGVNb3VzZURvd24oJGV2ZW50LCBub2RlKVwiXG4gICAgICA+XG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICpuZ0lmPVwibm9kZVRlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJub2RlVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCJcbiAgICAgICAgPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxzdmc6Y2lyY2xlXG4gICAgICAgICAgKm5nSWY9XCIhbm9kZVRlbXBsYXRlXCJcbiAgICAgICAgICByPVwiMTBcIlxuICAgICAgICAgIFthdHRyLmN4XT1cIm5vZGUuZGltZW5zaW9uLndpZHRoIC8gMlwiXG4gICAgICAgICAgW2F0dHIuY3ldPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMlwiXG4gICAgICAgICAgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCJcbiAgICAgICAgLz5cbiAgICAgIDwvc3ZnOmc+XG4gICAgPC9zdmc6Zz5cbiAgPC9zdmc6Zz5cbjwvbmd4LWNoYXJ0cy1jaGFydD5cbmAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBhbmltYXRpb25zOiBbdHJpZ2dlcignbGluaycsIFtuZ1RyYW5zaXRpb24oJyogPT4gKicsIFthbmltYXRlKDUwMCwgc3R5bGUoeyB0cmFuc2Zvcm06ICcqJyB9KSldKV0pXVxufSlcbmV4cG9ydCBjbGFzcyBHcmFwaENvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBsZWdlbmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgbm9kZXM6IE5vZGVbXSA9IFtdO1xuICBASW5wdXQoKSBjbHVzdGVyczogQ2x1c3Rlck5vZGVbXSA9IFtdO1xuICBASW5wdXQoKSBsaW5rczogRWRnZVtdID0gW107XG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XG4gIEBJbnB1dCgpIGN1cnZlOiBhbnk7XG4gIEBJbnB1dCgpIGRyYWdnaW5nRW5hYmxlZCA9IHRydWU7XG4gIEBJbnB1dCgpIG5vZGVIZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgbm9kZU1heEhlaWdodDogbnVtYmVyO1xuICBASW5wdXQoKSBub2RlTWluSGVpZ2h0OiBudW1iZXI7XG4gIEBJbnB1dCgpIG5vZGVXaWR0aDogbnVtYmVyO1xuICBASW5wdXQoKSBub2RlTWluV2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgbm9kZU1heFdpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIHBhbm5pbmdFbmFibGVkID0gdHJ1ZTtcbiAgQElucHV0KCkgZW5hYmxlWm9vbSA9IHRydWU7XG4gIEBJbnB1dCgpIHpvb21TcGVlZCA9IDAuMTtcbiAgQElucHV0KCkgbWluWm9vbUxldmVsID0gMC4xO1xuICBASW5wdXQoKSBtYXhab29tTGV2ZWwgPSA0LjA7XG4gIEBJbnB1dCgpIGF1dG9ab29tID0gZmFsc2U7XG4gIEBJbnB1dCgpIHBhbk9uWm9vbSA9IHRydWU7XG4gIEBJbnB1dCgpIGF1dG9DZW50ZXIgPSBmYWxzZTtcbiAgQElucHV0KCkgdXBkYXRlJDogT2JzZXJ2YWJsZTxhbnk+O1xuICBASW5wdXQoKSBjZW50ZXIkOiBPYnNlcnZhYmxlPGFueT47XG4gIEBJbnB1dCgpIHpvb21Ub0ZpdCQ6IE9ic2VydmFibGU8YW55PjtcbiAgQElucHV0KCkgcGFuVG9Ob2RlJDogT2JzZXJ2YWJsZTxhbnk+O1xuICBASW5wdXQoKSBsYXlvdXQ6IHN0cmluZyB8IExheW91dDtcbiAgQElucHV0KCkgbGF5b3V0U2V0dGluZ3M6IGFueTtcblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSB6b29tQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAQ29udGVudENoaWxkKCdsaW5rVGVtcGxhdGUnKSBsaW5rVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoJ25vZGVUZW1wbGF0ZScpIG5vZGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZCgnY2x1c3RlclRlbXBsYXRlJykgY2x1c3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKCdkZWZzVGVtcGxhdGUnKSBkZWZzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQFZpZXdDaGlsZChDaGFydENvbXBvbmVudCwgeyByZWFkOiBFbGVtZW50UmVmIH0pIGNoYXJ0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkcmVuKCdub2RlRWxlbWVudCcpIG5vZGVFbGVtZW50czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBAVmlld0NoaWxkcmVuKCdsaW5rRWxlbWVudCcpIGxpbmtFbGVtZW50czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuXG4gIGdyYXBoU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xuICBtYXJnaW4gPSBbMCwgMCwgMCwgMF07XG4gIHJlc3VsdHMgPSBbXTtcbiAgc2VyaWVzRG9tYWluOiBhbnk7XG4gIHRyYW5zZm9ybTogc3RyaW5nO1xuICBsZWdlbmRPcHRpb25zOiBhbnk7XG4gIGlzUGFubmluZyA9IGZhbHNlO1xuICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gIGRyYWdnaW5nTm9kZTogTm9kZTtcbiAgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgZ3JhcGg6IEdyYXBoO1xuICBncmFwaERpbXM6IGFueSA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xuICBfb2xkTGlua3M6IEVkZ2VbXSA9IFtdO1xuICB0cmFuc2Zvcm1hdGlvbk1hdHJpeDogTWF0cml4ID0gaWRlbnRpdHkoKTtcbiAgX3RvdWNoTGFzdFggPSBudWxsO1xuICBfdG91Y2hMYXN0WSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgem9uZTogTmdab25lLFxuICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBsYXlvdXRTZXJ2aWNlOiBMYXlvdXRTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKGVsLCB6b25lLCBjZCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBncm91cFJlc3VsdHNCeTogKG5vZGU6IGFueSkgPT4gc3RyaW5nID0gbm9kZSA9PiBub2RlLmxhYmVsO1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgKi9cbiAgZ2V0IHpvb21MZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCB6b29tIGxldmVsXG4gICAqL1xuICBASW5wdXQoJ3pvb21MZXZlbCcpXG4gIHNldCB6b29tTGV2ZWwobGV2ZWwpIHtcbiAgICB0aGlzLnpvb21UbyhOdW1iZXIobGV2ZWwpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHhgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgZ2V0IHBhbk9mZnNldFgoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgYHhgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgQElucHV0KCdwYW5PZmZzZXRYJylcbiAgc2V0IHBhbk9mZnNldFgoeCkge1xuICAgIHRoaXMucGFuVG8oTnVtYmVyKHgpLCBudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHlgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgZ2V0IHBhbk9mZnNldFkoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgYHlgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxuICAgKi9cbiAgQElucHV0KCdwYW5PZmZzZXRZJylcbiAgc2V0IHBhbk9mZnNldFkoeSkge1xuICAgIHRoaXMucGFuVG8obnVsbCwgTnVtYmVyKHkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnVwZGF0ZSQpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLnVwZGF0ZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jZW50ZXIkKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgdGhpcy5jZW50ZXIkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLnpvb21Ub0ZpdCQpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLnpvb21Ub0ZpdCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5Ub05vZGUkKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgdGhpcy5wYW5Ub05vZGUkLnN1YnNjcmliZSgobm9kZUlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnBhblRvTm9kZUlkKG5vZGVJZCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IGxheW91dCwgbGF5b3V0U2V0dGluZ3MsIG5vZGVzLCBjbHVzdGVycywgbGlua3MgfSA9IGNoYW5nZXM7XG4gICAgdGhpcy5zZXRMYXlvdXQodGhpcy5sYXlvdXQpO1xuICAgIGlmIChsYXlvdXRTZXR0aW5ncykge1xuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHNldExheW91dChsYXlvdXQ6IHN0cmluZyB8IExheW91dCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICBpZiAoIWxheW91dCkge1xuICAgICAgbGF5b3V0ID0gJ2RhZ3JlJztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsYXlvdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmxheW91dCA9IHRoaXMubGF5b3V0U2VydmljZS5nZXRMYXlvdXQobGF5b3V0KTtcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XG4gICAgfVxuICB9XG5cbiAgc2V0TGF5b3V0U2V0dGluZ3Moc2V0dGluZ3M6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmxheW91dC5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCYXNlIGNsYXNzIHVwZGF0ZSBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIGRhZyBncmFwaFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBzdXBlci51cGRhdGUoKTtcbiAgICBpZiAoIXRoaXMuY3VydmUpIHtcbiAgICAgIHRoaXMuY3VydmUgPSBzaGFwZS5jdXJ2ZUJ1bmRsZS5iZXRhKDEpO1xuICAgIH1cblxuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXG4gICAgICAgIHNob3dMZWdlbmQ6IHRoaXMubGVnZW5kXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zZXJpZXNEb21haW4gPSB0aGlzLmdldFNlcmllc0RvbWFpbigpO1xuICAgICAgdGhpcy5zZXRDb2xvcnMoKTtcbiAgICAgIHRoaXMubGVnZW5kT3B0aW9ucyA9IHRoaXMuZ2V0TGVnZW5kT3B0aW9ucygpO1xuXG4gICAgICB0aGlzLmNyZWF0ZUdyYXBoKCk7XG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgZGFncmUgZ3JhcGggZW5naW5lXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgY3JlYXRlR3JhcGgoKTogdm9pZCB7XG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgY29uc3QgaW5pdGlhbGl6ZU5vZGUgPSBuID0+IHtcbiAgICAgIGlmICghbi5tZXRhKSB7XG4gICAgICAgIG4ubWV0YSA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKCFuLmlkKSB7XG4gICAgICAgIG4uaWQgPSBpZCgpO1xuICAgICAgfVxuICAgICAgaWYgKCFuLmRpbWVuc2lvbikge1xuICAgICAgICBuLmRpbWVuc2lvbiA9IHtcbiAgICAgICAgICB3aWR0aDogdGhpcy5ub2RlV2lkdGggPyB0aGlzLm5vZGVXaWR0aCA6IDMwLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5ub2RlSGVpZ2h0ID8gdGhpcy5ub2RlSGVpZ2h0IDogMzBcbiAgICAgICAgfTtcblxuICAgICAgICBuLm1ldGEuZm9yY2VEaW1lbnNpb25zID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuLm1ldGEuZm9yY2VEaW1lbnNpb25zID0gbi5tZXRhLmZvcmNlRGltZW5zaW9ucyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IG4ubWV0YS5mb3JjZURpbWVuc2lvbnM7XG4gICAgICB9XG4gICAgICBuLnBvc2l0aW9uID0ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgICB9O1xuICAgICAgbi5kYXRhID0gbi5kYXRhID8gbi5kYXRhIDoge307XG4gICAgICByZXR1cm4gbjtcbiAgICB9O1xuXG4gICAgdGhpcy5ncmFwaCA9IHtcbiAgICAgIG5vZGVzOiBbLi4udGhpcy5ub2Rlc10ubWFwKGluaXRpYWxpemVOb2RlKSxcbiAgICAgIGNsdXN0ZXJzOiBbLi4uKHRoaXMuY2x1c3RlcnMgfHwgW10pXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxuICAgICAgZWRnZXM6IFsuLi50aGlzLmxpbmtzXS5tYXAoZSA9PiB7XG4gICAgICAgIGlmICghZS5pZCkge1xuICAgICAgICAgIGUuaWQgPSBpZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfSlcbiAgICB9O1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhdygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgZ3JhcGggdXNpbmcgZGFncmUgbGF5b3V0c1xuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIGRyYXcoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmxheW91dCB8fCB0eXBlb2YgdGhpcy5sYXlvdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIENhbGMgdmlldyBkaW1zIGZvciB0aGUgbm9kZXNcbiAgICB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKTtcblxuICAgIC8vIFJlY2FsYyB0aGUgbGF5b3V0XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQucnVuKHRoaXMuZ3JhcGgpO1xuICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcbiAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xuICAgICAgICB0aGlzLnRpY2soKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICByZXN1bHQkLnBpcGUoZmlyc3QoZ3JhcGggPT4gZ3JhcGgubm9kZXMubGVuZ3RoID4gMCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKSk7XG4gIH1cblxuICB0aWNrKCkge1xuICAgIC8vIFRyYW5zcG9zZXMgdmlldyBvcHRpb25zIHRvIHRoZSBub2RlXG4gICAgdGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiB7XG4gICAgICBuLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtuLnBvc2l0aW9uLnggLSBuLmRpbWVuc2lvbi53aWR0aCAvIDIgfHwgMH0sICR7bi5wb3NpdGlvbi55IC0gbi5kaW1lbnNpb24uaGVpZ2h0IC8gMiB8fFxuICAgICAgICAwfSlgO1xuICAgICAgaWYgKCFuLmRhdGEpIHtcbiAgICAgICAgbi5kYXRhID0ge307XG4gICAgICB9XG4gICAgICBuLmRhdGEuY29sb3IgPSB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKTtcbiAgICB9KTtcbiAgICAodGhpcy5ncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKG4gPT4ge1xuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7bi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHxcbiAgICAgICAgMH0pYDtcbiAgICAgIGlmICghbi5kYXRhKSB7XG4gICAgICAgIG4uZGF0YSA9IHt9O1xuICAgICAgfVxuICAgICAgbi5kYXRhLmNvbG9yID0gdGhpcy5jb2xvcnMuZ2V0Q29sb3IodGhpcy5ncm91cFJlc3VsdHNCeShuKSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGxhYmVscyB0byB0aGUgbmV3IHBvc2l0aW9uc1xuICAgIGNvbnN0IG5ld0xpbmtzID0gW107XG4gICAgZm9yIChjb25zdCBlZGdlTGFiZWxJZCBpbiB0aGlzLmdyYXBoLmVkZ2VMYWJlbHMpIHtcbiAgICAgIGNvbnN0IGVkZ2VMYWJlbCA9IHRoaXMuZ3JhcGguZWRnZUxhYmVsc1tlZGdlTGFiZWxJZF07XG5cbiAgICAgIGNvbnN0IG5vcm1LZXkgPSBlZGdlTGFiZWxJZC5yZXBsYWNlKC9bXlxcdy1dKi9nLCAnJyk7XG4gICAgICBsZXQgb2xkTGluayA9IHRoaXMuX29sZExpbmtzLmZpbmQob2wgPT4gYCR7b2wuc291cmNlfSR7b2wudGFyZ2V0fWAgPT09IG5vcm1LZXkpO1xuICAgICAgaWYgKCFvbGRMaW5rKSB7XG4gICAgICAgIG9sZExpbmsgPSB0aGlzLmdyYXBoLmVkZ2VzLmZpbmQobmwgPT4gYCR7bmwuc291cmNlfSR7bmwudGFyZ2V0fWAgPT09IG5vcm1LZXkpIHx8IGVkZ2VMYWJlbDtcbiAgICAgIH1cblxuICAgICAgb2xkTGluay5vbGRMaW5lID0gb2xkTGluay5saW5lO1xuXG4gICAgICBjb25zdCBwb2ludHMgPSBlZGdlTGFiZWwucG9pbnRzO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKHBvaW50cyk7XG5cbiAgICAgIGNvbnN0IG5ld0xpbmsgPSBPYmplY3QuYXNzaWduKHt9LCBvbGRMaW5rKTtcbiAgICAgIG5ld0xpbmsubGluZSA9IGxpbmU7XG4gICAgICBuZXdMaW5rLnBvaW50cyA9IHBvaW50cztcblxuICAgICAgY29uc3QgdGV4dFBvcyA9IHBvaW50c1tNYXRoLmZsb29yKHBvaW50cy5sZW5ndGggLyAyKV07XG4gICAgICBpZiAodGV4dFBvcykge1xuICAgICAgICBuZXdMaW5rLnRleHRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGV4dFBvcy54IHx8IDB9LCR7dGV4dFBvcy55IHx8IDB9KWA7XG4gICAgICB9XG5cbiAgICAgIG5ld0xpbmsudGV4dEFuZ2xlID0gMDtcbiAgICAgIGlmICghbmV3TGluay5vbGRMaW5lKSB7XG4gICAgICAgIG5ld0xpbmsub2xkTGluZSA9IG5ld0xpbmsubGluZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYWxjRG9taW5hbnRCYXNlbGluZShuZXdMaW5rKTtcbiAgICAgIG5ld0xpbmtzLnB1c2gobmV3TGluayk7XG4gICAgfVxuXG4gICAgdGhpcy5ncmFwaC5lZGdlcyA9IG5ld0xpbmtzO1xuXG4gICAgLy8gTWFwIHRoZSBvbGQgbGlua3MgZm9yIGFuaW1hdGlvbnNcbiAgICBpZiAodGhpcy5ncmFwaC5lZGdlcykge1xuICAgICAgdGhpcy5fb2xkTGlua3MgPSB0aGlzLmdyYXBoLmVkZ2VzLm1hcChsID0+IHtcbiAgICAgICAgY29uc3QgbmV3TCA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xuICAgICAgICBuZXdMLm9sZExpbmUgPSBsLmxpbmU7XG4gICAgICAgIHJldHVybiBuZXdMO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBoZWlnaHQvd2lkdGggdG90YWxcbiAgICB0aGlzLmdyYXBoRGltcy53aWR0aCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi54ICsgbi5kaW1lbnNpb24ud2lkdGgpKTtcbiAgICB0aGlzLmdyYXBoRGltcy5oZWlnaHQgPSBNYXRoLm1heCguLi50aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IG4ucG9zaXRpb24ueSArIG4uZGltZW5zaW9uLmhlaWdodCkpO1xuXG4gICAgaWYgKHRoaXMuYXV0b1pvb20pIHtcbiAgICAgIHRoaXMuem9vbVRvRml0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0b0NlbnRlcikge1xuICAgICAgLy8gQXV0by1jZW50ZXIgd2hlbiByZW5kZXJpbmdcbiAgICAgIHRoaXMuY2VudGVyKCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMucmVkcmF3TGluZXMoKSk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgbm9kZSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZSBkaW1lbnNpb25zXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgYXBwbHlOb2RlRGltZW5zaW9ucygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ub2RlRWxlbWVudHMgJiYgdGhpcy5ub2RlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLm5vZGVFbGVtZW50cy5tYXAoZWxlbSA9PiB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBlbGVtLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBuYXRpdmVFbGVtZW50LmlkKTtcblxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGhlaWdodFxuICAgICAgICBsZXQgZGltcztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkaW1zID0gbmF0aXZlRWxlbWVudC5nZXRCQm94KCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ub2RlSGVpZ2h0KSB7ICAgICAgICAgIFxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IG5vZGUuZGltZW5zaW9uLmhlaWdodCAmJiBub2RlLm1ldGEuZm9yY2VEaW1lbnNpb25zID8gbm9kZS5kaW1lbnNpb24uaGVpZ2h0IDogdGhpcy5ub2RlSGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IG5vZGUuZGltZW5zaW9uLmhlaWdodCAmJiBub2RlLm1ldGEuZm9yY2VEaW1lbnNpb25zID8gbm9kZS5kaW1lbnNpb24uaGVpZ2h0IDogZGltcy5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4SGVpZ2h0KSB7XG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24uaGVpZ2h0LCB0aGlzLm5vZGVNYXhIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm5vZGVNaW5IZWlnaHQpIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1pbihub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1pbkhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ub2RlV2lkdGgpIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9ICBub2RlLmRpbWVuc2lvbi53aWR0aCAmJiBub2RlLm1ldGEuZm9yY2VEaW1lbnNpb25zID8gbm9kZS5kaW1lbnNpb24ud2lkdGggOiB0aGlzLm5vZGVXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHdpZHRoXG4gICAgICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBtYXhUZXh0RGltcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgdGV4dEVsZW0gb2YgbmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEJCb3ggPSB0ZXh0RWxlbS5nZXRCQm94KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXhUZXh0RGltcykge1xuICAgICAgICAgICAgICAgICAgbWF4VGV4dERpbXMgPSBjdXJyZW50QkJveDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCQm94LndpZHRoID4gbWF4VGV4dERpbXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4VGV4dERpbXMud2lkdGggPSBjdXJyZW50QkJveC53aWR0aDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QkJveC5oZWlnaHQgPiBtYXhUZXh0RGltcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4VGV4dERpbXMuaGVpZ2h0ID0gY3VycmVudEJCb3guaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IG5vZGUuZGltZW5zaW9uLndpZHRoICYmIG5vZGUubWV0YS5mb3JjZURpbWVuc2lvbnMgPyBub2RlLmRpbWVuc2lvbi53aWR0aCA6IG1heFRleHREaW1zLndpZHRoICsgMjA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gbm9kZS5kaW1lbnNpb24ud2lkdGggJiYgbm9kZS5tZXRhLmZvcmNlRGltZW5zaW9ucyA/IG5vZGUuZGltZW5zaW9uLndpZHRoIDogZGltcy53aWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4V2lkdGgpIHtcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWF4KG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNYXhXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbldpZHRoKSB7XG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBNYXRoLm1pbihub2RlLmRpbWVuc2lvbi53aWR0aCwgdGhpcy5ub2RlTWluV2lkdGgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVkcmF3cyB0aGUgbGluZXMgd2hlbiBkcmFnZ2VkIG9yIHZpZXdwb3J0IHVwZGF0ZWRcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICByZWRyYXdMaW5lcyhfYW5pbWF0ZSA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmxpbmtFbGVtZW50cy5tYXAobGlua0VsID0+IHtcbiAgICAgIGNvbnN0IGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzLmZpbmQobGluID0+IGxpbi5pZCA9PT0gbGlua0VsLm5hdGl2ZUVsZW1lbnQuaWQpO1xuXG4gICAgICBpZiAoZWRnZSkge1xuICAgICAgICBjb25zdCBsaW5rU2VsZWN0aW9uID0gc2VsZWN0KGxpbmtFbC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoJy5saW5lJyk7XG4gICAgICAgIGxpbmtTZWxlY3Rpb25cbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2Uub2xkTGluZSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKF9hbmltYXRlID8gNTAwIDogMClcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2UubGluZSk7XG5cbiAgICAgICAgY29uc3QgdGV4dFBhdGhTZWxlY3Rpb24gPSBzZWxlY3QodGhpcy5jaGFydEVsZW1lbnQubmF0aXZlRWxlbWVudCkuc2VsZWN0KGAjJHtlZGdlLmlkfWApO1xuICAgICAgICB0ZXh0UGF0aFNlbGVjdGlvblxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRUZXh0UGF0aClcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKF9hbmltYXRlID8gNTAwIDogMClcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2UudGV4dFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgdGV4dCBkaXJlY3Rpb25zIC8gZmxpcHBpbmdcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBjYWxjRG9taW5hbnRCYXNlbGluZShsaW5rKTogdm9pZCB7XG4gICAgY29uc3QgZmlyc3RQb2ludCA9IGxpbmsucG9pbnRzWzBdO1xuICAgIGNvbnN0IGxhc3RQb2ludCA9IGxpbmsucG9pbnRzW2xpbmsucG9pbnRzLmxlbmd0aCAtIDFdO1xuICAgIGxpbmsub2xkVGV4dFBhdGggPSBsaW5rLnRleHRQYXRoO1xuXG4gICAgaWYgKGxhc3RQb2ludC54IDwgZmlyc3RQb2ludC54KSB7XG4gICAgICBsaW5rLmRvbWluYW50QmFzZWxpbmUgPSAndGV4dC1iZWZvcmUtZWRnZSc7XG5cbiAgICAgIC8vIHJldmVyc2UgdGV4dCBwYXRoIGZvciB3aGVuIGl0cyBmbGlwcGVkIHVwc2lkZSBkb3duXG4gICAgICBsaW5rLnRleHRQYXRoID0gdGhpcy5nZW5lcmF0ZUxpbmUoWy4uLmxpbmsucG9pbnRzXS5yZXZlcnNlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaW5rLmRvbWluYW50QmFzZWxpbmUgPSAndGV4dC1hZnRlci1lZGdlJztcbiAgICAgIGxpbmsudGV4dFBhdGggPSBsaW5rLmxpbmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBuZXcgbGluZSBwYXRoXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgZ2VuZXJhdGVMaW5lKHBvaW50cyk6IGFueSB7XG4gICAgY29uc3QgbGluZUZ1bmN0aW9uID0gc2hhcGVcbiAgICAgIC5saW5lPGFueT4oKVxuICAgICAgLngoZCA9PiBkLngpXG4gICAgICAueShkID0+IGQueSlcbiAgICAgIC5jdXJ2ZSh0aGlzLmN1cnZlKTtcbiAgICByZXR1cm4gbGluZUZ1bmN0aW9uKHBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbSB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25ab29tKCRldmVudDogTW91c2VFdmVudCwgZGlyZWN0aW9uKTogdm9pZCB7XG4gICAgY29uc3Qgem9vbUZhY3RvciA9IDEgKyAoZGlyZWN0aW9uID09PSAnaW4nID8gdGhpcy56b29tU3BlZWQgOiAtdGhpcy56b29tU3BlZWQpO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB6b29taW5nIHdvdWxkbid0IHB1dCB1cyBvdXQgb2YgYm91bmRzXG4gICAgY29uc3QgbmV3Wm9vbUxldmVsID0gdGhpcy56b29tTGV2ZWwgKiB6b29tRmFjdG9yO1xuICAgIGlmIChuZXdab29tTGV2ZWwgPD0gdGhpcy5taW5ab29tTGV2ZWwgfHwgbmV3Wm9vbUxldmVsID49IHRoaXMubWF4Wm9vbUxldmVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgem9vbWluZyBpcyBlbmFibGVkIG9yIG5vdFxuICAgIGlmICghdGhpcy5lbmFibGVab29tKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuT25ab29tID09PSB0cnVlICYmICRldmVudCkge1xuICAgICAgLy8gQWJzb2x1dGUgbW91c2UgWC9ZIG9uIHRoZSBzY3JlZW5cbiAgICAgIGNvbnN0IG1vdXNlWCA9ICRldmVudC5jbGllbnRYO1xuICAgICAgY29uc3QgbW91c2VZID0gJGV2ZW50LmNsaWVudFk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSB0aGUgbW91c2UgWC9ZIGludG8gYSBTVkcgWC9ZXG4gICAgICBjb25zdCBzdmcgPSB0aGlzLmNoYXJ0Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgICBjb25zdCBzdmdHcm91cCA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdnLmNoYXJ0Jyk7XG5cbiAgICAgIGNvbnN0IHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgICBwb2ludC54ID0gbW91c2VYO1xuICAgICAgcG9pbnQueSA9IG1vdXNlWTtcbiAgICAgIGNvbnN0IHN2Z1BvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKHN2Z0dyb3VwLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XG5cbiAgICAgIC8vIFBhbnpvb21cbiAgICAgIHRoaXMucGFuKHN2Z1BvaW50LngsIHN2Z1BvaW50LnksIHRydWUpO1xuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xuICAgICAgdGhpcy5wYW4oLXN2Z1BvaW50LngsIC1zdmdQb2ludC55LCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQYW4gYnkgeC95XG4gICAqXG4gICAqIEBwYXJhbSB4XG4gICAqIEBwYXJhbSB5XG4gICAqL1xuICBwYW4oeDogbnVtYmVyLCB5OiBudW1iZXIsIGlnbm9yZVpvb21MZXZlbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgY29uc3Qgem9vbUxldmVsID0gaWdub3JlWm9vbUxldmVsID8gMSA6IHRoaXMuem9vbUxldmVsO1xuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdHJhbnNsYXRlKHggLyB6b29tTGV2ZWwsIHkgLyB6b29tTGV2ZWwpKTtcblxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gIH1cblxuICAvKipcbiAgICogUGFuIHRvIGEgZml4ZWQgeC95XG4gICAqXG4gICAqL1xuICBwYW5Ubyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh4ID09PSBudWxsIHx8IHggPT09IHVuZGVmaW5lZCB8fCBpc05hTih4KSB8fCB5ID09PSBudWxsIHx8IHkgPT09IHVuZGVmaW5lZCB8fCBpc05hTih5KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhblggPSAtdGhpcy5wYW5PZmZzZXRYIC0geCAqIHRoaXMuem9vbUxldmVsICsgdGhpcy5kaW1zLndpZHRoIC8gMjtcbiAgICBjb25zdCBwYW5ZID0gLXRoaXMucGFuT2Zmc2V0WSAtIHkgKiB0aGlzLnpvb21MZXZlbCArIHRoaXMuZGltcy5oZWlnaHQgLyAyO1xuXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybShcbiAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsXG4gICAgICB0cmFuc2xhdGUocGFuWCAvIHRoaXMuem9vbUxldmVsLCBwYW5ZIC8gdGhpcy56b29tTGV2ZWwpXG4gICAgKTtcblxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbSBieSBhIGZhY3RvclxuICAgKlxuICAgKi9cbiAgem9vbShmYWN0b3I6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgc2NhbGUoZmFjdG9yLCBmYWN0b3IpKTtcbiAgICB0aGlzLnpvb21DaGFuZ2UuZW1pdCh0aGlzLnpvb21MZXZlbCk7XG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIHpvb21JbigpOiB2b2lkIHtcbiAgICB0aGlzLnpvb20oMSArIHRoaXMuem9vbVNwZWVkKTtcbiAgfVxuXG4gIHpvb21PdXQoKTogdm9pZCB7XG4gICAgdGhpcy56b29tKDEgLSB0aGlzLnpvb21TcGVlZCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbSB0byBhIGZpeGVkIGxldmVsXG4gICAqXG4gICAqL1xuICB6b29tVG8obGV2ZWw6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA6IE51bWJlcihsZXZlbCk7XG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5kID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5kIDogTnVtYmVyKGxldmVsKTtcbiAgICB0aGlzLnpvb21DaGFuZ2UuZW1pdCh0aGlzLnpvb21MZXZlbCk7XG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYW4gd2FzIGludm9rZWQgZnJvbSBldmVudFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uUGFuKGV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5wYW4oZXZlbnQubW92ZW1lbnRYLCBldmVudC5tb3ZlbWVudFkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYWcgd2FzIGludm9rZWQgZnJvbSBhbiBldmVudFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uRHJhZyhldmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZHJhZ2dpbmdOb2RlO1xuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZykge1xuICAgICAgdGhpcy5sYXlvdXQub25EcmFnKG5vZGUsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBub2RlLnBvc2l0aW9uLnggKz0gZXZlbnQubW92ZW1lbnRYIC8gdGhpcy56b29tTGV2ZWw7XG4gICAgbm9kZS5wb3NpdGlvbi55ICs9IGV2ZW50Lm1vdmVtZW50WSAvIHRoaXMuem9vbUxldmVsO1xuXG4gICAgLy8gbW92ZSB0aGUgbm9kZVxuICAgIGNvbnN0IHggPSBub2RlLnBvc2l0aW9uLnggLSBub2RlLmRpbWVuc2lvbi53aWR0aCAvIDI7XG4gICAgY29uc3QgeSA9IG5vZGUucG9zaXRpb24ueSAtIG5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDI7XG4gICAgbm9kZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYDtcblxuICAgIGZvciAoY29uc3QgbGluayBvZiB0aGlzLmdyYXBoLmVkZ2VzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGxpbmsudGFyZ2V0ID09PSBub2RlLmlkIHx8XG4gICAgICAgIGxpbmsuc291cmNlID09PSBub2RlLmlkIHx8XG4gICAgICAgIChsaW5rLnRhcmdldCBhcyBhbnkpLmlkID09PSBub2RlLmlkIHx8XG4gICAgICAgIChsaW5rLnNvdXJjZSBhcyBhbnkpLmlkID09PSBub2RlLmlkXG4gICAgICApIHtcbiAgICAgICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmxheW91dC51cGRhdGVFZGdlKHRoaXMuZ3JhcGgsIGxpbmspO1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcbiAgICAgICAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgICAgIHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xuICAgICAgICAgICAgICB0aGlzLnJlZHJhd0VkZ2UobGluayk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJlZHJhd0xpbmVzKGZhbHNlKTtcbiAgfVxuXG4gIHJlZHJhd0VkZ2UoZWRnZTogRWRnZSkge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShlZGdlLnBvaW50cyk7XG4gICAgdGhpcy5jYWxjRG9taW5hbnRCYXNlbGluZShlZGdlKTtcbiAgICBlZGdlLm9sZExpbmUgPSBlZGdlLmxpbmU7XG4gICAgZWRnZS5saW5lID0gbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGVudGlyZSB2aWV3IGZvciB0aGUgbmV3IHBhbiBwb3NpdGlvblxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIHVwZGF0ZVRyYW5zZm9ybSgpOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zZm9ybSA9IHRvU1ZHKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vZGUgd2FzIGNsaWNrZWRcbiAgICpcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvbkNsaWNrKGV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxuICAvKipcbiAgICogTm9kZSB3YXMgZm9jdXNlZFxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uQWN0aXZhdGUoZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2V2ZW50LCAuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBldmVudCwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vZGUgd2FzIGRlZm9jdXNlZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uRGVhY3RpdmF0ZShldmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5pbmRleE9mKGV2ZW50KTtcblxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcblxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBkb21haW4gc2VyaWVzIGZvciB0aGUgbm9kZXNcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBnZXRTZXJpZXNEb21haW4oKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLm5vZGVzXG4gICAgICAubWFwKGQgPT4gdGhpcy5ncm91cFJlc3VsdHNCeShkKSlcbiAgICAgIC5yZWR1Y2UoKG5vZGVzOiBzdHJpbmdbXSwgbm9kZSk6IGFueVtdID0+IChub2Rlcy5pbmRleE9mKG5vZGUpICE9PSAtMSA/IG5vZGVzIDogbm9kZXMuY29uY2F0KFtub2RlXSkpLCBbXSlcbiAgICAgIC5zb3J0KCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tpbmcgZm9yIHRoZSBsaW5rXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgdHJhY2tMaW5rQnkoaW5kZXgsIGxpbmspOiBhbnkge1xuICAgIHJldHVybiBsaW5rLmlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbm9kZVxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIHRyYWNrTm9kZUJ5KGluZGV4LCBub2RlKTogYW55IHtcbiAgICByZXR1cm4gbm9kZS5pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb2xvcnMgdGhlIG5vZGVzXG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgc2V0Q29sb3JzKCk6IHZvaWQge1xuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCAnb3JkaW5hbCcsIHRoaXMuc2VyaWVzRG9tYWluLCB0aGlzLmN1c3RvbUNvbG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGVnZW5kIG9wdGlvbnNcbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBnZXRMZWdlbmRPcHRpb25zKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjYWxlVHlwZTogJ29yZGluYWwnLFxuICAgICAgZG9tYWluOiB0aGlzLnNlcmllc0RvbWFpbixcbiAgICAgIGNvbG9yczogdGhpcy5jb2xvcnNcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE9uIG1vdXNlIG1vdmUgZXZlbnQsIHVzZWQgZm9yIHBhbm5pbmcgYW5kIGRyYWdnaW5nLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VNb3ZlKCRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XG4gICAgICB0aGlzLm9uUGFuKCRldmVudCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcbiAgICAgIHRoaXMub25EcmFnKCRldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIHRvdWNoIHN0YXJ0IGV2ZW50IHRvIGVuYWJsZSBwYW5uaW5nLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcbiAgICovXG4gIG9uVG91Y2hTdGFydChldmVudCkge1xuICAgIHRoaXMuX3RvdWNoTGFzdFggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xuICAgIHRoaXMuX3RvdWNoTGFzdFkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xuXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9uIHRvdWNoIG1vdmUgZXZlbnQsIHVzZWQgZm9yIHBhbm5pbmcuXG4gICAqXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaG1vdmUnLCBbJyRldmVudCddKVxuICBvblRvdWNoTW92ZSgkZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xuICAgICAgY29uc3QgY2xpZW50WCA9ICRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgY29uc3QgY2xpZW50WSA9ICRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgY29uc3QgbW92ZW1lbnRYID0gY2xpZW50WCAtIHRoaXMuX3RvdWNoTGFzdFg7XG4gICAgICBjb25zdCBtb3ZlbWVudFkgPSBjbGllbnRZIC0gdGhpcy5fdG91Y2hMYXN0WTtcbiAgICAgIHRoaXMuX3RvdWNoTGFzdFggPSBjbGllbnRYO1xuICAgICAgdGhpcy5fdG91Y2hMYXN0WSA9IGNsaWVudFk7XG5cbiAgICAgIHRoaXMucGFuKG1vdmVtZW50WCwgbW92ZW1lbnRZKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gdG91Y2ggZW5kIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy5cbiAgICpcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XG4gICAqL1xuICBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBtb3VzZSB1cCBldmVudCB0byBkaXNhYmxlIHBhbm5pbmcvZHJhZ2dpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcpXG4gIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuaXNQYW5uaW5nID0gZmFsc2U7XG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnRW5kKSB7XG4gICAgICB0aGlzLmxheW91dC5vbkRyYWdFbmQodGhpcy5kcmFnZ2luZ05vZGUsIGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gbm9kZSBtb3VzZSBkb3duIHRvIGtpY2sgb2ZmIGRyYWdnaW5nXG4gICAqXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxuICAgKi9cbiAgb25Ob2RlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50LCBub2RlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5kcmFnZ2luZ05vZGUgPSBub2RlO1xuXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQpIHtcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KG5vZGUsIGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2VudGVyIHRoZSBncmFwaCBpbiB0aGUgdmlld3BvcnRcbiAgICovXG4gIGNlbnRlcigpOiB2b2lkIHtcbiAgICB0aGlzLnBhblRvKHRoaXMuZ3JhcGhEaW1zLndpZHRoIC8gMiwgdGhpcy5ncmFwaERpbXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICAvKipcbiAgICogWm9vbXMgdG8gZml0IHRoZSBlbnRpZXIgZ3JhcGhcbiAgICovXG4gIHpvb21Ub0ZpdCgpOiB2b2lkIHtcbiAgICBjb25zdCBoZWlnaHRab29tID0gdGhpcy5kaW1zLmhlaWdodCAvIHRoaXMuZ3JhcGhEaW1zLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aFpvb20gPSB0aGlzLmRpbXMud2lkdGggLyB0aGlzLmdyYXBoRGltcy53aWR0aDtcbiAgICBjb25zdCB6b29tTGV2ZWwgPSBNYXRoLm1pbihoZWlnaHRab29tLCB3aWR0aFpvb20sIDEpO1xuXG4gICAgaWYgKHpvb21MZXZlbCA8PSB0aGlzLm1pblpvb21MZXZlbCB8fCB6b29tTGV2ZWwgPj0gdGhpcy5tYXhab29tTGV2ZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHpvb21MZXZlbCAhPT0gdGhpcy56b29tTGV2ZWwpIHtcbiAgICAgIHRoaXMuem9vbUxldmVsID0gem9vbUxldmVsO1xuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbUxldmVsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGFucyB0byB0aGUgbm9kZVxuICAgKiBAcGFyYW0gbm9kZUlkIFxuICAgKi9cbiAgcGFuVG9Ob2RlSWQobm9kZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gbm9kZUlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnBhblRvKG5vZGUucG9zaXRpb24ueCwgbm9kZS5wb3NpdGlvbi55KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBPdXRwdXQsIEhvc3RMaXN0ZW5lciwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogTW91c2V3aGVlbCBkaXJlY3RpdmVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Tb2RoYW5hTGlicmFyeS9hbmd1bGFyMi1leGFtcGxlcy9ibG9iL21hc3Rlci9hcHAvbW91c2VXaGVlbERpcmVjdGl2ZS9tb3VzZXdoZWVsLmRpcmVjdGl2ZS50c1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW21vdXNlV2hlZWxdJyB9KVxuZXhwb3J0IGNsYXNzIE1vdXNlV2hlZWxEaXJlY3RpdmUge1xuICBAT3V0cHV0KClcbiAgbW91c2VXaGVlbFVwID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KClcbiAgbW91c2VXaGVlbERvd24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2V3aGVlbCcsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VXaGVlbENocm9tZShldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VXaGVlbEZpcmVmb3goZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignb25tb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZVdoZWVsSUUoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpO1xuICB9XG5cbiAgbW91c2VXaGVlbEZ1bmMoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICh3aW5kb3cuZXZlbnQpIHtcbiAgICAgIGV2ZW50ID0gd2luZG93LmV2ZW50O1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIGV2ZW50LndoZWVsRGVsdGEgfHwgLWV2ZW50LmRldGFpbCkpO1xuICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgIHRoaXMubW91c2VXaGVlbFVwLmVtaXQoZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZGVsdGEgPCAwKSB7XG4gICAgICB0aGlzLm1vdXNlV2hlZWxEb3duLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIC8vIGZvciBJRVxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG5cbiAgICAvLyBmb3IgQ2hyb21lIGFuZCBGaXJlZm94XG4gICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyYXBoQ29tcG9uZW50IH0gZnJvbSAnLi9ncmFwaC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2hhcnRDb21tb25Nb2R1bGUgfSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XG5pbXBvcnQgeyBNb3VzZVdoZWVsRGlyZWN0aXZlIH0gZnJvbSAnLi9tb3VzZS13aGVlbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4vbGF5b3V0cy9sYXlvdXQuc2VydmljZSc7XG5leHBvcnQgeyBHcmFwaENvbXBvbmVudCB9O1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ2hhcnRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtHcmFwaENvbXBvbmVudCwgTW91c2VXaGVlbERpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtHcmFwaENvbXBvbmVudCwgTW91c2VXaGVlbERpcmVjdGl2ZV0sXG4gIHByb3ZpZGVyczogW0xheW91dFNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIEdyYXBoTW9kdWxlIHt9XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JhcGhNb2R1bGUgfSBmcm9tICcuL2dyYXBoL2dyYXBoLm1vZHVsZSc7XG5pbXBvcnQgeyBOZ3hDaGFydHNNb2R1bGUgfSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbW9kZWxzL2luZGV4JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW05neENoYXJ0c01vZHVsZV0sXG4gIGV4cG9ydHM6IFtHcmFwaE1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgTmd4R3JhcGhNb2R1bGUge31cbiJdLCJuYW1lcyI6WyJkYWdyZS5sYXlvdXQiLCJkYWdyZS5ncmFwaGxpYiIsIk9yaWVudGF0aW9uIiwibGF5b3V0Iiwic2hhcGUuY3VydmVCdW5kbGUiLCJsaW5lIiwic2hhcGVcbiAgICAgICAgICAgIC5saW5lIiwibmdUcmFuc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFBTSxLQUFLLEdBQUcsRUFBRTs7Ozs7O0FBTWhCLFNBQWdCLEVBQUU7O1FBQ1osS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7O0lBR3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDakIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxFQUFFLEVBQUUsQ0FBQztDQUNiOzs7Ozs7QUNoQkQ7O0lBS0UsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTs7TUF3QlQsV0FBVztJQUF4QjtRQUNFLG9CQUFlLEdBQWtCO1lBQy9CLFdBQVcsRUFBRSxXQUFXLENBQUMsYUFBYTtZQUN0QyxPQUFPLEVBQUUsRUFBRTtZ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