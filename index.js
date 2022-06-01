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

var charts = {}
var dimensions = {}
var texts = {}
var filters = {}

function checkAllFilters(){
	var filters = []
	for(var i in charts){
		if (charts[i].hasFilter()==true){
			//console.log(i)
			filters.push({chart:i,filter:charts[i].filters()})
		}
	}
	return filters
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function drawSvg(){
	//https://stackoverflow.com/questions/22392134/is-there-a-way-to-attach-callback-what-fires-whenever-a-crossfilter-dimension-fi
//console.log(count)
	//d3.selectAll("#box svg").remove()
	var allDeaths = dimensions["Cause"].top(Infinity).length
	var boxSide = Math.sqrt(allDeaths)
	//console.log(boxSide)
	var w = 1200
	var h =  Math.floor(736952/w)
	
	var xScale = d3.scale.linear().domain([0,boxSide]).range([0,w])
	 var svg = d3.select("#box").append("svg")
	 .attr("width",w)
	.attr("height",h)
	.attr("fill","none")
	.attr("stroke","black")
	.attr("stroke-width",2)
	svg.append("rect").attr("x",0).attr("y",0).attr("height",h).attr("width",w)
	
	svg.append("rect")
	.attr("id","boxRect")
	.attr("x",0).attr("y",h).attr("height",0).attr("width",w)
	.attr("fill","magenta").attr("opacity",.5)
	.attr("stroke","none")
	
}

function drawBox(count){
	var w = 1200
	var h =  Math.floor(736952/w)
	
	//console.log(count)
	if(count==0){
		return
	}
	//console.log(count)
	var bw= w//Math.floor(count/h)
	var bh = Math.floor(count/w)
	var bwRemainder = count%h
	var svg = d3.select("#box svg")
	//console.log(bw, bh, bwRemainder)
	d3.select("#boxRect").transition()
	.duration(1000)
	.attr("x",0).attr("y",h-bh).attr("height",bh).attr("width",bw)
	.attr("fill","magenta").attr("opacity",.5)
	.attr("stroke","none")
}

var promptText = d3.select("#buttons").append("div").attr("id","promptText")
var moreText = d3.select("#buttons").append("div").attr("id","moreText")


promptText.append("div").html("Intentional self-harm account for ...")
.attr("class","prompt")
.on("click",function(){
	//console.log(charts)
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Cause"].top(Infinity).length
	charts["Cause"].filter(["self-harm"])
	//charts["Cause"].ordinalColors(["magenta"])
	
	var deaths = dimensions["Cause"].top(Infinity).length
	drawBox(deaths)
	
	charts["Race"].filter(["White"])
	//charts["Race"].ordinalColors(["magenta"])
	var deathsRace = dimensions["Race"].top(Infinity).length
	
	charts["Gender"].filter(["Male"])
	//charts["Gender"].ordinalColors(["magenta"])
	var deathsRaceMale = dimensions["Gender"].top(Infinity).length
	
	moreText.html(numberWithCommas(deaths)+" or "+Math.round(deaths/allDeaths*100)+"% of all deaths. <br>"
	+numberWithCommas(deathsRace)+" or "+ Math.round(deathsRace/deaths*100)+"% are white, <br>and "
	+numberWithCommas(deathsRaceMale)+" or "+Math.round(deathsRaceMale/deaths*100)+"% of those are male."
	)
	
//	d3.select("#selfharm").html()
	//.filter(dc.filters.RangedFilter(15,20));
    dc.renderAll();
})

promptText.append("div").html("Legal interventions account for ...")
.attr("class","prompt")
.on("click",function(){
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Cause"].top(Infinity).length
	charts["Cause"].filter(["legal intervention(Police)"])
	var deaths = dimensions["Cause"].top(Infinity).length
	drawBox(deaths)
    dc.renderAll();
	moreText.html(numberWithCommas(deaths)+" deaths, or "+Math.round(deaths/allDeaths*10000)/100+"% of all deaths.")
})

promptText.append("div").html("Female victims are ...")
.attr("class","prompt")
.on("click",function(){
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Gender"].top(Infinity).length
	charts["Gender"].filter(["Female"])
	var deaths = dimensions["Gender"].top(Infinity).length
	drawBox(deaths)
    dc.renderAll();
	moreText.html(numberWithCommas(deaths)+" deaths, or "+Math.round(deaths/allDeaths*10000)/100+"% of all deaths.")
})

promptText.append("div").html("Older victims (age 80+) are ...")
.attr("class","prompt")
.on("click",function(){
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Gender"].top(Infinity).length
	charts["Age"].filter(dc.filters.RangedFilter(80,100))
	var deaths = dimensions["Age"].top(Infinity).length
	drawBox(deaths)
	
	charts["Cause"].filter(["self-harm"])
	var deathCause = dimensions["Cause"].top(Infinity).length
    dc.renderAll();
	moreText.html(numberWithCommas(deaths)+" deaths, or "+Math.round(deaths/allDeaths*10000)/100+"% of all deaths."
		+" "+Math.round(deathCause/deaths*10000)/100+"% of which are intentional self-harm. ")
})

promptText.append("div").html("Handguns are ...")
.attr("class","prompt")
.on("click",function(){
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Weapon"].top(Infinity).length
	charts["Weapon"].filter(["Handgun"])
	var deaths = dimensions["Weapon"].top(Infinity).length
	drawBox(deaths)
	
	charts["Cause"].filter(["self-harm"])
	var deathCause = dimensions["Cause"].top(Infinity).length
	
    dc.renderAll();
	
	moreText.html(numberWithCommas(deaths)+" deaths, or "+Math.round(deaths/allDeaths*10000)/100+"% of all deaths."
		+" "+Math.round(deathCause/deaths*10000)/100+"% of which are self-harm.")
	
})

promptText.append("div").html("Rifles, shotguns, and larger firearms are ...")
.attr("class","prompt")
.on("click",function(){
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Weapon"].top(Infinity).length
	charts["Weapon"].filter(["Rifle, shotgun and larger firearm"])
	var deaths = dimensions["Weapon"].top(Infinity).length
	drawBox(deaths)
	
	charts["Cause"].filter(["self-harm"])
	var deathCause = dimensions["Cause"].top(Infinity).length
	
    dc.renderAll();
	
	moreText.html(numberWithCommas(deaths)+" deaths, or "+Math.round(deaths/allDeaths*10000)/100+"% of all deaths."
		+" "+Math.round(deathCause/deaths*10000)/100+"% of which are self-harm.")
})

promptText.append("div").html("Very young victims (age 10-) are ...")
.attr("class","prompt")
.on("click",function(){
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Gender"].top(Infinity).length
	charts["Age"].filter(dc.filters.RangedFilter(0,10))
	var deaths = dimensions["Age"].top(Infinity).length
	drawBox(deaths)
	
	charts["Cause"].filter(["unintentional"])
	var deathCause = dimensions["Cause"].top(Infinity).length
	
    dc.renderAll();
	
	moreText.html(numberWithCommas(deaths)+" deaths, or "+Math.round(deaths/allDeaths*10000)/100+"% of all deaths."
		+" "+Math.round(deathCause/deaths*10000)/100+"% of which are unintentional.")
	
	
})

promptText.append("div").html("Unintentional deaths are ...")
.attr("class","prompt")
.on("click",function(){
	d3.selectAll(".prompt").style("color",color)
	d3.select(this).style("color",highlightColor)
	dc.filterAll();
	var allDeaths = dimensions["Weapon"].top(Infinity).length
	charts["Cause"].filter(["unintentional"])
	var deaths = dimensions["Cause"].top(Infinity).length
	drawBox(deaths)
	
	charts["Age"].filter(dc.filters.RangedFilter(0,10))
	var deathCause = dimensions["Age"].top(Infinity).length
	
    dc.renderAll();
	
	moreText.html(deaths+" deaths, or "+Math.round(deaths/allDeaths*10000)/100+"% of all deaths."
		+" "+Math.round(deathCause/deaths*10000)/100+"% of which are victims under 10.")
})


d3.selectAll(".prompt")
.on("mouseover",function(){d3.select(this).style("text-decoration","underline")})
.on("mouseout",function(){d3.select(this).style("text-decoration","none")})


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
var dimension
var color = "#000"

var highlightColor = "magenta"

queue()
//.defer(d3.csv, "joined_expanded.csv")
.defer(d3.csv, "joined_years_legal_expanded.csv")
.await(ready);
function ready(error, data){
	//console.log(data)

    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

//console.log(ndx)
//Year,Single-Year Ages,Place of Death,Race,Cause of death,Deaths,Gender
	
	var row1 = d3.select("#charts").append("div").attr("class","row")	
	var row2 = d3.select("#charts").append("div").attr("class","row")
	
    row1.append("div").attr("id","Age")
	row1.append("div").attr("id","Year")
	
	row2.append("div").attr("id","Cause")
    row2.append("div").attr("id","Weapon")
	
	
    row2.append("div").attr("id","Race")
    row2.append("div").attr("id","Gender")
    row2.append("div").attr("id","Place")
	
	
	
	dimensions["Race"] = ndx.dimension(function(d){return d["Race"]})
   	 	//
	dimensions["Gender"] = ndx.dimension(function(d){
		var genderDict = {F:"Female",M:"Male"}
		return genderDict[d["Gender"]]
	})
	//
	dimensions["Age"] = ndx.dimension(function(d){return parseInt(d['Single-Year Ages'])})
	
	dimensions["Year"] = ndx.dimension(function(d){return parseInt(d['Year'])})
	
	
	
	 dimensions["Cause"] = ndx.dimension(function(d){
	 	var cause = d["Cause of death"]
	 	if(cause.indexOf("Assault")>-1){
	 		return "assault"
	 	}else if(cause.indexOf("Intentional self-harm")>-1){
	 		return "self-harm"
	 	}else if(cause.indexOf("undetermined intent")>-1){
	 		return "undetermined"
	 	}else if(cause =="Legal intervention involving firearm discharge"){
	 		return "legal intervention(Police)"
	 	}else{
	 		return "unintentional"
	 	}
	 })
	
	 dimensions["Weapon"] = ndx.dimension(function(d){
	 	var cause = d["Cause of death"].toLowerCase()
	 	if(cause.indexOf("handgun")>-1){
	 		return "Handgun"
	 	}else if(cause.indexOf("rifle, shotgun and larger firearm discharge")>-1){
	 		return "Rifle, shotgun and larger firearm"
	 	}else if(cause.indexOf("other and unspecified firearm")>-1){
	 		return "Other and unspecified firearm"
	 	}
	 })
	
	// 	//	 //
	//  // var causeGroup = ndx.dimension(function(d){return d["Cause of death"]})
	//  //  	  rowChart(causeGroup, 100, 600, 180,"chart3",ndx)
	//
	//
	//
	 dimensions["Place"]= ndx.dimension(function(d){return d["Place of Death"]})

	
		barChart(120,800,20,"Age", ndx,[0,100])
		//barChart(120,240,20,"Year", ndx,[1999,2020])
	 
	var w = 120

	 	rowChart(400, w+140, 140,"Cause",ndx,color)
		rowChart(100, w+180, 180,"Weapon",ndx,color)
		rowChart(100,w+190,190,"Race",ndx,color)
		rowChart(100,w+60,60,"Gender",ndx,color)
		rowChart(100, w+190, 190,"Place",ndx,color)

	      dc.dataCount(".dc-data-count")
	          .dimension(ndx)
	          .group(all)
	          .html({
	              some:"%filter-count selected out of <strong>%total-count</strong> gun deaths | <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset All</a>",
	              all:"All %total-count gun deaths 1999 - 2020"
	          })

	 drawSvg()
	drawBox(0)
			  
    dc.renderAll();
};

function barChart(h, w, m, divName, ndx,domain){
	var dimension = dimensions[divName]
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
	var bw = 8
	var w = bw*(domain[1]-domain[0])+bw*6
	
	chart.width(w)
	        .height(h)
	        .margins({top: 0, right: bw*2, bottom: 60, left: bw*4})
	        .ordinalColors([color])
	        .dimension(dimension)
	        .group(group)
	        //.centerBar(true)			
	        .gap(1)
	    	.elasticY(true)
	        .x(d3.scale.linear().domain(domain))
	        .yAxis().ticks(4);
			
		    chart.on('filtered', function() {
				filters[divName]={filter:charts[divName].filters(), len:dimensions[divName].top(Infinity).length}
			});
			
	charts[divName]=chart
			
}


function rowChart(h, w, m,divName,ndx,fillColor){
	var dimension = dimensions[divName]
   
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
	

	var p = 10
	
	var group = dimension.group();
	var groupLength = group.top(100).length
		
	chart.width(w)
	    .height(groupLength*p+p*3)
	    .margins({top: p, left: m, right: p, bottom: p*2})
	    .group(group)
	    .dimension(dimension)
		.gap(1)
		.data(function(zipcodeGroup){return group.top(Infinity)})
		.ordering(function(d){
	 			//console.log(d)
	 		if(divName=="Year"){
	 			return d.key
	 		}
	 	//	console.log(d)
	 		return d.value
	 	})
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
	
		    chart.on('filtered', function() {
				filters[divName]=charts[divName].filters()
			});
		
	charts[divName]=chart
}



d3.selectAll("#version").text(dc.version);
