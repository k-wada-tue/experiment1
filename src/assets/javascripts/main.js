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
let geojson_sf; //overlay sports facilities
let geojson_mf; //overlay medical facilities
let geojson_cc; //overlay community centers
let geojson_ss; //overlay sports shops
let geojson_gs; //overlay groceries
let geojson_ff; //overlay fast food
let geojson_br; //overlay bike routes
let geojson_pp; //overlay pp
let geojson_ga; //overlay pp
let geojson_aq;
let geojson_cm;

// SVG map layers
let basebuurt_svg;
let basestadsdeel_svg;

//function to change attribute, color filling and legend on the base maps
let changeAttr;

//function to change between buurten and stadsdelen
let changeBasemap;

//function to add overlay maps
let addOverlay;

//bindData functions for basemap buurt and stadsdeel;
let bindDataBB;
let bindDataBS;

// Tooltip DOM (Basemap)
let tooltipContainerBM;
let tooltipPlace;
let tooltipValue;

// Tooltip DOM (Overlay)
let tooltipContainerOL;
let tooltipType;
let tooltipName;
let tooltipMoreData;

// Tooltip DOM (airquality)
let tooltipContainerAQ;
let tooltipPM1;
let tooltipPM25;
let tooltipPM10;

// Tooltip DOM (comments)
let tooltipContainerCM;
let tooltipComment;

let sidebarjs;
let sideContent;
let clickedPathActive;
clickedPathActive = false;

//Demographic data DOM
let selectedNeighbor;
let totalpop;
let men;
let women;
let age0_14;
let age15_64;
let age65;
let dutch;
let immigrants;
let single;
let wKids;
let income;

let foot;
let bike;
let auto;
let transit;

let gElem;
let clickedPath;
let copiedPath;


window.onload = function(){

  tooltipContainerBM = document.getElementById('basemap-tooltip');
  tooltipPlace = document.getElementById('basemap-tooltip-place');
  tooltipValue = document.getElementById('basemap-tooltip-value');

  tooltipContainerOL = document.getElementById('overlay-tooltip');
  tooltipType = document.getElementById('overlay-tooltip-type');
  tooltipName = document.getElementById('overlay-tooltip-name');

  tooltipContainerAQ = document.getElementById('airquality-tooltip');
  tooltipPM1 = document.getElementById('airquality-tooltip-pm1');
  tooltipPM25 = document.getElementById('airquality-tooltip-pm25');
  tooltipPM10 = document.getElementById('airquality-tooltip-pm10');

  tooltipMoreData = document.getElementById('basemap-tooltip-moreData');

  tooltipContainerCM = document.getElementById('comment-tooltip');
  tooltipComment = document.getElementById('data-tooltip-comment');
  // mouse x y position
  document.addEventListener('mousemove', (e) => {
    //e = e || window.event;
    xLocation = e.clientX;
    yLocation = e.clientY;
    // console.log(xLocation);
    // console.log(yLocation);

    tooltipContainerBM.style.left = xLocation + "px";
    tooltipContainerBM.style.top = yLocation + "px";

    tooltipContainerOL.style.left = xLocation + "px";
    tooltipContainerOL.style.top = yLocation + "px";

    tooltipContainerAQ.style.left = xLocation + "px";
    tooltipContainerAQ.style.top = yLocation + "px";

    tooltipContainerCM.style.left = xLocation + "px";
    tooltipContainerCM.style.top = yLocation + "px";

  });

  // Create sidebarjs instance
  sidebarjs = new SidebarJS.SidebarElement({
    backdropOpacity: 0
    //nativeSwipe: false,
  });

  const sliderClose = document.getElementById('slider-close');
  sliderClose.addEventListener('click', (e)=> {
    sidebarjs.close();
    if (clickedPathActive == true) {
      clickedPath[0].classList.remove('clickedNeighbor');
      clickedPathActive = false;
    }
    clickedPath = undefined;
  })

  console.log('loaded');
  sideContent = document.getElementById('sideContent');
  console.log(sideContent);
  //sidebarjs.close();
  sideContent.setAttribute('aria-hidden', 'false');

  selectedNeighbor = document.getElementById('selected-neighbor');
  totalpop = document.getElementById('demography-totalpop');
  men = document.getElementById('demography-men');
  women = document.getElementById('demography-women');
  age0_14 = document.getElementById('demography-age0-14');
  age15_64 = document.getElementById('demography-age15-64');
  age65 = document.getElementById('demography-age65');
  dutch = document.getElementById('demography-dutch');
  immigrants = document.getElementById('demography-immigrants');
  single = document.getElementById('demography-single');
  wKids = document.getElementById('demography-wKids');
  income = document.getElementById('demography-income');

  foot = document.getElementById('demography-foot');
  bike = document.getElementById('demography-bike');
  auto = document.getElementById('demography-auto');
  transit = document.getElementById('demography-transit');

  gElem = basebuurt_svg.firstChild;
  console.log(gElem);

}

// Common directory for json files
const dataPath = '/assets/data/';

