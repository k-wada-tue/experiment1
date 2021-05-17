// Capturing XY positions for tooltips
let xLocation;
let yLocation;

// loader while map layers are rendering
let loader;

// Variables for the data classification
let interval0;
let interval1;
let interval2;
let interval3;
let interval4;
let interval5;
let interval6;

// Selected dataset array
let dataArray;

// Basemap data either 'buurt' or 'stadsdeel' *default is buurt
let baseStatus = 'buurt';

// Default base attribute on basemap data
const basedataDefault = 'm_exercise';

// Selected attribute in the basemap data
let selectedAttribute; //'healthy','m_drinker', 'smoker', 'overweight', 'illness', 'physical_p', 'depression', or 'loneliness'

// Basemap JSON data
let baseJson;


// Map initialization status
let mapInitialize; //If map was rendered for the first time (true/false)

// Object in vizmap function contains all functions of rendering map layers
let mapLayers;

// Variables to store geojson data
let geojson_bb; //basemap buurt
let geojson_bs; //basemap stadsdeel

// SVG map layers
let basebuurt_svg;
let basestadsdeel_svg;

//function to change attribute, color filling and legend on the base maps
let changeAttr;

//function to change between buurten and stadsdelen
let changeBasemap;

//bindData functions for basemap buurt and stadsdeel;
let bindDataBB;
let bindDataBS;

// mouse x y position
document.addEventListener('mousemove', (e) => {
  //e = e || window.event;
	xLocation = e.clientX;
	yLocation = e.clientY;
  // console.log(xLocation);
  // console.log(yLocation);
});

// Common directory for json files
const dataPath = '/assets/data/';
const basebuurt_path = dataPath + 'edh_buurt_base.json';
const basestadsdeel_path = dataPath + 'edh_stadsdeel_base.json';

//Fetch base buurten data
const apiReq_buurt = fetch(basebuurt_path).then((response)=> {
  return response.json();
});

//Fetch base stadsdelen data
const apiReq_stadsdeel = fetch(basestadsdeel_path).then((response)=> {
  return response.json();
});


//Common function (promise) to read selected basemap data value in advance

// Promise (Step1): array creation of buurt data
const pushArray = (attribute, whichbase)=> {
  return new Promise((resolve, reject) => {
    // baseStatus = whichbase;
    //console.log('selected basemap is ' + baseStatus);
    //console.log('called basemap is ' + whichbase);
    selectedAttribute = whichbase;
    //console.log(selectedAttribute);
    if (selectedAttribute == 'buurt') {
      //console.log('go for buurt');
      apiReq_buurt.then((data)=> {
        baseJson = data;
        dataArray = []; //Clear dataArray
        checkAttribute();
      });
    } else if (selectedAttribute == 'stadsdeel') {
      //console.log('go for stadsdeel');
      apiReq_stadsdeel.then((data)=> {
        baseJson = data;
        dataArray = []; //Clear dataArray
        checkAttribute();
      });
    }

    //In case the dataArray is excuted before geeting attribute value
    function checkAttribute() {
      //console.log('checking attribute...');
      //console.log(attribute);
      if(attribute != 'undefined') {
        //console.log('move forward');
        selectedAttribute = attribute;
        //console.log(selectedAttribute);
        createArray();
      } else {
        window.setTimeout(checkAttribute, 500); /* repeat (wait) until data is loaded */
      }
    }

    function createArray() {
      //console.log('creating array...');
      let dataLength = baseJson.features.length;
      for (let i = 0; i < dataLength; i++) {
        dataArray.push(baseJson.features[i].properties[selectedAttribute]);
      }
      //console.log(dataArray);
    }
    resolve();
  })
}

// Promise (Step2): Calculation of values for map color fill and legend
const legendCalc = (p) => {
  return new Promise((resolve, reject) => {
    // console.log("legend calc");
    let filteredLegend = dataArray.filter(function (rm) {
      return rm != null;
    });

    const aryMax = function (a, b) {return Math.max(a, b);}
    const aryMin = function (a, b) {return Math.min(a, b);}
    let max = filteredLegend.reduce(aryMax); // => 10
    let min = filteredLegend.reduce(aryMin); // => 1

    // console.log(max);
    // console.log(min);

    let division = Math.round((max - min)/4);
    //console.log(division);

    interval0 = min;
    interval1 = (min + division) - 1;
    interval2 = min + division;
    interval3 = (min + division*2) - 1;
    interval4 = min + division*2;
    interval5 = (min + division*3) - 1;
    interval6 = min + division*3;

    // console.log(interval0);
    // console.log(interval1);
    // console.log(interval2);
    // console.log(interval3);
    // console.log(interval4);
    // console.log(interval5);
    // console.log(interval6);

    resolve();
  })
};

// Promise (Step3): filling colors on the map are different with buurt and stadsdeel basemap and written inside of the d3 code

