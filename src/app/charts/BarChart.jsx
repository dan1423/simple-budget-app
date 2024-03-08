import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";



const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
const BarChart = ({ data, width = 600, height = 600 }) => {
    const axesRef = useRef(null);
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  
    const allGroups = data.map((d) => String(d.x));
    const allSubgroups = ["Current", "Threshold"]; 
  

    const stackSeries = d3.stack().keys(allSubgroups).order(d3.stackOrderNone);
    const series = stackSeries(data);
  

    const max = 4000; 
    const yScale = useMemo(() => {
      return d3
        .scaleLinear()
        .domain([0, max || 0])
        .range([boundsHeight, 0]);
    }, [data, height]);
  
    const xScale = useMemo(() => {
        return d3.scaleBand()
                  .domain(allGroups) // Ensure allGroups is an array of the domain values
                  .range([0, width]) // Use boundsWidth or a derived width
                  .padding(0.05); // Adjust padding as needed
      }, [allGroups, width]);
  
    const colorScale = d3.scaleOrdinal()
    .domain(allGroups)
    .range(["#e0ac2b", "#e85252"]);
  
    // Render the X and Y axis using d3.js, not react
    useEffect(() => {
      const svgElement = d3.select(axesRef.current);
      svgElement.selectAll("*").remove();
      const xAxisGenerator = d3.axisBottom(xScale);
      svgElement
        .append("g")
        .attr("transform", "translate(0," + boundsHeight + ")")
        .call(xAxisGenerator);
  
      const yAxisGenerator = d3.axisLeft(yScale);
      svgElement.append("g").call(yAxisGenerator);
    }, [xScale, yScale, boundsHeight]);
  
    const rectangles = series.map((subgroup, i) => {
      return (
        <g key={i}>
          {subgroup.map((group, j) => {
            return (
              <rect
                key={j}
                x={xScale(group.data.x)}
                y={yScale(group[1])}
                height={yScale(group[0]) - yScale(group[1])}
                width={xScale.bandwidth()}
                fill={colorScale(subgroup.key)}
                opacity={0.9}
              ></rect>
            );
          })}
        </g>
      );
    });
  
    return (
      <div>
        <svg width={width} height={height}>
          <g
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          >
            {rectangles}
          </g>
          <g
            width={boundsWidth}
            height={boundsHeight}
            ref={axesRef}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          />
        </svg>
      </div>
    );
  
};

export default BarChart;
