var types_array = [];
var indicator_array = ["current_state","future state","in process","implemented"];
var context_li = {
    "view": ["More Details", "Field List"],
    "subview": ["More Details", "Field List"],
    "quicksight": ["More Details", "Field List"],
    "persona": ["More Details"],
    "domain": ["More Details"],
    "subdomain": ["More Details"],
    "data": ["More Details"],
    "data-ns": ["More Details"],
    "entity": ["More Details"],
    "application": ["More Details"],
    "capability":["More Details","Links"]

};
var context_obj = {
    "More Details": "description",
    "Field List": "items",
    "Links": "links"
}
var char_width = 8
var dash = 0;
var tooltip
var closebtn = d3.selectAll(".close")
var popup = d3.select(".popup")
var contextmenu = d3.select(".context-menu")

d3.select('.saveas').on("click",function(){
    let svgElement = document.getElementById('svgobject');
    let filename = subject ? subject.replace(/\s/g,"_") : "svg"
    var simg = new Simg(svgElement);
    simg.download(filename);
});

d3.selectAll(".hlinks")
    .on("click",function(){
        let l = d3.select(this).attr("data-url")
        console.log(l)
        window.open(l,"_blank")
    })

closebtn.on("click", function () {
    hidePopups();
    showTooltip()
})
tooltip.on("mouseleave", function () {
    showTooltip()
})
contextmenu.on("mouseleave", function () {
    setContextMenu()
})

function setContextMenu(d) {

    contextmenu
        .style('left', "-4000px")
        .style("opacity", 0)

    if (!d) return

    var dt = d.type.toLowerCase();

    contextmenu.selectAll("li").remove()

    var tts = 0
    var tttx = ""

    context_li[dt].forEach(function (l) {
        tts += d[context_obj[l]] ? 1 : 0
        tttx =  d[context_obj[l]] ? d[context_obj[l]] : tttx
    })

        if(tts >= 2){
            context_li[dt].forEach(function (l) {

                if (d[context_obj[l]]) {
                    contextmenu.append("li")
                        .html(l)
                        .on("click", function () {
                            let t = d[context_obj[l]]
                            var ln = ""

                            if(t.indexOf("https:")>-1){
                                let lx = t.split(",")
                                lx.forEach(function(d){
                                    ln += "<a href='"+d+"' target='_blank'><li class='hlinks' data-url='"+d+"'>"+d+"</li></a>"
                                })
                            }else{
                                ln = t
                            }

                            let tx = "<h6>" + d.name + "</h6>" ;
                            tx += (context_obj[l] == "items") ?  t.replace(/\s*,\s*|\s+,/g, "<br>") :  ln;
                            showTooltip(tx)
                        })
                }

            })
        }else {
            console.log(context_li[dt])
           if(tttx){
               let tx = "<h5>" +d.name + "</h5>" ;
               tx += tttx;
               showTooltip(tx)
           }
        }


    contextmenu
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 40) + 'px')
        .style('display', 'block')
        .transition()
        .duration(500)
        .style("opacity", 1);

    d3.event.preventDefault();
    d3.event.stopPropagation();


}

function hidePopups() {

    popup.style("opacity", 0)
        .style("left", "-4000px")

    setContextMenu()
}

function openURL(u) {
    window.open(u, "_blank")
}

function imageReceived() {

    let pu = d3.select(".popup")
        .style("display", "block")
        .style("left", "10%")
        .transition()
        .style("opacity", 1)

}

function viewImage(imageURL) {

    showTooltip()

    var bb = d3.select(".popup").node().getBoundingClientRect()

    var w = bb.width * .95;
    var h = Math.min(window.innerHeight * .85, w)


    d3.select(".popup-iframe")
        .style("height", function () {
            return h + "px"
        })
        .style("width", function () {
            return w + "px";
        })
        .attr("src", "https://www.figma.com/embed?embed_host=astra&url=" + imageURL)

    d3.select(".popup")
        .style("left", "15%")
        .style("opacity", 0)
        .transition()
        .duration(2000)
        .style("opacity", 1)


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
        let regx = new RegExp(/\r|\n/g)
        let html = d.replace(regx,"<br>")

        tooltip.append("span")
            .classed(".tool-content", true)
            .html(html)

        tooltip.style("top", pos[1] + "px")
            .style("left", pos[0] + 20 + "px")

        tooltip.transition()
            .duration(4)
            .style("opacity", 1)

    } else {
        return null
    }

}

