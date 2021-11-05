declare module '*.scss' {
    const value: any;

    export default value;
}

declare module '*.svg' {
    const value: any;

    export default value;
}

declare module 'react-plotly.js' {
    import * as Plotly from 'plotly.js';
    import { PureComponent } from 'react';

    export interface PlotParams {
        config?: Plotly.Config;
        style?: any;
        data: Plotly.Data[];
        layout: Partial<Plotly.Layout>;
        onClickAnnotation?: (event: Plotly.ClickAnnotationEvent) => void;
    }

    export default class Plot extends PureComponent<PlotParams> {}
}
