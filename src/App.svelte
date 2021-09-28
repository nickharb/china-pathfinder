<script>
    import { onMount } from "svelte";
    import Landing from './views/Landing.svelte';
    import Indicators from './views/Indicators.svelte';
    import Icon from './components/Icon.svelte';
    // import IndicatorTest from './views/IndicatorTest.svelte';
    // import News from './views/News.svelte';
    import {view} from './stores/view';

    // $view = 'main'; // defines primary view - set this for production (do not delete)
    // $view = 'indicators';

    // let showQuarterly = false; // set to true if you want to show
    // let showNews = true; // set to true if you want to show

    function switchView(targetView, area) {
        $view = targetView;
    }

</script>

<!-- <header>
    <div class="logo-container" on:click|self={()=> switchView('main')}>
        <Icon type="logo" />
    </div>
    <ul class="navigation">
        <li>Dashboard</li>
        <li>Publications</li>
        <li>About</li>
    </ul>
</header> -->

<main>
    {#if $view == 'main'}
        <Landing/>
    {:else}
        <Indicators/>
    {/if}
</main>


<style>

    main {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        letter-spacing: 0.03em;
        color: #122431;
        box-sizing: border-box;
        max-width: 1280px;
        margin: 0 auto;
        /*padding: 40px 20px;*/
    }

    @media (min-width: 768px) {
        main {
            /*padding: 80px 40px;*/
        }
    }

    :global(button) {
        background-color: #122431;
        outline: none;
        padding: 5px 10px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        border-radius: 4px;
        border: none;
        height: 28px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: background-color 300ms;
    }

    :global(button svg) {
        margin-left: 20px;
    }

    :global(button:hover) {
        background-color: #234462;
    }

    :global(button:active) {
        background-color: #122431;
    }

    /* typography */

    :global(h1, h2, h3, h4, h5) {
        font-family: 'Source Sans Pro', sans-serif;
        color: #122431;
        padding: 0;
    }

    :global(h1) {
        font-size: 32px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 10px;
        letter-spacing: 0.01em;
        line-height: 1.3;
    }

    :global(h2) {
        font-size: 17px;
        font-weight: bold;
        line-height: 1.2;
    }

    :global(h3) {
        font-size: 20px;
        line-height: 1.1;
    }
</style>








