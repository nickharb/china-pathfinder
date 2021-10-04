import {writable} from 'svelte/store'; // imports stores from main svelte code

// call writable function to create a store, pass a default value as an argument
export const hoveredCountry = writable();
export const hoveredArea = writable();
export const selectedCountry = writable('china-2010');
export const selectedArea = writable();
export const hoveredInfo = writable();




