'use strict';

console.log("hello world!");

// const checkFunction = () => {
//   //return "Hello World!";
//   console.log("function excuted!");
// }

//checkFunction();

function checkFunction() {
  console.log('worked');
}

//console.log(name);

const dataPath = '/assets/data/';

let vizmaps = ()=> {

  let map = new L.Map('map-container', {scrollWheelZoom: false}).setView([51.45, 5.450], 12); //*Leaflet uses lat long / original set:[51.4400, 5.4750]

  // Set basemap layers with ESRI Leaflet
  const basegray = L.esri.basemapLayer('Gray');
  const basestreet = L.esri.basemapLayer('Streets');
  const baseimagery = L.esri.basemapLayer('Imagery');

  const baseLayers = {
    'Gray': basegray,
    'Street': basestreet,
    'Satellite': baseimagery
  }

  L.esri.basemapLayer('Gray').addTo(map); //default basemap
  L.control.layers(baseLayers).addTo(map); //basemap options

  //function mapLayers(loader) {

    // Common setting for all map layers
    // Adjust coordinate system to Leaflet
		let projectPoint = function projectPoint(x, y) {
			let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		  /*jshint validthis: true */
		  this.stream.point(point.x, point.y);
		};

		//Transform positions
		let transform = d3.geoTransform({point: projectPoint}),
		path = d3.geoPath().projection(transform);

		let svg = d3.select(map.getPanes().overlayPane).append("svg"),
		g = svg.append("g").attr("class", "leaflet-zoom-hide");


        // geojson_mp1 = geojson;
      //   svg_mp1.attr('id', 'mp1-overlay');
      //   let feature_mp1 = g_mp1.selectAll('path')
		  //       	   .data(geojson_mp1.features)
		  //       	   .enter()
		  //       	   .append('path');

      // map.on('moveend', reset);
		  // reset();

      // function reset() {
      //   let bounds = path.bounds(geojson_mp1),
		  //       topLeft = bounds[0],
		  //       bottomRight = bounds[1];

      //   svg_mp1.attr('width', bottomRight[0] - topLeft[0])
      //           .attr('height', bottomRight[1] - topLeft[1])
      //           .style('left', topLeft[0] + 'px')
      //           .style('top', topLeft[1] + 'px');

      //   g_mp1.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

      //   feature_mp1.attr('d', path)
		  //              .style('stroke', 'rgb(187,187,187)') //#bbbbbb
		  //              .style('stroke-width', '1px')
		  //              .style('fill', (d)=> {
		  //              		if (d.properties.sports >= 70 & d.properties.sports < 80) {
		  //                       return 'rgb(215,48,31)';
		  //                   } else if (d.properties.sports >= 60 & d.properties.sports < 70) {
		  //                       return 'rgb(252,141,89)';
		  //            		} else if (d.properties.sports >= 50 & d.properties.sports < 60) {
		  //                       return 'rgb(253,204,138)';
		  //                   } else if (d.properties.sports >= 40 & d.properties.sports < 50) {
		  //                       return 'rgb(254,240,217)';
		  //                   } else {
		  //                       return 'rgb(212,212,212)'; //#d4d4d4;
		  //                   }
		  //               })
		  //             	.attr('class', 'pointer-release') // Release leaflet's css pointer-event:none
		  //             	.style('cursor', 'pointer');

      //   }
      //  create a d3.geo.path to convert GeoJSON to SVG
		// var transform = d3.geo.transform({point: projectPoint}),
    // path = d3.geo.path().projection(transform);



    //}//function mapLayers
    //mapLayers();

    // Basemap Buurt
    const basemap_buurt = dataPath + 'edh_buurt_base.json';
    //console.log(basemap_buurt);

    d3.json(basemap_buurt).then(function(geojson){
      console.log('excuted');

      // create path elements for each of the features
      let d3_features = g.selectAll("path")
        .data(geojson.features)
        .enter().append("path");

      map.on("viewreset", reset);

      reset();

      // fit the SVG element to leaflet's map layer
      function reset() {

        let bounds = path.bounds(geojson);

        var topLeft = bounds[0],
          bottomRight = bounds[1];

        svg.attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

        g .attr("transform", "translate(" + -topLeft[0] + ","
                                          + -topLeft[1] + ")");

        // initialize the path data
        d3_features.attr("d", path)
          .style("fill-opacity", 0.7)
          .attr('fill','blue');
      }

      // Use Leaflet to implement a D3 geometric transformation.
      // function projectPoint(x, y) {
      //   var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      //   this.stream.point(point.x, point.y);
      // }

    })
};

// Render map when DOM is loaded
document.addEventListener('DOMContentLoaded', ()=> {
  vizmaps();
}, false);
