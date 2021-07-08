<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    import copyData from "../data/copy";
    import CompositeVis from "../components/composite-vis.svelte";
    export let showPrevious = false;
    let data = [], countryNames = [], areaData = [];

    onMount(async()=>{
        data = await loadData();
        countryNames = data['countries'].filter(d=> d.country!=='China');
        areaData = data['areas'];
    });

</script>

<div class='control-area'>
    How China compares with 
    <div class='country-toggle-box'>

        <select>
            {#each countryNames as country}
                <option>{country.country}</option>
            {/each}
        </select>

    </div>
    <button>Share this view</button>
    <label class='time-toggle-box'>
            <input type=checkbox bind:checked={showPrevious}>
            Show China’s change since 2010
    </label>

</div>

<div class='vis-container'>
    <CompositeVis areaData={areaData} copyData={copyData}/>

</div>

<style>
    .vis-container {
        display: flex;
        margin: 1em auto;
        padding: 1em 0;
    }
</style>