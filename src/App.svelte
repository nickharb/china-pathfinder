<script>
    import Landing from './views/Landing.svelte';
    import Indicators from './views/Indicators.svelte';
    import Quarterly from './views/Quarterly.svelte';
    // import News from './views/News.svelte';
    import {view} from './stores/view';

    $view = 'main'; // defines primary view - set this for production (do not delete)
    // $view = 'indicators';

    // let showQuarterly = false; // set to true if you want to show
    // let showNews = true; // set to true if you want to show
    

</script>


<style>
    section {
        margin: 0 auto;
    }

    #intro {
        max-width: 600px;
    }
</style>


<main>
    <section id='intro'>
        <h1>Where does China's Economy Stand?</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget commodo a amet, maecenas imperdiet nulla elit non. Fermentum nulla consectetur imperdiet malesuada nulla. Amet risus consequat consectetur lorem ac leo nec morbi enim.</p>
    </section>

    {#if $view == 'main'}
        
        <section class='latest'>

            <Quarterly />

        </section>

    {/if}

    <section>

        {#if $view == 'main'}
            <Landing/>
        {:else if $view == 'indicators'}
            <Indicators/>
        {/if}

    </section>
</main>







