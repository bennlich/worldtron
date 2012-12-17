/* 
WorldTron Mapserver

This server simply returns OSM street data for a requested bounding box.
*/
var MAPSERVER_OPTIONS = {
	version: 0.1,
	port: 1337,
	host: '127.0.0.1'
}

var http = require('http');
http.createServer(function (req, res) {
  
  res.writeHead(200, {'Content-Type': 'text/plain'});

  var osmLoader = new OSMStreetLoader();
  osmLoader.readStreets(SF_BBOX, function(result) {
  	console.log("Result " + result);
   	res.end('OSM Result: ' + result);
  });
}).listen(MAPSERVER_OPTIONS.port, MAPSERVER_OPTIONS.host);

 
console.log("Started TRON mapserver."
	+ " Port : " + MAPSERVER_OPTIONS.port
	+ " Version: " + MAPSERVER_OPTIONS.version);


/* Helper functions. */
/* OpenStreetMap Interface */
var OSM_OPTIONS = {
  host: 'open.mapquestapi.com',
  port: 80,
  way_path: '/xapi/api/0.6/way',
  method: 'GET'
};
var SF_BBOX = {
	left: -122.431579,
	bottom: 37.755851,
	right: -122.417247,
	top: 37.760881	
}
var OSMStreetLoader = function() {
	
	console.log("Created OSM loader.");
	/*
	The main function for interfacing with OpenStreetMap.
	Call callback with OSM street data as XML for the given bounding box.
	Result: all ways tagged as highway=* with all their nodes.
	*/
	this.readStreets = function(bbox, callback) {
		var that = this;
		var options = {
			host: OSM_OPTIONS.host,
			port: OSM_OPTIONS.port,
			path: that.getHighwayPath(bbox),
			method: OSM_OPTIONS.method,
		}
		console.log("OSM request. Path: " + options.path);
		http.get(options, function(res) {
  			console.log("OSM response: " + res.statusCode);
  			var output = '';
	        res.setEncoding('utf8');
	        res.on('data', function (chunk) {
	            output += chunk;
	        });
	        res.on('end', function() {
	            //console.log("DATA: " + output);
	            var et = require('elementtree');
  				that.etree = et.parse(output);
  				var data = that.getWaysData();
  				//var s = etree.toString();		
  				callback.apply(this, [data]);
	        });
		}).on('error', function(e) {
  			console.log("OSM error: " + e.message);
		});
	}

	this.getHighwayPath = function(bbox) {
		return OSM_OPTIONS.way_path + "[highway=*]" + this.getBBoxAsString(bbox);
	}

	this.getBBoxAsString = function(bbox) {
		var bbox = "[bbox="
			+bbox.left + ","
			+bbox.bottom + ","
			+bbox.right + ","
			+bbox.top
			+"]";
		return bbox;
	}


}