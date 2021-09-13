<script>
    import { fade } from 'svelte/transition';
    import { fly } from 'svelte/transition';
    import {hoveredCountry, hoveredArea, selectedCountry, selectedArea} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
    export let area;
    export let graph;
    export let isHovered;

    // console.log('area', area)
    // console.log('graph', graph)
</script>


{#if isHovered && graph.id == $hoveredCountry && graph.id == $selectedCountry || isHovered && graph.id == $hoveredCountry && graph.id == 'china'}
    <div class="tooltip" transition:fly="{{ x: -10, duration: 200 }}" style="left: {graph.x+25 + 'px'}; top: {area.offsetY-5 + 'px'}">
        <Icon type='tooltip-caret-left' />
        <p>{graph.score} / 10</p>
    </div>
{:else if isHovered && graph.id == $hoveredCountry && area.area == $hoveredArea}
    <div class="tooltip" transition:fly="{{ x: -10, duration: 200 }}" style="left: {graph.x+25 + 'px'}; top: {area.offsetY-5 + 'px'}">
        <Icon type='tooltip-caret-left' />
        <p>{graph.country}</p>
    </div>
{/if}

<style>
    .tooltip {
        position: absolute;
        z-index: 999;
        padding: 5px 10px;
        background-color: white;
        border-radius: 2px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        transition: opacity 300ms, transform 300ms ease;
        transform: translate(-10px, 0);
        height: 18px;
        margin-top: -9px;
        margin-left: 20px;
    }

    .tooltip p {
        margin: 0;
        font-size: 16px;
        font-weight: normal;
        text-align: center;
        color: #234462;
        line-height: 1.2;
        white-space: nowrap;
    }

    .tooltip p.value {
        display: none;
        font-weight: bold;
        font-size: 14px;
    }
</style>






