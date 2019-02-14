/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { id } from '../../utils/id';
import * as dagre from 'dagre';
/** @enum {string} */
var Orientation = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
export { Orientation };
/** @enum {string} */
var Alignment = {
    CENTER: 'C',
    UP_LEFT: 'UL',
    UP_RIGHT: 'UR',
    DOWN_LEFT: 'DL',
    DOWN_RIGHT: 'DR',
};
export { Alignment };
/**
 * @record
 */
export function DagreSettings() { }
if (false) {
    /** @type {?|undefined} */
    DagreSettings.prototype.orientation;
    /** @type {?|undefined} */
    DagreSettings.prototype.marginX;
    /** @type {?|undefined} */
    DagreSettings.prototype.marginY;
    /** @type {?|undefined} */
    DagreSettings.prototype.edgePadding;
    /** @type {?|undefined} */
    DagreSettings.prototype.rankPadding;
    /** @type {?|undefined} */
    DagreSettings.prototype.nodePadding;
    /** @type {?|undefined} */
    DagreSettings.prototype.align;
    /** @type {?|undefined} */
    DagreSettings.prototype.acyclicer;
    /** @type {?|undefined} */
    DagreSettings.prototype.ranker;
    /** @type {?|undefined} */
    DagreSettings.prototype.multigraph;
    /** @type {?|undefined} */
    DagreSettings.prototype.compound;
}
/**
 * @record
 */
