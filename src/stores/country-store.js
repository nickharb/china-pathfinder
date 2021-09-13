import {writable} from 'svelte/store'; // imports stores from main svelte code

// call writable function to create a store, pass a default value as an argument
export const hoveredCountry = writable();
export const hoveredArea = writable();
export const selectedCountry = writable();
export const selectedArea = writable();

