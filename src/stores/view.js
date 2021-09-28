// global vars available from all pages

import {writable} from "svelte/store";

export const view = writable('main');
export const areaInView = writable('fdi');