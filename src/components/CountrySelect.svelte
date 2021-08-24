<script>
    export let countryNames;
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
</script>

<div class='country-select'>
    Compare <span>China</span> with
    <div class='country-toggle-box'>
        <select bind:value={$selectedCountry}>
            {#each countryNames as country}
                <option value={country.id}>{country.country}</option>
            {/each}
        </select>
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
        background-color: #FFD9D9;
        color: #FF0202;
    }

    .country-toggle-box {
        display: inline-block;
        margin-left: 10px;
    }
</style>