import {writable, derived} from "svelte/store";

export const width = writable();
export const height = writable();
export const margin = derived(width, ($width) => ($width/100));
export const scaleFactor = derived(width, ($width) => ($width/200));

