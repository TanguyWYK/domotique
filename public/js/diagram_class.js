'use strict';

class Diagram {

    constructor(options, values = []) {
        this.HEIGHT_TITLE = 100;
        this.PADDING_BOTTOM = 80;
        this.PADDING_LEFT = 80;
        this.PADDING_RIGHT = 20;
        this.title = options.title;
        this.graph = options.graph;
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
        if (this.graph.type === 'polyline') {
            this.drawValuesPath();
        } else if (this.graph.type === 'histogram') {
            this.drawValuesHistogram();
        }
    }

    drawValuesPath() {
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

    drawValuesHistogram() {
        for (let values of this.values) {
            for (let value of values.points) {
                let point = this.getPositionPixels(value);
                let height = this.convertInPixelY(this.axis.crossing.y) - point.y;
                let width = this.convertWidthInPixelX(3600 * 22 * 1000);
                this.drawRect(point.x, point.y, width, height, this.graph.classStyle);
            }
        }
    }

    drawRect(x, y, width, height, classStyle) {
        let rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectElement.setAttribute('x', '' + (x - width / 2));
        rectElement.setAttribute('y', y);
        rectElement.setAttribute('width', width);
        rectElement.setAttribute('height', height);
        rectElement.setAttribute('class', classStyle);
        this.svgElement.appendChild(rectElement);
    }

    drawExtraLines(parentElement) {
        let svgLegendAxisElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgLegendAxisElement.setAttribute('class', 'legendAxis_Diagram');
        for (let line of this.horizontalLines) {
            this.drawHorizontalLine(this.convertInPixelY(line.position), line.classStyle, this.svgElement);
            this.drawText(
                this.convertInPixelX(this.axis.crossing.x) - 10,
                this.convertInPixelY(line.position) + 2,
                12,
                '',
                this.getLineText(line),
                svgLegendAxisElement);
        }
        for (let line of this.verticalLines) {
            this.drawVerticalLine(this.convertInPixelX(line.position), line.classStyle, this.svgElement);
            this.drawTextRotate(
                this.convertInPixelX(line.position) + 5,
                this.convertInPixelY(this.axis.crossing.y) + 12,
                14,
                -75,
                '',
                this.getLineText(line),
                svgLegendAxisElement);
        }
        this.svgElement.appendChild(svgLegendAxisElement);
    }

    getLineText(line) {
        return line.hasOwnProperty('name_substitution') ? line.name_substitution : line.position;
    }

    drawAxis() {
        let svgAxisElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let y = this.convertInPixelY(this.axis.crossing.y);
        this.drawHorizontalLine(y, 'axis_Diagram', svgAxisElement);
        this.drawArrowX(this.PADDING_LEFT + this.size_px.x, y, svgAxisElement);
        let x = this.convertInPixelX(this.axis.crossing.x);
        this.drawVerticalLine(x, 'axis_Diagram', svgAxisElement);
        this.drawArrowY(x, this.HEIGHT_TITLE, svgAxisElement);
        this.drawText(this.PADDING_LEFT + this.size_px.x, y + 20, 16, 'legendAxis_Diagram', this.axis.x.legend, svgAxisElement);
        this.drawTextRotate(this.PADDING_LEFT - 20, this.HEIGHT_TITLE - 20, 16, -90, 'legendAxis_Diagram', this.axis.y.legend, svgAxisElement);
        let svgStepsElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgStepsElement.setAttribute('class', 'graduation_Diagram');
        this.drawSteps(svgStepsElement);
        svgAxisElement.appendChild(svgStepsElement);
        this.svgElement.appendChild(svgAxisElement);
    }

    drawSteps(parentElement) {
        let offsetX = this.axis.x.min - this.axis.x.min % this.axis.x.step2 + this.axis.x.step2;
        for (let i = offsetX; i < this.axis.x.max; i += this.axis.x.step2) {
            let x = this.convertInPixelX(i);
            let y = this.convertInPixelY(this.axis.crossing.y);
            let length = i % this.axis.x.step1 === 0 ? 8 : 3;
            this.drawLine(x, y, x, y + length, '', parentElement);
        }
        let offsetY = this.axis.y.min - this.axis.y.min % this.axis.y.step2 + this.axis.y.step2;
        for (let i = offsetY; i < this.axis.y.max; i += this.axis.y.step2) {
            let x = this.convertInPixelX(this.axis.crossing.x);
            let y = this.convertInPixelY(i);
            let length = i % this.axis.y.step1 === 0 ? 8 : 3;
            this.drawLine(x - length, y, x, y, '', parentElement);
        }
    }

    drawLine(x1, y1, x2, y2, classStyle, parentElement) {
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('x1', x1);
        lineElement.setAttribute('y1', y1);
        lineElement.setAttribute('x2', x2);
        lineElement.setAttribute('y2', y2);
        if (classStyle !== '') {
            lineElement.setAttribute('class', classStyle);
        }
        parentElement.appendChild(lineElement);
    }

    drawHorizontalLine(y, classStyle, parentElement) {
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('class', classStyle);
        lineElement.setAttribute('x1', this.PADDING_LEFT);
        lineElement.setAttribute('y1', y);
        lineElement.setAttribute('x2', this.PADDING_LEFT + this.size_px.x);
        lineElement.setAttribute('y2', y);
        parentElement.appendChild(lineElement);
    }

    drawVerticalLine(x, classStyle, parentElement) {
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('class', classStyle);
        lineElement.setAttribute('x1', x);
        lineElement.setAttribute('y1', this.HEIGHT_TITLE + this.size_px.y);
        lineElement.setAttribute('x2', x);
        lineElement.setAttribute('y2', this.HEIGHT_TITLE);
        parentElement.appendChild(lineElement);
    }

    drawArrowX(x, y, parentElement) {
        let x2 = x - 5;
        let x3 = x + 12;
        let y2 = y + 5;
        let y3 = y - 5;
        let arrow_x = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow_x.setAttribute('d', 'M' + x2 + ' ' + y2 + 'Q' + x + ' ' + y + ' ' + x2 + ' ' + y3 + 'L' + x3 + ' ' + y + 'Z');
        arrow_x.setAttribute('class', 'axisArrow_Diagram');
        parentElement.appendChild(arrow_x);
    }

    drawArrowY(x, y, parentElement) {
        let x2 = x + 5;
        let x3 = x - 5;
        let y2 = y + 5;
        let y3 = y - 12;
        let arrow_y = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow_y.setAttribute('d', 'M' + x3 + ' ' + y2 + 'Q ' + x + ' ' + y + ' ' + x2 + ' ' + y2 + 'L' + x + ' ' + y3 + 'Z');
        arrow_y.setAttribute('class', 'axisArrow_Diagram');
        parentElement.appendChild(arrow_y);
    }

    drawText(x, y, fontSize, classStyle, text, parentElement) {
        let textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('font-size', fontSize);
        if(classStyle!==''){
            textElement.setAttribute('class', classStyle);
        }
        textElement.textContent = text;
        parentElement.appendChild(textElement);
    }

    drawTextRotate(x, y, fontSize, angle, classStyle, text, parentElement) {
        let textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('class', classStyle);
        textElement.setAttribute('style',
            'transform-origin: ' + x + 'px ' + y + 'px;' +
            'transform: rotate(' + angle + 'deg)');
        textElement.textContent = text;
        parentElement.appendChild(textElement);
    }

    drawTitle() {
        let fontSize = Math.round(this.size_px.y / 25) + 5;
        this.drawText(this.size_px.x / 2 + this.PADDING_LEFT, this.HEIGHT_TITLE / 2, fontSize, 'title_Diagram', this.title, this.svgElement);
    }

    convertInPixelX(x) {
        return Math.round((this.PADDING_LEFT + this.size_px.x / (this.axis.x.max - this.axis.x.min) * (x - this.axis.x.min)) * 10) / 10;
    }

    convertWidthInPixelX(width) {
        return Math.round((this.size_px.x / (this.axis.x.max - this.axis.x.min) * width) * 10) / 10;
    }

    convertInPixelY(y) {
        return Math.round((this.HEIGHT_TITLE + this.size_px.y - this.size_px.y / (this.axis.y.max - this.axis.y.min) * (y - this.axis.y.min)) * 10) / 10;
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