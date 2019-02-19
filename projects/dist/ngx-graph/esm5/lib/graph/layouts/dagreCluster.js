/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { id } from '../../utils/id';
import * as dagre from 'dagre';
import { Orientation } from './dagre';
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
            return tslib_1.__assign({}, node, { position: {
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
            for (var _d = tslib_1.__values(this.dagreNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
                var node = _e.value;
                this.dagreGraph.setNode(node.id, node);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var _loop_1 = function (cluster) {
            this_1.dagreGraph.setNode(cluster.id, cluster);
            cluster.childNodeIds.forEach(function (childNodeId) {
                _this.dagreGraph.setParent(childNodeId, cluster.id);
            });
        };
        var this_1 = this;
        try {
            for (var _f = tslib_1.__values(this.dagreClusters), _g = _f.next(); !_g.done; _g = _f.next()) {
                var cluster = _g.value;
                _loop_1(cluster);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            // update dagre
            for (var _h = tslib_1.__values(this.dagreEdges), _j = _h.next(); !_j.done; _j = _h.next()) {
                var edge = _j.value;
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
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return this.dagreGraph;
    };
    return DagreClusterLayout;
}());
export { DagreClusterLayout };
if (false) {
    /** @type {?} */
    DagreClusterLayout.prototype.defaultSettings;
    /** @type {?} */
    DagreClusterLayout.prototype.settings;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreGraph;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreNodes;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreClusters;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreEdges;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFncmVDbHVzdGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9sYXlvdXRzL2RhZ3JlQ2x1c3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUcvQixPQUFPLEVBQWlCLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVyRDtJQUFBO1FBQ0Usb0JBQWUsR0FBa0I7WUFDL0IsV0FBVyxFQUFFLFdBQVcsQ0FBQyxhQUFhO1lBQ3RDLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFLEVBQUU7WUFDWCxXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQztRQUNGLGFBQVEsR0FBa0IsRUFBRSxDQUFDO0lBc0gvQixDQUFDOzs7OztJQS9HQyxnQ0FBRzs7OztJQUFILFVBQUksS0FBWTtRQUFoQixpQkF3QkM7UUF2QkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7O1lBRXpDLGFBQWEsR0FBRyxVQUFBLElBQUk7O2dCQUNsQixTQUFTLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNqRCw0QkFDSyxJQUFJLElBQ1AsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDZCxDQUFDLEVBQUUsU0FB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBEYWdyZVNldHRpbmdzLCBPcmllbnRhdGlvbiB9IGZyb20gJy4vZGFncmUnO1xuXG5leHBvcnQgY2xhc3MgRGFncmVDbHVzdGVyTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge1xuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxuICAgIG1hcmdpblg6IDIwLFxuICAgIG1hcmdpblk6IDIwLFxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcbiAgICBub2RlUGFkZGluZzogNTAsXG4gICAgbXVsdGlncmFwaDogdHJ1ZSxcbiAgICBjb21wb3VuZDogdHJ1ZVxuICB9O1xuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xuXG4gIGRhZ3JlR3JhcGg6IGFueTtcbiAgZGFncmVOb2RlczogTm9kZVtdO1xuICBkYWdyZUNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdO1xuICBkYWdyZUVkZ2VzOiBhbnk7XG5cbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xuXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcblxuICAgIGNvbnN0IGRhZ3JlVG9PdXRwdXQgPSBub2RlID0+IHtcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbbm9kZS5pZF07XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5ub2RlLFxuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHg6IGRhZ3JlTm9kZS54LFxuICAgICAgICAgIHk6IGRhZ3JlTm9kZS55XG4gICAgICAgIH0sXG4gICAgICAgIGRpbWVuc2lvbjoge1xuICAgICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgICBncmFwaC5jbHVzdGVycyA9IChncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKGRhZ3JlVG9PdXRwdXQpO1xuICAgIGdyYXBoLm5vZGVzID0gZ3JhcGgubm9kZXMubWFwKGRhZ3JlVG9PdXRwdXQpO1xuXG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XG5cbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbi55IDw9IHRhcmdldE5vZGUucG9zaXRpb24ueSA/IC0xIDogMTtcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xuICAgICAgeDogc291cmNlTm9kZS5wb3NpdGlvbi54LFxuICAgICAgeTogc291cmNlTm9kZS5wb3NpdGlvbi55IC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXG4gICAgfTtcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcbiAgICAgIHg6IHRhcmdldE5vZGUucG9zaXRpb24ueCxcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxuICAgIH07XG5cbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXG4gICAgZWRnZS5wb2ludHMgPSBbc3RhcnRpbmdQb2ludCwgZW5kaW5nUG9pbnRdO1xuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoeyBjb21wb3VuZDogc2V0dGluZ3MuY29tcG91bmQsIG11bHRpZ3JhcGg6IHNldHRpbmdzLm11bHRpZ3JhcGggfSk7XG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyLFxuICAgICAgbXVsdGlncmFwaDogc2V0dGluZ3MubXVsdGlncmFwaCxcbiAgICAgIGNvbXBvdW5kOiBzZXR0aW5ncy5jb21wb3VuZFxuICAgIH0pO1xuXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLyogZW1wdHkgKi9cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAoKG46IE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVDbHVzdGVycyA9IGdyYXBoLmNsdXN0ZXJzIHx8IFtdO1xuXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3TGluaztcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2x1c3RlciBvZiB0aGlzLmRhZ3JlQ2x1c3RlcnMpIHtcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKGNsdXN0ZXIuaWQsIGNsdXN0ZXIpO1xuICAgICAgY2x1c3Rlci5jaGlsZE5vZGVJZHMuZm9yRWFjaChjaGlsZE5vZGVJZCA9PiB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRQYXJlbnQoY2hpbGROb2RlSWQsIGNsdXN0ZXIuaWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhZ3JlXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xuICAgICAgaWYgKHNldHRpbmdzLm11bHRpZ3JhcGgpIHtcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0LCBlZGdlLCBlZGdlLmlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcbiAgfVxufVxuIl19