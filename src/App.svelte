<script>
    import Landing from './views/Landing.svelte';
    import Indicators from './views/Indicators.svelte';
    import Quarterly from './views/Quarterly.svelte';
    import News from './views/News.svelte';

    let view = 'main';
    let showQuarterly = false;
    let showNews = true; 
    

</script>

<style>
</style>


<main>
    <section id='intro'>
        <h1>Where is China’s economy in the world?</h1>
        <p>China makes up a large share of the global economy... </p>
        <p>More copy...</p>
    
    </section>

    <section class='latest'>

        {#if showNews}
            <News/>
        {/if}
        {#if showQuarterly}
            <Quarterly/>
        {/if}

    </section>


    <section>
        
        <!-- to implement browser check / mobile check -->

        {#if view == 'main'}
            <Landing/>
        {:else if view == 'indicators'}
            <Indicators/>
        {/if}

    </section>

</main>
