var width = window.innerWidth,
    height = window.innerHeight - 50,
    root;

var linkDistance = height * .30;
var chargeDefault = -3500;
var gravityDefault = .01;
var frictionDefault = .95;

var radius = masterRadius = 50;
var centerRadius = radius + 40;
//    var reset=true;
var centered;
var active = d3.select(null);
var showLabels = true;

var textBoxVisible = false;

var scaleMaster = null;
var scaleMasterBase = 1.4;


var skipCount = 0;
var skipAmount = 0;

// Rescale the diagram to shrink it if the window
// is not wide enough or tall enough
scaleRatio = 1;


var wCenterX = height / 2;
var wCenterY = width / 2;

var svgContainer = d3.select(".svgContainer");

var svg, force, g, link, node, nodeCircle, gcontainer, focusNode, dim_array, legend


function unflatten(arr) {
    dim_array = [];
    var root = {
        name: arr[0].name,
        parents: [],
        parent: arr[0].parent,
        description: arr[0].description,
        dim: arr[0].dim_val,
        dim_str: arr[0].dim_str,
        implemented: arr[0].implemented,
        children: []
    };

    // Put a root node into the tree
    var nodes = arr.map((e) => {

        return {
            name: e.name,
            parent: e.parent,
            parents: [],
            children: [],
            description: e.description,
            dim: e.dim_val,
            dim_str:e.dim_str,
            implemented: e.implemented
        };
    });
    nodes.push(root);


    // construct a title index
    let nameIndex = {};
    nodes.forEach(n => {
        if (dim_array.indexOf(n.dim_str) == -1 && n.dim_str) {
            var tx = n.dim_str;
            dim_array[n.dim] = tx;
        }
        let nid = n.nid ? n.nid : n.name;
        nameIndex[nid] = n;
    });


    // Each node will have a list of its parents.  Locate each parent with the index.
    nodes.forEach(n => {
        let nindex = n.parent;

        if (n.parent) {
            n.parents.push(nameIndex[nindex]);
        }
        // find all instances of parent and add this node as a child
        var name = n.name
        let pc = nodes.filter((obj) => obj.name == n.parent)
        if (pc.length > 2) {
            //n.parents = [];
            //console.log( n.name,n.parent, pc)

            pc.forEach(function (p, i) {
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

    setLegend();
    return root;

}

function setLegend() {


    var l = legend.append("g")
    //.attr("x",10)


    var y = 0;

    dim_array.forEach(function (d, i) {
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
                var f = indicator_colors[dim_array.indexOf(d)]
                return f;
            })
            .style("stroke-width", function () {
                let w = "0px"
                return w
            })
            .style("stroke", function () {
                var c = indicator_colors[dim_array.indexOf(d)]
                return c
            })

        l.append("text")
            .attr("y", y + 16)
            .attr("x", "30px")
            .text(d)
            .classed("indicator", true)
            .style("font-family", "Helvetica")
    })

}


function addForceView(target, jsonData, subject) {

    var b = d3.select("body")

    b.selectAll("h4").remove()
    b.selectAll("svg").remove()

    legend = b.append("svg")
        .classed("legend", true)

    // Append the SVG
    svg = svgContainer.append("svg")
        .attr("class", "svgclass")
        .attr("width", width)
        .attr("height", height);


    g = svg.append("g")
        .attr("class", "container");

    link = g.selectAll(".link"),
        node = g.selectAll(".node");

    nodeCircle = g.selectAll(".nodeCircle");

    gcontainer = g.selectAll("g");

    focusNode = null;

    force = d3.layout.force()
        .size([width, height])
        .linkDistance([linkDistance])
        .charge([chargeDefault])
        .gravity(gravityDefault)
        .friction(frictionDefault)
        .on("tick", function (e) {
            tick(e);
        });

    b.append("h4")
        .classed("subtitle", true)
        .style("position","absolute")
        .style("bottom","5px")
        .html(page_title)


    b.append("h4").classed("vtab", true)
        .style("width", function () {
            return (window.innerHeight * .8) - 80 + "px"
        })
        .html(subject.toUpperCase())



    root = unflatten(jsonData);
    root.x0 = 0;
    root.y0 = 0;


// Start off Collapsed
    flatten(root);
    root.children.forEach(collapse);

    update2();
    zoomInitial(root);

}


function update2() {

//        clearNodes();
    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);

    var tree1 = d3.layout.tree();
    var links = tree1.links(nodes);

    circlePoints(nodes);

    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    // Update the links…
    link = link.data(links, function (d) {
        return d.target.id;
    });

    // Exit any old links.
    link.exit().remove();

    // Enter any new links.
    link.enter().insert("line", ".node")
        .attr("class", "link")
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    // Update the nodes…
    node = node.data(nodes, function (d) {
        1 == 1;
        return d.id;
    })
    //.style("fill", function(d){});

    // Exit any old nodes.
    node.exit().remove();

    var g1 = node.enter().append("g")
        .attr("class", "node");


    g1.attr("transform", function (d) {

        var x = d.x;
        var y = d.y;

        text = "translate (" + x + "," + y + ")";

        return text;

    })
        .on('mouseover', function (d) {
            var circle = d3.select(this).select(".nodeCircle");
//                        circle.style("stroke-width", "2px");
            circle.style("stroke-width", "2px");
            circle.style("stroke", "black");

        })
        .on('mouseout', function (d) {
            var circle = d3.select(this).select(".nodeCircle");
            if (hasChildren(d)) {
                circle.style("stroke-width", "5px");
            } else {
                circle.style("stroke-width", "2px");
            }
            circle.style("stroke", "#cccccc");
        });


    // Enter any new nodes.
    g1.append("circle")
        .attr("class", "nodeCircle")
        .attr("cx", function (d) {
            return 0
        })
        .attr("cy", function (d) {

                return 0;
            }
        )
        //                .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
        //                .attr("r",r)
        .attr("r", function (d) {

            let c = d._children ? d._children.length * 8 : 0
            var rad = (radius + c);
//                    if (d.depth==1){
            if (d.selected) {
                rad = centerRadius;
            }
            return rad;
        })
        .style("stroke", function (d) {
            if (hasChildren(d)) {
                return "#cccccc";
            } else {
                return "#636363";
            }

        })
        .style("stroke-width", function (d) {
            if (hasChildren(d)) {
                return "5px";
            } else {
                return "1.5px";
            }

        })
        .style("fill", function (d, i) {
            console.log(d)
           let c = indicator_colors[dim_array.indexOf(d.dim_str)]
            return c;
        })
        .on("click", click2)

        .call(force.drag);

    addNames();

    svg.selectAll(".nodeCircle")
        .attr("r", function (d) {
            if (d.selected == true) {
                return centerRadius;
            }
            if (d.depth == 1) {
                return centerRadius;
            }
            let r =  d._children ?  (d._children.length * 8) : 0
            return (r + radius)
        });


    var nodeList = svg.selectAll(".node");

    nodeList.style("opacity", function (d) {
            var opacity = d.opacity;
            if (opacity) {
                return opacity;
            } else {
                return 1;
            }
        }
    );

    link.style("opacity", function (d) {
        var opacity = d.target.opacity;
        if (opacity) {
            return opacity;
        } else {
            return .6;
        }
    });


}

function addNames() {

    var g2;
    var labelshift = showLabels ? 15 : 0;
    var nameArray = [];
    var maxLength = 15;

    // Select all visible circles
    g2 = svg.selectAll(".node");

    // Remove the old circle text
    d3.selectAll(".label").remove();

    // Remove all of the earlier Circle Names
    d3.selectAll(".nameText").remove();


    g2.append("g")
        .each(function (d) {

                var displayText = "";

                if (d.name) {
                    displayText = (d.name);

                }

                if (hasChildren(d)) {

                } else {
                    if (d.content) {
                        //  displayText = d.content[0];
                        displayText = "";
                    }
                }

//                        var displayText = toProperCase(d.name);

                var n = chopText(displayText, maxLength);

                var text1 = d3.select(this)
                    .on("click", click2)
                    .call(force.drag);

                var maxRow = 3;
                for (var i = 0; i < n.length; i++) {
                    if (i <= maxRow) {

                        var display = n[i];
                        if (i == maxRow) {
                            if ((n.length - 1) > maxRow) {
                                display = display + "...";
                            }
                        }

                        text1.append("text")
                            .attr('x', 0)
                            .attr("y", function (d) {
                                let y = (n.length == 1) ? labelshift*.5 : (i * 15)
                                return y
                            })
                            .style("text-shadow", function(d){
                                let ts = d.depth != 1 ? "2px 2px 0px black" :"none"
                                return ts
                            })

                            .attr("class", "nameText")
                            .classed("large", function (d) {
                                if (d.depth == 1) {
                                    return true;
                                } else {
                                    return false
                                }
                            })
                            .text(display)
                    }
                }

            }
        );


}

function hasChildren(d) {
    if (d.children) {
        if (d.children.length > 0) {
            return true;
        }
    }

    if (d._children) {
        if (d._children.length > 0) {
            return true;
        }
    }
    return false;
}

function getChildren(d) {
    var children = null;

    if (hasChildren(d)) {

        if (d.children) {
            if (d.children.length > 0) {
                children = d.children;
            }
        }

        if (d._children) {
            if (d._children.length > 0) {
                children = d._children;
            }
        }
    }

    return children;

}

function resetAll() {

    reset();
    update2();
}

function hasGrandChildren(d) {
    var hasGC = false;

    if (hasChildren(d)) {
        var children = getChildren(d);

        children.forEach(function (d1) {
                if (hasChildren(d1)) {
                    hasGC = true;
                }
            }
        );
    }

    return hasGC;
}

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
        d._children.forEach(collapse);

    }
}

