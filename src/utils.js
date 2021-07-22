// Modified from https://observablehq.com/@harrystevens/cubic-bezier-curve

import { indexOf, over } from "lodash";

function cubicBezier(pt1, pt2, xSwing, p){

    let a = pt1;
    let b = (pt1[0]< pt2[0]) ? [pt1[0] - xSwing, pt1[1] + (pt2[1]-pt1[1])/3] : [pt1[0] + xSwing, pt1[1] + (pt2[1]-pt1[1])/3];
    let c = (pt1[0]< pt2[0]) ? [pt2[0] + xSwing, pt1[1] + (pt2[1]-pt1[1])/3*2] : [pt2[0] - xSwing, pt1[1] + (pt2[1]-pt1[1])/3*2];
    let d = pt2;
    [a,b,c,d].join(' ')
    
    return 'M ' + a[0] + ' ' + a[1] + ' C ' + b[0] + ' ' + b[1] + ', ' + c[0] + ' ' + c[1] + ', ' + d[0] + ' ' + d[1]; 

    // const interpolate = (i, t) => Math.pow((1 - t), 3) * a[i] + 3 * t * Math.pow((1 - t), 2) * b[i] + 3 * Math.pow(t, 2) * (1 - t) * c[i] + Math.pow(t, 3) * d[i],
    //       i = t => [interpolate(0, t), interpolate(1, t)],
    //       l = geometric.lineLength([a, d]),
    //       n = Math.floor(l),
    //       o = [];
  
    // for (let j = 0; j <= n; j += p || 1){
    //   o.push(i(j / n));
    // }
  
    // if (l !== n) o.push(d);
    // return o;
  };


  function noOverlap(input_array, space) {

    let overlapped=[],output_array = [];
    const arrayLen = input_array.length;
    let gap = space;

    input_array.sort((a,b)=> a.x - b.x);

    adjustPosition(input_array.map((d,i)=>i));

    function adjustPosition(index_array) {
      overlapped=[];
      index_array.forEach((i) => {
        if (i>0 && i< arrayLen -1) {
          if (index_array.length < arrayLen || (input_array[i]['x'] - input_array[i-1]['x'] < gap)) { //if overlapping with the previous one
            if (input_array[i+1]['x'] - input_array[i-1]['x'] > 2*gap ) {
              // move the current one to the right
              input_array[i]['x'] = input_array[i-1]['x'] + gap;
            } else if ((i>1) && (input_array[i]['x']-input_array[i-2]['x'] > 2*gap)) {
              // move the previous one to the left
              input_array[i-1]['x'] = input_array[i]['x'] - gap;
            } else {
              if (input_array[i+1]['x'] - input_array[i]['x'] > gap) {
                input_array[i]['x'] = input_array[i-1]['x'] + gap;
                if (overlapped.indexOf(i+1)==-1) {
                  overlapped.push(i+1);
                }
              } else if ((i>1) && (input_array[i-1]['x'] - input_array[i-2]['x'] > gap)) {
                input_array[i-1]['x'] = input_array[i]['x'] - gap;
                if (overlapped.indexOf(i-1)==-1) {
                  overlapped.push(i-1);
                }

              } else { //overlapping on both sides
                console.log(i);
                if (overlapped.indexOf(i-1)==-1) {
                  overlapped.push(i-1);
                }
                if (overlapped.indexOf(i+1)==-1) {
                  overlapped.push(i+1);
                }
              }

              if (overlapped.indexOf(i)==-1) {
                overlapped.push(i)
              }
            }
          }


        }
      })

      
      // console.log(overlapped)

      if (overlapped.length>0) {
        // adjustPosition(overlapped.sort((a,b)=> a-b));
      }



    }

    return input_array;

  }

export default {cubicBezier, noOverlap};

