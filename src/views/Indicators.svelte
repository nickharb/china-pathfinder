<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js"; // needed for the top dots vis (composite score)
    import loadIndicatorsData from "../data/load-indicators-data.js";
    import {view, areaInView} from '../stores/view';
    import {width, margin, scaleFactor, chartWidth} from '../stores/dimensions';
    import copyData from "../data/copy";
    import Icon from '../components/Icon.svelte';
    import CountrySelect from '../components/CountrySelect.svelte';
    import IndicatorVisual from '../components/IndicatorVisual.svelte';

    let data = [], indicatorsData = [], countryNames = [], areaData, graphData=[];

    // set default area view for dev purpose only
    // set to start with a specific indicator for dev
    // delete these lines for production
    if (!$areaInView) { 
        $areaInView = 'growth'; // pulled from /stores/view
    }

    const currentArea = copyData.filter(d=> (d.category=='main' && d.label == $areaInView))[0];

    onMount(async()=>{
        data = await loadData();
        indicatorsData = await loadIndicatorsData($areaInView);
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
    }

    $: if (indicatorsData) {
        // match indicators copy with the indicators data
        // it's not currently matching for a lack of real indicators data
        indicatorsData.forEach((d,i) => {

            let indicatorCopy = copyData.filter(x=> x.category == $areaInView);
            if (i >= indicatorCopy.length) {
                d.copy = {name: 'Placeholder indicator', definition:'This will be finalized when data comes in.',context:''};
            } else {
                d.copy = indicatorCopy[i];
            }
        })
    }


    function switchView(targetView, area) {
        $view = targetView;
        $areaInView = area;
    }

</script>

<div class='area-summary'>
    <button class='back' on:click|self={()=> switchView('main')}>Back</button>
    <div class='area-text'>
        <h1>{currentArea.name}</h1>
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

    <div class='control-area'>
        <CountrySelect {countryNames}/>
        <button>Share this view<Icon type='share' /></button>
    </div>

    {#each indicatorsData as indicator, i}
        <div class='indicator-container'>
        {#if i%2 == 0}
            <IndicatorVisual {indicator}/>
            <div class='indicator-text'>
                <div style='margin-top:{$chartWidth*0.3}px; padding-left:20px; border-left:1px solid #eee;' class='inner-container'>
                    <h3>{indicator.copy.name}</h3>
                    <div class='description'>{indicator.copy.definition}</div>
                    <button>Share this chart<Icon type='share' /></button>
                </div>
            </div>
        {:else}
            <div class='indicator-text'>
                <div style='float:right;margin-top:{$chartWidth*0.3}px; padding-right:20px; border-right:1px solid #eee;' class='inner-container'>
                    <h3>{indicator.copy.name}</h3>
                    <div class='description'>{indicator.copy.definition}</div>
                    <button>Share this chart<Icon type='share' /></button>
                </div>
            </div>
            <IndicatorVisual {indicator}/>
        {/if}
        </div>
    {/each}

</div>



<style>
    .area-summary,
    .indicators {
        /*max-width:1000px;*/
        /*text-align:left;
        margin: 1em auto;
        padding: 1em 0;*/
    }

    .area-summary {
        background-color: #EFF4F8;
        margin-bottom: 100px;
        padding: 40px;
        border-radius: 10px;
    }
    
    button.back {
        display: block;
        position: absolute;
        top: 0;
    }

    .area-text {
        display: flex;
        padding-bottom:1em;
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

    .indicator-container {
        display:flex;
    }

    .indicator-container h3 {
        margin-top:0;
    }
    .indicator-container .indicator-text {
        width:40%;
    }

    .indicator-container .indicator-text .inner-container {
        display:inline-block;
    }
    


    svg {
        /*position: absolute;*/
        /* fill: #f9f9f9; */
        /*fill:white;*/
        
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
        fill:#b90000;
        font-weight:bold;
    }

    g.China circle {
        fill:white;
        stroke:#b90000;
        stroke-width:2px;
        fill-opacity:1;
    }

    button {
        margin-top:1em;
    }


    
</style>