// Promise (Step4): create legend
const createLegend = (p) => {
  return new Promise((resolve, reject) => {

    let legend4a = document.getElementById('legend4a-txt');
    let legend3a = document.getElementById('legend3a-txt');
    let legend3b = document.getElementById('legend3b-txt');
    let legend2a = document.getElementById('legend2a-txt');
    let legend2b = document.getElementById('legend2b-txt');
    let legend1a = document.getElementById('legend1a-txt');
    let legend1b = document.getElementById('legend1b-txt');

    let legendTitle = document.getElementById('legendTitle');

    legend4a.innerText = interval6;
    legend3a.innerText = interval4;
    legend3b.innerText = interval5;
    legend2a.innerText = interval2;
    legend2b.innerText = interval3;
    legend1a.innerText = interval0;
    legend1b.innerText = interval1;

    if (selectedAttribute == 'm_exercise') {
      legendTitle.innerText = 'Moderate Exercise';
    } else if (selectedAttribute == 'healthy') {
      legendTitle.innerText = 'Healthy';
    } else if (selectedAttribute == 'm_drinker') {
      legendTitle.innerText = 'Drinker';
    } else if (selectedAttribute == 'smoker') {
      legendTitle.innerText = 'Smorker';
    } else if (selectedAttribute == 'overweight') {
      legendTitle.innerText = 'Overweight';
    } else if (selectedAttribute == 'illness') {
      legendTitle.innerText = 'Illness';
    } else if (selectedAttribute == 'physical_p') {
      legendTitle.innerText = 'Physical Unavailability';
    } else if (selectedAttribute == 'depression') {
      legendTitle.innerText = 'Depression';
    } else if (selectedAttribute == 'loneliness') {
      legendTitle.innerText = 'Loneliness';
    }

    resolve(p);
  })
};

// PromiseError handling
const onRejectted = (p)=>{
  console.log("Promise Error",p);
}


