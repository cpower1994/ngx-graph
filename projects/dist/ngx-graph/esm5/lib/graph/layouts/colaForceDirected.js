/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { id } from '../../utils/id';
import { d3adaptor } from 'webcola';
import * as d3Dispatch from 'd3-dispatch';
import * as d3Force from 'd3-force';
import * as d3Timer from 'd3-timer';
import { Subject } from 'rxjs';
/**
 * @record
 */
export function ColaForceDirectedSettings() { }
if (false) {
    /** @type {?|undefined} */
    ColaForceDirectedSettings.prototype.force;
    /** @type {?|undefined} */
    ColaForceDirectedSettings.prototype.forceModifierFn;
    /** @type {?|undefined} */
    ColaForceDirectedSettings.prototype.onTickListener;
    /** @type {?|undefined} */
    ColaForceDirectedSettings.prototype.viewDimensions;
}
/**
 * @record
 */
export function ColaGraph() { }
if (false) {
    /** @type {?} */
    ColaGraph.prototype.groups;
    /** @type {?} */
    ColaGraph.prototype.nodes;
    /** @type {?} */
    ColaGraph.prototype.links;
}
/**
 * @param {?} nodes
 * @param {?} nodeRef
 * @return {?}
 */
export function toNode(nodes, nodeRef) {
    if (typeof nodeRef === 'number') {
        return nodes[nodeRef];
    }
    return nodeRef;
}
var ColaForceDirectedLayout = /** @class */ (function () {
    function ColaForceDirectedLayout() {
        this.defaultSettings = {
            force: d3adaptor(tslib_1.__assign({}, d3Dispatch, d3Force, d3Timer))
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
            nodes: (/** @type {?} */ (tslib_1.__spread(this.inputGraph.nodes.map(function (n) { return (tslib_1.__assign({}, n, { width: n.dimension ? n.dimension.width : 20, height: n.dimension ? n.dimension.height : 20 })); })))),
            groups: tslib_1.__spread(this.inputGraph.clusters.map(function (cluster) { return ({
                padding: 5,
                groups: cluster.childNodeIds
                    .map(function (nodeId) { return (/** @type {?} */ (_this.inputGraph.clusters.findIndex(function (node) { return node.id === nodeId; }))); })
                    .filter(function (x) { return x >= 0; }),
                leaves: cluster.childNodeIds
                    .map(function (nodeId) { return (/** @type {?} */ (_this.inputGraph.nodes.findIndex(function (node) { return node.id === nodeId; }))); })
                    .filter(function (x) { return x >= 0; })
            }); })),
            links: (/** @type {?} */ (tslib_1.__spread(this.inputGraph.edges
                .map(function (e) {
                /** @type {?} */
                var sourceNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.source === node.id; });
                /** @type {?} */
                var targetNodeIndex = _this.inputGraph.nodes.findIndex(function (node) { return e.target === node.id; });
                if (sourceNodeIndex === -1 || targetNodeIndex === -1) {
                    return undefined;
                }
                return tslib_1.__assign({}, e, { source: sourceNodeIndex, target: targetNodeIndex });
            })
                .filter(function (x) { return !!x; })))),
            groupLinks: tslib_1.__spread(this.inputGraph.edges
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
        this.outputGraph.nodes = internalGraph.nodes.map(function (node) { return (tslib_1.__assign({}, node, { id: node.id || id(), position: {
                x: node.x,
                y: node.y
            }, dimension: {
                width: (node.dimension && node.dimension.width) || 20,
                height: (node.dimension && node.dimension.height) || 20
            }, transform: "translate(" + (node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0) + ", " + (node.y -
                ((node.dimension && node.dimension.height) || 20) / 2 || 0) + ")" })); });
        this.outputGraph.edges = internalGraph.links
            .map(function (edge) {
            /** @type {?} */
            var source = toNode(internalGraph.nodes, edge.source);
            /** @type {?} */
            var target = toNode(internalGraph.nodes, edge.target);
            return tslib_1.__assign({}, edge, { source: source.id, target: target.id, points: [
                    ((/** @type {?} */ (source.bounds))).rayIntersection(target.bounds.cx(), target.bounds.cy()),
                    ((/** @type {?} */ (target.bounds))).rayIntersection(source.bounds.cx(), source.bounds.cy())
                ] });
        })
            .concat(internalGraph.groupLinks.map(function (groupLink) {
            /** @type {?} */
            var sourceNode = internalGraph.nodes.find(function (foundNode) { return ((/** @type {?} */ (foundNode))).id === groupLink.source; });
            /** @type {?} */
            var targetNode = internalGraph.nodes.find(function (foundNode) { return ((/** @type {?} */ (foundNode))).id === groupLink.target; });
            /** @type {?} */
            var source = sourceNode || internalGraph.groups.find(function (foundGroup) { return ((/** @type {?} */ (foundGroup))).id === groupLink.source; });
            /** @type {?} */
            var target = targetNode || internalGraph.groups.find(function (foundGroup) { return ((/** @type {?} */ (foundGroup))).id === groupLink.target; });
            return tslib_1.__assign({}, groupLink, { source: source.id, target: target.id, points: [
                    ((/** @type {?} */ (source.bounds))).rayIntersection(target.bounds.cx(), target.bounds.cy()),
                    ((/** @type {?} */ (target.bounds))).rayIntersection(source.bounds.cx(), source.bounds.cy())
                ] });
        }));
        this.outputGraph.clusters = internalGraph.groups.map(function (group, index) {
            /** @type {?} */
            var inputGroup = _this.inputGraph.clusters[index];
            return tslib_1.__assign({}, inputGroup, { dimension: {
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
export { ColaForceDirectedLayout };
if (false) {
    /** @type {?} */
    ColaForceDirectedLayout.prototype.defaultSettings;
    /** @type {?} */
    ColaForceDirectedLayout.prototype.settings;
    /** @type {?} */
    ColaForceDirectedLayout.prototype.inputGraph;
    /** @type {?} */
    ColaForceDirectedLayout.prototype.outputGraph;
    /** @type {?} */
    ColaForceDirectedLayout.prototype.internalGraph;
    /** @type {?} */
    ColaForceDirectedLayout.prototype.outputGraph$;
    /** @type {?} */
    ColaForceDirectedLayout.prototype.draggingStart;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sYUZvcmNlRGlyZWN0ZWQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvY29sYUZvcmNlRGlyZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFFLFNBQVMsRUFBa0YsTUFBTSxTQUFTLENBQUM7QUFDcEgsT0FBTyxLQUFLLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxLQUFLLE9BQU8sTUFBTSxVQUFVLENBQUM7QUFDcEMsT0FBTyxLQUFLLE9BQU8sTUFBTSxVQUFVLENBQUM7QUFFcEMsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7OztBQUczQywrQ0FLQzs7O0lBSkMsMENBQTJDOztJQUMzQyxvREFBb0c7O0lBQ3BHLG1EQUFvRDs7SUFDcEQsbURBQWdDOzs7OztBQUVsQywrQkFJQzs7O0lBSEMsMkJBQWdCOztJQUNoQiwwQkFBbUI7O0lBQ25CLDBCQUEyQjs7Ozs7OztBQUU3QixNQUFNLFVBQVUsTUFBTSxDQUFDLEtBQWtCLEVBQUUsT0FBMkI7SUFDcEUsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdkI7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQ7SUFBQTtRQUNFLG9CQUFlLEdBQThCO1lBQzNDLEtBQUssRUFBRSxTQUFTLHNCQUNYLFVBQVUsRUFDVixPQUFPLEVBQ1AsT0FBTyxFQUNWO2lCQUNDLFlBQVksQ0FBQyxHQUFHLENBQUM7aUJBQ2pCLGFBQWEsQ0FBQyxJQUFJLENBQUM7WUFDdEIsY0FBYyxFQUFFO2dCQUNkLEtBQUssRUFBRSxHQUFHO2dCQUNWLE1BQU0sRUFBRSxHQUFHO2dCQUNYLE9BQU8sRUFBRSxDQUFD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LEVBQUU7WUFDakIsT0FBTztTQUNSOztZQUNLLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsRUFBRSxLQUFLLFlBQVksQ0FBQyxFQUFFLEVBQWhDLENBQWdDLENBQUM7O1lBQzNGLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDaEQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUFyT0QsSUFxT0M7Ozs7SUFwT0Msa0RBYUU7O0lBQ0YsMkNBQXlDOztJQUV6Qyw2Q0FBa0I7O0lBQ2xCLDhDQUFtQjs7SUFDbkIsZ0RBQW1EOztJQUNuRCwrQ0FBNkM7O0lBRTdDLGdEQUF3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcbmltcG9ydCB7IGQzYWRhcHRvciwgSUQzU3R5bGVMYXlvdXRBZGFwdG9yLCBMYXlvdXQgYXMgQ29sYUxheW91dCwgR3JvdXAsIElucHV0Tm9kZSwgTGluaywgUmVjdGFuZ2xlIH0gZnJvbSAnd2ViY29sYSc7XG5pbXBvcnQgKiBhcyBkM0Rpc3BhdGNoIGZyb20gJ2QzLWRpc3BhdGNoJztcbmltcG9ydCAqIGFzIGQzRm9yY2UgZnJvbSAnZDMtZm9yY2UnO1xuaW1wb3J0ICogYXMgZDNUaW1lciBmcm9tICdkMy10aW1lcic7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgVmlld0RpbWVuc2lvbnMgfSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29sYUZvcmNlRGlyZWN0ZWRTZXR0aW5ncyB7XG4gIGZvcmNlPzogQ29sYUxheW91dCAmIElEM1N0eWxlTGF5b3V0QWRhcHRvcjtcbiAgZm9yY2VNb2RpZmllckZuPzogKGZvcmNlOiBDb2xhTGF5b3V0ICYgSUQzU3R5bGVMYXlvdXRBZGFwdG9yKSA9PiBDb2xhTGF5b3V0ICYgSUQzU3R5bGVMYXlvdXRBZGFwdG9yO1xuICBvblRpY2tMaXN0ZW5lcj86IChpbnRlcm5hbEdyYXBoOiBDb2xhR3JhcGgpID0+IHZvaWQ7XG4gIHZpZXdEaW1lbnNpb25zPzogVmlld0RpbWVuc2lvbnM7XG59XG5leHBvcnQgaW50ZXJmYWNlIENvbGFHcmFwaCB7XG4gIGdyb3VwczogR3JvdXBbXTtcbiAgbm9kZXM6IElucHV0Tm9kZVtdO1xuICBsaW5rczogQXJyYXk8TGluazxudW1iZXI+Pjtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b05vZGUobm9kZXM6IElucHV0Tm9kZVtdLCBub2RlUmVmOiBJbnB1dE5vZGUgfCBudW1iZXIpOiBJbnB1dE5vZGUge1xuICBpZiAodHlwZW9mIG5vZGVSZWYgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG5vZGVzW25vZGVSZWZdO1xuICB9XG4gIHJldHVybiBub2RlUmVmO1xufVxuXG5leHBvcnQgY2xhc3MgQ29sYUZvcmNlRGlyZWN0ZWRMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xuICBkZWZhdWx0U2V0dGluZ3M6IENvbGFGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7XG4gICAgZm9yY2U6IGQzYWRhcHRvcih7XG4gICAgICAuLi5kM0Rpc3BhdGNoLFxuICAgICAgLi4uZDNGb3JjZSxcbiAgICAgIC4uLmQzVGltZXJcbiAgICB9KVxuICAgICAgLmxpbmtEaXN0YW5jZSgxNTApXG4gICAgICAuYXZvaWRPdmVybGFwcyh0cnVlKSxcbiAgICB2aWV3RGltZW5zaW9uczoge1xuICAgICAgd2lkdGg6IDYwMCxcbiAgICAgIGhlaWdodDogNjAwLFxuICAgICAgeE9mZnNldDogMFxuICAgIH1cbiAgfTtcbiAgc2V0dGluZ3M6IENvbGFGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7fTtcblxuICBpbnB1dEdyYXBoOiBHcmFwaDtcbiAgb3V0cHV0R3JhcGg6IEdyYXBoO1xuICBpbnRlcm5hbEdyYXBoOiBDb2xhR3JhcGggJiB7IGdyb3VwTGlua3M/OiBFZGdlW10gfTtcbiAgb3V0cHV0R3JhcGgkOiBTdWJqZWN0PEdyYXBoPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgZHJhZ2dpbmdTdGFydDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xuXG4gIHJ1bihncmFwaDogR3JhcGgpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XG4gICAgdGhpcy5pbnB1dEdyYXBoID0gZ3JhcGg7XG4gICAgaWYgKCF0aGlzLmlucHV0R3JhcGguY2x1c3RlcnMpIHtcbiAgICAgIHRoaXMuaW5wdXRHcmFwaC5jbHVzdGVycyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmludGVybmFsR3JhcGggPSB7XG4gICAgICBub2RlczogW1xuICAgICAgICAuLi50aGlzLmlucHV0R3JhcGgubm9kZXMubWFwKG4gPT4gKHtcbiAgICAgICAgICAuLi5uLFxuICAgICAgICAgIHdpZHRoOiBuLmRpbWVuc2lvbiA/IG4uZGltZW5zaW9uLndpZHRoIDogMjAsXG4gICAgICAgICAgaGVpZ2h0OiBuLmRpbWVuc2lvbiA/IG4uZGltZW5zaW9uLmhlaWdodCA6IDIwXG4gICAgICAgIH0pKVxuICAgICAgXSBhcyBhbnksXG4gICAgICBncm91cHM6IFtcbiAgICAgICAgLi4udGhpcy5pbnB1dEdyYXBoLmNsdXN0ZXJzLm1hcChcbiAgICAgICAgICAoY2x1c3Rlcik6IEdyb3VwID0+ICh7XG4gICAgICAgICAgICBwYWRkaW5nOiA1LFxuICAgICAgICAgICAgZ3JvdXBzOiBjbHVzdGVyLmNoaWxkTm9kZUlkc1xuICAgICAgICAgICAgICAubWFwKG5vZGVJZCA9PiA8YW55PnRoaXMuaW5wdXRHcmFwaC5jbHVzdGVycy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBub2RlSWQpKVxuICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geCA+PSAwKSxcbiAgICAgICAgICAgIGxlYXZlczogY2x1c3Rlci5jaGlsZE5vZGVJZHNcbiAgICAgICAgICAgICAgLm1hcChub2RlSWQgPT4gPGFueT50aGlzLmlucHV0R3JhcGgubm9kZXMuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKSlcbiAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHggPj0gMClcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICBdLFxuICAgICAgbGlua3M6IFtcbiAgICAgICAgLi4udGhpcy5pbnB1dEdyYXBoLmVkZ2VzXG4gICAgICAgICAgLm1hcChlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZU5vZGVJbmRleCA9IHRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgobm9kZSA9PiBlLnNvdXJjZSA9PT0gbm9kZS5pZCk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlSW5kZXggPSB0aGlzLmlucHV0R3JhcGgubm9kZXMuZmluZEluZGV4KG5vZGUgPT4gZS50YXJnZXQgPT09IG5vZGUuaWQpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZU5vZGVJbmRleCA9PT0gLTEgfHwgdGFyZ2V0Tm9kZUluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4uZSxcbiAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2VOb2RlSW5kZXgsXG4gICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0Tm9kZUluZGV4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcih4ID0+ICEheClcbiAgICAgIF0gYXMgYW55LFxuICAgICAgZ3JvdXBMaW5rczogW1xuICAgICAgICAuLi50aGlzLmlucHV0R3JhcGguZWRnZXNcbiAgICAgICAgICAubWFwKGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlTm9kZUluZGV4ID0gdGhpcy5pbnB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChub2RlID0+IGUuc291cmNlID09PSBub2RlLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGVJbmRleCA9IHRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgobm9kZSA9PiBlLnRhcmdldCA9PT0gbm9kZS5pZCk7XG4gICAgICAgICAgICBpZiAoc291cmNlTm9kZUluZGV4ID49IDAgJiYgdGFyZ2V0Tm9kZUluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcih4ID0+ICEheClcbiAgICAgIF1cbiAgICB9O1xuICAgIHRoaXMub3V0cHV0R3JhcGggPSB7XG4gICAgICBub2RlczogW10sXG4gICAgICBjbHVzdGVyczogW10sXG4gICAgICBlZGdlczogW10sXG4gICAgICBlZGdlTGFiZWxzOiBbXVxuICAgIH07XG4gICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLm91dHB1dEdyYXBoKTtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvcmNlKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmZvcmNlID0gdGhpcy5zZXR0aW5ncy5mb3JjZVxuICAgICAgICAubm9kZXModGhpcy5pbnRlcm5hbEdyYXBoLm5vZGVzKVxuICAgICAgICAuZ3JvdXBzKHRoaXMuaW50ZXJuYWxHcmFwaC5ncm91cHMpXG4gICAgICAgIC5saW5rcyh0aGlzLmludGVybmFsR3JhcGgubGlua3MpXG4gICAgICAgIC5hbHBoYSgwLjUpXG4gICAgICAgIC5vbigndGljaycsICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5vblRpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5vblRpY2tMaXN0ZW5lcih0aGlzLmludGVybmFsR3JhcGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMuaW50ZXJuYWxHcmFwaFRvT3V0cHV0R3JhcGgodGhpcy5pbnRlcm5hbEdyYXBoKSk7XG4gICAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3Mudmlld0RpbWVuc2lvbnMpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5mb3JjZSA9IHRoaXMuc2V0dGluZ3MuZm9yY2Uuc2l6ZShbXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy52aWV3RGltZW5zaW9ucy53aWR0aCxcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnZpZXdEaW1lbnNpb25zLmhlaWdodFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmZvcmNlTW9kaWZpZXJGbikge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmZvcmNlID0gdGhpcy5zZXR0aW5ncy5mb3JjZU1vZGlmaWVyRm4odGhpcy5zZXR0aW5ncy5mb3JjZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnNldHRpbmdzLmZvcmNlLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKHNldHRpbmdzLmZvcmNlKSB7XG4gICAgICBzZXR0aW5ncy5mb3JjZS5zdGFydCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoJC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGludGVybmFsR3JhcGhUb091dHB1dEdyYXBoKGludGVybmFsR3JhcGg6IGFueSk6IEdyYXBoIHtcbiAgICB0aGlzLm91dHB1dEdyYXBoLm5vZGVzID0gaW50ZXJuYWxHcmFwaC5ub2Rlcy5tYXAobm9kZSA9PiAoe1xuICAgICAgLi4ubm9kZSxcbiAgICAgIGlkOiBub2RlLmlkIHx8IGlkKCksXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiBub2RlLngsXG4gICAgICAgIHk6IG5vZGUueVxuICAgICAgfSxcbiAgICAgIGRpbWVuc2lvbjoge1xuICAgICAgICB3aWR0aDogKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCxcbiAgICAgICAgaGVpZ2h0OiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMFxuICAgICAgfSxcbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke25vZGUueCAtICgobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwKSAvIDIgfHwgMH0sICR7bm9kZS55IC1cbiAgICAgICAgKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwKSAvIDIgfHwgMH0pYFxuICAgIH0pKTtcblxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZXMgPSBpbnRlcm5hbEdyYXBoLmxpbmtzXG4gICAgICAubWFwKGVkZ2UgPT4ge1xuICAgICAgICBjb25zdCBzb3VyY2U6IGFueSA9IHRvTm9kZShpbnRlcm5hbEdyYXBoLm5vZGVzLCBlZGdlLnNvdXJjZSk7XG4gICAgICAgIGNvbnN0IHRhcmdldDogYW55ID0gdG9Ob2RlKGludGVybmFsR3JhcGgubm9kZXMsIGVkZ2UudGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5lZGdlLFxuICAgICAgICAgIHNvdXJjZTogc291cmNlLmlkLFxuICAgICAgICAgIHRhcmdldDogdGFyZ2V0LmlkLFxuICAgICAgICAgIHBvaW50czogW1xuICAgICAgICAgICAgKHNvdXJjZS5ib3VuZHMgYXMgUmVjdGFuZ2xlKS5yYXlJbnRlcnNlY3Rpb24odGFyZ2V0LmJvdW5kcy5jeCgpLCB0YXJnZXQuYm91bmRzLmN5KCkpLFxuICAgICAgICAgICAgKHRhcmdldC5ib3VuZHMgYXMgUmVjdGFuZ2xlKS5yYXlJbnRlcnNlY3Rpb24oc291cmNlLmJvdW5kcy5jeCgpLCBzb3VyY2UuYm91bmRzLmN5KCkpXG4gICAgICAgICAgXVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC5jb25jYXQoXG4gICAgICAgIGludGVybmFsR3JhcGguZ3JvdXBMaW5rcy5tYXAoZ3JvdXBMaW5rID0+IHtcbiAgICAgICAgICBjb25zdCBzb3VyY2VOb2RlID0gaW50ZXJuYWxHcmFwaC5ub2Rlcy5maW5kKGZvdW5kTm9kZSA9PiAoZm91bmROb2RlIGFzIGFueSkuaWQgPT09IGdyb3VwTGluay5zb3VyY2UpO1xuICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGUgPSBpbnRlcm5hbEdyYXBoLm5vZGVzLmZpbmQoZm91bmROb2RlID0+IChmb3VuZE5vZGUgYXMgYW55KS5pZCA9PT0gZ3JvdXBMaW5rLnRhcmdldCk7XG4gICAgICAgICAgY29uc3Qgc291cmNlID1cbiAgICAgICAgICAgIHNvdXJjZU5vZGUgfHwgaW50ZXJuYWxHcmFwaC5ncm91cHMuZmluZChmb3VuZEdyb3VwID0+IChmb3VuZEdyb3VwIGFzIGFueSkuaWQgPT09IGdyb3VwTGluay5zb3VyY2UpO1xuICAgICAgICAgIGNvbnN0IHRhcmdldCA9XG4gICAgICAgICAgICB0YXJnZXROb2RlIHx8IGludGVybmFsR3JhcGguZ3JvdXBzLmZpbmQoZm91bmRHcm91cCA9PiAoZm91bmRHcm91cCBhcyBhbnkpLmlkID09PSBncm91cExpbmsudGFyZ2V0KTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uZ3JvdXBMaW5rLFxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2UuaWQsXG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldC5pZCxcbiAgICAgICAgICAgIHBvaW50czogW1xuICAgICAgICAgICAgICAoc291cmNlLmJvdW5kcyBhcyBSZWN0YW5nbGUpLnJheUludGVyc2VjdGlvbih0YXJnZXQuYm91bmRzLmN4KCksIHRhcmdldC5ib3VuZHMuY3koKSksXG4gICAgICAgICAgICAgICh0YXJnZXQuYm91bmRzIGFzIFJlY3RhbmdsZSkucmF5SW50ZXJzZWN0aW9uKHNvdXJjZS5ib3VuZHMuY3goKSwgc291cmNlLmJvdW5kcy5jeSgpKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5jbHVzdGVycyA9IGludGVybmFsR3JhcGguZ3JvdXBzLm1hcChcbiAgICAgIChncm91cCwgaW5kZXgpOiBDbHVzdGVyTm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0R3JvdXAgPSB0aGlzLmlucHV0R3JhcGguY2x1c3RlcnNbaW5kZXhdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmlucHV0R3JvdXAsXG4gICAgICAgICAgZGltZW5zaW9uOiB7XG4gICAgICAgICAgICB3aWR0aDogZ3JvdXAuYm91bmRzID8gZ3JvdXAuYm91bmRzLndpZHRoKCkgOiAyMCxcbiAgICAgICAgICAgIGhlaWdodDogZ3JvdXAuYm91bmRzID8gZ3JvdXAuYm91bmRzLmhlaWdodCgpIDogMjBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICB4OiBncm91cC5ib3VuZHMgPyBncm91cC5ib3VuZHMueCArIGdyb3VwLmJvdW5kcy53aWR0aCgpIC8gMiA6IDAsXG4gICAgICAgICAgICB5OiBncm91cC5ib3VuZHMgPyBncm91cC5ib3VuZHMueSArIGdyb3VwLmJvdW5kcy5oZWlnaHQoKSAvIDIgOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlTGFiZWxzID0gdGhpcy5vdXRwdXRHcmFwaC5lZGdlcztcbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaDtcbiAgfVxuXG4gIG9uRHJhZ1N0YXJ0KGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5vdXRwdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgoZm91bmROb2RlID0+IGZvdW5kTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBjb25zdCBub2RlID0gdGhpcy5pbnRlcm5hbEdyYXBoLm5vZGVzW25vZGVJbmRleF07XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZHJhZ2dpbmdTdGFydCA9IHsgeDogbm9kZS54IC0gJGV2ZW50LngsIHk6IG5vZGUueSAtICRldmVudC55IH07XG4gICAgbm9kZS5maXhlZCA9IDE7XG4gICAgdGhpcy5zZXR0aW5ncy5mb3JjZS5zdGFydCgpO1xuICB9XG5cbiAgb25EcmFnKGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5vdXRwdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgoZm91bmROb2RlID0+IGZvdW5kTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBjb25zdCBub2RlID0gdGhpcy5pbnRlcm5hbEdyYXBoLm5vZGVzW25vZGVJbmRleF07XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5vZGUueCA9IHRoaXMuZHJhZ2dpbmdTdGFydC54ICsgJGV2ZW50Lng7XG4gICAgbm9kZS55ID0gdGhpcy5kcmFnZ2luZ1N0YXJ0LnkgKyAkZXZlbnQueTtcbiAgfVxuXG4gIG9uRHJhZ0VuZChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghZHJhZ2dpbmdOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMub3V0cHV0R3JhcGgubm9kZXMuZmluZEluZGV4KGZvdW5kTm9kZSA9PiBmb3VuZE5vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuaW50ZXJuYWxHcmFwaC5ub2Rlc1tub2RlSW5kZXhdO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5vZGUuZml4ZWQgPSAwO1xuICB9XG59XG4iXX0=