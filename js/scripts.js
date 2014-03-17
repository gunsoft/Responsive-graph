// Do not delete this!
var graphData = new Object();


// Grapg settings
var graphSettings = {
	/* Legend width in percent; default: 8 */
	'legendWidth' : 8,
	/* Spacing between columns; default: 2 */
	'columnSpacing' : 2
}


// Return object size
Object.size = function(obj)
{
	var size = 0, key;
	
	for ( key in obj )
	{
		if ( obj.hasOwnProperty(key) ) size++;
	}
	
	return size;
}


// Return graph labels
function getGraphLabels(graphData)
{
	var html = '';
	
	// Get graph data
	html += '<li class="axis">' + "\n";
	
	for ( var index in graphData )
	{
		if ( graphData.hasOwnProperty(index) )
		{
			var colName = graphData[index].name;
			
			//console.log( 'Name = ' + colName );
			
			
			html += '<span class="label">' + colName + '</span>' + "\n";
		}
	}
	
	html += '</li>' + "\n";
	
	return html;
}


// Return graph data
function getGraphData(graphData)
{
	var html = '';
	
	// Get number of object items
	var objItems = Object.size(graphData);
	//console.log(objItems);
	
	var graphWidth = $('.chart').width();
	var graphHeight = $('.chart').height();
	
	if ( graphWidth > 399 ) var colWidth = (100 - graphSettings.legendWidth - (objItems * graphSettings.columnSpacing)) / objItems;
	else var colWidth = (100 - ((objItems - 1) * graphSettings.columnSpacing)) / objItems;
	//console.log('Column width = ' + colWidth);
	
	var i = 1;
	for ( var index in graphData )
	{
		if ( graphData.hasOwnProperty(index) )
		{
			var colName = graphData[index].name;
			var colValue = graphData[index].value;
			var colColor = graphData[index].color;
			var colMargTop = graphHeight - ((graphHeight / 100) * colValue);
			//console.log(colMargTop);
			
			/*
			console.log( 'Name = ' + colName );
			console.log( 'Value = ' + colValue );
			console.log( 'Color = ' + colColor );
			*/
			
			var css = 'height: ' + colValue + '%;';
			css += ' margin-top: ' + colMargTop + 'px;';
			css += ' background-color: ' + colColor + ';';
			css += ' border: 1px solid ' + colColor + ';';
			if ( i != objItems ) css += ' margin-right: ' + graphSettings.columnSpacing + '%;';
			css += ' width: ' + colWidth + '%;';
			
			html += '<li class="bar" style="' + css + '">\
				<span class="col-val">' + colValue + '</span>\
				<span class="col-name">' + colName + '</span>\
			</li>' + "\n";
		}
		
		i++;
	}
	
	return html;
}


function drawGraph()
{
	$('.chart').html('');
	
	var html;
	
	// Get graph labels
	html = getGraphLabels(graphData);
	
	// Get graph data
	html += getGraphData(graphData);
	
	$('#graph-bar .chart').append(html);
	
	// Set legend width and right margin
	$('.chart .axis').css( 'width', graphSettings.legendWidth + '%' ).css( 'margin-right', graphSettings.columnSpacing + '%' );
}


function parseGraphData(data)
{
	var colName, colValue, colColor, index, i = 1;
	
	$(data).find('col').each(function(){
		colName = $(this).find('name').text();
		//console.log(colName);
		
		colValue = $(this).find('value').text();
		//console.log(colValue);
		
		colColor = $(this).find('color').text();
		//console.log(colColor);
		
		index = 'col' + i;
		graphData[index] = new Object();
		
		
		graphData[index].name = colName;
		graphData[index].value = colValue;
		graphData[index].color = colColor;
		
		i++;
	});
	
	//console.log(graphData);
}


function setGraphData()
{
	$.ajax({
		async: false,
		url: 'graph-data.xml',
		dataType: "xml",
		error: function()
		{
			alert("Error: Something went wrong");
		},
		success: parseGraphData
	});
}


$( document ).ready(function() {
	setGraphData();
	drawGraph();
});


$( window ).resize(function() {
	drawGraph();
});