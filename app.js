var express = require('express');
//var dateFormat = require('./node_modules/dateformat');
var dateFormat = require('dateformat');
var app = express();
var http = require('http');
//var SPM = require('./node_modules/spm-metrics-js');
var SPM = require('spm-metrics-js');
var spmClient = new SPM(process.env.SPM_TOKEN,20000)

var currentValueMetric = spmClient.getCustomMetric({
	name: 'CurrentValueMetric',
	aggregation: 'avg'
});

var counter = 0;
var interval = setInterval(function getJSON()
{
	console.log("rest:getJSON");
	var timeC = new Date();
	timeC.setDate(timeC.getDate()-1);
	timeC.setHours(timeC.getHours() + 15);
	var currentTime = dateFormat(timeC,"dd mmmm, h:MM TT");
	console.log('http://stock-bhupkas.rhcloud.com/stock?stockName=VOLTAS&timeStamp='+currentTime+' IST');
	var req = http.get('http://stock-bhupkas.rhcloud.com/stock?stockName=VOLTAS&timeStamp='+currentTime+' IST',function(res)
	{
		var output = '';
		res.on('data',function(chunk){
			output += chunk;
		});
		
		res.on('end',function(){
			var obj = JSON.parse(output);
			details = obj.details;
			console.log(details);
			if(details != null){
				currentValue = details.currentVal;
				currentValueMetric.set(currentValue);
				spmClient.send();
				console.log(details);
				console.log(currentValue);
			}else{
				counter += 1;
			}
			if(counter == 5){
				counter = 0;
				clearInterval(interval);
			}
		});
	});
	req.on('error',function(err){
		console.log("got error",err.message);
	});

},6000);
//setInterval(getJSON(),1000)
