<script>
    import * as d3 from 'd3';
    import {chartWidth, innerRadius} from '../stores/dimensions';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    export let indicator;
    
    // $chartWidth = window.innerWidth * 0.2;
    $chartWidth = 500;
    $innerRadius = 50;

    let minRadius = $innerRadius + 10;
    let maxRadius = $chartWidth/2-$innerRadius;

    let x = d3.scaleBand()
        .domain(indicator.values.map(d => d.country))
        .range([0, 2 * Math.PI]);

    let y = d3.scalePow()
        .domain(d3.extent(indicator.values.map(d => parseFloat(d.value))))
        .range([minRadius, maxRadius])

    indicator.values.forEach((d,i) => {
        d.path = d3.arc()
            .innerRadius($innerRadius)
            .outerRadius(y(d.value))
            .cornerRadius(2)
            .startAngle(x(d.country))
            .endAngle(x(d.country) + x.bandwidth())
            .padAngle(0.18)
            .padRadius($innerRadius)();
        
        d.rotateAngle = (x(d.country) + x.bandwidth()/2) * 180 / Math.PI-90;

        // computes if the text should be on the right or left of the bar
        if (i >= indicator.values.length/2) {
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

                    <!-- <g class='country {graph.id}'
                        data-id='{graph.id}'
                        data-area='{area.area}'
                        transform='translate({graph.x},{graph.y})'
                        class:hovered='{graph.id == $hoveredCountry}'
                        class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                    >
                        
                        <path d={graph.path}></path>
                        <circle r={graph.r} class='country-circle' on:mouseover={circleMouseOver} on:mouseout={circleMouseOut} on:click={circleClick}></circle>
                    </g> -->

                </g>
                
            {/each}

            <text dy="5" class='middle-text'>{indicator.indicator}</text>
            
        </g>
    </svg>
</div>


<style>
    .indicator-vis {
        /*width: 300px;*/
    }

    .country {
        fill: #84A9BC;
    }

    .country text {
        pointer-events: none;
        font-size: 11px;
        fill-opacity: 0;
    }

    .china.country {
        fill: #D13F36;
    }

    .china.country text{
        fill-opacity: 1;
    }

    text.middle-text {
        text-anchor: middle;
        font-weight: 400;
        text-transform: capitalize;
        /*font-size: 1.3em;*/
        font-size: 12px;
    }



</style>