<script>
    import * as d3 from 'd3';
    import {chartWidth, innerR} from '../stores/dimensions';
    export let indicator;
    
    $chartWidth = window.innerWidth*0.5;

    let x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain( indicator.values.map(d=> d.country));

    let y = d3.scalePow(2) 
    // d3.scaleSqrt() makes less dramatic effect
        .domain(d3.extent(indicator.values.map(d=>d.value)))
        .range([$innerR+20, $chartWidth/2-50])


    indicator.values.forEach((d,i)=>{
        d.path = d3.arc()
            .innerRadius($innerR)
            .outerRadius(y(d.value))
            // .outerRadius($innerR+50)
            .startAngle(x(d.country))
            .endAngle(x(d.country) + x.bandwidth())
            .padAngle(0.04)
            .padRadius($innerR)();
        
        d.rotateAngel = (x(d.country) + x.bandwidth()/2) * 180 / Math.PI-90;

        if (i>=indicator.values.length/2){
            d.textRotate = 180; 
            d.textAnchor = 'end';
        } else{
            d.textRotate = 0;
            d.textAnchor = 'start';
        }
        d.barLength = y(d.value)+10;
    })


</script>

<div class='indicator-vis'>
<svg  viewBox="0 0 {$chartWidth} {$chartWidth}">
    <g transform='translate({$chartWidth/2},{$chartWidth/2})'>
        {#each indicator.values as country}
            <g class='country {country.country}'>
                <path d={country.path}></path>
                <g transform='rotate({country.rotateAngel})translate({country.barLength},0)'>
                    <text 
                    transform='rotate({country.rotateAngel*-1})'
                    style='text-anchor:{country.textAnchor};'
                    >{country.country}: {Math.round(country.value*10)/10}</text>
                </g>
            </g>
            
        {/each}

        <text dy="5" class='middle-text'>{indicator.indicator}</text>
        
    </g>
</svg>
</div>


<style>
    .indicator-vis {
        width:55%;
    }

    .country {
        fill:#cccccc;
    }
    .country text {
        pointer-events:none;
        font-size:14px;
        fill-opacity:0;
    }
    .China.country {
        fill:#444444;
    }
    .China.country text{
        fill-opacity:1;
    }

    text.middle-text {
        text-anchor:middle;
        font-weight:400;
        text-transform:capitalize;
        font-size:1.3em;
    }



</style>