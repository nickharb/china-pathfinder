<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    import copyData from "../data/copy";
    import LandingVisual from "../components/LandingVisual.svelte";
    import CountrySelect from '../components/CountrySelect.svelte';
    export let showPrevious = false;
    let data = [], countryNames = [], domainData = [];

    import { csv } from 'd3';
    const dataPath = './data/composite-score.csv';

    onMount(async()=>{
        data = await csv(dataPath);

        let domains = ['growth','competition','innovation','trade','fdi','portfolio'];

        data.sort((a,b) => a.country == 'China' ? 1 : -1);

        let output = [];
        
        domains.forEach( (x) => { 
            output.push({
                domain: x, 
                comps: data.map(n => n[x]), 
                countries: data.map(n => n["country"])
            });
        });

        domainData = {countries: data, domains: output};
        countryNames = data.filter(d=> d.country!=='China');
        domainData = output;
    });

    onMount(async () => {
        data = await json('./data/movies.json');
        movieData = data;
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
    <LandingVisual domainData={domainData} copyData={copyData.filter(d=>(d.category == 'main'))}/>
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