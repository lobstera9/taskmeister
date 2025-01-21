import { formatDate } from './Date.js';
import { ChartStruct } from './ChartStruct.js';
import { chartGroups,getChartTitleByKey } from './Constants.js';

export const dailyStats =(tasks,groupBy,chartStyle,dataType,dateRange)=>{
    if(!tasks) return;
    tasks = tasks.filter(a=>new Date(a.created_at) >= new Date(dateRange.startDate) && new Date(a.created_at) <= new Date(dateRange.endDate));
    var mapOfKeys =  Map.groupBy(tasks,(task)=>formatDate(task[groupBy.key]));
    var stats = calculateStat(mapOfKeys,groupBy,dataType);
    var dataArr = [];
    var labelArr = [];
    mapOfKeys.keys().forEach(a=>{
      labelArr.push(a);
    });
    var options ={
      chart: {
        height: 1500,
        width: 900,
        type: chartStyle
      },
      xaxis: {
        categories: labelArr
      }
    };
    var chart = new ChartStruct(options,stats);
    return chart;
}

const calculateStat=(map,chartTitleKey,dataType)=>{
  switch(dataType){
    case 'COUNT':
      return calculateStatByCount(map,chartTitleKey);
    case 'STATUS':
      return calculateStatByStatus(map,chartTitleKey);
    default:
      return calculateStatByCount(map,chartTitleKey);
  }
}

const calculateStatByCount=(map,chartTitleKey)=>{
  var statOfKeys = new Map(map.keys().map(a=>[a,map.get(a).length]));
  var statArr = [];
  statOfKeys.keys().forEach(a=>{
    statArr.push(statOfKeys.get(a));
  });
  var series = [
    {
      name: getChartTitleByKey(chartTitleKey),
      data: statArr
    }
  ];
  return series;
}

const calculateStatByStatus=(map,chartTitleKey)=>{
  // hint: statuses will come only 3 times in series, and the values for each categories will be represented by array index.
  // refer var series for why charts are not working
  
  //var data = Array.from(map.keys()).map(a=>{
  //  var subMap = Map.groupBy(map.get(a),(element)=>element.status);
  //  var arr = [];
  //  subMap.keys().forEach(b=>{
  //    var sArr = [];
  //    sArr.push(subMap.get(b).length);
  //    var dat = {
  //      name: `Tasks ${b}`,
  //      data: sArr,
  //    }
  //    arr.push(dat);
  //  });
  //  
  //return arr; 
  //});
  var setOfStatus = new Set(Array.from(map.keys()).map(a=>map.get(a)).flatMap(a=>a).map(a=>a['status']));
  var data = [];
  setOfStatus.forEach(a=>{
    var dataArr = [];
    map.keys().forEach(b=>{
      var arr = map.get(b);
      var count = arr.filter(c=>c.status === a).length || 0;
      dataArr.push(count);
    });
    var d = {
      name: `Tasks ${a}`,
      data: dataArr
    };
    data.push(d);
  });

return data;
}

const calculateStatByDomain=(map,chartTitleKey)=>{
var series=[
  {
    name: "Tasks Pending",
    data: [10,20,30]
  },
  {
    name: "Tasks In Progress",
    data: [100,80,10]
  },
  {
    name: "Tasks Completed",
    data: [20,30,40]
  }
]
}
