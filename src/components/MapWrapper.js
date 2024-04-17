import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { LineString, Polygon } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere';
import { Style, Stroke } from 'ol/style';

const OpenLayersMap = () => {
    const mapRef = useRef(null);
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });
    const [lengthInKilometer, setLengthInKm] = useState(null);
    const [areaInKilometer, setAreaInKm] = useState(null);
    const [drawType, setDrawType] = useState('LineString');
    let drawInteraction; // Variable to store the draw interaction

    useEffect(() => {
        // Initialize map
        if (!mapRef.current) return;

        const map = new Map({
            view: new View({
                center: fromLonLat([0, 0]),
                zoom: 2,
            }),
            layers: [new TileLayer({ source: new OSM() }), vectorLayer],
            target: mapRef.current,
        });

        // Function to initialize drawing interaction
        const initializeDrawing = (type) => {
            // Remove existing drawing interaction if it exists
            if (drawInteraction) {
                map.removeInteraction(drawInteraction);
            }

            // Create a new Draw interaction with the specified type
            drawInteraction = new Draw({
                source: vectorSource,
                type: type,
            });

            // Add the Draw interaction to the map
            map.addInteraction(drawInteraction);

            // Add event handler for drawing end
            drawInteraction.on('drawend', (event) => {
                const drawnFeature = event.feature;
                const geometry = drawnFeature.getGeometry();
                const coordinates = geometry.getCoordinates();

                if (geometry instanceof LineString && coordinates.length >= 2) {
                    // Calculate distance for LineString
                    const length = getLength(geometry);
                    const lengthInKm = length / 1000;
                    setLengthInKm(lengthInKm);
                    setAreaInKm(null);
                } else if (geometry instanceof Polygon) {
                    // Calculate area for Polygon
                    const area = getArea(geometry);
                    const areaInSqKm = area / 1000000;
                    setAreaInKm(areaInSqKm);
                    setLengthInKm(null);
                }
            });
        };

        // Initialize the drawing interaction with the default type (LineString)
        initializeDrawing(drawType);

        // Add modify and snap interactions
        const modify = new Modify({ source: vectorSource });
        map.addInteraction(modify);
        const snap = new Snap({ source: vectorSource });
        map.addInteraction(snap);

        return () => map.setTarget('');
    }, [mapRef, drawType]);

    const handleButtonClick = (type) => {
        // Set the drawing type based on the user's choice
        setDrawType(type);
        type==="Polygon"?setLengthInKm(null):setAreaInKm(null)
    };

    return (
        <>
            <div className="controls" style={{textAlign:"center"}}>
              <div className='buttonprnt' style={{display:"flex",gap:"1rem", padding:"1rem" ,justifyContent:"center"}}>
                <button onClick={() => handleButtonClick('LineString')}>Draw Line</button>
                <button onClick={() => handleButtonClick('Polygon')}>Draw Polygon</button>
                </div>
                {lengthInKilometer !== null && (
                    <p>{`Distance: ${lengthInKilometer.toFixed(2)} km`}</p>
                )}
                {areaInKilometer !== null && (
                    <p>{`Area: ${areaInKilometer.toFixed(2)} sq km`}</p>
                )}
            </div>
            <div
                className="map"
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
            ></div>
        </>
    );
};

export default OpenLayersMap;
