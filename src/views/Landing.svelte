<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import html2canvas from 'html2canvas';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import loadData from "../data/load-data.js";
    // import copyData from "../data/copy";
    import loadCopyData from "../data/load-copy-data.js";
    import LandingVisual from "../components/LandingVisual.svelte";
    // import ForceLayoutTest from "../components/ForceLayoutTest.svelte";
    import Quarterly from './Quarterly.svelte';
    import CountrySelect from '../components/CountrySelect.svelte';
    import Icon from '../components/Icon.svelte';
    import SocialButtons from '../components/SocialButtons.svelte';
    export let showPrevious = false;
    let data = [], countryNames = [], areaData = [], copyData = [];

    import { csv } from 'd3';
    const dataPath = '../data/composite-score.csv';
    let chartDownload = false;
    let loading = false;
    let fadeDuration = 200;

    onMount(async()=>{
        data = await loadData();
        countryNames = data['countries'].filter(d => d.country!=='China' && d.country!=='Open Economy Avg');
        areaData = data['areas'];
    });

    async function getCopyData() {
        return await loadCopyData()
            .then((data) => {
                return data;
            });
    }

    // chart image download

    function downloadImage(e) {
        let chart = document.querySelector('.vis-container');
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
        // setTimeout(function() {
        //     chartDownload = false;
        // }, 1000);
    }

    function accountForFirefox(click) {
        let link = arguments[1];
        document.body.appendChild(link);
        click(link);
        document.body.removeChild(link);
    }


</script>

<section class='intro'>
    <h1>Where Does China’s Economy Stand?</h1>
    <p>China is a global economic powerhouse, but its system remains opaque. Policymakers and financial experts disagree on basic facts about what is happening inside the country. To create a shared language for understanding the Chinese economy, the China Pathfinder project scores China and other open market economies across six key areas and presents an objective picture of China relative to the world.</p>
</section>
        
<!-- <section class='latest'>
    <Quarterly />
</section> -->

<!-- todo - make these headers dynamic -->
<header>
    <h2>2020 Annual Economic Benchmarks</h2>
    <h3>How Does China's Economic System Compare to Open Market Economies?</h3>
    <div class='control-area'>
        <CountrySelect {countryNames}/>
        <div class="social-sharing">
            <button on:click={downloadImage}>Download this chart<Icon type='download' /></button>
            <SocialButtons
                socialTitle={document.querySelector("meta[property='og:title']").getAttribute('content')}
                socialText={document.querySelector("meta[property='og:description']").getAttribute('content')}
                socialLink={document.querySelector("meta[property='og:url']").getAttribute('content')}
            />
        </div>
    </div>
</header>

<div class='vis-container' class:chart-download={chartDownload == true}>

    {#await getCopyData()}
        <p>Loading data...</p>
    {:then data}
        <LandingVisual areaData={areaData} copyData={data.filter(d=>(d.category == 'main'))}/>
    {/await}

</div>

{#if loading == true}
    <div class="loading" transition:fade="{{ duration: 300 }}">
        <div class="loading-icon">
            <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                <path fill="#234462" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                    <animateTransform 
                        attributeName="transform" 
                        attributeType="XML" 
                        type="rotate"
                        dur="1s" 
                        from="0 50 50"
                        to="360 50 50" 
                        repeatCount="indefinite" />
                </path>
            </svg>
        </div>
        <p>Loading...</p>
    </div>
{/if}

<style>
    /* intro section */

    .intro {
        margin-bottom: 50px;
    }

    @media (min-width: 768px) {
        .intro {
            margin: 0 auto;
            margin-bottom: 50px;
            display: flex;
            justify-content: space-between;
        }
    }

    .intro h1 {
        font-size: 32px;
        margin-bottom: 20px;
    }

    @media (min-width: 768px) {
        .intro h1 {
            max-width: 350px;
            font-size: 38px;
        }
    }

    .intro p {
        margin: 0;
        margin-top: 4px;
        font-size: 18px;
        letter-spacing: 0.02em;
        line-height: 1.8;
    }

    @media (min-width: 768px) {
        .intro p {
            width: 61%;
        }
    }

    /* landing visual */

    header {
        margin-bottom: 20px;
    }

    @media (min-width: 768px) {
        header {
            margin-bottom: 40px;
        }
    }

    header h2 {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 5px;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .social-sharing {
        display: flex;
    }

    .vis-container {
        position: relative;
        display: flex;
        text-align: left;
        margin: 1em auto;
        padding: 1em 0;
    }

    /* chart download */

    

    .chart-download {
        padding: 60px 20px 0;
    }

    :global(.chart-download .description button) {
        opacity: 0;
    }

    :global(.chart-download .info) {
        opacity: 0;
    }

    /* loading icon */

    .loading {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #fff;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading p {
        color: #234462;
        margin: 0;
        padding: 0;
    }

    .loading-icon {
        width: 100px;
        height: auto;
    }

    .loading-icon svg {
        fill: #234462;
        width: 100px;
        height: 100px;
    }


</style>