export function DagreNodesOnlySettings() { }
if (false) {
    /** @type {?|undefined} */
    DagreNodesOnlySettings.prototype.curveDistance;
}
/** @type {?} */
var DEFAULT_EDGE_NAME = '\x00';
/** @type {?} */
var GRAPH_NODE = '\x00';
/** @type {?} */
var EDGE_KEY_DELIM = '\x01';
var DagreNodesOnlyLayout = /** @class */ (function () {
    function DagreNodesOnlyLayout() {
        this.defaultSettings = {
            orientation: Orientation.LEFT_TO_RIGHT,
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
            for (var _b = tslib_1.__values(graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
                var edge = _c.value;
                this.updateEdge(graph, edge);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
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
            for (var _c = tslib_1.__values(this.dagreNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
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
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            // update dagre
            for (var _e = tslib_1.__values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
                var edge = _f.value;
                if (settings.multigraph) {
                    this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
                }
                else {
                    this.dagreGraph.setEdge(edge.source, edge.target);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return this.dagreGraph;
    };
    return DagreNodesOnlyLayout;
}());
export { DagreNodesOnlyLayout };
if (false) {
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.defaultSettings;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.settings;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.dagreGraph;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.dagreNodes;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.dagreEdges;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFncmVOb2Rlc09ubHkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7OztJQUk3QixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJOzs7OztJQUdwQixRQUFTLEdBQUc7SUFDWixTQUFVLElBQUk7SUFDZCxVQUFXLElBQUk7SUFDZixXQUFZLElBQUk7SUFDaEIsWUFBYSxJQUFJOzs7Ozs7QUFHbkIsbUNBWUM7OztJQVhDLG9DQUEwQjs7SUFDMUIsZ0NBQWlCOztJQUNqQixnQ0FBaUI7O0lBQ2pCLG9DQUFxQjs7SUFDckIsb0NBQXFCOztJQUNyQixvQ0FBcUI7O0lBQ3JCLDhCQUFrQjs7SUFDbEIsa0NBQWlDOztJQUNqQywrQkFBMkQ7O0lBQzNELG1DQUFxQjs7SUFDckIsaUNBQW1COzs7OztBQUdyQiw0Q0FFQzs7O0lBREMsK0NBQXVCOzs7SUFHbkIsaUJBQWlCLEdBQUcsTUFBTTs7SUFDMUIsVUFBVSxHQUFHLE1BQU07O0lBQ25CLGNBQWMsR0FBRyxNQUFNO0FBRTdCO0lBQUE7UUFDRSxvQkFBZSxHQUEyQjtZQUN4QyxXQUFXLEVBQUUsV0FBVyxDQUFDLGFBQWE7WUFDdEMsT0FBTyxFQUFFLEVBQUU7WUFDWCxPQUFPLEVBQUUsRUFBRTtZQUNYLFdBQVcsRUFBRSxHQUFHO1lBQ2hCLFdBQVcsRUFBRSxHQUFHO1lBQ2hCLFdBQVcsRUFBRSxFQUFFO1lBQ2YsYUFBYSxFQUFFLEVBQUU7WUFDakIsVUFBVSxFQUFFLElBQUk7WUFDaEIsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDO1FBQ0YsYUFB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QUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNuRDthQUNGOzs7Ozs7Ozs7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQWxKRCxJQWtKQzs7OztJQWpKQywrQ0FVRTs7SUFDRix3Q0FBc0M7O0lBRXRDLDBDQUFnQjs7SUFDaEIsMENBQWdCOztJQUNoQiwwQ0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcblxuZXhwb3J0IGVudW0gT3JpZW50YXRpb24ge1xuICBMRUZUX1RPX1JJR0hUID0gJ0xSJyxcbiAgUklHSFRfVE9fTEVGVCA9ICdSTCcsXG4gIFRPUF9UT19CT1RUT00gPSAnVEInLFxuICBCT1RUT01fVE9fVE9NID0gJ0JUJ1xufVxuZXhwb3J0IGVudW0gQWxpZ25tZW50IHtcbiAgQ0VOVEVSID0gJ0MnLFxuICBVUF9MRUZUID0gJ1VMJyxcbiAgVVBfUklHSFQgPSAnVVInLFxuICBET1dOX0xFRlQgPSAnREwnLFxuICBET1dOX1JJR0hUID0gJ0RSJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlU2V0dGluZ3Mge1xuICBvcmllbnRhdGlvbj86IE9yaWVudGF0aW9uO1xuICBtYXJnaW5YPzogbnVtYmVyO1xuICBtYXJnaW5ZPzogbnVtYmVyO1xuICBlZGdlUGFkZGluZz86IG51bWJlcjtcbiAgcmFua1BhZGRpbmc/OiBudW1iZXI7XG4gIG5vZGVQYWRkaW5nPzogbnVtYmVyO1xuICBhbGlnbj86IEFsaWdubWVudDtcbiAgYWN5Y2xpY2VyPzogJ2dyZWVkeScgfCB1bmRlZmluZWQ7XG4gIHJhbmtlcj86ICduZXR3b3JrLXNpbXBsZXgnIHwgJ3RpZ2h0LXRyZWUnIHwgJ2xvbmdlc3QtcGF0aCc7XG4gIG11bHRpZ3JhcGg/OiBib29sZWFuO1xuICBjb21wb3VuZD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVOb2Rlc09ubHlTZXR0aW5ncyBleHRlbmRzIERhZ3JlU2V0dGluZ3Mge1xuICBjdXJ2ZURpc3RhbmNlPzogbnVtYmVyO1xufVxuXG5jb25zdCBERUZBVUxUX0VER0VfTkFNRSA9ICdcXHgwMCc7XG5jb25zdCBHUkFQSF9OT0RFID0gJ1xceDAwJztcbmNvbnN0IEVER0VfS0VZX0RFTElNID0gJ1xceDAxJztcblxuZXhwb3J0IGNsYXNzIERhZ3JlTm9kZXNPbmx5TGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZU5vZGVzT25seVNldHRpbmdzID0ge1xuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxuICAgIG1hcmdpblg6IDIwLFxuICAgIG1hcmdpblk6IDIwLFxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcbiAgICBub2RlUGFkZGluZzogNTAsXG4gICAgY3VydmVEaXN0YW5jZTogMjAsXG4gICAgbXVsdGlncmFwaDogdHJ1ZSxcbiAgICBjb21wb3VuZDogdHJ1ZVxuICB9O1xuICBzZXR0aW5nczogRGFncmVOb2Rlc09ubHlTZXR0aW5ncyA9IHt9O1xuXG4gIGRhZ3JlR3JhcGg6IGFueTtcbiAgZGFncmVOb2RlczogYW55O1xuICBkYWdyZUVkZ2VzOiBhbnk7XG5cbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xuXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcblxuICAgIGZvciAoY29uc3QgZGFncmVOb2RlSWQgaW4gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlcykge1xuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XG4gICAgICBjb25zdCBub2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGRhZ3JlTm9kZS5pZCk7XG4gICAgICBub2RlLnBvc2l0aW9uID0ge1xuICAgICAgICB4OiBkYWdyZU5vZGUueCxcbiAgICAgICAgeTogZGFncmVOb2RlLnlcbiAgICAgIH07XG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcbiAgICAgICAgd2lkdGg6IGRhZ3JlTm9kZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgZ3JhcGguZWRnZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlRWRnZShncmFwaCwgZWRnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XG4gICAgY29uc3QgcmFua0F4aXM6ICd4JyB8ICd5JyA9IHRoaXMuc2V0dGluZ3Mub3JpZW50YXRpb24gPT09ICdCVCcgfHwgdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ1RCJyA/ICd5JyA6ICd4JztcbiAgICBjb25zdCBvcmRlckF4aXM6ICd4JyB8ICd5JyA9IHJhbmtBeGlzID09PSAneScgPyAneCcgOiAneSc7XG4gICAgY29uc3QgcmFua0RpbWVuc2lvbiA9IHJhbmtBeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb25bcmFua0F4aXNdIDw9IHRhcmdldE5vZGUucG9zaXRpb25bcmFua0F4aXNdID8gLTEgOiAxO1xuICAgIGNvbnN0IHN0YXJ0aW5nUG9pbnQgPSB7XG4gICAgICBbb3JkZXJBeGlzXTogc291cmNlTm9kZS5wb3NpdGlvbltvcmRlckF4aXNdLFxuICAgICAgW3JhbmtBeGlzXTogc291cmNlTm9kZS5wb3NpdGlvbltyYW5rQXhpc10gLSBkaXIgKiAoc291cmNlTm9kZS5kaW1lbnNpb25bcmFua0RpbWVuc2lvbl0gLyAyKVxuICAgIH07XG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XG4gICAgICBbb3JkZXJBeGlzXTogdGFyZ2V0Tm9kZS5wb3NpdGlvbltvcmRlckF4aXNdLFxuICAgICAgW3JhbmtBeGlzXTogdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb25bcmFua0RpbWVuc2lvbl0gLyAyKVxuICAgIH07XG5cbiAgICBjb25zdCBjdXJ2ZURpc3RhbmNlID0gdGhpcy5zZXR0aW5ncy5jdXJ2ZURpc3RhbmNlIHx8IHRoaXMuZGVmYXVsdFNldHRpbmdzLmN1cnZlRGlzdGFuY2U7XG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xuICAgIGVkZ2UucG9pbnRzID0gW1xuICAgICAgc3RhcnRpbmdQb2ludCxcbiAgICAgIHtcbiAgICAgICAgW29yZGVyQXhpc106IHN0YXJ0aW5nUG9pbnRbb3JkZXJBeGlzXSxcbiAgICAgICAgW3JhbmtBeGlzXTogc3RhcnRpbmdQb2ludFtyYW5rQXhpc10gLSBkaXIgKiBjdXJ2ZURpc3RhbmNlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBbb3JkZXJBeGlzXTogZW5kaW5nUG9pbnRbb3JkZXJBeGlzXSxcbiAgICAgICAgW3JhbmtBeGlzXTogZW5kaW5nUG9pbnRbcmFua0F4aXNdICsgZGlyICogY3VydmVEaXN0YW5jZVxuICAgICAgfSxcbiAgICAgIGVuZGluZ1BvaW50XG4gICAgXTtcbiAgICBjb25zdCBlZGdlTGFiZWxJZCA9IGAke2VkZ2Uuc291cmNlfSR7RURHRV9LRVlfREVMSU19JHtlZGdlLnRhcmdldH0ke0VER0VfS0VZX0RFTElNfSR7REVGQVVMVF9FREdFX05BTUV9YDtcbiAgICBjb25zdCBtYXRjaGluZ0VkZ2VMYWJlbCA9IGdyYXBoLmVkZ2VMYWJlbHNbZWRnZUxhYmVsSWRdO1xuICAgIGlmIChtYXRjaGluZ0VkZ2VMYWJlbCkge1xuICAgICAgbWF0Y2hpbmdFZGdlTGFiZWwucG9pbnRzID0gZWRnZS5wb2ludHM7XG4gICAgfVxuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoeyBjb21wb3VuZDogc2V0dGluZ3MuY29tcG91bmQsIG11bHRpZ3JhcGg6IHNldHRpbmdzLm11bHRpZ3JhcGggfSk7XG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyLFxuICAgICAgbXVsdGlncmFwaDogc2V0dGluZ3MubXVsdGlncmFwaCxcbiAgICAgIGNvbXBvdW5kOiBzZXR0aW5ncy5jb21wb3VuZFxuICAgIH0pO1xuXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLyogZW1wdHkgKi9cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAobiA9PiB7XG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XG4gICAgICBjb25zdCBuZXdMaW5rOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdMaW5rO1xuICAgIH0pO1xuXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xuICAgICAgaWYgKCFub2RlLndpZHRoKSB7XG4gICAgICAgIG5vZGUud2lkdGggPSAyMDtcbiAgICAgIH1cbiAgICAgIGlmICghbm9kZS5oZWlnaHQpIHtcbiAgICAgICAgbm9kZS5oZWlnaHQgPSAzMDtcbiAgICAgIH1cblxuICAgICAgLy8gdXBkYXRlIGRhZ3JlXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZGFncmVcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgdGhpcy5kYWdyZUVkZ2VzKSB7XG4gICAgICBpZiAoc2V0dGluZ3MubXVsdGlncmFwaCkge1xuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQsIGVkZ2UsIGVkZ2UuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xuICB9XG59XG4iXX0=