<script>
    export let countryNames;
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
</script>

<div class='country-select'>
    How China compares with 
    <div class='country-toggle-box'>
        <select bind:value={$selectedCountry}>
            {#each countryNames as country}
                <option value={country.id}>{country.country}</option>
            {/each}
        </select>
        <p>
            Selected {$selectedCountry}
        </p>
    </div>
</div>

<style>
    .country-toggle-box {
        display: inline-block;
    }
</style>