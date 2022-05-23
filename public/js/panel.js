'use strict';

function displayPanel(measures) {
    let panel = new Vue({
        el: '#panel',
        data: {
            measures: measures,
            idCaptors: Object.keys(measures),
            numberOfCaptors: measures.length,
        },
        template: `<section>
                    <table>
                      <tr>
                        <th>Captor</th>
                        <th>Dernière mesure</th>
                        <th>Température</th>
                        <th>Humidité</th>
                      </tr>
                      <tr v-for="idCaptor in idCaptors">
                        <td>{{ name(idCaptor)}}</td>
                        <td>{{ date(idCaptor) }}</td>
                        <td>{{ temperature(idCaptor) }}°C</td>
                        <td>{{ humidity(idCaptor) }}%</td>
                      </tr>
                    </table>
                </section>`,
        computed: {

        },
        methods: {
            date(idCaptor) {
                let date = new Date(this.lastMeasure(idCaptor)['date']);
                let twoDigit = x => ('0' + x).slice(-2);
                return twoDigit(date.getHours()) + ':' +
                    twoDigit(date.getMinutes()) + ':' +
                    twoDigit(date.getSeconds());
            },
            temperature(idCaptor) {
                return (this.lastMeasure(idCaptor).temperature / 100).toFixed(2);
            },
            humidity(idCaptor) {
                return (this.lastMeasure(idCaptor).humidity / 100).toFixed(2);
            },
            numberOfMeasures(idCaptor){
                return this.measures[idCaptor].data.length;
            },
            lastMeasure(idCaptor) {
                return this.measures[idCaptor].data[this.numberOfMeasures(idCaptor) - 1];
            },
            name(idCaptor){
                return this.measures[idCaptor].captorName;
            }
        },

    });
}