'use strict';

function displayGraph(measures) {
    let graph = new Vue({
        el: '#graph',
        data: {
            measures: measures,
            dateStart: 0,
            dateEnd: 0,
            optionsTemperature: {
                title: 'Température',
                //graph: {type: 'histogram', classStyle: 'histogram_Diagram redDiagram'},
                graph: {type: 'polyline', classStyle: 'graphLine_Diagram redDiagram'},
                id: 'temperature',
                size_px: {x: 1000, y: 500},
                axis: {
                    x: {
                        legend: 't',
                        min: 0,
                        max: 0,
                        step1: 1000 * 3600 * 12,
                        step2: 1000 * 3600,
                    },
                    y: {
                        legend: 'temp. °C',
                        min: -5,
                        max: 35,
                        step1: 5,
                        step2: 1,
                    },
                    crossing: {x: 0, y: 0},
                },
                verticalLines: [],
                horizontalLines: [
                    {position: 10, classStyle: 'lightLine_Diagram'},
                    {position: 20, classStyle: 'lightLine_Diagram'},
                    {position: 30, classStyle: 'lightLine_Diagram'},
                ],
            },
            optionsHumidity: {
                title: 'Humidité',
                //graph: {type: 'histogram', classStyle: 'histogram_Diagram blueDiagram'},
                graph: {type: 'polyline', classStyle: 'graphLine_Diagram blueDiagram'},
                id: 'humidity',
                size_px: {x: 1000, y: 500},
                axis: {
                    x: {
                        legend: 't',
                        min: 0,
                        max: 0,
                        step1: 1000 * 3600 * 12,
                        step2: 1000 * 3600,
                    },
                    y: {
                        legend: '% humidité',
                        min: 0,
                        max: 100,
                        step1: 10,
                        step2: 1,
                    },
                    crossing: {x: 0, y: 0},
                },
                verticalLines: [],
                horizontalLines: [
                    {position: 40, classStyle: 'dashedLine_Diagram'},
                    {position: 60, classStyle: 'dashedLine_Diagram'},
                ],
            },
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
                <div id="diagrams">
                </div>
            </section>`,
        mounted() {
            this.dateStart = this.fillInputDateNowMinusHours(24);
            this.dateEnd = this.fillInputDateNowMinusHours(0);
            this.updateGraph();
        },
        computed: {
            temperatureValues() {
                return this.getValuesFromMeasures('temperature', 'red');
            },
            humidityValues() {
                return this.getValuesFromMeasures('humidity', 'blue');
            }
        },
        methods: {
            getValuesFromMeasures(captorParameter, color) {
                let idCaptors = new Set;
                let graphs = {};
                for (let measure of this.measures) {
                    if (!idCaptors.has(measure.id_captor)) {
                        idCaptors.add(measure.id_captor);
                        graphs[measure.id_captor] = {points: [], color: color};
                    }
                    graphs[measure.id_captor].points.push({
                        x: measure.dateTime,
                        y: measure[captorParameter] / 100,
                    });
                }
                return Object.values(graphs);
            },
            fillInputDateNowMinusHours(hours = 0) {
                let now = new Date();
                now.setHours(now.getHours() + 2 - hours);
                return now.toJSON().slice(0, 19);
            },
            updateGraph() {
                postXHR('home', {
                    action: 'readCaptors',
                    //action: 'readCaptorsDayAverage',
                    id_captors: JSON.stringify([0, 1, 2, 3, 4]),
                    date_start: convertDateToMySQL(this.dateStart),
                    date_end: convertDateToMySQL(this.dateEnd),
                }).then(data => {
                    console.log(data);
                    this.measures = data;
                    this.updateSVGDiagrams();
                });
            },
            updateSVGDiagrams() {
                this.initXAxis();
                let diagram_div = document.getElementById('diagrams');
                diagram_div.innerHTML = '';
                let temperatureDiagram = new Diagram(this.optionsTemperature, this.temperatureValues);
                diagram_div.append(temperatureDiagram.getDiagramElement());
                let humidityDiagram = new Diagram(this.optionsHumidity, this.humidityValues);
                diagram_div.append(humidityDiagram.getDiagramElement());
                console.log('update');
            },
            initXAxis() {
                this.changeXAxis(this.optionsTemperature);
                this.changeXAxis(this.optionsHumidity);
                for (let measure of this.measures) {
                    if (this.isOnlyDate(measure.date)) {
                        measure.dateTime = new Date(measure.date + ' 14:00:00').getTime();
                    } else {
                        measure.dateTime = new Date(measure.date).getTime();
                    }
                }
                this.addVerticalLineByDay(this.optionsTemperature);
                this.addVerticalLineByDay(this.optionsHumidity);
            },
            isOnlyDate(date) {
                return /^\d{4}-\d{2}-\d{2}$/.test(date);
            },
            changeXAxis(options) {
                options.axis.x.min = this.floorDay(this.dateStart).getTime();
                options.axis.x.max = this.ceilDay(this.dateEnd).getTime();
                options.axis.crossing.x = options.axis.x.min;
            },
            addVerticalLineByDay(options) {
                let dateTime = options.axis.x.min;
                options.verticalLines = [];
                while (dateTime < options.axis.x.max) {
                    dateTime += 1000 * 3600 * 24;
                    let date = new Date(dateTime);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    options.verticalLines.push({
                        position: date.getTime() + 2 * 3600 * 1000,
                        classStyle: 'lightLine_Diagram',
                        name_substitution: this.convertToLocalDate(date),
                    })
                }
            },
            convertToLocalDate(date) {
                return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('' + date.getFullYear()).slice(2);
            },
            /**
             *
             * @param {Date} date
             * @return {Date}
             */
            ceilDay(date) {
                let ceilDate = new Date(date);
                ceilDate.setDate(ceilDate.getDate() + 1);
                return this.floorDay(ceilDate);
            },
            floorDay(date) {
                let dateFormat = new Date(date);
                let floorDate = new Date(dateFormat.valueOf());
                floorDate.setHours(0);
                floorDate.setMinutes(0);
                floorDate.setSeconds(0);
                return floorDate;
            }
        }
    });
    return graph;
}