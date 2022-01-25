function addTableView(target,data){

    var last_row = data[data.length-1];

    var tcolumns = Object.keys(data[0]).map(function(d){
        return d
    });

    target.html("")

    var table = target.append('table')
        .style("opacity",1)
        .style("width","100%")

    var thead = table.append('thead')
    var	tbody = table.append('tbody')

    thead.append('tr')
        .selectAll('th')
        .data(tcolumns).enter()
        .append('th')
        .classed("thead",true)
        .html(function (column) { var col = column;  return col; })

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
        .append('td')
        .html(function (d) {
            return "";
        })
        .data(function (row,i) {
            return (tcolumns).map(function (column) {
                return {col: column,value: row[column]};
            });
        })
        .enter()
        .append('td')
        .html(function (d) {
            return (d.value) ;
        })
        .style("text-align",function(d,i){
            return "left"
        })
        .style("background-color",function(d){
            let sv = d.col.replace("source_","")
            let tv = d.col.replace("target_","")

            let bg = (sv == legend_key || tv == legend_key) ? color(d.value) : "transparent"
            return bg
        })

        target.style("height",function(){
            let h = window.innerHeight - 200
            return h;
        });
    //return table;

}

