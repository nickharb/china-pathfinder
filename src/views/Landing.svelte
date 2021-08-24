<script>
    // import * as d3 from 'd3';
    import * as _ from 'lodash';
    import { onMount } from "svelte";
    import loadData from "../data/load-data.js";
    import copyData from "../data/copy";
    import LandingVisual from "../components/LandingVisual.svelte";
    import CountrySelect from '../components/CountrySelect.svelte';
    export let showPrevious = false;
    let data = [], countryNames = [], areaData = [];

    import { csv } from 'd3';
    const dataPath = '../data/composite-score.csv';

    onMount(async()=>{
        data = await loadData();
        countryNames = data['countries'].filter(d=> d.country!=='China');
        areaData = data['areas'];
    });


</script>

<div class='control-area'>
    <CountrySelect {countryNames}/>

    <button>
        Share this view
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path d="M6.01122 1.49998V7.99998H6.88162V1.49998L7.96962 2.39998L8.62242 1.79998L6.77282 0.0999756H6.12002L4.27042 1.79998L4.92322 2.39998L6.01122 1.49998Z" fill="white"/>
            <path d="M11.4512 3.29997C11.2119 3.07266 10.9241 2.89317 10.6058 2.77273C10.2876 2.65228 9.94573 2.59347 9.60163 2.59997V3.39997C10.0345 3.39997 10.4496 3.55801 10.7556 3.83931C11.0617 4.12062 11.2336 4.50215 11.2336 4.89997V10.7C11.2345 11.1075 11.0661 11.5001 10.7628 11.7974C10.4595 12.0947 10.0442 12.2745 9.60163 12.3H3.29123C2.84866 12.2745 2.43334 12.0947 2.13005 11.7974C1.82676 11.5001 1.65837 11.1075 1.65923 10.7V4.89997C1.65923 4.50215 1.83118 4.12062 2.13724 3.83931C2.4433 3.55801 2.8584 3.39997 3.29123 3.39997V2.59997C2.94714 2.59347 2.60528 2.65228 2.28703 2.77273C1.96878 2.89317 1.68099 3.07266 1.44163 3.29997C1.1913 3.49636 0.992705 3.74239 0.860787 4.01953C0.728868 4.29667 0.667067 4.59771 0.680035 4.89997V10.8C0.667067 11.1022 0.728868 11.4033 0.860787 11.6804C0.992705 11.9576 1.1913 12.2036 1.44163 12.4C1.68099 12.6273 1.96878 12.8068 2.28703 12.9272C2.60528 13.0477 2.94714 13.1065 3.29123 13.1H9.60163C10.2757 13.1005 10.9239 12.8614 11.4106 12.4327C11.8973 12.0041 12.1847 11.419 12.2128 10.8V4.89997C12.1866 4.29766 11.9147 3.72647 11.4512 3.29997Z" fill="white"/>
        </svg>

    </button>
    
    <!-- <label class='time-toggle-box'>
        <input type=checkbox bind:checked={showPrevious}>
        Show China’s change since 2010
    </label> -->

</div>

<div class='vis-container'>

    <LandingVisual areaData={areaData} copyData={copyData.filter(d=>(d.category == 'main'))}/>

</div>

<style>
    .vis-container {
        max-width: 1000px;
        display: flex;
        text-align: left;
        margin: 1em auto;
        padding: 1em 0;
    }

    .control-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>