var colors = ["rgba(114,229,239,.9)", "rgba(118,204,108,9)", "rgba(221,142,235,.9)", "rgba(185,246,23,.9)", "rgba(253,137,146,.9)", "rgba(54,229,21,.9)", "rgba(140,171,234,.9)", "rgb(242,231,33)", "rgb(252,143,59)", "rgb(191,205,142)"];
var target
var legend_array = [];
var column_keys = [];
var tooltip = d3.select(".tooltip")
var closebtn = d3.selectAll(".close")
var font_size = 10;
var char_width = font_size * .5;
var row_height = font_size * 2;

var target_svg
var target_margin = {top: 150, right: 250, bottom: 80, left: 100}
var width = window.innerWidth - target_margin.right - target_margin.left
var height = window.innerHeight - target_margin.top - target_margin.bottom - 60

var plot_obj = Object.create({})
var grid_unit_w = (width - (target_margin.left + target_margin.right)) / 11

var style_option,subject,x_y_axis,trends ,page_title

var loadedData

// load config values
d3.json("data/config.json", function (obj) {
    for (let key in obj) {
        window[key] = obj[key]
    }
    toggleStyle();
})

d3.csv("data/data.csv", function (d) {

    column_keys = Object.keys(d[0]);

    let plot_arr = [...new Set(d.map((D) => D.plot))];

    plot_arr.forEach(function (d) {
        plot_obj[d] = []
    })

    d.forEach(function (d) {
        plot_obj[d.plot].push(d.id)
    })

    target = d3.select(".svgContainer");
    addScatterView(target, d, subject, x_y_axis);

    loadedData = d

    const items = d
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    const data = new Blob([csv])
    const a = document.getElementById('exportbutton');
    a.href = URL.createObjectURL(data)
    a.download = "application_data.csv";

    d3.select(".toggler").on("click", function () {
        toggleStyle()
    })

})


function toggleStyle() {

    style_option = !style_option;

    console.log(style_option)

    d3.select(".toggler")
        .html(function () {
            let tx = !style_option ? "light" : "dark"
            return tx;
        })

    d3.select("body")
        .classed("darkish", function () {
            return style_option;
        })
    d3.selectAll("button")
        .classed("darkish", function () {
            return style_option;
        })


}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var myEfficientFn = debounce(function () {

    addScatterView(target, loadedData, subject, x_y_axis);

}, 250);


window.addEventListener('resize', myEfficientFn);


closebtn.on("click", function () {
    hidePopups();
    showTooltip()
})
tooltip.on("mouseleave", function () {
    showTooltip()
})


var getcolor = function (i) {
    if (i < 0) {
        i = colors.length - i
    }
    i = i % 10;
    return colors[i]
}

function openURL(u) {
    window.open(u, "_blank")
}

function showTooltip(d) {
    tooltip.selectAll("span").remove()
    tooltip.style("left", "-4000px")
        .style("opacity", 0)
    tooltip.selectAll("button").remove()

    d3.event.preventDefault();
    let pos = [d3.event.pageX, d3.event.pageY - 80];

    if (d) {
        let ttb = tooltip.append("button")
            .classed("close", true)
            .attr("aria-label", "Close")
            .append("span")
            .attr("aria-hidden", true).html("&times;")

        ttb.on("click", function () {
            showTooltip()
        })

        tooltip.append("span")
            .classed(".tool-content", true)
            .html(d)

        tooltip.style("top", pos[1] + "px")
            .style("left", pos[0] + 20 + "px")

        tooltip.transition()
            .duration(4)
            .style("opacity", 1)

    } else {
        return
    }

}

