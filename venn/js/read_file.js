function readURL(input) {

    d3.select(".resetbutton")
        .style("opacity",1)
        .on("click",function(){
            window.location.reload()
        })

    fileObj = new FormData();
    fileObj.append('myfile',input.files[0])

    if (input.files && input.files[0]) {

        var n = input.files.length

        if(input.files[0].name.toString().split(".").pop().toLowerCase() != "json"){
            alert("Files must be JSON !")
            return
        }

        for( var i =0; i < n ; i++){
            var reader = new FileReader();

            reader.onload = function (e) {
                const d = reader.result
                const jsondata = JSON.parse(d)

                const jsonstring = JSON.stringify(jsondata)
                const data = new Blob([jsonstring])
                const a = document.getElementById('exportbutton');
                a.href = URL.createObjectURL(data)
                a.download = "application_data.json";

                readData(jsondata)
                render(sets);
            };
            reader.readAsText(input.files[i]);
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
                if(currentline[j].length < 1){
                    alert(headers[j]+ " should not be empty")
                }
                obj[headers[j]] = currentline[j];

            }
    }
        result.push(obj);
    }
    return (result);
}