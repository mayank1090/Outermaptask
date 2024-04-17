
import React from 'react';
import OpenLayersMap from './components/MapWrapper';
import"./App.css"

function App() {
  
  // set intial state
  
  
  return (
    <div className="App" style={{height:"100vh",display:"flex",flexDirection:"column"}}>
      
      <div className="app-label" >
        <p style={{textAlign:"center"}}>React OpenLayers Map</p>

        <p className='thegusidelines' style={{paddingLeft:"2rem"}}>General Guidelines :</p>
        <ul className='theullist' style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <li>To find distance between 2 locations</li>
          <ul>
            <li>Click on the Draw line Button</li>
            <li>Select the starting point and while selecting the ending point make sure you select the destination point with DOUBLE CLICK</li>
            <li>Distance calculation unit kilometers</li>
          </ul>

          <li>To find the Area of the particular polygon</li>
          <ul>
            <li>Select the Corners of the polygon </li>
            <li>Make sure your staring and ending point should be same for area calculation and while selecting the destination point make sure you select with DOUBLE CLICK</li>
            <li>Area calculation unit is Square kilometers</li>
          </ul>
        </ul>
      </div>
      <div className='othermapprnt' style={{flexGrow:"1"}}>
      <OpenLayersMap/>
     </div>
    </div>
  )
}

export default App