function addScatterView(target, jdata, subject, x_y_axis)
{

    setSize();

    var xa = Object.create({});

    var w = window.innerWidth - target_margin.left + target_margin.right;
    var q = Object.create({})
    q[0] = [];
    q[1] = [];
    q[2] = [];
    q[3] = [];
    q[0][0] = (window.innerWidth / 2) - (w * .25)
    q[0][1] = (window.innerHeight / 2) - (height * .33)
    q[1][0] = (window.innerWidth / 2) + (w * .05)
    q[1][1] = (window.innerHeight / 2) - (height * .33)
    q[3][0] = (window.innerWidth / 2) - (width * .33)
    q[3][1] = (window.innerHeight / 2) + (height * .1)
    q[2][0] = (window.innerWidth / 2) + (width * .05)
    q[2][1] = (window.innerHeight / 2) + (height * .1)

    function compare(a, b) {
        var aArr = a.toString().split(',');
        var bArr = b.toString().split(',');
        return aArr[id] - bArr[id];
    }

    console.log(jdata)

    var data = jdata.sort((a, b) => {
    })

    legend_array = [...new Set(jdata.map(d => d.domain))];

    var b = d3.select("body")
    b.selectAll("svg").remove()

    var legend = b.append("svg")
        .classed("legend", true)

    b.selectAll("h4").remove()


    b.append("h4")
        .classed("subtitle", true)
        .html(page_title)

    b.append("h4").classed("vtab", true)
        .style("width", function () {
            return (window.innerHeight * .8) - 80 + "px"
        })
        .html(subject.toUpperCase())


    var icondefs = b.append("svg")
        .classed("iconbox", true)
        .append("defs")

    icondefs.append("pattern")
        .attr("patternUnits", "objectBoundingBox")
        .attr('id', "up")
        .attr("viewBox", "0,0,104,104")
        .attr('height', 1)
        .attr('width', 1)
        .attr('x', 0)
        .attr('y', 0)
        .append("path")
        .attr("d", "M43.6,59.5c-8.2,0-16.2,0-24.5,0C30.2,40.3,41.2,21.2,52.3,2c11.1,19.2,22.1,38.3,33.2,57.5c-8.2,0-16.3,0-24.4,0\n" +
            "\tc0,13.8,0,27.4,0,41.1c-5.9,0-11.7,0-17.5,0C43.6,87,43.6,73.3,43.6,59.5z")


    icondefs.append("pattern")
        .attr("patternUnits", "objectBoundingBox")
        .attr('id', "parking")
        .attr("viewBox", "0,0,170,170")
        .attr('height', 1)
        .attr('width', 1)
        .attr('x', 0)
        .attr('y', 0)
        .append("path")
        .attr("d", "M85.3,163.1c8.9,0,17.9,0,26.8,0c4.5,0,4.5,0,5.4-4.3c5.5-26.8,11.1-53.5,16.5-80.3c1-5,2.2-10.2,2-15.2\n" +
            "\t c-0.4-7.9-3.9-15-8.9-21C113.7,26,96.3,19.8,75.9,23.3C56.7,26.6,43,37.4,36.3,56.1c-1.5,4.2-2.4,8.5-1.5,13.1 \n" +
            "\tc6.3,30.2,12.5,60.3,18.6,90.5c0.6,2.8,1.8,3.5,4.4,3.4C67,163,76.2,163.1,85.3,163.1z M69.3,169.3c-4,0-7.8,0-11.5,0 \n" +
            "\tc-4.9,0-9.5-2.3-10.7-8.8c-5.9-30.1-12.2-60.1-18.5-90.1c-1.2-5.9-0.2-11.5,1.8-16.9c7.3-20,22.1-31.7,42.5-36.3 \n" +
            "\tc24.4-5.5,50.3,5.5,62.8,26.3c3.3,5.6,6.1,11.6,6.5,18c0.3,5.4-0.6,11-1.7,16.4c-5.6,27.9-11.4,55.8-17.2,83.7 \n" +
            "\tc-1.1,5.4-3.8,7.5-9.3,7.6c-3.9,0.1-7.7,0-11.6,0.1c-0.2,0-0.4,0.1-1.1,0.3 M76.4,66.8c-1.7-2.4-3.7-5-5.6-7.6 \n" +
            "\tc-1.5-2.1-1.5-4.2,0.6-5.8c2.1-1.5,4.1-0.8,5.7,1.2c2,2.6,3.8,5.3,5.9,7.8c0.8,0.9,2,1.9,3.1,2c4.7,0.4,8.2,2.6,11.2,6\n" +
            "\t c0.8,0.9,2.1,1.6,3.2,1.7c3.2,0.1,9.3,0.3,18.5,0c7.6-0.2,11.5-6.8,7.8-13.5c-9-16.5-22.9-25.4-41.8-25.3 \n" +
            "\tc-18.7,0.1-32.5,9.1-41.4,25.4c-3.7,6.7,0.3,13.1,8,13.4c4.5,0.1,9-0.2,13.4,0.1C70,72.6,74,71.9,76.4,66.8z M85.2,134.3 \n" +
            "\tc-5.2,0-10.3,0.1-15.5,0c-5.9-0.1-9.9-4-9.9-9.9c-0.1-9.3-0.1-18.6,0-28c0-5.9,4-9.9,9.9-10c10.5-0.1,21-0.1,31.5,0 \n" +
            "\tc5.9,0.1,9.7,4.1,9.8,10.1c0.1,9.2,0.1,18.4,0,27.7c0,6.1-4,10.1-10,10.1C95.7,134.3,90.4,134.3,85.2,134.3z M85.4,92.7 \n" +
            "\tc-5,0-9.9,0-14.9,0c-3.3,0-4.3,0.9-4.3,4.2c0,8.9,0,17.8,0,26.7c0,3.3,0.9,4.2,4.3,4.2c9.9,0,19.8,0,29.7,0c3.4,0,4.3-0.9,4.3-4.3 \n" +
            "\tc0-8.9,0-17.8,0-26.7c0-3.3-0.9-4.2-4.3-4.2C95.3,92.7,90.3,92.7,85.4,92.7z M66.3,153.5c0.6,1.2,1.8,2.9,2.9,3 \n" +
            "\tc1,0.1,2.9-1.5,3.1-2.6c0.5-2.3,0.5-4.8,0-7c-0.2-1.1-2.1-2.7-3.1-2.6c-1,0-2.2,1.7-2.9,2.9c-0.4,0.7-0.1,1.9-0.1,2.9 \n" +
            "\tC66.3,151.2,65.9,152.6,66.3,153.5z M104.4,146.8c-0.6-1.1-1.9-2.6-2.9-2.6c-1,0-2.9,1.4-3,2.4c-0.4,2.5-0.4,5.2,0,7.6 \n" +
            "\tc0.2,1,2,2.4,3.1,2.3c1-0.1,2.3-1.6,2.8-2.7c0.5-1,0.1-2.3,0.1-3.5S104.9,147.7,104.4,146.8z M82.4,153.8c0.5,1.1,2,2.7,2.8,2.6\n" +
            "\t c1.2-0.1,2.8-1.6,3.1-2.7c0.5-2.3,0.4-4.8,0-7c-0.2-1.1-1.9-2.7-2.8-2.6c-1.2,0.1-2.4,1.5-3.1,2.7c-0.5,0.8-0.1,2.1-0.1,3.2 \n" +
            "\tC82.3,151.3,81.9,152.8,82.4,153.8z M88.9,40.7c-1.2-0.8-2.4-2.1-3.7-2.2c-1.9-0.2-3.3,1.4-2.8,3.2c0.3,1.2,1.9,2.8,3,2.8 \n" +
            "\tc1.2,0,2.4-1.5,3.6-2.4C89,41.7,89,41.2,88.9,40.7z M63.4,60.2c-1.2-0.9-2.4-2.4-3.6-2.4c-1.1,0-2.7,1.6-3,2.8 \n" +
            "\tc-0.6,1.9,0.9,3.4,2.7,3.3c1.3-0.1,2.5-1.4,3.8-2.2C63.4,61.1,63.4,60.6,63.4,60.2z M114.5,59.9c-1.2-0.8-2.4-2.1-3.7-2.3 \n" +
            "\tc-1.8-0.2-3.3,1.4-2.8,3.2c0.3,1.2,1.9,2.8,3,2.8c1.2,0,2.4-1.5,3.6-2.3C114.6,60.9,114.5,60.4,114.5,59.9z M65.8,48.5 \n" +
            "\tc1.2,0.8,2.4,2.3,3.6,2.3c1.1,0,2.7-1.5,3-2.7c0.5-1.8-0.8-3.4-2.8-3.2c-1.3,0.1-2.5,1.4-3.8,2.1C65.8,47.5,65.8,48,65.8,48.5z \n" +
            "\t M100.6,44.3c-0.8,1.2-2.2,2.5-2.1,3.7c0.1,1.1,1.7,2.6,2.9,2.9c1.9,0.4,3.4-1,3.1-2.9c-0.2-1.3-1.5-2.4-2.3-3.6 \n" +
            "\tC101.6,44.3,101.1,44.3,100.6,44.3z M82.2,101.6c-0.1,3.7,0.6,7.4-2.5,10.8c-2,2.2-0.6,6,1.9,7.8c2.4,1.8,5.7,1.6,8-0.4 \n" +
            "\tc2.3-2.1,3.2-5.8,1.1-8c-2.3-2.4-2.1-5.1-2.1-7.9c0-1.5,0-3.1,0-4.8c-2.2,0-4.1,0-6.2,0C82.3,100.3,82.2,100.9,82.2,101.6z")


    var l = legend.append("g")
    var lh = ((row_height * 1.5) * 10) + (legend_array.length * (row_height * 1.5));
    var y = row_height * 2;

    l.append("rect")
        .style("width", "300px")
        .style("height", lh)
        .attr("rx", 6)
        .attr("ry", 6)
        .classed("legend-panel", true)

    legend.style("height", lh)
        .style("width", "300")

    l.append("text")
        .classed("indicator-label", true)
        .attr("y", y)
        .attr("x", "60px")
        .text("DOMAIN")

    var x = 30;

    legend_array.forEach(function (d, i) {
        y = y + (row_height * 1.5);
        l.append("rect")
            .classed("legend-rect", true)
            .attr("x", x)
            .attr("y", y)
            .attr("rx", function () {
                var r = 12
                return r
            })
            .attr("ry", function () {
                var r = 12
                return r
            })
            .attr("width", function () {
                let w = ((d.length + 6) * char_width) + 45

                return w
            })
            .attr("height", function () {
                let h = row_height
                return h
            })
            .style("fill", function () {
                let c = getcolor(i);
                return c
            })
    })

    var y = row_height * 2;

    legend_array.forEach(function (d, i) {
        y = y + (row_height * 1.5);
        l.append("rect")
            .classed("circle-plot", true)
            .attr("x", x)
            .attr("y", y)
            .attr("rx", function () {
                var r = 12
                return r
            })
            .attr("ry", function () {
                var r = 12
                return r
            })
            .attr("width", function () {
                let w = row_height
                return w
            })
            .attr("height", function () {
                let h = row_height
                return h
            })
            .style("stroke", function () {
                let c = getcolor(i);
                return c
            })

        l.append("text")
            .classed("indicator-label", true)
            .attr("y", y + (row_height * .7))
            .attr("x", "55px")
            .text(d)
            .style("fill", function () {
                return "black"
            })
    })


    y += row_height * 4;

    l.append("text")
        .classed("indicator-label", true)
        .attr("y", y)
        .attr("x", "60")
        .text("RESOURCE PLANNING")

    y += row_height;

    trends.forEach(function (d, i) {
        y += row_height * 1.5;
        l.append('circle')
            .classed("indicator", true)
            .attr('cx', 40)
            .attr('cy', y)
            .attr('r', 10)
            .attr("fill", function () {
                let u = !d.toString().localeCompare("Parked") ? 'url(#parking)' : 'url(#up)'
                return u
            })
            .attr("transform", function () {
                let r = !d.toString().localeCompare("Parked") ? 0 : i * 90;
                let x = 40;
                return "rotate(" + r + "," + x + "," + y + ")"
            })

        l.append("text")
            .classed("indicator-label", true)
            .attr("y", y + (row_height * .25))
            .attr("x", "60px")
            .text(d)
    })

    // ************** Generate the scatter diagram	 *****************


    var xScale = d3.scale.linear()
        .domain([
            d3.min([0, d3.min(data, function (d) {
                return d.a_value
            })]),
            d3.max([0, 11])

        ])
        .range([0, width - target_margin.left - target_margin.right])
    var yScale = d3.scale.linear()
        .domain([
            d3.min([0, d3.min(data, function (d) {
                return d.b_value
            })]),

            d3.max([0, 11])
        ])
        .range([height, 0])

    // SVG
    target_svg = target.append('svg')
        .attr('height', height + target_margin.top + target_margin.bottom)
        .attr('width', width + target_margin.right)
        .append('g')
        .classed("mg", true)
        .attr('transform', 'translate(' + target_margin.left + ',' + target_margin.top + ')')

    target_svg.selectAll("line.horizontalGrid").data(yScale.ticks(10)).enter()
        .append("line")
        .attr(
            {
                "class": "horizontalGrid",
                "x1": target_margin.left,
                "x2": width - target_margin.right,
                "y1": function (d) {
                    return yScale(d);
                },
                "y2": function (d) {
                    return yScale(d);
                },
                "fill": "none",
                "shape-rendering": "crispEdges",
            });

    target_svg.selectAll("line.verticalGrid").data(yScale.ticks(10)).enter()
        .append("line")
        .attr(
            {
                "class": "horizontalGrid",
                "y1": 0,
                "y2": height,
                "x1": function (d) {
                    return xScale(d) + target_margin.left;
                },
                "x2": function (d) {
                    return xScale(d) + target_margin.left;
                },
                "fill": "none",
                "shape-rendering": "crispEdges",
            });

    target_svg.append("g")
        .attr("transform", 'translate(' + q[0][0] + ',' + q[0][1] + ')')
        .append("text")
        .text("Tolerate")
        .classed("quad_labels", true)

    target_svg.append("g")
        .attr("transform", 'translate(' + q[1][0] + ',' + q[1][1] + ')')
        .append("text")
        .text("Invest")
        .classed("quad_labels", true)

    target_svg.append("g")
        .attr("transform", 'translate(' + q[2][0] + ',' + q[2][1] + ')')
        .append("text")
        .text("Migrate")
        .classed("quad_labels", true)

    target_svg.append("g")
        .attr("transform", 'translate(' + q[3][0] + ',' + q[3][1] + ')')
        .append("text")
        .text("Eliminate")
        .classed("quad_labels", true)

    // label rect
    var rects = target_svg.selectAll('rects')
        .data(data)
        .enter()
        .append('rect')
        .classed("label-plot", true)
        .style("width", function (d) {
            let w = Math.min.apply(this, [grid_unit_w, ((d.name).length * char_width) + 45])
            return w
        })
        .style("height", row_height)
        .attr('x', function (d) {
            return (xScale(d.a_value) + target_margin.left) - 10
        })
        .attr('y', function (d) {
            let i = plot_obj[d.plot].indexOf(d.id)
            return yScale(d.b_value) - (row_height * .5) + (row_height * i) + (i * 2)
        })
        .attr('rx', function (d) {
            return 8
        })
        .attr('ry', function (d) {
            return 8
        })
        .attr('fill', function (d, i) {
            return getcolor(legend_array.indexOf(d.domain))
        })



    // Circles
    var circles = target_svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .classed("circle-plot", true)
        .attr('cx', function (d) {
            return (xScale(d.a_value) + target_margin.left)
        })
        .attr('cy', function (d) {
            let i = plot_obj[d.plot].indexOf(d.id)
            return yScale(d.b_value) + (row_height * i) + (i * 2)
        })
        .attr('r', function (d) {
            return row_height * .6
        })
        .attr('stroke', function (d, i) {
            return getcolor(legend_array.indexOf(d.domain))
        })
        .on('mouseover', function (d) {
            let t = "<h4>" + d.name + "</h4>" + x_y_axis[0] + ":" + d.a_value + "<br>" + x_y_axis[1] + ":" + d.b_value + "<p>" + d.description
            showTooltip(t)
        })
        .on('mouseout', function () {
            showTooltip("")
        })
        .append('title') // Tooltip
        .text(function (d) {
            return d.a_value
        })

    var indicators = target_svg.selectAll('trends')
        .data(data)
        .enter()
        .append('circle')
        .classed("indicator", true)
        .attr('cx', function (d) {
            return (xScale(d.a_value) + target_margin.left)
        })
        .attr('cy', function (d) {
            let i = plot_obj[d.plot].indexOf(d.id)
            return yScale(d.b_value) + (row_height * i) + (i * 2)
        })
        .attr('r', function (d) {
            return 10
        })
        .attr("fill", function (d) {
            let u = +d.arb_status == "0" ? 'url(\"#parking\")' : 'url(\"#up\")'
            return u;
        })
        .attr("transform", function (d) {
            let i = plot_obj[d.plot].indexOf(d.id)
            let r = +d.production_status <= 0 ? 180 : +d.production_status < 4 ? 0 : 90;
            r = !d.toString().localeCompare("Parked") ? 0 : r
            let x = (xScale(d.a_value) + target_margin.left);
            let y = yScale(d.b_value) + (row_height * i) + (i * 2);
            return "rotate(" + r + "," + x + "," + y + ")"
        })

    target_svg.selectAll('label')
        .data(data)
        .enter()
        .append('text')
        .text(function (d) {
            return d.name
        })
        .style("font-size", font_size)
        .classed("labels", true)
        .attr('x', function (d) {
            return (xScale(d.a_value) + target_margin.left + font_size * 1.5)
        })
        .attr('y', function (d) {
            let i = plot_obj[d.plot].indexOf(d.id)
            return yScale(d.b_value) + row_height * .2 + (row_height * i) + (i * 2)
        })

        .on('mouseover', function (d) {
            let t = "<h4>" + d.name + "</h4>" + x_y_axis[0] + ":" + d.a_value + "<br>" + x_y_axis[1] + ":" + d.b_value
            showTooltip(t)
        })
        .on('mouseout', function () {
            showTooltip("")
        })


    // X-axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(10)
        .orient('bottom')
    // Y-axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(10)
        .orient('left')

    // X-axis
    target_svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + (target_margin.left) + ',' + height + ')')
        .call(xAxis)
        .append('text') // X-axis Label
        .attr('class', 'label')
        .attr('y', -20)
        .attr('x', width - target_margin.right - target_margin.left - 10)
        .attr('dy', '.5em')
        .style('text-anchor', 'end')
        .text(x_y_axis[0])
    // Y-axis
    target_svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + target_margin.left + ',' + 0 + ')')
        .call(yAxis)
        .append('text') // y-axis Label
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -10)
        .attr('y', 10)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(x_y_axis[1])

    d3.selectAll(".quad_labels")
        .style("opacity", 0)
        .transition()
        .delay(function (d, i) {
            return 200 + (i * 500)
        })
        .style("opacity", 1)

    d3.selectAll(".axis , .horizontalGrid, verticalGrid , .circle-plot ,.label-plot, .indicator, text, .legend")
        .style("opacity", 0)
        .transition()
        .delay(function (d, i) {
            return 2500 //+ (i*20)
        })
        .duration(function (d, i) {
                return 1000
            }
        )
        .style("opacity", 1);

}

function setSize() {

    width = window.innerWidth - target_margin.right - target_margin.left
    height = window.innerHeight - target_margin.top - target_margin.bottom - 60

    //let size_scale = height < 1000 || width < 1500 ? 1 : 1
    let size_scale = Math.min.apply(this, [height / 1000, width / 2000])

    d3.select(".labels").style("font-size", function () {
        //return size_scale + "em";
    })

}

//setSize()