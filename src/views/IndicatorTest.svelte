<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import loadIndicatorsData from "../data/load-indicators-data.js";
    import {view, areaInView} from '../stores/view';
    import {width, margin, scaleFactor, chartWidth, innerRadius} from '../stores/dimensions';

    let indicatorsData = [];

    $areaInView = 'growth';
    $chartWidth = 500;
    $innerRadius = 50;

    let minRadius = $innerRadius + 10;
    let maxRadius = $chartWidth/2-$innerRadius;

    onMount(async()=>{
        indicatorsData = await loadIndicatorsData($areaInView);
        indicatorsData.forEach((indicator) => {
            calculateSunburst(indicator);
        });
    });

    function calculateSunburst(indicator) {
        let x = d3.scaleBand()
            .domain(indicator.values.map(d => d.country))
            .range([0, 2 * Math.PI])
            // .align(0);

        let y = d3.scalePow()
            .domain(d3.extent(indicator.values.map(d => parseFloat(d.value))))
            .range([minRadius, maxRadius])
            // .range([$innerRadius+20, $chartWidth/2-50])

        indicator.values.forEach((d,i) => {
            d.path = d3.arc()
                .innerRadius($innerRadius)
                .outerRadius(y(d.value))
                .cornerRadius(2)
                .startAngle(x(d.country))
                .endAngle(x(d.country) + x.bandwidth())
                .padAngle(0.18)
                .padRadius($innerRadius)();

            // text positioning
            d.rotateAngle = (x(d.country) + x.bandwidth()/2) * 180 / Math.PI-90;

            if (i >= indicator.values.length/2) {
                d.textRotate = 180;
                d.textAnchor = 'end';
            } else{
                d.textRotate = 0;
                d.textAnchor = 'start';
            }
            d.barLength = y(d.value)+10;
        });
    }


    // let arcGenerator = d3.arc()
    //     .innerRadius(50)
    //     // .outerRadius(100)
    //     .padAngle(.02)
    //     .padRadius(100)
    //     .cornerRadius(4);

    // let arcData = [
    //     {startAngle: 0, endAngle: 0.2, outerRadius: 200},
    //     {startAngle: 0.2, endAngle: 0.6, outerRadius: 180},
    //     {startAngle: 0.6, endAngle: 1.4, outerRadius: 150},
    //     {startAngle: 1.4, endAngle: 3, outerRadius: 100},
    //     {startAngle: 3, endAngle: 2* Math.PI, outerRadius: 60}
    // ];
      


</script>



{#each indicatorsData as indicator, i}

    <div class='indicator-container'>
        <div class='indicator-vis'>
            <svg viewBox="0 0 {$chartWidth} {$chartWidth}" width={$chartWidth} height={$chartWidth}>

                <g transform='translate({$chartWidth/2},{$chartWidth/2})'>

                    {#each indicator.values as country}

                        <g class='country {country.id}'>

                            <path d={country.path}></path>

                            <g transform='rotate({country.rotateAngle})translate({country.barLength},0)'>
                                <text 
                                    transform='rotate({country.rotateAngle*-1})'
                                    style='text-anchor:{country.textAnchor};'
                                >
                                    {country.country}: {Math.round(country.value*10)/10}
                                </text>
                            </g>

                        </g>
                        
                    {/each}
                    
                </g>
            </svg>
        </div>

    </div>

{/each}


<!-- <div class='vis'>
    <svg id='vis-container' width=960 height=640>
        <g transform='translate(200,200)'>
            {#each arcData as arc}
                <path d={arcGenerator(arc)}></path>
            {/each}
        </g>
    </svg>
</div> -->


<style>
    path {
        fill: orange;
    }

    text {
        font-size: 11px;
    }
</style>



