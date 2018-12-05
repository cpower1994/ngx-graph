"use strict";
var _this = this;
var utils_1 = require('../../utils');
var d3_force_1 = require('d3-force');
var rxjs_1 = require('rxjs');
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
exports.toD3Node = toD3Node;
var D3ForceDirectedLayout = (function () {
    function D3ForceDirectedLayout() {
        this.defaultSettings = {
            force: d3_force_1.forceSimulation()
                .force('charge', d3_force_1.forceManyBody().strength(-150))
                .force('collide', d3_force_1.forceCollide(5)),
            forceLink: d3_force_1.forceLink().id(function (node) { return node.id; }).distance(function () { return 100; })
        };
        this.settings = {};
        this.outputGraph$ = new rxjs_1.Subject();
    }
    D3ForceDirectedLayout.prototype.run = function (graph) {
        this.inputGraph = graph;
        this.d3Graph = {
            nodes: (_a = this.inputGraph.nodes).map.apply(_a, [function (n) { return ({}); }].concat(n)).slice() };
        as;
        any,
            edges;
        (_b = this.inputGraph.edges).map.apply(_b, [function (e) { return ({}); }].concat(e)).slice();
        var _a, _b;
    };
    return D3ForceDirectedLayout;
}());
exports.D3ForceDirectedLayout = D3ForceDirectedLayout;
as;
any,
;
;
this.outputGraph = {
    nodes: [],
    edges: [],
    edgeLabels: []
};
this.outputGraph$.next(this.outputGraph);
this.settings = Object.assign({}, this.defaultSettings, this.settings);
if (this.settings.force) {
    this.settings.force.nodes(this.d3Graph.nodes)
        .force('link', this.settings.forceLink.links(this.d3Graph.edges))
        .alpha(0.5).restart()
        .on('tick', function () {
        _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
    });
}
return this.outputGraph$.asObservable();
updateEdge(graph, Graph, edge, Edge);
rxjs_1.Observable < Graph > {
    const: settings = Object.assign({}, this.defaultSettings, this.settings),
    if: function (settings, force) {
        var _this = this;
        settings.force.nodes(this.d3Graph.nodes)
            .force('link', settings.forceLink.links(this.d3Graph.edges))
            .alpha(0.5).restart()
            .on('tick', function () {
            _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
        });
    },
    return: this.outputGraph$.asObservable()
};
d3GraphToOutputGraph(d3Graph, D3Graph);
Graph;
{
    this.outputGraph.nodes = (_a = this.d3Graph.nodes).map.apply(_a, [function (node) { return ({}); }].concat(node, [utils_1.id, node.id || utils_1.id(), position, {
        x: node.x,
        y: node.y
    }, dimension, {
        width: node.dimension && node.dimension.width || 20,
        height: node.dimension && node.dimension.height || 20
    }, transform, "translate(" + (node.x - (node.dimension && node.dimension.width || 20) / 2 || 0) + ", " + (node.y - (node.dimension && node.dimension.height || 20) / 2 || 0) + ")"]));
}
;
this.outputGraph.edges = (_b = this.d3Graph.edges).map.apply(_b, [function (edge) { return ({}); }].concat(edge, [source, toD3Node(edge.source).id, target, toD3Node(edge.target).id, points, [
    {
        x: toD3Node(edge.source).x,
        y: toD3Node(edge.source).y
    },
    {
        x: toD3Node(edge.target).x,
        y: toD3Node(edge.target).y
    },
]]));
;
this.outputGraph.edgeLabels = this.outputGraph.edges;
return this.outputGraph;
onDragStart(draggingNode, Node, $event, MouseEvent);
void {
    this: .settings.force.alphaTarget(0.3).restart(),
    const: node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; }),
    if: function () { } };
!node;
{
    return;
}
this.draggingStart = { x: $event.x - node.x, y: $event.y - node.y };
node.fx = $event.x - this.draggingStart.x;
node.fy = $event.y - this.draggingStart.y;
onDrag(draggingNode, Node, $event, MouseEvent);
void {
    if: function () { } };
!draggingNode;
return;
var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
if (!node) {
    return;
}
node.fx = $event.x - this.draggingStart.x;
node.fy = $event.y - this.draggingStart.y;
onDragEnd(draggingNode, Node, $event, MouseEvent);
void {
    if: function () { } };
!draggingNode;
return;
var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
if (!node) {
    return;
}
this.settings.force.alphaTarget(0);
node.fx = undefined;
node.fy = undefined;
var _a, _b;
//# sourceMappingURL=d3ForceDirected.js.map