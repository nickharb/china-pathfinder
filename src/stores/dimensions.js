import {writable, derived} from "svelte/store";

export const width = writable(300);
export const height = writable(200);
export const margin = writable(20);
// export const margin = derived(width, ($width) => ($width/100));
export const scaleFactor = derived(width, ($width) => ($width/150));

// for sunburst charts
export const chartWidth = writable();
export const innerRadius = writable(50);
// export const innerR = derived(chartWidth, ($chartWidth) => ($chartWidth/6));
