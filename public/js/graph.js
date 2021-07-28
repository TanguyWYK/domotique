'use strict';

function displayGraph(measures) {
    let panel = new Vue({
        el: '#graph',
        data: {
            measures: measures,
        },
        template: `<section>
                     <svg height="510" width="510">
                        <line x1="5" y1="505" x2="505" y2="505" style="stroke:#000;stroke-width:1" />
                        <line x1="5" y1="505" x2="5" y2="5" style="stroke:#000;stroke-width:1" />
                        <circle v-for="(measure,index) in measures" :key="measures.index" 
                            :cx="getPositionX(measure)" 
                            :cy="getHumidityPositionY(measure)" 
                            r="1.5" fill="blue" />
                        <circle v-for="(measure,index) in measures" :key="measures.index" 
                            :cx="getPositionX(measure)" 
                            :cy="getTemperaturePositionY(measure)" 
                            r="1.5" fill="red" />
                    </svg>
                </section>`,
        computed: {},
        methods: {
            getHumidityPositionY(measure) {
                return 510 - measure.humidity / 100 * 5;
            },
            getTemperaturePositionY(measure) {
                return 510 - measure.temperature / 100 * 5;
            },
            getPositionX(measure) {
                let date = new Date(measure.date);
                return (date.getHours() * 60 + date.getMinutes()) / (60 * 24) * 500 + 10;
            }
        },
    });
}