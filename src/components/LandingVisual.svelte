<script>
    import * as d3 from 'd3';
    import {width, height, margin, scaleFactor} from '../stores/dimensions';
    import utils from "../utils";
    import {domainInView, view} from '../stores/view';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';

    export let domainData;
    export let copyData;

    function switchView(targetView, domain) {
        $view = targetView;
        $domainInView = domain;
    }

    // init visual as soon as data variable is loaded
    $: if (domainData) {
        parseData();
    }

    // parse raw data
    function parseData() {
        domainData.forEach( (domain, i) => {
            console.log(domain);
            // d['graphData'] = d.comps.map((m, n)=>{
            //     let distance = i<5 ? (xScale(domainData[i+1]['comps'][n]) - xScale(m)) : 0;
            //     let points = i<5 ? ([
            //         [0 , 0],
            //         [distance, textRect.bottom - textRect.top + $margin*2]
            //         // [distance, ($height-$margin*5)/5]
            //     ]) : ([[0,0],[0,0]]);
                
            //     // third argument is swerve of the curve
            //     let path = utils.cubicBezier(points[0], points[1], 0.5); // compute path for each country using cubic bezier - pulls from utils

            //     // computes the circle location for each country - primary composite score attribute
            //     return {
            //         id : d.countries[n].trim().toLowerCase(),
            //         x : xScale(m),
            //         y : 0,
            //         r : $scaleFactor,
            //         country : d.countries[n],
            //         path: path,
            //         score: d.comps[n]
            //     };
            // });
        });

        // initialize visual
        // initVis();
    }

    function initVis() {

        // 1 is min, 10 is max domain
        // TODO CHECK MIN HERE
        const xScale = d3.scaleLinear().domain([1,10]).range([$margin*3, $width-$margin*3]);

        d3.select('svg').selectAll('rect')
            .data(movieData).enter().append('rect')
            .attr('x', (d) => xScale(d))
            .attr('y', (d) => visHeight - yScale(d.rating))
            .attr('width', (d) => xScale.bandwidth())
            .attr('height', (d) => yScale(d.rating))
            .attr('fill', (d, i) => colors[d.genres[0]] || colors['Other'])
            .on('mouseover', function(e, d) {
                let xPosition = parseFloat(d3.select(this).attr('x') + xScale.bandwidth() / 2);
                let yPosition = parseFloat(d3.select(this).attr('y') / 2 + visHeight / 2);

                d3.select('#tooltip-' + d.id)
                    .style('left', xPosition + 'px')
                    .style('top', yPosition + 'px')
                    .classed('hidden', false);
            })
            .on('mouseout', function(e, d) {
                d3.select('#tooltip-' + d.id).classed('hidden', true);
            });
    }

    


    // function test() {
    //     domainData.forEach( (d,i) => {
    //         if (d3.select('.text-wrapper .'+d.domain).size()>0) {

    //             // get offset for each text box, position text to vis rows
    //             // svg height of each vis row is determined by the height of each text block
    //             const textRect = d3.select('.text-wrapper .'+d.domain).node().getBoundingClientRect();
    //             d.offsetY = textRect.top 
    //                 - d3.select('.text-wrapper').node().getBoundingClientRect().top
    //                 + $margin*2;


    //             d.graphData = d.comps.map((m, n)=>{
    //                 let distance = i<5 ? (xScale(domainData[i+1]['comps'][n]) - xScale(m)) : 0;
    //                 let points = i<5 ? ([
    //                     [0 , 0],
    //                     [distance, textRect.bottom - textRect.top + $margin*2]
    //                     // [distance, ($height-$margin*5)/5]
    //                 ]) : ([[0,0],[0,0]]);
                    
    //                 // third argument is swerve of the curve
    //                 let path = utils.cubicBezier(points[0], points[1], 0.5); // compute path for each country using cubic bezier - pulls from utils

    //                 // computes the circle location for each country - primary composite score attribute
    //                 return {
    //                     id : d.countries[n].trim().toLowerCase(),
    //                     x : xScale(m),
    //                     y : 0,
    //                     r : $scaleFactor,
    //                     country : d.countries[n],
    //                     path: path,
    //                     score: d.comps[n]
    //                 };
    //             });
    //         }
    //     });
    // }

    function circleMouseOver(e) {
        $hoveredCountry = e.path[1].dataset.id;
    }

    function circleMouseOut(e) {
        $hoveredCountry = '';
    }

    function circleClick(e) {
        $selectedCountry = e.path[1].dataset.id;
    }
