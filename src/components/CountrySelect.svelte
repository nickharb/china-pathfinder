<script>
    export let countryNames;
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
</script>

<div class='country-select'>
    Compare <span>China</span> with
    <div class='country-toggle-box {$selectedCountry}'>
        <select bind:value={$selectedCountry}>
            {#each countryNames as country}
                <option value={country.id}>{country.country}</option>
            {/each}
        </select>
        <!-- <Icon type='caret-down-dark' /> -->
        <svg class="caret-down-dark" width="13" height="11" viewBox="0 0 13 11" fill="none">
            <path d="M7.36602 10.5C6.98112 11.1667 6.01887 11.1667 5.63397 10.5L0.870834 2.25C0.485934 1.58333 0.96706 0.75 1.73686 0.75L11.2631 0.750001C12.0329 0.750001 12.5141 1.58333 12.1292 2.25L7.36602 10.5Z" />
        </svg>
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
        min-width: 190px;
        transition: color 300ms, background-color 300ms;
        outline: none;
    }

    .china-2010 select {
        color: #A13F36;
        background-color: #ECD9D7;
    }

    .caret-down-dark {
        margin-left: -25px;
        margin-top: -5px;
        fill: #234462;
        pointer-events: none;
        transition: fill 300ms;
    }

    .china-2010 .caret-down-dark {
        fill: #A13F36;
    }
</style>




