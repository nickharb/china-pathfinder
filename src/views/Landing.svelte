<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import html2canvas from 'html2canvas';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    import loadCopyData from "../data/load-copy-data.js";
    import LandingVisual from "../components/LandingVisual.svelte";
    import Quarterly from './Quarterly.svelte';
    import CountrySelect from '../components/CountrySelect.svelte';
    import Icon from '../components/Icon.svelte';
    import Loading from '../components/Loading.svelte';
    import SocialButtons from '../components/SocialButtons.svelte';
    export let showPrevious = false;
    let data = [], countryNames = [], areaData, copyData, introTitle, compositeTitle, cData, quarterlyData = {};

    import { csv } from 'd3';
    // const dataPath = '../data/composite-score.csv';
    let chartDownload = false;
    let loading = false;
    let fadeDuration = 200;
    let isMobile = (window.innerWidth <= 786) ? true : false;

    let downloadLabel = (isMobile) ? '' : 'Download this chart'

    // onMount(async()=>{
    //     data = await loadData();
    //     countryNames = data['countries'].filter(d => d.country!=='China' && d.country!=='Open Economy Avg');
    //     areaData = data['areas'];
    // });

    onMount(async()=>{
        data = await loadData();
        cData = await loadCopyData();
        countryNames = data['countries'].filter(d => d.country!=='China' && d.country!=='Open Economy Avg');
        areaData = data['areas'];
        copyData = cData;
        // introTitle = copyData.filter(d=> (d.category=='title' && d.label == 'intro'))[0];
        // compositeTitle = copyData.filter(d=> (d.category=='title' && d.label == 'composite'))[0];
    });

    // parse data

    $: if (copyData) {
        introTitle = copyData.filter(d=> (d.category=='title' && d.label == 'intro'))[0];
        compositeTitle = copyData.filter(d=> (d.category=='title' && d.label == 'composite'))[0];

        // quarterly data
        quarterlyData.display = copyData.filter(d=> (d.category=='quarterly' && d.label == 'display'))[0].name;
        quarterlyData.title = copyData.filter(d=> (d.category=='quarterly' && d.label == 'title'))[0].name;
        quarterlyData.subtitle = copyData.filter(d=> (d.category=='quarterly' && d.label == 'subtitle'))[0].name;
        quarterlyData.postTitle = copyData.filter(d=> (d.category=='quarterly' && d.label == 'posttitle'))[0].name;
        quarterlyData.postLink = copyData.filter(d=> (d.category=='quarterly' && d.label == 'postlink'))[0].name;
        quarterlyData.fdi = copyData.filter(d=> (d.category=='quarterly' && d.label == 'fdi'))[0].name;
        quarterlyData.portfolio = copyData.filter(d=> (d.category=='quarterly' && d.label == 'portfolio'))[0].name;
        quarterlyData.trade = copyData.filter(d=> (d.category=='quarterly' && d.label == 'trade'))[0].name;
        quarterlyData.growth = copyData.filter(d=> (d.category=='quarterly' && d.label == 'growth'))[0].name;
        quarterlyData.competition = copyData.filter(d=> (d.category=='quarterly' && d.label == 'competition'))[0].name;
        quarterlyData.innovation = copyData.filter(d=> (d.category=='quarterly' && d.label == 'innovation'))[0].name;
        quarterlyData.fdiLabel = copyData.filter(d=> (d.category=='quarterly' && d.label == 'fdi'))[0].definition;
        quarterlyData.portfolioLabel = copyData.filter(d=> (d.category=='quarterly' && d.label == 'portfolio'))[0].definition;
        quarterlyData.tradeLabel = copyData.filter(d=> (d.category=='quarterly' && d.label == 'trade'))[0].definition;
        quarterlyData.growthLabel = copyData.filter(d=> (d.category=='quarterly' && d.label == 'growth'))[0].definition;
        quarterlyData.competitionLabel = copyData.filter(d=> (d.category=='quarterly' && d.label == 'competition'))[0].definition;
        quarterlyData.innovationLabel = copyData.filter(d=> (d.category=='quarterly' && d.label == 'innovation'))[0].definition;
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

{#if copyData}

    <!-- {#await getCopyData()}
        <Loading />
    {:then copyData} -->

    <section class='intro'>
        <h1>{introTitle.name}</h1>
        <p>{introTitle.definition}</p>
    </section>

    {#if quarterlyData.display == 'TRUE' || quarterlyData.display == 'true' || quarterlyData.display == true}
        <section class='latest'>
            <Quarterly quarterlyData={quarterlyData} />
        </section>
    {/if}

    <header>
        <h2>{compositeTitle.name}</h2>
        <h3>{compositeTitle.definition}</h3>
        <div class='control-area'>
            <CountrySelect {countryNames}/>
            <div class="social-sharing">
                <button class="download" on:click={downloadImage}>{downloadLabel}<Icon type='download' /></button>
                <SocialButtons
                    socialTitle={document.querySelector("meta[property='og:title']").getAttribute('content')}
                    socialText={document.querySelector("meta[property='og:description']").getAttribute('content')}
                    socialLink={document.querySelector("meta[property='og:url']").getAttribute('content')}
                />
            </div>
        </div>
    </header>

    {#if areaData}
        <div class='vis-container' class:chart-download={chartDownload == true}>
            <LandingVisual areaData={areaData} copyData={copyData.filter(d=>(d.category == 'main'))}/>
        </div>
    {/if}

    <!-- {/await} -->

    {#if loading == true}
        <Loading />
    {/if}

{/if}

<style>

    /* intro section */

    .download {
        /*display: none;*/
    }

    @media (min-width: 768px) {
        .download {
            /*display: block;*/
        }
    }

    .intro {
        margin-bottom: 40px;
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
        margin-bottom: 20px;
        margin-top: 20px;
        font-size: 28px;
    }

    @media (min-width: 768px) {
        .intro h1 {
            max-width: 260px;
            margin-top: 0;
        }
    }

    @media (min-width: 1024px) {
        .intro h1 {
            max-width: 350px;
            font-size: 38px;
        }
    }

    .intro p {
        margin: 0;
        margin-top: 4px;
        font-size: 16px;
        letter-spacing: 0.02em;
        line-height: 1.4;
    }

    @media (min-width: 768px) {
        .intro p {
            width: 61%;
            line-height: 1.6;
        }
    }

    @media (min-width: 1024px) {
        .intro p {
            font-size: 18px;
            letter-spacing: 0.02em;
            line-height: 1.8;
            /*width: 61%;*/
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
        font-size: 20px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 10px;
    }

    @media (min-width: 768px) {
        header h2 {
            font-size: 24px;
        }
    }

    header h3 {
        font-size: 14px;
        line-height: 1.2;
        font-weight: normal;
        margin: 0;
        margin-bottom: 20px;
    }

    @media (min-width: 768px) {
        header h3 {
            font-size: 18px;
            line-height: 1.2;
        }
    }

    .control-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /*@media (min-width: 768px) {
        .control-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }*/

    .social-sharing {
        display: flex;
        flex-wrap: nowrap;
        /*width: 120px;*/
    }

    @media (min-width: 768px) {
        .social-sharing {
            /*flex-wrap: nowrap;*/
            width: inherit;
        }
    }

    .download {
        font-size: 12px;
        height: 26px;
        width: 26px;
        margin-right: 6px;
        display: flex;
        justify-content: center;
        padding: 0;
    }

    @media (min-width: 768px) {
        .download {
            font-size: 14px;
            height: inherit;
            width: inherit;
            margin: 0;
            padding: 5px 10px;
        }
    }

    .vis-container {
        position: relative;
        display: flex;
        text-align: left;
        margin: 1em auto;
        padding: 5px 0;
    }

    @media (min-width: 768px) {
        .vis-container {
            padding: 1em 0;
        }
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







