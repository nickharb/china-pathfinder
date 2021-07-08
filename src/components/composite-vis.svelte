<script>
    import * as d3 from 'd3';
    import { width, height, margin, scaleFactor } from '../stores/dimensions';
    import cubicBezier from "../utils";
    export let areaData;
    export let copyData;

    // const curve = d3.line(d=>d[0], d=>d[1]).curve(d3.curveCatmullRom.alpha(0.5));

    $: if (areaData) {
        const xScale = d3.scaleLinear().domain([1,10]).range([$margin*3, $width-$margin*3]);
        areaData.forEach( (d,i) => {


            d.graphData = d.comps.map((m, n)=>{
                let distance = i<5 ? (xScale(areaData[i+1]['comps'][n]) - xScale(m)) : 0;
                let points = i<5 ? ([
                    [0 , 0],
                    [distance, ($height-$margin*5)/5]
                ]) : ([[0,0],[0,0]]);
                
                let path = cubicBezier(points[0],points[1],0);


                return {
                    x : xScale(m),
                    y : 0,
                    r : $scaleFactor,
                    country : d.countries[n],
                    path: path //curve(pts)
                };
            });
        })
        console.log(areaData)
    }



</script>

<div class='text-wrapper'  bind:clientHeight={$height}>
    {#each copyData as area}
        <div class='area'>
            <h2>{area.name}</h2>
            <div class='description'>{area.definition}</div>
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
            <g class="{area.area}" transform='translate({$margin},{($height-$margin*5)/5*i + $margin*2})'>
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
    }

    /* .area {
        max-height:200px;
    } */

    .vis-wrapper {
        position: relative;
        width:99%;
    }
    svg {
        position: absolute;
        fill: #f9f9f9;
        
    }
    circle.country-circle {
        fill:#666666;
        fill-opacity:0.9;
    }
    text {
        fill:#444444;
        text-anchor:middle;
        fill-opacity: 0;
    }
    path {
        stroke:#cccccc;
        fill:none;
        stroke-width:2px;
        /* mix-blend-mode: multiply; */
        /* stroke-opacity: 0.5; */
    }
    g.China circle {
        fill:white;
        stroke:red;
        stroke-width:2px;
    }
    g.China path {
        stroke:red;
        /* stroke-width:2px; */
    }

</style>