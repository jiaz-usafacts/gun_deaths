//# dc.js Getting Started and How-To Guide
'use strict';

var charts = {}
var dimensions = {}
var texts = {}
var filters = {}
var totalDeaths

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

Promise.all([d3.csv("joined_years_legal_expanded.csv")])
.then(function(data){
	ready(data[0])
})
var allYearsByCat
function ready(data){
	//console.log(data)
	totalDeaths=data.length
	allYearsByCat = catData(data)
	var formattedYears = drawGroupData(data,"Year")
	drawStackedChart(formattedYears[0],formattedYears[1],formattedYears[2],"#chart1","2020",600,300,"Year")
    
	var formattedAges = drawGroupData(data,"Single-Year Ages")	
	drawStackedChart(formattedAges[0],formattedAges[1],formattedAges[2],"#chart2","20 years",1000,300,"Age")
	
};

//suicide
//police
//undetermined.

//assault, not at home, men
//assault, not at home, women
//assault, at home, men,
//assault, at home, women

//accidents

function drawGroupData(data,column){
	var groups = {}
	data.forEach(function(d){
		if(Object.keys(groups).indexOf(d[column])==-1){
			groups[d[column]]=[]
			groups[d[column]].push(d)
		}else{
			groups[d[column]].push(d)
		}
	})

	var groupCatCount = {}
	
	for(var y in groups){
		var groupData = groups[y]
		groupCatCount[y]=catData(groupData)
	}
	var formattedArray = []
	for(var z in groupCatCount){
		var entry = groupCatCount[z]
		entry["group"]=z
		formattedArray.push(entry)
	}
	 return [groups, groupCatCount,formattedArray]
}

function catData(data){
	var formatted = {}
	data.forEach(function(d){
		if(d["Cause of death"].toLowerCase().indexOf("intentional self-harm")>-1){
					buildDict("intentional_self-harm", formatted,d)
		}else if(d["Cause of death"].toLowerCase().indexOf("legal intervention")>-1){
					buildDict("legal_intervention", formatted,d)
		}else if(d["Cause of death"].toLowerCase().indexOf("undetermined intent")>-1){
					buildDict("undetermined_intent", formatted,d)
		}else if(d["Cause of death"].toLowerCase().toLowerCase().indexOf("assault")>-1){
			if(d["Gender"]=="M"){
				if(d["Place of Death"]=="Decedent's home"){
					buildDict("assault_male_at_home", formatted,d)
				}else{
					buildDict("assault_male_not_at_home", formatted,d)
				}
			}else{
				if(d["Place of Death"]=="Decedent's home"){
					buildDict("assault_female_at_home",formatted,d)
					
				}else{
					buildDict("assault_female_not_at_home", formatted,d)
					
				}
			}
		}else{
			buildDict("unintentional", formatted,d)
		}
	})
	return formatted
}

function drawYearData(data){
    
	var years = {}
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
		var yearData = years[y]
		yearsCatCount[y]=catData(yearData)
	}
	var formattedArray = []
	for(var z in yearsCatCount){
		var entry = yearsCatCount[z]
		entry["group"]=z
		formattedArray.push(entry)
	}
	 return [years, yearsCatCount,formattedArray]
 }
 
 
 
 function drawStackedChart(years,yearsCatCount,formattedArray,divName,groupKey,w,h,label){
   var subgroups = Object.keys(yearsCatCount[groupKey])
	
 	var groups = Object.keys(yearsCatCount)
	 
	 
	  var subgroups = ['intentional_self-harm','assault_male_not_at_home', 
	 'assault_male_at_home', 'assault_female_not_at_home','assault_female_at_home',
	   'legal_intervention','unintentional','undetermined_intent']

var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#000",
"#45b0cf",
"#46b6a3",
"#e1b342",
"#e5a638",
"#db76a8",
"#888",
"#aaa"])

 	var max =d3.max(Object.keys(years),function(d){
 		return years[d].length
 	})
	 
   var x = d3.scaleBand()
       .domain(groups)
       .range([0, w])
       .paddingInner([0.1])
  
	 var y = d3.scaleLinear()
	   .domain([0,max])
	   .range([h, 0]);
	   
