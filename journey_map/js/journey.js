var colors = ["rgba(114,229,239,.9)", "rgba(118,204,108,9)", "rgba(221,142,235,.9)", "rgba(185,246,23,.9)", "rgba(253,137,146,.9)", "rgba(54,229,21,.9)", "rgba(140,171,234,.9)", "rgb(242,231,33)", "rgb(252,143,59)", "rgb(191,205,142)"];
var legend_colors = ["rgba(255,255,255,1)", "rgba(254,228,80,.2)", "rgb(57,151,14,.2)", "rgb(198,219,174,.2)"]
var header_color = "rgba(0,50,250,.8)"
var target
var column_keys = [];
var tooltip = d3.select(".tooltip")
var closebtn = d3.selectAll(".close")
var font_size = 10;
var font_size_header = 15
var char_width = font_size * .5;

var target_svg
var target_margin = {top: 80, right: 50, bottom: 80, left: 250}
var width = window.innerWidth - target_margin.right - target_margin.left
var height = window.innerHeight - target_margin.top - target_margin.bottom - 60
var style_option, subject, x_y_axis, trends, page_title
var row_data
var loadedData
var legend_array = {"stages": 10.5, "steps": 8.5, "touch points": 6.5, "domains": 4.5}
var legend_keys = Object.keys(legend_array)
var legend_y = []
var xScale, yScale, legend_item_height, colw, row_height, header_cols, domain_vspacing, domain_y, chart_width
var domains = []
var setLine = d3.line()

function make_x_gridlines() {
    return d3.axisBottom(xScale)
        .ticks(xticks)
}

function make_y_gridlines() {
    return d3.axisLeft(yScale)
        .ticks(10)
}

// load config values
d3.json("data/config.json", function (obj) {
    for (let key in obj) {
        window[key] = obj[key]
    }
    toggleStyle();
})

function formatData(d) {
    column_keys = Object.keys(d[0]);
    header_cols = []
    let dset = d.filter(function (item) {
        return typeof item.domain === 'string' && !!item.domain
    })
    domains = [...new Set(dset.map((D) => D.domain))];
    domains.sort()

// create objects to segment data into levels
    row_data = Object.create({})
    row_data[legend_keys[0]] = []
    row_data[legend_keys[1]] = []
    row_data[legend_keys[2]] = []

//steps and touch points
    d.forEach((D) => {
        let k = legend_keys[D.row - 1]
        if (D.row == 1) {
            header_cols.push(D.label)
        }
        row_data[k].push(D)
    })

    xticks = header_cols.length-2

    d.filter(function (d) {
        d.y = 11 - d.row
        d.x = d.col
    })

    target = d3.select(".svgContainer");
    setTimeout(function () {
        addScatterView(target, d, subject, x_y_axis);

    }, 200)


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
}

d3.csv("data/data.csv", function (d) {
    formatData(d)
})