</script>


<div class='text-wrapper'  bind:clientHeight={$height}>
    {#each copyData as domain}
        <div class={'domain '+domain.label.toLowerCase()}>
            <h2 on:click|self={()=> switchView('indicators',domain.label.toLowerCase())}>{domain.name}</h2>
            <div class='description'>
                {domain.definition}
                <span on:click|self={()=> switchView('indicators',domain.label.toLowerCase())}>Click for details</span>
            </div>
        </div>
    {/each}

</div>


<div class='vis-wrapper' bind:clientWidth={$width}>
    <svg viewBox="0 0 {$width} {$height}"
        width={$width}
        height={$height}>

        <rect x="0" y="0" width={$width} height={$height}></rect>

        {#each domainData as domain, i}

            <!-- <g class="{domain.domain}" transform='translate({$margin},{domain.offsetY})'> -->
            <!-- TODO CHANGE -->
            <g class="{domain.domain}" transform='translate({$margin},50)'>

                <line class='gridline' x2={$width}></line>

                {#each domain.graphData as graph, i}

                    <g class='country {graph.country}'
                        data-id='{graph.id}'
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

    {#each domainData as domain, i}

            {#each domain.graphData as graph, i}
                {console.log(graph)}
                <div
                    class="tooltip"
                    id={'tooltip-' + graph.score}
                    style="top: 500px; left: 500px"
                >
                    <!-- <p><strong>{movie.title}</strong></p> -->
                    <p>{graph.score} / 10</p>
                </div>

            {/each}

    {/each}

</div>


<style>

    .tooltip {
        position: absolute;
        width: 100px;
        height: auto;
        padding: 10px;
        background-color: #fff;
        border: 2px solid #333;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        -webkit-box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        /*opacity: 0;*/
        transition: opacity 500ms;
    }

    .hovered .tooltip {
        opacity: 1;
    }
    
    .text-wrapper {
        position: relative;
        width:30%;
        padding-right:2%;
        padding-left:25px;
    }

    .domain {
        margin-bottom:20px;
    }
    .domain h2 {
        font-size:1.2em;
        margin-top:0;
        margin-bottom:0;
        display:inline-block;
        position:relative;
        cursor:pointer;
    }

    .domain .description {
        font-size:0.9em;
        display:inline;
    }

    .domain .description span {
        color: steelblue; /*placeholder color*/
        font-style: italic;
        text-decoration: underline dotted;
        cursor:pointer;
    }

    .vis-wrapper {
        position: relative;
        width: 99%;
    }

    svg {
        position: absolute;
        fill: #fff;
    }
    
    circle.country-circle {
        fill: #666666;
        stroke: #f9f9f9;
        fill-opacity: 0.5;
    }

    path {
        stroke:#cccccc;
        fill:none;
        stroke-width:1px;
        mix-blend-mode: multiply;
        stroke-opacity: 0.5;
    }

    g.China.selected circle {
        fill: white;
        stroke: red;
        stroke-width: 2px;
        fill-opacity:1;
    }

    g.China.selected path {
        stroke: red;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.hovered path {
        stroke: #333;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.hovered circle {
        fill: white;
        stroke: #333;
        stroke-width: 2px;
        fill-opacity:1;
    }

    g.selected path {
        stroke: blue;
        stroke-width: 2px;
        stroke-opacity: 1;
    }

    g.selected circle {
        fill: white;
        stroke: blue;
        stroke-width: 2px;
        fill-opacity:1;
    }

    .gridline {
        stroke: #eeeeee;

    }

</style>