function addTreeView(target, data, subject) {

    const threshold = 80; // max number of nodes to display at opening

    var b = d3.select("body")
    b.selectAll("svg").remove()

    tooltip = d3.select(".tooltip")

    var legend = b.append("svg")
        .classed("legend", true)

    b.selectAll("h4").remove()


    b.append("h4")
        .classed("subtitle", true)
        .html("ENTERPRISE ARCHITECTURE AND GOVERNANCE")


    b.append("h4").classed("vtab", true)
        .style("width", function () {
            return (window.innerHeight * .8) - 80 + "px"
        })
        .html(subject.toUpperCase())

    b.append("span")
        .classed("title", true)

    var icondefs = b.append("svg")
        .classed("iconbox", true)
        .append("defs")


    function setLegend() {

        d3.select(".title")
            .html(function () {
                //return types_array.join(", ")
            })

        types_array.forEach(function (d) {
            icondefs.append('pattern')
                .attr("patternUnits", "userSpaceOnUse")
                .attr('id', function () {
                    let nm = d
                    return 'sass' + nm;
                })
                .attr('height', 40)
                .attr('width', 40)
                .attr('x', -22)
                .attr('y', -22)
                .append('image')
                .attr('xlink:href', function () {
                    let nm = d
                    return "css/icons/" + nm + ".svg";
                })
                .attr('height', 45)
                .attr('width', 45)
                .attr('x', 0)
                .attr('y', 0)

        })
        //setup icons for the legend
        types_array.forEach(function (d) {
            icondefs.append('pattern')
                .attr("patternUnits", "userSpaceOnUse")
                .attr('id', function () {
                    let nm = d
                    return 'legend' + nm;
                })
                .attr('height', 30)
                .attr('width', 30)
                .attr('x', -3)
                .attr('y', -5)
                .append('image')
                .attr('xlink:href', function () {
                    let nm = d
                    return "css/icons/" + nm + ".svg";
                })
                .attr('height', 35)
                .attr('width', 35)
                .attr('x', 0)
                .attr('y', 0)

        })

        var l = legend.append("g")
        //.attr("x",10)


        let y = 0;
        types_array.forEach(function (d, i) {
            y = y + 30;
            l.append("rect")
                //.classed("noderect",true)
                .attr("x", 2)
                .attr("y", y+2)
                .attr("rx", function () {
                    let r = 10
                    return r
                })
                .attr("ry", function () {
                    let r = 10
                    return r
                })
                .attr("width", function () {
                    let w = (d.length * char_width) + 65
                    return w
                })
                .attr("height", function () {
                    let h = 20
                    return h
                })
                .style("fill", function () {
                    let c =  colors[types_array.indexOf(d)]
                    return c;
                })
                .style("stroke-width", "4px")
                .style("stroke", function () {
                    let c =  colors[types_array.indexOf(d)]
                    return c
                })


        })
             y = 0;
        types_array.forEach(function (d, i) {
            y = y + 30;
            l.append("rect")
                //.classed("noderect",true)
                .attr("x", 2)
                .attr("y", y)
                .attr("rx", function () {
                    let r = 12
                    return r
                })
                .attr("ry", function () {
                    let r = 12
                    return r
                })
                .attr("width", function () {
                    let w = 24
                    return w
                })
                .attr("height", function () {
                    let h = 24
                    return h
                })
                .style("fill", function () {
                    let c =  "url(#legend"+d+")"
                    return c;
                })
                .style("stroke", function () {
                    let c = colors[types_array.indexOf(d)]
                    return c
                })



            l.append("text")
                .attr("y", y + 16)
                .attr("x", "30px")
                .text(d)
                .style("font-family","Helvetica")

        })

        y += 30;
        indicator_array.forEach(function (d, i) {
            y = y + 30;
            l.append("rect")
                //.classed("noderect",true)
                .attr("x", 2)
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
                    let w = 24
                    return w
                })
                .attr("height", function () {
                    let h = 24
                    return h
                })
                .style("fill", function () {
                    var f = indicator_colors[indicator_array.indexOf(d)]
                    return f;
                })
                .style("stroke-width", function () {
                    let w = "0px"
                    return w
                })
                .style("stroke", function () {
                    var c  = indicator_colors[indicator_array.indexOf(d)]
                    return c
                })

            l.append("text")
                .attr("y", y + 16)
                .attr("x", "30px")
                .text(d)
                .classed("indicator",true)
                .style("font-family","Helvetica")
        })



    }


    function setTreeHeight() {
        var levelWidth = [1];
        var childCount = function (level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var h = window.innerHeight - target_margin.top - target_margin.bottom;
        var newHeight = Math.max(h, (d3.max(levelWidth) * 26) - 40); // 20 pixels per line

        var node_width = 1 / (levelWidth.length+.5)

        return [node_width, newHeight];

    }

    function unflatten(arr) {
        var root = {
            name: arr[0].name,
            parents: [],
            parent: arr[0].parent,
            type: arr[0].type,
            description: arr[0].description,
            items: arr[0].items,
            links: arr[0].links,
            state: arr[0].state,
            implemented:arr[0].implemented,
            children: []
        };

        // Put a root node into the tree
        var nodes = arr.map((e) => {

            return {
                name: e.name,
                parent: e.parent,
                parents: [],
                children: [],
                type: e.type,
                description: e.description,
                url: e.url,
                items: e.items,
                links: e.links,
                state:e.state,
                implemented: e.implemented
            };
        });
        nodes.push(root);


        // construct a title index
        let nameIndex = {};
        nodes.forEach(n => {
            let nid = n.nid ? n.nid : n.name;
            if (types_array.indexOf(n.type) == -1 && n.type) {
                var tx = n.type;
                types_array.push(tx);
            }
            nameIndex[nid] = n;
        });


        // Each node will have a list of its parents.  Locate each parent with the index.
        nodes.forEach(n => {
           let nindex = n.parent;

            if (n.parent){
                n.parents.push(nameIndex[nindex]);
            }
            // find all instances of parent and add this node as a child
            //var name = n.name
            let pc = nodes.filter((obj) => obj.name == n.parent )
            if(pc.length > 2){
                //n.parents = [];
                //console.log( n.name,n.parent, pc)

                pc.forEach(function(p,i){
                    //console.log(p)
                    //n.depth = p.depth +1
                   //p.children.push(n)

                })
            }
        });

        // Push each node as a child of all its parents.  Delete the parents list to avoid circular JSON.

        nodes.forEach(n => {
            n.parents.forEach(p => {
                p.children.push(n);
                //if(n.name == p.parent){
               //     n.parents.push(n)
                //}

            });

           // delete n.parents;
        });

        //nodes.forEach((p) =>  p.children = [...new Set(p.children)])
        console.log(nodes)

        types_array.sort();

        setTimeout(function(){
            setLegend();
        },200)

        return root;

    }

    var treeData = unflatten(data);


    // ************** Generate the tree diagram	 *****************

    var tile;

    target_margin = {top: 20, right: 20, bottom: 20, left: 250},
        width = window.innerWidth - target_margin.right - target_margin.left,
        height = window.innerHeight - target_margin.top - target_margin.bottom - 60


    var i = 0,
        duration = 100,
        root,
        nodes;

    var tree = d3.layout.tree()
        .size([height - 40, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var s = target.selectAll(".tile")
    var tid = (s) ? s[0].length : 0;
    //var si = s[0].length;


    s.remove()

    tile = target.append("div")
        .classed("tile", true)
        .attr("tid", tid)
        .style("width", width)
        .style("height", height + "px")
        .style("opacity", "1")

    var svg = tile
        .append("svg")
        .attr("id","svgobject")
        .attr("version","1.1")
        .attr("xmlns","http://www.w3.org/2000/svg")
        .attr("xml:space","preserve")
        .attr("width", width + target_margin.right + target_margin.left)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + target_margin.left + "," + target_margin.top + ")");

    root = treeData;
    root.x0 = setTreeHeight() / 3;
    root.y0 = 0;


    d3.select(self.frameElement).style("height", height + "px");

    function update(source) {

        // Compute the new tree layout.
        var node_y = setTreeHeight()[0];
        height = setTreeHeight()[1];

        target.selectAll(".tile")
            .style("height", height + "px")

        target.selectAll(".tile svg")
            .style("height", height + "px")

        tree.size([height - 40, width]);

        root.x0 = height - 40 / 2

        nodes = tree.nodes(root).reverse()
            links = tree.links(nodes);
        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * (width * node_y);

        });
        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function () {
                return "translate(" + (source.y0) + "," + source.x0 + ")";
            })


        nodeEnter.append("rect")
            .classed("noderect", true)
            .attr("x", -15)
            .attr("y", -15)
            .attr("rx", function () {
                let r = 15
                return r
            })
            .attr("ry", function (d) {
                let r = 15
                return r
            })
            .attr("width", function (d) {
                let w = 30
                return w
            })
            .attr("height", function (d) {
                let h = 30
                return h
            })




        nodeEnter.append("rect")
            .classed("nodebg", true)
            .attr("x", -12)
            .attr("y", -12)
            .attr("rx", function (d) {
                var r = 12
                return r
            })
            .attr("ry", function (d) {
                var r = 12
                return r
            })
            .attr("width", function (d) {
                let w = (d.name).length *char_width + 50
                return w
            })
            .attr("height", function (d) {
                let h = 24
                return h
            })
            .style("fill", function (d) {
                let c = colors[types_array.indexOf(d.type)]
                return c
            })
            .style("stroke", function (d) {
                let c =  colors[types_array.indexOf(d.type)]
                return c
            })

        nodeEnter.append("rect")
            .classed("noderect", true)
            .attr("x", -15)
            .attr("y", -15)
            .attr("rx", function (d) {
                var r = 15
                return r
            })
            .attr("ry", function (d) {
                var r = 15
                return r
            })
            .attr("width", function (d) {
                let w = 30
                return w
            })
            .attr("height", function (d) {
                let h = 30
                return h
            })
            .style("fill",function(d){
                var c = colors[types_array.indexOf(d.type)]
                if(d.implemented-0 > 0) {
                    c = indicator_colors[3];
                }
                else  {
                    c = indicator_colors[d.state-0];
                }
                return c
            })


        var tfg = nodeEnter
            .append("rect")

        tfg.on("mouseenter", function (d) {
            //showTooltip(d)
        })

        tfg.on("mouseleave", function () {
            //showTooltip()
        })

        tfg.classed("noderect", true)
            .attr("x", -15)
            .attr("y", -15)
            .attr("rx", function (d) {
                var r = 15
                return r
            })
            .attr("ry", function (d) {
                var r = 15
                return r
            })
            .attr("width", function (d) {
                let w = 30
                return w
            })
            .attr("height", function (d) {
                let h = 30
                return h
            })
            .style("fill", function (d) {
                let t = d.parent ? d.type : "domain"
                return 'url(#sass' + t + ')';
            })
            .style("stroke-width", function (d) {
                let w = (d.children) ? "3px" : null;
                return w
            })
            .style("stroke", function (d) {
                let c = (d.children) ? colors[types_array.indexOf(d.type)] : "transparent";
                return c
            })
            .on("click", click)

        tfg.on('contextmenu', function (d) {
            d3.event.preventDefault();
            setContextMenu(d)
        })


        var t = nodeEnter.append("text")

        t.attr("x", function (d) {
            return d.children || d._children ? 20 : 20;
        })
            .attr("dy", ".3em")

            .text(function (d) {
                return d.name;
            })
            .style("font-family","Helvetica")
            .attr("text-anchor", function (d) {
                return "start" //d.children || d._children ? "end" : "end";
            })
            //.style("fill-opacity", 6)
            .style("text-decoration", function (d) {
                let td = d.url && d.url != "" ? "underline" : null;
                return td
            })
       /* t.on("click", function (d) {
            d3.event.preventDefault();
            if (d.url && d.url != "") {
                viewImage(d.url)
            }
        })*/

        t.on('contextmenu', function (d) {
            d3.event.preventDefault();
            setContextMenu(d)
        })


        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("stroke-width", function (d) {
                return d._children ? 8 : 2;
            })
            .style("fill", function (d) {
                return d._children ? "rgb(55,55,55)" : "rgb(55,55,55)";
            });
        nodeUpdate.select("text")
            .style("fill-opacity", 1);
        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);
        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("fill","none")
            .attr("stroke","rgb(150, 150, 150)")
            .attr("stroke-width","2px")
            .attr("d", function (d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });
        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);
        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();
        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

// Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    update(root);


    setTimeout(function () {
        loaded();
    }, 30);

    function loaded() {
        nodes.forEach(function (d) {
            if (d.depth === 1 && threshold < nodes.length) {
                d._children = d.children;
                d.children = null;
                update(d);
            }
        });
    }

    target.style("opacity", 0)

    target.transition()
        .duration(1000)
        .style("opacity", 1);

    var scrollheight = target.property("scrollHeight") * .3;
//var sth = (scroll_y)? scroll_y :scrollheight;

  /*  target.transition()
        .delay(1500)
        .duration(1000)
        .tween("uniquetweenname", scrollTopTween(scrollheight))

    function scrollTopTween(scrollTop) {
        return function () {
            //console.log(this.scrollTop-target_margin)
            var i = d3.interpolateNumber(this.scrollTop, scrollTop);
            return function (t) {
                this.scrollTop = i(t);
            };
        };

    }*/

}
