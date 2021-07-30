'use strict';

function displayGraph(measures) {
    let panel = new Vue({
        el: '#graph',
        data: {
            measures: measures,
            dateStart: 0,
            dateEnd: 0,
        },
        template: `<section>
                    <div id="dateList_id">
                        <ul>
                            <li>
                                <label for="startDate">début</label>
                                <input id="startDate" type="datetime-local" v-model="dateStart">
                            </li>
                            <li>
                                <label for="endDate">fin</label>
                                <input id="endDate" type="datetime-local" v-model="dateEnd">
                            </li>
                            <li>
                               <div class="button" @click="updateGraph()">Afficher</div>
                            </li>
                        </ul>
                    </div>
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
        mounted() {
            this.dateStart = this.fillInputDateNowMinusHours(24);
            this.dateEnd = this.fillInputDateNowMinusHours(0);
        },
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
            },
            fillInputDateNowMinusHours(hours = 0) {
                let now = new Date();
                now.setHours(now.getHours() + 2 - hours);
                return now.toJSON().slice(0, 19);
            },
            updateGraph() {
                postXHR('home', {
                    action: 'readCaptors',
                    id_captor: 1,
                    date_start: convertDateToMySQL(this.dateStart),
                    date_end: convertDateToMySQL(this.dateEnd),
                }).then(data => {
                    this.measures = data;
                });
            },
        },
    });
}