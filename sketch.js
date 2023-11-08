//data
const nodes = [
    //0
    {
        id: "Jaguar",
        type: "Fauna",
        category: "Apex Predator",
        group: 1,
        relation:"Jaguar >",
        description: "The [[JAGUAR]] is a large cat species and the only living member of the genus Panthera native to the Americas. With a body length of up to 1.85 m and a weight of up to 158 kg, it is the biggest cat species in the Americas and the third largest in the world."
    }, 
    //1
    {
        id: "Ocelot",
        type: "Fauna",
        category: "Meso Predator",
        group: 2,
        relation:"> Ocelot >",
        description: "[[OCELOTS]] are the second largest, spotted cat in South America, second only to the jaguar. Their grayish to cinnamon coats are marked with numerous dark spots and bars. Spots are open, the center of each revealing the lighter background color."
    },
    //2
    {
        id: "Opossum",
        type: "Fauna",
        category: "Meso Predator",
        group: 2,
        relation:"> Opossum >",
        description: "[[OPOSSUMS]] are members of the marsupial order Didelphimorphia endemic to the Americas. The largest order of marsupials in the Western Hemisphere, it comprises 93 species in 18 genera. Opossums originated in South America and entered North America in the Great American Interchange following the connection of North and South America."
    },
    //3
    {
        id: "Iguana",
        type: "Fauna",
        category: "Prey",
        group: 3,
        relation:"> Iguana >",
        description: "[[IGUANA]] is a genus of herbivorous lizards that are native to tropical areas of Mexico, Central America, South America, and the Caribbean. The genus was first described in 1768 by Austrian naturalist Josephus Nicolaus Laurenti in his book Specimen Medicum, Exhibens Synopsin Reptilium Emendatam cum Experimentis circa Venena. Two species are placed in the genus, the green iguana, which is widespread throughout its range and a popular pet, and the Lesser Antillean iguana, which is native to the Lesser Antilles. Genetic analysis indicates that the green iguana may comprise a complex of multiple species, some of which have been recently described, but the Reptile Database considers all of these as subspecies of the green iguana."
    }, 
    //4
    {
        id: "Iguana",
        type: "Fauna",
        category: "Prey",
        group: 3,
        relation:"> Iguana >",
        description: "[[INSECTS]] are pancrustacean hexapod invertebrates of the class Insecta. They are the largest group within the arthropod phylum. Insects have a chitinous exoskeleton, a three-part body, three pairs of jointed legs, compound eyes and one pair of antennae."
    }, 
    //5
    {
        id: "Plant",
        type: "Flora",
        category: "Prey",
        group: 4,
        relation:"> Plant",
        description: "South America possesses a distinctive [[PLANT LIFE]]. The biotic region is called the Neotropics, and its faunal realm the Neogaean. The region extends southward from the Tropic of Cancer and includes Central and South America—even the temperate southern portion. There are some similarities between South America’s vegetation and that of other continents, as a result of past geologic developments. The pattern of distribution within the continent is complex because of the variety of climatic and ecological zones. The northern tropical regions are the richest in diversity, while the southern regions and the western Andean highlands are much impoverished, despite some differentiation."
    }
];

const links = [
    { source: 0, target: 1, distance: 1 }, //Jaguar > Ocelot
    { source: 0, target: 2, distance: 1 }, //Jaguar > Opossum
    { source: 0, target: 3, distance: 2 }, //Jaguar > Iguana
    { source: 1, target: 3, distance: 1 },  //Ocelet > Iguana
    { source: 2, target: 3, distance: 1 },  //Opossum > Iguana
    { source: 2, target: 4, distance: 1 },  //Opossum > Insect
    { source: 2, target: 5, distance: 2 },  //Opossum > Plant Life
    { source: 3, target: 5, distance: 1 },  //Iguana > Plant Life
    { source: 4, target: 5, distance: 1 }  //Insect > Plant Life
];

let size = { 
    width: window.innerWidth, 
    height: window.innerHeight 
};

let svg = d3.select("#graph")
    .attr("width", size.width)
    .attr("height", size.height);
svg.append("text")
    .attr("id", "titleText")
    .attr("fill", "#7F7F7F")
    .attr("font-size", "7vw")
    .attr("font-weight", 400)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("opacity", 1);
d3.select("#titleText")
    .append("tspan")
    .text("South America")
    .attr("x", size.width / 2)
    .attr("y", size.height / 2)
    .attr("dy", 0);
