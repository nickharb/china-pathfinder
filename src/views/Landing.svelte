<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    import copyData from "../data/copy";
    import LandingVisual from "../components/LandingVisual.svelte";
    import Quarterly from './Quarterly.svelte';
    import CountrySelect from '../components/CountrySelect.svelte';
    import Icon from '../components/Icon.svelte';
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

<section class='intro'>
    <h1>Where does China’s Economy Stand?</h1>
    <p>China is a global economic powerhouse, but its system remains dangerously opaque. Policymakers and financial experts dispute basic facts about what is happening inside China. To create a shared language on China’s economy, the China Pathfinder project scores China and other economies across six areas and presents an objective picture of China’s economy relative to the world.</p>
</section>
        
<section class='latest'>
    <Quarterly />
</section>

<header>
    <h2>2020 Annual Economic Benchmarks</h2>
    <h3>How Does China's Economic System Compare to Open Market Economies?</h3>
    <div class='control-area'>
        <CountrySelect {countryNames}/>
        <button>Share this view<Icon type='share' /></button>
    </div>
</header>

<div class='vis-container'>

    <LandingVisual areaData={areaData} copyData={copyData.filter(d=>(d.category == 'main'))}/>

</div>

<style>
    /* intro section */

    .intro {
        margin: 0 auto;
        margin-bottom: 70px;
        display: flex;
        justify-content: space-between;
    }

    .intro h1 {
        max-width: 350px;
        font-size: 38px;
    }

    .intro p {
        width: 61%;
        margin: 0;
        margin-top: 4px;
        font-size: 18px;
        letter-spacing: 0.02em;
        line-height: 1.8;
    }

    /* landing visual */

    header {
        margin-bottom: 40px;
    }

    header h2 {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 5px;
    }

    header h3 {
        font-size: 18px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 20px;
    }

    .control-area {
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .vis-container {
        display: flex;
        text-align: left;
        margin: 1em auto;
        padding: 1em 0;
    }


</style>







