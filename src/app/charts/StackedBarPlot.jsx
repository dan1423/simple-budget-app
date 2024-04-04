import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StackedBarPlot = ({ data }) => {
  const svgRef = useRef();
console.log(data);
  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const stack = d3.stack().keys(["Current", "Threshold"]);
    const stackedData = stack(data);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.x))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .range([height, 0]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale).ticks(5));

    const bars = svg.selectAll(".bar")
      .data(stackedData)
      .enter().append("g")
      .attr("class", "bar")
      .attr("fill", (d, i) => i === 0 ? "steelblue" : "orange");

    bars.selectAll("rect")
      .data(d => d)
      .enter().append("rect")
      .attr("x", d => xScale(d.data.x))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth());
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default StackedBarPlot;
