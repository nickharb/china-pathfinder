import { csv, timeParse } from 'd3';
const dataPath = './data/composite-score.csv';
// const parseTimestamp = timeParse('%m/%d/%Y %H:%M %Z');
// const parseDate = timeParse('%m/%d/%Y');

const loadData = async () => {
  const data = await csv(dataPath);
  let areas = Object.keys(data[0]);
  areas.pop();
  let output=[];
  areas.forEach( (x) => { 
    output.push({
      area: x, 
      comps: data.map(n => n[x]), 
      countries: data.map(n=> n["country"])
    })
  })
  return({countries: data, areas: output});
};

export default loadData;