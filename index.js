//# dc.js Getting Started and How-To Guide
'use strict';

//charts - divs

//var gainOrLossChart = dc.pieChart("#gain-loss-chart");
//var fluctuationChart = dc.barChart("#fluctuation-chart");
// var complaintChart = dc.rowChart("#complaint-chart");

//var hourChart = dc.rowChart("#chart1");
//var zipcodeChart = dc.rowChart("#chart2");
//var durationChart = dc.barChart("#duration-chart");
//var moveChart = dc.lineChart("#monthly-move-chart");
//var volumeChart = dc.barChart("#monthly-volume-chart");
//var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");
//var rwChart = dc.geoChoroplethChart("#choropleth-map-chart");

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
var dimension
var color = "black"

var highlightColor = "red"

queue()
//.defer(d3.csv, "joined_expanded.csv")
.defer(d3.csv, "joined_years_expanded.csv")
.await(ready);
function ready(error, data){
	//console.log(data)

    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

//console.log(ndx)
//Year,Single-Year Ages,Place of Death,Race,Cause of death,Deaths,Gender
	
	var row1 = d3.select("#charts").append("div").attr("class","row")
    row1.append("div").attr("id","Cause",highlightColor)
    row1.append("div").attr("id","Weapon")
	
	row1.append("div").attr("id","Year")
	
	var row2 = d3.select("#charts").append("div").attr("class","row")
    row2.append("div").attr("id","Age")
	
 	//d3.select("#charts").append("div").attr("id","causePie")
    d3.select("#charts").append("div").attr("id","Race")
    d3.select("#charts").append("div").attr("id","Gender")
    d3.select("#charts").append("div").attr("id","Place")
	
	
	var w = 200
	
	var rd = ndx.dimension(function(d){return d["Race"]})
 	 rowChart(rd, 100,w+190,190,"Race",ndx)
   	 	//
	var gd = ndx.dimension(function(d){
		var genderDict = {F:"Female",M:"Male"}
		return genderDict[d["Gender"]]
	})
	 	  rowChart(gd,100,w+60,60,"Gender",ndx)
	//
	dimension = ndx.dimension(function(d){return parseInt(d['Single-Year Ages'])})
	barChart(dimension,200,1000,20,"Age", ndx,[0,100])
	
	dimension = ndx.dimension(function(d){return parseInt(d['Year'])})
	barChart(dimension,140,400,20,"Year", ndx,[1999,2020])
	
	
	 var cd = ndx.dimension(function(d){
	 	var cause = d["Cause of death"]
	 	if(cause.indexOf("Assault")>-1){
	 		return "assault"
	 	}else if(cause.indexOf("Intentional self-harm")>-1){
	 		return "self-harm"
	 	}else if(cause.indexOf("undetermined intent")>-1){
	 		return "undetermined"
	 	}else if(cause =="Legal intervention involving firearm discharge"){
	 		return "police"
	 	}else{
	 		return "unintentional"
	 	}
	 })
	 rowChart(cd, 400, w+80, 80,"Cause",ndx)
	
 // var causePie = new dc.pieChart('#causePie');
//   	causePie.width(300)
//   	.height(300)
//   	.radius(140)
//   	.dimension(cd)
//   	.group(cd.group())
//   	 .renderLabel(true)
//          .transitionDuration(0)
 
	
	
	 var wd = ndx.dimension(function(d){
	 	var cause = d["Cause of death"].toLowerCase()
	 	if(cause.indexOf("handgun")>-1){
	 		return "Handgun"
	 	}else if(cause.indexOf("rifle, shotgun and larger firearm discharge")>-1){
	 		return "Rifle, shotgun and larger firearm"
	 	}else if(cause.indexOf("other and unspecified firearm")>-1){
	 		return "Other and unspecified firearm"
	 	}
	 })
	  	  rowChart(wd, 100, 400, 200,"Weapon",ndx)
	
	// 	//	 //
	//  // var causeGroup = ndx.dimension(function(d){return d["Cause of death"]})
	//  //  	  rowChart(causeGroup, 100, 600, 180,"chart3",ndx)
	//
	//
	//
	 var pd = ndx.dimension(function(d){return d["Place of Death"]})
	  	  rowChart(pd, 100, 400, 220,"Place",ndx)

	      dc.dataCount(".dc-data-count")
	          .dimension(ndx)
	          .group(all)
	          .html({
	              some:"%filter-count selected out of <strong>%total-count</strong> gun deaths | <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset All</a>",
	              all:"All %total-count gun deaths 1999 - 2020, not including legal interventions"
	          })

	
    dc.renderAll();
};

function barChart(dimension,h, w, m, divName, ndx,domain){
	var group = dimension.group()
  var div= d3.select("#"+divName)
	var filtersDiv = div.append("div").style("height","40px")
	filtersDiv.append("div").html(divName)
	filtersDiv.append("span").attr("class","filter").style("display","none")

	filtersDiv.append("a").attr("class","reset").html(" | reset ").style("display","none")
	.on("click",function(){
		chart.filterAll()
		dc.redrawAll()
	})
	
	var chart = dc.barChart("#"+divName)
	
	
	chart.width(w)
	        .height(h)
	        .margins({top: 0, right: 20, bottom: 60, left: 40})
	        .ordinalColors([color])
	        .dimension(dimension)
	        .group(group)
	       // .centerBar(true)			
	        .gap(1)
	    .elasticY(true)
	
	        .x(d3.scale.linear().domain(domain))
	        .yAxis().ticks(4);
			
			
			
}


function rowChart(dimension, h, w, m,divName,ndx,fillColor){
   var div = d3.select("#"+divName)//.append("div").attr("id",divName)


	var filtersDiv = div.append("div").style("height","40px")
	filtersDiv.append("div").html(divName)
	filtersDiv.append("span").attr("class","filter").style("display","none")

	filtersDiv.append("a").attr("class","reset").html(" | reset ").style("display","none")
	.on("click",function(){
		chart.filterAll()
		dc.redrawAll()
	})
	var chart = dc.rowChart("#"+divName);
	

	var p = 15
	
	var group = dimension.group();
	var groupLength = group.top(100).length
		
	chart.width(w)
	    .height(groupLength*p+p*3)
	    .margins({top: p, left: m, right: p, bottom: p*2})
	    .group(group)
	    .dimension(dimension)
		.gap(1)
		.data(function(zipcodeGroup){return group.top(100)})
		.ordering(function(d){ return -d.value })
	    .ordinalColors([fillColor])
	    .label(function (d) {
	        return d.key;
	    })
		.labelOffsetX(-m+2)
		//.labelOffsetY(12)
	    .title(function (d) {
	        return d.value;
	    })
	    .elasticX(true)
	    .xAxis().ticks(4);
	
	
}



d3.selectAll("#version").text(dc.version);
