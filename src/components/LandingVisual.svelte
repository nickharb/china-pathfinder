<script>
    import * as d3 from 'd3';
    import { onMount } from "svelte";
    import {width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    export let areaData;
    export let copyData;
    import {areaInView, view} from '../stores/view';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';

    // SVG basics
    // https://frontendmasters.com/courses/svg-essentials-animation/

    let tipWidth = 80;
    let tipHeight = 40;

    function switchView(targetView, area) {
        $view = targetView;
        $areaInView = area;

    }

    function circleMouseOver(e) {
        $hoveredCountry = e.path[1].dataset.id;
        // if ($selectedCountry = e.path[1].dataset.id) {
        //     let selectedTooltip = document.querySelectorAll('.tooltip-' + $hoveredCountry);
        //     selectedTooltip.forEach(node => node.classList.add('hovered'));
        // } else {
        //     let hoveredTooltip = document.querySelector('.tooltip-' + $hoveredCountry + '.tooltip-' + e.path[1].dataset.area);
        //     hoveredTooltip.classList.add('hovered');
        // }
    }

    function circleMouseOut(e) {
        $hoveredCountry = '';
        // let selectedTooltip = document.querySelectorAll('.tooltip');
        // selectedTooltip.forEach(node => node.classList.remove('hovered'));
    }

    function circleClick(e) {
        $selectedCountry = e.path[1].dataset.id;
    }

    $: if (areaData) {
        parseData();
    }

    function parseData() {
        const xScale = d3.scaleLinear().domain([1,10]).range([$margin*3, $width-$margin*3]);

        areaData.forEach( (d,i) => {
            if (d3.select('.text-wrapper .'+d.area).size()>0) {

                const textRect = d3.select('.text-wrapper .'+d.area).node().getBoundingClientRect();

                d.offsetY = textRect.top 
                    - d3.select('.text-wrapper').node().getBoundingClientRect().top
                    + $margin*2;

                // 
                d.graphData = d.comps.map((m, n)=>{
                    let distance = i<5 ? (xScale(areaData[i+1]['comps'][n]) - xScale(m)) : 0;
                    let points = i<5 ? ([
                        [0 , 0],
                        [distance, textRect.bottom - textRect.top + $margin*2]
                    ]) : ([[0,0],[0,0]]);
                    
                    let path = utils.cubicBezier(points[0], points[1], 0.5);

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


<div class='text-wrapper'  bind:clientHeight={$height}>
    {#each copyData as area}
        <div class={'area '+area.label.toLowerCase()}>
            <h2 on:click|self={()=> switchView('indicators',area.label.toLowerCase())}>
                {area.name}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M6.9997 0C3.13422 0 0 3.13422 0 6.9997C0 10.8652 3.13422 14 6.9997 14C10.8652 14 14 10.8652 14 6.9997C14 3.13422 10.8652 0 6.9997 0ZM8.45689 10.8486C8.09659 10.9908 7.80978 11.0987 7.59467 11.1733C7.38015 11.248 7.13067 11.2853 6.84681 11.2853C6.41067 11.2853 6.07111 11.1787 5.82933 10.9659C5.58756 10.7532 5.46726 10.4836 5.46726 10.1559C5.46726 10.0284 5.47615 9.89807 5.49393 9.76533C5.5123 9.63259 5.54133 9.48326 5.58104 9.31556L6.032 7.72267C6.0717 7.56978 6.10607 7.42459 6.13333 7.28948C6.16059 7.15318 6.17363 7.02815 6.17363 6.91437C6.17363 6.7117 6.13156 6.56948 6.048 6.48948C5.96326 6.40948 5.80385 6.37037 5.56622 6.37037C5.45007 6.37037 5.33037 6.38756 5.2077 6.4237C5.08622 6.46104 4.98074 6.49481 4.89422 6.528L5.01333 6.03733C5.30844 5.91704 5.59111 5.81393 5.86074 5.72859C6.13037 5.64207 6.38519 5.59941 6.62519 5.59941C7.05837 5.59941 7.39259 5.70489 7.62785 5.91348C7.86193 6.12267 7.97985 6.39467 7.97985 6.72889C7.97985 6.79822 7.97156 6.9203 7.95556 7.09452C7.93956 7.26933 7.90933 7.42874 7.86548 7.57511L7.41689 9.16326C7.38015 9.29067 7.34756 9.43644 7.31793 9.59941C7.28889 9.76237 7.27467 9.88682 7.27467 9.97037C7.27467 10.1813 7.32148 10.3253 7.4163 10.4018C7.50993 10.4782 7.67407 10.5167 7.90637 10.5167C8.016 10.5167 8.13867 10.4972 8.27733 10.4593C8.41481 10.4213 8.51437 10.3876 8.57719 10.3585L8.45689 10.8486ZM8.37748 4.40237C8.1683 4.59674 7.91644 4.69393 7.62193 4.69393C7.328 4.69393 7.07437 4.59674 6.86341 4.40237C6.65363 4.208 6.54756 3.97156 6.54756 3.69541C6.54756 3.41985 6.65422 3.18281 6.86341 2.98667C7.07437 2.78993 7.328 2.69215 7.62193 2.69215C7.91644 2.69215 8.16889 2.78993 8.37748 2.98667C8.58667 3.18281 8.69156 3.41985 8.69156 3.69541C8.69156 3.97215 8.58667 4.208 8.37748 4.40237Z" fill="#122431"/>
                </svg>
            </h2>
            <div class='description'>
                <p>{area.definition}</p>
                <button on:click|self={()=> switchView('indicators',area.label.toLowerCase())}>
                    Explore data
                    <svg width="7" height="9" viewBox="0 0 7 9" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.01556 7.37091C0.747902 7.61649 0.747902 8.01465 1.01556 8.26023C1.28322 8.5058 1.71718 8.5058 1.98484 8.26023L5.90131 4.66686C6.16897 4.42128 6.16897 4.02313 5.90131 3.77755L1.98484 0.184182C1.71718 -0.0613944 1.28322 -0.0613944 1.01556 0.184182C0.747902 0.429759 0.747902 0.827918 1.01556 1.07349L4.44927 4.22392L1.01556 7.37091Z" fill="white"/>
                    </svg>
                </button>
            </div>
        </div>
    {/each}

</div>


<div class='vis-wrapper' bind:clientWidth={$width}>
    <svg viewBox="0 0 {$width} {$height}"
        width={$width}
        height={$height}>

        <rect x="0" y="0" width={$width} height={$height}></rect>

        {#each areaData as area, i}

            <g class="{area.area}" transform='translate({$margin},{area.offsetY})'>

                <text x='0' y='-5' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Least open</text>
                <text x='{$width-$margin}' y='-5' text-anchor='end' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Most open</text>

                <line class='gridline' x2={$width}></line>

                {#each area.graphData as graph, i}

                    <g class='country {graph.id}'
                        data-id='{graph.id}'
                        data-area='{area.area}'
                        transform='translate({graph.x},{graph.y})'
                        class:hovered='{graph.id == $hoveredCountry}'
                        class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                    >
                        
                        <path d={graph.path}></path>
                        <circle r={graph.r} class='country-circle' on:mouseover={circleMouseOver} on:mouseout={circleMouseOut} on:click={circleClick}></circle>
                    </g>

                {/each}

            </g>

        {/each}
    </svg>

    {#each areaData as area, i}
        {#each area.graphData as graph, i}
            <div
                class="tooltip {'tooltip-' + graph.id} {'tooltip-' + area.area}"
                style="left: {graph.x + 'px'}; top: {area.offsetY + 'px'}"
            >
                <p>{graph.score} / 10</p>
            </div>
        {/each}
    {/each}
</div>


<style>

    .tooltip {
        opacity: 0;
        position: absolute;
        z-index: 999;
        width: 60px;
        height: auto;
        padding: 10px;
        background-color: white;
        border: 2px solid #333;
        border-radius: 2px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        transition: opacity 500ms;
    }

    .tooltip p {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
    }

    .tooltip.hovered {
        opacity: 1;
    }
    
    .text-wrapper {
        width: 360px;
        margin-right: 20px;
    }

    .area {
        margin-bottom: 20px;
    }

    .area h2 {
        margin-top: 0;
        margin-bottom: 10px;
        position: relative;
        cursor: pointer;
    }

    .area h2 svg {
        margin-left: 3px;
    }

    .description {
        margin-bottom: 20px;
    }

    .description p {
        margin: 0;
        margin-bottom: 10px;
        font-size: 14px;
    }

    .description button {
        height: 23px;
        font-size: 12px;
    }

    .vis-wrapper {
        position: relative;
        width: 100%;
    }

    .vis-wrapper svg {
        position: absolute;
        fill: #fff;
    }
    
    circle.country-circle {
        fill: #84A9BC;
        stroke: #fff;
        stroke-width: 2px;
    }

    .vis-wrapper path {
        stroke: #84A9BC;
        fill: none;
        stroke-width: 1px;
        mix-blend-mode: multiply;
        stroke-opacity: 0.2;
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
        fill: #FF0202;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china.selected path {
        stroke: #FF0202;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    .gridline {
        stroke: #84A9BC;
    }

</style>





