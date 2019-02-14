/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class ColaForceDirectedLayout {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sYUZvcmNlRGlyZWN0ZWQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvY29sYUZvcmNlRGlyZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUdBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUUsU0FBUyxFQUFrRixNQUFNLFNBQVMsQ0FBQztBQUNwSCxPQUFPLEtBQUssVUFBVSxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEtBQUssT0FBTyxNQUFNLFVBQVUsQ0FBQztBQUNwQyxPQUFPLEtBQUssT0FBTyxNQUFNLFVBQVUsQ0FBQztBQUVwQyxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7O0FBRzNDLCtDQUtDOzs7SUFKQywwQ0FBMkM7O0lBQzNDLG9EQUFvRzs7SUFDcEcsbURBQW9EOztJQUNwRCxtREFBZ0M7Ozs7O0FBRWxDLCtCQUlDOzs7SUFIQywyQkFBZ0I7O0lBQ2hCLDBCQUFtQjs7SUFDbkIsMEJBQTJCOzs7Ozs7O0FBRTdCLE1BQU0sVUFBVSxNQUFNLENBQUMsS0FBa0IsRUFBRSxPQUEyQjtJQUNwRSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUMvQixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN2QjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxNQUFNLE9BQU8sdUJBQXVCO0lBQXBDO1FBQ0Usb0JBQWUsR0FBOEI7WUFDM0MsS0FBSyxFQUFFLFNBQVMsbUJBQ1gsVUFBVSxFQUNWLE9BQU8sRUFDUCxPQUFPLEVBQ1Y7aUJBQ0MsWUFBWSxDQUFDLEdBQUcsQ0FBQztpQkFDakIsYUFBYSxDQUFDLElBQUksQ0FBQztZQUN0QixjQUFjLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsTUFBTSxFQUFFLEdBQUc7Z0JB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UyxDQUFDO1FBQ2hELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDO0NBQ0Y7OztJQXBPQyxrREFhRTs7SUFDRiwyQ0FBeUM7O0lBRXpDLDZDQUFrQjs7SUFDbEIsOENBQW1COztJQUNuQixnREFBbUQ7O0lBQ25ELCtDQUE2Qzs7SUFFN0MsZ0RBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xuaW1wb3J0IHsgZDNhZGFwdG9yLCBJRDNTdHlsZUxheW91dEFkYXB0b3IsIExheW91dCBhcyBDb2xhTGF5b3V0LCBHcm91cCwgSW5wdXROb2RlLCBMaW5rLCBSZWN0YW5nbGUgfSBmcm9tICd3ZWJjb2xhJztcbmltcG9ydCAqIGFzIGQzRGlzcGF0Y2ggZnJvbSAnZDMtZGlzcGF0Y2gnO1xuaW1wb3J0ICogYXMgZDNGb3JjZSBmcm9tICdkMy1mb3JjZSc7XG5pbXBvcnQgKiBhcyBkM1RpbWVyIGZyb20gJ2QzLXRpbWVyJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBWaWV3RGltZW5zaW9ucyB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb2xhRm9yY2VEaXJlY3RlZFNldHRpbmdzIHtcbiAgZm9yY2U/OiBDb2xhTGF5b3V0ICYgSUQzU3R5bGVMYXlvdXRBZGFwdG9yO1xuICBmb3JjZU1vZGlmaWVyRm4/OiAoZm9yY2U6IENvbGFMYXlvdXQgJiBJRDNTdHlsZUxheW91dEFkYXB0b3IpID0+IENvbGFMYXlvdXQgJiBJRDNTdHlsZUxheW91dEFkYXB0b3I7XG4gIG9uVGlja0xpc3RlbmVyPzogKGludGVybmFsR3JhcGg6IENvbGFHcmFwaCkgPT4gdm9pZDtcbiAgdmlld0RpbWVuc2lvbnM/OiBWaWV3RGltZW5zaW9ucztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29sYUdyYXBoIHtcbiAgZ3JvdXBzOiBHcm91cFtdO1xuICBub2RlczogSW5wdXROb2RlW107XG4gIGxpbmtzOiBBcnJheTxMaW5rPG51bWJlcj4+O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvTm9kZShub2RlczogSW5wdXROb2RlW10sIG5vZGVSZWY6IElucHV0Tm9kZSB8IG51bWJlcik6IElucHV0Tm9kZSB7XG4gIGlmICh0eXBlb2Ygbm9kZVJlZiA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbm9kZXNbbm9kZVJlZl07XG4gIH1cbiAgcmV0dXJuIG5vZGVSZWY7XG59XG5cbmV4cG9ydCBjbGFzcyBDb2xhRm9yY2VEaXJlY3RlZExheW91dCBpbXBsZW1lbnRzIExheW91dCB7XG4gIGRlZmF1bHRTZXR0aW5nczogQ29sYUZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHtcbiAgICBmb3JjZTogZDNhZGFwdG9yKHtcbiAgICAgIC4uLmQzRGlzcGF0Y2gsXG4gICAgICAuLi5kM0ZvcmNlLFxuICAgICAgLi4uZDNUaW1lclxuICAgIH0pXG4gICAgICAubGlua0Rpc3RhbmNlKDE1MClcbiAgICAgIC5hdm9pZE92ZXJsYXBzKHRydWUpLFxuICAgIHZpZXdEaW1lbnNpb25zOiB7XG4gICAgICB3aWR0aDogNjAwLFxuICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICB4T2Zmc2V0OiAwXG4gICAgfVxuICB9O1xuICBzZXR0aW5nczogQ29sYUZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHt9O1xuXG4gIGlucHV0R3JhcGg6IEdyYXBoO1xuICBvdXRwdXRHcmFwaDogR3JhcGg7XG4gIGludGVybmFsR3JhcGg6IENvbGFHcmFwaCAmIHsgZ3JvdXBMaW5rcz86IEVkZ2VbXSB9O1xuICBvdXRwdXRHcmFwaCQ6IFN1YmplY3Q8R3JhcGg+ID0gbmV3IFN1YmplY3QoKTtcblxuICBkcmFnZ2luZ1N0YXJ0OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH07XG5cbiAgcnVuKGdyYXBoOiBHcmFwaCk6IE9ic2VydmFibGU8R3JhcGg+IHtcbiAgICB0aGlzLmlucHV0R3JhcGggPSBncmFwaDtcbiAgICBpZiAoIXRoaXMuaW5wdXRHcmFwaC5jbHVzdGVycykge1xuICAgICAgdGhpcy5pbnB1dEdyYXBoLmNsdXN0ZXJzID0gW107XG4gICAgfVxuICAgIHRoaXMuaW50ZXJuYWxHcmFwaCA9IHtcbiAgICAgIG5vZGVzOiBbXG4gICAgICAgIC4uLnRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5tYXAobiA9PiAoe1xuICAgICAgICAgIC4uLm4sXG4gICAgICAgICAgd2lkdGg6IG4uZGltZW5zaW9uID8gbi5kaW1lbnNpb24ud2lkdGggOiAyMCxcbiAgICAgICAgICBoZWlnaHQ6IG4uZGltZW5zaW9uID8gbi5kaW1lbnNpb24uaGVpZ2h0IDogMjBcbiAgICAgICAgfSkpXG4gICAgICBdIGFzIGFueSxcbiAgICAgIGdyb3VwczogW1xuICAgICAgICAuLi50aGlzLmlucHV0R3JhcGguY2x1c3RlcnMubWFwKFxuICAgICAgICAgIChjbHVzdGVyKTogR3JvdXAgPT4gKHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDUsXG4gICAgICAgICAgICBncm91cHM6IGNsdXN0ZXIuY2hpbGROb2RlSWRzXG4gICAgICAgICAgICAgIC5tYXAobm9kZUlkID0+IDxhbnk+dGhpcy5pbnB1dEdyYXBoLmNsdXN0ZXJzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVJZCkpXG4gICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4ID49IDApLFxuICAgICAgICAgICAgbGVhdmVzOiBjbHVzdGVyLmNoaWxkTm9kZUlkc1xuICAgICAgICAgICAgICAubWFwKG5vZGVJZCA9PiA8YW55PnRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBub2RlSWQpKVxuICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geCA+PSAwKVxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgIF0sXG4gICAgICBsaW5rczogW1xuICAgICAgICAuLi50aGlzLmlucHV0R3JhcGguZWRnZXNcbiAgICAgICAgICAubWFwKGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlTm9kZUluZGV4ID0gdGhpcy5pbnB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChub2RlID0+IGUuc291cmNlID09PSBub2RlLmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGVJbmRleCA9IHRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgobm9kZSA9PiBlLnRhcmdldCA9PT0gbm9kZS5pZCk7XG4gICAgICAgICAgICBpZiAoc291cmNlTm9kZUluZGV4ID09PSAtMSB8fCB0YXJnZXROb2RlSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5lLFxuICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZU5vZGVJbmRleCxcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXROb2RlSW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKHggPT4gISF4KVxuICAgICAgXSBhcyBhbnksXG4gICAgICBncm91cExpbmtzOiBbXG4gICAgICAgIC4uLnRoaXMuaW5wdXRHcmFwaC5lZGdlc1xuICAgICAgICAgIC5tYXAoZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VOb2RlSW5kZXggPSB0aGlzLmlucHV0R3JhcGgubm9kZXMuZmluZEluZGV4KG5vZGUgPT4gZS5zb3VyY2UgPT09IG5vZGUuaWQpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZUluZGV4ID0gdGhpcy5pbnB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChub2RlID0+IGUudGFyZ2V0ID09PSBub2RlLmlkKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VOb2RlSW5kZXggPj0gMCAmJiB0YXJnZXROb2RlSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKHggPT4gISF4KVxuICAgICAgXVxuICAgIH07XG4gICAgdGhpcy5vdXRwdXRHcmFwaCA9IHtcbiAgICAgIG5vZGVzOiBbXSxcbiAgICAgIGNsdXN0ZXJzOiBbXSxcbiAgICAgIGVkZ2VzOiBbXSxcbiAgICAgIGVkZ2VMYWJlbHM6IFtdXG4gICAgfTtcbiAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMub3V0cHV0R3JhcGgpO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZm9yY2UpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UgPSB0aGlzLnNldHRpbmdzLmZvcmNlXG4gICAgICAgIC5ub2Rlcyh0aGlzLmludGVybmFsR3JhcGgubm9kZXMpXG4gICAgICAgIC5ncm91cHModGhpcy5pbnRlcm5hbEdyYXBoLmdyb3VwcylcbiAgICAgICAgLmxpbmtzKHRoaXMuaW50ZXJuYWxHcmFwaC5saW5rcylcbiAgICAgICAgLmFscGhhKDAuNSlcbiAgICAgICAgLm9uKCd0aWNrJywgKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm9uVGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLm9uVGlja0xpc3RlbmVyKHRoaXMuaW50ZXJuYWxHcmFwaCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5pbnRlcm5hbEdyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmludGVybmFsR3JhcGgpKTtcbiAgICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy52aWV3RGltZW5zaW9ucykge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmZvcmNlID0gdGhpcy5zZXR0aW5ncy5mb3JjZS5zaXplKFtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnZpZXdEaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3Mudmlld0RpbWVuc2lvbnMuaGVpZ2h0XG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZm9yY2VNb2RpZmllckZuKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UgPSB0aGlzLnNldHRpbmdzLmZvcmNlTW9kaWZpZXJGbih0aGlzLnNldHRpbmdzLmZvcmNlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2Uuc3RhcnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IE9ic2VydmFibGU8R3JhcGg+IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICBpZiAoc2V0dGluZ3MuZm9yY2UpIHtcbiAgICAgIHNldHRpbmdzLmZvcmNlLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgaW50ZXJuYWxHcmFwaFRvT3V0cHV0R3JhcGgoaW50ZXJuYWxHcmFwaDogYW55KTogR3JhcGgge1xuICAgIHRoaXMub3V0cHV0R3JhcGgubm9kZXMgPSBpbnRlcm5hbEdyYXBoLm5vZGVzLm1hcChub2RlID0+ICh7XG4gICAgICAuLi5ub2RlLFxuICAgICAgaWQ6IG5vZGUuaWQgfHwgaWQoKSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IG5vZGUueCxcbiAgICAgICAgeTogbm9kZS55XG4gICAgICB9LFxuICAgICAgZGltZW5zaW9uOiB7XG4gICAgICAgIHdpZHRoOiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwLFxuICAgICAgICBoZWlnaHQ6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwXG4gICAgICB9LFxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7bm9kZS54IC0gKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjApIC8gMiB8fCAwfSwgJHtub2RlLnkgLVxuICAgICAgICAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLmhlaWdodCkgfHwgMjApIC8gMiB8fCAwfSlgXG4gICAgfSkpO1xuXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlcyA9IGludGVybmFsR3JhcGgubGlua3NcbiAgICAgIC5tYXAoZWRnZSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZTogYW55ID0gdG9Ob2RlKGludGVybmFsR3JhcGgubm9kZXMsIGVkZ2Uuc291cmNlKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0OiBhbnkgPSB0b05vZGUoaW50ZXJuYWxHcmFwaC5ub2RlcywgZWRnZS50YXJnZXQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmVkZ2UsXG4gICAgICAgICAgc291cmNlOiBzb3VyY2UuaWQsXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQuaWQsXG4gICAgICAgICAgcG9pbnRzOiBbXG4gICAgICAgICAgICAoc291cmNlLmJvdW5kcyBhcyBSZWN0YW5nbGUpLnJheUludGVyc2VjdGlvbih0YXJnZXQuYm91bmRzLmN4KCksIHRhcmdldC5ib3VuZHMuY3koKSksXG4gICAgICAgICAgICAodGFyZ2V0LmJvdW5kcyBhcyBSZWN0YW5nbGUpLnJheUludGVyc2VjdGlvbihzb3VyY2UuYm91bmRzLmN4KCksIHNvdXJjZS5ib3VuZHMuY3koKSlcbiAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICAgLmNvbmNhdChcbiAgICAgICAgaW50ZXJuYWxHcmFwaC5ncm91cExpbmtzLm1hcChncm91cExpbmsgPT4ge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBpbnRlcm5hbEdyYXBoLm5vZGVzLmZpbmQoZm91bmROb2RlID0+IChmb3VuZE5vZGUgYXMgYW55KS5pZCA9PT0gZ3JvdXBMaW5rLnNvdXJjZSk7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGludGVybmFsR3JhcGgubm9kZXMuZmluZChmb3VuZE5vZGUgPT4gKGZvdW5kTm9kZSBhcyBhbnkpLmlkID09PSBncm91cExpbmsudGFyZ2V0KTtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPVxuICAgICAgICAgICAgc291cmNlTm9kZSB8fCBpbnRlcm5hbEdyYXBoLmdyb3Vwcy5maW5kKGZvdW5kR3JvdXAgPT4gKGZvdW5kR3JvdXAgYXMgYW55KS5pZCA9PT0gZ3JvdXBMaW5rLnNvdXJjZSk7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID1cbiAgICAgICAgICAgIHRhcmdldE5vZGUgfHwgaW50ZXJuYWxHcmFwaC5ncm91cHMuZmluZChmb3VuZEdyb3VwID0+IChmb3VuZEdyb3VwIGFzIGFueSkuaWQgPT09IGdyb3VwTGluay50YXJnZXQpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5ncm91cExpbmssXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZS5pZCxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LmlkLFxuICAgICAgICAgICAgcG9pbnRzOiBbXG4gICAgICAgICAgICAgIChzb3VyY2UuYm91bmRzIGFzIFJlY3RhbmdsZSkucmF5SW50ZXJzZWN0aW9uKHRhcmdldC5ib3VuZHMuY3goKSwgdGFyZ2V0LmJvdW5kcy5jeSgpKSxcbiAgICAgICAgICAgICAgKHRhcmdldC5ib3VuZHMgYXMgUmVjdGFuZ2xlKS5yYXlJbnRlcnNlY3Rpb24oc291cmNlLmJvdW5kcy5jeCgpLCBzb3VyY2UuYm91bmRzLmN5KCkpXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICB0aGlzLm91dHB1dEdyYXBoLmNsdXN0ZXJzID0gaW50ZXJuYWxHcmFwaC5ncm91cHMubWFwKFxuICAgICAgKGdyb3VwLCBpbmRleCk6IENsdXN0ZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXRHcm91cCA9IHRoaXMuaW5wdXRHcmFwaC5jbHVzdGVyc1tpbmRleF07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaW5wdXRHcm91cCxcbiAgICAgICAgICBkaW1lbnNpb246IHtcbiAgICAgICAgICAgIHdpZHRoOiBncm91cC5ib3VuZHMgPyBncm91cC5ib3VuZHMud2lkdGgoKSA6IDIwLFxuICAgICAgICAgICAgaGVpZ2h0OiBncm91cC5ib3VuZHMgPyBncm91cC5ib3VuZHMuaGVpZ2h0KCkgOiAyMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgIHg6IGdyb3VwLmJvdW5kcyA/IGdyb3VwLmJvdW5kcy54ICsgZ3JvdXAuYm91bmRzLndpZHRoKCkgLyAyIDogMCxcbiAgICAgICAgICAgIHk6IGdyb3VwLmJvdW5kcyA/IGdyb3VwLmJvdW5kcy55ICsgZ3JvdXAuYm91bmRzLmhlaWdodCgpIC8gMiA6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLm91dHB1dEdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLm91dHB1dEdyYXBoLmVkZ2VzO1xuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoO1xuICB9XG5cbiAgb25EcmFnU3RhcnQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm91dHB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChmb3VuZE5vZGUgPT4gZm91bmROb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmludGVybmFsR3JhcGgubm9kZXNbbm9kZUluZGV4XTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kcmFnZ2luZ1N0YXJ0ID0geyB4OiBub2RlLnggLSAkZXZlbnQueCwgeTogbm9kZS55IC0gJGV2ZW50LnkgfTtcbiAgICBub2RlLmZpeGVkID0gMTtcbiAgICB0aGlzLnNldHRpbmdzLmZvcmNlLnN0YXJ0KCk7XG4gIH1cblxuICBvbkRyYWcoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm91dHB1dEdyYXBoLm5vZGVzLmZpbmRJbmRleChmb3VuZE5vZGUgPT4gZm91bmROb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmludGVybmFsR3JhcGgubm9kZXNbbm9kZUluZGV4XTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS54ID0gdGhpcy5kcmFnZ2luZ1N0YXJ0LnggKyAkZXZlbnQueDtcbiAgICBub2RlLnkgPSB0aGlzLmRyYWdnaW5nU3RhcnQueSArICRldmVudC55O1xuICB9XG5cbiAgb25EcmFnRW5kKGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5vdXRwdXRHcmFwaC5ub2Rlcy5maW5kSW5kZXgoZm91bmROb2RlID0+IGZvdW5kTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcbiAgICBjb25zdCBub2RlID0gdGhpcy5pbnRlcm5hbEdyYXBoLm5vZGVzW25vZGVJbmRleF07XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5maXhlZCA9IDA7XG4gIH1cbn1cbiJdfQ==