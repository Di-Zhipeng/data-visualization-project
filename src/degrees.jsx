import React, { Component } from "react"
import * as d3 from "d3"
import "../node_modules/antd/dist/antd.css"

class Degrees extends Component {
    componentWillReceiveProps(props) {

        d3.select("#degrees").selectAll("*").remove()
        const degreesSVG = d3.select("#degrees")
        const width = degreesSVG.node().parentNode.clientWidth
        const height= degreesSVG.node().parentNode.clientHeight
        degreesSVG.attr("width", width).attr("height", height)
        const statistic = props.snapshots[props.graphID]===undefined?null:props.snapshots[props.graphID].statistic
        const margin = { top: 30, right: 30, bottom: 30, left: 30 }
        const statisticIndex = []
        const statisticDegree = []
        const data = []
        const xTicks = ['1-1', '2-3', '4-7', '8-15', '16-31', '32-63', '64-127', '128-255',"256-511"]


        //windowscale
        const w = d3
                .scaleLinear()
                .domain([0, 185])
                .range([0,width])

        for (const key in statistic) {
            statisticIndex.push(parseInt(key))
            statisticDegree.push(statistic[key])
        }

        for (let i = 0; i < 9; i++) {
            data.push(
                {
                    Index: xTicks[i],
                    Degree: 0
                }
            )
        }

        for (let i = 0; i < 9; i++) {
            let j = Math.pow(2, i);
            for (; j <= Math.pow(2, i + 1) - 1; j++) {
                if (j > statisticDegree.length) {
                    break;
                }
                data[i].Degree += statisticDegree[j - 1]
            }
        }

        if(statisticDegree.length===0)
        {
            if(props.empty!==true){props.changeEmpty(true)}
            
        }
        else{
            if(props.empty!==false){props.changeEmpty(false)}
        }
        const start = margin.left
        const end = width - margin.right
        const tick = (width - margin.right - margin.left) / 8

        const x = d3.scaleOrdinal()
            .domain(xTicks)
            .range([start, start + tick, start + 2 * tick, start + 3 * tick, start + 4 * tick, start + 5 * tick, start + 6 * tick, start + 7 * tick, end])

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Degree)]).nice()
            .range([height - margin.bottom, margin.top])

        const xAxis = g => g.attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .attr("stroke-width",w(1))
            .selectAll("text")
            .attr("transform","rotate(25)")
            .style("font-size", w(7) + "px")

        const yAxis = g => g.attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(8))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", w(3))
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y))
            .style("font-size", w(8) + "px")
            .attr("transform", "translate("+w(16)+",0)")
        
        const line = d3.line()
            .x(function (d) { return x(d.Index); })
            .y(function (d) { return y(d.Degree); })

        degreesSVG.attr("viewBox", [0, 0, width, height]);

        degreesSVG.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke","steelblue")
            .attr("stroke-width",w(2))
            .attr("d", line);

        const dot = degreesSVG.append("g")
            .attr("class", "dots")
            .selectAll("dots")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Index))
            .attr("cy", d => y(d.Degree))
            .attr("r",w(2))
            .attr("fill","#136682")
            

        degreesSVG.append("g")
            .call(xAxis);

        degreesSVG.append("g")
            .call(yAxis);
    }    
    
    render() {
        const Degrees = <svg id="degrees" />
        return Degrees
    }
}




export default Degrees