d3.select("#titleText")
    .append("tspan")
    .text("Predator-Prey Relation")
    .attr("x", size.width / 2)
    .attr("y", size.height / 2)
    .attr("dy", 1.2 + "em");

const color = ["#0B0909","#44444C", "#8C8C8C", "#DBDBDB", "#F7BE02", "#FA2A05"];

//d3 force simulation
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(l => l.distance * 150))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(size.width / 2, size.height / 2));

//lines
const lines = svg.append("g")
    .attr("id", "lines")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("stroke", "grey")
    .attr("fill", "none")
    .attr("opacity", 0.9);

//circles
let clicked = false;
let zoomedIndex, zoomedId;
const circles = svg.append("g")
    .attr("id", "circles")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "circle")
    .append("circle")
    .attr("r", d => (6 / d.group) + "rem")
    .attr("fill", d => color[d.group-1])
    .attr("style", "cursor: pointer;")
    .on("mouseover", function (event, d) {
        d3.select(this)
            .transition()
            .delay("10")
            .duration("75")
            .attr("r", d => (6 / d.group) + 2 + "rem");
    })
    .on("mouseout", function (event, d) {
        d3.select(this)
            .transition()
            .delay("10")
            .duration("75")
            .attr("r", d => (6 / d.group) + "rem");
    })
    .on("click", function (event, d) {
        event.stopPropagation();

        d3.select("#titleText").selectAll("tspan").remove();

        clicked = !clicked;

        const T = d3.selectAll(".text").select(function (k, j) {
            if (k.index == d.index) {
                return this;
            }
        });

        if (clicked) {
            zoomIn(d);
        } else {
            zoomBack(d);
        }

        function zoomIn() {
            circles.attr("fill-opacity", 0.2);
            texts.attr("fill-opacity", 0.75).attr("fill", "#F0F0F0");
            lines.attr("opacity", 0.2);

            let t = 3.5;
            let diffX = size.width / 2 - d.x;
            let diffY = size.height / 2 - d.y;
            svg.transition()
                .delay("15")
                .duration("120")
                .attr("transform", `translate(${diffX * t}, ${diffY * t}) scale(${t})`);

            T.selectChild()
                .attr("dy", 0)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .text(d.description)
                .call(wrap, size.width / 5, d.id + " :: " + d.type + " :: " + d.category);

            zoomedIndex = d.index;
            zoomedId = d.relation;
        }
        function zoomBack() {
            circles.attr("fill-opacity", 1);
            texts.attr("fill-opacity", 1).attr("fill", "#FA2A05");
            lines.attr("opacity", 0.8);

            svg.transition()
                .delay("15")
                .duration("120")
                .attr("transform", `scale(${1})`);

            T.selectChild()
                .attr("font-size", "0.85rem")
                .attr("font-weight", 600)
                .attr("fill", "#E82705")
                .text(d.id);

            const prevT = d3.selectAll(".text").select(function (k, j) {
                if (k.index == zoomedIndex) {
                    return this;
                }
            });
            prevT.selectChild()
                .attr("font-size", "0.85rem")
                .attr("font-weight", 600)
                .attr("fill", "#E82705")
                .text(zoomedId);
        }
    });;

function wrap(text, width, title) {
    text.each(function () {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.35, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(title)
                .attr("fill", "#636363")
                .append("tspan")
                .attr("font-size", "0.35rem")
                .attr("font-weight", 500)
                .attr("fill", "#FA2A05")
                .attr("fill-opacity", 1)
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                lineNumber++;
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("fill", "#FA2A05")
                    .attr("font-size", "0.35rem")
                    .attr("font-weight", 500)
                    .attr("fill-opacity", 1)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", lineHeight * lineNumber + "em")
                    .text(word);
            }
        }
    });
}
circles.append("title")
    .text(d => d.id);

//texts
const texts = svg.append("g")
    .attr("id", "texts")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "text")
    .append("text")
    .attr("fill", "#FA2A05")
    .attr("font-size", "0.85rem")
    .attr("font-weight", 600)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text(d => d.relation);

//drag
circles.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))




simulation.on("tick", () => {
    circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    texts
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    lines
        .attr("d", linkArc)
        .attr("x1", l => l.source.x)
        .attr("y1", l => l.source.y)
        .attr("x2", l => l.target.x)
        .attr("y2", l => l.target.y);
});

function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
          M${d.source.x},${d.source.y}
          A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `;
}


//drag function
function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.1).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}


function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}


function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}
