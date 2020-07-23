const HREF = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const w = 700;
const h = 350;
const padding = 80;
const color1 = "#538538";
const color2 = "#853858";

const svg = d3.select("body")
    .append("svg")
    .attr("width", w + padding * 2)
    .attr("height", h + padding * 2);

d3.json(HREF, function (error, data) {
    // Prepare data for yAxis
    let timeFormat = d3.timeFormat("%M:%S");
    var parsedTime;
    data.forEach(function (d) {
        d.Place = +d.Place;
        var parsedTime = d.Time.split(':');
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    // Scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => d.Year) - 1, d3.max(data, (d) => d.Year) + 1])
        .range([0, w]);
    const yScale = d3.scaleTime()
        .domain([d3.min(data, d => d.Time) - 10000, d3.max(data, d => d.Time) - (-10000)])
        .range([h, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    let yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    // Add axis to svg
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(" + padding + ", " + (h + padding) + ")")
        .call(xAxis)
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", " + padding + ")")
        .call(yAxis)

    var tooltip = d3.select("body").append("div").attr("id", "tooltip");

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'dot')
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(d.Time))
        .attr("r", (d) => 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => d.Time)
        .attr("transform", "translate(" + padding + ", " + padding + ")")
        .attr('fill', d => d.Doping == "" ? color2 : color1)
        .on("mousemove", (d, i) => {
            tooltip
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY - 30 + "px")
                .style("display", "inline-block")
                .attr("data-year", d.Year)
                .attr('data-date', d.Time)
                .html(`${d.Name}, ${d.Nationality}<br/>Year: ${d.Year}, Time: ${timeFormat(d.Time)}${d.Doping ? "<br/><br/>" + d.Doping : ""}`);
        })
        .on("mouseout", function (d) { tooltip.style("display", "none"); });

    //title
    svg.append("text")
        .attr("id", "title")
        .attr("x", (w / 2) + padding)
        .attr("y", padding / 3)
        .attr("text-anchor", "middle")
        .text("Doping in Professional Bicycle Racing");


    var legendContainer = svg.append("g")
        .attr("id", "legend")

    legendContainer.append("text")
        .attr("class", "legend-title")
        .attr("x", (w / 4) + padding)
        .attr("y", h + padding * 3 / 2)
        // .attr("text-anchor", "middle")
        .text("Legend: ");

    legendContainer.append("text")
        .attr("class", "legend-label")
        .attr("x", (w / 2.5) + padding)
        .attr("y", h + padding * 3 / 2)
        .style('fill', color2)
        .text("No doping allegations");

    legendContainer.append("text")
        .attr("class", "legend-label")
        .attr("x", (w / 2.5) + padding)
        .attr("y", h + padding * 1.75)
        .style('fill', color1)
        .text("Riders with doping allegations");

})