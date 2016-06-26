function main() {
    $.getJSON("res/songs.json",
              function (jsonData) {

		  var margin = { top: 50,
				 left: 50,
				 right: 50,
				 bottom: 50 };
		  var gridSize = 6;

		  var realW = document.getElementById("content").offsetWidth;

		  var width = realW - margin.left - margin.right,
		      height = realW - 200 - margin.top - margin.bottom;

		  var Pw = width - 200,
		      Ph = height;
		  
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
		      .attr("class", "tooltip")
		      .style("opacity", 0.9),
		      tooltip_text = function(d) {
			  var lyrics = d.lyrics.replace(/\n/g, "<br/>")
			  var text_show = "<font size='5'>" + d.name + "</font><br/>"
			      + d.artist + " | " + d.album + "<br/>"
			      + "Country Prob: " + xValue(d).toFixed(5) + "<br/>"
			      + "Complexity: " + yValue(d).toFixed(5) + "<br/>"
			      + "------------------------------------------------ <br/>"
			      + lyrics
			  return text_show ;
		      }
		  ;


		  // rescale x using inverse Logistic function
		  var k = -1,
		      x0 = 0.5,
		      cutoff = 1e-8, // to prevent infinity error
		      xRescale = function(d) {
		      if (d > 1 - cutoff ) {
		  	  d = 1.0 - cutoff ;
		      }
		      if (d < cutoff) {
		  	  d = cutoff ;
		      }
		      return (Math.log(1/d - 1) / k + x0);
		  };

		  
		  // find max and min of x y, floor to 2 dicimal
 		  var maxX = d3.max(
		      jsonData,
		      function (d) { return xRescale(d.x); }
		  );
		  var maxY = d3.max(
		      jsonData,
		      function (d) { return d.y; }
		  );
		  var minX = d3.min(
		      jsonData,
		      function (d) { return xRescale(d.x); }
		  );
		  var minY = d3.min(
		      jsonData,
		      function (d) { return d.y; }
		  );


		  // setup x
		  var xValue = function(d) { return d.x ;},                               // data -> value
		      xScale = d3.scale.linear().domain([minX, maxX]).range([0, Pw]),  // value -> display
		      xaxisScale = d3.scale.linear().range([-Pw/2, Pw/2]),          // value -> display
		      xMap = function(d) { return xScale(xRescale(xValue(d)));},          // data -> display
		      xAxis = d3.svg.axis().scale(xaxisScale).orient("bottom").tickValues([0, 1]);

		  // setup y
		  var yValue = function(d) { return d.y ;},                               // data -> value
		      yScale = d3.scale.linear().domain([minY, maxY]).range([Ph, 0]), // value -> display
		      yaxisScale = d3.scale.linear().range([Ph/2, -Ph/2]),        // value -> display
		      yMap = function(d) { return yScale(yValue(d));},                    // data -> display
		      yAxis = d3.svg.axis().scale(yaxisScale).orient("left").tickValues([0, 1]);

		  // setup fill color
		  var cValue = function(d) { return d.artist;},
		      color = d3.scale.category20();

 		  // draw dots for Circle
		  svg.selectAll(".dot")
		      .data(jsonData.filter(function(d) { return d.genre == 'Pop'; }))
		      .enter().append("circle")
		      .attr("r", 6)
		      .attr("cx", xMap)
		      .attr("cy", yMap)
		      .style("fill", function(d) { return color(cValue(d));})
		      .attr("class", function(d){
			  if (d.artist == "Ke$ha") {
			      var artist = "KeS"
			  } else {
			      var artist = d.artist.slice(0,3)
			  }
			  return "dot style-" + artist ;
		      })
 		      .on("mouseover", function(d) {
			  tooltip.transition()
			      .duration(200)
			      .style("opacity", 1)
			  tooltip.html(tooltip_text(d))
			      .style("left", (d3.event.pageX + 5) + "px")
			      .style("top", (d3.event.pageY - 28) + "px");
		      })
		      .on("mouseout", function(d) {
			  tooltip.transition()
			      .duration(400)
			      .style("opacity", 0);
		      });

		  // draw squares for Country
		  svg.selectAll(".rect")
		      .data(jsonData.filter(function(d) { return d.genre == 'Country'; }))
		      .enter().append("rect")
		      .attr("class", function(d){
			  return "rect style-" + d.artist.slice(0, 3) ;
		      })
		      .attr("width", 10)
		      .attr("height", 10)
		      .attr("x", xMap)
		      .attr("y", yMap)
		  
		      .style("fill", function(d) { return color(cValue(d));})
 		      .on("mouseover", function(d) {
			  tooltip.transition()
			      .duration(200)
			      .style("opacity", 1)
			  tooltip.html(tooltip_text(d))
			      .style("left", (d3.event.pageX + 5) + "px")
			      .style("top", (d3.event.pageY - 28) + "px");
		      })
		      .on("mouseout", function(d) {
			  tooltip.transition()
			      .duration(400)
			      .style("opacity", 0);
		      });

		  
		  // x-axis
		  var axisLabel = svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(" + Pw/2 + "," + Ph/2 + ")")
		      .call(xAxis);
		      axisLabel.append("text")
		      .attr("class", "label")
		      .attr("x", Pw/2 - 20 )
		      .attr("y", -6)
		      .style("text-anchor", "start")
		      .text("Country");
		  axisLabel.append("text")
		      .attr("class", "label")
		      .attr("x", -Pw/2 - 10)
		      .attr("y", -6)
		      .style("text-anchor", "end")
		      .text("Pop");

		  // y-axis
		  svg.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + Pw/2 + "," + Ph/2 + ")")
		      .call(yAxis)
		      axisLabel.append("text")
		      .attr("class", "label")
		      .attr("transform", "rotate(-90)")
		      .attr("x", Pw/2 + 40)
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Complex");
		  axisLabel.append("text")
		      .attr("class", "label")
		      .attr("transform", "rotate(-90)")
		      .attr("x", -Pw/2 - 40)
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "start")
		      .text("Boring (Zzz...)");



		  var legendData=_.uniq(jsonData, function(d){
		      return d.artist;
		  })

		  // draw legend
		  var legend = svg.selectAll(".legend")
		  ///    .data(color.domain())
		      .data(legendData)
		      .enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  // draw legend colored rectangles
		  legend.append("rect")
		      .attr("x", width - 18)
		      // .attr("y", height/2 + 20)
		      .attr("width", function(d){
			  if (d.genre == "Country"){
			      return 16;}
			  else{
			      return 0;
			  }
		      })
		      .attr("height", 18)
		      .style("fill", function(d, i) { return color(cValue(d)); });

		  // draw legend colored circles
		  legend.append("circle")
		      .attr("r", function(d){
			  if (d.genre == "Pop"){
			      return 8;}
			  else{
			      return 0;
			  }
		      })
		      .attr("cx", width - 9)
		      .attr("cy", 9)
		      .style("fill", function(d,i) { return color(cValue(d)); });



		  // draw legend text
		  legend.append("text")
		      .attr("class", "legend")
		      .attr("x", width - 24)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { return d.artist;})
 		      .on("mouseover", function(d) {
 			  if (d.artist == "Ke$ha") {
			      var artist = "KeS"
			  } else {
			      var artist = d.artist.slice(0,3)
			  }
			  svg.selectAll(".dot").style("opacity", 0.2)
		      	  svg.selectAll("circle.style-" + artist)
			      .transition().duration(50)
			      .style("opacity", 1)
			      .attr("r", 8) 

			  svg.selectAll(".rect").style("opacity", 0.2)
		      	  svg.selectAll("rect.style-" + artist)
			      .transition().duration(50)
			      .style("opacity", 1)
			      .attr("width", 14)
			      .attr("height", 14)
		      	  d3.select(this)
			      .style("fill", function(d, i) { return color(cValue(d)); })
			      .style("font-size", 20)
			  ;
		      })
		      .on("mouseout", function(d) {
			  if (d.artist == "Ke$ha") {
			      var artist = "KeS"
			  } else {
			      var artist = d.artist.slice(0,3)
			  }
			  svg.selectAll(".dot")
			      .style("opacity", 1)
			      .attr("r", 6)
			  svg.selectAll(".rect")
			      .style("opacity", 1)
			      .attr("width", 10)
			      .attr("height", 10)
		      	  d3.select(this)
			      .style("fill", "black")
			      .style("font-size", 14) 
			  ;
		      });
              })
        .fail(function (d) { alert("Failed to load JSON!"); })
    ;
}


		  // UPDATE PLOT
		  // d3.select('#RescaleX').on('click', function () {
		  //     var xRescale = function(d) {
		  // 	  return d
		  //     };
 		  //     var maxX = d3.max(
		  // 	  jsonDajta,
		  // 	  function (d) { return xRescale(d.x); }
		  //     );
		  //     var minX = d3.min(
		  // 	  jsonData,
		  // 	  function (d) { return xRescale(d.x); }
		  //     );

		  //     xScale = d3.scale.linear().domain([minX, maxX]).range([0, width]);  // value -> display
		  //     xMap = function(d) { return xScale(xRescale(xValue(d)));};         // data -> display

		  //     svg.selectAll(".dot")
		  // 	  .data(jsonData.filter(function(d) { return d.genre == 'Pop'; }))
		  // 	  .enter().append("circle")
		  // 	  .attr("class", "dot")
		  // 	  .attr("r", 6)
		  // 	  .attr("cx", xMap)
		  // 	  .attr("cy", yMap)
		  // 	  .style("fill", function(d) { return color(cValue(d));})
 		  // 	  .on("mouseover", function(d) {
		  // 	      console.log("HEHA");

		  // 	      tooltip.transition()
		  // 		  .duration(200)
		  // 		  .style("opacity", .9)
		  // 	      tooltip.html(tooltip_text(d))
		  // 		  .style("left", (d3.event.pageX + 5) + "px")
		  // 		  .style("top", (d3.event.pageY - 28) + "px");
		  // 	  })
		  // 	  .on("mouseout", function(d) {
		  // 	      tooltip.transition()
		  // 		  .duration(400)
		  // 		  .style("opacity", 0);
		  // 	  });

		  //     // draw squares for Country
		  //     svg.selectAll(".rect")
		  // 	  .data(jsonData.filter(function(d) { return d.genre == 'Country'; }))
		  // 	  .enter().append("rect")
		  // 	  .attr("class", "rect")
		  // 	  .attr("width", 10)
		  // 	  .attr("height", 10)
		  // 	  .attr("x", xMap)
		  // 	  .attr("y", yMap)
		  // 	  .style("fill", function(d) { return color(cValue(d));})
 		  // 	  .on("mouseover", function(d) {
		  // 	      tooltip.transition()
		  // 		  .duration(200)
		  // 		  .style("opacity", .9)
		  // 	      tooltip.html(tooltip_text(d))
		  // 		  .style("left", (d3.event.pageX + 5) + "px")
		  // 		  .style("top", (d3.event.pageY - 28) + "px");
		  // 	  })
		  // 	  .on("mouseout", function(d) {
		  // 	      tooltip.transition()
		  // 		  .duration(400)
		  // 		  .style("opacity", 0);
		  // 	  });
		      
		  // });

