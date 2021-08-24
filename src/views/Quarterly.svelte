
<script type="text/javascript">
    const quarterlyData = [
        {
            title: 'Market competitiveness',
            value: 'closer',
            class: 'closer'
        },
        {
            title: 'Trade openness',
            value: 'further',
            class: 'further'
        },
        {
            title: 'Portfolio openness',
            value: 'no change',
            class: 'no-change'
        },
        {
            title: 'Innovation openness',
            value: 'no change',
            class: 'no-change'
        },
        {
            title: 'FDI openness',
            value: 'no change',
            class: 'no-change'
        },
        {
            title: 'Financial system efficiency',
            value: 'no change',
            class: 'no-change'
        }
    ];
</script>

<div class='quarterly'>
    <h2>Quarterly Update</h2>
    <p>Did China move closer or further from OECD norms?</p>
    <ul>
        {#each quarterlyData as quarter}
            <li class='{quarter.class}'><span>{quarter.value}</span>{quarter.title}</li>
        {/each}
    </ul>
</div>

<style type="text/css">
    .quarterly {
        width: 100%;
        margin: 40px auto;
        border-radius: 4px;
        background-color: #EFF4F8;
        padding: 15px;
    }

    h2 {
        text-align: center;
        margin-bottom: 0;
    }

    p {
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        color: #122431;
        margin-bottom: 40px;
    }

    ul {
        list-style: none;
        padding: 0 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    li {
        flex: 1 0 33%;
        margin-bottom: 30px;
    }

    li span {
        padding: 6px 20px;
        margin-right: 15px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 12px;
        border-radius: 4px;
    }

    li.no-change span {
        color: #234462;
        background-color: #C4D6E6;
    }

    li.closer span {
        color: #098E2F;
        background-color: #C1E0D0;
    }

    li.further span {
        color: #CC7D08;
        background-color: #EBDABF;
    }
</style>










