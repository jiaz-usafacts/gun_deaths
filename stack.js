//# dc.js Getting Started and How-To Guide
'use strict';

var charts = {}
var dimensions = {}
var texts = {}
var filters = {}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


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
	
    row1.append("div").attr("id","Age")
	dimensions["Age"] = ndx.dimension(function(d){return parseInt(d['Single-Year Ages'])})
	
	
		barChart(120,800,20,"Age", ndx,[0,100])
			  
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
				drawStackedChart(ndx)
			});
			
			charts[divName]=chart			
}

//suicide
//police
//undetermined.

//assault, not at home, men
//assault, not at home, women
//assault, at home, men,
//assault, at home, women


//accidents

function drawStackedChart(ndx){
	 var data = dimensions["Age"].top(Infinity)
    
	var years = {}
	var mapped = {
		suicide:[],
		accidents:[],
		police:[],
		assault_home_f:[],
		assault_home_m:[],
		assault_out_f:[],
		assault_out_m:[],
		undetermined:[]
		
	}
	
	data.forEach(function(d){
		if(Object.keys(years).indexOf(d.Year)==-1){
			years[d.Year]=[]
			years[d.Year].push(d)
		}else{
			years[d.Year].push(d)
		}
	})

	var yearsCatCount = {}
	
	for(var y in years){
		console.log(y)
		var yearData = years[y]
		console.log(yearData)
		
		yearsCatCount[y]={}
		yearData.forEach(function(d){
			if(d["Cause of death"].indexOf("Intentional self-harm")>-1){
				if(Object.keys(yearsCatCount[y]).indexOf("suicide")==-1){
					yearsCatCount[y]["suicide"]=[]
					yearsCatCount[y]["suicide"].push(d)
				}else{
					yearsCatCount[y]["suicide"].push(d)
				}
			}else if(d["Cause of death"].indexOf("Legal intervention")>-1){
				if(Object.keys(yearsCatCount[y]).indexOf("police")==-1){
					yearsCatCount[y]["police"]=[]
					yearsCatCount[y]["police"].push(d)
				}else{
					yearsCatCount[y]["police"].push(d)
				}
			}else if(d["Cause of death"].indexOf("undetermined intent")>-1){
						
						buildDict("undetermined", yearsCatCount[y],d)
				
			}else if(d["Cause of death"].toLowerCase().indexOf("assault")>-1){
				if(d["Gender"]=="M"){
					if(d["Place of Death"]=="Decedent's home"){
						buildDict("assault_m_home", yearsCatCount[y],d)
					}else{
						buildDict("assault_m_notHome", yearsCatCount[y],d)
					}
				}else{
					if(d["Place of Death"]=="Decedent's home"){
						buildDict("assault_f_home", yearsCatCount[y],d)
						
					}else{
						buildDict("assault_f_notHome", yearsCatCount[y],d)
						
					}
				}
			}else{
				buildDict("unintentional", yearsCatCount[y],d)
			}
			
		})
	}
	
	
	console.log(years)
	console.log(yearsCatCount)
}

function buildDict(key, dict,data){
	if(Object.keys(dict).indexOf(key)==-1){
		dict[key]=[]
		dict[key].push(data)
	}else{
		dict[key].push(data)
	}
	return dict
}

d3.selectAll("#version").text(dc.version);
