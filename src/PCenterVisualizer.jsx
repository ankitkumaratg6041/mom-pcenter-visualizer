import React, { useState } from "react";
import "./PCenterVisualizer.css";

function PCenterVisualizer() {
    const [mode, setMode] = useState("demand"); // "demand" or "facility"
    const [demandPoints, setDemandPoints] = useState([]);
    const [facilityLocations, setFacilityLocations] = useState([]);
    const [numFacilities, setNumFacilities] = useState(0);
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [maxDistance, setMaxDistance] = useState(null);

    function handleCanvasClick(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (mode === "demand") {
            setDemandPoints(prev => [...prev, [x, y]]);
        } else if (mode === "facility") {
            setFacilityLocations(prev => [...prev, [x, y]]);
        }
    }

    function handleModeChange(newMode) {
        setMode(newMode);
    }

    function handleNumFacilitiesChange(event) {
        setNumFacilities(Number(event.target.value));
    }

    function calculatePCenter() {
        if (numFacilities <= 0 || demandPoints.length === 0 || facilityLocations.length === 0) {
            alert("Please provide valid inputs for demand points, facility locations, and number of facilities.");
            return;
        }

        const selected = []; // Array to store selected facilities
        let maxDist = Infinity;

        // Greedy heuristic for simplicity
        while (selected.length < numFacilities) {
            let bestLocation = null;
            let bestMaxDistance = Infinity;

            for (const candidate of facilityLocations) {
                if (selected.includes(candidate)) continue;

                const distances = demandPoints.map(
                    point =>
                        Math.min(
                            ...selected.map(facility => euclideanDistance(point, facility)),
                            euclideanDistance(point, candidate)
                        )
                );

                const candidateMaxDistance = Math.max(...distances);
                if (candidateMaxDistance < bestMaxDistance) {
                    bestMaxDistance = candidateMaxDistance;
                    bestLocation = candidate;
                }
            }

            if (bestLocation) {
                selected.push(bestLocation);
                maxDist = bestMaxDistance;
            }
        }

        setSelectedFacilities(selected);
        setMaxDistance(maxDist);
    }

    function euclideanDistance(point1, point2) {
        return Math.sqrt(
            Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
        );
    }

    return (
        <div className="p-center-container">
            <h1 className="p-center-heading">P-Center Facility Location Problem</h1>

            <div className="controls">
                <button onClick={() => handleModeChange("demand")} className={mode === "demand" ? "active" : ""}>
                    Demand Points
                </button>
                <button onClick={() => handleModeChange("facility")} className={mode === "facility" ? "active" : ""}>
                    Candidate Facilities
                </button>
                <label className="p-center-input">
                    Number of Facilities (p)
                    <input type="number" onChange={handleNumFacilitiesChange} />
                </label>
                <button onClick={calculatePCenter}>Calculate P-Center</button>
            </div>

            <div className="visualization">
                <svg width="1000" height="600" onClick={handleCanvasClick}>
                    {/* Render demand points */}
                    {demandPoints.map((point, index) => (
                        <circle
                            key={`demand-${index}`}
                            cx={point[0]}
                            cy={point[1]}
                            r="6"
                            fill="blue"
                        />
                    ))}

                    {/* Render candidate facilities */}
                    {facilityLocations.map((point, index) => (
                        <rect
                            key={`facility-${index}`}
                            x={point[0] - 5}
                            y={point[1] - 5}
                            width="13"
                            height="13"
                            fill="gray"
                        />
                    ))}

                    {/* Render selected facilities */}
                    {selectedFacilities.map((point, index) => (
                        <circle
                            key={`selected-${index}`}
                            cx={point[0]}
                            cy={point[1]}
                            r="8"
                            fill="red"
                        />
                    ))}
                </svg>
            </div>

            <h2>Results</h2>
            <p>Selected Facilities: {selectedFacilities.map(fac => `(${fac[0]}, ${fac[1]})`).join(", ")}</p>
            <p>Maximum Distance: {maxDistance}</p>
        </div>
    );
}

export default PCenterVisualizer;
