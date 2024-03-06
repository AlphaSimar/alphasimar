
// import React, { useState } from "react";
// import OutlinedInput from "@material-ui/core/OutlinedInput";
// import Button from "@material-ui/core/Button";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import Divider from "@material-ui/core/Divider";
// import L from "leaflet";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import 'leaflet/dist/leaflet.css';

// const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

// export default function SearchBox(props) {
//   const { selectPosition, setSelectPosition } = props;
//   const [fromSearchText, setFromSearchText] = useState("");
//   const [toSearchText, setToSearchText] = useState("");
//   const [fromLocation, setFromLocation] = useState(null);
//   const [toLocation, setToLocation] = useState(null);
//   const [fromListPlace, setFromListPlace] = useState([]);
//   const [toListPlace, setToListPlace] = useState([]);

//   const handleSearch = (searchText, setSearchText, setListPlace) => {
//     const params = {
//       q: searchText,
//       format: "json",
//       addressdetails: 1,
//       polygon_geojson: 0,
//     };
//     const queryString = new URLSearchParams(params).toString();
//     const requestOptions = {
//       method: "GET", 
//       redirect: "follow",
//     };
//     fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
//       .then((response) => response.text())
//       .then((result) => {
//         console.log(JSON.parse(result));
//         setListPlace(JSON.parse(result));
//       })
//       .catch((err) => console.log("err: ", err));
//   };
  

//   const handleLocationSelection = (location, isFrom) => {
//     if (isFrom) {
//       setFromLocation(location);
//     } else {
//       setToLocation(location);
//     }

//     // Update selectPosition state with the selected location's coordinates
//     setSelectPosition((prev) => ({
//       ...prev,
//       lat: isFrom ? location.lat : prev.lat,
//       lon: isFrom ? location.lon : location.lon,
//     }));
//   };

//   const handleRouteDisplay = () => {
//     console.log("fromLocation: ", fromLocation.lat, fromLocation.lat);
//     console.log("toLocation: ", toLocation);
//     if (fromLocation && toLocation && selectPosition.map) { // Ensure map is initialized
//       console.log("fromLocation: ", fromLocation);
//       console.log("toLocation: ", toLocation);
//       const waypoints = [
//         L.latLng(fromLocation.lat, fromLocation.lon),
//         L.latLng(toLocation.lat, toLocation.lon),
//       ];
  
//       L.Routing.control({
//         waypoints,
//       }).addTo(selectPosition.map);
//     }
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       <div style={{ display: "flex", marginBottom: 10 }}>
//         <OutlinedInput
//           style={{ flex: 1, marginRight: 10 }}
//           placeholder="From"
//           value={fromSearchText}
//           onChange={(event) => setFromSearchText(event.target.value)}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleSearch(fromSearchText, setFromSearchText, setFromListPlace)}
//         >
//           Search From
//         </Button>
//       </div>
//       <List component="nav" aria-label="from location search results">
//         {fromListPlace.map((item) => (
//           <div key={item.place_id}>
//             <ListItem
//               button
//               onClick={() => handleLocationSelection(item, true)}
//             >
//               <ListItemIcon>
//                 <img
//                   src="./placeholder.png"
//                   alt="Placeholder"
//                   style={{ width: 38, height: 38 }}
//                 />
//               </ListItemIcon>
//               <ListItemText primary={item.display_name} />
//             </ListItem>
//             <Divider />
//           </div>
//         ))}
//       </List>
//       <div style={{ display: "flex", marginBottom: 10 }}>
//         <OutlinedInput
//           style={{ flex: 1, marginRight: 10 }}
//           placeholder="To"
//           value={toSearchText}
//           onChange={(event) => setToSearchText(event.target.value)}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleSearch(toSearchText, setToSearchText, setToListPlace)}
//         >
//           Search To
//         </Button>
//       </div>
//       <List component="nav" aria-label="to location search results">
//         {toListPlace.map((item) => (
//           <div key={item.place_id}>
//             <ListItem
//               button
//               onClick={() => handleLocationSelection(item, false)}
//             >
//               <ListItemIcon>
//                 <img
//                   src="./placeholder.png"
//                   alt="Placeholder"
//                   style={{ width: 38, height: 38 }}
//                 />
//               </ListItemIcon>
//               <ListItemText primary={item.display_name} />
//             </ListItem>
//             <Divider />
//           </div>
//         ))}
//       </List>
//       <Button
//         variant="contained"
//         color="primary"
//         disabled={!fromLocation || !toLocation}
//         onClick={handleRouteDisplay}
//       >
//         Show Route
//       </Button>
//     </div>
//   );
// }

