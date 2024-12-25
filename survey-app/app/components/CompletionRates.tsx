'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SurveyCompletion {
  name: string;
  completed: number;
  incomplete: number;
}

function calculateAverageCompletion(data: SurveyCompletion[]): number {
  if (!data || data.length === 0) return 0;
  return Math.round(
    data.reduce((sum, d) => sum + (d.completed / (d.completed + d.incomplete) * 100), 0) / data.length
  );
}

function findHighestPerforming(data: SurveyCompletion[]): string {
  if (!data || data.length === 0) return 'No data';
  
  return data.reduce((prev, curr) => {
    const prevRate = prev.completed / (prev.completed + prev.incomplete);
    const currRate = curr.completed / (curr.completed + curr.incomplete);
    return currRate > prevRate ? curr : prev;
  }).name;
}

function findLowestPerforming(data: SurveyCompletion[]): string {
  if (!data || data.length === 0) return 'No data';
  
  return data.reduce((prev, curr) => 
    (curr.completed / (curr.completed + curr.incomplete)) < 
    (prev.completed / (prev.completed + prev.incomplete)) ? curr : prev
  ).name;
}

export default function CompletionRates({ data }: { data: SurveyCompletion[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || !data.length) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const margin = { top: 30, right: 30, bottom: 140, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height, 0]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .remove();

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height).tickFormat(() => ''));

    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.2)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''));

    // Y-axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .attr('class', 'text-gray-600')
      .selectAll('text')
      .style('font-size', '12px');

    // Bottom border
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height)
      .attr('y2', height)
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);

    // Axis labels
    svg.append('text')
      .attr('transform', `translate(${width/2}, ${height + 90})`)
      .style('text-anchor', 'middle')
      .attr('class', 'text-gray-600 text-sm')
      .text('Survey Name');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height/2)
      .style('text-anchor', 'middle')
      .attr('class', 'text-gray-600 text-sm')
      .text('Completion Rate (%)');

    // Gradient for bars
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('gradientTransform', 'rotate(90)');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#60a5fa');

    // Add and animate bars
    const bars = svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.name) || 0)
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#bar-gradient)')
      .attr('y', height)
      .attr('height', 0);

    bars.transition()
      .duration(1000)
      .attr('y', d => y(d.completed / (d.completed + d.incomplete) * 100))
      .attr('height', d => height - y(d.completed / (d.completed + d.incomplete) * 100));

    // Value labels
    svg.selectAll('.value-label')
      .data(data)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.completed / (d.completed + d.incomplete) * 100) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text(d => `${Math.round(d.completed / (d.completed + d.incomplete) * 100)}%`);

    // Custom labels
    svg.append('g')
      .attr('class', 'x-axis-labels')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr('y', height + 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-gray-600')
      .style('font-size', '12px')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.name.split(' ');
        const lineHeight = 15;
        let line = '';
        let lineNumber = 0;
        
        words.forEach((word, i) => {
          const testLine = line + word + ' ';
          if (testLine.length > 20 && i > 0) {
            text.append('tspan')
              .attr('x', (x(d.name) || 0) + x.bandwidth() / 2)
              .attr('dy', lineHeight)
              .text(line.trim());
            line = word + ' ';
            lineNumber++;
          } else {
            line = testLine;
          }
        });
        
        text.append('tspan')
          .attr('x', (x(d.name) || 0) + x.bandwidth() / 2)
          .attr('dy', lineNumber ? lineHeight : 0)
          .text(line.trim());
      });

  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">No completion data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Question Completion Rates</h2>
        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
          <span>{calculateAverageCompletion(data)}% average completion</span>
          <span>•</span>
          <span className="text-green-600">
            Best: {findHighestPerforming(data)}
          </span>
          <span>•</span>
          <span className="text-amber-600">
            Needs attention: {findLowestPerforming(data)}
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