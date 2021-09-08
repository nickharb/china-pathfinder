<script>
    import Landing from './views/Landing.svelte';
    import Indicators from './views/Indicators.svelte';
    // import IndicatorTest from './views/IndicatorTest.svelte';
    // import News from './views/News.svelte';
    import {view} from './stores/view';

    $view = 'main'; // defines primary view - set this for production (do not delete)
    // $view = 'indicators';

    // let showQuarterly = false; // set to true if you want to show
    // let showNews = true; // set to true if you want to show
    

</script>


<main>
    <Indicators/>
    {#if $view == 'main'}
        <!-- <Landing/> -->
    {:else if $view == 'indicators'}
        <!-- <Indicators/> -->
    {/if}
</main>








