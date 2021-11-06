
function readInData(items) {
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    const data = new Blob([csv])
    const a = document.getElementById('exportbutton');
    a.href = URL.createObjectURL(data)
    a.download = "sankey.json";
}

d3.select(".resetbutton")
    .style("opacity",1)
    .on("click",function(){
        window.location.reload()
    })

function readURL(input) {

    fileObj = new FormData();
    fileObj.append('myfile',input.files[0])

    if (input.files && input.files[0]) {

        var n = input.files.length
        var ext = input.files[0].name.toString().split(".").pop().toLowerCase()
            exti = ["csv","json"].indexOf(ext)
            console.log(input.files[0].name.toString().split(".").pop().toLowerCase(),exti)
        if(exti > -1) {

            for (var i = 0; i < n; i++) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    let json = exti == 0 ? csvJSON(reader.result) : JSON.parse(reader.result)
                    title_text = json.title
                    style_option = json.style_option
                    is_fixed = json.is_fixed
                    data = json.data
                    toggleStyle()
                    load(data);

                };
                reader.readAsText(input.files[i]);
            }
        }
        else{
            alert("Please select a CSV or JSON file")
            return
            }
    }

}

function csvJSON(csv){

    var lines= csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        if(lines[i].length>0) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                let hdr = headers[j].replace("\r","")
                if(currentline[j].length < 1){
                    alert(hdr+ " should not be empty")
                }
                var re = /\r|\n/g
                var v = currentline[j].replace(re,"");
                v = (parseInt(v) == v) ? parseInt(v) : v
                obj[hdr] = v;

            }
    }
        result.push(obj);
    }
    return (result);
}

function jsonCSV(json){
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(json[0])
    const csv = [
        header.join(','), // header row first
        ...json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')
    console.log(csv)
}