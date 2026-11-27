(function(root){
  function calculate(p){
    const fields=['reach','leadRate','closeRate','price','refundRate','variableCost','acquisition','fixedCost','fixedHours','hoursPerOrder','availableHours'];
    for (const k of fields) if (typeof p[k] !== 'number' || !Number.isFinite(p[k]) || p[k]<0) throw new Error('请输入非负有限数值：'+k);
    for (const k of ['leadRate','closeRate','refundRate']) if(p[k]>100) throw new Error('比率不能超过100%');
    const demand=p.reach*p.leadRate/100*p.closeRate/100;
    const capacity=p.availableHours<p.fixedHours?0:p.hoursPerOrder===0?Infinity:Math.max(0,(p.availableHours-p.fixedHours)/p.hoursPerOrder);
    const orders=Math.min(demand,capacity);
    const revenue=orders*p.price*(1-p.refundRate/100);
    const contribution=revenue-orders*p.variableCost-p.acquisition;
    const operating=contribution-p.fixedCost;
    const hours=p.fixedHours+orders*p.hoursPerOrder;
    return {demand,capacity,orders,revenue,contribution,operating,hours,perHour:hours>0?contribution/hours:null,unserved:Math.max(0,demand-orders),infeasible:p.availableHours<p.fixedHours};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={calculate};else root.FreeWealth={calculate};
})(typeof globalThis!=='undefined'?globalThis:this);
