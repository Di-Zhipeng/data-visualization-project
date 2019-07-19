import React, { Component } from "react"
import * as d3 from "d3"
import "../node_modules/antd/dist/antd.css"

class Snapshots extends Component {
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(props) {
        d3.select("#snapshot").selectAll("*").remove()
        const snapshots = props.snapshots
        const snapshotSVG = d3.select("#snapshot")
        const padding = 100
        const width = snapshotSVG.node().parentNode.clientWidth
        const height = snapshotSVG.node().parentNode.clientHeight
        snapshotSVG.attr("width", width).attr("height", height)
      
        let dyeMethod = 7
        if(props.DyeMethod==="all")
        {
            dyeMethod=1
        }
        else{
            dyeMethod=props.DataSet==="highschool"?7:9
        }
      
        //windowscale
        const w = d3
                .scaleLinear()
                .domain([0, 485])
                .range([0,width])

        //zoom
        snapshotSVG.call(d3.zoom()
            .scaleExtent([1 / 2, 8])
            .on("zoom", zoomed))
        function zoomed() {
            g.attr("transform", d3.event.transform);
            }

        //setting interpolate
        var a = d3.rgb(255,255,160);
        console.log(a)
        var b = d3.rgb(0,93,224);
        var c = a.darker(1)
        var d = b.darker(1)
        var compute1 = d3.interpolate(a, b)
        var compute2 = d3.interpolate(c, d)
        var linear = d3.scaleLinear()
            .domain([0, (snapshots.length - 1)/dyeMethod])
            .range([0, 1])
        
        //setting color gradiant
        var defs = snapshotSVG.append("defs");
        var linearGradient = defs.append("linearGradient")
            .attr("id","linearColor")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","100%")
            .attr("y2","0%");
        var stop1 = linearGradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",a.toString());
        var stop2 = linearGradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",b.toString());
        //adding rect
        var colorRect = snapshotSVG.append("rect")
            .attr("x", w(40))
            .attr("y", w(35))
            .attr("width", w(110))
            .attr("height", w(7))
            .style("fill","url(#" + linearGradient.attr("id") + ")");

        //adding axis2
        const time1 = snapshotSVG
    		.append("text")
    		.text(dyeMethod !== 1?"06:00":props.DataSet==="highschool"?"19.Nov.2012":"Day1")
        	.attr("x",w(36))
    		.attr("y",w(55))
            .style("font-size",w(8)+"px")
        const time2 = snapshotSVG
    		.append("text")
    		.text(dyeMethod !== 1?"06:00+1":props.DataSet==="highschool"?"27.Nov.2012":"Day9")
        	.attr("x",dyeMethod !== 1?w(125):props.DataSet==="highschool"?w(110):w(135))
    		.attr("y",w(55))
            .style("font-size",w(8)+"px")
        const title = snapshotSVG.append("text")
            .text("PROJECTION")
            .style("font-size",w(45)+"px")
            .style("font-weight","bold")
            .attr("x",width/2-w(65))
            .attr("y",w(60))
            .attr("fill","#E1E2F2")

        const max = {}
        const min = {}
        max.x = d3.max(snapshots, snpst => snpst.vector[0])
        max.y = d3.max(snapshots, snpst => snpst.vector[1])
        min.x = d3.min(snapshots, snpst => snpst.vector[0])
        min.y = d3.min(snapshots, snpst => snpst.vector[1])
        const xScale = d3
            .scaleLinear()
            .domain([min.x, max.x])
            .range([padding, width - padding])
        const yScale = d3
            .scaleLinear()
            .domain([min.y, max.y])
            .range([padding, height - padding])

        const snapshotLinkData = []
        for (let i = 0; i < snapshots.length - 1; i++) {
            snapshotLinkData.push([
                snapshots[i].vector,
                snapshots[i + 1].vector
            ])
        }

        const g = snapshotSVG.append("g")
        const snapshotLink = g
            .selectAll("line")
            .data(snapshotLinkData)
        snapshotLink.exit().remove()
        snapshotLink
            .enter()
            .append("line")
            .attr("x1", d => xScale(d[0][0]))
            .attr("x2", d => xScale(d[1][0]))
            .attr("y1", d => yScale(d[0][1]))
            .attr("y2", d => yScale(d[1][1]))
            .attr("stroke", "#545F66")
            .attr("stroke-width", w(3))
            .attr("transform", "translate("+w(-10)+",0)")

        const points = g.selectAll("circle").data(snapshots)
        points.exit().remove()
        points.enter()
            .append("circle")
            .attr("cx", d => xScale(d.vector[0]))
            .attr("cy", d => yScale(d.vector[1]))
            .attr("r", w(5))
            .style("stroke", "black")
            .style("stroke-width",0.5)
            .attr("transform", "translate("+w(-10)+",0)")
            .attr("fill", d => {
                return compute1(linear((snapshots.indexOf(d) - 1)%((snapshots.length - 1)/dyeMethod)))
            })
            .attr("stroke", "#d9dde2")
            .on("mouseover", (d, i) => {
                console.log(d, i)
            })
            .on("click", function (d, i) {
                props.changeGraphID(i)
            })//shifting graph
            //mouseover=>darker
            .on("mouseover", function(d,i){
                d3.select(this)
                .style("fill",d => compute2(linear((snapshots.indexOf(d) - 1)%((snapshots.length - 1)/dyeMethod))))
            })
            .on("mouseout", function(d,i){
                d3.select(this)
                .style("fill",d => compute1(linear((snapshots.indexOf(d) - 1)%((snapshots.length - 1)/dyeMethod))))
            })
    }

    render() {
        return <svg id="snapshot" />
    }
}

export default Snapshots