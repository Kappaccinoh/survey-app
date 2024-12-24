'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  date: Date;
  count: number;
}

interface Props {
  data: DataPoint[];
}

export default function ResponseTrends({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions with better margins
    const margin = { top: 30, right: 50, bottom: 50, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate simple trend line
    const xPoints = data.map((_, i) => i);
    const yPoints = data.map(d => d.count);
    const trendline = calculateTrendLine(xPoints, yPoints);
    
    // Create trend data points
    const trendData = data.map((d, i) => ({
      date: d.date,
      value: trendline.slope * i + trendline.intercept
    }));

    // Extend trend line into future
    const lastDate = new Date(data[data.length - 1].date);
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + 7); // Predict 7 days ahead

    // Add future predictions
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      trendData.push({
        date: futureDate,
        value: trendline.slope * (data.length + i - 1) + trendline.intercept
      });
    }

    // Create scales
    const x = d3.scaleTime()
      .domain([
        d3.min(data, d => d.date) as Date,
        futureDate
      ])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, Math.max(
        d3.max(data, d => d.count) as number,
        d3.max(trendData, d => d.value) as number
      ) * 1.2])
      .nice()
      .range([height, 0]);

    // Create line
    const line = d3.line<DataPoint>()
      .x(d => x(d.date))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    // Create trend line
    const trendLine = d3.line<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''));

    // Add axes with styled labels
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('class', 'text-gray-600')
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(y))
      .attr('class', 'text-gray-600')
      .selectAll('text')
      .style('font-size', '12px');

    // Add axis labels
    svg.append('text')
      .attr('transform', `translate(${width/2}, ${height + 40})`)
      .style('text-anchor', 'middle')
      .attr('class', 'text-gray-600 text-sm')
      .text('Date');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height/2)
      .style('text-anchor', 'middle')
      .attr('class', 'text-gray-600 text-sm')
      .text('Responses');

    // Add area under the line
    const area = d3.area<DataPoint>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', '#3b82f620')
      .attr('d', area);

    // Add actual data line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add trend line
    svg.append('path')
      .datum(trendData)
      .attr('fill', 'none')
      .attr('stroke', '#9333ea')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', trendLine);

    // Add dots with hover effect
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.count))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6);

        // Add tooltip
        svg.append('text')
          .attr('class', 'tooltip')
          .attr('x', x(d.date))
          .attr('y', y(d.count) - 10)
          .attr('text-anchor', 'middle')
          .attr('class', 'text-sm font-medium')
          .text(`${d.count} responses`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 4);
        
        svg.selectAll('.tooltip').remove();
      });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 0)`);

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    legend.append('text')
      .attr('x', 25)
      .attr('y', 4)
      .attr('class', 'text-sm text-gray-600')
      .text('Actual');

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 20)
      .attr('y2', 20)
      .attr('stroke', '#9333ea')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 24)
      .attr('class', 'text-sm text-gray-600')
      .text('Trend');

  }, [data]);

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Response Trends</h2>
        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <span className={`mr-2 h-2 w-2 rounded-full ${
              calculateTrend(data) > 0 ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {calculateTrend(data) > 0 ? 'Increasing' : 'Decreasing'} trend
          </span>
          <span>•</span>
          <span>{calculateAverageResponses(data)} avg. daily responses</span>
          <span>•</span>
          <span className={calculateProjectedGrowth(data) > 0 ? 'text-green-600' : 'text-red-600'}>
            {calculateProjectedGrowth(data)}% projected growth
          </span>
        </div>
      </div>
      <svg 
        ref={svgRef} 
        className="w-full"
        style={{ height: '400px' }}
        viewBox={`0 0 ${svgRef.current?.clientWidth || 600} 400`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}

// Helper function to calculate trend line using least squares method
function calculateTrendLine(xValues: number[], yValues: number[]) {
  const n = xValues.length;
  const xMean = xValues.reduce((a, b) => a + b) / n;
  const yMean = yValues.reduce((a, b) => a + b) / n;
  
  const numerator = xValues.reduce((sum, x, i) => {
    return sum + (x - xMean) * (yValues[i] - yMean);
  }, 0);
  
  const denominator = xValues.reduce((sum, x) => {
    return sum + Math.pow(x - xMean, 2);
  }, 0);
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  return { slope, intercept };
}

function calculateTrend(data: DataPoint[]): number {
  const xValues = data.map((_, i) => i);
  const yValues = data.map(d => d.count);
  return calculateTrendLine(xValues, yValues).slope;
}

function calculateAverageResponses(data: DataPoint[]): number {
  return Math.round(data.reduce((sum, d) => sum + d.count, 0) / data.length);
}

function calculateProjectedGrowth(data: DataPoint[]): number {
  const firstWeek = data.slice(0, Math.min(7, data.length));
  const lastWeek = data.slice(-Math.min(7, data.length));
  
  const firstAvg = firstWeek.reduce((sum, d) => sum + d.count, 0) / firstWeek.length;
  const lastAvg = lastWeek.reduce((sum, d) => sum + d.count, 0) / lastWeek.length;
  
  return Math.round(((lastAvg - firstAvg) / firstAvg) * 100);
} 