<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
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
    let expanded = false;

    // set area visual width
    let areaWidth = 750;
    let areaMargin = 20;

    // // TODO - dev only, delete these lines for production
    if (!$areaInView) { 
        $areaInView = 'fdi'; // pulled from /stores/view
    }

    const currentArea = copyData.filter(d=> (d.category=='main' && d.label == $areaInView))[0];

    // event handlers

    function expandButtonClick() {
        if (expanded == true) {
            expanded = false;
        } else {
            expanded = true;
        }
    }

    function circleMouseOver(e) {
        $hoveredCountry = e.path[1].dataset.id;
    }

    function circleMouseOut(e) {
        $hoveredCountry = '';
    }

    function circleClick(e) {
        $selectedCountry = e.path[1].dataset.id;
    }

    // load data

    onMount(async()=>{
        data = await loadData();
        indicatorsData = await loadIndicatorsData($areaInView);
        countryNames = data['countries'].filter(d => d.country!=='China' && d.country!=='Open Economy Avg');
        areaData = (data['areas']).filter(d=> d.area == $areaInView)[0];
    });

    // parse data

    $: if (areaData) {
        const xScale = d3.scaleLinear().domain([0,10]).range([areaMargin*3, areaWidth-areaMargin*3]);

        areaData.comps.forEach((d,i)=>{
            graphData.push({
                id : areaData.countries[i].trim().toLowerCase().split(" ").join("-"),
                x : xScale(d),
                y : 0,
                r : 6,
                country : areaData.countries[i],
                value: d
            });
        });
    }

    $: if (indicatorsData) {
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


<button class='back' on:click|self={()=> switchView('main')}>Back to Dashboard</button>

<div class='area-summary' class:expanded={expanded == true}>

    <div class="area-container">
        <div class='area-text'>
            <h1>{currentArea.name}</h1>
            <p class='intro'>{currentArea.context}</p>
        </div>

        <div class='area-vis'>
            <svg width='{areaWidth}' height='50'>
                {#if areaData}
                    <g class="{areaData.area}" transform='translate(0,{areaMargin})'>

                        <text x='0' y='0' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Least open</text>
                        <text x='{areaWidth}' y='0' text-anchor='end' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Most open</text>

                        <line class='gridline' x1=0 x2={areaWidth} transform='translate(0,5)'></line>

                        {#each graphData as graph, i}
                            <g class='country {graph.id}'
                                data-id='{graph.id}'
                                transform='translate({graph.x},{graph.y+5})'
                                class:hovered='{graph.id == $hoveredCountry}'
                                class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                            >
                                
                                <circle r={graph.r} class='country-circle' on:mouseover={circleMouseOver} on:mouseout={circleMouseOut} on:click={circleClick}></circle>
                                <text class='label' y='-10px'>{graph.country}</text>
                            </g>
                        {/each}
                    </g>
                {/if}
            </svg>

            {#if areaData}
                {#each graphData as graph, i}
                    <div
                        class="tooltip {'tooltip-' + graph.id}"
                        class:hovered='{graph.id == $hoveredCountry}'
                        class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                        style="left: {graph.x + 'px'}; top: {graph.y + 20 + 'px'}"
                    >
                        <Icon type='tooltip-caret-left' />
                        <p>{graph.country}</p>
                        <p class="value">{parseFloat(graph.value).toFixed(2)} / 10</p>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    {#if expanded}
        <div class="summary" transition:fade>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    {/if}
    
    <div class="area-footer">
        <button class="expand" on:click={expandButtonClick}>
            {#if !expanded}
                Expand to read more
            {:else}
                View less
            {/if}
            <svg class="caret-down-light" width="13" height="11" viewBox="0 0 13 11" fill="none">
                <path d="M7.36602 10.5C6.98112 11.1667 6.01887 11.1667 5.63397 10.5L0.870834 2.25C0.485934 1.58333 0.96706 0.75 1.73686 0.75L11.2631 0.750001C12.0329 0.750001 12.5141 1.58333 12.1292 2.25L7.36602 10.5Z" fill="#ffffff"/>
            </svg>
        </button>
        <div class="methodology">
            <a href="#">Methodology<Icon type="arrow-right" /></a>
        </div>
    </div>
</div>

<div class='indicators'>
    <header>
        <h2>Assessing {currentArea.name.toLowerCase()}</h2>
        <h3>Lorem ipsum dolor sit amet consectetur adipiscing elit commodo</h3>
        <div class='control-area'>
            <CountrySelect {countryNames}/>
            <button>Share this view<Icon type='share' /></button>
        </div>
    </header>

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

    /* header section */

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

    .area-summary {
        background-color: #EFF4F8;
        margin-bottom: 100px;
        padding: 40px;
        border-radius: 10px;
    }

    .intro {
        margin: 0;
    }

    button.expand {
        min-width: 180px;
        position: relative;
    }

    .caret-down-light {
        position: absolute;
        top: 8px;
        right: 10px;
        transform: rotate(0deg);
        transition: transform 500ms;
    }

    .expanded .caret-down-light {
        transform: rotate(180deg);
    }

    .area-container {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .area-text {
        max-width: 400px;
        margin-right: 40px;
    }

    .area-text h1 {
        margin: 0;
        margin-bottom: 15px;
        font-size: 36px;
        font-weight: 600;
        line-height: 1;
    }
    
    .area-vis {
        margin-top: 40px;
        position: relative;
    }

    .area-footer {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .methodology a {
        color: #122431;
        text-decoration: underline;
        font-weight: bold;
        font-size: 14px;
        text-transform: uppercase;
    }

    /* tooltip */

    .tooltip {
        opacity: 0;
        position: absolute;
        z-index: 999;
        padding: 5px 10px;
        background-color: white;
        border-radius: 2px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        transition: opacity 300ms, transform 300ms ease;
        transform: translate(-10px, 0);
        height: 18px;
        margin-top: -9px;
        margin-left: 20px;
    }

    .tooltip.hovered {
        opacity: 1;
        transform: translate(0, 0);
    }

    .tooltip p {
        margin: 0;
        font-size: 16px;
        font-weight: normal;
        text-align: center;
        color: #234462;
        line-height: 1.2;
        white-space: nowrap;
    }

    .tooltip p.value {
        display: none;
        font-weight: bold;
        font-size: 14px;
    }

    .tooltip.selected {
        height: 36px;
        margin-top: -18px;
    }

    .tooltip.selected p.value {
        display: block;
    }

    /* indicator visual */

    .indicator-container {
        display: flex;
        justify-content: center;
    }

    .indicator-container h3 {
        margin-top: 0;
    }
    .indicator-container .indicator-text {
        /*width: 40%;*/
        width: 350px;
    }

    .indicator-container .indicator-text .inner-container {
        display: inline-block;
    }

    circle.country-circle {
        fill: #84A9BC;
        stroke: #fff;
        stroke-width: 2px;
        cursor: pointer;
        transform: scale(1);
        transition: transform 200ms, fill 200ms;
    }

    g.hovered circle {
        fill: #C2D5DE;
        transform: scale(1.2);
    }

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

    g.china.hovered circle {
        fill: #FF5C52;
    }

    .gridline {
        stroke: #84A9BC;
    }

    text {
        pointer-events: none;
        transition: fill-opacity 200ms;
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

    /* buttons */

    button {
        margin-top: 20px;
    }

    /* temporary back button */
    /* TODO - change this to close button */
    
    button.back {
        display: block;
        margin: 0;
        margin-bottom: 20px;
    }


    
</style>