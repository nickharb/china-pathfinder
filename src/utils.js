// Modified from https://observablehq.com/@harrystevens/cubic-bezier-curve

// import { indexOf, over } from "lodash";

// xSwing determines the swerve of the curve
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


export default {cubicBezier};

