
<script type="text/javascript">
    const quarterlyData = [
        {
            title: 'Market Competition',
            value: 'closer',
            class: 'closer'
        },
        {
            title: 'Trade Openness',
            value: 'further',
            class: 'further'
        },
        {
            title: 'Portfolio Investment Openness',
            value: 'no change',
            class: 'no-change'
        },
        {
            title: 'Modern Innovation System',
            value: 'no change',
            class: 'no-change'
        },
        {
            title: 'Direct Investment Openness',
            value: 'no change',
            class: 'no-change'
        },
        {
            title: 'Financial System Development',
            value: 'no change',
            class: 'no-change'
        }
    ];
</script>

<div class='quarterly'>
    <h2>Policy Changes: Q3 2021 Update</h2>
    <p>Did China move closer or further from OECD norms?</p>
    <ul>
        {#each quarterlyData as quarter}
            <li class='{quarter.class}'><span>{quarter.value}</span><h4>{quarter.title}</h4></li>
        {/each}
    </ul>
    <div class="latest">
        <span>Read the quarterly update:</span>
        <a href="#">Lorem ipsum dolor sit amet consectetuer adipi</a>
    </div>
</div>

<style type="text/css">
    .quarterly {
        margin: 40px auto 80px;
        border-radius: 4px;
        background-color: #EFF4F8;
        padding: 25px;
    }

    .latest {
        text-align: center;
    }

    .latest span {
        font-size: 13px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        margin-right: 3px;
    }

    .latest a {
        text-decoration: underline;
        font-weight: bold;
        font-size: 14px;
    }

    h2 {
        text-align: center;
        margin-bottom: 0;
        font-size: 22px;
    }

    p {
        font-size: 16px;
        text-align: center;
        color: #122431;
        margin-bottom: 40px;
        margin-top: 5px;
    }

    ul {
        list-style: none;
        padding: 0 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    li {
        width: 100%;
        margin-bottom: 30px;
        font-size: 14px;
        display: flex;
        align-items: center;
    }

    @media (min-width: 512px) {
        li {
            width: 50%;
        }
    }

    @media (min-width: 768px) {
        li {
            width: 28%;
        }
    }

    li span {
        display: inline-block;
        padding: 6px 20px;
        margin-right: 15px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 12px;
        border-radius: 4px;
        width: 70px;
        text-align: center;
    }

    li h4 {
        display: inline-block;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        max-width: 150px;
    }

    @media (min-width: 768px) {
        li h4 {
            max-width: inherit;
        }
    }

    li.no-change span {
        color: #234462;
        background-color: #C4D6E6;
    }

    li.closer span {
        color: #066922;
        background-color: #C1E0D0;
    }

    li.further span {
        background-color: #F6E8D7;
        color: #D18B36;
    }
</style>










