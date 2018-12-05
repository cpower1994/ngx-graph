"use strict";
var _this = this;
var utils_1 = require('../../utils');
var webcola_1 = require('webcola');
var d3Dispatch = require('d3-dispatch');
var d3Force = require('d3-force');
var d3Timer = require('d3-timer');
var rxjs_1 = require('rxjs');
function toNode(nodes, nodeRef) {
    if (typeof nodeRef === 'number') {
        return nodes[nodeRef];
    }
    return nodeRef;
}
exports.toNode = toNode;
var ColaForceDirectedLayout = (function () {
    function ColaForceDirectedLayout() {
        this.defaultSettings = {
            force: webcola_1.d3adaptor.apply(void 0, [{}].concat(d3Dispatch, d3Force, d3Timer))
        };
    }
    ColaForceDirectedLayout.prototype.linkDistance = ;
    ColaForceDirectedLayout.prototype.avoidOverlaps = ;
    return ColaForceDirectedLayout;
}());
exports.ColaForceDirectedLayout = ColaForceDirectedLayout;
true;
viewDimensions: {
    width: 600,
        height;
    600,
        xOffset;
    0,
    ;
}
;
settings: ColaForceDirectedSettings = {};
inputGraph: Graph;
outputGraph: Graph;
internalGraph: ColaGraph & { groupLinks: Edge[] };
outputGraph$: rxjs_1.Subject < Graph > ;
new rxjs_1.Subject();
draggingStart: {
    x: number, y;
    number;
}
;
run(graph, Graph);
rxjs_1.Observable < Graph > {
    this: .inputGraph = graph,
    if: function () { } };
!this.inputGraph.clusters;
{
    this.inputGraph.clusters = [];
}
this.internalGraph = {
    nodes: (_a = this.inputGraph.nodes).map.apply(_a, [function (n) { return ({}); }].concat(n, [width, n.dimension ? n.dimension.width : 20, height, n.dimension ? n.dimension.height : 20])).slice()
};
as;
any,
    groups;
this.inputGraph.clusters.map(function (cluster) { return ({
    id: cluster.id,
    padding: 5,
    groups: cluster.childNodeIds
        .map(function (nodeId) { return _this.inputGraph.clusters.findIndex(function (node) { return node.id === nodeId; }); })
        .filter(function (x) { return x >= 0; }),
    leaves: cluster.childNodeIds
        .map(function (nodeId) { return _this.inputGraph.nodes.findIndex(function (node) { return node.id === nodeId; }); })
        .filter(function (x) { return x >= 0; })
}); }).slice(),
    links;
(_b = this.inputGraph.edges).map.apply(_b, [function (e) {
    var sourceNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.source === node.id; });
    var targetNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.target === node.id; });
    if (sourceNodeIndex === -1 || targetNodeIndex === -1) {
        return undefined;
    }
    return {};
}].concat(e, [source, sourceNodeIndex, target, targetNodeIndex])).concat([filter(function (x) { return !!x; })]),
    groupLinks;
