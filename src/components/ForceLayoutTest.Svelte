<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import {width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    export let areaData;
    export let copyData;
    import {areaInView, view} from '../stores/view';
    import {hoveredCountry, hoveredArea, selectedCountry, selectedArea, hoveredInfo} from '../stores/country-store.js';
    import Icon from './Icon.svelte';
    import Tooltip from './Tooltip.svelte';
    import InfoTooltip from './InfoTooltip.svelte';

    let descriptionWidth = 380;
    let offsetLeft = [];

    // onMount(function() {
    //     setTimeout(positionLabels, 500);
    // });

    setTimeout(positionLabels, 500);

    function positionLabels() {
        let labels = [];

        let labelWidth = 50;
        let selected = d3.selectAll('.country.header.selected');

        // grab target x value from each selected header element
        selected.each(function(label, i) {
            let x = this.dataset.x;
            let text = d3.select(this).select('text');
            labels[i] = {fy: 0, targetX: parseFloat(x), id: this.dataset.id};
        });

        // Define a custom force
        const forceClamp = (min, max) => {
            let nodes;
            const force = () => {
              nodes.forEach(n => {
                if (n.x > max) n.x = max;
                if (n.x < min) n.x = min;
              });
            };
            force.initialize = (_) => nodes = _;
            return force;
        }

        const force = d3.forceSimulation()
            .nodes(labels)
            .force('collide', d3.forceCollide(labelWidth / 2))
            // .force('x', d3.forceX(d => d.targetX).strength(1))
            // .force('clamp', forceClamp(0, width))
            .stop();

        for (let i = 0; i < 300; i++) { force.tick() };

        selected.each(function(label, i) {
            let id = this.dataset.id;
            d3.select(this).select('text')
                .attr('x', labels[i].x);
        });
    }

    // function positionLabels() {
    //     let labels = [];

    //     // let labels = [
    //     //     {
    //     //         fx:0,
    //     //         targetY:529.452
    //     //     },
    //     //     {
    //     //         fx:0,
    //     //         targetY:535.416
    //     //     },
    //     //     {
    //     //         fx:0,
    //     //         targetY:315.59999999999997
    //     //     }
    //     // ];

    //     let labelWidth = 50;
    //     let selected = d3.selectAll('.country.header.selected');

    //     // grab target x value from each selected header element
    //     selected.each(function(label, i) {
    //         let x = this.dataset.x;
    //         let id = this.dataset.id;
    //         let text = d3.select(this).select('text');
    //         labels[i] = {fx: 0, targetX: parseFloat(x), id: id};
    //         // labels[id] = {fy: 0, targetX: parseFloat(x)};
    //     });

    //     // Define a custom force
    //     const forceClamp = (min, max) => {
    //         let nodes;
    //         const force = () => {
    //           nodes.forEach(n => {
    //             // if (n.y > max) n.y = max;
    //             // if (n.y < min) n.y = min;
    //             if (n.x > max) n.x = max;
    //             if (n.x < min) n.x = min;
    //           });
    //         };
    //         force.initialize = (_) => nodes = _;
    //         return force;
    //     }

    //     const force = d3.forceSimulation()
    //         .nodes(labels)
    //         .force('collide', d3.forceCollide(labelWidth / 2))
    //         // .force('x', d3.forceX(d => d.targetX).strength(1))
    //         // .force('clamp', forceClamp(0, width))
    //         .stop();

    //     for (let i = 0; i < 300; i++) { force.tick() };

    //     function findLabel(id) {
    //         let el;
    //         labels.forEach(function(l) {
    //             // console.log(id, l.id)
    //             if (l.id == id) {
    //                 // console.log(l)
    //                 el = l;
    //             }
    //         });
    //         return el;
    //     }

    //     selected.each(function(label, i) {
    //         let id = this.dataset.id;
    //         // let l = _.filter(labels, { 'id': id });
    //         let l = findLabel(id);
    //         console.log(l)
    //         d3.select(this).select('text')
    //             .attr('x', l.x);
    //     });
    // }

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
        $hoveredCountry = e.path[1].dataset.id;
        $hoveredArea = e.path[1].dataset.area;
        d3.selectAll('.country.selected').raise(); // raises selected country circles
        d3.select(e.path[1]).raise(); // raises hovered circle
    }

    function mouseLeave(e) {
        isHovered = false;
        $hoveredCountry = '';
        $hoveredArea = '';
    }

    function mouseClick(e) {
        $selectedCountry = e.path[1].dataset.id;
        $selectedArea = e.path[1].dataset.area;
        d3.selectAll('.'+$selectedCountry).raise(); // raises selected country circles
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

    $: if (areaData) {
        parseData();
    }

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
                        [distance, textRect.bottom - textRect.top + $margin*2]
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
</script>

<!-- area header -->
<div class='text-wrapper'  bind:clientHeight={$height}>
    {#each copyData as area, i}
        <div class={'area '+area.label.toLowerCase()}>
            <header>
                <h2 on:click|self={()=> switchView('indicators',area.label.toLowerCase())} bind:clientWidth={offsetLeft[i]}>
                    {area.name}
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
                <button on:click|self={()=> switchView('indicators', area.label.toLowerCase())}>
                    Explore data
                    <Icon type='chevron-right' />
                </button>
            </div>
        </div>
    {/each}
</div>

<!-- composite visual -->
<div class='vis-wrapper' bind:clientWidth={$width}>
    <svg viewBox="0 0 {$width} {$height}"
        width={$width}
        height={$height}>

        <rect x="0" y="0" width={$width} height={$height}></rect>

        {#each areaData as area, i}

            <g class="{area.area}" transform='translate({$margin},{area.offsetY})'>

                <text x='0' y='-5' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Low</text>
                <text x='{$width-$margin}' y='-5' text-anchor='end' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>High</text>

                <line class='gridline' x2={$width}></line>

                {#each area.graphData as graph}

                    <g class='country {graph.id}'
                        data-id='{graph.id}'
                        data-area='{area.area}'
                        transform='translate({graph.x},{graph.y})'
                        class:hovered='{graph.id == $hoveredCountry && area.area == $hoveredArea}'
                        class:selected='{graph.id == $selectedCountry || graph.id == 'china' || graph.id == 'open-economy-avg'}'
                    >
                        <!-- top country labels -->
                        {#if i == 0 && graph.id == $selectedCountry || i == 0 && graph.id == 'china' || i == 0 && graph.id == 'open-economy-avg'}
                            <text class='label' y='-10px' transition:fly="{{ y: 10, duration: 200 }}">{graph.country}</text>
                        {/if}
                        <!-- country path -->
                        <path d={graph.path}></path>
                        <!-- country circle -->
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

        {/each}
    </svg>

    <!-- area vis tooltips -->
    {#each areaData as area, i}
        {#each area.graphData as graph, i}
            <Tooltip isHovered={isHovered} graph={graph} area={area} />
        {/each}
    {/each}
</div>




<style>
    .info {
        cursor: pointer;
        display: block;
        padding-right: 5px;
    }

    .text-wrapper {
        width: 380px;
        margin-right: 20px;
        position: relative;
    }

    .area {
        margin-bottom: 40px;
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
    }

    .area h2 svg {
        margin-left: 3px;
    }

    .description {
        margin-bottom: 20px;
    }

    .description p {
        margin: 0;
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 1.5;
    }

    .description button {
        height: 23px;
        font-size: 12px;
        margin-bottom: 20px;
    }

    .vis-wrapper {
        position: relative;
        width: 100%;
        margin-top: -22px;
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
        stroke-opacity: 1;
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
        stroke-opacity: 1;
    }

    g.china-2010.selected circle {
        fill: #A13F36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china-2010.selected path {
        stroke: #A13F36;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.open-economy-avg.selected circle {
        fill: #D18B36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.open-economy-avg.selected path {
        stroke: #D18B36;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    .gridline {
        stroke: #84A9BC;
    }

    /* country label */

    text.label {
        fill: #444444;
        text-anchor: middle;
        pointer-events: none;
    }

    g.selected text.label {
        fill: #234462;
        font-weight: bold;
    }

    g.china text.label {
        fill: #D13F36;
        font-weight: bold;
    }

    g.china-2010 text.label {
        fill: #A13F36;
        font-weight: bold;
    }

    g.open-economy-avg text.label {
        fill: #D18B36;
        font-weight: bold;
    }

</style>