// Paths for each json files
const basebuurt_path = dataPath + 'edh_buurt_base.json';
const basestadsdeel_path = dataPath + 'edh_stadsdeel_base.json';
const sportsfacilities_path = dataPath + 'sports_facilities.json';
const medicalfacilities_path = dataPath + 'medical_facilities.json';
const communitycenters_path = dataPath + 'community_centers.json';
const sportsshops_path = dataPath + 'sports_shops.json';
const grocerystores_path = dataPath + 'grocery_stores.json';
const fastfoods_path = dataPath + 'fast_food.json';
const bikeroutes_path = dataPath + 'bike_routes.json';
const parksplaygrounds_path = dataPath + 'parks_playgrounds.json';
const greenarea_path = dataPath + 'green_area.json';

const airquality_path = dataPath + 'airquality_edh.json';

const comments_path = dataPath + 'edh_comments.json';
// demography data for each nieghborhood
const demography_path = dataPath + 'edh_demography.json';

//Fetch base buurten data
const apiReq_buurt = fetch(basebuurt_path).then((response)=> {
  return response.json();
});

//Fetch base stadsdelen data
const apiReq_stadsdeel = fetch(basestadsdeel_path).then((response)=> {
  return response.json();
});

//Fetch sports facilities data
const apiReq_sportsfacilities = fetch(sportsfacilities_path).then((response)=> {
  return response.json();
});

//Fetch medical facilities data
const apiReq_medicalfacilities = fetch(medicalfacilities_path).then((response)=> {
  return response.json();
});

//Fetch community centers data
const apiReq_communitycenters = fetch(communitycenters_path).then((response)=> {
  return response.json();
});

//Fetch sports shops data
const apiReq_sportsshops = fetch(sportsshops_path).then((response)=> {
  return response.json();
});

//Fetch groceries data
const apiReq_grocerystores = fetch(grocerystores_path).then((response)=> {
  return response.json();
});

//Fetch fast food data
const apiReq_fastfoods = fetch(fastfoods_path).then((response)=> {
  return response.json();
});

//Fetch bike routes data
const apiReq_bikeroutes = fetch(bikeroutes_path).then((response)=> {
  return response.json();
});

//Fetch parks and playgrounds data
const apiReq_parksplaygrounds = fetch(parksplaygrounds_path).then((response)=> {
  return response.json();
});

//Fetch green area data
const apiReq_greenarea = fetch(greenarea_path).then((response)=> {
  return response.json();
});

//Fetch demography data
const apiReq_demography = fetch(demography_path).then((response)=> {
  return response.json();
});

//Fetch airquality data
const apiReq_airquality = fetch(airquality_path).then((response)=> {
  return response.json();
});

