function ImportFeature() {

    this.readURL = function (input) {

        this.showData()
        this.showAbout()

        fileObj = new FormData();
        fileObj.append('myfile', input.files)

        const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});

        var sortedFiles = Object.create({})
        if (input.files && input.files[0]) {

            for (let i = 0; i < input.files.length; i++) {
                sortedFiles[input.files[i].name] = input.files[i]
            }
            sortedFiles = sortObject(sortedFiles)

            //const n = Object.keys(sortedFiles).length

            Object.keys(sortedFiles).forEach((sf, i) => {
                let f = sortedFiles[sf]
                const ext = f.name.toString().split(".").pop().toLowerCase()
                const exti = ["csv", "json"].indexOf(ext)
                if (exti > -1) {
                    const isDated = this.checkForDate(f.name)
                    const isJson = exti == 0 ? false : true
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        let d = !isJson ? this.csvJSON(reader.result) : JSON.parse(reader.result)
                        if (d !== "error") {
                            this.addDataObject(i, d, isDated, isJson)
                        }
                        this.defaultFunction();
                    };
                    reader.readAsText(f);
                } else {
                    const msg = n > 1 ? "None CSV or JSON files are ignored" : "Please select a CSV or JSON file"
                    alert(msg)
                    if (n == 1) {
                        return
                    }
                }
            })

        }

    }

    this.readInData = function (items) {

        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        this.csv = [
            header.join(','), // header row first
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n')
    }

    this.addButtons = (x, y) => {

        var b = d3.select("body")

        var rb = b.append("button")
            .classed("btn lightdark", true)
            .style("position", "absolute")
            .style("top", y + "px")
            .style("right", x + "px")
            .html("RESET")

        rb.on("click", function () {
            window.location.reload()
        });

        x += 80

        var eb = b.append("button")
            .classed("btn exportbutton lightdark", true)
            .style("position", "absolute")
            .style("top", y + "px")
            .style("right", x + "px")
            .attr("id", "exportbutton")
            .on("click", function () {
                importFeature.downloadFile()
            })
            .on("mouseover", function () {
                importFeature.csv = importFeature.jsonCSV(jsonData)
            })
            .html("EXPORT")

        x += 90

        const ib = b.append("button")
            .classed("btn inputbutton lightdark", true)
            .style("position", "absolute")
            .style("top", y + "px")
            .style("right", x + "px")
            .html("IMPORT")

        const sb = b.append("input")
            .classed("selFile lightdark", true)
            .style("position", "absolute")
            .style("top", y + "px")
            .style("right", x + "px")
            .attr("type", "file")
            .attr("id", "myfile")
            .attr("name", "myfile")
            .attr("multiple", "multiple")
            .on("change", function () {
                importFeature.readURL(this)
            })

        x += 90

        this.tab = b.append("button")
            .classed("btn tabbutton lightdark", true)
            .style("opacity", 0)
            .style("top", y + "px")
            .style("right", x + "px")
            .style("z-index", 2000)
            .html("DATA")
            .on("click", function () {
                importFeature.showData(1)
            });

        x += 80
        this.abt = b.append("button")
            .classed("btn aboutbutton lightdark", true)
            .style("opacity", 0)
            .style("top", y + "px")
            .style("right", x + "px")
            .style("z-index", 2000)
            .html("about")
            .on("click", function () {
                importFeature.showAbout(1)
            });

        d3.selectAll('.btn:not(.data-selector)')
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .duration(1000)
            .style("opacity", 1)

        x += 90

        this.ds = b.append("select")
            .classed("date-selector selector minimal", true)
            .style("opacity", 0)
            .style("top", y + "px")
            .style("right", x + "px")
            .style("z-index", 2000)
            .on("change", function () {
                let o = d3.select(this)
                let v = o.node().value
                importFeature.updateChart(v)
            });

        this.abtdv = b.append("div")
            .classed("popup", true)
            .style("opacity", 0)
            .style("z-index", 10000)
            .html("text" + about)
            .on("click", function () {
                importFeature.showAbout()
            });

    }

    this.showAbout = function () {

        let a = d3.select(".popup")
            .html(about)

        let o = a.style("opacity")
        o = o != 1 ? 1 : 0

        a.style("top", function () {
            let t = -2000 + (o * 2080)
            return t
        })

        a.transition()
            .duration(1000)
            .style("opacity", function () {
                return o
            })
    }

    this.showData = function () {

        let a = d3.select(".popup")

        let o = a.style("opacity")
        o = o != 1 ? 1 : 0

        if(o) {
            addTableView(a,jsonData)
        }

        a.style("top", function () {
            return -2200 + (o * 2080)+"px"
        })

        a.transition()
            .duration(1000)
            .style("opacity", function () {
                return o
            })
    }

    this.downloadFile = function () {
        var blob = new Blob([this.csv]);
        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        var a = document.createElement("a")
        a.setAttribute("id", "download");
        a.download = "sankey.csv";
        a.href = URL.createObjectURL(blob);
        a.dispatchEvent(event);
        a.remove()
    }


    this.csvJSON = function (csv) {
        var re = /\r|\n/g
        var re2 = /[\"]/g
        var re3 = /[,]/g
        var lines = csv.split("\n");
        var error = 0

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var ln = lines[i]

            if (ln.split('","').length == headers.length) {
                var obj = {};
                var cols = ln.split('","');
                if (cols.length < 1) {
                    alert(ln + " CSV data columns should have double quotes")
                    error++
                }

                for (var j = 0; j < headers.length; j++) {
                    let hdr = headers[j].replace(re, "")
                    //if (cols[j].length < 1) {
                    //alert(hdr+ " should not be empty")
                    //}

                    var v = cols[j] ? cols[j].replace(re, "") : "";
                    v = (parseInt(v) == v) ? parseInt(v).replace(re2, "") : v.replace(re2, "")
                    v = v.replace(re3, "\,")
                    obj[hdr] = v;

                }
                result.push(obj);
            }

        }
        if (error == 0) {
            return (result);
        } else {
            return "error"
        }

    }

    this.jsonCSV = function (json) {
        const replacer = (key, value) => value === null ? '' : value  // specify how you want to handle null values here
        const header = Object.keys(json[0])
        const csv = [
            header.join(','), // header row first
            ...json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\n')
        return csv
    }
    this.checkForDate = function (d) {
        const re = new RegExp("\\d{2}[-.\\/]\\d{2}(?:[-.\\/]\\d{2}(\\d{2})?)?")
        const n = d.split(".").shift()
        const dix = n.search(re) - 2
        const v = n.substring(dix)
        return dix > 0 ? v : n
    }

    this.addDataObject = (i, d, isDated) => {
        if (i == 0) {
            this.dataArr = Object.create({});
            this.dates = [];
            this.csv = this.jsonCSV(d)
            this.ds.selectAll("option").remove()
            jsonData = d;
        }
        if (isDated) {
            this.dataArr[isDated] = d
            this.dates.push(isDated)
            this.ds.append("option")
                .attr("value", isDated)
                .html(isDated)
            this.ds
                .transition()
                .duration(1000)
                .style("opacity", 1)
        }
    }
    this.updateChart = (v) => {
        duration = 0
        delay = 0
        jsonData = this.dataArr[v];
        this.defaultFunction()
    }
}