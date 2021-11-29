function pieChart() {
    this.target = d3.select("body");
    this.width = this.width || 50;
    this.height = this.height || 50;
    this.x = this.x || 600;
    this.y = this.y || 20;
    this.data = this.data || {"label1": 10, "label2": 20, "label3": 30};
    this.inner_radius = this.inner_radius || 10;
    this.colors = this.colors || ["rgba(114,229,239,.9)", "rgba(118,204,108,9)", "rgba(221,142,235,.9)", "rgba(185,246,23,.9)", "rgba(253,137,146,.9)", "rgba(54,229,21,.9)", "rgba(140,171,234,.9)", "rgb(242,231,33)", "rgb(252,143,59)", "rgb(191,205,142)"];
    this.radius = this.width / 2;

    this.makeIt = function () {
        let colors = this.colors;
        let radius = this.radius;


        let s = this.target.append("svg")
        s.attr("width", this.width)
            .attr("height", this.height)
            .style("position", "absolute")
            .style("top", this.y)
            .style("left", this.x)


        g = s.append("g").attr("transform", "translate(" + this.radius + "," + this.radius + ")");

        var labels = Object.keys(this.data);
        var pdata = labels.map(d => this.data[d]);
        var total = pdata.reduce(function (a, b) {
            return a + b;
        }, 0)
        var values =  labels.map(d => Math.round((this.data[d]/total)*100));
        // Generate the pie
        var pie = d3.layout.pie();

        // Generate the arcs
        var arc = d3.svg.arc()
            .innerRadius(this.inrad)
            .outerRadius(this.radius);

        //Generate groups
        var arcs = g.selectAll("arc")
            .data(pie(pdata))
            .enter()
            .append("g")
            .attr("class", "arc")

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                let c = colors[i]
                return c;
            })
            .style("stroke-width", 1)
            .style("stroke", "rgba(255,255,255,.5")
            .attr("d", arc)
            .style("cursor", "pointer")
            .on("mouseenter", function (d, i) {
                let t = labels[i]
                showSlice(t)
            })
            .on("mouseleave", function () {
                showSlice()
            })

        arcs.append("text")
            .attr("transform", function (d,i) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                console.log(radius)
                return "translate(" + d3.svg.arc().centroid(d,i) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) {
                let v = values[i]
                return (v > 10) ? v+"%" : "";
            })
            .style("font-size",".5em");
    }
}