//Fetch comment data
const apiReq_comments = fetch(comments_path).then((response)=> {
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
                  .on("mouseout", handleMouseOut)
                  .on("click", handleMouseClick)

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

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);
            tooltipMoreData.setAttribute('aria-hidden','false');

            d3.select(this)
              .transition()
              .style('stroke', 'rgb(0,0,0)')
              .style('opacity', 1)
              .duration(200);

              // tooltipContainerBM.style.left = xLocation + "px";
              // tooltipContainerBM.style.top = yLocation + "px";
              tooltipPlace.innerText = i.properties.neighbor;
              tooltipContainerBM.setAttribute('aria-hidden','false');

              if (i.properties[selectedAttribute] !== null) {
                tooltipValue.innerText = i.properties[selectedAttribute] + ' %';
              } else {
                tooltipValue.innerText = 'No Data';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerBM.setAttribute('aria-hidden','true');
            tooltipMoreData.setAttribute('aria-hidden','true');
            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke', 'rgb(187,187,187)')
              .duration(200);
          }

          function handleMouseClick (d, i) {
            //console.log('clicked');
            console.log(i.properties.neighbor);
            //console.log(d);
            let clickedNeighbor = i.properties.neighbor;

            console.log(clickedPath);
            if (clickedPath == undefined && clickedPathActive == false) {
              d3.select(this).classed('clickedNeighbor',true);
              clickedPath = document.getElementsByClassName('clickedNeighbor');
              console.log(clickedPath[0]);
              gElem.appendChild(clickedPath[0]);
              clickedPathActive = true;
            } else if (clickedPath != undefined && clickedPathActive == true){
              clickedPath[0].classList.remove('clickedNeighbor');
              //console.log(gElem.lastChild);
              d3.select(this).classed('clickedNeighbor',true);
              clickedPath = document.getElementsByClassName('clickedNeighbor');
              console.log(clickedPath[0]);
              gElem.appendChild(clickedPath[0]);
            } else if (clickedPath != undefined && clickedPathActive == false) {
              //clickedPath[0].classList.remove('clickedNeighbor');
              //console.log(gElem.lastChild);
              d3.select(this).classed('clickedNeighbor',true);
              clickedPath = document.getElementsByClassName('clickedNeighbor');
              console.log(clickedPath[0]);
              gElem.appendChild(clickedPath[0]);
              clickedPathActive = true;
            }


            apiReq_demography.then((data)=> {
              let demoData = data;
              let selectedDemoData;
              let demoDataLength = data.length;
              // console.log(demoDataLength);
              // console.log(demoData);
              for (let i = 0; i < demoDataLength; i++) {
                if (demoData[i].Buurten == clickedNeighbor) {
                  selectedDemoData = demoData[i];
                  // console.log(selectedDemoData);

                  selectedNeighbor.innerText = selectedDemoData.Buurten;

                  if (selectedDemoData.total_population !="") {
                    totalpop.innerText = selectedDemoData.total_population;
                  } else {
                    totalpop.innerText = "No data"
                  };

                  if (selectedDemoData.men_2020 !="") {
                    men.innerText = selectedDemoData.men_2020 + " %";
                  } else {
                    men.innerText = "No data"
                  };

                  if (selectedDemoData.women_2020 !="") {
                    women.innerText = selectedDemoData.women_2020 + " %";
                  } else {
                    women.innerText = "No data"
                  };

                  if (selectedDemoData['0-14_2020'] !="") {
                    age0_14.innerText = selectedDemoData['0-14_2020'] + " %";
                  } else {
                    age0_14.innerText = "No data"
                  };

                  if (selectedDemoData['15-64_2020'] !="") {
                    age15_64.innerText = selectedDemoData['15-64_2020'] + " %";
                  } else {
                    age15_64.innerText = "No data"
                  };

                  if (selectedDemoData['65andAbove_2020'] !="") {
                    age65.innerText = selectedDemoData['65andAbove_2020'] + " %";
                  } else {
                    age65.innerText = "No data"
                  };

                  if (selectedDemoData.Dutch_2020 !="") {
                    dutch.innerText = selectedDemoData.Dutch_2020 + " %";
                  } else {
                    dutch.innerText = "No data"
                  };

                  if (selectedDemoData.immigrants_2020 !="") {
                    immigrants.innerText = selectedDemoData.immigrants_2020 + " %";
                  } else {
                    immigrants.innerText = "No data"
                  };

                  if (selectedDemoData.single_2019 !="") {
                    single.innerText = selectedDemoData.single_2019 + " %";
                  } else {
                    single.innerText = "No data"
                  };

                  if (selectedDemoData.w_kids_2019 !="") {
                    wKids.innerText = selectedDemoData.w_kids_2019 + " %";
                  } else {
                    wKids.innerText = "No data"
                  };

                  if (selectedDemoData.avg_income_person_2019 !="") {
                    income.innerText = selectedDemoData.avg_income_person_2019 + " EUR";
                  } else {
                    income.innerText = "No data"
                  };

                  if (selectedDemoData.foot_2019 !="") {
                    foot.innerText = selectedDemoData.foot_2019 + " %";
                  } else {
                    foot.innerText = "No data"
                  };

                  if (selectedDemoData.fiets_2019 !="") {
                    bike.innerText = selectedDemoData.fiets_2019 + " %";
                  } else {
                    bike.innerText = "No data"
                  };

                  if (selectedDemoData.auto_2019 !="") {
                    auto.innerText = selectedDemoData.auto_2019 + " %";
                  } else {
                    auto.innerText = "No data"
                  };

                  if (selectedDemoData.transit_2019 !="") {
                    transit.innerText = selectedDemoData.transit_2019 + " %";
                  } else {
                    transit.innerText = "No data"
                  };

                  break;
                };
              }
            });

            sidebarjs.open();
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

			let svg_bs = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'basemap-stadsdeel');
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

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke', 'rgb(0,0,0)')
              .duration(200);

              // tooltipContainerBM.style.left = xLocation + "px";
              // tooltipContainerBM.style.top = yLocation + "px";
              tooltipPlace.innerText = i.properties.districts;
              tooltipContainerBM.setAttribute('aria-hidden','false');


              if (i.properties[selectedAttribute] != null) {
                tooltipValue.innerText = i.properties[selectedAttribute] + ' %';
              } else {
                tooltipValue.innerText = 'No Data';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerBM.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke', 'rgb(187,187,187)')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //bs

    // Overlay datasets

    // sports facilities (point)
    sports_facilities: function sports_facilitie() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_sf = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'sports-facilities');
		  let g_sf = svg_sf.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_sf.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 1);

      sportsfacilities_svg = document.getElementById('sports-facilities');

      if (mapInitialize == true) {
        sportsfacilities_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(sportsfacilities_path).then(function(geojson) {
        geojson_sf = geojson;
        let feature_sf = g_sf.selectAll('path')
                              .data(geojson_sf.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_sf),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_sf.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_sf.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_sf.attr('d', path)
              .style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '.5px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', 'rgb(254, 90, 60)')

              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.7');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_sf.attr("d", path.pointRadius(4));
            } else if (zoomLev == 12) {
                feature_sf.attr("d", path.pointRadius(5));
            } else if (zoomLev == 13) {
                feature_sf.attr("d", path.pointRadius(6));
            } else if (zoomLev == 14) {
                feature_sf.attr("d", path.pointRadius(7));
            } else if (zoomLev == 15) {
                feature_sf.attr("d", path.pointRadius(8));
            } else if (zoomLev == 16) {
                feature_sf.attr("d", path.pointRadius(9));
            } else if (zoomLev == 17) {
                feature_sf.attr("d", path.pointRadius(10));
            } else if (zoomLev == 18) {
                feature_sf.attr("d", path.pointRadius(11));
            } else if (zoomLev == 19) {
                feature_sf.attr("d", path.pointRadius(12));
            } else {
              feature_sf.attr("d", path.pointRadius(6));
            }

            feature_sf.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              //.style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '1px')
              //.style("filter","url(#dot-blur)")
              .duration(200)

              tooltipType.innerText = i.properties.type;
              tooltipContainerOL.setAttribute('aria-hidden','false');

              if (i.properties.name !== null) {
                tooltipName.innerText = i.properties.name;
              } else {
                tooltipName.innerText = 'Not available';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerOL.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke-width', '.5px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //sf

    // medical facilities (point)
    medical_facilities: function medical_facilities() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_mf = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'medical-facilities');
		  let g_mf = svg_mf.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_mf.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 1);

      medicalfacilities_svg = document.getElementById('medical-facilities');

      if (mapInitialize == true) {
        medicalfacilities_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(medicalfacilities_path).then(function(geojson) {
        geojson_mf = geojson;
        let feature_mf = g_mf.selectAll('path')
                              .data(geojson_mf.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_mf),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_mf.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_mf.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_mf.attr('d', path)
              .style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '.5px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', 'rgb(31,120,180)')
              //.style("filter","url(#dot-blur)")
              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.7');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_mf.attr("d", path.pointRadius(4));
            } else if (zoomLev == 12) {
                feature_mf.attr("d", path.pointRadius(5));
            } else if (zoomLev == 13) {
                feature_mf.attr("d", path.pointRadius(6));
            } else if (zoomLev == 14) {
                feature_mf.attr("d", path.pointRadius(7));
            } else if (zoomLev == 15) {
                feature_mf.attr("d", path.pointRadius(8));
            } else if (zoomLev == 16) {
                feature_mf.attr("d", path.pointRadius(9));
            } else if (zoomLev == 17) {
                feature_mf.attr("d", path.pointRadius(10));
            } else if (zoomLev == 18) {
                feature_mf.attr("d", path.pointRadius(11));
            } else if (zoomLev == 19) {
                feature_mf.attr("d", path.pointRadius(12));
            } else {
              feature_mf.attr("d", path.pointRadius(6));
            }

            feature_mf.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke-width', '1px')
              .duration(200);

              tooltipType.innerText = i.properties.type;
              tooltipContainerOL.setAttribute('aria-hidden','false');

              if (i.properties.name !== null) {
                tooltipName.innerText = i.properties.name;
              } else {
                tooltipName.innerText = 'Not available';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerOL.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke-width', '.5px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //mf

    // community centers (point)
    community_centers: function community_centers() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_cc = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'community-centers');
		  let g_cc = svg_cc.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_cc.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 1);

      communitycenters_svg = document.getElementById('community-centers');

      if (mapInitialize == true) {
        communitycenters_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(communitycenters_path).then(function(geojson) {
        geojson_cc = geojson;
        let feature_cc = g_cc.selectAll('path')
                              .data(geojson_cc.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_cc),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_cc.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_cc.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_cc.attr('d', path)
              .style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '.5px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', 'rgb(244, 240, 52)')
              //.style("filter","url(#dot-blur)")
              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.7');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_cc.attr("d", path.pointRadius(4));
            } else if (zoomLev == 12) {
                feature_cc.attr("d", path.pointRadius(5));
            } else if (zoomLev == 13) {
                feature_cc.attr("d", path.pointRadius(6));
            } else if (zoomLev == 14) {
                feature_cc.attr("d", path.pointRadius(7));
            } else if (zoomLev == 15) {
                feature_cc.attr("d", path.pointRadius(8));
            } else if (zoomLev == 16) {
                feature_cc.attr("d", path.pointRadius(9));
            } else if (zoomLev == 17) {
                feature_cc.attr("d", path.pointRadius(10));
            } else if (zoomLev == 18) {
                feature_cc.attr("d", path.pointRadius(11));
            } else if (zoomLev == 19) {
                feature_cc.attr("d", path.pointRadius(12));
            } else {
              feature_cc.attr("d", path.pointRadius(6));
            }

            feature_cc.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke-width', '1px')
              .duration(200);

              tooltipType.innerText = i.properties.type;
              tooltipContainerOL.setAttribute('aria-hidden','false');

              if (i.properties.name !== null) {
                tooltipName.innerText = i.properties.name;
              } else {
                tooltipName.innerText = 'Not available';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerOL.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke-width', '.5px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //cc

    // sports shops (point)
    sports_shops: function sports_shops() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_ss = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'sports-shops');
		  let g_ss = svg_ss.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_ss.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 1);

      sportsshops_svg = document.getElementById('sports-shops');

      if (mapInitialize == true) {
        sportsshops_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(sportsshops_path).then(function(geojson) {
        geojson_ss = geojson;
        let feature_ss = g_ss.selectAll('path')
                              .data(geojson_ss.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_ss),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_ss.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_ss.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_ss.attr('d', path)
              .style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '.5px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', 'rgb(134, 87, 147)')
              //.style("filter","url(#dot-blur)")
              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.7');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_ss.attr("d", path.pointRadius(4));
            } else if (zoomLev == 12) {
                feature_ss.attr("d", path.pointRadius(5));
            } else if (zoomLev == 13) {
                feature_ss.attr("d", path.pointRadius(6));
            } else if (zoomLev == 14) {
                feature_ss.attr("d", path.pointRadius(7));
            } else if (zoomLev == 15) {
                feature_ss.attr("d", path.pointRadius(8));
            } else if (zoomLev == 16) {
                feature_ss.attr("d", path.pointRadius(9));
            } else if (zoomLev == 17) {
                feature_ss.attr("d", path.pointRadius(10));
            } else if (zoomLev == 18) {
                feature_ss.attr("d", path.pointRadius(11));
            } else if (zoomLev == 19) {
                feature_ss.attr("d", path.pointRadius(12));
            } else {
              feature_ss.attr("d", path.pointRadius(6));
            }

            feature_ss.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke-width', '1px')
              .duration(200);

              tooltipType.innerText = i.properties.type;
              tooltipContainerOL.setAttribute('aria-hidden','false');

              if (i.properties.name !== null) {
                tooltipName.innerText = i.properties.name;
              } else {
                tooltipName.innerText = 'Not available';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerOL.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke-width', '.5px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //ss

    // grocery stores (point)
    grocery_stores: function grocery_stores() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_gs = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'grocery-stores');
		  let g_gs = svg_gs.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_gs.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 1);

      let grocerystores_svg = document.getElementById('grocery-stores');

      if (mapInitialize == true) {
        grocerystores_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(grocerystores_path).then(function(geojson) {
        geojson_gs = geojson;
        let feature_gs = g_gs.selectAll('path')
                              .data(geojson_gs.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_gs),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_gs.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_gs.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_gs.attr('d', path)
              .style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '.5px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', 'rgb(121, 164, 167)')
              //.style("filter","url(#dot-blur)")
              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.7');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_gs.attr("d", path.pointRadius(4));
            } else if (zoomLev == 12) {
                feature_gs.attr("d", path.pointRadius(5));
            } else if (zoomLev == 13) {
                feature_gs.attr("d", path.pointRadius(6));
            } else if (zoomLev == 14) {
                feature_gs.attr("d", path.pointRadius(7));
            } else if (zoomLev == 15) {
                feature_gs.attr("d", path.pointRadius(8));
            } else if (zoomLev == 16) {
                feature_gs.attr("d", path.pointRadius(9));
            } else if (zoomLev == 17) {
                feature_gs.attr("d", path.pointRadius(10));
            } else if (zoomLev == 18) {
                feature_gs.attr("d", path.pointRadius(11));
            } else if (zoomLev == 19) {
                feature_gs.attr("d", path.pointRadius(12));
            } else {
              feature_gs.attr("d", path.pointRadius(6));
            }

            feature_gs.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke-width', '1px')
              .duration(200);

              tooltipType.innerText = i.properties.type;
              tooltipContainerOL.setAttribute('aria-hidden','false');

              if (i.properties.name !== null) {
                tooltipName.innerText = i.properties.name;
              } else {
                tooltipName.innerText = 'Not available';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerOL.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke-width', '.5px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //gs

    // fast foods (point)
    fast_foods: function fast_foods() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_ff = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'fast-foods');
		  let g_ff = svg_ff.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_ff.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 1);

      let fastfoods_svg = document.getElementById('fast-foods');

      if (mapInitialize == true) {
        fastfoods_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(fastfoods_path).then(function(geojson) {
        geojson_ff = geojson;
        let feature_ff = g_ff.selectAll('path')
                              .data(geojson_ff.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_ff),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_ff.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_ff.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_ff.attr('d', path)
              .style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '.5px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', 'rgb(164, 101, 30)')
              //.style("filter","url(#dot-blur)")
              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.7');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_ff.attr("d", path.pointRadius(4));
            } else if (zoomLev == 12) {
                feature_ff.attr("d", path.pointRadius(5));
            } else if (zoomLev == 13) {
                feature_ff.attr("d", path.pointRadius(6));
            } else if (zoomLev == 14) {
                feature_ff.attr("d", path.pointRadius(7));
            } else if (zoomLev == 15) {
                feature_ff.attr("d", path.pointRadius(8));
            } else if (zoomLev == 16) {
                feature_ff.attr("d", path.pointRadius(9));
            } else if (zoomLev == 17) {
                feature_ff.attr("d", path.pointRadius(10));
            } else if (zoomLev == 18) {
                feature_ff.attr("d", path.pointRadius(11));
            } else if (zoomLev == 19) {
                feature_ff.attr("d", path.pointRadius(12));
            } else {
              feature_ff.attr("d", path.pointRadius(6));
            }

            feature_ff.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke-width', '1px')
              .duration(200);

              tooltipType.innerText = i.properties.type;
              tooltipContainerOL.setAttribute('aria-hidden','false');

              if (i.properties.name !== null) {
                tooltipName.innerText = i.properties.name;
              } else {
                tooltipName.innerText = 'Not available';
              }
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerOL.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke-width', '.5px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //ff

    // comments (point)
    comments: function comments() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_cm = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'comments');
		  let g_cm = svg_cm.append('g').attr('class', 'leaflet-zoom-hide');



      let comments_svg = document.getElementById('comments');

      if (mapInitialize == true) {
        comments_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(comments_path).then(function(geojson) {
        geojson_cm = geojson;
        let feature_cm = g_cm.selectAll('path')
                              .data(geojson_cm.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_cm),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_cm.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_cm.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_cm.attr('d', path)
              .style('stroke', '#666666') //#bbbbbb
              .style('stroke-width', '.5px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', 'rgb(251,154,153)')
              //.style("filter","url(#dot-blur)")
              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.7');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_cm.attr("d", path.pointRadius(4));
            } else if (zoomLev == 12) {
                feature_cm.attr("d", path.pointRadius(5));
            } else if (zoomLev == 13) {
                feature_cm.attr("d", path.pointRadius(6));
            } else if (zoomLev == 14) {
                feature_cm.attr("d", path.pointRadius(7));
            } else if (zoomLev == 15) {
                feature_cm.attr("d", path.pointRadius(8));
            } else if (zoomLev == 16) {
                feature_cm.attr("d", path.pointRadius(9));
            } else if (zoomLev == 17) {
                feature_cm.attr("d", path.pointRadius(10));
            } else if (zoomLev == 18) {
                feature_cm.attr("d", path.pointRadius(11));
            } else if (zoomLev == 19) {
                feature_cm.attr("d", path.pointRadius(12));
            } else {
              feature_cm.attr("d", path.pointRadius(6));
            }

            feature_cm.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke-width', '1px')
              .duration(200);

              //tooltipType.innerText = i.properties.type;
              tooltipContainerCM.setAttribute('aria-hidden','false');
              tooltipComment.innerText = i.properties.comment;

          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerCM.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.7)
              .style('stroke-width', '.5px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //cm

    // air quality (point)
    air_quality: function air_quality() {

      let projectPoint = function projectPoint(x, y) {
				let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
		    	this.stream.point(point.x, point.y);
			};

			// Transform positions
			let transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

			let svg_aq = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'air-quality');
		  let g_aq = svg_aq.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_aq.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", "10");

      airquality_svg = document.getElementById('air-quality');

      if (mapInitialize == true) {
        airquality_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(airquality_path).then(function(geojson) {
        geojson_aq = geojson;
        let feature_aq = g_aq.selectAll('path')
                              .data(geojson_aq.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_aq),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_aq.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_aq.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');


            // const pm25max = d3.max(geojson_aq.features, function(d) { return d['properties']['PM2.5'] });
		        // const pm25min = d3.min(geojson_aq.features, function(d) { return d['properties']['PM2.5'] });

            // console.log(pm25max);
            // console.log(pm25min);

            feature_aq.attr('d', path)
              .style('stroke', '#999') //#bbbbbb
              .style('stroke-width', '0px')
              .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
              .style('cursor', 'pointer')
              .style('fill', (d)=> {
                if (d.properties['PM2.5'] >= 7) {
                    return 'rgb(115,115,115)';
                } else if (d.properties['PM2.5'] >= 4 & d.properties['PM2.5'] < 7) {
                    return 'rgb(189,189,189)';
                } else if (d.properties['PM2.5'] < 4) {
                    return 'rgb(240,240,240)';
                }
              })
              .style("filter","url(#dot-blur)")
              .style('opacity', '0')
              .transition()
              .duration(500)
              .style('opacity', '0.8');

            let zoomLev = map.getZoom();
            console.log(zoomLev);

            if (zoomLev <= 11) {
                feature_aq.attr("d", path.pointRadius(8));
            } else if (zoomLev == 12) {
                feature_aq.attr("d", path.pointRadius(10));
            } else if (zoomLev == 13) {
                feature_aq.attr("d", path.pointRadius(12));
            } else if (zoomLev == 14) {
                feature_aq.attr("d", path.pointRadius(14));
            } else if (zoomLev == 15) {
                feature_aq.attr("d", path.pointRadius(16));
            } else if (zoomLev == 16) {
                feature_aq.attr("d", path.pointRadius(18));
            } else if (zoomLev == 17) {
                feature_aq.attr("d", path.pointRadius(22));
            } else if (zoomLev == 18) {
                feature_aq.attr("d", path.pointRadius(22));
            } else if (zoomLev == 19) {
                feature_aq.attr("d", path.pointRadius(24));
            } else {
              feature_aq.attr("d", path.pointRadius(12));
            }

            feature_aq.attr('d', path).on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);

          function handleMouseOver(d, i) {
            // console.log('mouseover');
            // console.log(d);
            // console.log(i);

            d3.select(this)
              .transition()
              .style('opacity', 1)
              .style('stroke-width', '1px')
              .duration(200);

              console.log(i.properties['PM1']);

              if (i.properties['PM1'] != null) {
                tooltipPM1.innerText = i.properties['PM1'] + " μg/m3";
              } else {
                tooltipPM1.innerText = 'Not available';
              }

              if (i.properties['PM2.5'] != null) {
                tooltipPM25.innerText = i.properties['PM2.5'] + " μg/m3";
              } else {
                tooltipPM25.innerText = 'Not available';
              }

              if (i.properties['PM10'] != null) {
                tooltipPM10.innerText = i.properties['PM10'] + " μg/m3";
              } else {
                tooltipPM10.innerText = 'Not available';
              }

              tooltipContainerAQ.setAttribute('aria-hidden','false');
          } //handleMouseOver

          function handleMouseOut (d, i) {
            tooltipContainerAQ.setAttribute('aria-hidden','true');

            d3.select(this)
              .transition()
              .style('opacity', 0.8)
              .style('stroke-width', '0px')
              .duration(200);
          }

          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //aq

    // bike routes (line)
    bike_routes: function bike_routes() {

      let projectPoint = function projectPoint(x, y) {
        let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
          this.stream.point(point.x, point.y);
      };

      // Transform positions
      let transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);

      let svg_br = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'bike-routes');
      let g_br = svg_br.append('g').attr('class', 'leaflet-zoom-hide');

      //filters go in defs element
      let defs = svg_br.append("defs");

      let filter = defs.append("filter")
          .attr("id", "dot-blur");

      filter.append("feGaussianBlur")
          .attr("in", "SourceGraphic")
          .attr("stdDeviation", 1);

      bikeroutes_svg = document.getElementById('bike-routes');

      if (mapInitialize == true) {
        bikeroutes_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(bikeroutes_path).then(function(geojson) {
        geojson_br = geojson;
        let feature_br = g_br.selectAll('path')
                              .data(geojson_br.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_br),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_br.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_br.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            let zoomLev = map.getZoom();

	            feature_br.attr('d', path)
                   .style('stroke', 'rgb(170, 139, 21)')
                   .style('opacity', 0.7)
                   .style('stroke-width', ()=>{
                   		if (zoomLev <= 11) {
	                        return 1;
	                    } else if (zoomLev == 12) {
	                        return 1.5;
	                    } else if (zoomLev == 13) {
	                        return 2;
	                    } else if (zoomLev == 14) {
	                        return 3;
	                    } else if (zoomLev == 15) {
	                        return 4;
	                    } else if (zoomLev == 16) {
	                		return 5;
	                    } else {
	                    	return 1;
	                    }
                   })
                   .style('fill', 'none')
        		       .attr('class', 'pointer-release'); // Release leaflet's css pointer-event:none


          //remove loader
          loader = document.getElementById('loader-bg');
          loader.setAttribute('aria-hidden','true');

        }// reset
      })
    }, //br

    // Parks and playgrounds (polygon)
    parks_playgrounds: function parks_playgrounds() {

      let projectPoint = function projectPoint(x, y) {
        let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
          this.stream.point(point.x, point.y);
      };

      // Transform positions
      let transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);

      let svg_pp = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'parks-playgrounds');
      let g_pp = svg_pp.append('g').attr('class', 'leaflet-zoom-hide');


      parksplaygrounds_svg = document.getElementById('parks-playgrounds');

      if (mapInitialize == true) {
        parksplaygrounds_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(parksplaygrounds_path).then(function(geojson) {
        geojson_pp = geojson;
        //console.log(geojson_pp);
        let feature_pp = g_pp.selectAll('path')
                              .data(geojson_pp.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_pp),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_pp.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_pp.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_pp.attr('d', path)
                //.style('stroke', 'rgb(187,187,187)') //#bbbbbb
                //.style('stroke-width', '1px')
                .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
                .style('cursor', 'pointer')
                .style('fill', 'green')//(d)=> {
                  // if (d.properties[selectedAttribute] >= interval6) {
                  //     return 'rgb(204,76,2)';
                  // } else if (d.properties[selectedAttribute] >= interval4 & d.properties[selectedAttribute] < interval6) {
                  //     return 'rgb(254,153,41)';
                  // } else if (d.properties[selectedAttribute] >= interval2 & d.properties[selectedAttribute] < interval4) {
                  //     return 'rgb(254,217,142)';
                  // } else if (d.properties[selectedAttribute] >= interval0 & d.properties[selectedAttribute] < interval2) {
                  //     return 'rgb(255,255,212)';
                  // } else {
                  //   return 'rgb(212,212,212)'; //#d4d4d4;
                  // }
                //})
                .style('opacity', '0')
                .transition()
                .duration(500)
                .style('opacity', '0.7');

                feature_pp.attr('d', path).on("mouseover", handleMouseOver)
                  .on("mouseout", handleMouseOut);


              function handleMouseOver(d, i) {
                // console.log('mouseover');
                // console.log(d);
                // console.log(i);

                d3.select(this)
                  .transition()
                  .style('opacity', 0.4)
                  .duration(200);

                  tooltipType.innerText = i.properties.type;
                  tooltipContainerOL.setAttribute('aria-hidden','false');

                  if (i.properties.name !== null) {
                    tooltipName.innerText = i.properties.name;
                  } else {
                    tooltipName.innerText = 'Not available';
                  }
              } //handleMouseOver

              function handleMouseOut (d, i) {
                tooltipContainerOL.setAttribute('aria-hidden','true');

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
    }, //pp

    // green area (polygon)
    green_area: function green_area() {

      let projectPoint = function projectPoint(x, y) {
        let point = map.latLngToLayerPoint(new L.LatLng(y,x)); // *Check lat lon, lon lat
          this.stream.point(point.x, point.y);
      };

      // Transform positions
      let transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);

      let svg_ga = d3.select(map.getPanes().overlayPane).append('svg').attr('id', 'green-area');
      let g_ga = svg_ga.append('g').attr('class', 'leaflet-zoom-hide');


      greenarea_svg = document.getElementById('green-area');

      if (mapInitialize == true) {
        greenarea_svg.setAttribute('aria-hidden', 'true');
      }

      d3.json(greenarea_path).then(function(geojson) {
        geojson_ga = geojson;
        //console.log(geojson_ga);
        let feature_ga = g_ga.selectAll('path')
                              .data(geojson_ga.features)
                              .enter()
                              .append('path');

        map.on('moveend', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          let bounds = path.bounds(geojson_ga),
            topLeft = bounds[0],
            bottomRight = bounds[1];

            svg_ga.attr('width', bottomRight[0] - topLeft[0])
                  .attr('height', bottomRight[1] - topLeft[1])
                  .style('left', topLeft[0] + 'px')
                  .style('top', topLeft[1] + 'px')
                  .style('overflow', 'visible');

            g_ga.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

            feature_ga.attr('d', path)
                // .style('stroke', 'rgb(187,187,187)') //#bbbbbb
                // .style('stroke-width', '1px')
                .attr('class', 'leaflet-interactive') // Release leaflet's css pointer-event:none
                .style('cursor', 'pointer')
                .style('fill', 'rgb(109,192,103)')//(d)=> {
                  // if (d.properties[selectedAttribute] >= interval6) {
                  //     return 'rgb(204,76,2)';
                  // } else if (d.properties[selectedAttribute] >= interval4 & d.properties[selectedAttribute] < interval6) {
                  //     return 'rgb(254,153,41)';
                  // } else if (d.properties[selectedAttribute] >= interval2 & d.properties[selectedAttribute] < interval4) {
                  //     return 'rgb(254,217,142)';
                  // } else if (d.properties[selectedAttribute] >= interval0 & d.properties[selectedAttribute] < interval2) {
                  //     return 'rgb(255,255,212)';
                  // } else {
                  //   return 'rgb(212,212,212)'; //#d4d4d4;
                  // }
                //})
                .style('opacity', '0')
                .transition()
                .duration(500)
                .style('opacity', '0.7');

                feature_ga.attr('d', path).on("mouseover", handleMouseOver)
                  .on("mouseout", handleMouseOut);


              function handleMouseOver(d, i) {
                // console.log('mouseover');
                // console.log(d);
                // console.log(i);

                d3.select(this)
                  .transition()
                  .style('opacity', 0.4)
                  .duration(200);

                  function capitalize(initialLetter)
                  {
                      return initialLetter[0].toUpperCase() + initialLetter.slice(1);
                  }

                  tooltipType.innerText = capitalize(i.properties.type);
                  tooltipContainerOL.setAttribute('aria-hidden','false');

                  if (i.properties.name !== null) {
                    tooltipName.innerText = capitalize(i.properties.name);
                  } else {
                    tooltipName.innerText = 'Not available';
                  }
              } //handleMouseOver

              function handleMouseOut (d, i) {
                tooltipContainerOL.setAttribute('aria-hidden','true');

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
    }, //pp

  } //mapLayers

  // Render all maplayers first
  //TODO: See if the map layers can be rendered in background process (Web Worker?)
  if (mapInitialize == true) {

        mapLayers.basemap_buurt();
        mapLayers.basemap_stadsdeel();
        mapLayers.green_area();
        mapLayers.parks_playgrounds();
        mapLayers.bike_routes();
        mapLayers.sports_facilities();
        mapLayers.medical_facilities();
        mapLayers.community_centers();
        mapLayers.sports_shops();
        mapLayers.grocery_stores();
        mapLayers.fast_foods();
        mapLayers.comments();
        mapLayers.air_quality();

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
      clickedPathActive = false;
    } else if (baseStatus == 'stadsdeel') {
      bindDataBS(newAttr, baseStatus);
    }
  };

  // addOverlay test
  addOverlay = function (status, value) {
    // console.log(status);
    // console.log(value);
    if (status == true && value != undefined) {
      //console.log('add overlay');
      document.getElementById(value).setAttribute('aria-hidden', 'false');
    } else if (status == false && value != undefined) {
      //console.log('remove overlay');
      document.getElementById(value).setAttribute('aria-hidden', 'true');
    }
  }

};

function initializeMap() {
  //console.log('map is initialized');
  mapInitialize = true;
  //console.log(mapInitialize);
  baseStatus = 'buurt';
  vizmaps();
}

//console.log('remote log test js here');
console.re.log('remote log test from js');