function toggleStyle() {

    style_option = !style_option;

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
    d3.selectAll("text")
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

function addScatterView(target, jdata, subject, x_y_axis) {

    setSize();

    var xa = Object.create({});

    var w = window.innerWidth - target_margin.left + target_margin.right;

    function compare(a, b) {
        var aArr = a.toString().split(',');
        var bArr = b.toString().split(',');
        return aArr[id] - bArr[id];
    }

    var data = jdata.sort((a, b) => {
    })

    domain_array = [...new Set(jdata.map(d => d.domain))];

    var b = d3.select("body")
    b.selectAll(".main_svg").remove()

    b.selectAll("h4").remove()

    b.append("h4")
        .classed("subtitle", true)
        .html(page_title)

    b.append("h4").classed("vtab", true)
        .style("width", function () {
            return (window.innerHeight * .8) - 80 + "px"
        })
        .html(subject.toUpperCase())


    // ************** Generate the scatter diagram	 *****************

    // SVG
    target_svg = target.append('svg')
        .attr('height', height + target_margin.top + target_margin.bottom)
        .attr('width', width + target_margin.right)
        .classed("main_svg",true)
        .append('g')
        .classed("mg", true)
        .attr('transform', 'translate(' + target_margin.left + ',' + target_margin.top + ')')

    addLegend()

    var indicators = target_svg.selectAll('trends')
        .data(row_data[legend_keys[0]])
        .enter()
        .append('path')
        .attr("d", "M0.5,0.6h174.7c8.1,9.8,16.3,19.6,24.4,29.4c-8.1,9.7-16.3,19.5-24.4,29.2H0.1C-0.1,59.4,24.5,30,24.7,29.9\tC24.7,29.9,0.2,0.9,0.5,0.6z")
        .classed("header_arrows", true)
        .style("stroke-width", "0px")
        .style("fill", function (d, i) {
            return "url(#gradient2)" //header_color
        })
        .attr("transform", function (d, i) {
            let x = target_margin.left + 10 + (colw * i)
            let y = legend_y[0] * .40
            let scalew = (colw / 180)
            let scaleh = (legend_item_height / 80)
            return "translate(" + x + "," + y + ") scale(" + scalew + "," + scaleh + ")"
        })

    //main header
    var header = target_svg.selectAll('label')
        .data(row_data[legend_keys[0]])
        .enter()
        .append('text')
        .text(function (d) {
            return d.label.toUpperCase()
        })
        .style("font-size", font_size_header)
        .style("fill", "white")
        .classed("header_labels", true)
        .attr('x', function (d, i) {
            let x = target_margin.left + (colw * i)
            return x + (colw * .5)
        })
        .attr('y', function (d) {
            return legend_y[0]
        })
        .on("mouseenter", function (d) {
            showTooltip(d.description)
        })
        .on("mouseleave", function () {
            showTooltip()
        })

    // steps
    target_svg.selectAll('label')
        .data(row_data[legend_keys[1]])
        .enter()
        .append('text')
        .text(function (d) {
            return "▢ " + d.label.toUpperCase()
        })
        //.style("font-size", font_size * 2)
        .classed("labels lightdark", true)
        .attr('x', function (d) {
            let x = target_margin.left + colw * (d.col - 1)
            return x + (colw * .1)
        })
        .attr('y', function (d) {
            return legend_y[1] - (legend_item_height * .9) + (d.seq - 1) * 20
        })
        .on("mouseover", function (d) {
            showTooltip(d.description)
        })
        .on("mouseleave", function () {
            showTooltip()
        })

    var v_grid = target_svg.selectAll('vgrid')
        .data(row_data[legend_keys[0]])
        .enter()
        .append('path')
        .classed("vgrid lightdark", true)
        .attr("stroke","rgba(250,250,250,.8)")
        .attr("d", function (d,i) {
            let x1 = 260 + (colw*i)
            let y2 = legend_y[3]-30
            let x2 = x1
            let y1 = legend_y[1] - legend_item_height - 10
            return setLine([[x1, y1], [x2, y2]])
        })

// touch points

    target_svg.selectAll('label')
        .data(row_data[legend_keys[2]])
        .enter()
        .append('text')
        .text(function (d) {
            return "▢ " + d.label.toUpperCase()
        })
        .style("font-size", font_size * 1.5)
        .classed("labels lightdark", true)
        .classed("domain-item", function (d) {
            return d.row == 3
        })
        .classed("steps-item", function (d) {
            return d.row == 2
        })
        .style("text-decoration", "none")
        .attr('x', function (d, i) {
            let x = target_margin.left + colw * (d.col - 1)
            return x + (colw * .1)
        })
        .attr('y', function (d) {
            return legend_y[2] - (legend_item_height * .9) + (d.seq - 1) * 20
        })
    /*.on("mouseover", function (d) {
        showDomain(d)
    })
    .on("mouseleave", function () {
        showDomain()
    })*/

    // Domain Dots
    target_svg.selectAll('dots')
        .data(row_data[legend_keys[2]])
        .enter()
        .append('rect')
        .classed("domain-dots", true)
        .style("fill", function (d) {
            return getcolor(domains.indexOf(d.domain))
        })
        .style("opacity", 1)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("width", "40px")
        .style("height", "40px")
        .attr('x', function (d) {
            let x = 240 + colw * (d.col - 1)
            return x + (colw * .5)
        })
        .attr('y', function (d, i) {
            return legend_y[3] + (domains.indexOf(d.domain) * domain_vspacing)+domain_vspacing - font_size*.5 - 20
        })
        .transition()
        .duration(1000)
        .delay(function (d, i) {
            let dl = (i * 200) + 1000
            return dl
        })
        .style("opacity", .8)


    var domain_dots = target_svg.selectAll(".domain-dots")

    // domain dot connector to touch points section
    domain_dots.each(function (dd) {
        let bb = d3.select(this).node().getBBox()
        target_svg.append("path")
            .classed("lightdark", true)
            .attr("d", function () {
                let x1 = bb.x + 20
                let y2 = bb.y
                let x2 = x1
                let y1 = yScale(5)
                return setLine([[x1, y1], [x2, y2]])
            })
            .classed("dots-connector", true)

    })


    // X-axis
    var xAxis = d3.axisBottom(xScale)
        .ticks(10)

    // Y-axis
    var yAxis = d3.axisLeft(yScale)
        .ticks(10)


    target_svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (target_margin.left) + ", 0)")
    //.call(yAxis);

    target_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(250," + (height) + ")")
    //.call(xAxis);

    target_svg.append("g")
        .attr("class", "xgrid")
        .attr("transform", "translate(" + (270 + (colw)) + "," + (legend_y[3]) + ")")
    /*.call(make_x_gridlines()
         .tickSize(-height*.5)
         .tickFormat("")
     )*/

    target_svg.append("g")
        .attr("class", "ygrid")
        .attr("transform", "translate(250," + 0 + ")")
    /*.call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    )*/

    d3.selectAll(".axis , g,  .header_labels, .header_arrows")
        .style("opacity", 0)
        .transition()
        .delay(function (d, i) {
            return 0 //+ (i*20)
        })
        .duration(function (d, i) {
                return 1000
            }
        )
        .style("opacity", 1);


    d3.selectAll(".domain-item ,.domain-dots")
        .on("mouseover", function (d) {
            showDomain(d)
        })
        .on("mouseleave", function () {
            showDomain()
        })
}

