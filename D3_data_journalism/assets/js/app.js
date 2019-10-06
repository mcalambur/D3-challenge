// svg container dimensions
var svgWidth = 800,
	svgHeight = 800;

// set the margins 
var margin = {
	top: 100,
	right: 100,
	bottom: 100,
	left: 100
}; 


// chart area minus margins
var width = svgWidth - margin.left - margin.right,
	height = svgHeight - margin.top - margin.bottom;

// create svg container 
var svg = d3.select('#scatter')
	.classed('chart',true)
	.append('svg')
	.attr('width', svgWidth)
	.attr('height',svgHeight)

// shift everything over by the margins
var chartGroup = svg.append('g')
	.attr('transform',`translate(${margin.left},${margin.top})`)


// Create chart
var selectedXAxis = 'poverty',
	selectedYAxis = 'healthcare';

//Load the csv data 
d3.csv("assets/data/data.csv").then( data =>{
	data.forEach( d =>{
		d.poverty = +d.poverty;
		d.age = +d.age;
		d.income = +d.income;
		d.obesity = +d.obesity;
		d.smokes = +d.smokes;
		d.healthcare = +d.healthcare;
	});

	// Scale the x and y axis
	var xScale = getXScaleForAxis(data,selectedXAxis),
		yScale = getYScaleForAxis(data,selectedYAxis);

	
	var xAxis = d3.axisBottom(xScale),
		yAxis = d3.axisLeft(yScale);

	var xAxis = chartGroup.append('g')
		.attr('transform',`translate(0,${height})`)
		.call(xAxis);
	var yAxis = chartGroup.append('g')
		.call(yAxis);

    // place the data set on the charrtgroup
	var stAbbrCircles = chartGroup.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.classed('stateCircle',true)
		.attr('cx', d => xScale(d[selectedXAxis]))
		.attr('cy', d => yScale(d[selectedYAxis]))
		.attr('r' , 15)
	
	var stateText = chartGroup.append('g').selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.classed('stateText',true)
		.attr('x', d => xScale(d[selectedXAxis]))
		.attr('y', d => yScale(d[selectedYAxis]))
		.attr('transform','translate(0,5)')
		.text(d => d.abbr)

	// Create the x axis labels
		var xLabelsGroup = chartGroup.append('g')
		.attr('transform', `translate(${width / 2}, ${height + 25})`);

	// Poverty (%) label and is set to active
		var povertyLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 25)
	    .attr('value', 'poverty')
	    .classed('aText active', true)
	    .text('In Poverty (%)');

	// Age label and set to inactive
		var ageLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 45)
	    .attr('value', 'age')
	    .classed('aText inactive', true)
	    .text('Age (Median)');

	// Household Income label and set to inactive
		var hhIncomeLavel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 65)
	    .attr('value', 'income')
	    .classed('aText inactive', true)
		.text('Household Income (Median)');
		
	//	Create the y axis labels
    var yLabelsGroup = chartGroup.append('g')
	
	// Lacks Healthcare (%) label and set to active 	
	var LacksHealthCareLabel = yLabelsGroup.append('text')
	    .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	    .attr('value', 'healthcare')
	    .classed('aText active', true)
		.text('Lacks Healthcare (%)');
	
	// Smokes y axis label and set it to inactive
	var smokesLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
	    .attr('value', 'smokes')
	    .classed('aText inactive', true)
		.text('Smokes (%)');
		
	// Obesity y axis label and set it to inactive
    var obesityLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
	    .attr('value', 'obesity')
	    .classed('aText inactive', true)
	    .text('Obesse (%)');

	//Add the tooltips to show 
	var stAbbrCircles = updateToolTip(selectedYAxis,selectedXAxis,stAbbrCircles,stateText),
		stateText = updateToolTip(selectedYAxis,selectedXAxis,stAbbrCircles,stateText);

	// Set the transitions for x axis 
	xLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== selectedXAxis) {
			    selectedXAxis = value;

		        xScale = getXScaleForAxis(data, selectedXAxis);

		        xAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisBottom(xScale));

		        stAbbrCircles.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',15)
			        })
			        .attr('cx', d => xScale(d[selectedXAxis]));

			    d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('x', d => xScale(d[selectedXAxis]));

	        	stAbbrCircles = updateToolTip(selectedYAxis,selectedXAxis,stAbbrCircles,stateText),
				stateText = updateToolTip(selectedYAxis,selectedXAxis,stAbbrCircles,stateText);

		        if (selectedXAxis === 'poverty') {
				    povertyLabel
			            .classed('active', true)
			            .classed('inactive', false);
			        hhIncomeLavel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (selectedXAxis === 'age'){
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        hhIncomeLavel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        hhIncomeLavel
			            .classed('active', true)
			            .classed('inactive', false);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
		});

	// Set the transitions for y axis 

    yLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== selectedYAxis) {
			    selectedYAxis = value;

		        yScale = getYScaleForAxis(data, selectedYAxis);

		        yAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisLeft(yScale));

		        stAbbrCircles.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',15)
			        })
			        .attr('cy', d => yScale(d[selectedYAxis]));

			    d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('y', d => yScale(d[selectedYAxis]));

	        	stAbbrCircles = updateToolTip(selectedYAxis,selectedXAxis,stAbbrCircles,stateText),
				stateText = updateToolTip(selectedYAxis,selectedXAxis,stAbbrCircles,stateText);

		        if (selectedYAxis === 'healthcare') {
				    LacksHealthCareLabel
			            .classed('active', true)
			            .classed('inactive', false);
			        smokesLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (selectedYAxis === 'obesity'){
		        	LacksHealthCareLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityLabel
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	LacksHealthCareLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesLabel
			            .classed('active', true)
			            .classed('inactive', false);
		            obesityLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
	    });

});


function getXScaleForAxis(data,selectedXAxis) {
	var xScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[selectedXAxis])*.9, 
	    		d3.max(data, d => d[selectedXAxis])*1.1])
	    .range([0, width]);
    
    return xScale;
}

function getYScaleForAxis(data,selectedYAxis) {
	var yScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[selectedYAxis])*.9, 
	    		d3.max(data, d => d[selectedYAxis])*1.1])
	    .range([height, 0]);

    return yScale;
}

// Deatils of the tool tips
function updateToolTip(selectedYAxis,selectedXAxis,stAbbrCircles,stateText) {
    var toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([80, -60])
        .html( d => {
        	if(selectedXAxis === "poverty")
	            return (`${d.state}<br>${selectedYAxis}:${d[selectedYAxis]}% 
	            		<br>${selectedXAxis}:${d[selectedXAxis]}%`)
        	else if (selectedXAxis === 'income')
	            return (`${d.state}<br>${selectedYAxis}:${d[selectedYAxis]}% 
	            		<br>${selectedXAxis}:$${d[selectedXAxis]}`)
	        else
	        	return (`${d.state}<br>${selectedYAxis}:${d[selectedYAxis]}% 
	            		<br>${selectedXAxis}:${d[selectedXAxis]}`)
	    });

	stAbbrCircles.call(toolTip);
	stAbbrCircles.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	d3.selectAll('.stateText').call(toolTip);
	d3.selectAll('.stateText').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	return stAbbrCircles;
	return stateText;
}