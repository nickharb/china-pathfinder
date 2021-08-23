import { csv } from 'd3';
const dataPath = './data/composite-score.csv';
// const parseTimestamp = timeParse('%m/%d/%Y %H:%M %Z');
// const parseDate = timeParse('%m/%d/%Y');

const loadData = async () => {

    const data = await csv(dataPath); // d3 load csv function

    let domains = ['growth','competition','innovation','trade','fdi','portfolio'];

    data.sort((a,b) => a.country == 'China' ? 1 : -1);

    let output = [];
    
    domains.forEach( (x) => { 
        output.push({
            domain: x, 
            comps: data.map(n => n[x]), 
            countries: data.map(n => n["country"])
        });
    });


    return({countries: data, domains: output});
};

export default loadData;