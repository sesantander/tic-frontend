
var markers = new Array();
var map = L.map('map').setView([10.96854,-74.78132],14);
   
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=f3ePDK7mOfdrsKDU0ZgW', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  maxZoom: 500,
  zoom:13,
}).addTo(map);

async function getAllMarkers(){
  await fetch('https://tic2021.herokuapp.com/api/v1/reporte/')
  .then(response => response.json())
  .then(data => {

    for(i=0;i<data.reporte.length;i++) {
      var newMarker = new L.marker([data.reporte[i].latitud,data.reporte[i].longitud]).addTo(map);
      map.addLayer(newMarker)
      newMarker.bindPopup(`Nivel: Arroyo ${data.reporte[i].nivelArroyo},  Trafico: ${data.reporte[i].nivelTrafico} , Descripcion: ${data.reporte[i].descripcion}`);
    }
  });
}

getAllMarkers();

function addMarker(e){
  console.log("e.latlng",e.latlng)
  var newMarker = new L.marker(e.latlng).addTo(map);
  map.addLayer(newMarker)
  markers.push(newMarker)
  newMarker.bindPopup("Arroyo Alto");
}

function deleteMarkers(e){
  for(i=0;i<markers.length;i++) {
    map.removeLayer(markers[i]);
  }
}

async function sendReport(){
  const nivelArroyo = document.getElementById('nivelArroyo').value;
  const nivelBasura = document.getElementById('nivelBasura').value;
  const nivelTrafico = document.getElementById('nivelTrafico').value;
  const descripcion = document.getElementById('descripcion').value;
  if(markers.length>0){
    for(i=0;i<markers.length;i++) {
        const {lat, lng} = markers[i]._latlng;
        
        await fetch('https://tic2021.herokuapp.com/api/v1/reporte/create',{
          method: "POST",
          body: JSON.stringify({
            nivelArroyo,
            nivelBasura,
            nivelTrafico,
            longitud:lng,
            latitud:lat,
            descripcion,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        .then(response => response.json())
        .then(json => {
          console.log(json)
          alert('Reporte enviado, muchas gracias')
        })
        .catch((error) => {
          alert('Un error con el servidor ha ocurrido');
        });
    }
  }else{
    alert('Seleccione el arroyo en el mapa');
  }
}
map.on('click', addMarker);