function collapseAllChildren(d) {
    if (d.children) {
        d.children.forEach(collapse);
    }
}


function resetSelected(d) {
    var children;
    if (d.children) {
        children = d.children
    }
    ;
    if (d._children) {
        children = d._children
    }
    ;

    d.selected = false;
    if (children) {
        children.forEach(resetSelected);
    }
    return
}


// Color leaf nodes orange, and packages white or blue.
function color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

// Returns a list of all nodes under the root.
function flatten(root) {
    var nodes = [], i = 0;
    var depth = 0;
    var parent = null;

    function recurse(node, parent) {
        depth = depth + 1;

        if (node.children) node.children.forEach(function (d) {
            var parent1 = node;

            recurse(d, parent1);
        });

        if (!node.id) node.id = ++i;
        node.depth = depth;
        node.parent = parent;
        nodes.push(node);
        depth = depth - 1;
    }

    recurse(root, parent);
    return nodes;
}

function click2(d) {
    //if (!textBoxVisible) {

    if (d.depth > 2) {
        return;
    }

    //toggleTextBox();
    //}

    if (d == root) {
        resetAll();
        return;
    }

    if (d.focus) {

        expandCircle(d.parent);

    } else
        // If we're selecting the node to open it
    {
        expandCircle(d);
    }
}


