"use strict";
var utils_1 = require('../../utils');
var dagre = require('dagre');
(function (Orientation) {
    Orientation[Orientation["LEFT_TO_RIGHT"] = 'LR'] = "LEFT_TO_RIGHT";
    Orientation[Orientation["RIGHT_TO_LEFT"] = 'RL'] = "RIGHT_TO_LEFT";
    Orientation[Orientation["TOP_TO_BOTTOM"] = 'TB'] = "TOP_TO_BOTTOM";
    Orientation[Orientation["BOTTOM_TO_TOM"] = 'BT'] = "BOTTOM_TO_TOM";
})(exports.Orientation || (exports.Orientation = {}));
var Orientation = exports.Orientation;
(function (Alignment) {
    Alignment[Alignment["CENTER"] = 'C'] = "CENTER";
    Alignment[Alignment["UP_LEFT"] = 'UL'] = "UP_LEFT";
    Alignment[Alignment["UP_RIGHT"] = 'UR'] = "UP_RIGHT";
    Alignment[Alignment["DOWN_LEFT"] = 'DL'] = "DOWN_LEFT";
    Alignment[Alignment["DOWN_RIGHT"] = 'DR'] = "DOWN_RIGHT";
})(exports.Alignment || (exports.Alignment = {}));
var Alignment = exports.Alignment;
var DagreLayout = (function () {
    function DagreLayout() {
        this.defaultSettings = {
            orientation: Orientation.LEFT_TO_RIGHT,
            marginX: 20,
            marginY: 20,
            edgePadding: 100,
            rankPadding: 100,
            nodePadding: 50
        };
        this.settings = {};
    }
    DagreLayout.prototype.run = function (graph) {
        this.createDagreGraph(graph);
        dagre.layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        var _loop_1 = function(dagreNodeId) {
            var dagreNode = this_1.dagreGraph._nodes[dagreNodeId];
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
    DagreLayout.prototype.updateEdge = function (graph, edge) {
        var sourceNode = graph.nodes.find(function (n) { return n.id === edge.source; });
        var targetNode = graph.nodes.find(function (n) { return n.id === edge.target; });
        // determine new arrow position
        var dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        var startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
        };
        var endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
        };
        // generate new points
        edge.points = [startingPoint, endingPoint];
        return graph;
    };
    DagreLayout.prototype.createDagreGraph = function (graph) {
        this.dagreGraph = new dagre.graphlib.Graph();
        var settings = Object.assign({}, this.defaultSettings, this.settings);
        this.dagreGraph.setGraph({
            rankdir: settings.orientation,
            marginx: settings.marginX,
            marginy: settings.marginY,
            edgesep: settings.edgePadding,
            ranksep: settings.rankPadding,
            nodesep: settings.nodePadding,
            align: settings.align,
            acyclicer: settings.acyclicer,
            ranker: settings.ranker
        });
        // Default to assigning a new object as a label for each new edge.
        this.dagreGraph.setDefaultEdgeLabel(function () {
            return {};
        });
        this.dagreNodes = graph.nodes.map(function (n) {
            var node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreEdges = graph.edges.map(function (l) {
            var newLink = Object.assign({}, l);
            if (!newLink.id)
                newLink.id = utils_1.id();
            return newLink;
        });
        for (var _i = 0, _a = this.dagreNodes; _i < _a.length; _i++) {
            var node = _a[_i];
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
        for (var _b = 0, _c = this.dagreEdges; _b < _c.length; _b++) {
            var edge = _c[_b];
            this.dagreGraph.setEdge(edge.source, edge.target);
        }
        return this.dagreGraph;
    };
    return DagreLayout;
}());
exports.DagreLayout = DagreLayout;
//# sourceMappingURL=dagre.js.map