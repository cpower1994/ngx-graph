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
/**
 * @record
 */
export function DagreNodesOnlySettings() { }
if (false) {
    /** @type {?|undefined} */
    DagreNodesOnlySettings.prototype.curveDistance;
}
/** @type {?} */
const DEFAULT_EDGE_NAME = '\x00';
/** @type {?} */
const GRAPH_NODE = '\x00';
/** @type {?} */
const EDGE_KEY_DELIM = '\x01';
export class DagreNodesOnlyLayout {
    constructor() {
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
        for (const edge of graph.edges) {
            this.updateEdge(graph, edge);
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
        /** @type {?} */
        const rankAxis = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x';
        /** @type {?} */
        const orderAxis = rankAxis === 'y' ? 'x' : 'y';
        /** @type {?} */
        const rankDimension = rankAxis === 'y' ? 'height' : 'width';
        // determine new arrow position
        /** @type {?} */
        const dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
        /** @type {?} */
        const startingPoint = {
            [orderAxis]: sourceNode.position[orderAxis],
            [rankAxis]: sourceNode.position[rankAxis] - dir * (sourceNode.dimension[rankDimension] / 2)
        };
        /** @type {?} */
        const endingPoint = {
            [orderAxis]: targetNode.position[orderAxis],
            [rankAxis]: targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2)
        };
        /** @type {?} */
        const curveDistance = this.settings.curveDistance || this.defaultSettings.curveDistance;
        // generate new points
        edge.points = [
            startingPoint,
            {
                [orderAxis]: startingPoint[orderAxis],
                [rankAxis]: startingPoint[rankAxis] - dir * curveDistance
            },
            {
                [orderAxis]: endingPoint[orderAxis],
                [rankAxis]: endingPoint[rankAxis] + dir * curveDistance
            },
            endingPoint
        ];
        /** @type {?} */
        const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;
        /** @type {?} */
        const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
        if (matchingEdgeLabel) {
            matchingEdgeLabel.points = edge.points;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFncmVOb2Rlc09ubHkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQzs7O0lBSTdCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7Ozs7O0lBR3BCLFFBQVMsR0FBRztJQUNaLFNBQVUsSUFBSTtJQUNkLFVBQVcsSUFBSTtJQUNmLFdBQVksSUFBSTtJQUNoQixZQUFhLElBQUk7Ozs7OztBQUduQixtQ0FZQzs7O0lBWEMsb0NBQTBCOztJQUMxQixnQ0FBaUI7O0lBQ2pCLGdDQUFpQjs7SUFDakIsb0NBQXFCOztJQUNyQixvQ0FBcUI7O0lBQ3JCLG9DQUFxQjs7SUFDckIsOEJBQWtCOztJQUNsQixrQ0FBaUM7O0lBQ2pDLCtCQUEyRDs7SUFDM0QsbUNBQXFCOztJQUNyQixpQ0FBbUI7Ozs7O0FBR3JCLDRDQUVDOzs7SUFEQywrQ0FBdUI7OztNQUduQixpQkFBaUIsR0FBRyxNQUFNOztNQUMxQixVQUFVLEdBQUcsTUFBTTs7TUFDbkIsY0FBYyxHQUFHLE1BQU07QUFFN0IsTUFBTSxPQUFPLG9CQUFvQjtJQUFqQztRQUNFLG9CQUFlLEdBQTJCO1lBQ3hDLFdBQVcsRUFBRSxXQUFXLENBQUMsYUFBYTtZQUN0QyxPQUFPLEVBQUUsRUFBRTtZQUNYLE9BQU8sRUFBRSxFQUFFO1lBQ1gsV0FBVyxFQUFFLEdBQUc7WUFDaEIsV0FBVyxFQUFFLEdBQUc7WUFDaEIsV0FBVyxFQUFFLEVBQUU7WUFDZixhQUFhLEVBQUUsRUFBRTtZQUNqQixVQUFVLEVBQUUsSUFBSTtZQUNoQixRQUFRLEVBQUUsSUFBSTtT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O0lBakpDLCtDQVVFOztJQUNGLHdDQUFzQzs7SUFFdEMsMENBQWdCOztJQUNoQiwwQ0FBZ0I7O0lBQ2hCLDBDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xuXG5leHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XG4gIExFRlRfVE9fUklHSFQgPSAnTFInLFxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcbiAgVE9QX1RPX0JPVFRPTSA9ICdUQicsXG4gIEJPVFRPTV9UT19UT00gPSAnQlQnXG59XG5leHBvcnQgZW51bSBBbGlnbm1lbnQge1xuICBDRU5URVIgPSAnQycsXG4gIFVQX0xFRlQgPSAnVUwnLFxuICBVUF9SSUdIVCA9ICdVUicsXG4gIERPV05fTEVGVCA9ICdETCcsXG4gIERPV05fUklHSFQgPSAnRFInXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XG4gIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb247XG4gIG1hcmdpblg/OiBudW1iZXI7XG4gIG1hcmdpblk/OiBudW1iZXI7XG4gIGVkZ2VQYWRkaW5nPzogbnVtYmVyO1xuICByYW5rUGFkZGluZz86IG51bWJlcjtcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XG4gIGFsaWduPzogQWxpZ25tZW50O1xuICBhY3ljbGljZXI/OiAnZ3JlZWR5JyB8IHVuZGVmaW5lZDtcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcbiAgbXVsdGlncmFwaD86IGJvb2xlYW47XG4gIGNvbXBvdW5kPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEYWdyZU5vZGVzT25seVNldHRpbmdzIGV4dGVuZHMgRGFncmVTZXR0aW5ncyB7XG4gIGN1cnZlRGlzdGFuY2U/OiBudW1iZXI7XG59XG5cbmNvbnN0IERFRkFVTFRfRURHRV9OQU1FID0gJ1xceDAwJztcbmNvbnN0IEdSQVBIX05PREUgPSAnXFx4MDAnO1xuY29uc3QgRURHRV9LRVlfREVMSU0gPSAnXFx4MDEnO1xuXG5leHBvcnQgY2xhc3MgRGFncmVOb2Rlc09ubHlMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7XG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXG4gICAgbWFyZ2luWDogMjAsXG4gICAgbWFyZ2luWTogMjAsXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcbiAgICByYW5rUGFkZGluZzogMTAwLFxuICAgIG5vZGVQYWRkaW5nOiA1MCxcbiAgICBjdXJ2ZURpc3RhbmNlOiAyMCxcbiAgICBtdWx0aWdyYXBoOiB0cnVlLFxuICAgIGNvbXBvdW5kOiB0cnVlXG4gIH07XG4gIHNldHRpbmdzOiBEYWdyZU5vZGVzT25seVNldHRpbmdzID0ge307XG5cbiAgZGFncmVHcmFwaDogYW55O1xuICBkYWdyZU5vZGVzOiBhbnk7XG4gIGRhZ3JlRWRnZXM6IGFueTtcblxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XG5cbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xuXG4gICAgZm9yIChjb25zdCBkYWdyZU5vZGVJZCBpbiB0aGlzLmRhZ3JlR3JhcGguX25vZGVzKSB7XG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW2RhZ3JlTm9kZUlkXTtcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcbiAgICAgIG5vZGUucG9zaXRpb24gPSB7XG4gICAgICAgIHg6IGRhZ3JlTm9kZS54LFxuICAgICAgICB5OiBkYWdyZU5vZGUueVxuICAgICAgfTtcbiAgICAgIG5vZGUuZGltZW5zaW9uID0ge1xuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRhZ3JlTm9kZS5oZWlnaHRcbiAgICAgIH07XG4gICAgfVxuICAgIGZvciAoY29uc3QgZWRnZSBvZiBncmFwaC5lZGdlcykge1xuICAgICAgdGhpcy51cGRhdGVFZGdlKGdyYXBoLCBlZGdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JhcGg7XG4gIH1cblxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcbiAgICBjb25zdCByYW5rQXhpczogJ3gnIHwgJ3knID0gdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ0JUJyB8fCB0aGlzLnNldHRpbmdzLm9yaWVudGF0aW9uID09PSAnVEInID8gJ3knIDogJ3gnO1xuICAgIGNvbnN0IG9yZGVyQXhpczogJ3gnIHwgJ3knID0gcmFua0F4aXMgPT09ICd5JyA/ICd4JyA6ICd5JztcbiAgICBjb25zdCByYW5rRGltZW5zaW9uID0gcmFua0F4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPyAtMSA6IDE7XG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcbiAgICAgIFtvcmRlckF4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXG4gICAgICBbcmFua0F4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXG4gICAgfTtcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcbiAgICAgIFtvcmRlckF4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXG4gICAgICBbcmFua0F4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXG4gICAgfTtcblxuICAgIGNvbnN0IGN1cnZlRGlzdGFuY2UgPSB0aGlzLnNldHRpbmdzLmN1cnZlRGlzdGFuY2UgfHwgdGhpcy5kZWZhdWx0U2V0dGluZ3MuY3VydmVEaXN0YW5jZTtcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXG4gICAgZWRnZS5wb2ludHMgPSBbXG4gICAgICBzdGFydGluZ1BvaW50LFxuICAgICAge1xuICAgICAgICBbb3JkZXJBeGlzXTogc3RhcnRpbmdQb2ludFtvcmRlckF4aXNdLFxuICAgICAgICBbcmFua0F4aXNdOiBzdGFydGluZ1BvaW50W3JhbmtBeGlzXSAtIGRpciAqIGN1cnZlRGlzdGFuY2VcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFtvcmRlckF4aXNdOiBlbmRpbmdQb2ludFtvcmRlckF4aXNdLFxuICAgICAgICBbcmFua0F4aXNdOiBlbmRpbmdQb2ludFtyYW5rQXhpc10gKyBkaXIgKiBjdXJ2ZURpc3RhbmNlXG4gICAgICB9LFxuICAgICAgZW5kaW5nUG9pbnRcbiAgICBdO1xuICAgIGNvbnN0IGVkZ2VMYWJlbElkID0gYCR7ZWRnZS5zb3VyY2V9JHtFREdFX0tFWV9ERUxJTX0ke2VkZ2UudGFyZ2V0fSR7RURHRV9LRVlfREVMSU19JHtERUZBVUxUX0VER0VfTkFNRX1gO1xuICAgIGNvbnN0IG1hdGNoaW5nRWRnZUxhYmVsID0gZ3JhcGguZWRnZUxhYmVsc1tlZGdlTGFiZWxJZF07XG4gICAgaWYgKG1hdGNoaW5nRWRnZUxhYmVsKSB7XG4gICAgICBtYXRjaGluZ0VkZ2VMYWJlbC5wb2ludHMgPSBlZGdlLnBvaW50cztcbiAgICB9XG4gICAgcmV0dXJuIGdyYXBoO1xuICB9XG5cbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCh7IGNvbXBvdW5kOiBzZXR0aW5ncy5jb21wb3VuZCwgbXVsdGlncmFwaDogc2V0dGluZ3MubXVsdGlncmFwaCB9KTtcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXIsXG4gICAgICBtdWx0aWdyYXBoOiBzZXR0aW5ncy5tdWx0aWdyYXBoLFxuICAgICAgY29tcG91bmQ6IHNldHRpbmdzLmNvbXBvdW5kXG4gICAgfSk7XG5cbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvKiBlbXB0eSAqL1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0xpbms7XG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcbiAgICAgICAgbm9kZS53aWR0aCA9IDIwO1xuICAgICAgfVxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xuICAgICAgICBub2RlLmhlaWdodCA9IDMwO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgZGFncmVcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYWdyZVxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5tdWx0aWdyYXBoKSB7XG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCwgZWRnZSwgZWRnZS5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XG4gIH1cbn1cbiJdfQ==