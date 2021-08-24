<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import {width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    export let areaData;
    export let copyData;
    import {areaInView, view} from '../stores/view';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';

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
        // let selectedTooltip = Array.from(document.getElementsByClassName('tooltip-' + $hoveredCountry));
        let selectedTooltip = document.querySelectorAll('.tooltip-' + $hoveredCountry);
        selectedTooltip.forEach(node => node.classList.add('hovered'));
    }

    function circleMouseOut(e) {
        $hoveredCountry = '';
        let selectedTooltip = document.querySelectorAll('.tooltip');
        selectedTooltip.forEach(node => node.classList.remove('hovered'));
    }

    function circleClick(e) {
        $selectedCountry = e.path[1].dataset.id;
        // let element = document.querySelectorAll('.tooltip');
        // // console.log(element)
        // // var myNodeList = document.querySelectorAll('div');
        // element.forEach(node => node.classList.add('blue'));
        // console.log(element)
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
                        r : $scaleFactor,
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
            <h2 on:click|self={()=> switchView('indicators',area.label.toLowerCase())}>{area.name}</h2>
            <div class='description'>
                {area.definition}
                <span on:click|self={()=> switchView('indicators',area.label.toLowerCase())}>Click for details</span>
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

                <line class='gridline' x2={$width}></line>

                {#each area.graphData as graph, i}

                    <g class='country {graph.id}'
                        data-id='{graph.id}'
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
                class="tooltip {'tooltip-' + graph.id}"
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
        position: relative;
        width: 30%;
        padding-right: 2%;
        padding-left: 25px;
    }

    .area {
        margin-bottom:20px;
    }
    .area h2 {
        font-size:1.2em;
        margin-top:0;
        margin-bottom:0;
        display:inline-block;
        position:relative;
        cursor:pointer;
    }

    .area .description {
        font-size:0.9em;
        display:inline;
    }

    .area .description span {
        color: steelblue; /*placeholder color*/
        font-style: italic;
        text-decoration: underline dotted;
        cursor:pointer;
    }

    .vis-wrapper {
        position: relative;
        width: 99%;
    }

    svg {
        position: absolute;
        fill: #fff;
    }
    
    circle.country-circle {
        fill: #666666;
        stroke: #f9f9f9;
        fill-opacity: 0.5;
    }

    .tooltip {
        fill-opacity: 0;
        stroke-opacity: 0;
        transform: translate(10px, -20px);
        pointer-events: none;
    }

    .selected.hovered .tooltip {
        fill-opacity: 1;
        stroke-opacity: 1;
    }

    .tooltip-bg {
        stroke: #333;
        fill: #fff;
        stroke-width: 2px;
    }

    .tooltip text {
        fill: #333;
    }

    path {
        stroke:#cccccc;
        fill:none;
        stroke-width:1px;
        mix-blend-mode: multiply;
        stroke-opacity: 0.5;
    }

    g.China.selected circle {
        fill: white;
        stroke: red;
        stroke-width: 2px;
        fill-opacity:1;
    }

    g.China.selected path {
        stroke: red;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.hovered path {
        stroke: #333;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.hovered circle {
        fill: white;
        stroke: #333;
        stroke-width: 2px;
        fill-opacity:1;
    }

    g.selected path {
        stroke: blue;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.selected circle {
        fill: white;
        stroke: blue;
        stroke-width: 2px;
        fill-opacity:1;
    }

    .gridline {
        stroke: #eeeeee;

    }

</style>





