var colors = ["rgba(114,229,239,.9)", "rgba(118,204,108,.9)", "rgba(221,142,235,.9)", "rgba(185,246,23,.9)", "rgba(253,137,146,.9)", "rgba(54,229,21,.9)", "rgba(140,171,234,.9)", "rgb(242,231,33)", "rgb(252,143,59)", "rgb(191,205,142)"];
var indicator_colors = ["rgba(200,200,200,.9)", "rgba(0,100,0,.9)", "rgba(50,250,50,.9)", "rgba(200,200,0,.9)", "rgba(50,50,255,.9)"];
var jsonData
var target = d3.select(".svgContainer");
var target_margin = [];
var style_option, subject, page_title

function toggleStyle() {
    style_option = !style_option;

    d3.select(".lightdark")
        .html(function () {
            let tx = !style_option ? "light" : "dark"
            return tx;
        })

    d3.select("body")
        .classed("darkish", function () {
            return style_option;
        })
}

d3.select(".lightdark").on("click", function () {
    toggleStyle()
})


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

// load config values
d3.json("data/config.json", function (obj) {
    for (let key in obj) {
        window[key] = obj[key]
    }

    toggleStyle();
})

d3.json("data/cap_map.json", function (d) {
    jsonData = d
    setTimeout(function () {
        addForceView(target, jsonData, subject)
    }, 500)


    d3.select(".toggler").on("click", function () {
        toggleStyle()
    })

})

var myEfficientFn = debounce(function () {
    addForceView(target, jsonData, subject);
}, 250);

window.addEventListener('resize', myEfficientFn);


