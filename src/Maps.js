import { React, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import L from 'leaflet';

// delete L.Icon.Default.prototype._getIconUrl ; 


// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:

// })

const icon = L.icon({
  iconUrl: "./placeholder.png",
  iconSize: [48, 38],
});

const position = [28.6139, 77.2090];

function ResetCenterView(props) {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true
        }
      )
    }
  }, [selectPosition]);

  return null;
}

export default function Maps(props) {
  const { selectPosition } = props;
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];

  const handleMapClick = (e) => {
    console.log("Latitude:", e.latlng.lat);
    console.log("Longitude:", e.latlng.lng);
  };

  const [mapLayers, setMapLayers] = useState([]);

  const _onCreate = e => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
  
      // Extracting the coordinates of the polygon
      const latlngs = layer.getLatLngs()[0].map(coord => ({ lat: coord.lat, lng: coord.lng }));
  
      setMapLayers(layers => [...layers, { id: _leaflet_id, latlngs }]);
    }
  };
  

  const _onEdited = e => {
    console.log(e);
    const {layers:{ _layers }} = e ;

    Object.values( _layers ).map(({ _leaflet_id , editing}) => {
      setMapLayers( layers => layers.map( l => l.id === _leaflet_id ? {...l ,latlngs:  { ...editing.latlngs[0]}} : l) ) ;
    }) ;
  };

  const _onDelete = e => {
    console.log(e);
    const { layers :{ _layers}} = e ; 

    Object.values(_layers).map(({_leaflet_id}) => {
      setMapLayers( layers => layers.filter(l => l.id !== _leaflet_id )) ;
    })
  };

  return (
    <div>
      <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100vh' }}>
        {/*Polygon*/}
        <FeatureGroup>
          <EditControl position="topright" onCreated={_onCreate} onEdited={_onEdited} onDeleted={{ _onDelete }} draw={{
            // rectangle: false,
            // polyline: false,
            // circle: false,
            // circlemarker: false,
            // marker: false
          }}>
          </EditControl>
        </FeatureGroup>
        {/* OpenStreetMap TileLayer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Google Streets TileLayer */}
        <TileLayer
          attribution='&copy; Google'
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />

        {selectPosition && (
          <Marker position={locationSelection} icon={icon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        )}
        <ResetCenterView selectPosition={selectPosition} />
        {/* Listen for map click event */}
        <UseMapClick />
      </MapContainer>
        
        {/* Getting the Polygon IDS */}
      {/* <pre className='text-left'>{JSON.stringify(mapLayers, 0, 2)}</pre> */}
    </div>
  );
}

let firstMarker, secondMarker;

function UseMapClick() {
  const map = useMapEvent('click', (e) => {
    const { latlng } = e;
    if (!firstMarker) {
      firstMarker = L.marker(latlng, { icon }).addTo(map);
    } else if (!secondMarker) {
      secondMarker = L.marker(latlng, { icon }).addTo(map);
      // Routing between the first two markers
      L.Routing.control({
        waypoints: [
          L.latLng(firstMarker.getLatLng()),
          L.latLng(secondMarker.getLatLng())
        ],
        lineOptions: {
          styles: [{ color: '#00ff00', weight: 5 }]
        },
        createMarker: function (i, waypoint, n) {
          // Use the same icon for all markers
          return L.marker(waypoint.latLng, {
            icon: icon
          });
        }
      }).addTo(map);
    }
  });

  return null;
}
