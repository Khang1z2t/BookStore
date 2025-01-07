import {useCallback, useState} from "react";

function useDebouncedInput(initialValue, delay) {
    const [value, setValue] = useState(initialValue);

    // const debouncedChangeHandler = useCallback(
    //     debounce((newValue) => setValue(newValue), delay),
    //     []
    // );

    const handleChange = (event) => {
        // debouncedChangeHandler(event.target.value);
    };

    return [value, handleChange];
}

export default useDebouncedInput;