function showDomain(d) {

    if (!d) {
        showTooltip()
        d3.selectAll(".select")
            .classed("select", false)
        return
    }
    showTooltip(d.description)

    let ID = domains.indexOf(d.domain)
    let COL = d.col


    d3.selectAll(".domain-item,.domain-dots")
        .classed("select", function (dd) {
            let id = domains.indexOf(dd.domain)
            let col = dd.col
            return (id == ID && COL == col)
        })
}

function addLegend() {
    var l = target_svg.append("g")
        .attr("transform", "translate(0, 0)")

    var lh = height;
    var y = 0;

    l.append("rect")
        .style("width", target_margin.left + "px")
        .style("height", lh)
        .attr("rx", 16)
        .attr("ry", 16)
        .classed("legend-panel", true)

    var x = 20;

    legend_keys.forEach(function (d, i) {
        y = y + (row_height * 1.5);
        l.append("rect")
            .classed("lightdark", true)
            .classed("legend-rect", i > 0 && i < 3)
            .attr("rx",function(){
                return i > 1 ? 0 : 16
            })
            .attr("ry", function(){
                return i > 1 ? 0 : 16
            })
            .attr("x", function (d) {
                let lx = i == 0 ? 0 : target_margin.left+10
                return lx
            })
            .attr("y", function () {
                let y = legend_y[i] - (i == 0 ? legend_item_height * .5  : legend_item_height)
                y = i < 3 ? y+10 : legend_y[i]-25
                return y - 20
            })
            .attr("width", function () {
                let w = chart_width
                return w + "px"
            })
            .attr("height", function () {
                h = i == 0 ? legend_item_height : 1.9 * legend_item_height
                h = i < 3 ? h :( h * 1.48)
                h = i == 2 ? h +  30 : h
                return h
            })

            .attr("fill", function () {
                let f = i < 3 ? legend_colors[0] : "url(#gradient1)"
                f = i == 0 ? "none" : f
                return f
            })
            .classed("domains-rect", function () {
                //return i == 3
            })
    })

    legends = target_svg.selectAll(".legend-rect")

        //legends.attr("fill","url(#gradient1")


    var y = legend_y[3];

    legend_keys.forEach(function (d, i) {
        l.append("text")
            .classed("indicator-label", true)
            .attr("y", function () {
                y = legend_y[i]
                return y
            })
            .attr("x", "120px")
            .style("text-anchor", "middle")
            .text(d.toUpperCase())
            .style("fill", function () {
                return "white"
            })
    })
    domain_y = y
    // add domain legend

    domains.forEach(function (d, i) {
        l.append('rect')
            .style("fill", function () {
                return getcolor(domains.indexOf(d))
            })
            .style("opacity", 0)
            .style("width", 250+"px")
            .style("height", domain_vspacing*.98 + "px")
            .attr('x', "0px")
            .attr('y', function () {
                return domain_y + (i * domain_vspacing) +  domain_vspacing *.4
            })
            .transition()
            .duration(1000)
            .delay(function () {
                let dl = (i * 500) + 3000
                return dl
            })
            .style("opacity", .8)
    })

    domains.forEach(function (d, i) {
        l.append("text")
            .classed("indicator-label", true)
            .attr("y", domain_y + (i * domain_vspacing)+domain_vspacing)
            .attr("x", "70px")
            .style("text-anchor", "start")
            .text(d.toUpperCase())
            .style("fill", function () {
                return "white"
            })

    })
    domains.forEach(function (d, i) {
        l.append("rect")
            .classed("legend-icon", true)
            .attr("width","35px")
            .attr("height","35px")
            .attr("fill", function () {
                return "white"
            })
            .attr("x","20px")
            .attr("y",function(){
                let y = domain_y + (i * domain_vspacing)+(domain_vspacing-22)
                return y +"px"
            })
            .attr("fill",function(){
                let dn = d.toLowerCase().replace(" ","_")
                let ic = "url(#"+dn+")"
                return ic
            })

    })

    // add domain dotted lines to the chart

    domains.forEach(function (d, i) {
        l.append("path")
            .attr("d", function () {
                let y1 = domain_y + (i * domain_vspacing)+domain_vspacing - font_size*.5
                let y2 = y1
                let x1 = target_margin.left + 40
                let x2 = x1 + chart_width - 60
                let points = [[x1, y1], [x2, y2]]
                return setLine(points)
            })
            .classed("domain-lines lightdark", true)

    })
}

