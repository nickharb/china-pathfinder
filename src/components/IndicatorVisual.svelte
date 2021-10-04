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

    let isMobile = (window.innerWidth <= 450) ? true : false;
    let isLargeMobile = (window.innerWidth <= 768) ? true : false;
    let isTablet = (window.innerWidth <= 1024) ? true : false;
    let isLaptop = (window.innerWidth <= 1280) ? true : false;

    // $chartWidth = 200;
    const radius = 300;
    
    let labelHidden = {};

    if (isMobile) {
        $chartWidth = 350;
        $innerRadius = 20;
        $margin = 10;
    } else if (isLargeMobile) {
        $chartWidth = 300;
        $innerRadius = 20;
        $margin = 10;
    } else if (isTablet) {
        $chartWidth = 400;
        $innerRadius = 30;
        $margin = 10;
    } else if (isLaptop) {
        $chartWidth = 500;
        $innerRadius = 40;
        $margin = 10;
    } else {
        $chartWidth = 600;
        $innerRadius = 40;
        $margin = 50;
    }

    let offsetWidth;
    let offsetHeight;
    let minRadius = $innerRadius + 20;
    let maxRadius = $chartWidth/2-$innerRadius-20;
    let anglePadding = 0.15;

    let x = d3.scaleBand()
        .domain(indicator.values.map(d => d.country))
        .range([0, 2 * Math.PI]);

    let y = d3.scalePow()
        .domain(d3.extent(indicator.values.map(d => parseFloat(d.value))))
        .range([minRadius, maxRadius])

    let outerRadiusMax = y(indicator.values[0].value);

    indicator.values.forEach((d,i) => {
        let startAngle = x(d.country);
        let endAngle = x(d.country) + x.bandwidth();
        let outerRadius = y(d.value);

        let arc = d3.arc()
            .innerRadius($innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(0)
            .startAngle(startAngle + anglePadding)
            // .startAngle(startAngle)
            .endAngle(endAngle)
            .padAngle(0)
            .padRadius(0)();

        var outerArc = d3.arc()
            .outerRadius(outerRadiusMax + 10)
            .innerRadius(outerRadiusMax + 10)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .padAngle(0)
            .padRadius(0)();

        // adapted from d3 centroid function
        function centroidTooltip() {
            let r = ($innerRadius + outerRadius) / 2,
                a = (startAngle + anglePadding + endAngle) / 2 - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
        }

        function centroidInner() {
            let padding = 10;
            let r = (outerRadius + outerRadius + padding) / 2,
                a = (startAngle + anglePadding + endAngle) / 2 - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
        }

        function centroidOuter() {
            let padding;
            if (outerRadius < 70) {
                padding = 150;
            } else {
                padding = 50;
            }

            let r = (outerRadius + outerRadius + padding) / 2,
                a = (startAngle + anglePadding + endAngle) / 2 - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
        }

        function midAngle() {
            return startAngle + (endAngle - startAngle + anglePadding) / 2;
        } 

        d.path = arc;
        d.outerPath = outerArc;
        d.centroid = centroidTooltip();

        // calculate line positions

        var innerPoint = centroidInner();
        var outerPoint = centroidOuter();

        d.points = [innerPoint[0]+','+innerPoint[1], outerPoint[0]+','+outerPoint[1]];

        d.translate = 'translate(' + (outerPoint[0]*1.03) + ',' + (outerPoint[1]*1.03) + ')';
        d.anchor = (midAngle()) < Math.PI ? 'start' : 'end';
        d.hidden = false;
    });

    function positionLabels() {
        
        let labelBounds = [];
        let svgContainer = document.getElementById(indicator.indicator);
        let svg = svgContainer.getBoundingClientRect();

        let labels = svgContainer.querySelectorAll('.label-container');

        labels.forEach(function(label, i) {
            labelBounds.push({
                'left': label.getBoundingClientRect().left,
                'right': label.getBoundingClientRect().right,
                'top': label.getBoundingClientRect().top,
                'bottom': label.getBoundingClientRect().bottom,
                'width': label.getBBox().width,
                'id': label.dataset.id
            });
        });

        labelBounds.forEach(function(label, i) {
            let id = label.id;

            if (label.left < svg.left || label.right > svg.right) {
                labelHidden[id] = true;
            } else if (label.top > svg.top || label.bottom < svg.bottom) {
                // labelHidden[id] = true;
            } else {
                labelHidden[id] = false;
            }
        });
    }

    // fix label overlap
    setTimeout(positionLabels, 500);

    let isHovered = false;

    function mouseOver(e) {
        isHovered = true;
        let path = e.composedPath()[1];
        $hoveredCountry = path.dataset.id;
    }

    function mouseLeave(e) {
        isHovered = false;
        $hoveredCountry = '';
    }

    function mouseClick(e) {
        let path = e.composedPath()[1];
        if (path.dataset.id !== 'china' && path.dataset.id !== 'open-economy-avg') {
            $selectedCountry = path.dataset.id;
        }
    }

</script>

<!-- <div class={$$props.class} bind:clientWidth={$chartWidth}> -->
<div class={$$props.class}>

    <!-- <svg viewBox="0 0 {$chartWidth} {$chartWidth}" width={$chartWidth} height={$chartWidth}> -->
        <!-- <g class="indicator" transform='translate({$chartWidth/2},{$chartWidth/2})'> -->

    <!-- <svg viewBox="0 0 {$chartWidth} {$height}"
        width={$chartWidth}
        height={$height}> -->

    <svg id="{indicator.indicator}" viewBox="0 0 {$chartWidth+$margin} {$chartWidth+$margin}"
        width={$chartWidth+$margin}
        height={$chartWidth+$margin}>

        <g class="indicator" transform='translate({($chartWidth+$margin)/2},{($chartWidth+$margin)/2})'>

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

                    <g class='label-container'
                        class:hidden='{labelHidden[country.id] == true}'
                        data-id='{country.id}'
                    >
                        <text
                            text-anchor={country.anchor}
                            transform={country.translate}
                        >{country.country}</text>
                        <polyline points="{country.points[0]} {country.points[1]}" fill="none" stroke="#84A9BC" />
                    </g>

                    <!-- <g class='lines'>
                        <path
                            d={country.outerPath}
                        ></path>
                    </g> -->

                    

                    <!-- {#if country.id == $selectedCountry || country.id == 'china' || country.id == 'open-economy-avg'}
                        <g transition:fly="{{ y: 10, duration: 200 }}" transform='rotate({country.rotateAngle})translate({country.barLength},0)'>
                            <text 
                                transform='rotate({country.rotateAngle*-1})'
                                style='text-anchor:{country.textAnchor};'
                            >
                                {country.country}
                            </text>
                        </g>
                    {/if} -->
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

    .hidden {
        display: none;
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
        fill: #234462;
        font-weight: bold;
        pointer-events: none;
        opacity: 0;
        transition: opacity 300ms;
    }

    .country polyline {
        opacity: 0;
        transition: opacity 300ms;
    }

    g.selected text {
        opacity: 1;
    }

    g.selected polyline {
        opacity: 1;
    }

    .country.china text {
        fill: #D13F36;
        font-weight: bold;
        opacity: 1;
    }

    .country.china-2010 text {
        fill: #A13F36;
        font-weight: bold;
    }

    .country.open-economy-avg text {
        fill: #D18B36;
        font-weight: bold;
        opacity: 1;
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