// global vars available from all pages

import {writable} from "svelte/store";

export const view = writable();
export const areaInView = writable();