import { csv } from 'd3';
const dataPath = './data/indicators';

const loadIndicatorsData = async (indicatorName) => {

    const data = await csv(dataPath + '/' + indicatorName + '.csv');
    let indicators = Object.keys(data[0]).filter(d=> d!=='countries');
    let output = [];
    indicators.forEach((d)=>{

        let countries = [];

        data.forEach((x)=>{
            countries.push({country: x.countries, value: x[d]});
        })

        countries.sort((a,b)=> b.value - a.value); // sorts data from highest to lowest

        output.push({indicator: d, values: countries});
    })
    return(output);
};

export default loadIndicatorsData;