this.inputGraph.edges.map(function (e) {
    var sourceNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.source === node.id; });
    var targetNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.target === node.id; });
    if (sourceNodeIndex >= 0 && targetNodeIndex >= 0) {
        return undefined;
    }
    return e;
}).filter(function (x) { return !!x; }).slice();
;
this.outputGraph = {
    nodes: [],
    clusters: [],
    edges: [],
    edgeLabels: []
};
this.outputGraph$.next(this.outputGraph);
this.settings = Object.assign({}, this.defaultSettings, this.settings);
if (this.settings.force) {
    this.settings.force = this.settings.force.nodes(this.internalGraph.nodes)
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
            this.settings.viewDimensions.height,
        ]);
    }
    if (this.settings.forceModifierFn) {
        this.settings.force = this.settings.forceModifierFn(this.settings.force);
    }
    this.settings.force.start();
}
return this.outputGraph$.asObservable();
updateEdge(graph, Graph, edge, Edge);
rxjs_1.Observable < Graph > {
    const: settings = Object.assign({}, this.defaultSettings, this.settings),
    if: function (settings, force) {
        settings.force.start();
    },
    return: this.outputGraph$.asObservable()
};
internalGraphToOutputGraph(internalGraph, any);
Graph;
{
    this.outputGraph.nodes = (_c = internalGraph.nodes).map.apply(_c, [function (node) { return ({}); }].concat(node, [utils_1.id, node.id || utils_1.id(), position, {
        x: node.x,
        y: node.y
    }, dimension, {
        width: node.dimension && node.dimension.width || 20,
        height: node.dimension && node.dimension.height || 20
    }, transform, "translate(" + (node.x - (node.dimension && node.dimension.width || 20) / 2 || 0) + ", " + (node.y - (node.dimension && node.dimension.height || 20) / 2 || 0) + ")"]));
}
;
this.outputGraph.edges = (_d = internalGraph.links).map.apply(_d, [function (edge) {
    var source = toNode(internalGraph.nodes, edge.source);
    var target = toNode(internalGraph.nodes, edge.target);
    return {};
}].concat(edge, [source, source.id, target, target.id, points, [
    source.bounds.rayIntersection(target.bounds.cx(), target.bounds.cy()),
    target.bounds.rayIntersection(source.bounds.cx(), source.bounds.cy()),
]]));
concat((_e = internalGraph.groupLinks).map.apply(_e, [function (groupLink) {
    var sourceNode = internalGraph.nodes.find(function (foundNode) { return foundNode.id === groupLink.source; });
    var targetNode = internalGraph.nodes.find(function (foundNode) { return foundNode.id === groupLink.target; });
    var source = sourceNode || internalGraph.groups.find(function (foundGroup) { return foundGroup.id === groupLink.source; });
    var target = targetNode || internalGraph.groups.find(function (foundGroup) { return foundGroup.id === groupLink.target; });
    return {};
}].concat(groupLink, [source, source.id, target, target.id, points, [
    source.bounds.rayIntersection(target.bounds.cx(), target.bounds.cy()),
    target.bounds.rayIntersection(source.bounds.cx(), source.bounds.cy()),
]])));
;
this.outputGraph.clusters = (_f = internalGraph.groups).map.apply(_f, [function (group, index) {
    var inputGroup = _this.inputGraph.clusters[index];
    return {};
}].concat(inputGroup, [dimension, {
    width: group.bounds ? group.bounds.width() : 20,
    height: group.bounds ? group.bounds.height() : 20
}, position, {
    x: group.bounds ? (group.bounds.x + group.bounds.width() / 2) : 0,
    y: group.bounds ? (group.bounds.y + group.bounds.height() / 2) : 0
}]));
;
this.outputGraph.edgeLabels = this.outputGraph.edges;
return this.outputGraph;
onDragStart(draggingNode, Node, $event, MouseEvent);
void {
    const: nodeIndex = this.outputGraph.nodes.findIndex(function (foundNode) { return foundNode.id === draggingNode.id; }),
    const: node = this.internalGraph.nodes[nodeIndex],
    if: function () { } };
!node;
{
    return;
}
this.draggingStart = { x: node.x - $event.x, y: node.y - $event.y };
node.fixed = 1;
this.settings.force.start();
onDrag(draggingNode, Node, $event, MouseEvent);
void {
    if: function () { } };
!draggingNode;
return;
var nodeIndex = this.outputGraph.nodes.findIndex(function (foundNode) { return foundNode.id === draggingNode.id; });
var node = this.internalGraph.nodes[nodeIndex];
if (!node) {
    return;
}
node.x = this.draggingStart.x + $event.x;
node.y = this.draggingStart.y + $event.y;
onDragEnd(draggingNode, Node, $event, MouseEvent);
void {
    if: function () { } };
!draggingNode;
return;
var nodeIndex = this.outputGraph.nodes.findIndex(function (foundNode) { return foundNode.id === draggingNode.id; });
var node = this.internalGraph.nodes[nodeIndex];
if (!node) {
    return;
}
node.fixed = 0;
var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=colaForceDirected.js.map