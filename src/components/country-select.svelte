<script>
    export let countryNames;
</script>

<div class='country-select'>
    How China compares with 
    <div class='country-toggle-box'>

        <select>
            {#each countryNames as country}
                <option>{country.country}</option>
            {/each}
        </select>

    </div>

</div>

<style>
    .country-toggle-box {
        display:inline-block;
        
    }
</style>