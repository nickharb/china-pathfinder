<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    import {view, areaInView} from '../stores/view';
    import {width, margin, scaleFactor} from '../stores/dimensions';
    import copyData from "../data/copy";

    import CountrySelect from '../components/country-select.svelte';

    let data = [], countryNames = [], areaData, graphData=[];

    //set default area view for dev purpose only
    if (!$areaInView) { 
        $areaInView = 'growth';
    }

    const currentArea = copyData.filter(d=> d.label == $areaInView)[0];

    onMount(async()=>{
        data = await loadData();
        countryNames = data['countries'].filter(d=> d.country!=='China');
        areaData = (data['areas']).filter(d=> d.area == $areaInView)[0];
    });

    $: if (areaData) {
        const xScale = d3.scaleLinear().domain([1,10]).range([$margin*3, $width-$margin*3]);

        areaData.comps.forEach((d,i)=>{
            graphData.push({
                    x : xScale(d),
                    y : 0,
                    r : $scaleFactor,
                    country : areaData.countries[i]
                });
        });
        console.log(areaData)


    }

    function switchView(targetView, area) {
        $view = targetView;
        $areaInView = area;
    }


</script>

<div class='area-summary'>
    <button on:click|self={()=> switchView('main')}>Back</button>
    <div class='area-text'>
        <h2>{currentArea.name}</h2>
        <div class='area-vis' bind:clientWidth={$width}>
            <svg viewBox="0 0 {$width} 100"
                width={$width}
                height='100'>
                {#if areaData}
                    <g class="{areaData.area}" transform='translate({$margin},{$margin*4})'>
                        <line class='gridline' x2={$width}></line>
                        {#each graphData as graph,i}
                        <g class='country {graph.country}' transform='translate({graph.x},{graph.y})'>
                            <circle r={graph.r} class='country-circle'></circle>
                            <text y='-10px'>{graph.country}</text>
                        </g>
                        {/each} 
                    </g>
                {/if}
            
            </svg>
        </div>
    </div>
    <div class='description'>{currentArea.context}</div>
    
</div>

<div class='indicators'>
    <h2>Assessing {currentArea.name.toLowerCase()}</h2>
    <CountrySelect {countryNames}/>
</div>



<style>
    .area-summary {
        max-width:1000px;
        text-align:left;
        margin: 1em auto;
        padding: 1em 0;
    }
    
    button {
        display:block;
    }
    .area-text {
        display: flex;
    }
    .area-text h2 {
        position: relative;
        width:30%;
        padding-right:2%;
        /* padding-left:25px; */
        margin-top:0;
        margin-bottom:0;
        display:inline-block;

    }
    .area-text .area-vis {
        position: relative;
        width:99%;
    }

    .description {
        max-width:620px;
    }
    .gridline {
        stroke:#eeeeee;

    }

    svg {
        position: absolute;
        /* fill: #f9f9f9; */
        fill:white;
        
    }
    circle.country-circle {
        fill:#666666;
        stroke:#f9f9f9;
        fill-opacity:0.5;
    }

    text {
        fill:#444444;
        text-anchor:middle;
        fill-opacity: 0;
    }

    g.China text {
        fill-opacity: 1;
    }

    
</style>