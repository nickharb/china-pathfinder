<script>
    import { fade } from 'svelte/transition';
    import { fly } from 'svelte/transition';
    import {hoveredCountry, hoveredArea, selectedCountry, selectedArea} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
    // export let area;
    export let graph;
    export let isHovered;

    let offsetWidth;
</script>

{#if isHovered && graph.id == $hoveredCountry}
    <div
        class="tooltip"
        class:china="{graph.id == 'china'}"
        class:china-2010="{graph.id == 'china-2010'}"
        class:open-economy-avg="{graph.id == 'open-economy-avg'}"
        transition:fly="{{ y: -5, duration: 200 }}"
        bind:clientWidth={offsetWidth}
        style="left: {graph.x}px; top: {45}px; margin-left: {-offsetWidth/2}px;"
    >
        <svg class="tooltip-caret-up" width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M6 0L11.1962 6L0.803848 6L6 0Z" />
        </svg>
        <h3>{graph.country}</h3>
        <!-- <p>{graph.score} / 10</p> -->
        <p class="value">{parseFloat(graph.value).toFixed(2)} / 10</p>
    </div>
{/if}

<style>
    .tooltip {
        position: absolute;
        z-index: 999;
        padding: 7px 10px;
        background-color: #E7EDF3;
        /*background-color: #fff;*/
        border-radius: 2px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        transition: opacity 300ms, transform 300ms ease;
        color: #234462;
        text-align: center;
    }

    .tooltip h3 {
        font-size: 16px;
        margin: 0;
        font-weight: bold;
        white-space: nowrap;
        line-height: 1.2;
        color: #234462;
    }

    .tooltip p {
        margin: 0;
        font-weight: normal;
        font-size: 16px;
        white-space: nowrap;
        line-height: 1.2;
        color: #234462;
    }

    .tooltip.china {
        background-color: #F6D9D7;
    }

    .tooltip.china h3,
    .tooltip.china p {
        color: #D13F36;
    }

    .tooltip.china-2010 {
        background-color: #ECD9D7;
    }

    .tooltip.china-2010 h3,
    .tooltip.china-2010 p {
        color: #A13F36;
    }

    .tooltip.open-economy-avg {
        background-color: #F6E8D7;
    }

    .tooltip.open-economy-avg h3,
    .tooltip.open-economy-avg p {
        color: #D18B36;
    }

    .tooltip-caret-up {
        position: absolute;
        top: 0;
        margin-top: -6px;
        left: 50%;
        margin-left: -6px;
        fill: #E7EDF3;
    }

    .tooltip.china svg {
        fill: #F6D9D7;
    }

    .tooltip.china-2010 svg {
        fill: #ECD9D7;
    }

    .tooltip.open-economy-avg svg {
        fill: #F6E8D7;
    }
</style>











