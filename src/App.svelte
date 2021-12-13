<script>
    import { onMount } from "svelte";
    import Landing from './views/Landing.svelte';
    import Indicators from './views/Indicators.svelte';
    import Icon from './components/Icon.svelte';
    import {view} from './stores/view';

    // $view = 'main';
    $view = 'indicators';

    // let showQuarterly = false; // set to true if you want to show
    // let showNews = true; // set to true if you want to show

    function switchView(targetView, area) {
        $view = targetView;
    }

</script>

<main>
    {#if $view == 'main'}
        <Landing/>
    {:else}
        <Indicators/>
    {/if}
</main>


<style>

    /* global buttons */

    :global(button) {
        font-family: inherit;
        font-size: inherit;
        -webkit-padding: 5px 10px;
        padding: 5px 10px;
        margin: 0;
        box-sizing: border-box;
        border: none;
        border-radius: 4px;
        color: #234462;
        background-color: #E7EDF3;
        font-weight: bold;
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

    /* global styles */

    :global(body) {
        margin: 0;
    }

    main {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        letter-spacing: 0.03em;
        color: #122431;
        box-sizing: border-box;
        position: relative;
        padding: 15px;
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
        margin-left: 10px;
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








