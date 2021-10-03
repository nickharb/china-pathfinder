<script>
    import { fade } from 'svelte/transition';
</script>


<div class="loading" transition:fade="{{ duration: 300 }}">
    <div class="loading-icon">
        <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <path fill="#234462" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                <animateTransform 
                    attributeName="transform" 
                    attributeType="XML" 
                    type="rotate"
                    dur="1s" 
                    from="0 50 50"
                    to="360 50 50" 
                    repeatCount="indefinite" />
            </path>
        </svg>
    </div>
    <p>Loading...</p>
</div>


<style>
    /* loading icon */

    .loading {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #fff;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading p {
        color: #234462;
        margin: 0;
        padding: 0;
    }

    .loading-icon {
        width: 100px;
        height: auto;
    }

    .loading-icon svg {
        fill: #234462;
        width: 100px;
        height: 100px;
    }
</style>








