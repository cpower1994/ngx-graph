/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { id } from '../../utils/id';
import { forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { Subject } from 'rxjs';
/**
 * @record
 */
export function D3ForceDirectedSettings() { }
if (false) {
    /** @type {?|undefined} */
    D3ForceDirectedSettings.prototype.force;
    /** @type {?|undefined} */
    D3ForceDirectedSettings.prototype.forceLink;
}
/**
 * @record
 */
export function D3Node() { }
if (false) {
    /** @type {?|undefined} */
    D3Node.prototype.id;
    /** @type {?} */
    D3Node.prototype.x;
    /** @type {?} */
    D3Node.prototype.y;
    /** @type {?|undefined} */
    D3Node.prototype.width;
    /** @type {?|undefined} */
    D3Node.prototype.height;
    /** @type {?|undefined} */
    D3Node.prototype.fx;
    /** @type {?|undefined} */
    D3Node.prototype.fy;
}
/**
 * @record
 */
export function D3Edge() { }
if (false) {
    /** @type {?} */
    D3Edge.prototype.source;
    /** @type {?} */
    D3Edge.prototype.target;
}
/**
 * @record
 */
export function D3Graph() { }
if (false) {
    /** @type {?} */
    D3Graph.prototype.nodes;
    /** @type {?} */
    D3Graph.prototype.edges;
}
/**
 * @record
 */
export function MergedNode() { }
if (false) {
    /** @type {?} */
    MergedNode.prototype.id;
}
/**
 * @param {?} maybeNode
 * @return {?}
 */
export function toD3Node(maybeNode) {
    if (typeof maybeNode === 'string') {
        return {
            id: maybeNode,
            x: 0,
            y: 0
        };
    }
    return maybeNode;
}
var D3ForceDirectedLayout = /** @class */ (function () {
    function D3ForceDirectedLayout() {
        this.defaultSettings = {
            force: forceSimulation()
                .force('charge', forceManyBody().strength(-150))
                .force('collide', forceCollide(5)),
            forceLink: forceLink()
                .id(function (node) { return node.id; })
                .distance(function () { return 100; })
        };
        this.settings = {};
        this.outputGraph$ = new Subject();
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.run = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        var _this = this;
        this.inputGraph = graph;
        this.d3Graph = {
            nodes: (/** @type {?} */ (tslib_1.__spread(this.inputGraph.nodes.map(function (n) { return (tslib_1.__assign({}, n)); })))),
            edges: (/** @type {?} */ (tslib_1.__spread(this.inputGraph.edges.map(function (e) { return (tslib_1.__assign({}, e)); }))))
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
                .on('tick', function () {
                _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    };
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.updateEdge = /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    function (graph, edge) {
        var _this = this;
        /** @type {?} */
        var settings = Object.assign({}, this.defaultSettings, this.settings);
        if (settings.force) {
            settings.force
                .nodes(this.d3Graph.nodes)
                .force('link', settings.forceLink.links(this.d3Graph.edges))
                .alpha(0.5)
                .restart()
                .on('tick', function () {
                _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    };
    /**
     * @param {?} d3Graph
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.d3GraphToOutputGraph = /**
     * @param {?} d3Graph
     * @return {?}
     */
    function (d3Graph) {
        this.outputGraph.nodes = this.d3Graph.nodes.map(function (node) { return (tslib_1.__assign({}, node, { id: node.id || id(), position: {
                x: node.x,
                y: node.y
            }, dimension: {
                width: (node.dimension && node.dimension.width) || 20,
                height: (node.dimension && node.dimension.height) || 20
            }, transform: "translate(" + (node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0) + ", " + (node.y -
                ((node.dimension && node.dimension.height) || 20) / 2 || 0) + ")" })); });
        this.outputGraph.edges = this.d3Graph.edges.map(function (edge) { return (tslib_1.__assign({}, edge, { source: toD3Node(edge.source).id, target: toD3Node(edge.target).id, points: [
                {
                    x: toD3Node(edge.source).x,
                    y: toD3Node(edge.source).y
                },
                {
                    x: toD3Node(edge.target).x,
                    y: toD3Node(edge.target).y
                }
            ] })); });
        this.outputGraph.edgeLabels = this.outputGraph.edges;
        return this.outputGraph;
    };
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.onDragStart = /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    function (draggingNode, $event) {
        this.settings.force.alphaTarget(0.3).restart();
        /** @type {?} */
        var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
        if (!node) {
            return;
        }
        this.draggingStart = { x: $event.x - node.x, y: $event.y - node.y };
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    };
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.onDrag = /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    function (draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
        if (!node) {
            return;
        }
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    };
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.onDragEnd = /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    function (draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
        if (!node) {
            return;
        }
        this.settings.force.alphaTarget(0);
        node.fx = undefined;
        node.fy = undefined;
    };
    return D3ForceDirectedLayout;
}());
export { D3ForceDirectedLayout };
if (false) {
    /** @type {?} */
    D3ForceDirectedLayout.prototype.defaultSettings;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.settings;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.inputGraph;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.outputGraph;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.d3Graph;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.outputGraph$;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.draggingStart;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDNGb3JjZURpcmVjdGVkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9sYXlvdXRzL2QzRm9yY2VEaXJlY3RlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRW5GLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFFM0MsNkNBR0M7OztJQUZDLHdDQUFZOztJQUNaLDRDQUFnQjs7Ozs7QUFFbEIsNEJBUUM7OztJQVBDLG9CQUFZOztJQUNaLG1CQUFVOztJQUNWLG1CQUFVOztJQUNWLHVCQUFlOztJQUNmLHdCQUFnQjs7SUFDaEIsb0JBQVk7O0lBQ1osb0JBQVk7Ozs7O0FBRWQsNEJBR0M7OztJQUZDLHdCQUF3Qjs7SUFDeEIsd0JBQXdCOzs7OztBQUUxQiw2QkFHQzs7O0lBRkMsd0JBQWdCOztJQUNoQix3QkFBZ0I7Ozs7O0FBRWxCLGdDQUVDOzs7SUFEQyx3QkFBVzs7Ozs7O0FBR2IsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUEwQjtJQUNqRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtRQUNqQyxPQUFPO1lBQ0wsRUFBRSxFQUFFLFNBQVM7WUFDYixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztLQUNIO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVEO0lBQUE7UUFDRSxvQkFBZSxHQUE0QjtZQUN6QyxLQUFLLEVBQUUsZUFBZSxFQUFPO2lCQUMxQixLQUFLLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUMvQyxLQUFL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N0IsQ0FBNkIsQ0FBQztRQUM3RSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQ3RCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFySUQsSUFxSUM7Ozs7SUFwSUMsZ0RBT0U7O0lBQ0YseUNBQXVDOztJQUV2QywyQ0FBa0I7O0lBQ2xCLDRDQUFtQjs7SUFDbkIsd0NBQWlCOztJQUNqQiw2Q0FBNkM7O0lBRTdDLDhDQUF3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xuaW1wb3J0IHsgZm9yY2VDb2xsaWRlLCBmb3JjZUxpbmssIGZvcmNlTWFueUJvZHksIGZvcmNlU2ltdWxhdGlvbiB9IGZyb20gJ2QzLWZvcmNlJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRDNGb3JjZURpcmVjdGVkU2V0dGluZ3Mge1xuICBmb3JjZT86IGFueTtcbiAgZm9yY2VMaW5rPzogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBEM05vZGUge1xuICBpZD86IHN0cmluZztcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIGZ4PzogbnVtYmVyO1xuICBmeT86IG51bWJlcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRDNFZGdlIHtcbiAgc291cmNlOiBzdHJpbmcgfCBEM05vZGU7XG4gIHRhcmdldDogc3RyaW5nIHwgRDNOb2RlO1xufVxuZXhwb3J0IGludGVyZmFjZSBEM0dyYXBoIHtcbiAgbm9kZXM6IEQzTm9kZVtdO1xuICBlZGdlczogRDNFZGdlW107XG59XG5leHBvcnQgaW50ZXJmYWNlIE1lcmdlZE5vZGUgZXh0ZW5kcyBEM05vZGUsIE5vZGUge1xuICBpZDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9EM05vZGUobWF5YmVOb2RlOiBzdHJpbmcgfCBEM05vZGUpOiBEM05vZGUge1xuICBpZiAodHlwZW9mIG1heWJlTm9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IG1heWJlTm9kZSxcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuICByZXR1cm4gbWF5YmVOb2RlO1xufVxuXG5leHBvcnQgY2xhc3MgRDNGb3JjZURpcmVjdGVkTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcbiAgZGVmYXVsdFNldHRpbmdzOiBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHtcbiAgICBmb3JjZTogZm9yY2VTaW11bGF0aW9uPGFueT4oKVxuICAgICAgLmZvcmNlKCdjaGFyZ2UnLCBmb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoLTE1MCkpXG4gICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBmb3JjZUNvbGxpZGUoNSkpLFxuICAgIGZvcmNlTGluazogZm9yY2VMaW5rPGFueSwgYW55PigpXG4gICAgICAuaWQobm9kZSA9PiBub2RlLmlkKVxuICAgICAgLmRpc3RhbmNlKCgpID0+IDEwMClcbiAgfTtcbiAgc2V0dGluZ3M6IEQzRm9yY2VEaXJlY3RlZFNldHRpbmdzID0ge307XG5cbiAgaW5wdXRHcmFwaDogR3JhcGg7XG4gIG91dHB1dEdyYXBoOiBHcmFwaDtcbiAgZDNHcmFwaDogRDNHcmFwaDtcbiAgb3V0cHV0R3JhcGgkOiBTdWJqZWN0PEdyYXBoPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgZHJhZ2dpbmdTdGFydDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xuXG4gIHJ1bihncmFwaDogR3JhcGgpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XG4gICAgdGhpcy5pbnB1dEdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5kM0dyYXBoID0ge1xuICAgICAgbm9kZXM6IFsuLi50aGlzLmlucHV0R3JhcGgubm9kZXMubWFwKG4gPT4gKHsgLi4ubiB9KSldIGFzIGFueSxcbiAgICAgIGVkZ2VzOiBbLi4udGhpcy5pbnB1dEdyYXBoLmVkZ2VzLm1hcChlID0+ICh7IC4uLmUgfSkpXSBhcyBhbnlcbiAgICB9O1xuICAgIHRoaXMub3V0cHV0R3JhcGggPSB7XG4gICAgICBub2RlczogW10sXG4gICAgICBlZGdlczogW10sXG4gICAgICBlZGdlTGFiZWxzOiBbXVxuICAgIH07XG4gICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLm91dHB1dEdyYXBoKTtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvcmNlKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmZvcmNlXG4gICAgICAgIC5ub2Rlcyh0aGlzLmQzR3JhcGgubm9kZXMpXG4gICAgICAgIC5mb3JjZSgnbGluaycsIHRoaXMuc2V0dGluZ3MuZm9yY2VMaW5rLmxpbmtzKHRoaXMuZDNHcmFwaC5lZGdlcykpXG4gICAgICAgIC5hbHBoYSgwLjUpXG4gICAgICAgIC5yZXN0YXJ0KClcbiAgICAgICAgLm9uKCd0aWNrJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5kM0dyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmQzR3JhcGgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKHNldHRpbmdzLmZvcmNlKSB7XG4gICAgICBzZXR0aW5ncy5mb3JjZVxuICAgICAgICAubm9kZXModGhpcy5kM0dyYXBoLm5vZGVzKVxuICAgICAgICAuZm9yY2UoJ2xpbmsnLCBzZXR0aW5ncy5mb3JjZUxpbmsubGlua3ModGhpcy5kM0dyYXBoLmVkZ2VzKSlcbiAgICAgICAgLmFscGhhKDAuNSlcbiAgICAgICAgLnJlc3RhcnQoKVxuICAgICAgICAub24oJ3RpY2snLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLmQzR3JhcGhUb091dHB1dEdyYXBoKHRoaXMuZDNHcmFwaCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBkM0dyYXBoVG9PdXRwdXRHcmFwaChkM0dyYXBoOiBEM0dyYXBoKTogR3JhcGgge1xuICAgIHRoaXMub3V0cHV0R3JhcGgubm9kZXMgPSB0aGlzLmQzR3JhcGgubm9kZXMubWFwKChub2RlOiBNZXJnZWROb2RlKSA9PiAoe1xuICAgICAgLi4ubm9kZSxcbiAgICAgIGlkOiBub2RlLmlkIHx8IGlkKCksXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiBub2RlLngsXG4gICAgICAgIHk6IG5vZGUueVxuICAgICAgfSxcbiAgICAgIGRpbWVuc2lvbjoge1xuICAgICAgICB3aWR0aDogKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCxcbiAgICAgICAgaGVpZ2h0OiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMFxuICAgICAgfSxcbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke25vZGUueCAtICgobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwKSAvIDIgfHwgMH0sICR7bm9kZS55IC1cbiAgICAgICAgKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwKSAvIDIgfHwgMH0pYFxuICAgIH0pKTtcblxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZXMgPSB0aGlzLmQzR3JhcGguZWRnZXMubWFwKGVkZ2UgPT4gKHtcbiAgICAgIC4uLmVkZ2UsXG4gICAgICBzb3VyY2U6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS5pZCxcbiAgICAgIHRhcmdldDogdG9EM05vZGUoZWRnZS50YXJnZXQpLmlkLFxuICAgICAgcG9pbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB4OiB0b0QzTm9kZShlZGdlLnNvdXJjZSkueCxcbiAgICAgICAgICB5OiB0b0QzTm9kZShlZGdlLnNvdXJjZSkueVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgeDogdG9EM05vZGUoZWRnZS50YXJnZXQpLngsXG4gICAgICAgICAgeTogdG9EM05vZGUoZWRnZS50YXJnZXQpLnlcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pKTtcblxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZUxhYmVscyA9IHRoaXMub3V0cHV0R3JhcGguZWRnZXM7XG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGg7XG4gIH1cblxuICBvbkRyYWdTdGFydChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UuYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZHJhZ2dpbmdTdGFydCA9IHsgeDogJGV2ZW50LnggLSBub2RlLngsIHk6ICRldmVudC55IC0gbm9kZS55IH07XG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XG4gICAgbm9kZS5meSA9ICRldmVudC55IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lnk7XG4gIH1cblxuICBvbkRyYWcoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XG4gICAgbm9kZS5meSA9ICRldmVudC55IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lnk7XG4gIH1cblxuICBvbkRyYWdFbmQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldHRpbmdzLmZvcmNlLmFscGhhVGFyZ2V0KDApO1xuICAgIG5vZGUuZnggPSB1bmRlZmluZWQ7XG4gICAgbm9kZS5meSA9IHVuZGVmaW5lZDtcbiAgfVxufVxuIl19