<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import html2canvas from 'html2canvas';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    // import copyData from "../data/copy";
    import loadCopyData from "../data/load-copy-data.js";
    import LandingVisual from "../components/LandingVisual.svelte";
    // import ForceLayoutTest from "../components/ForceLayoutTest.svelte";
    import Quarterly from './Quarterly.svelte';
    import CountrySelect from '../components/CountrySelect.svelte';
    import Icon from '../components/Icon.svelte';
    import Loading from '../components/Loading.svelte';
    import SocialButtons from '../components/SocialButtons.svelte';
    export let showPrevious = false;
    let data = [], countryNames = [], areaData = [], copyData = [], introTitle, compositeTitle;

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
                introTitle = data.filter(d=> (d.category=='title' && d.label == 'intro'))[0];
                compositeTitle = data.filter(d=> (d.category=='title' && d.label == 'composite'))[0];
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
    }

    function accountForFirefox(click) {
        let link = arguments[1];
        document.body.appendChild(link);
        click(link);
        document.body.removeChild(link);
    }


</script>

{#await getCopyData()}
    <Loading />
{:then copyData}

<section class='intro'>
    <h1>{introTitle.name}</h1>
    <p>{introTitle.definition}</p>
</section>
        
<!-- <section class='latest'>
    <Quarterly />
</section> -->

<header>
    <h2>{compositeTitle.name}</h2>
    <h3>{compositeTitle.definition}</h3>
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
    <LandingVisual areaData={areaData} copyData={copyData.filter(d=>(d.category == 'main'))}/>
</div>

{/await}

{#if loading == true}
    <Loading />
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


</style>







