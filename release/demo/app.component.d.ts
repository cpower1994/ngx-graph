import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Graph, Layout } from '../src/ngx-graph.module';
export declare class AppComponent implements OnInit {
    version: string;
    theme: string;
    chartType: string;
    chartTypeGroups: any;
    chart: any;
    realTimeData: boolean;
    countrySet: any[];
    graph: Graph;
    view: any[];
    width: number;
    height: number;
    fitContainer: boolean;
    autoZoom: boolean;
    panOnZoom: boolean;
    enableZoom: boolean;
    autoCenter: boolean;
    update$: Subject<any>;
    center$: Subject<any>;
    zoomToFit$: Subject<any>;
    showLegend: boolean;
    orientation: string;
    orientations: any[];
    layoutId: string;
    customLayout: Layout;
    layouts: any[];
    curveType: string;
    curve: any;
    interpolationTypes: string[];
    colorSchemes: any;
    colorScheme: any;
    schemeType: string;
    selectedColorScheme: string;
    constructor();
    ngOnInit(): void;
    updateData(): void;
    applyDimensions(): void;
    toggleEnableZoom(enableZoom: boolean): void;
    toggleFitContainer(fitContainer: boolean, autoZoom: boolean, autoCenter: boolean): void;
    selectChart(chartSelector: any): void;
    select(data: any): void;
    setColorScheme(name: any): void;
    setInterpolationType(curveType: any): void;
    onLayoutChange(layoutId: string): void;
    addClusters(): void;
    removeClusters(): void;
    onLegendLabelClick(entry: any): void;
    toggleExpand(node: any): void;
    updateChart(): void;
    zoomToFit(): void;
    center(): void;
}