// Map visualization function
const vizmaps = ()=> {

  let map = new L.Map('map-container', {scrollWheelZoom: false}).setView([51.45, 5.450], 12); //*Leaflet uses lat long / original set:[51.4400, 5.4750]

  // Set basemap layers with ESRI Leaflet
  const basegray = L.esri.basemapLayer('Gray');
  const basestreet = L.esri.basemapLayer('Streets');
  const baseimagery = L.esri.basemapLayer('Imagery');

  // Basemap layers
  const baseLayers = {
    'Gray': basegray,
    'Street': basestreet,
    'Satellite': baseimagery
  }

  L.esri.basemapLayer('Gray').addTo(map); //default basemap
  L.control.layers(baseLayers).addTo(map); //basemap options

  mapLayers = {

    // Basemap Neighborhoods
    basemap_buurt: function basemap_buurt() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_bb = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'basemap-buurt');
		  let g_bb = svg_bb.append('g').attr('class', 'leaflet-zoom-hide');

      basebuurt_svg = document.getElementById('basemap-buurt');

      d3.json(basebuurt_path).then(function(geojson) {
        geojson_bb = geojson;
        let feature_bb = g_bb.selectAll('path')
                              .data(geojson_bb.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_bb),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_bb.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px');

            g_bb.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            // Promise (Step3): Fill colors on the map
          const fillColorsBB = (p) => {
            return new Promise((resolve, reject) => {

              feature_bb.attr('d', path)
                .style('stroke', 'rgb(187,187,187)') //#bbbbbb
                .style('stroke-width', '1px')
                .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
                .style('cursor', 'pointer')
                .style('fill', (d)=> {
                  if (d.properties[selectedAttribute] >= interval6) {
                      return 'rgb(204,76,2)';
                  } else if (d.properties[selectedAttribute] >= interval4 & d.properties[selectedAttribute] < interval6) {
                      return 'rgb(254,153,41)';
                  } else if (d.properties[selectedAttribute] >= interval2 & d.properties[selectedAttribute] < interval4) {
                      return 'rgb(254,217,142)';
                  } else if (d.properties[selectedAttribute] >= interval0 & d.properties[selectedAttribute] < interval2) {
                      return 'rgb(255,255,212)';
                  } else {
                    return 'rgb(212,212,212)'; //#d4d4d4;
                  }
                })
                .style('opacity', '0')
                .transition()
                .duration(500)
                .style('opacity', '0.7');

                feature_bb.attr('d', path).on("mouseover", handleMouseOver)
                  .on("mouseout", handleMouseOut);

                resolve(p);
            })
          };

          bindDataBB = function(attr, whichbase) {
            // console.log(attr);
            // console.log(whichbase);
            Promise.resolve()
            .then(pushArray.bind(this, attr, whichbase))
            //depression, disease, h_drinker, healthy, illness, lonliness, m_drinker, m_exercise, neighbor, overweight, physical_p, smoker, : 61
            .then(legendCalc)
            .then(fillColorsBB)
            .then(createLegend)
            .catch(onRejectted);
          }

          //console.log(mapInitialize);
          //if (mapInitialize == true) {
          bindDataBB(basedataDefault, 'buurt');
          //}


          const tooltipContainer = document.getElementById('basemap-tooltip');
          const tooltipPlace = document.getElementById('basemap-tooltip-place');
          const tooltipValue = document.getElementById('basemap-tooltip-value');

          function handleMouseOver(d, i) {
            console.log('mouseover');
            console.log(d);
            console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 0.4)
              .duration(200);

              tooltipPlace.innerText = i.properties.neighbor;
              tooltipContainer.setAttribute('aria-hidden','false');
              tooltipContainer.style.left = xLocation + "px";
              tooltipContainer.style.top = yLocation + "px";

              if (i.properties[selectedAttribute] !== null) {
                tooltipValue.innerText = i.properties[selectedAttribute] + ' %';
              } else {
                tooltipValue.innerText = 'No Data';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainer.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })//d3.json
    },//bb

    // Basemap Districts
    basemap_stadsdeel: function basemap_stadsdeel() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_bs = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'basemap-stadsdeel').attr('class', 'mapLayers');
		  let g_bs = svg_bs.append('g').attr('class', 'leaflet-zoom-hide');

      basestadsdeel_svg = document.getElementById('basemap-stadsdeel');

      if (mapInitialize == true) {
        basestadsdeel_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(basestadsdeel_path).then(function(geojson) {
        geojson_bs = geojson;
        let feature_bs = g_bs.selectAll('path')
                              .data(geojson_bs.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_bs),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_bs.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px');

            g_bs.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            const fillColorsBS = (p) => {
              return new Promise((resolve, reject) => {

                feature_bs.attr('d', path)
                  .style('stroke', 'rgb(187,187,187)') //#bbbbbb
                  .style('stroke-width', '1px')
                  .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
                  .style('cursor', 'pointer')
                  .style('fill', (d)=> {
                    if (d.properties[selectedAttribute] >= interval6) {
                        return 'rgb(204,76,2)';
                    } else if (d.properties[selectedAttribute] >= interval4 & d.properties[selectedAttribute] < interval6) {
                        return 'rgb(254,153,41)';
                    } else if (d.properties[selectedAttribute] >= interval2 & d.properties[selectedAttribute] < interval4) {
                        return 'rgb(254,217,142)';
                    } else if (d.properties[selectedAttribute] >= interval0 & d.properties[selectedAttribute] < interval2) {
                        return 'rgb(255,255,212)';
                    } else {
                      return 'rgb(212,212,212)'; //#d4d4d4;
                    }
                  })
                  .style('opacity', '0')
                  .transition()
                  .duration(500)
                  .style('opacity', '0.7');

                  feature_bs.attr('d', path).on("mouseover", handleMouseOver)
                    .on("mouseout", handleMouseOut);

                  resolve(p);
                })
            };

            bindDataBS = function (attr, whichbase) {
              // console.log(attr);
              // console.log(whichbase);
              Promise.resolve()
              .then(pushArray.bind(this, attr, whichbase))
              //depression, disease, h_drinker, healthy, illness, lonliness, m_drinker, m_exercise, neighbor, overweight, physical_p, smoker, : 61
              .then(legendCalc)
              .then(fillColorsBS)
              .then(createLegend)
              .catch(onRejectted);
            }

          // if (mapInitialize == false) {
          //   bindDataBS(basedataDefault, 'stadsdeel');
          // }

          const tooltipContainer = document.getElementById('basemap-tooltip');
          const tooltipPlace = document.getElementById('basemap-tooltip-place');
          const tooltipValue = document.getElementById('basemap-tooltip-value');

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 0.4)
              .duration(200);


              tooltipPlace.innerText = i.properties.district;
              tooltipContainer.setAttribute('aria-hidden','false');
              tooltipContainer.style.left = xLocation + "px";
              tooltipContainer.style.top = yLocation + "px";

              if (i.properties[selectedAttribute] !== null) {
                tooltipValue.innerText = i.properties[selectedAttribute] + ' %';
              } else {
                tooltipValue.innerText = 'No Data';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainer.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }//bs

  } //mapLayers

  // Render all maplayers first
  //TODO: See if the map layers can be rendered in background process (Web Worker?)
  if (mapInitialize == true) {
    mapLayers.basemap_buurt();
    mapLayers.basemap_stadsdeel();
  }

  changeBasemap = function changeBasemap(value){
    baseStatus = value;
    //console.log(value);
    if (value == 'stadsdeel'){
      basebuurt_svg.setAttribute('aria-hidden', 'true');
      basestadsdeel_svg.setAttribute('aria-hidden', 'false');
      bindDataBS(selectedAttribute, 'stadsdeel');
    } else if (value == 'buurt') {
      basebuurt_svg.setAttribute('aria-hidden', 'false');
      basestadsdeel_svg.setAttribute('aria-hidden', 'true');
      bindDataBB(selectedAttribute, 'buurt');
    }
  }

  changeAttr = function (newAttr) {
    //console.log('attr changed');
    //console.log(newAttr);
    //console.log(baseStatus);
    selectedAttribute = newAttr;
    if (baseStatus == 'buurt') {
      bindDataBB(newAttr, baseStatus);
    } else if (baseStatus == 'stadsdeel') {
      bindDataBS(newAttr, baseStatus);
    }

  };

};

function initializeMap() {
  //console.log('map is initialized');
  mapInitialize = true;
  //console.log(mapInitialize);
  baseStatus = 'buurt';
  vizmaps();
}

