<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    import copyData from "../data/copy";
    import LandingVisual from "../components/LandingVisual.svelte";
    import CountrySelect from '../components/CountrySelect.svelte';
    export let showPrevious = false;
    let data = [], countryNames = [], areaData = [];

    import { csv } from 'd3';
    const dataPath = '../data/composite-score.csv';

    onMount(async()=>{
        data = await loadData();
        countryNames = data['countries'].filter(d=> d.country!=='China');
        areaData = data['areas'];
    });


</script>

<div class='control-area'>
    <CountrySelect {countryNames}/>

    <button>Share this view</button>
    
    <label class='time-toggle-box'>
            <input type=checkbox bind:checked={showPrevious}>
            Show China’s change since 2010
    </label>

</div>

<div class='vis-container'>

    <LandingVisual areaData={areaData} copyData={copyData.filter(d=>(d.category == 'main'))}/>

</div>

<style>
    .vis-container {
        max-width: 1000px;
        display: flex;
        text-align: left;
        margin: 1em auto;
        padding: 1em 0;
    }
</style>