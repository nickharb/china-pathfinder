<script>
    import { fade } from 'svelte/transition';
    import { fly } from 'svelte/transition';
    import {hoveredCountry, hoveredArea, selectedCountry, selectedArea, hoveredInfo} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
    export let isHovered;
    export let offsetLeft;
    export let area;

    let offsetHeight;
</script>


{#if isHovered && area == $hoveredInfo}
    <div class="tooltip" transition:fly="{{ x: -10, duration: 200 }}" bind:clientHeight={offsetHeight} style="left: {offsetLeft}px; margin-top: -{offsetHeight/2-10}px;">
        <Icon type='tooltip-caret-left' />
        <p><slot /></p>
    </div>
{/if}

<style>
    .tooltip {
        position: absolute;
        z-index: 999;
        padding: 20px;
        background-color: white;
        border-radius: 2px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        transition: opacity 300ms, transform 300ms ease;
        width: 320px;
        height: auto;
        margin-left: 40px;
    }

    .tooltip p {
        margin: 0;
        font-size: 14px;
        font-weight: normal;
        color: #234462;
        line-height: 1.3;
    }
</style>






