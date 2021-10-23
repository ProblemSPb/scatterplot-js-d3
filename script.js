const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

let values = [];

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 40;

let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');

function drawCanvas () {
    svg.attr('width', width);
    svg.attr('height', height);
}

function generateScales () {
    xScale = d3.scaleLinear()
                .domain([d3.min(values, (item) => {
                    return item['Year'];
                // -1 to move the first tick to the right and does not let dots to overlap the border of chart
                }) - 1, d3.max(values, (item) => {
                    return item['Year'];
                // +1 to move the first tick to the left and does not let dots to overlap the border of chart
                }) + 1 ])
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([d3.min(values, (item) => { // select the min time in sec and convert to date object
                    // -10 seconds to move the min tick and does not let dots to overlap the border of chart
                    return new Date ((item['Seconds'] - 10) * 1000);
                }), d3.max(values, (item) => { // select the max time in sec and convert to date object
                    // +10 seconds to move the min tick and does not let dots to overlap the border of chart
                    return new Date ((item['Seconds'] +10 ) * 1000);
                })])
                .range([padding, height - padding])
}

function drawDataPoints () {
    svg.selectAll('circle')
    .data(values)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', (item) => {
        return item['Year'];
    })
    .attr('data-yvalue', (item) => {
        return new Date(item['Seconds'] * 1000); // converting to miliseconds and creating a Date object
    })
    .attr('r', 5)
    .attr('cx', (item) => {
        return xScale(item['Year']);
    })
    .attr('cy', (item) => {
        return yScale(new Date (item['Seconds'] * 1000));
    })
    // set color: orange if there were doping allegations, green - no doping allegations
    .attr('fill', (item) => {
        if (item['Doping'] != '') {
            return 'Orange';
        } else {
            return 'Lightgreen'
        }
    })
    // show tooltip when hover over a dor
    .on('mouseover', (item) => {
        tooltip.transition()
                .style('visibility', 'visible');

        if (item['Doping'] != '') {
            tooltip.text("Name: " + item['Name'] + ". Time: " + item['Time'] + ". Doping: " + item['Doping'] + ".");
        } else {
            tooltip.text("Name: " + item['Name'] + ". Time: " + item['Time'] + ". No Allegations.");
        }

        tooltip.attr('data-year', item['Year'])
    })
    // hide tooltip
    .on('mouseout', (item) => {
        tooltip.transition()
                .style('visibility', 'hidden');
    })

}

function generateAxes () {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d')); // removing coma in years formatting
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S')); // show ticks in teh format Minutes:Seconds
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