/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class D3ForceDirectedLayout {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDNGb3JjZURpcmVjdGVkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9sYXlvdXRzL2QzRm9yY2VEaXJlY3RlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbkYsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7OztBQUUzQyw2Q0FHQzs7O0lBRkMsd0NBQVk7O0lBQ1osNENBQWdCOzs7OztBQUVsQiw0QkFRQzs7O0lBUEMsb0JBQVk7O0lBQ1osbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsdUJBQWU7O0lBQ2Ysd0JBQWdCOztJQUNoQixvQkFBWTs7SUFDWixvQkFBWTs7Ozs7QUFFZCw0QkFHQzs7O0lBRkMsd0JBQXdCOztJQUN4Qix3QkFBd0I7Ozs7O0FBRTFCLDZCQUdDOzs7SUFGQyx3QkFBZ0I7O0lBQ2hCLHdCQUFnQjs7Ozs7QUFFbEIsZ0NBRUM7OztJQURDLHdCQUFXOzs7Ozs7QUFHYixNQUFNLFVBQVUsUUFBUSxDQUFDLFNBQTBCO0lBQ2pELElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFO1FBQ2pDLE9BQU87WUFDTCxFQUFFLEVBQUUsU0FBUztZQUNiLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7U0FDTCxDQUFDO0tBQ0g7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxPQUFPLHFCQUFxQjtJQUFsQztRQUNFLG9CQUFlLEdBQTRCO1lBQ3pDLEtBQUssRUFBRSxlQUFlLEVBQU87aUJBQzFCLEtBQUssQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFD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QyxDQUFDO1FBQ25DLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQ3RCLENBQUM7Q0FDRjs7O0lBcElDLGdEQU9FOztJQUNGLHlDQUF1Qzs7SUFFdkMsMkNBQWtCOztJQUNsQiw0Q0FBbUI7O0lBQ25CLHdDQUFpQjs7SUFDakIsNkNBQTZDOztJQUU3Qyw4Q0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcbmltcG9ydCB7IGZvcmNlQ29sbGlkZSwgZm9yY2VMaW5rLCBmb3JjZU1hbnlCb2R5LCBmb3JjZVNpbXVsYXRpb24gfSBmcm9tICdkMy1mb3JjZSc7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEQzRm9yY2VEaXJlY3RlZFNldHRpbmdzIHtcbiAgZm9yY2U/OiBhbnk7XG4gIGZvcmNlTGluaz86IGFueTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRDNOb2RlIHtcbiAgaWQ/OiBzdHJpbmc7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBmeD86IG51bWJlcjtcbiAgZnk/OiBudW1iZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIEQzRWRnZSB7XG4gIHNvdXJjZTogc3RyaW5nIHwgRDNOb2RlO1xuICB0YXJnZXQ6IHN0cmluZyB8IEQzTm9kZTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRDNHcmFwaCB7XG4gIG5vZGVzOiBEM05vZGVbXTtcbiAgZWRnZXM6IEQzRWRnZVtdO1xufVxuZXhwb3J0IGludGVyZmFjZSBNZXJnZWROb2RlIGV4dGVuZHMgRDNOb2RlLCBOb2RlIHtcbiAgaWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRDNOb2RlKG1heWJlTm9kZTogc3RyaW5nIHwgRDNOb2RlKTogRDNOb2RlIHtcbiAgaWYgKHR5cGVvZiBtYXliZU5vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBtYXliZU5vZGUsXG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIG1heWJlTm9kZTtcbn1cblxuZXhwb3J0IGNsYXNzIEQzRm9yY2VEaXJlY3RlZExheW91dCBpbXBsZW1lbnRzIExheW91dCB7XG4gIGRlZmF1bHRTZXR0aW5nczogRDNGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7XG4gICAgZm9yY2U6IGZvcmNlU2ltdWxhdGlvbjxhbnk+KClcbiAgICAgIC5mb3JjZSgnY2hhcmdlJywgZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKC0xNTApKVxuICAgICAgLmZvcmNlKCdjb2xsaWRlJywgZm9yY2VDb2xsaWRlKDUpKSxcbiAgICBmb3JjZUxpbms6IGZvcmNlTGluazxhbnksIGFueT4oKVxuICAgICAgLmlkKG5vZGUgPT4gbm9kZS5pZClcbiAgICAgIC5kaXN0YW5jZSgoKSA9PiAxMDApXG4gIH07XG4gIHNldHRpbmdzOiBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHt9O1xuXG4gIGlucHV0R3JhcGg6IEdyYXBoO1xuICBvdXRwdXRHcmFwaDogR3JhcGg7XG4gIGQzR3JhcGg6IEQzR3JhcGg7XG4gIG91dHB1dEdyYXBoJDogU3ViamVjdDxHcmFwaD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGRyYWdnaW5nU3RhcnQ6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcblxuICBydW4oZ3JhcGg6IEdyYXBoKTogT2JzZXJ2YWJsZTxHcmFwaD4ge1xuICAgIHRoaXMuaW5wdXRHcmFwaCA9IGdyYXBoO1xuICAgIHRoaXMuZDNHcmFwaCA9IHtcbiAgICAgIG5vZGVzOiBbLi4udGhpcy5pbnB1dEdyYXBoLm5vZGVzLm1hcChuID0+ICh7IC4uLm4gfSkpXSBhcyBhbnksXG4gICAgICBlZGdlczogWy4uLnRoaXMuaW5wdXRHcmFwaC5lZGdlcy5tYXAoZSA9PiAoeyAuLi5lIH0pKV0gYXMgYW55XG4gICAgfTtcbiAgICB0aGlzLm91dHB1dEdyYXBoID0ge1xuICAgICAgbm9kZXM6IFtdLFxuICAgICAgZWRnZXM6IFtdLFxuICAgICAgZWRnZUxhYmVsczogW11cbiAgICB9O1xuICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5vdXRwdXRHcmFwaCk7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5mb3JjZSkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5mb3JjZVxuICAgICAgICAubm9kZXModGhpcy5kM0dyYXBoLm5vZGVzKVxuICAgICAgICAuZm9yY2UoJ2xpbmsnLCB0aGlzLnNldHRpbmdzLmZvcmNlTGluay5saW5rcyh0aGlzLmQzR3JhcGguZWRnZXMpKVxuICAgICAgICAuYWxwaGEoMC41KVxuICAgICAgICAucmVzdGFydCgpXG4gICAgICAgIC5vbigndGljaycsICgpID0+IHtcbiAgICAgICAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMuZDNHcmFwaFRvT3V0cHV0R3JhcGgodGhpcy5kM0dyYXBoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoJC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogT2JzZXJ2YWJsZTxHcmFwaD4ge1xuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmIChzZXR0aW5ncy5mb3JjZSkge1xuICAgICAgc2V0dGluZ3MuZm9yY2VcbiAgICAgICAgLm5vZGVzKHRoaXMuZDNHcmFwaC5ub2RlcylcbiAgICAgICAgLmZvcmNlKCdsaW5rJywgc2V0dGluZ3MuZm9yY2VMaW5rLmxpbmtzKHRoaXMuZDNHcmFwaC5lZGdlcykpXG4gICAgICAgIC5hbHBoYSgwLjUpXG4gICAgICAgIC5yZXN0YXJ0KClcbiAgICAgICAgLm9uKCd0aWNrJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5kM0dyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmQzR3JhcGgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZDNHcmFwaFRvT3V0cHV0R3JhcGgoZDNHcmFwaDogRDNHcmFwaCk6IEdyYXBoIHtcbiAgICB0aGlzLm91dHB1dEdyYXBoLm5vZGVzID0gdGhpcy5kM0dyYXBoLm5vZGVzLm1hcCgobm9kZTogTWVyZ2VkTm9kZSkgPT4gKHtcbiAgICAgIC4uLm5vZGUsXG4gICAgICBpZDogbm9kZS5pZCB8fCBpZCgpLFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogbm9kZS54LFxuICAgICAgICB5OiBub2RlLnlcbiAgICAgIH0sXG4gICAgICBkaW1lbnNpb246IHtcbiAgICAgICAgd2lkdGg6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjAsXG4gICAgICAgIGhlaWdodDogKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLmhlaWdodCkgfHwgMjBcbiAgICAgIH0sXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtub2RlLnggLSAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCkgLyAyIHx8IDB9LCAke25vZGUueSAtXG4gICAgICAgICgobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMCkgLyAyIHx8IDB9KWBcbiAgICB9KSk7XG5cbiAgICB0aGlzLm91dHB1dEdyYXBoLmVkZ2VzID0gdGhpcy5kM0dyYXBoLmVkZ2VzLm1hcChlZGdlID0+ICh7XG4gICAgICAuLi5lZGdlLFxuICAgICAgc291cmNlOiB0b0QzTm9kZShlZGdlLnNvdXJjZSkuaWQsXG4gICAgICB0YXJnZXQ6IHRvRDNOb2RlKGVkZ2UudGFyZ2V0KS5pZCxcbiAgICAgIHBvaW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgeDogdG9EM05vZGUoZWRnZS5zb3VyY2UpLngsXG4gICAgICAgICAgeTogdG9EM05vZGUoZWRnZS5zb3VyY2UpLnlcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHg6IHRvRDNOb2RlKGVkZ2UudGFyZ2V0KS54LFxuICAgICAgICAgIHk6IHRvRDNOb2RlKGVkZ2UudGFyZ2V0KS55XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KSk7XG5cbiAgICB0aGlzLm91dHB1dEdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLm91dHB1dEdyYXBoLmVkZ2VzO1xuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoO1xuICB9XG5cbiAgb25EcmFnU3RhcnQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNldHRpbmdzLmZvcmNlLmFscGhhVGFyZ2V0KDAuMykucmVzdGFydCgpO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmQzR3JhcGgubm9kZXMuZmluZChkM05vZGUgPT4gZDNOb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRyYWdnaW5nU3RhcnQgPSB7IHg6ICRldmVudC54IC0gbm9kZS54LCB5OiAkZXZlbnQueSAtIG5vZGUueSB9O1xuICAgIG5vZGUuZnggPSAkZXZlbnQueCAtIHRoaXMuZHJhZ2dpbmdTdGFydC54O1xuICAgIG5vZGUuZnkgPSAkZXZlbnQueSAtIHRoaXMuZHJhZ2dpbmdTdGFydC55O1xuICB9XG5cbiAgb25EcmFnKGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5vZGUuZnggPSAkZXZlbnQueCAtIHRoaXMuZHJhZ2dpbmdTdGFydC54O1xuICAgIG5vZGUuZnkgPSAkZXZlbnQueSAtIHRoaXMuZHJhZ2dpbmdTdGFydC55O1xuICB9XG5cbiAgb25EcmFnRW5kKGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXR0aW5ncy5mb3JjZS5hbHBoYVRhcmdldCgwKTtcbiAgICBub2RlLmZ4ID0gdW5kZWZpbmVkO1xuICAgIG5vZGUuZnkgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==