function expandCircle(d) {

    if (focusNode) {
        if (focusNode != d) {
            focusNode.selected = false;
            focusNode.focus = false;
//                if (focusNode.children){
//                    focusNode._children =focusNode.children;
//                    focusNode.children=null;
//                }
        }
    }

    focusNode = d;

    d.selected = true;
    d.focus = true;


    d.children = getChildren(d)
    d._children = null;

    collapseAllChildren(d);

    d.fixed = true;


    fadeOthers(root, 0.1);
    fadeOthers(d, 1);
    if (d.parent) {
        d.parent.opacity = 1;
        d.parent.fixed = true;
        d.parent.focus = false;


        fixChildren(d.parent, true);
    }

    // Rescale the graph if there are lots
    // of children
    var childLength = 0;

    if (hasChildren(d)) {

        childLength = d.children.length;
    }
//        var shrink = Math.floor(childLength/4);

//            var scale = (1.1- (shrink) *.04);

    var scale = computeScale(scaleMasterBase, childLength, 5, .11);

    // Center the new graph
    centerIt2(d, scale);

    // Set the force of the non selected
    // Nodes to zero so the circles
    //spread around the center node
//
    force.charge(function (d1, i) {
            if (d1.parent == d) {
                d1.charge = -4500;

            } else {
                d1.charge = 0;
            }
            return d1.charge;
        }
    );

    force.start();
    updateTextBox(d);
    fixChildren(d, false);

    update2();
//        fixChildren(d.parent, false);

    ;
}