var stackedData = d3.stack()
    .keys(subgroups)
    (formattedArray)
	   var p = 40
	   var svg = d3.select(divName).append("svg").attr("width",w+p*7).attr("height",h+p*2)
     svg.append("g")
       .call(d3.axisLeft(y))
       .attr("transform", "translate("+p+"," + p + ")")
	   
    svg.append("g")
       .attr("transform", "translate("+p+"," + (h+p) + ")")
       .call(d3.axisBottom(x)
       .tickFormat(function(d, i){ 
		   var years = parseInt(d.replace(" years",""))
		   if(years%5==0){
		   	return years
		   }
	   })
   	);
	   
	  var tooltip = d3.select("body")
	     .append("div")
	     .style("opacity", 0)
	     .attr("class", "tooltip")
	     .style("background-color", "white")
	     .style("border", "solid")
	     .style("border-width", "1px")
	     .style("padding", "10px")

svg.append("text").text(label).attr("x",w/2+p).attr("y",h+p+30).style("font-size","12px")
svg.append("text").text("Deaths").attr("x",p).attr("y",p-5).style("font-size","12px").attr("text-anchor","end")
svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
	   .attr("key",function(d){return d.key})
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("text")
	   .text(function(d,i){
		   if(d.data.group=="2020"){
			   var subGroup = d3.select(this.parentNode).datum().key
			  var subGroupCount = allYearsByCat[subGroup]
			   return "Total "+subGroup.split("_").join(" ")+": "+numberWithCommas(subGroupCount)+"("+Math.round(subGroupCount/totalDeaths*10000)/100+"%)"
		   }
	   })
	   .attr("x", function(d) { return x(d.data.group)-15; })
        .attr("y", function(d) { 
			if(isNaN(d[1])==false){
				var subGroupName= d3.select(this.parentNode).datum().key
				if(subGroupName=="undetermined_intent"){
					return y(d[1])-22
				}else if(subGroupName=="unintentional"){
					return y(d[1])-15
				}else if(subGroupName=="legal_intervention"){
					return y(d[1])-10
				}else if(subGroupName=="assault_female_at_home"){
					return y(d[1])-5
					
				}
				return y(d[1]); 
			}
		})
	   .style("font-size","11px")
       .attr("transform", "translate("+p*2+"," + (p+15) + ")")
	   
svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.group); })
        .attr("y", function(d) { 
			if(isNaN(d[1])==false){
			return y(d[1]); }
		})
        .attr("height", function(d) { 
			if(isNaN(d[1])==false){
				if(y(d[0]) - y(d[1])<2){
					return 2
				}
				return y(d[0]) - y(d[1]); 
			}
		})
        .attr("width",x.bandwidth())
	   .attr("stroke","#fff")
	   .attr("cursor","pointer")
       .attr("transform", "translate("+p+"," + p + ")")
		.on("mouseover", function(e,d){
			var group = d.data.group
			var groupValue = years[group].length
			var subgroupName = d3.select(this.parentNode).datum().key
   	     	var subgroupValue = d.data[subgroupName];
			var percentValue = Math.round(subgroupValue/groupValue*10000)/100
			
	     tooltip
	         .html("<strong>" + subgroupName.split("_").join(" ") + "</strong><br>" 
				+ numberWithCommas(subgroupValue)+" Deaths<br>"
				+ percentValue+"% of all Deaths for "+group.replace(" years"," year olds"))
	         	.style("opacity", 1)
		})      //
       .on("mousemove", function(e,d){
		   var x = event.clientX+20;     // Get the horizontal coordinate
		   var y = event.clientY; 
		   
		   tooltip
      .style("left", x + "px") 
      .style("top", y + "px")
       })
       .on("mouseleave", function(e,d){tooltip.style("opacity", 0) })
}

function buildDict(key, dict,data){
	if(Object.keys(dict).indexOf(key)==-1){
		dict[key]=0
		dict[key]+=1
	}else{
		dict[key]+=1
	}
	return dict
}