function setSize() {

    width = window.innerWidth - (target_margin.right + target_margin.left)
    height = window.innerHeight - (target_margin.top + target_margin.bottom)
    row_height = height / legend_keys.length + 1
    chart_width = width - (target_margin.left + target_margin.right) - 260
    colw = chart_width / (header_cols.length )

    xScale = d3.scaleLinear()
        .domain([
            d3.min([0, d3.min(loadedData, function (d) {
                return 11 - d
            })]),
            d3.max([0, 11])

        ])
        .range([0, width - target_margin.left - target_margin.right])

    yScale = d3.scaleLinear()
        .domain([
            d3.min([0, d3.min(loadedData, function (d) {
                return 11 - d
            })]),

            d3.max([0, 11])
        ])
        .range([height, 0])

    let size_scale = Math.min.apply(this, [height / 1000, width / 2000])

    d3.selectAll(".labels").style("font-size", function () {
        return size_scale + "em";
    })
    d3.selectAll(".legend-icon").attr("transform", function () {
        return "translate("+size_scale + "," +size_scale+")";
    })

    legend_item_height = height / (legend_keys.length * 2)

    legend_y = legend_keys.map(function (d, i) {
        let t = i == 0 ? .5 : i < legend_keys.length ? i * 2 : i * 3
        y = i == 3 ? legend_item_height * t - (legend_item_height * .5) : legend_item_height * t + 35
        return y
    })

    domain_vspacing = (legend_item_height * 2) / domains.length

}