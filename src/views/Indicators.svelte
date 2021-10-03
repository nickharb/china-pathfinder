<script>
    import * as d3 from 'd3';
    import html2canvas from 'html2canvas';
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import { fade } from 'svelte/transition';
    import loadData from "../data/load-data.js";
    import loadIndicatorsData from "../data/load-indicators-data.js";
    // import runLabeler from "../labeler.js";
    import {view, areaInView} from '../stores/view';
    import {width, height, margin, scaleFactor, chartWidth} from '../stores/dimensions';
    import {hoveredCountry, selectedCountry} from '../stores/country-store.js';
    // import copyData from "../data/copy";
    import loadCopyData from "../data/load-copy-data.js";
    import Icon from '../components/Icon.svelte';
    import CountrySelect from '../components/CountrySelect.svelte';
    import IndicatorVisual from '../components/IndicatorVisual.svelte';
    import AreaTooltip from '../components/AreaTooltip.svelte';
    import SocialButtons from '../components/SocialButtons.svelte';
    import Loading from '../components/Loading.svelte';

    let chartDownload = false;
    let loading = false;
    let fadeDuration = 200;

    let data = [], indicatorsData = [], countryNames = [], areaData, graphData=[], currentArea, copyData, title;
    let expanded = false;
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

    $areaInView = 'growth';
    // $areaInView = 'competition';
    // $areaInView = 'innovation';
    // $areaInView = 'trade';
    // $areaInView = 'fdi';
    // $areaInView = 'portfolio';

    // set area visual width
    let areaWidth = 750;
    let areaMargin = 40;
    $height = 100;
    // $margin = 20;

    let isHovered = false;

    function mouseOver(e) {
        isHovered = true;
        $hoveredCountry = e.path[1].dataset.id;
        d3.select(e.path[1]).raise();
    }

    function mouseLeave(e) {
        isHovered = false;
        $hoveredCountry = '';
    }

    function mouseClick(e) {
        if (e.path[1].dataset.id !== 'china' && e.path[1].dataset.id !== 'open-economy-avg') {
            $selectedCountry = e.path[1].dataset.id;
            d3.selectAll('.'+$selectedCountry).raise();
        }
    }

    // event handlers

    function expandButtonClick() {
        if (expanded == true) {
            expanded = false;
        } else {
            expanded = true;
        }
    }

    function circleMouseOver(e) {
        $hoveredCountry = e.path[1].dataset.id;
    }

    function circleMouseOut(e) {
        $hoveredCountry = '';
    }

    function circleClick(e) {
        $selectedCountry = e.path[1].dataset.id;
    }

    // load data

    onMount(async()=>{
        data = await loadData();
        copyData = await loadCopyData();
        indicatorsData = await loadIndicatorsData($areaInView);
        countryNames = data['countries'].filter(d => d.country!=='China' && d.country!=='Open Economy Avg');
        areaData = (data['areas']).filter(d=> d.area == $areaInView)[0];
    });

    // parse data

    $: if (copyData) {
        currentArea = copyData.filter(d=> (d.category=='main' && d.label == $areaInView))[0];
        title = copyData.filter(d=> (d.category=='title' && d.label == $areaInView))[0];
    }

    $: if (areaData) {
        const xScale = d3.scaleLinear().domain([0,10]).range([areaMargin*3, $width-areaMargin*3]);

        areaData.comps.forEach((d,i)=>{
            graphData.push({
                id : areaData.countries[i].trim().toLowerCase().split(" ").join("-"),
                x : xScale(d),
                y : 0,
                r : 6,
                country : areaData.countries[i],
                value: d
            });
        });

        // fix label overlap
        setTimeout(positionLabels, 500);
    }

    $: if (indicatorsData) {
        indicatorsData.forEach((d,i) => {

            let indicatorCopy = copyData.filter(x=> x.category == $areaInView);

            if (i >= indicatorCopy.length) {
                d.copy = {name: 'Placeholder indicator', definition:'This will be finalized when data comes in.',context:''};
            } else {
                d.copy = indicatorCopy[i];
            }
        })
    }

    function switchView(targetView, area) {
        $view = targetView;
        $areaInView = area;
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

    // download chart functions

    function downloadImage(e) {
        let chart = document.querySelector('.indicator-container');
        loading = true;
        setTimeout(function() {
            chartDownload = true;
            setTimeout(function() {
                html2canvas(chart).then(canvas => {
                    downloadImageClick(canvas.toDataURL(), 'chart-download.png');
                });
                chartDownload = false;
                loading = false;
            },1000);
        }, fadeDuration);
    }

    function downloadImageClick(uri, filename) {
        var link = document.createElement('a');
            if (typeof link.download !== 'string') {
            window.open(uri);
        } else {
            link.href = uri;
            link.download = filename;
            accountForFirefox(clickLink, link);
        }
    }

    function clickLink(link) {
        link.click();
    }

    function accountForFirefox(click) {
        let link = arguments[1];
        document.body.appendChild(link);
        click(link);
        document.body.removeChild(link);
    }

</script>


{#if copyData}

<!-- <button class='back' on:click|self={()=> switchView('main')}>Back to Dashboard</button> -->
<button class='back'><a href="https://pathfinder.sevenmilemedia.com/">Back to Dashboard</a></button>

<div class='area-summary' class:expanded={expanded == true}>

    <div class="area-container">
        <div class='area-text'>
            <h1>{currentArea.name}</h1>
            <p class='intro'>{currentArea.definition}</p>
        </div>

        <div class='area-vis' bind:clientWidth={$width}>
        <!-- <div class='area-vis'> -->
            <svg viewBox="0 0 {$width} {$height}"
                width={$width}
                height={$height+30}
            >
                {#if areaData}
                    <g class="{areaData.area}" transform='translate(0,{areaMargin})'>

                        <text x='0' y='0' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>Low</text>
                        <text x='{$width}' y='0' text-anchor='end' font-size='12px' fill='#5E7B8A' fill-opacity='0.7'>High</text>

                        <line class='gridline' x1=0 x2={$width} transform='translate(0,5)'></line>

                        {#each graphData as graph, i}
                            <g class='country {graph.id}'
                                data-x='{graph.x}'
                                data-y='{graph.y}'
                                data-id='{graph.id}'
                                transform='translate({graph.x},{graph.y+5})'
                                class:hovered='{graph.id == $hoveredCountry}'
                                class:selected='{graph.id == $selectedCountry || graph.id == 'china'}'
                                class:labelTestSelected='{graph.id == $selectedCountry || graph.id == 'china' || graph.id == 'open-economy-avg'}'
                            >

                                <text
                                    class='label'
                                    class:hidden='{graph.id == 'china' && chinaHidden == true}'
                                    data-id='{graph.id}'
                                    y='{labelPositions[graph.id]}'
                                >
                                    {graph.country}
                                </text>
                                
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
            </svg>

            {#if areaData}
                <!-- area vis tooltips -->
                {#each graphData as graph, i}
                    <AreaTooltip isHovered={isHovered} graph={graph} />
                {/each}

            {/if}
        </div>
    </div>

    {#if expanded}
        <div class="summary" transition:fade>
            <p>{currentArea.summary}</p>
        </div>
    {/if}
    
    <div class="area-footer">
        <button class="expand" on:click={expandButtonClick}>
            {#if !expanded}
                Expand to read more
            {:else}
                View less
            {/if}
            <svg class="caret-down-dark" width="13" height="11" viewBox="0 0 13 11" fill="none">
                <path d="M7.36602 10.5C6.98112 11.1667 6.01887 11.1667 5.63397 10.5L0.870834 2.25C0.485934 1.58333 0.96706 0.75 1.73686 0.75L11.2631 0.750001C12.0329 0.750001 12.5141 1.58333 12.1292 2.25L7.36602 10.5Z" fill="#234462"/>
            </svg>
        </button>
        <div class="methodology">
            <a href="https://pathfinder.sevenmilemedia.com/methodology/">Methodology<Icon type="arrow-right" /></a>
        </div>
        
    </div>
</div>

<div class='indicators'>
    <header>
        <h2>{title.name}</h2>
        <div class='control-area'>
            <CountrySelect {countryNames}/>
            <div class="social-share">
                <p>Share:</p>
                <SocialButtons
                    socialTitle={document.querySelector("meta[property='og:title']").getAttribute('content')}
                    socialText={document.querySelector("meta[property='og:description']").getAttribute('content')}
                    socialLink={document.querySelector("meta[property='og:url']").getAttribute('content')}
                />
            </div>
            <!-- <button>Share this page<Icon type='share' /></button> -->
        </div>
    </header>

    {#each indicatorsData as indicator, i}

        <div class='indicator-container' class:chart-download={chartDownload == true}>

                {#if (i%2 == 0)}
                    <IndicatorVisual {indicator} class="indicator-vis align-left" />
                {:else}
                    <IndicatorVisual {indicator} class="indicator-vis align-right" />
                {/if}

                <div class='indicator-text' class:text-right='{i%2 == 0}' class:text-left='{i%2 !== 0}'>
                    <div class="leader-container">
                        <div class="leader-line"></div>
                        <div class="leader-circle"></div>
                    </div>
                    <h3>{indicator.copy.name}</h3>
                    <div class='description'>{indicator.copy.definition}</div>
                    <button on:click={downloadImage}>Download this chart<Icon type='download' /></button>
                </div>

        </div>

    {/each}
</div>

{#if loading == true}
    <Loading />
{/if}

{/if}


<style>

    .hidden {
        display: none;
    }

    .social-share {
        display: flex;
        align-items: center;
    }

    .social-share p {
        margin: 0;
        padding: 0;
        margin-right: 2px;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
    }

    /* indicator visual */

    .indicator-container {
        display: flex;
        flex-wrap: wrap;
        /*margin-top: -50px;*/
    }

    .indicator-container:first-of-type {
        margin-top: 0;
    }

    @media (min-width: 768px) {
        .indicator-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }
    }

    @media (min-width: 1080px) {
        .indicator-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: -60px;
        }
    }

    .indicator-text {
        position: relative;
        border-bottom: 1px solid #84A9BC;
        padding-bottom: 50px;
        margin-bottom: 10px;
        width: 100%;
    }

    @media (min-width: 768px) {
        .indicator-text {
            width: 30%;
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
        }

        .text-right {
            order: 2;
        }

        .text-left {
            order: 1;
        }
    }

    @media (min-width: 1080px) {
        .indicator-text {
            width: 350px;
        }
    }

    .indicator-text h3 {
        margin: 0;
        margin-bottom: 10px;
        font-size: 20px;
    }

    .description {
        margin-bottom: 20px;
    }

    .leader-container {
        display: none;
    }

    @media (min-width: 768px) {
        .leader-container {
            display: block;
            position: absolute;
            top: 50%;
            margin-top: -6px;
        }
    }

    .leader-line {
        content: " ";
        height: 1px;
        width: 60px;
        border-bottom: 1px solid #84A9BC;
    }

    .leader-circle {
        content: " ";
        position: absolute;
        height: 13px;
        width: 13px;
        border: 1px solid #84A9BC;
        border-radius: 50%;
        top: -6px;
    }

    .text-left {
        /*border-right: 1px solid #84A9BC;
        padding-right: 40px;
        margin-right: 40px;*/
    }

    @media (min-width: 768px) {
        .text-left {
            border-right: 1px solid #84A9BC;
            padding-right: 40px;
            margin-right: 80px;
        }
    }

    .text-right {
        /*border-left: 1px solid #84A9BC;
        padding-left: 40px;
        margin-left: 40px;*/
    }

    @media (min-width: 768px) {
        .text-right {
            border-left: 1px solid #84A9BC;
            padding-left: 40px;
            margin-left: 80px;
        }
    }

    .text-left .leader-container {
        right: -60px;
    }

    .text-right .leader-container {
        left: -60px;
    }

    .text-left .leader-circle {
        right: -6px;
        background: #fff;
    }

    .text-right .leader-circle {
        left: -6px;
        background: #fff;
    }

    /* header section */

    header {
        margin-bottom: 20px;
    }

    header h2 {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 15px;
    }

    header h3 {
        font-size: 18px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 20px;
    }

    .control-area {
        margin: 0;
    }

    @media (min-width: 768px) {
        .control-area {
            margin: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .area-summary {
        background-color: #EFF4F8;
        margin-bottom: 40px;
        padding: 20px;
        border-radius: 10px;
    }

    @media (min-width: 768px) {
        .area-summary {
            margin-bottom: 60px;
            padding: 40px;
        }
    }

    .summary {
        margin-top: 10px;
    }

    .summary p {
        font-size: 16px;
    }

    .intro {
        margin: 0;
        padding: 0;
        font-size: 16px;
    }

    button.expand {
        position: relative;
        background-color: #EFF4F8;
        color: #234462;
        padding: 0 30px 0px 0;
        margin-top: 0;
    }

    #pathfinder-dashboard-container button.expand {
        position: relative;
        background-color: #EFF4F8;
        color: #234462;
        padding: 0 30px 0px 0;
        margin-top: 0;
    }

    .caret-down-dark {
        position: absolute;
        top: 8px;
        right: 10px;
        transform: rotate(0deg);
        transition: transform 500ms;
    }

    .expanded .caret-down-dark {
        transform: rotate(180deg);
    }

    .area-container {
        margin-bottom: 0;
    }

    @media (min-width: 768px) {
        .area-container {
            display: flex;
            align-items: center;
        }
    }

    .area-text h1 {
        margin: 0;
        margin-bottom: 15px;
        font-size: 36px;
        font-weight: 600;
        line-height: 1;
    }
    
    .area-vis {
        margin-top: 10px;
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    @media (min-width: 768px) {
        .area-text {
            margin-right: 20px;
            width: 40%;
        }

        .area-vis {
            margin-top: 40px;
            width: 60%;
        }
    }

    @media (min-width: 1024px) {
        .area-text {
            margin-right: 40px;
            width: 30%;
        }

        .area-vis {
            width: 70%;
        }
    }

    .area-footer {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .methodology a {
        color: #122431;
        text-decoration: underline;
        font-weight: bold;
        font-size: 14px;
        text-transform: uppercase;
    }

    /* area vis */

    circle.country-circle {
        fill: #84A9BC;
        stroke: #fff;
        stroke-width: 2px;
        cursor: pointer;
        /*transform: scale(1);*/
        transition: transform 200ms, fill 200ms;
    }

    g.hovered circle {
        fill: #234462;
        /*fill: #C2D5DE;*/
        /*transform: scale(1.2);*/
    }

    g.selected circle {
        fill: #234462;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china circle {
        fill: #D13F36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china-2010.selected circle {
        fill: #A13F36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.open-economy-avg circle {
        fill: #D18B36;
        stroke: #fff;
        stroke-width: 2px;
    }

    g.china.hovered circle {
        /*fill: #FF5C52;*/
    }

    g.china-2010.hovered circle {
        fill: #A13F36;
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
        transform: translate(0,0);
    }

    g.china-2010 text.label {
        fill: #A13F36;
    }

    g.open-economy-avg text.label {
        fill: #D18B36;
        opacity: 1;
        transform: translate(0,0);
    }

    /* buttons */

    button {
        margin-top: 20px;
    }
    
    button.back {
        display: block;
        margin: 0;
        margin-bottom: 20px;
    }

    button.back a {
        color: #fff;
        text-decoration: none;
        font-weight: 600;
    }

    /* chart download */

    .chart-download {
        padding: 60px 20px 0;
    }

    .chart-download button {
        opacity: 0 !important;
    }


    
</style>