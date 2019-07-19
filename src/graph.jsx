import React, { Component } from "react"
import * as d3 from "d3"
import "../node_modules/antd/dist/antd.css"

class Graph extends Component {
    componentWillReceiveProps(props) {
        d3.select("#graph").selectAll("*").remove()//clearing svg
        const graph = props.graph
        const classinfo = props.classinfo//classinfo
        const graphSVG = d3.select("#graph")
        const padding = 100
        const width = graphSVG.node().parentNode.clientWidth
        const height = graphSVG.node().parentNode.clientHeight
        graphSVG.attr("width", width).attr("height", height)

        //windowscale
        const w = d3
            .scaleLinear()
            .domain([0, 485])
            .range([0, width])

        //zoom
        graphSVG.call(d3.zoom()
            .scaleExtent([1 / 2, 8])
            .on("zoom", zoomed))
        function zoomed() {
            g.attr("transform", d3.event.transform)
        }

        // create a tooltip
        const tooltip = d3.select("#tooltips")
            .style("opacity", "0")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", w(1.5) + "px")
            .style("border-radius", w(5) + "px")
            .style("padding", w(5) + "px")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("width", w(70) + "px")
            .style("font-size", w(10) + "px")

        //forcesimulation
        const simulation = d3
            .forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id
            })
            )
            .force("charge", d3.forceManyBody().strength(-1))
            .force("center", d3.forceCenter(width / 2, height / 2))
        simulation.nodes(graph.nodes).on("tick", ticked)
        simulation.force("link").links(graph.links).distance(w(120))

        //setting scale of stroke-width
        let maxElement = {}
        let minElement = {}
        maxElement.weight = d3.max(graph.links, n => n.weight)
        minElement.weight = d3.min(graph.links, n => n.weight)
        maxElement.node = d3.max(graph.nodes, n => n.degree)
        minElement.node = d3.min(graph.nodes, n => n.degree)
        const linkScale = d3
            .scaleLinear()
            .domain([minElement.weight, maxElement.weight])
            .range([w(1), w(7)])
        const nodeScale = d3
            .scaleLinear()
            .domain([minElement.node, maxElement.node])
            .range([w(3), w(8)])

        //collecting classinfo
        const classinfoClassname1 = []
        for (const key in classinfo) {
            classinfoClassname1.push(classinfo[key])
        }
        function unique5(arr) {
            let x = new Set(arr);
            return [...x];
        }
        const classinfoClassname = unique5(classinfoClassname1)
        const department1 = classinfoClassname.slice(0, 6)
        const department2 = classinfoClassname.slice(6)

        //setting scale of classcolor
        const color = d3.schemeCategory10
        color.push("#FFC145")
        color.push("#B6DCFE")
        const colorScale = d3.scaleOrdinal()
            .domain(classinfoClassname)
            .range(color)

        //lengend&title
        if (props.DataSet === "highschool") {
            const length = w(10)
            const legend = graphSVG
                .append("g")
                .attr("class", "legends")
                .selectAll("legends")
                .data(classinfoClassname)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) {
                    return i * w(40)
                })
                .attr("cy", w(40))
                .attr("r", w(5))
                .attr("fill", d => colorScale(d))
                .attr("transform", "translate(" + w(30) + ",0)")
            const legendText = graphSVG
                .append("g")
                .selectAll("text")
                .data(classinfoClassname)
                .enter()
                .append("text")
                .text(d => d)
                .attr("x", function (d, i) {
                    return i * w(40)
                })
                .attr("y", w(58))
                .style("font-size", w(8) + "px")
                .attr("transform", "translate(" + w(24) + ",0)")
        }
        else {
            const length = w(10)
            const legend1 = graphSVG
                .append("g")
                .attr("class", "legends")
                .selectAll("legends")
                .data(department1)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) {
                    return i * w(40)
                })
                .attr("cy", w(30))
                .attr("r", w(5))
                .attr("fill", d => colorScale(d))
                .attr("transform", "translate(" + w(20) + ",0)")
            const legendText1 = graphSVG
                .append("g")
                .selectAll("text")
                .data(department1)
                .enter()
                .append("text")
                .text(d => d)
                .attr("x", function (d, i) {
                    return i * w(40)
                })
                .attr("y", w(48))
                .style("font-size", w(8) + "px")
                .attr("transform", "translate(" + w(14) + ",0)")

            const legend2 = graphSVG
                .append("g")
                .attr("class", "legends")
                .selectAll("legends")
                .data(department2)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) {
                    return i * w(40)
                })
                .attr("cy", w(60))
                .attr("r", w(5))
                .attr("fill", d => colorScale(d))
                .attr("transform", "translate(" + w(20) + ",0)")

            const legendText2 = graphSVG
                .append("g")
                .selectAll("text")
                .data(department2)
                .enter()
                .append("text")
                .text(d => d)
                .attr("x", function (d, i) {
                    return i * w(40)
                })
                .attr("y", w(78))
                .style("font-size", w(8) + "px")
                .attr("transform", "translate(" + w(14) + ",0)")
        }

        const title = graphSVG.append("text")
            .text("NETWORK")
            .style("font-size", w(45) + "px")
            .style("font-weight", "bold")
            .attr("x", width / 2)
            .attr("y", w(60))
            .attr("fill", "#E1E2F2")
            .style("select", "none")

        //force ticked funciton
        function ticked() {
            let max = {}
            let min = {}
            max.x = d3.max(graph.nodes, n => n.x)
            max.y = d3.max(graph.nodes, n => n.y)
            min.x = d3.min(graph.nodes, n => n.x)
            min.y = d3.min(graph.nodes, n => n.y)
            const xScale = d3
                .scaleLinear()
                .domain([min.x, max.x])
                .range([padding, width - padding])
            const yScale = d3
                .scaleLinear()
                .domain([min.y, max.y])
                .range([padding, height - padding])
            link.attr("x1", function (d) {
                return xScale(d.source.x)
            })
                .attr("y1", function (d) {
                    return yScale(d.source.y)
                })
                .attr("x2", function (d) {
                    return xScale(d.target.x)
                })
                .attr("y2", function (d) {
                    return yScale(d.target.y)
                })
            node.attr("cx", function (d) {
                return xScale(d.x)
            }).attr("cy", function (d) {
                return yScale(d.y)
            })
        }

        const g = graphSVG.append("g")
        const link = g
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke", "#d9dde2")
            .attr("stroke-width", d => linkScale(d.weight))//changing stroke-width according to weight

        const a = props.DataSet === "highschool" ? "Class" : "Department"//shifting content
        const node = g
            .append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("r", d => nodeScale(d.degree))
            .attr("fill", d => colorScale(classinfo[d.id]))//dying according to classname
            .style("opacity", 0.8)
            .on("mouseenter", function (d) {
                tooltip.style("opacity", "1")
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            })
            .on("mousemove", function (d) {
                tooltip.html("Id: " + d.id + "<br>" + a + ": " + classinfo[d.id] + "<br>Degree: " + d.degree)
                    .style("left", (d3.mouse(this)[0] + 50 + "px"))
                    .style("top", (d3.mouse(this)[1]) + 40 + "px")
            })
            .on("mouseleave", function (d) {
                tooltip.style("opacity", "0")
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            })//tooltip
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))//dragging

        //force drag function
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
    render() {
        const svg = <div style={{
            height: document.body.clientHeight * 0.8
        }}>
            <svg id="graph" style={{ display: this.props.display ? "block" : "none" }} />
            <div id="tooltips"></div>
        </div>
        return svg
    }
}

export default Graph