function fadeOthers(d, opacity) {

    var children = getChildren(d);
    d.opacity = opacity;


    if (children) {
        children.forEach(function (d) {
            var child = d;
            fadeOthers(child, opacity)

//                    fadeOthers(d,opacity))
        })
    }
    return;
}


function resetFixed(d) {

    var children;
    if (d.children) {
        children = d.children
    } else {
        children = d._children;
    }
    d.fixed = false;


    if (children) {
        children.forEach(function (d) {
            var child = d;
            resetFixed(child)

//                    fadeOthers(d,opacity))
        })
    }
    return;
}


function centerIt2(d, scale1) {

    var oldX = d.px;
    var oldY = d.py;


    var x1 = d.x;
    var y1 = d.y;


    if (scale1) {
        scale = scale1;
    } else {
        scale = 1;
    }

    var centerX2 = (width / 2) - scale * (oldX);
    var centerY2 = (height / 2) - scale * (oldY);

//        var centerX2 = (width/2);
//        var centerY2 = (height/2);

    var newX1 = centerX2 / scale;
    var newY1 = centerY2 / scale;

    wCenterX = newX1;
    wCenterY = newY1;
//        scale = scale * Math.max(d.x/width, d.y/height);

    var transString = "scale(" + scale + ") "
        + "translate(" + newX1 + "," + newY1 + ")"
        + " translate(0,0)"
    ;


    g.transition()
        .duration(750)
        .attr("transform", transString);
//        rescale(1, centerX2, centerY2);
}

function centerIt(d) {
    return
    var oldX = d.px;
    var oldY = d.py;


    var x1 = d.x;
    var y1 = d.y;

//        scale = .7 / Math.max(d.x / width, d.y / height);
    scale = 1 * Math.max(d.x / width, d.y / height)
//        var translate = [width / 2 - scale * oldX, height / 2 - scale * oldY];

    var translate = [width / 2 - oldX, height / 2 - oldY]
    svg.transition().duration(750)
        .call(zoom.translate(translate).event);

}

// This is an initial animation to zoom into the circle
function zoomInitial(d) {

    //rescale(.25);
//        centerIt2(d,.15);

    var container = d3.select(".container");

    var children = getChildren(d);
    var numChildren = children.length;

    scaleMaster = computeScale(scaleMasterBase, numChildren, 4, .07);

//        centerIt2(d,1.4);
    rescale(scaleMaster, true);

    return;

}


var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 1])
    .on("zoom", zoomed);

function zoomed() {
//        g.style("stroke-width", 1.5 / d3.event.scale + "px");
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    force.charge(chargeDefault);


    rescale(scaleMaster, true);
    fadeOthers(root, 1);
    resetFixed(root);
    root.children.forEach(collapse);
    resetSelected(root);
    resetCircleSet(root);
    if (focusNode) {
        if (focusNode != root) {
            focusNode.selected = false;
            focusNode.focus = false;
            focusNode = root;
        }
    }
    root.selected = true;
}


function clearNodes() {
    nodes = {};
    links = [];
//        force.start();
//        d3.timer(force.resume);
}


function tick(e) {

    skipCount++;
    if (skipCount % skipAmount == 0) {
        return;
    }
    var a = e;
    1 == 1;
    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node
        .attr("transform", function (d) {


            var x = d.x;

            var y = d.y;

            if (d.depth == 1) {
                var damper = .8;
                d.x = d.x + ((width / 2) - d.x) * (damper + .02) * e.alpha;
                d.y = d.y + ((height / 2) - d.y) * (damper + .02) * e.alpha;
            }

            text = "translate (" + x + "," + y + ")";

            return text

        });

}


