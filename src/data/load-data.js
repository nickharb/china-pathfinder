import { csv } from 'd3';
const dataPath = '../data/composite-score.csv';
// const parseTimestamp = timeParse('%m/%d/%Y %H:%M %Z');
// const parseDate = timeParse('%m/%d/%Y');

const loadData = async () => {

    const data = await csv(dataPath); // d3 load csv function

    // create an array of objects for the six areas
    // ... China appears as the last country

    // growth is financial system development
    // these are referenced across the program
    let areas = ['growth','competition','innovation','trade','fdi','portfolio'];

    data.sort((a,b)=> a.country == 'China' ? 1 : -1);

    let output = [];
    
    areas.forEach( (x) => { 
        output.push({
            area: x, 
            comps: data.map(n => n[x]),
            countries: data.map(n => n["country"])
        });
    });


    return({countries: data, areas: output});
};

export default loadData;



// import { csv } from 'd3';
// const dataPath = '../data/copy.csv';

// const loadCopyData = async () => {

//     const data = await csv(dataPath);

//     let output = [];
    
//     data.forEach( (x) => { 
//         output.push({
//             "category": x.category,
//             "label": x.label,
//             "name": x.name,
//             "title1": x.title1,
//             "title2": x.title2,
//             "definition": x.definition,
//             "additional": x.additional,
//             "summary": x.summary
//         });
//     });

//     return output;
// };

// export default loadCopyData;