<script>
    import * as d3 from 'd3';
    // import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import {width, height, margin, scaleFactor, chartWidth, innerRadius} from '../stores/dimensions';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
    import IndicatorTooltip from '../components/IndicatorTooltip.svelte';
    export let indicator;

    // $chartWidth = window.innerWidth * 0.2;

    let isMobile = (window.innerWidth < 450) ? true : false;
    let isLargeMobile = (window.innerWidth < 768) ? true : false;
    let isTablet = (window.innerWidth < 1080) ? true : false;

    // $chartWidth = 200;
    $innerRadius = 40;

    if (isMobile) {
        $chartWidth = 300;
    } else if (isLargeMobile) {
        $chartWidth = 400;
    } else if (isTablet) {
        $chartWidth = 300;
    } else {
        $chartWidth = 500;
    }

    let offsetWidth;
    let offsetHeight;
    let minRadius = $innerRadius + 20;
    let maxRadius = $chartWidth/2-$innerRadius-20;

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

        let arc = d3.arc()
            .innerRadius($innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(0)
            .startAngle(startAngle + 0.20) // 0.15
            .endAngle(endAngle)
            .padAngle(0) // 2.48
            .padRadius(0)(); // 5

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

        // computes if the text should be on the right or left of the bar
        if (i >= indicator.values.length/2) {
            d.textRotate = 180; 
            d.textAnchor = 'end';
        } else{
            d.textRotate = 0;
            d.textAnchor = 'start';
        }
        d.barLength = y(d.value)+10;
    });

    let isHovered = false;
    // let indicatorIsHovered = false;

    function mouseOver(e) {
        isHovered = true;
        $hoveredCountry = e.path[1].dataset.id;
    }

    function mouseLeave(e) {
        isHovered = false;
        $hoveredCountry = '';
    }

    function mouseClick(e) {
        if (e.path[1].dataset.id !== 'china' && e.path[1].dataset.id !== 'open-economy-avg') {
            $selectedCountry = e.path[1].dataset.id;
        }
    }

    // function pathMouseOver(e) {
    //     $hoveredCountry = e.path[1].dataset.id;
    // }

    // function pathMouseOut(e) {
    //     $hoveredCountry = '';
    // }

    // function pathClick(e) {
    //     $selectedCountry = e.path[1].dataset.id;
    // }

    // onMount(function() {
    //     let indicators = d3.selectAll('.indicator');
    //     indicators.each(function(el, i) {
    //         let box = d3.select(this).node().getBBox();
    //         console.log(box);
    //     });
    // });


</script>

<div class={$$props.class} bind:clientWidth={$chartWidth}>

    <!-- <svg viewBox="0 0 {$chartWidth} {$chartWidth}" width={$chartWidth} height={$chartWidth}> -->
        <!-- <g class="indicator" transform='translate({$chartWidth/2},{$chartWidth/2})'> -->

    <!-- <svg viewBox="0 0 {$chartWidth} {$height}"
        width={$chartWidth}
        height={$height}> -->

    <svg viewBox="0 0 {$chartWidth} {$chartWidth}"
        width={$chartWidth}
        height={$chartWidth}>

        <g class="indicator" transform='translate({$chartWidth/2},{$chartWidth/2})'>

            {#each indicator.values as country}
                <g class='country {country.id}'
                    data-id='{country.id}'
                    class:hovered='{country.id == $hoveredCountry}'
                    class:selected='{country.id == $selectedCountry || country.id == 'china' || country.id == 'open-economy-avg'}'
                >

                    <!-- <path d={country.path} on:mouseover={pathMouseOver} on:mouseout={pathMouseOut} on:click={pathClick}></path> -->

                    <path
                        d={country.path}
                        on:mouseover={mouseOver}
                        on:mouseleave={mouseLeave}
                        on:click={mouseClick}
                    ></path>

                    <!-- country labels -->
                    {#if country.id == $selectedCountry || country.id == 'china' || country.id == 'open-economy-avg'}
                        <g transition:fly="{{ y: 10, duration: 200 }}" transform='rotate({country.rotateAngle})translate({country.barLength},0)'>
                            <text 
                                transform='rotate({country.rotateAngle*-1})'
                                style='text-anchor:{country.textAnchor};'
                            >
                                {country.country}
                            </text>
                        </g>
                    {/if}
                </g>
            {/each}

            <!-- <text dy="-5" class='middle-title'>{indicator.copy.title1}</text> -->
            <!-- <text dy="15" class='middle-subtitle'>{indicator.copy.title2}</text> -->
            <!-- <foreignObject x="-60" y="5" width="120" height="60">
                <p class="subtitle">{indicator.copy.title2}</p>
            </foreignObject> -->
            
        </g>
    </svg>

    {#each indicator.values as graph}
        <IndicatorTooltip isHovered={isHovered} graph={graph} />
    {/each}

    <!-- {#each indicator.values as country}
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
    {/each} -->

</div>


<style>

    svg {
        /*border: 1px solid lightpink;*/
    }

    /* indicator tooltips */

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

    .indicator-vis {
        position: relative;
        margin: 0 auto;
    }

    @media (min-width: 768px) {
        .indicator-vis {
            position: relative;
            margin: 0;
        }

        .align-left {
            order: 1;
        }

        .align-right {
            order: 2;
        }
    }

    .country path {
        fill: #84A9BC;
        transition: transform 300ms, fill 300ms ease;
        cursor: pointer;
    }

    g.hovered path {
        fill: #234462;
        transform: scale(1.03);
    }

    g.selected path {
        fill: #234462;
    }

    g.china path {
        fill: #D13F36;
        /*background-color: #F6D9D7;*/
    }

    g.china-2010.hovered path,
    g.china-2010.selected path {
        fill: #A13F36;
        /*background-color: #ECD9D7;*/
    }

    g.open-economy-avg path {
        fill: #D18B36;
        /*background-color: #F6E8D7;*/
    }

    g.china.hovered path {
        /*fill: #FF5C52;*/
    }

    /* country label */

    .country text {
        fill: #444444;
        text-anchor: middle;
        pointer-events: none;
    }

    .country.selected text {
        fill: #234462;
        font-weight: bold;
    }

    .country.china text {
        fill: #D13F36;
        font-weight: bold;
    }

    .country.china-2010 text {
        fill: #A13F36;
        font-weight: bold;
    }

    .country.open-economy-avg text {
        fill: #D18B36;
        font-weight: bold;
    }

    /* indicator middle labels */

    /*text.middle-title {
        text-anchor: middle;
        font-weight: 600;
        font-size: 20px;
    }

    text.middle-subtitle {
        text-anchor: middle;
        font-weight: normal;
        font-size: 12px;
        width: 50px;
    }

    .subtitle {
        text-align: center;
        font-size: 13px;
        margin: 0;
    }*/

    



</style>