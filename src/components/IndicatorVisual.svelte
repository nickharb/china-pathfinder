<script>
    import * as d3 from 'd3';
    import {chartWidth, innerRadius} from '../stores/dimensions';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
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
        let startAngle = x(d.country);
        let endAngle = x(d.country) + x.bandwidth();
        let outerRadius = y(d.value);

        // let arc = d3.arc()
        //     .innerRadius($innerRadius)
        //     .outerRadius(outerRadius)
        //     .cornerRadius(2)
        //     .startAngle(startAngle)
        //     .endAngle(endAngle)
        //     .padAngle(0.18)
        //     .padRadius($innerRadius)();

        let arc = d3.arc()
            .innerRadius($innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(2)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .padAngle(2.48)
            .padRadius(5)();

        // adapted from d3 centroid function
        function centroid() {
            let r = ($innerRadius + outerRadius) / 2,
                a = (startAngle + endAngle) / 2 - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
        };

        d.path = arc;
        d.centroid = centroid();
        
        d.rotateAngle = (x(d.country) + x.bandwidth()/2) * 180 / Math.PI-90;

        d.tooltipX = d.rotateAngle;
        d.tooltipY = d.rotateAngle;

        // // computes if the text should be on the right or left of the bar
        // if (i >= indicator.values.length/2) {
        //     d.textRotate = 180; 
        //     d.textAnchor = 'end';
        // } else{
        //     d.textRotate = 0;
        //     d.textAnchor = 'start';
        // }
        // d.barLength = y(d.value)+10;
    });

    function pathMouseOver(e) {
        $hoveredCountry = e.path[1].dataset.id;
    }

    function pathMouseOut(e) {
        $hoveredCountry = '';
    }

    function pathClick(e) {
        $selectedCountry = e.path[1].dataset.id;
    }


</script>

<div class='indicator-vis'>

    <svg viewBox="0 0 {$chartWidth} {$chartWidth}" width={$chartWidth} height={$chartWidth}>
        <g transform='translate({$chartWidth/2},{$chartWidth/2})'>

            {#each indicator.values as country}
                <g class='country {country.id}'
                    data-id='{country.id}'
                    class:hovered='{country.id == $hoveredCountry}'
                    class:selected='{country.id == $selectedCountry || country.id == 'china'}'
                >

                    <path d={country.path} on:mouseover={pathMouseOver} on:mouseout={pathMouseOut} on:click={pathClick}></path>

                    <!-- <g transform='rotate({country.rotateAngle})translate({country.barLength},0)'>
                        <text 
                            transform='rotate({country.rotateAngle*-1})'
                            style='text-anchor:{country.textAnchor};'
                        >
                            {country.country}: {Math.round(country.value*10)/10}
                        </text>
                    </g> -->
                </g>
            {/each}

            <!-- <text dy="5" class='middle-text'>{indicator.indicator}</text> -->
            
        </g>
    </svg>

    {#each indicator.values as country}
        <div
            class="tooltip {'tooltip-' + country.id}"
            class:hovered='{country.id == $hoveredCountry}'
            class:selected='{country.id == $selectedCountry || country.id == 'china'}'
            style="left: {country.centroid[0]+($chartWidth/2) + 'px'}; top: {country.centroid[1]+($chartWidth/2) + 'px'}"
        >
            <Icon type='tooltip-caret-left' />
            <p>{country.country}</p>
            <p class="value">{parseFloat(country.value).toFixed(2)}</p>
        </div>
    {/each}

</div>


<style>
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

    /*.tooltip svg {
        position: absolute;
        top: 50%;
        left: -6px;
        margin-top: -6px;
    }*/

    .indicator-vis {
        position: relative;
    }

    .country path {
        fill: #84A9BC;
        transition: transform 300ms, fill 300ms ease;
        cursor: pointer;
    }

    /*.country text {
        pointer-events: none;
        font-size: 11px;
        fill-opacity: 0;
    }*/

    g.hovered path {
        fill: #C2D5DE;
        transform: scale(1.03);
    }

    g.selected path {
        fill: #234462;
    }

    g.china path {
        fill: #D13F36;
    }

    g.china.hovered path {
        fill: #FF5C52;
    }

    /*text.middle-text {
        text-anchor: middle;
        font-weight: 400;
        text-transform: capitalize;
        font-size: 12px;
    }*/



</style>