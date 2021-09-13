<script>
    export let countryNames;
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
</script>

<div class='country-select'>
    Compare <span>China</span> with
    <div class='country-toggle-box'>
        <select bind:value={$selectedCountry}>
            {#each countryNames as country}
                <option value={country.id}>{country.country}</option>
            {/each}
        </select>
        <Icon type='caret-down-dark' />
    </div>
</div>

<style>
    .country-select {
        font-weight: bold;
        color: #122431;
        font-size: 20px;
    }

    .country-select span {
        padding: 5px 10px;
        margin: 0 5px;
        font-weight: bold;
        border-radius: 4px;
        background-color: #F6D9D7;
        color: #D13F36;
    }

    .country-toggle-box {
        display: inline-block;
        margin-left: 10px;
    }

    select {
        cursor: pointer;
    }
</style>