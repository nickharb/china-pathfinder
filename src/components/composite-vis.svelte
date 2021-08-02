<script>
    import * as d3 from 'd3';
    import { width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    export let areaData;
    export let copyData;
    import {areaInView, view} from '../stores/view';

    function switchView(targetView, area) {
        $view = targetView;
        $areaInView = area;
    }


    $: if (areaData) {

        const xScale = d3.scaleLinear().domain([1,10]).range([$margin*3, $width-$margin*3]);
        areaData.forEach( (d,i) => {
            if (d3.select('.text-wrapper .'+d.area).size()>0) {

                const textRect = d3.select('.text-wrapper .'+d.area).node().getBoundingClientRect();
                d.offsetY = textRect.top 
                    - d3.select('.text-wrapper').node().getBoundingClientRect().top
                    + $margin*2;

                d.graphData = d.comps.map((m, n)=>{
                    let distance = i<5 ? (xScale(areaData[i+1]['comps'][n]) - xScale(m)) : 0;
                    let points = i<5 ? ([
                        [0 , 0],
                        [distance, textRect.bottom - textRect.top + $margin*2]
                        // [distance, ($height-$margin*5)/5]
                    ]) : ([[0,0],[0,0]]);
                    
                    let path = utils.cubicBezier(points[0],points[1],20);


                    return {
                        x : xScale(m),
                        y : 0,
                        r : $scaleFactor,
                        country : d.countries[n],
                        path: path
                    };
                });
            }
            // remove overlaps -- needs to be refined
            // utils.noOverlap(d.graphData, $scaleFactor*2);

            
        })

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
        {#each areaData as area,i}
            <g class="{area.area}" transform='translate({$margin},{area.offsetY})'>
                <line class='gridline' x2={$width}></line>
                {#each area.graphData as graph,i}
                    <g class='country {graph.country}' transform='translate({graph.x},{graph.y})'>
                        <path d={graph.path}></path>
                        <circle r={graph.r} class='country-circle'></circle>
                        <text y='-10px'>{graph.country}</text>
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

    .area h2:before {
        content:'';
        position:absolute;
        left:-24px;
        top:0;
        width:20px;
        height:25px;
        background-image: url('../assets/sunburst-01.svg');
    }
    .area .description {
        font-size:0.9em;
        display:inline;
    }
    .area .description span {
        color: steelblue; /*placeholder color*/
        font-style:italic;
        text-decoration: underline dotted;
        cursor:pointer;
    }

    .vis-wrapper {
        position: relative;
        width:99%;
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
    path {
        stroke:#cccccc;
        fill:none;
        stroke-width:1px;
        mix-blend-mode: multiply;
        stroke-opacity: 0.5;
    }
    g.China circle {
        fill:white;
        stroke:red;
        stroke-width:2px;
        fill-opacity:1;
    }
    g.China path {
        stroke:red;
        stroke-width:2px;
        stroke-opacity: 1;
    }

    .gridline {
        stroke:#eeeeee;

    }

</style>