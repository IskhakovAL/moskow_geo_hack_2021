import * as Plotly from 'plotly.js';

export type Plot = { data: Plotly.Data[]; layout: Partial<Plotly.Layout> };

export interface IPlots {
    plots: Plot[];
}
