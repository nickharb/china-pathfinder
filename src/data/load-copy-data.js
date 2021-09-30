import { csv } from 'd3';
const dataPath = '../data/copy.csv';

const loadCopyData = async () => {

    const data = await csv(dataPath);

    let output = [];
    
    data.forEach( (x) => { 
        output.push({
            "category": x.category,
            "label": x.label,
            "name": x.name,
            "title1": x.title1,
            "title2": x.title2,
            "definition": x.definition,
            "additional": x.additional,
            "summary": x.summary
        });
    });

    return output;
};

export default loadCopyData;