'use strict';

class Diagram {

    constructor(options, values = []) {
        this.HEIGHT_TITLE = 100;
        this.PADDING_BOTTOM = 30;
        this.PADDING_LEFT_RIGHT = 20;
        this.title = options.title;
        this.size_px = {
            x: options.size_px.x,
            y: options.size_px.y,
        };
        this.axis = {
            x: {
                legend: options.axis.x.legend,
                min: options.axis.x.min,
                max: options.axis.x.max,
            },
            y: {
                legend: options.axis.y.legend,
                min: options.axis.y.min,
                max: options.axis.y.max,
            },
            crossing: {
                x: options.axis.crossing.x,
                y: options.axis.crossing.y,
            }
        };
        this.verticalLines = options.verticalLines;
        this.horizontalLines = options.horizontalLines;
        this.values = values;
        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.initSVG(options.id);
    }

    initSVG(id) {
        this.svgElement.setAttribute('width', this.size_px.x + 2 * this.PADDING_LEFT_RIGHT);
        this.svgElement.setAttribute('height', this.size_px.y + this.HEIGHT_TITLE + this.PADDING_BOTTOM);
        this.svgElement.id = id;
        this.drawAxis();
        this.drawExtraLines();
        this.drawValues();
    }

    drawValues() {
        for (let values of this.values) {
            let pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            let textPath = 'M';
            let points = [];
            for (let value of values.points) {
                let point = this.getPositionPixels(value);
                points.push(point.x + ' ' + point.y + ' ');
            }
            textPath += points.join('L');
            pathElement.setAttribute('d', textPath);
            pathElement.setAttribute('stroke', values.color);
            pathElement.setAttribute('class', 'graphLine_Diagram');
            this.svgElement.appendChild(pathElement);
        }
    }

    drawExtraLines() {
        for (let line of this.horizontalLines) {
            this.drawHorizontalLine(this.convertInPixelY(line.y), line.classStyle);
        }
        for (let line of this.verticalLines) {
            this.drawVerticalLine(this.convertInPixelX(line.x), line.classStyle);
        }
    }

    drawAxis() {
        let y = this.convertInPixelY(this.axis.crossing.y);
        this.drawHorizontalLine(y, 'axis_Diagram');
        this.drawArrowX(this.PADDING_LEFT_RIGHT + this.size_px.x, y);
        let x = this.convertInPixelX(this.axis.crossing.x);
        this.drawVerticalLine(x, 'axis_Diagram');
        this.drawArrowY(x, this.HEIGHT_TITLE);
    }

    drawHorizontalLine(y, classStyle) {
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('class', classStyle);
        lineElement.setAttribute('x1', this.PADDING_LEFT_RIGHT);
        lineElement.setAttribute('y1', '' + y);
        lineElement.setAttribute('x2', this.PADDING_LEFT_RIGHT + this.size_px.x);
        lineElement.setAttribute('y2', '' + y);
        this.svgElement.appendChild(lineElement);
    }

    drawVerticalLine(x, classStyle) {
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('class', classStyle);
        lineElement.setAttribute('x1', x);
        lineElement.setAttribute('y1', this.HEIGHT_TITLE + this.size_px.y);
        lineElement.setAttribute('x2', x);
        lineElement.setAttribute('y2', this.HEIGHT_TITLE);
        this.svgElement.appendChild(lineElement);
    }

    drawArrowX(x, y) {
        let x2 = x - 5;
        let x3 = x + 12;
        let y2 = y + 5;
        let y3 = y - 5;
        let arrow_x = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow_x.setAttribute('d', 'M' + x2 + ' ' + y2 + 'Q' + x + ' ' + y + ' ' + x2 + ' ' + y3 + 'L' + x3 + ' ' + y + 'Z');
        arrow_x.setAttribute('class', 'axisArrow_Diagram');
        this.svgElement.appendChild(arrow_x);
    }

    drawArrowY(x, y) {
        let x2 = x + 5;
        let x3 = x - 5;
        let y2 = y + 5;
        let y3 = y - 12;
        let arrow_y = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow_y.setAttribute('d', 'M' + x3 + ' ' + y2 + 'Q ' + x + ' ' + y + ' ' + x2 + ' ' + y2 + 'L' + x + ' ' + y3 + 'Z');
        arrow_y.setAttribute('class', 'axisArrow_Diagram');
        this.svgElement.appendChild(arrow_y);
    }

    convertInPixelX(x) {
        return this.PADDING_LEFT_RIGHT + this.size_px.x / (this.axis.x.max - this.axis.x.min) * (x - this.axis.x.min);
    }

    convertInPixelY(y) {
        return this.HEIGHT_TITLE + this.size_px.y - this.size_px.y / (this.axis.y.max - this.axis.y.min) * (y - this.axis.y.min);
    }

    getPositionPixels(value) {
        return {
            x: this.convertInPixelX(value.x),
            y: this.convertInPixelY(value.y),
        };
    }

    getDiagramElement() {
        return this.svgElement;
    }

}