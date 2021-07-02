<script>
    import d3 from '../js/d3.js';
    import {onMount} from "svelte";
    
    export let showPrevious = false;
    d3.csv('./data/composite-score.csv').then(function(data){
        console.log(data)
    })

</script>

<div class='control-area'>
    How China compares with 
    <div class='country-toggle-box'>
        <select>

        </select>
    </div>
    <button>Share this view</button>
    <label class='time-toggle-box'>
            <input type=checkbox bind:checked={showPrevious}>
            Show China’s change since 2010
    </label>    

</div>

<div class='vis-container'>

</div>