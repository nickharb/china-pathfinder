<script>
    import Landing from './views/Landing.svelte';
    import Indicators from './views/Indicators.svelte';
    import Quarterly from './views/Quarterly.svelte';
    import News from './views/News.svelte';
    import {view} from './stores/view';

    $view = 'main';
    // $view = 'indicators';
    let showQuarterly = false;
    let showNews = true; 
    

</script>

<style>
    section {
        text-align: center;
        margin:0 auto;
    }

    #intro {
        max-width:800px;
    }



</style>


<main>
    <section id='intro'>
        <h1>Where is China’s economy in the world?</h1>
        <p>China is a global economic powerhouse, but its system remains dangerously opaque. Policymakers and financial experts dispute basic facts about what is happening inside China. To create a shared language on China’s economy, the China Pathfinder project scores China and other economies across six areas and presents an objective picture of China’s economy relative to the world.</p>
    
    </section>

    {#if $view == 'main'}
        
        <section class='latest'>

            {#if showNews}
                <News/>
            {/if}
            {#if showQuarterly}
                <Quarterly/>
            {/if}

        </section>

    {/if}

    <section>
        
        <!-- to implement browser check / mobile check -->

        {#if $view == 'main'}
            <Landing/>
        {:else if $view == 'indicators'}
            <Indicators/>
        {/if}

    </section>

</main>


