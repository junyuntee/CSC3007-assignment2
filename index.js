let records = []

// set the dimensions and margins of the graph
var parentDiv = document.getElementById("records");
var tooltip = d3.select("#records").append("div").attr("class", "tooltip");
var margin = { top: 30, right: 30, bottom: 70, left: 100 },
    width = parentDiv.clientWidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#records")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Initialize the X axis
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myYaxis")



fetch('https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf')
    .then(response => response.json())
    .then(function (data) {

        // let records = []
        records = data.result.records.filter(record => record.year == "2020")

        // Update the X axis
        x.domain(records.map(function (d) { return d.level_2; }))
        xAxis.call(d3.axisBottom(x))

        // Update the Y axis
        y.domain([0, d3.max(records, function (d) { return parseInt(d.value) })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // labels
        svg
            .append("text")
            .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
            .text("Offences")
            .attr("text-align", "middle");

        svg
            .append("text")
            .attr("transform", "translate(-80, " + (height / 2) + ") rotate(-90)")
            .text("Number of Cases")
            .attr("text-align", "middle");

        // Create the u variable
        var u = svg.selectAll("rect")
            .data(records)

        u
            .enter()
            .append("rect") // Add a new rect for each new elements
            .on("mouseover", function (d) {
                tooltip
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px")
                    .style("position", "absolute")
                    .style("display", "inline-block")
                    .style("background", "#fff")
                    .html((d.level_2) + "<br>" + (d.value));
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); })
            .merge(u) // get the already existing elements as well
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("x", function (d) { return x(d.level_2); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.value); })
            .attr("fill", "#69b3a2")

        u
            .enter()
            .append("text")
            .text(function (d) {
                console.log(d)
                return d.value;
            })
            .attr("x", function (d) { return x(d.level_2) + x.bandwidth() / 2; })
            .attr("y", function (d) { return y(d.value) - 10; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr("text-anchor", "middle");


        // If less group in the new dataset, I delete the ones not in use anymore
        u
            .exit()
            .remove()

    })