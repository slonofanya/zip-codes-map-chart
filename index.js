document.addEventListener('DOMContentLoaded', async function() {
    const geoJsonFiles = {
    USDMA: "us-dma.geo.json",
    AU: "au-all.geo.json",
    UK: "uk-all.geo.json",
    CA: "ca-all.geo.json",
    default: "us-dma.geo.json"
  };
  
    // Load the our usual static GeoJSON data.
    const jsonData = await (fetch(`https://s3.amazonaws.com/miq-public/atv/geo_map_configs/${geoJsonFiles.CA}`).then(res => res.json()));
  
    jsonData.features.forEach(function(feature) {
      // Here we add random zip code to each feature
      feature.properties.zip = Math.floor(Math.random() * 10000);
    });
  
    Highcharts.mapChart('container', {
      chart: {
        map: jsonData
      },
      title: {
        text: 'Zip Code Level Geo Map'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      series: [{
        data: jsonData.features.map((d, i) => [d.properties.zip, i]),
        mapData: jsonData,
        // Here we group the data by zip code
        joinBy: 'zip',
        dataLabels: {
          enabled: true,
          format: '{point.properties.zip}'
        }
      }]
    });
    
    var tableHeaders = document.getElementById('table-headers');
    var tableBody = document.getElementById('table-body');
    var coordinatesTable = document.getElementById('coordinates-table');
  
    // Create table headers based on properties keys
    if (jsonData.features.length > 0) {
      var firstObjectProperties = jsonData.features[0].properties;
      for (var key in firstObjectProperties) {
        var th = document.createElement('th');
        th.textContent = key;
        tableHeaders.appendChild(th);
      }
    }
  
    // Populate properties table
    jsonData.features.forEach(function(geojsonObject) {
      var row = tableBody.insertRow();
      for (var key in geojsonObject.properties) {
        var cell = row.insertCell();
        cell.textContent = geojsonObject.properties[key];
      }
    });
  });