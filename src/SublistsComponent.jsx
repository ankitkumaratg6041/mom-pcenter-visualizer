import React, { useState, useEffect } from "react";
import BarChartVisualizer from "./BarChartVisualizer";

function SublistsComponent({ numbers, k }) {
    const [kthSmallest, setKthSmallest] = useState(null);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false); // Track play state
    const [intervalId, setIntervalId] = useState(null); // Store interval ID for cleanup

    function splitAndSortSublists(arr) {
        const result = [];
        for (let i = 0; i < arr.length; i += 5) {
            let sublist = arr.slice(i, i + 5);
            sublist.sort((a, b) => a - b);
            result.push(sublist);
        }
        return result;
    }

    function getMedianIndex(sublist) {
        return Math.floor(sublist.length / 2);
    }

    let originalArr = numbers;
    const constValue = k;
    function findKthSmallest(arr, k, stepTracker) {
        if (arr.length <= 5) {
            arr.sort((a, b) => a - b);
            stepTracker.push({ action: "Final Sort", array: [...arr], k });
            return arr[k - 1];
        }

        const sublists = splitAndSortSublists(arr);
        stepTracker.push({ action: "Sublists Created", sublists });

        const medians = sublists.map(sublist => sublist[getMedianIndex(sublist)]);
        stepTracker.push({ action: "Medians Collected", medians });

        const pivot = findKthSmallest(medians, Math.floor(medians.length / 2) + 1, stepTracker);
        stepTracker.push({ action: "Pivot Selected", pivot });

        const smaller = originalArr.filter(x => x < pivot);
        const equal = originalArr.filter(x => x === pivot);
        const greater = originalArr.filter(x => x > pivot);
        stepTracker.push({ action: "Array Partitioned", array: arr, smaller, equal, greater, pivot });

        if (constValue <= smaller.length) {
            originalArr = smaller;
            return findKthSmallest(smaller, k, stepTracker);
        } else if (constValue <= smaller.length + equal.length) {
            return pivot; // kth smallest is the pivot
        } else {
            originalArr = greater;
            return findKthSmallest(greater, k - smaller.length - equal.length, stepTracker);
        }
    }

    function handleNextStep() {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    }

    function handlePreviousStep() {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    }

    function handlePlay() {
        if (isPlaying) {
            // If already playing, stop and reset
            clearInterval(intervalId);
            setIsPlaying(false);
            setCurrentStepIndex(0);
        } else {
            // Start playing
            setIsPlaying(true);
            const id = setInterval(() => {
                setCurrentStepIndex(prev => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        clearInterval(id); // Stop when finished
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, 1000); // Change speed by adjusting interval
            setIntervalId(id);
        }
    }

    useEffect(() => {
        if (numbers.length > 0 && k > 0) {
            const stepTracker = [];
            const result = findKthSmallest(numbers, k, stepTracker);
            setSteps(stepTracker);
            setKthSmallest(result);
        }
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [numbers, k]);

    const currentStep = steps[currentStepIndex];

    return (
        <div className="matrix-container">
            <div>
                <button onClick={handlePreviousStep} disabled={currentStepIndex === 0 || isPlaying}>
                    Previous
                </button>
                <button onClick={handleNextStep} disabled={currentStepIndex === steps.length - 1 || isPlaying}>
                    Next
                </button>
                <button onClick={handlePlay}>
                    {isPlaying ? "Reset" : "Play"}
                </button>
            </div>
            <h1 className="userArrHeading">Step {currentStepIndex + 1} of {steps.length}</h1>

            {currentStep && (
                <BarChartVisualizer
                    currentArray={currentStep.array || numbers}
                    pivot={currentStep.pivot || null}
                    smaller={currentStep.smaller || null}
                    equal={currentStep.equal || null}
                    greater={currentStep.greater || null}
                />
            )}

            {currentStep && (
                <>
                    {currentStep.action === "Sublists Created" && (
                        <div>
                            <h1 className="userArrHeading">Sublists:</h1>
                            <div className="sublists-alignment">
                                {currentStep.sublists.map((sublist, index) => (
                                    <div key={index} className="sublist-column">
                                        {sublist.map((num, idx) => {
                                            const isMedian = idx === getMedianIndex(sublist);
                                            return (
                                                <p
                                                    key={idx}
                                                    className={`matrix-item ${isMedian ? 'highlight-median' : ''}`}
                                                >
                                                    {num}
                                                </p>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {currentStep.action === "Medians Collected" && (
                        <div>
                            <h1 className="userArrHeading">Medians:</h1>
                            <p>{currentStep.medians.join(", ")}</p>
                        </div>
                    )}
                    {currentStep.action === "Pivot Selected" && (
                        <div>
                            <h1 className="userArrHeading">Pivot:</h1>
                            <p>{currentStep.pivot}</p>
                        </div>
                    )}
                    {currentStep.action === "Array Partitioned" && (
                        <div>
                            <h1 className="userArrHeading">Partitions:</h1>
                            <p>Smaller: {currentStep.smaller.join(", ")}</p>
                            <p>Equal: {currentStep.equal.join(", ")}</p>
                            <p>Greater: {currentStep.greater.join(", ")}</p>
                        </div>
                    )}
                    {currentStep.action === "Final Sort" && (
                        <div>
                            <h1 className="userArrHeading">Final Sorted Array:</h1>
                            <p>{currentStep.array.join(", ")}</p>
                        </div>
                    )}
                </>
            )}

            {kthSmallest !== null && (
                <h1 className="userArrHeading">
                    The {k}th smallest element is: <span className="highlight">{kthSmallest}</span>
                </h1>
            )}
        </div>
    );
}

export default SublistsComponent;
