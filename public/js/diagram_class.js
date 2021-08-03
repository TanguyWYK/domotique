'use strict';

class Diagram {

    constructor(options, values = []) {
        this.HEIGHT_TITLE = 100;
        this.PADDING_BOTTOM = 30;
        this.PADDING_LEFT = 80;
        this.PADDING_RIGHT = 20;
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
                step1: options.axis.x.step1,
                step2: options.axis.x.step2,
            },
            y: {
                legend: options.axis.y.legend,
                min: options.axis.y.min,
                max: options.axis.y.max,
                step1: options.axis.y.step1,
                step2: options.axis.y.step2,
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
        this.svgElement.setAttribute('width', this.size_px.x + this.PADDING_LEFT + this.PADDING_RIGHT);
        this.svgElement.setAttribute('height', this.size_px.y + this.HEIGHT_TITLE + this.PADDING_BOTTOM);
        this.svgElement.id = id;
        this.drawAxis();
        this.drawExtraLines();
        this.drawValues();
        this.drawTitle();
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
            // TODO attention à l'offset
            this.drawText(this.PADDING_LEFT - 10, this.convertInPixelY(line.y) + 2, 12, 'legendAxis_Diagram', line.y);
        }
        for (let line of this.verticalLines) {
            this.drawVerticalLine(this.convertInPixelX(line.x), line.classStyle);
        }
    }

    drawAxis() {
        let y = this.convertInPixelY(this.axis.crossing.y);
        this.drawHorizontalLine(y, 'axis_Diagram');
        this.drawArrowX(this.PADDING_LEFT + this.size_px.x, y);
        let x = this.convertInPixelX(this.axis.crossing.x);
        this.drawVerticalLine(x, 'axis_Diagram');
        this.drawArrowY(x, this.HEIGHT_TITLE);
        this.drawText(this.PADDING_LEFT + this.size_px.x, y + 20, 16, 'legendAxis_Diagram', this.axis.x.legend);
        this.drawTextRotate90(this.PADDING_LEFT - 25, this.HEIGHT_TITLE, 16, 'legendAxis_Diagram', this.axis.y.legend);
        this.drawSteps();
    }

    drawSteps() {
        let offsetX = this.axis.x.min - this.axis.x.min % this.axis.x.step2 + this.axis.x.step2
        for (let i = offsetX; i < this.axis.x.max; i += this.axis.x.step2) {
            let x = this.convertInPixelX(i);
            let y = this.convertInPixelY(this.axis.crossing.y);
            let length = (i - offsetX) % this.axis.x.step1 === 0 ? 8 : 3;
            this.drawLine(x, y, x, y + length, 'graduation_Diagram');
        }
        // TODO ajouter offset y
        for (let i = this.axis.y.min; i < this.axis.y.max; i += this.axis.y.step2) {
            let x = this.convertInPixelX(this.axis.crossing.x);
            let y = this.convertInPixelY(i);
            let length = (i - this.axis.y.min) % this.axis.y.step1 === 0 ? 8 : 3;
            this.drawLine(x - length, y, x, y, 'graduation_Diagram');
        }
    }

    drawLine(x1, y1, x2, y2, classStyle) {
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('x1', x1);
        lineElement.setAttribute('y1', y1);
        lineElement.setAttribute('x2', x2);
        lineElement.setAttribute('y2', y2);
        lineElement.setAttribute('class', classStyle);
        this.svgElement.appendChild(lineElement);
    }

    drawHorizontalLine(y, classStyle) {
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('class', classStyle);
        lineElement.setAttribute('x1', this.PADDING_LEFT);
        lineElement.setAttribute('y1', '' + y);
        lineElement.setAttribute('x2', this.PADDING_LEFT + this.size_px.x);
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

    drawText(x, y, fontSize, classStyle, text) {
        let textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('class', classStyle);
        textElement.textContent = text;
        this.svgElement.appendChild(textElement);
    }

    drawTextRotate90(x, y, fontSize, classStyle, text) {
        let textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('class', classStyle);
        textElement.setAttribute('style',
            'transform: translateY(' + (2 * this.HEIGHT_TITLE) + 'px) ' +
            'rotate(-90deg) ' +
            'translate(' + (this.HEIGHT_TITLE - 10) + 'px, ' + (-35) + 'px)');
        textElement.textContent = text;
        this.svgElement.appendChild(textElement);
    }

    drawTitle() {
        let fontSize = Math.round(this.size_px.y / 25) + 5;
        this.drawText(this.size_px.x / 2 + this.PADDING_LEFT, this.HEIGHT_TITLE / 2, fontSize, 'title_Diagram', this.title);
    }

    convertInPixelX(x) {
        return Math.round((this.PADDING_LEFT + this.size_px.x / (this.axis.x.max - this.axis.x.min) * (x - this.axis.x.min)) * 100) / 100;
    }

    convertInPixelY(y) {
        return Math.round((this.HEIGHT_TITLE + this.size_px.y - this.size_px.y / (this.axis.y.max - this.axis.y.min) * (y - this.axis.y.min)) * 100) / 100;
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