<script>
    import { onMount } from "svelte";
    import Landing from './views/Landing.svelte';
    import Indicators from './views/Indicators.svelte';
    import Icon from './components/Icon.svelte';
    // import IndicatorTest from './views/IndicatorTest.svelte';
    // import News from './views/News.svelte';
    import {view} from './stores/view';

    $view = 'main'; // defines primary view - set this for production (do not delete)
    // $view = 'indicators';

    // let showQuarterly = false; // set to true if you want to show
    // let showNews = true; // set to true if you want to show

    function switchView(targetView, area) {
        $view = targetView;
    }

</script>

<header>
    <div class="logo-container" on:click|self={()=> switchView('main')}>
        <Icon type="logo" />
    </div>
    <ul class="navigation">
        <li>Dashboard</li>
        <li>Publications</li>
        <li>About</li>
    </ul>
</header>

<main>
    {#if $view == 'main'}
        <Landing/>
    {:else}
        <Indicators/>
    {/if}
</main>


<style>
    header {
        width: 1280px;
        margin: 0 auto;
        padding: 60px 0 20px;
        border-bottom: 1px solid #122431;
        display: flex;
        justify-content: space-between;
    }

    .logo-container {
        max-width: 230px;
        cursor: pointer;
    }

    ul.navigation {
        margin: 0 -15px;
        padding: 0;
        list-style: none;
        display: flex;

    }

    ul.navigation li {
        padding: 0 15px;
        cursor: pointer;
        color: #122431;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 0.04em;
    }
</style>








