<script>
    export let countryNames;
    import { onMount } from "svelte";
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
    import Selectr from 'mobius1-selectr';

    let selector;

    // todo - write this better so it doesn't have a set timeout
    onMount(() => {
        setTimeout(function() {
            selector = new Selectr('#country-select', {
                searchable: false,
                width: 500
            });
        }, 500);
    });

    $: $selectedCountry, setSelector();

    function setSelector() {
        if (selector) {
            selector.setValue($selectedCountry);
        }
    }
    
</script>

<div class='country-select-container'>
    Compare <span>China</span> with
    <div class='country-toggle-box {$selectedCountry}'>
        <select id='country-select' bind:value={$selectedCountry}>
            {#each countryNames as country, i}
                <option value={country.id}>{country.country}</option>
            {/each}
        </select>
    </div>
</div>

<style>
    .country-select-container {
        font-weight: bold;
        color: #122431;
        font-size: 14px;
        margin-bottom: 30px;
        z-index: 100;
        margin-right: 20px;
    }

    @media (min-width: 768px) {
        .country-select-container {
            font-size: 20px;
            margin-bottom: 0;
            margin-right: 0;
            display: flex;
            align-items: center;
        }
    }

    .country-select-container span {
        padding: 2px 10px;
        margin: 0 1px;
        font-weight: bold;
        border-radius: 4px;
        background-color: #F6D9D7;
        color: #D13F36;
    }

    @media (min-width: 768px) {
        .country-select-container span {
            margin: 0 5px;
        }
    }

    .country-toggle-box {
        display: inline-block;
        margin-left: 2px;
    }

    @media (min-width: 768px) {
        .country-toggle-box {
            margin-left: 10px;
        }
    }
</style>




