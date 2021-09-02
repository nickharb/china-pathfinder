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

<section id='intro'>
    <h1>Where does China's Economy Stand?</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget commodo a amet, maecenas imperdiet nulla elit non. Fermentum nulla consectetur imperdiet malesuada nulla. Amet risus consequat consectetur lorem ac leo nec morbi enim.</p>
</section>
        
<section class='latest'>
    <Quarterly />
</section>

<div class='control-area'>
    <CountrySelect {countryNames}/>

    <button>Share this view<Icon type='share' /></button>
    
    <!-- <label class='time-toggle-box'>
        <input type=checkbox bind:checked={showPrevious}>
        Show China’s change since 2010
    </label> -->

</div>

<div class='vis-container'>

    <LandingVisual areaData={areaData} copyData={copyData.filter(d=>(d.category == 'main'))}/>

</div>

<style>
    .vis-container {
        display: flex;
        text-align: left;
        margin: 1em auto;
        padding: 1em 0;
    }

    #intro {
        max-width: 600px;
        margin: 0 auto
    }
</style>