function toProperCase(text) {
    return text.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
}


function toggleTextBox() {

    var box = d3.select("#textBox");

    var xpos = box.style("right");

    if (xpos == "-380px") {
        box
            .transition()
            .duration(500)
            .style("right", "20px");

        textBoxVisible = true;
    } else {
        box
            .transition()
            .duration(500)
            .style("right", "-380px");
        textBoxVisible = false;
    }
}

function updateTextBox(d) {
    // Update the Header of the Text
    fillHeaderName(d);

    var a = d3.selectAll(".separator")
        .style("background",
            "lightgrey");

    fillContent(d);

    // Make content text slowly fade in
    var content = d3.selectAll(".content");
    content.style("opacity", .1);
    content.transition()
        .duration(200)
        .style("opacity", 1);

}

function fillHeaderName(d) {
    var parentName = "";
    var name = "";
    var num = "";
    var parentNums;
    var spacer = "";
    var nameLower = "";


    parentNums = getParentNum2(d);

    if (d.num) {
        num = d.num;
        spacer = " - ";
    }

    if (d.name) {
        name = d.name;
        //name= toProperCase(name);
    }

    if (name.length <= 2) {
        parentName = getParentName(d);
        //parentName = toProperCase(parentName);
        name = parentName + spacer + num.toLowerCase();
    }


    var headerBar = d3.select("body").select("#heading1");
//        var parentNumsLower= toProperCase(parentNums);
    headerBar.text(parentNums);

    var headerBar2 = d3.select("body").select("#heading2");

    headerBar2.text(name);
    headerBar.style("opacity", .4);
    headerBar.transition()
        .duration(800)
        .style("opacity", 1);

    headerBar2.style("opacity", .4);
    headerBar2.transition()
        .duration(800)
        .style("opacity", 1);

}

function fillContent(d) {
    var num, spacer = "", div2;
    var children = null;

    if (hasChildren(d)) {
        children = getChildren(d);
    }

    var contentBox =
        d3.select("#content");

    // Remove old content.
    // if any is there
    var content = d3.selectAll(".content");
    content.remove();

    var contentDiv = d3.selectAll(".contentDiv");
    contentDiv.remove();

    if (!children) {
        if (d.content) {

            var div2 = getContentDiv(d);

            if (div2) {
                contentBox
                    .append(function (d) {
                        return div2.node();
                    });
            }
        }
    } else {
        var hasGC = hasGrandChildren(d);
        if (!hasGC) {
            children.forEach(function (d) {
                var div2 = getContentDiv(d);

                if (div2) {

                    contentBox
                        .append(function (d) {
                            return div2.node();
                        });
                    d3.selectAll(".contentDiv")
                        .classed("border1", true);

                }
            });
        }
    }


}

// Fills a div with the content
// and returns the div
function getContentDiv(d) {
    var num, spacer = "", div1;

    if (d.num) {
        num = d.num;
        spacer = " - ";
    }


    if (d.content) {
        div1 =
            d3.select("body")
                .append("div")
                .attr("class", "contentDiv");
        var content = d.content;

        for (var i = 0; i < content.length; i++) {
            var text = "";
            text = content[i];

            var div2 = div1
                .append("div")
                .classed("content", true);

            if (i == 0) {

                div2.append("span")
                    .classed("contentSpan", true)
                    .classed("headerBold", true)
                    .text(num + " ");
            } else {
                text = content[i];
            }

            div2
                .append("span")
                .classed("contentSpan", true)
                .text(text);
        }
        return div1;
    }

}

function getParentName(d) {
    if (a = d.parent) {
        if (a.name) {
            return a.name;
        }
    } else {
        return "";
    }
}

