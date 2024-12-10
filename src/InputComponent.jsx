import React, {useState} from 'react';

function InputComponent({onNumbersSubmit}){

    const [inputValue, setInputValue] = useState("");
    const [momArr, setMomArr] = useState([]);
    const [kValue, setKValue] = useState("");

    function handleInputChange(event){
        setInputValue(event.target.value);
    }

    function handleKChange(event){
        setKValue(event.target.value);
    }

    function handleSubmit(){
        // Now we will process the input string i.e. inputValue into an array of numbers
        const splitArr = inputValue.split(/[\s,]+/);
        const refinedNumArr = splitArr.map(Number).filter(n => !isNaN(n));
        setMomArr(refinedNumArr);

        const k = parseInt(kValue, 10);
        if(isNaN(k) || k <= 0 || k > refinedNumArr.length){
            alert(`Please enter a valid k (1 to ${refinedNumArr.length})`);
            return;
        }

        onNumbersSubmit({numbers: refinedNumArr, k});
    }

    return(
        <div className='inputArray'>
            <input 
                type="text" 
                placeholder='Enter numbers separated by spaces or commas'
                value={inputValue}
                onChange={handleInputChange}
                className='momInput'
            />

            <input
                type="number"
                placeholder="Enter k (position of smallest element)"
                value={kValue}
                onChange={handleKChange}
            />

            <button onClick={handleSubmit} className='submitNumbers'>Submit Numbers</button>
            <div className='result'>
                <h1 className='userArrHeading'>Entered Numbers: </h1>
                <p>{momArr.join(", ")}</p>
            </div>
        </div>
    );
}

export default InputComponent;