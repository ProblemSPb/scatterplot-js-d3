const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

let values = [];

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 40;

let svg = d3.select('svg');

function drawCanvas () {
    svg.attr('width', width);
    svg.attr('height', height);
}

function generateScales () {
    xScale = d3.scaleLinear()
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .range([padding, height - padding])
}

function drawDataPoints () {
    svg.selectAll('circle')
    .data(values)
    .enter()
    // .append('circle')
    // .attr('cx', (d, i) => d.year)
    // .attr('cy', (d, i) => d.time)
    // .attr('r', 5)

}

function generateAxes () {
    let xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')

}

// getting data
const req = new XMLHttpRequest();
req.open('GET', url, true);
req.onload = function () {
    values = JSON.parse(req.response);
    console.log(values);
    
    drawCanvas();
    generateScales();
    drawDataPoints();
    generateAxes();

}
req.send();




// serve .