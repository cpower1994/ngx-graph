/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { id } from '../../utils/id';
import * as dagre from 'dagre';
/** @enum {string} */
const Orientation = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
export { Orientation };
/** @enum {string} */
const Alignment = {
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
export class DagreLayout {
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
        dagre.layout(this.dagreGraph);
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
if (false) {
    /** @type {?} */
    DagreLayout.prototype.defaultSettings;
    /** @type {?} */
    DagreLayout.prototype.settings;
    /** @type {?} */
    DagreLayout.prototype.dagreGraph;
    /** @type {?} */
    DagreLayout.prototype.dagreNodes;
    /** @type {?} */
    DagreLayout.prototype.dagreEdges;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFncmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvZGFncmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQzs7O0lBSTdCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7Ozs7O0lBR3BCLFFBQVMsR0FBRztJQUNaLFNBQVUsSUFBSTtJQUNkLFVBQVcsSUFBSTtJQUNmLFdBQVksSUFBSTtJQUNoQixZQUFhLElBQUk7Ozs7OztBQUduQixtQ0FZQzs7O0lBWEMsb0NBQTBCOztJQUMxQixnQ0FBaUI7O0lBQ2pCLGdDQUFpQjs7SUFDakIsb0NBQXFCOztJQUNyQixvQ0FBcUI7O0lBQ3JCLG9DQUFxQjs7SUFDckIsOEJBQWtCOztJQUNsQixrQ0FBaUM7O0lBQ2pDLCtCQUEyRDs7SUFDM0QsbUNBQXFCOztJQUNyQixpQ0FBbUI7O0FBR3JCLE1BQU0sT0FBTyxXQUFXO0lBQXhCO1FBQ0Usb0JBQWUsR0FBa0I7WUFDL0IsV0FBVyxFQUFFLFdBQVcsQ0FBQyxhQUFhO1lBQ3RDLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFLEVBQUU7WUFDWCxXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQztRQUNGLGFBQVEsR0FBa0IsRUFBRSxDQUFDO0lBaUgvQixDQUFDOzs7OztJQTNHQyxHQUFHLENBQUMsS0FBWTtRQUNkLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixLQUFLLENBQUMsTUFBTSxDQUFD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QU8sQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzthQUNqQjtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzthQUNsQjtZQUVELGVBQWU7WUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsZUFBZTtRQUNmLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNsQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2xFO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25EO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztDQUNGOzs7SUEzSEMsc0NBU0U7O0lBQ0YsK0JBQTZCOztJQUU3QixpQ0FBZ0I7O0lBQ2hCLGlDQUFnQjs7SUFDaEIsaUNBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XG5cbmV4cG9ydCBlbnVtIE9yaWVudGF0aW9uIHtcbiAgTEVGVF9UT19SSUdIVCA9ICdMUicsXG4gIFJJR0hUX1RPX0xFRlQgPSAnUkwnLFxuICBUT1BfVE9fQk9UVE9NID0gJ1RCJyxcbiAgQk9UVE9NX1RPX1RPTSA9ICdCVCdcbn1cbmV4cG9ydCBlbnVtIEFsaWdubWVudCB7XG4gIENFTlRFUiA9ICdDJyxcbiAgVVBfTEVGVCA9ICdVTCcsXG4gIFVQX1JJR0hUID0gJ1VSJyxcbiAgRE9XTl9MRUZUID0gJ0RMJyxcbiAgRE9XTl9SSUdIVCA9ICdEUidcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEYWdyZVNldHRpbmdzIHtcbiAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbjtcbiAgbWFyZ2luWD86IG51bWJlcjtcbiAgbWFyZ2luWT86IG51bWJlcjtcbiAgZWRnZVBhZGRpbmc/OiBudW1iZXI7XG4gIHJhbmtQYWRkaW5nPzogbnVtYmVyO1xuICBub2RlUGFkZGluZz86IG51bWJlcjtcbiAgYWxpZ24/OiBBbGlnbm1lbnQ7XG4gIGFjeWNsaWNlcj86ICdncmVlZHknIHwgdW5kZWZpbmVkO1xuICByYW5rZXI/OiAnbmV0d29yay1zaW1wbGV4JyB8ICd0aWdodC10cmVlJyB8ICdsb25nZXN0LXBhdGgnO1xuICBtdWx0aWdyYXBoPzogYm9vbGVhbjtcbiAgY29tcG91bmQ/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgRGFncmVMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7XG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXG4gICAgbWFyZ2luWDogMjAsXG4gICAgbWFyZ2luWTogMjAsXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcbiAgICByYW5rUGFkZGluZzogMTAwLFxuICAgIG5vZGVQYWRkaW5nOiA1MCxcbiAgICBtdWx0aWdyYXBoOiB0cnVlLFxuICAgIGNvbXBvdW5kOiB0cnVlXG4gIH07XG4gIHNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge307XG5cbiAgZGFncmVHcmFwaDogYW55O1xuICBkYWdyZU5vZGVzOiBhbnk7XG4gIGRhZ3JlRWRnZXM6IGFueTtcblxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XG5cbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xuXG4gICAgZm9yIChjb25zdCBkYWdyZU5vZGVJZCBpbiB0aGlzLmRhZ3JlR3JhcGguX25vZGVzKSB7XG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW2RhZ3JlTm9kZUlkXTtcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcbiAgICAgIG5vZGUucG9zaXRpb24gPSB7XG4gICAgICAgIHg6IGRhZ3JlTm9kZS54LFxuICAgICAgICB5OiBkYWdyZU5vZGUueVxuICAgICAgfTtcbiAgICAgIG5vZGUuZGltZW5zaW9uID0ge1xuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRhZ3JlTm9kZS5oZWlnaHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XG5cbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbi55IDw9IHRhcmdldE5vZGUucG9zaXRpb24ueSA/IC0xIDogMTtcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xuICAgICAgeDogc291cmNlTm9kZS5wb3NpdGlvbi54LFxuICAgICAgeTogc291cmNlTm9kZS5wb3NpdGlvbi55IC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXG4gICAgfTtcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcbiAgICAgIHg6IHRhcmdldE5vZGUucG9zaXRpb24ueCxcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxuICAgIH07XG5cbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXG4gICAgZWRnZS5wb2ludHMgPSBbc3RhcnRpbmdQb2ludCwgZW5kaW5nUG9pbnRdO1xuICAgIHJldHVybiBncmFwaDtcbiAgfVxuXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoe2NvbXBvdW5kOiBzZXR0aW5ncy5jb21wb3VuZCwgbXVsdGlncmFwaDogc2V0dGluZ3MubXVsdGlncmFwaH0pO1xuICAgIFxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlcixcbiAgICAgIG11bHRpZ3JhcGg6IHNldHRpbmdzLm11bHRpZ3JhcGgsXG4gICAgICBjb21wb3VuZDogc2V0dGluZ3MuY29tcG91bmRcbiAgICB9KTtcblxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8qIGVtcHR5ICovXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XG4gICAgICBub2RlLmhlaWdodCA9IG4uZGltZW5zaW9uLmhlaWdodDtcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3TGluaztcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcbiAgICAgIGlmICghbm9kZS53aWR0aCkge1xuICAgICAgICBub2RlLndpZHRoID0gMjA7XG4gICAgICB9XG4gICAgICBpZiAoIW5vZGUuaGVpZ2h0KSB7XG4gICAgICAgIG5vZGUuaGVpZ2h0ID0gMzA7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBkYWdyZVxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhZ3JlXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xuICAgICAgaWYgKHNldHRpbmdzLm11bHRpZ3JhcGgpIHtcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0LCBlZGdlLCBlZGdlLmlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcbiAgfVxufVxuIl19