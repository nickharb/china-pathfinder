<script>
    import * as d3 from 'd3';
    import * as _ from 'lodash';
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import {width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    export let areaData;
    export let copyData;
    import {areaInView, view} from '../stores/view';
    import {hoveredCountry, hoveredArea, selectedCountry, selectedArea, hoveredInfo} from '../stores/country-store.js';
    import {baseUrl, quarterlyUrl} from '../stores/urls.js';
    import Icon from './Icon.svelte';
    import Tooltip from './Tooltip.svelte';
    import InfoTooltip from './InfoTooltip.svelte';

    let descriptionWidth = 380;
    let offsetLeft = [];
    let chinaHidden = false;
    let labelPositions = {
        'australia': '-10px',
        'canada': '-10px',
        'china': '-10px',
        'china-2010': '-10px',
        'france': '-10px',
        'germany': '-10px',
        'italy': '-10px',
        'japan': '-10px',
        'open-economy-avg': '-10px',
        'south-korea': '-10px',
        'spain': '-10px',
        'united-kingdom': '-10px',
        'united-states': '-10px'
    }

    $selectedCountry = 'south-korea';

    const url = {
        'growth': $baseUrl + '/financial-system-development',
        'competition': $baseUrl + '/market-competition',
        'innovation': $baseUrl + '/modern-innovation-system',
        'trade': $baseUrl + '/trade-openness',
        'fdi': $baseUrl + '/direct-investment-openness',
        'portfolio': $baseUrl + '/portfolio-investment-openness'
    }

    function switchView(targetView, area) {
        // scroll to top
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        // reset view and area
        $view = targetView;
        $areaInView = area;
    }

    // event handlers
    
    let isHovered = false;
    let infoIsHovered = false;

    function mouseOver(e) {
        isHovered = true;
        let path = e.composedPath()[1];
        $hoveredCountry = path.dataset.id;
        $hoveredArea = path.dataset.area;
        d3.selectAll('.country.selected').raise(); // raises selected country circles
        d3.select(path).raise(); // raises hovered circle
    }

    function mouseLeave(e) {
        isHovered = false;
        $hoveredCountry = '';
        $hoveredArea = '';
    }

    function mouseClick(e) {
        let path = e.composedPath()[1];
        if (path.dataset.id !== 'china' && path.dataset.id !== 'open-economy-avg') {
            $selectedCountry = path.dataset.id;
            $selectedArea = path.dataset.area;
            d3.selectAll('.'+$selectedCountry).raise();
        }
    }

    function infoMouseOver(e) {
        infoIsHovered = true;
        $hoveredInfo = e.path[0].dataset.area;
    }

    function infoMouseLeave(e) {
        infoIsHovered = false;
        $hoveredInfo = '';
    }

    // parse data

    onMount(async()=>{
        parseData();
        setTimeout(positionLabels, 500);
    });

    function parseData() {
        const xScale = d3.scaleLinear().domain([0,10]).range([$margin*3, $width-$margin*3]);

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
                        [distance, textRect.bottom - textRect.top + $margin + 12]
                    ]) : ([[0,0],[0,0]]);
                    
                    let path = utils.cubicBezier(points[0], points[1], 10);

                    return {
                        id : d.countries[n].trim().toLowerCase().split(" ").join("-"),
                        x : xScale(m),
                        y : 0,
                        r : 6,
                        country : d.countries[n],
                        path: path,
                        score: d.comps[n]
                    };
                });
            }
        });
    }



    // reposition labels if they overlap

    function positionLabels() {
        
        let labelBounds = [];
        let selected = document.querySelectorAll('.country text');
        let chinaLabel = document.querySelector('.china text');
        let oecdLabel = document.querySelector('.open-economy-avg text');

        let china = {
            'left': chinaLabel.getBoundingClientRect().left,
            'right': chinaLabel.getBoundingClientRect().right,
            'width': chinaLabel.getBBox().width
        };
        let oecd = {
            'left': oecdLabel.getBoundingClientRect().left,
            'right': oecdLabel.getBoundingClientRect().right,
            'width': oecdLabel.getBBox().width
        };

        selected.forEach(function(country, i) {
            if (country.dataset.id !== 'china' && country.dataset.id !== 'open-economy-avg') {
                labelBounds.push({
                    'left': country.getBoundingClientRect().left,
                    'right': country.getBoundingClientRect().right,
                    'width': country.getBBox().width,
                    'id': country.dataset.id
                });
            }
        });

        for (let i in labelBounds) {
            let country = labelBounds[i];
            let id = country.id;

            if (country.left < china.right && country.right > china.right || country.right > china.left && country.left < china.left || country.left > china.left && country.right < china.right) {
                labelPositions[id] = '-27px';
            } else if (country.left < oecd.right && country.right > oecd.right || country.right > oecd.left && country.left < oecd.left || country.left > oecd.left && country.right < oecd.right) {
                labelPositions[id] = '-27px';
            } else {
                labelPositions[id] = '-10px';
            }
        }

        // check if china and oecd labels overlap
        if (china.left < oecd.right && china.right > oecd.right || china.right > oecd.left && china.left < oecd.left || china.left > oecd.left && china.right < oecd.right) {
            chinaHidden = true;
        }
    }

</script>


<div class='text-wrapper'  bind:clientHeight={$height}>
    {#each copyData as area, i}
        <div class={'area '+area.label.toLowerCase()}>
            <header>
                <h2 bind:clientWidth={offsetLeft[i]}>
                    <a href="{url[area.label.toLowerCase()]}">{area.name}</a>
                </h2>
                
                <div
                    class="info"
                    data-area='{area.name}'
                    on:mouseover={infoMouseOver}
                    on:mouseleave={infoMouseLeave}
                ><Icon type='info' /></div>
                <InfoTooltip isHovered={infoIsHovered} area={area.name} offsetLeft={offsetLeft[i]}>
                    {area.additional}
                </InfoTooltip>
            </header>
            <div class='description'>
                <p>{area.definition}</p>
                <button>
                    <a href="{url[area.label.toLowerCase()]}">
                        Explore data
                        <Icon type='chevron-right' />
                    </a>
                </button>
            </div>
        </div>
    {/each}
</div>

{#if areaData}
<div class='vis-wrapper' bind:clientWidth={$width}>
    <svg viewBox="0 0 {$width} {$height}"
        width={$width}
        height={$height}>

        <rect x="0" y="0" width={$width} height={$height}></rect>

        {#each areaData as area, i}

            {#if area.graphData}

            <g class="{area.area}" transform='translate({$margin},{area.offsetY})'>

                <text x='0' y='-5' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Low</text>
                <text x='{$width-$margin}' y='-5' text-anchor='end' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>High</text>

                <line class='gridline' x2={$width}></line>

                
                {#each area.graphData as graph, x}

                    <g class='country {graph.id}'
                        data-x='{graph.x}'
                        data-id='{graph.id}'
                        data-area='{area.area}'
                        transform='translate({graph.x},{graph.y})'
                        class:hovered='{graph.id == $hoveredCountry && area.area == $hoveredArea}'
                        class:selected='{graph.id == $selectedCountry || graph.id == 'china' || graph.id == 'open-economy-avg'}'
                        class:header='{i == 0}'
                    >

                        {#if i == 0}
                            <text
                                class='label'
                                class:hidden='{graph.id == 'china' && chinaHidden == true}'
                                data-id='{graph.id}'
                                y='{labelPositions[graph.id]}'
                            >
                                {graph.country}
                            </text>
                        {/if}

                        <path d={graph.path}></path>

                        <circle
                            r={graph.r}
                            class='country-circle'
                            on:mouseover={mouseOver}
                            on:mouseleave={mouseLeave}
                            on:click={mouseClick}
                        ></circle>
                    </g>

                {/each}

            </g>

            {/if}

        {/each}
        
    </svg>

    {#each areaData as area, i}
        {#if area.graphData}
            {#each area.graphData as graph, i}
                <Tooltip isHovered={isHovered} graph={graph} area={area} />
            {/each}
        {/if}
    {/each}
</div>

{/if}




<style>
    
    .hidden {
        display: none;
    }

    .info {
        display: none;
    }

    @media (min-width: 768px) {
        .info {
            display: block;
        }
    }

    .text-wrapper {
        width: 380px;
        margin-right: 20px;
        position: relative;
        z-index: 100;
        margin-top: 40px;
    }

    @media (min-width: 768px) {
        .text-wrapper {
            margin-top: 0;
        }
    }

    .area {
        margin-bottom: 30px;
    }

    .area header {
        margin-bottom: 10px;
        display: flex;
    }

    .area h2 {
        margin: 0;
        position: relative;
        cursor: pointer;
        font-size: 18px;
        flex: 0 0 auto;
    }

    .area a {
        text-decoration: none;
        transition: color 200ms;
    }

    .area h2 a {
        color: #122431;
    }

    .area h2 a:hover {
        color: #234462;
    }

    .area button a {
        color: #fff;
    }

    .description {
        margin-bottom: 0;
    }

    .description:after {
        content: ' ';
        padding: 20px;
    }

    @media (min-width: 768px) {
        .description:after {
            content: '';
            padding: 0;
        }
    }

    .description p {
        display: none;
        /*margin-bottom: 15px;*/
        font-size: 14px;
        line-height: 1.5;
        padding: 0;
        margin-top: 5px;
        margin-bottom: 10px;
    }

    @media (min-width: 768px) {
        .description p {
            display: block;
        }
    }

    .description button {
        height: 24px;
        font-size: 12px;
        /*margin-bottom: 20px;*/
    }

    @media (min-width: 768px) {
        .description button {
            /*margin-bottom: 20px;*/
        }
    }

    .vis-wrapper {
        position: absolute;
        width: 100%;
        top: 0;
        pointer-events: none;
    }

    @media (min-width: 768px) {
        .vis-wrapper {
            position: relative;
            margin-top: -22px;
            pointer-events: auto;
        }
    }

    .vis-wrapper svg {
        position: absolute;
        fill: #fff;
    }
    
    circle.country-circle {
        fill: #84A9BC;
        stroke: #fff;
        stroke-width: 2px;
        cursor: pointer;
    }

    .vis-wrapper path {
        stroke: #84A9BC;
        fill: none;
        stroke-width: 1px;
        mix-blend-mode: multiply;
        stroke-opacity: 0.2;
        transition: stroke 200ms, stroke-opacity 200ms;
    }

    g.hovered circle {
        fill: #234462;
        stroke: #fff;
    }

    g.selected path {
        stroke: #234462;
        stroke-width: 2px;
        /*stroke-opacity: 1;*/
    }

    @media (min-width: 768px) {
        g.selected path {
            stroke-opacity: 1;
        }
    }

    g.selected circle {
        fill: #234462;
        stroke: #fff;
    }

    g.china.selected circle {
        fill: #D13F36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china.selected path {
        stroke: #D13F36;
        stroke-width: 2px;
    }

    g.china-2010.selected circle {
        fill: #A13F36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china-2010.selected path {
        stroke: #A13F36;
        stroke-width: 2px;
    }

    g.open-economy-avg.selected circle {
        fill: #D18B36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.open-economy-avg.selected path {
        stroke: #D18B36;
        stroke-width: 2px;
    }

    .gridline {
        stroke: #84A9BC;
    }

    /* country label */

    text.label {
        text-anchor: middle;
        pointer-events: none;
        fill: #234462;
        font-weight: bold;
        opacity: 0;
        transform: translate(0,10px);
        transition: opacity 300ms, transform 300ms;
    }

    .selected text.label {
        opacity: 1;
        transform: translate(0,0);
    }

    g.china text.label {
        fill: #D13F36;
        opacity: 1;
    }

    g.china-2010 text.label {
        fill: #A13F36;
    }

    g.open-economy-avg text.label {
        fill: #D18B36;
        opacity: 1;
    }

    .chart-download .description {
        opacity: 0 !important;
    }
</style>





