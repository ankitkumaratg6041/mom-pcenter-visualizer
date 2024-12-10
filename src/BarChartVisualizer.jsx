import React from "react";
import "./BarChartVisualizer.css";

function BarChartVisualizer({ currentArray, pivot, smaller, equal, greater }) {
    const maxVal = Math.max(...currentArray); // For normalized height
    const minVal = Math.min(...currentArray); // To highlight minimum

    return (
        <div className="bar-chart-container">
            {currentArray.map((value, index) => {
                const isPivot = value === pivot;
                const isSmaller = smaller && smaller.includes(value);
                const isEqual = equal && equal.includes(value);
                const isGreater = greater && greater.includes(value);
                const isMax = value === maxVal;
                const isMin = value === minVal;

                return (
                    <div
                        key={index}
                        className={`bar ${isPivot ? "pivot" : ""} 
                            ${isSmaller ? "smaller" : ""} 
                            ${isEqual ? "equal" : ""} 
                            ${isGreater ? "greater" : ""} 
                            ${isMax ? "max" : ""} 
                            ${isMin ? "min" : ""}`}
                        style={{ height: `${(value / maxVal) * 100}%` }}
                        role="progressbar"
                        aria-valuenow={value}
                        aria-label={`Value: ${value}, ${isPivot ? "Pivot" : ""} 
                            ${isSmaller ? "Smaller" : ""} 
                            ${isEqual ? "Equal" : ""} 
                            ${isGreater ? "Greater" : ""}`}
                    >
                        {value}
                    </div>
                );
            })}
        </div>
    );
}

export default BarChartVisualizer;
