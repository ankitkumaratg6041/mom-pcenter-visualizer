import React, { useState } from "react";
import InputComponent from "./InputComponent";
import SublistsComponent from "./SublistsComponent";
import PCenterVisualizer from "./PCenterVisualizer";

function App() {
  const [inputData, setInputData] = useState({ numbers: [], k: 0 });

  // Handler to receive data from InputComponent
  function handleNumbersSubmit(data) {
    setInputData(data);
  }

  return (
    <div>
      {/* Input Component */}
      <InputComponent onNumbersSubmit={handleNumbersSubmit} />

      {/* SublistsComponent: Render only if numbers and k are valid */}
      {inputData.numbers.length > 0 && inputData.k > 0 ? (
        <SublistsComponent numbers={inputData.numbers} k={inputData.k} />
      ) : (
        <p>Please provide a valid array and k value.</p>
      )}

      <PCenterVisualizer></PCenterVisualizer>
    </div>
  );
}

export default App;
