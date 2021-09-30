import { csv } from 'd3';
const dataPath = './data/indicators';

const loadIndicatorsData = async (indicatorName) => {

    const data = await csv(dataPath + '/' + indicatorName + '.csv'); // load the indicator data for current indicator
    let indicators = Object.keys(data[0]).filter(d => d !== 'country' && d !== 'id'); // grab all the annual indicators (exclude country and id fields)
    let output = [];

    indicators.forEach((d)=>{

        let countries = [];

        data.forEach((x)=>{
            countries.push({
                id: x.id,
                country: x.country,
                value: x[d]
            });
        })

        countries.sort((a,b)=> b.value - a.value); // sorts data from highest to lowest

        output.push({indicator: d, values: countries});
    })

    return(output);
};

export default loadIndicatorsData;