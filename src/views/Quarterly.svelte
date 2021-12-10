<script>
    export let quarterlyData;
</script>

<div class='quarterly'>
    <h2>{quarterlyData.title}</h2>
    <p>{quarterlyData.subtitle}</p>
    <ul>
        <li class='{quarterlyData.fdi}'><span>{quarterlyData.fdiLabel}</span><h4>Direct Investment Openness</h4></li>
        <li class='{quarterlyData.portfolio}'><span>{quarterlyData.portfolioLabel}</span><h4>Portfolio Investment Openness</h4></li>
        <li class='{quarterlyData.trade}'><span>{quarterlyData.tradeLabel}</span><h4>Trade Openness</h4></li>
        <li class='{quarterlyData.growth}'><span>{quarterlyData.growthLabel}</span><h4>Financial System Development</h4></li>
        <li class='{quarterlyData.competition}'><span>{quarterlyData.competitionLabel}</span><h4>Market Competition</h4></li>
        <li class='{quarterlyData.innovation}'><span>{quarterlyData.innovationLabel}</span><h4>Modern Innovation System</h4></li>
    </ul>
    <div class="latest">
        <span>Latest info:</span>
        <a href="{quarterlyData.postLink}">{quarterlyData.postTitle}</a>
    </div>
</div>

<style type="text/css">
    .quarterly {
        margin: 40px auto 60px;
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
        color: #234462;
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
        margin-bottom: 20px;
        margin-top: 5px;
    }

    ul {
        list-style: none;
        padding: 0 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-bottom: 20px;
    }

    li {
        width: 100%;
        margin-bottom: 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding: 0;
    }

    @media (min-width: 570px) {
        li {
            width: 50%;
        }
    }

    @media (min-width: 800px) {
        li {
            width: 30%;
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
        text-align: center;
        flex: 0 0 70px;
    }

    li h4 {
        display: inline-block;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        line-height: 1.2;
        color: #122431;
        margin-right: 10px;
    }

    @media (min-width: 768px) {
        li h4 {
            max-width: inherit;
        }
    }

    li.nochange span {
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










