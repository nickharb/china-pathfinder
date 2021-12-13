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
        margin: 40px auto;
        border-radius: 4px;
        background-color: #EFF4F8;
        padding: 25px;
    }

    .latest {
        text-align: center;
        line-height: 1.2;
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
        font-size: 20px;
        margin-top: 0;
    }

    @media (min-width: 768px) {
        h2 {
            font-size: 22px;
            margin-top: 10px;
        }
    }

    p {
        font-size: 14px;
        text-align: center;
        color: #122431;
        margin-bottom: 20px;
        margin-top: 10px;
        line-height: 1.2;
    }

    @media (min-width: 768px) {
        p {
            font-size: 16px;
        }
    }

    ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-bottom: 10px;
    }

    @media (min-width: 768px) {
        ul {
            padding: 0 40px;
            margin-bottom: 20px;
        }
    }

    li {
        width: 100%;
        margin-bottom: 10px;
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
            margin-bottom: 20px;
        }
    }

    li span {
        display: inline-block;
        padding: 3px 10px;
        margin-right: 15px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 11px;
        border-radius: 4px;
        text-align: center;
        flex: 0 0 70px;
    }

    @media (min-width: 768px) {
        li span {
            padding: 6px 20px;
            flex: 0 0 70px;
        }
    }

    li h4 {
        display: inline-block;
        font-size: 12px;
        font-weight: normal;
        margin: 0;
        line-height: 1.2;
        color: #122431;
    }

    @media (min-width: 768px) {
        li h4 {
            margin-right: 10px;
            font-size: 14px;
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










