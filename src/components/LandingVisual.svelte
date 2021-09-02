<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import {width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    export let areaData;
    export let copyData;
    import {areaInView, view} from '../stores/view';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    import Icon from './Icon.svelte';

    // SVG basics
    // https://frontendmasters.com/courses/svg-essentials-animation/

    let tipWidth = 80;
    let tipHeight = 40;

    function switchView(targetView, area) {
        $view = targetView;
        $areaInView = area;

    }

    function circleMouseOver(e) {
        $hoveredCountry = e.path[1].dataset.id;
        // if ($selectedCountry = e.path[1].dataset.id) {
        //     let selectedTooltip = document.querySelectorAll('.tooltip-' + $hoveredCountry);
        //     selectedTooltip.forEach(node => node.classList.add('hovered'));
        // } else {
        //     let hoveredTooltip = document.querySelector('.tooltip-' + $hoveredCountry + '.tooltip-' + e.path[1].dataset.area);
        //     hoveredTooltip.classList.add('hovered');
        // }
    }

    function circleMouseOut(e) {
        $hoveredCountry = '';
        // let selectedTooltip = document.querySelectorAll('.tooltip');
        // selectedTooltip.forEach(node => node.classList.remove('hovered'));
    }

    function circleClick(e) {
        $selectedCountry = e.path[1].dataset.id;
    }

    $: if (areaData) {
        parseData();
    }

    function parseData() {
        const xScale = d3.scaleLinear().domain([1,10]).range([$margin*3, $width-$margin*3]);

        areaData.forEach( (d,i) => {
            if (d3.select('.text-wrapper .'+d.area).size()>0) {

                const textRect = d3.select('.text-wrapper .'+d.area).node().getBoundingClientRect();

                d.offsetY = textRect.top 
                    - d3.select('.text-wrapper').node().getBoundingClientRect().top
                    + $margin*2;

                // 
                d.graphData = d.comps.map((m, n)=>{
                    let distance = i<5 ? (xScale(areaData[i+1]['comps'][n]) - xScale(m)) : 0;
                    let points = i<5 ? ([
                        [0 , 0],
                        [distance, textRect.bottom - textRect.top + $margin*2]
                    ]) : ([[0,0],[0,0]]);
                    
                    let path = utils.cubicBezier(points[0], points[1], 0.5);

                    return {
                        id : d.countries[n].trim().toLowerCase().split(" ").join("-"),
                        x : xScale(m),
                        y : 0,
                        r : 6,
                        country : d.countries[n],
                        path: path,
                        score: d.comps[n]
                    };
                });
            }
        });
    }

</script>


<div class='text-wrapper'  bind:clientHeight={$height}>
    {#each copyData as area}
        <div class={'area '+area.label.toLowerCase()}>
            <h2 on:click|self={()=> switchView('indicators',area.label.toLowerCase())} on:mouseover={() => console.log('TEST')}>
                {area.name}
                <Icon type='info' />
            </h2>
            <div class='description'>
                <p>{area.definition}</p>
                <button on:click|self={()=> switchView('indicators',area.label.toLowerCase())}>
                    Explore data
                    <Icon type='chevron-right' />
                </button>
            </div>
        </div>
    {/each}

</div>


<div class='vis-wrapper' bind:clientWidth={$width}>
    <svg viewBox="0 0 {$width} {$height}"
        width={$width}
        height={$height}>

        <rect x="0" y="0" width={$width} height={$height}></rect>

        {#each areaData as area, i}

            <g class="{area.area}" transform='translate({$margin},{area.offsetY})'>

                <text x='0' y='-5' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Least open</text>
                <text x='{$width-$margin}' y='-5' text-anchor='end' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Most open</text>

                <line class='gridline' x2={$width}></line>

                {#each area.graphData as graph, i}

                    <g class='country {graph.id}'
                        data-id='{graph.id}'
                        data-area='{area.area}'
                        transform='translate({graph.x},{graph.y})'
                        class:hovered='{graph.id == $hoveredCountry}'
                        class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                    >
                        
                        <path d={graph.path}></path>
                        <circle r={graph.r} class='country-circle' on:mouseover={circleMouseOver} on:mouseout={circleMouseOut} on:click={circleClick}></circle>
                    </g>

                {/each}

            </g>

        {/each}
    </svg>

    {#each areaData as area, i}
        {#each area.graphData as graph, i}
            <div
                class="tooltip {'tooltip-' + graph.id} {'tooltip-' + area.area}"
                style="left: {graph.x + 'px'}; top: {area.offsetY + 'px'}"
            >
                <p>{graph.score} / 10</p>
            </div>
        {/each}
    {/each}
</div>


<style>

    .tooltip {
        opacity: 0;
        position: absolute;
        z-index: 999;
        width: 60px;
        height: auto;
        padding: 10px;
        background-color: white;
        border: 2px solid #333;
        border-radius: 2px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        transition: opacity 500ms;
    }

    .tooltip p {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
    }

    .tooltip.hovered {
        opacity: 1;
    }
    
    .text-wrapper {
        width: 360px;
        margin-right: 20px;
    }

    .area {
        margin-bottom: 20px;
    }

    .area h2 {
        margin-top: 0;
        margin-bottom: 10px;
        position: relative;
        cursor: pointer;
    }

    .area h2 svg {
        margin-left: 3px;
    }

    .description {
        margin-bottom: 20px;
    }

    .description p {
        margin: 0;
        margin-bottom: 10px;
        font-size: 14px;
    }

    .description button {
        height: 23px;
        font-size: 12px;
    }

    .vis-wrapper {
        position: relative;
        width: 100%;
    }

    .vis-wrapper svg {
        position: absolute;
        fill: #fff;
    }
    
    circle.country-circle {
        fill: #84A9BC;
        stroke: #fff;
        stroke-width: 2px;
    }

    .vis-wrapper path {
        stroke: #84A9BC;
        fill: none;
        stroke-width: 1px;
        mix-blend-mode: multiply;
        stroke-opacity: 0.2;
    }

    g.hovered circle {
        fill: #234462;
        stroke: #fff;
    }

    g.selected path {
        stroke: #234462;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.selected circle {
        fill: #234462;
        stroke: #fff;
    }

    g.china.selected circle {
        fill: #FF0202;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china.selected path {
        stroke: #FF0202;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    .gridline {
        stroke: #84A9BC;
    }

</style>