import React, { useState } from "react";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useMapEvent } from "react-leaflet";
import L from 'leaflet' ;




const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export default function SearchBox(props) {
  const { selectPosition, setSelectPosition } = props;

  const [searchText1, setSearchText1] = useState("");
  const [listPlace1, setListPlace1] = useState([]);
  const [firstMarker, setFirstMarker] = useState(null);
  const [firstResultLatLng, setFirstResultLatLng] = useState({ lat: 0, lon: 0 }); // Initial values

  const [searchText2, setSearchText2] = useState("");
  const [listPlace2, setListPlace2] = useState([]);
  const [secondMarker, setSecondMarker] = useState(null);
  const [secondResultLatLng, setSecondResultLatLng] = useState({ lat: 0, lon: 0 }); // Initial values

  const handleSearch1 = () => {
    const params = {
      q: searchText1,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsedResult = JSON.parse(result);
        console.log(parsedResult);

        const firstResult = parsedResult[0];
        const latitude = firstResult.lat;
        const longitude = firstResult.lon;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        setListPlace1(parsedResult);
        setSelectPosition(parsedResult[0]);
        setFirstMarker(parsedResult[0]);
        
        // Store latitude and longitude in firstResultLatLng
        setFirstResultLatLng({ lat: parseFloat(latitude), lon: parseFloat(longitude) });
      })
      .catch((err) => console.log("err: ", err));
  };



  const handleSearch2 = () => {
    const params = {
      q: searchText2,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsedResult = JSON.parse(result);
        console.log(parsedResult);
        const firstResult = parsedResult[0];
        const latitude = firstResult.lat;
        const longitude = firstResult.lon;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        setListPlace2(parsedResult);
        setSelectPosition(parsedResult[0]);
        setSecondMarker(parsedResult[0]);

        // Store latitude and longitude in secondResultLatLng
        setSecondResultLatLng({ lat: parseFloat(latitude), lon: parseFloat(longitude) });
      })
      .catch((err) => console.log("err: ", err));
  };
  
  L.Routing.control({
    waypoints: [
      L.latLng(firstResultLatLng.getLatLng()),
          L.latLng(secondResultLatLng.getLatLng())
    ]
  }).addTo(map);

  
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <OutlinedInput
            style={{ width: "100%" }}
            value={searchText1}
            onChange={(event) => {
              setSearchText1(event.target.value);
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "0px 20px" }}>
          <Button variant="contained" color="primary" onClick={handleSearch1}>
            Search 1
          </Button>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <OutlinedInput
              style={{ width: "100%" }}
              value={searchText2}
              onChange={(event) => {
                setSearchText2(event.target.value);
                
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", padding: "0px 20px" }}>
            <Button variant="contained" color="primary" onClick={handleSearch2}>
              Search 2
            </Button>
          </div>
        </div>
        <List component="nav" aria-label="main mailbox folders">
          {/* Render list items for both searches */}
        </List>
      </div>
      {/* Render markers for the selected positions */}
      {firstMarker && (
        <div>
          <p>First Marker: {firstMarker.display_name}</p>
          {/* Render the first marker on the map using the firstMarker coordinates */}
        </div>
      )}
      {secondMarker && (
        <div>
          <p>Second Marker: {secondMarker.display_name}</p>
          {/* Render the second marker on the map using the secondMarker coordinates */}
        </div>
      )}
    </div>
  );
}
