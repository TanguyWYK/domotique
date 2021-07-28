'use strict';

function displayPanel(measures) {
    let panel = new Vue({
        el: '#panel',
        data: {
            measures: measures,
            numberOfMeasures: measures.length,
        },
        template: `<section>
                    <div id="date_div">
                        <p>Dernière mesure à <span id="date">{{ date }}</span></p>
                    </div>
                    <div id="thermometer_div">
                        <p>Température : <span id="temperature">{{ temperature }}</span>°C</p>
                    </div>
                    <div id="humidity_div">
                        <p>Humidité air : <span id="humidity">{{ humidity }}</span>%</p>
                    </div>
                </section>`,
        computed: {
            date() {
                console.log(this.lastMeasure())
                let date = new Date(this.lastMeasure().date);
                let twoDigit = x => ("0" + x).slice(-2);
                return twoDigit(date.getHours()) + ':' +
                    twoDigit(date.getMinutes()) + ':' +
                    twoDigit(date.getSeconds());
            },
            temperature(){
                return (this.lastMeasure().temperature/ 100).toFixed(2);
            },
            humidity(){
                return (this.lastMeasure().humidity/ 100).toFixed(2);
            },
        },
        methods: {
            updatePanel(data) {
                this.temperature = (data.temperature / 100).toFixed(2);
                this.humidity = (data.humidity / 100).toFixed(2);
                this.date = new Date(data.date);
            },
            lastMeasure(){
                return this.measures[0];
            }
        },

    });
}