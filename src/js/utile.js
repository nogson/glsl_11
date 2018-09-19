
export default class Utile {

  sumAlpha(rangeH,index,scroll){
    let threshold = 200;
    let minThreshold = rangeH * index * 4;
    let maxThreshold = rangeH * (index + 1) * 4;
    let minExtraThresholdOver = minThreshold + threshold;
    let maxExtraThresholdUnder = maxThreshold - threshold;
    let alpha = 1.0;
  
    if(minExtraThresholdOver > scroll && index > 0){
      alpha = 1.0 - (minExtraThresholdOver - scroll) / (threshold * 2);
    }
  
    if(maxExtraThresholdUnder  <  scroll ){
      alpha = 1.0 - (scroll - maxExtraThresholdUnder) / (threshold * 2);
    }
    return alpha;
  }

}