import {writable} from 'svelte/store'; // imports stores from main svelte code

// call writable function to create a store, pass a default value as an argument
const selectedCountry = writable('0');

export default selectedCountry; // export this store so it can be used outside the file