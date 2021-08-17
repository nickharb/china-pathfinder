<script>
    import * as d3 from 'd3';
    import {width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    export let areaData;
    export let copyData;
    import {areaInView, view} from '../stores/view';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';

    let tipWidth = 80;
    let tipHeight = 40;

    function switchView(targetView, area) {
        $view = targetView;
        $areaInView = area;

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

    // country.Denmark - grab class on mouse over state to add styles and highlight color
    // each row has a g element
    // each country has its own element
    $: if (areaData) {

        const xScale = d3.scaleLinear().domain([1,10]).range([$margin*3, $width-$margin*3]);

        areaData.forEach( (d,i) => {
            if (d3.select('.text-wrapper .'+d.area).size()>0) {

                // get offset for each text box, position text to vis rows
                // svg height of each vis row is determined by the height of each text block
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
                        // [distance, ($height-$margin*5)/5]
                    ]) : ([[0,0],[0,0]]);
                    
                    // third argument is swerve of the curve
                    let path = utils.cubicBezier(points[0], points[1], 0.5); // compute path for each country using cubic bezier - pulls from utils

                    // computes the circle location for each country - primary composite score attribute
                    return {
                        id : d.countries[n].trim().toLowerCase(),
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

        <!-- <Defs /> -->
        <rect x="0" y="0" width={$width} height={$height}></rect>

        {#each areaData as area, i}

            <!-- each row gets its own g element -->
            <g class="{area.area}" transform='translate({$margin},{area.offsetY})'>

                <line class='gridline' x2={$width}></line>

                <!-- each country gets its own g element -->
                <!-- pre-computed values get fed into the g element -->
                {#each area.graphData as graph, i}

                    <g class='country {graph.country}'
                        data-id='{graph.id}'
                        transform='translate({graph.x},{graph.y})'
                        class:hovered='{graph.id == $hoveredCountry}'
                        class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                    >
                        
                        <path d={graph.path}></path>
                        <circle r={graph.r} class='country-circle' on:mouseover={circleMouseOver} on:mouseout={circleMouseOut} on:click={circleClick}></circle>
                        <g class='tooltip'>
                            <rect width={tipWidth} height={tipHeight}></rect>
                            <text>{graph.score} / 10</text>
                        </g>
                    </g>

                {/each}

            </g>

        {/each}
    </svg>
</div>


<style>
    
    .text-wrapper {
        position: relative;
        width:30%;
        padding-right:2%;
        padding-left:25px;
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
        fill: white;
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

    .tooltip rect {
        stroke: #333;
        fill: #fff;
        stroke-width: 2px;
    }

    .tooltip text {
        fill: #333;
        transform: translate(10px, 20px);
        alignment-baseline: middle;
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





