import React from 'react';
import { ResponsiveBar } from '@nivo/bar'

const BarChart = ({ data, keys }) => {
    // Add some fill stylez.
    const phil = keys.map((k, i) => (
        i % 3 == 0
            ? {
                "match": {
                    "id": k
                },
                "id": "dots"
            }
            : i % 2 == 0
                ? {
                    "match": {
                        "id": k
                    },
                    "id": "lines"
                }
                : null
    )).filter(i => i);
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const now = `${year}-${month < 10 ? ('0'+month) : month}`
    const markToday = [{
        axis: 'x',
        value: now,
        lineStyle: {stroke: 'rgba(0, 0, 0, .35)', strokeWidth: 2},
    }];
    return <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="__time__"
        margin={{
            "top": 50,
            "right": 130,
            "bottom": 130,
            "left": 60
        }}
        markers={markToday}
        padding={0.3}
        colors="pastel1"
        colorBy="id"
        defs={[
            {
                "id": "dots",
                "type": "patternDots",
                "background": "inherit",
                "color": "#38bcb2",
                "size": 4,
                "padding": 1,
                "stagger": true
            },
            {
                "id": "lines",
                "type": "patternLines",
                "background": "inherit",
                "color": "#eed312",
                "rotation": -45,
                "lineWidth": 6,
                "spacing": 10
            }
        ]}
        borderColor="inherit:darker(1.6)"
        axisBottom={{
            "orient": "bottom",
            "tickSize": 5,
            "tickPadding": 5,
            "tickRotation": 90,
            "legend": "",
            "legendPosition": "middle",
            "legendOffset": 36
        }}
        axisLeft={{
            "orient": "left",
            "tickSize": 5,
            "tickPadding": 5,
            "tickRotation": 0,
            "legend": "",
            "legendPosition": "middle",
            "legendOffset": -40
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="inherit:darker(1.6)"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        fill={phil}
        legends={[
            {
                "dataFrom": "keys",
                "anchor": "bottom-right",
                "direction": "column",
                "justify": false,
                "translateX": 120,
                "translateY": 0,
                "itemsSpacing": 2,
                "itemWidth": 100,
                "itemHeight": 20,
                "itemDirection": "left-to-right",
                "itemOpacity": 0.85,
                "symbolSize": 20,
                "effects": [
                    {
                        "on": "hover",
                        "style": {
                            "itemOpacity": 1
                        }
                    }
                ]
            }
        ]}
    />;
};

export default BarChart;
