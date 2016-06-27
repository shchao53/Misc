function main(date) {

    $.getJSON("res/us.json",
        function (jsonData) {

	    var margin = { top: 50,
			   left: 50,
			   right: 50,
			   bottom: 50 };

	    var realW = document.getElementById("content").offsetWidth;

	    var width = realW - margin.left - margin.right,
		height = realW - 200 - margin.top - margin.bottom;

	    var Pw = width - 200,
		Ph = height;

	    var formatNumber = d3.format(",.0f");
	    
	    var radius = d3.scale.sqrt()
	        .domain([0, 1e6])
	        .range([0, 18]);

	    // var date = 234

	    var datename
	    d3.csv("res/datas.csv", function(d) {
		datename=d[date].name;
		getname();
	    });

	    function getname() {
		var text = svg.append("g")
		    .append("text")
		    .text(datename)
		    .attr("x", 450)
		    .style("font-size", "40px");        
	    }
	   
	    
	    /* #1: Create the SVG */
	    var svg = d3.select("#content")
		.append("svg")
		.attr("w", width + margin.left + margin.right)
		.attr("h", height + margin.top + margin.bottom)
		.style("width", (width + margin.left + margin.right) + "px")
		.style("height", (height + margin.top + margin.bottom) + "px")
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
	    ;


	    var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip"),
		tooltip_text = function(d) {
		    var name = d.properties.name
		    var text_show = "<font size='4'>" + name + "</font><br/>"
			+ "Price: $" + d.properties.price[date] + "<br/>"
		    return text_show ;
		}
	    ;

	    var legend = svg.append("g")
	        .attr("class", "legend")
	        .attr("transform", "translate(" + (width - 120) + "," + (height - 320) + ")")
		.selectAll("g")
	        .data([1e6, 3e6, 6e6])
		.enter().append("g");

	    legend.append("circle")
	        .attr("cy", function(d) { return -radius(d); })
	        .attr("r", radius);

	    legend.append("text")
	        .attr("y", function(d) { return -2 * radius(d); })
	        .attr("dy", "1.3em")
	        .text(d3.format(".1s"));

	    // var slider = d3.select('#slider').call(d3.slider().on("slide", function(evt, value) {
	    // 	d3.select('#slidertext').text(value);
		    
	    // }));
	    
	    // d3.select('#slider')
	    // 	.call(d3.slider()
	    // 	      .axis(d3.svg.axis().orient("top").ticks(15).tickFormat(d3.format("d")))
	    // 	      .min(2000)
	    // 	      .max(2014.5)
	    // 	      .step(0.25)
	    // 	      .value(2014.5)
	    // 	//       .on("slide", function(evt, value) {
	    // 	// 	  var indexthis = (value*4)-8000;
	    // 	// 	  d3.select('#slider7text').text(function(d,i) {return Math.floor(value) + " Q" + (myformat(value).split('.')[1]*0.04+1).toString();});

	    // 	// 	  d3.selectAll("*:not(.null).eumap")
	    // 	// 	      .style("fill",function(d,i){
	    // 	// 		  return colordata[d.id][indexthis];
				  
	    // 	// 	      })
	    // 	// 	  d3.selectAll(".numbertext").text(function(d,i){return rawnumbers[i][(value*4)-8000].toString().replace("99","no data");})
	    // 	// //d3.select(".eumap.UK").attr("data-info",function(d,i){return Math.abs(ukdata[0][(sliderval*4)-8000]);})
		  
	    // 	     // })
	    //  );

	    
	    var path = d3.geo.path()
		.projection(null);


	    svg.append("path")
	        .datum(topojson.feature(jsonData, jsonData.objects.nation))
	        .attr("class", "land")
	        .attr("d", path);

	    svg.append("path")
	        .datum(topojson.mesh(jsonData, jsonData.objects.states, function(a, b) { return a !== b; }))
	        .attr("class", "border border--state")
	        .attr("d", path);

	    svg.append("g")
	        .attr("class", "bubble")
	        .selectAll("circle")
	        .data(topojson.feature(jsonData, jsonData.objects.counties).features
		      .sort(function(a, b) { return b.properties.price[date] - a.properties.price[date]; }))
	        .enter().append("circle")
	        .attr("transform", function(d) {
		    return "translate(" + path.centroid(d) + ")";
		})
	        .attr("r", function(d) {
		    // console.log(d.properties.price);
		    return radius(d.properties.price[date]);
		})
	     	.on("mouseover", function(d) {
		    tooltip.transition()
			.duration(200)
			.style("opacity", 1)
		    tooltip.html(tooltip_text(d))
			.style("left", (d3.event.pageX + 10) + "px")
			.style("top", (d3.event.pageY - 80) + "px");
		})
		.on("mouseout", function(d) {
		    tooltip.transition()
			.duration(400)
			.style("opacity", 0);
		})

		;
	        // .append("title")
	        // .text(function(d) {
		//     return d.properties.name
		//         + "\nPopulation " + formatNumber(d.properties.price.2015-10);
		          
		// });
        })
        .fail(function (d) { alert("Failed to load JSON!"); })
    ;


}
