<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js"; // needed for the top dots vis (composite score)
    import loadIndicatorsData from "../data/load-indicators-data.js";
    import {view, areaInView} from '../stores/view';
    import {width, margin, scaleFactor, chartWidth} from '../stores/dimensions';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
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

    function circleMouseOver(e) {
        $hoveredCountry = e.path[1].dataset.id;
    }

    function circleMouseOut(e) {
        $hoveredCountry = '';
    }

    function circleClick(e) {
        $selectedCountry = e.path[1].dataset.id;
    }

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
                id : areaData.countries[i].trim().toLowerCase().split(" ").join("-"),
                x : xScale(d),
                y : 0,
                r : 6,
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

<!-- Header area -->
<div class='area-summary'>
    <button class='back' on:click|self={()=> switchView('main')}>Back</button>
    <div class='area-text'>
        <h1>{currentArea.name}</h1>
        <div class='area-vis' bind:clientWidth={$width}>
            <svg viewBox="0 0 {$width} 60"
                width={$width}
                height='50'>
                {#if areaData}
                    <g class="{areaData.area}" transform='translate({$margin},{$margin*4})'>

                        <text x='0' y='0' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Least open</text>
                        <text x='{$width-$margin}' y='0' text-anchor='end' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Most open</text>

                        <line class='gridline' x2={$width} transform='translate(0,5)'></line>

                        {#each graphData as graph,i}

                            <g class='country {graph.id}'
                                data-id='{graph.id}'
                                transform='translate({graph.x},{graph.y+5})'
                                class:hovered='{graph.id == $hoveredCountry}'
                                class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                            >
                                
                                <circle r={graph.r} class='country-circle' on:mouseover={circleMouseOver} on:mouseout={circleMouseOut} on:click={circleClick}></circle>
                                <text class='label' y='-10px'>{graph.country}</text>
                            </g>

                            <!-- <g class='country {graph.id}' transform='translate({graph.x},{graph.y+5})'>
                                <circle r={graph.r} class='country-circle'></circle>
                                <text class='label' y='-10px'>{graph.country}</text>
                            </g> -->

                        {/each}

                    </g>
                {/if}
            
            </svg>
        </div>
    </div>
    <div class='description'>{currentArea.context}</div>
    <button>Expand to read more<Icon type='chevron-down' /></button>
</div>

<!-- Secondary indicator charts container -->
<div class='indicators'>
    <h2>Assessing {currentArea.name.toLowerCase()}</h2>

    <div class='control-area'>
        <CountrySelect {countryNames}/>
        <button>Share this view<Icon type='share' /></button>
    </div>

    <!-- Alternate indicator charts on left and right -->
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
        align-items: center;
        margin-bottom: 20px;
    }

    .area-text h1 {
        width: 30%;
        padding-right: 10px;
        margin: 0;
        display: inline-block;
    }
    
    .area-text .area-vis {
        position: relative;
        /*max-width: 500px;*/
        width: 70%;
    }

    .description {
        max-width: 620px;
    }

    .indicator-container {
        display: flex;
    }

    .indicator-container h3 {
        margin-top: 0;
    }
    .indicator-container .indicator-text {
        width: 40%;
    }

    .indicator-container .indicator-text .inner-container {
        display: inline-block;
    }

    circle.country-circle {
        fill: #84A9BC;
        stroke: #fff;
        stroke-width: 2px;
    }

    /*.vis-wrapper path {
        stroke: #84A9BC;
        fill: none;
        stroke-width: 1px;
        mix-blend-mode: multiply;
        stroke-opacity: 0.2;
    }*/

    g.hovered circle {
        fill: #234462;
        stroke: #fff;
    }

    /*g.selected path {
        stroke: #234462;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.selected circle {
        fill: #234462;
        stroke: #fff;
    }*/

    g.selected circle {
        fill: #234462;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china circle {
        fill: #D13F36;
        stroke: #fff;
        stroke-width: 2px;
    }

    .gridline {
        stroke: #84A9BC;
    }

    text {
        pointer-events: none;
    }

    text.label {
        fill: #444444;
        text-anchor: middle;
        fill-opacity: 0;
    }

    g.selected text {
        fill: #234462;
        font-weight: bold;
        fill-opacity: 1;
    }

    g.china text {
        fill: #D13F36;
        font-weight: bold;
        fill-opacity: 1;
    }

    button {
        margin-top: 20px;
    }


    
</style>