function getParentNum2(d) {
    var node1 = d;
    var numArray = []
    numString = ""

    while (node1.parent) {

        text2 = node1.num;
        if (text2) {
            numArray.push(text2);
        }
        node1 = node1.parent;
    }
    for (var i = numArray.length - 1; i >= 0; i--) {
        numString = numString + numArray[i]
    }
    return numString
}


function toProperCase(text) {

    if (text) {
        return text.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
    } else {
        return "";
    }
}


function rescale(scale, animate, centerX, centerY) {
    var halfw = width / 2;
    var halfh = height / 2;

    var newX, newY;

    if (centerX) {
        newX = centerX;
    } else {
        newX = halfw / scale;
    }

    if (centerY) {
        newY = centerY;
    } else {
        newY = halfh / scale;
    }


    var newX1 = -newX * (scale - 1);
    var newY1 = -newY * (scale - 1);

    var container = d3.select(".container");

    var transString = "scale(" + scale + ") " + "translate(" + newX1 + "," + newY1 + ")";

    if (animate) {
        container.transition()
            .duration(750)
            .attr("transform", transString);
    } else {
        container
            .attr("transform", transString);
    }
}


function circlePoints(nodes) {

    var pi = Math.PI;

    var points = 0;
    var centerX = width / 2, centerY = height / 2;
    var radius1 = linkDistance;

    var angle;

//        console.log("section" +String(section));

    for (a = 0; a < nodes.length; a++) {
        var node = nodes[a];

        if (node.circleSet) {

        } else {
            points = points + 1;
        }
    }

    var section = pi / points;

    for (i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.circleSet) {
        } else {
//            console.log(section*(i+1));
            angle = section * (i + 1);
            var newX = centerX + radius1 * Math.cos(angle);
            var newY = centerY + radius1 * Math.sin(angle);

            node.x = newX;
            node.y = newY;
            node.px = newX;
            node.py = newY;
            node.circleSet = true;
        }
//            console.log ("X: " + String(newX) + " Y: " + String(newY));

    }


}

function resetCircleSet(node1) {
    node1.children.forEach(function (d) {
            d.circleSet = false;
        }
    )
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function fixChildren(d, fix) {


    if (hasChildren(d)) {
        var children = getChildren(d);

        children.forEach(function (d1) {
            d1.fixed = fix;
        });
    }
}

function fadedChildren(d, opacity) {
    d.opacity = opacity;

    if (hasChildren(d)) {
        var children = getChildren(d);

        children.forEach(function (d1) {
            d1.opacity = opacity;
        });
    }
}

// Will shrink or enlare the scale based upon
// Number of childrenshowing

function computeScale(initialScale, numChildren, childrenMax, scaleStep) {
    var scale1 = 1;

    var shrink = Math.floor(numChildren / childrenMax);

    var scale = (initialScale - (shrink) * scaleStep);

    return scale;
}

// Takes a long sentences and chops it up
// into arrays of smaller chunks no longer than Maxlen
// This is for the circle display in which we have to show
// the text on multiple chopped up lines
function chopText(text, maxLen) {

    var str = [];
    var res = text.split(" ");
    var text2 = "";
    var text3 = "";
    var len;
    var text = "";

    for (var i = 0; i < res.length - 1; i++) {

        text = text + " " + res[i];

        text3 = text + " " + res[i + 1];

//            text2 = text + " " + res[i+1]
        if (text3.length > maxLen) {
            str.push(text);
            text = "";
        } else {
        }

    }
    if (text.length > 0) {
        str.push(text + " " + res[res.length - 1]);
    } else {
        str.push(res[res.length - 1]);
    }

    return str;

}

function loadTitle() {
    var url = window.location.href;
    var quest = url.indexOf('?');
    if (quest > -1) {
        url = url.substr(0, quest);
        url = url + '?title=' + otherTitle;
    } else {
        url = url + '?title=' + otherTitle;
    }

    window.location.href = url;


}

function clickHome() {
    resetAll();
}

function clickUp() {
    if (focusNode) {
        click2(focusNode.parent);
    }
}

function newRequirement() {
    alert("Open Sharepoint");

}

