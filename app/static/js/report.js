
const month=['January','February','March','April','May','June','July',
'August','September','October','November','December'];

$(document).ready(function () {
  kitchen()
  expense()
  Office()
  ChartCheck()
  //LineChartCheck()
  

  });
  
function expense() {
  $('.chart-report').easyPieChart({
            size: 180,
            barColor: "#4B569C",
            scaleLength: 0,
            lineWidth: 20,
            trackColor: "#525151",
            lineCap: "circle",
            animate: 2000,
          });
  
    };
$('#month-select').change(function(){
    var monthSelect=$(this).val();
    data=['change month',monthSelect]
    fetch("http://127.0.0.1:8080/report",{
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(data)
    }).then(res=>{
        if(res.ok){
          return res.json()
        }else{
          alert('something is wrong')
        }
      }).then(jsonResponse=>{
        console.log(jsonResponse)
        let month=jsonResponse[0]
        let money=jsonResponse[1]
        let per=jsonResponse[2]
        let spendDiff=jsonResponse[3]

        $('.chart-report').attr('data-percent', per.toString().trim());
        $('.expense-pre-report').text(per.toString()+'%');
        $('.money-report').text('$'+money.toString());
        $('.month-name').text(month)
        if (Math.sign(spendDiff)==0){
          
        }
        else if(Math.sign(spendDiff)==1){
          $('.overExpense-title').text('Under spend money:')

        }
        else if(Math.sign(spendDiff)==-1){
          $('.overExpense-title').text('Over spend money:')

        }
        $('.overExpense').text('$'+spendDiff.toString())

        $('.chart-report').data('easyPieChart').update(per)
  
    });

})

function kitchen(){
  $('.KitchenChart-report').easyPieChart({
    size: 180,
    barColor: "#647FE0",
    scaleLength: 0,
    lineWidth: 20,
    trackColor: "#525151",
    lineCap: "circle",
    animate: 2000,
  });
}

$('#KitchenMonth-select,#Paid-select').change(function(e){
  var target = $(e.target)
  var monthSelect=$('#KitchenMonth-select').val();
  var paidSelect=$('#Paid-select').val();
  var KitchenMonthName=$('.KitchenMonth-name').text();
  data=[]
  if (monthSelect.length==0){
    data=['change kitchen',KitchenMonthName,paidSelect]
   
  }
  else{
    data=['change kitchen',monthSelect,paidSelect]
  }
  fetch("http://127.0.0.1:8080/report",{
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(data)
    }).then(res=>{
      if(res.ok){
        return res.json()
      }else{
        alert('something is wrong')
      }
    }).then(jsonResponse=>{
      let month=jsonResponse[0]
      let money=jsonResponse[1]
      let per=jsonResponse[2]
      let spendDiff=jsonResponse[3]

      $('.KitchenChart-report').attr('data-percent', per.toString());
      $('.Kitchenexp-pre-report').text(per.toString()+'%');
      $('.KitchenMoney-report').text('$'+money.toString());
      $('.KitchenMonth-name').text(month)
      if (paidSelect.length==0){ 
        $('.Paid-name').text('Order Status')
      }
      else{
        $('.Paid-name').text(paidSelect)
      }
      if (Math.sign(spendDiff)==0){
      }
      else if(Math.sign(spendDiff)==1){
        $('.KitchenExpense-title').text('Under spend money:')
      }
      else if(Math.sign(spendDiff)==-1){
        $('.KitchenExpense-title').text('Over spend money:')
  
      }
      $('.KitchenOverExpense').text('$'+spendDiff.toString())

      $('.KitchenChart-report').data('easyPieChart').update(per)
  
     
    })


})

 
function Office(){
  $('.OfficeChart-report').easyPieChart({
    size: 180,
    barColor: "#72B8F4",
    scaleLength: 0,
    lineWidth: 20,
    trackColor: "#525151",
    lineCap: "circle",
    animate: 2000,
  });
}

$('#OfficeMonth-select,#OfficePaid-select').change(function(e){
  var monthSelect=$('#OfficeMonth-select').val();
  var paidSelect=$('#OfficePaid-select').val();
  var OfficeMonthName=$('.OfficeMonth-name').text();
  data=[]
  if (monthSelect.length==0){
    data=['change Office',OfficeMonthName,paidSelect]
  }
  else{
    data=['change Office',monthSelect,paidSelect]
  }
  fetch("http://127.0.0.1:8080/report",{
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(data)
    }).then(res=>{
      if(res.ok){
        return res.json()
      }else{
        alert('something is wrong')
      }
    }).then(jsonResponse=>{
      let month=jsonResponse[0]
      let money=jsonResponse[1]
      let per=jsonResponse[2]
      let spendDiff=jsonResponse[3]

      $('.OfficeChart-report').attr('data-percent', per.toString());
      $('.Office-pre-report').text(per.toString()+'%');
      $('.OfficeMoney-report').text('$'+money.toString());
      $('.OfficeMonth-name').text(month)
      if (paidSelect.length==0){ 
        $('.OfficePaid-name').text('Order Status')
      }
      else{
        $('.OfficePaid-name').text(paidSelect)
      }
      if (Math.sign(spendDiff)==0){
      }
      else if(Math.sign(spendDiff)==1){
        $('.OfficeExpense-title').text('Under spend money:')
      }
      else if(Math.sign(spendDiff)==-1){
        $('.OfficeExpense-title').text('Over spend money:')
  
      }

      $('.officeExpense').text('$'+spendDiff.toString())

      $('.OfficeChart-report').data('easyPieChart').update(per)

    });

})
function ChartCheck() {
  data=['check',0]
  fetch("http://127.0.0.1:8080/report",{
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(data)
    }).then(res=>{
      if(res.ok){
        return res.json()
      }else{
        alert('something is wrong')
      }
    }).then(jsonResponse=>{
      BarChart(jsonResponse[0])
      LineChartCheck(jsonResponse[1])
      PaidChart(jsonResponse[2])
      PieChart(jsonResponse[3])
      PieChartLow(jsonResponse[4])
    })
}

function BarChart(reportCheckout){
  var barColors = ["#72B8F4", "#72B8F4","#72B8F4","#72B8F4","#72B8F4",
  "#72B8F4","#72B8F4","#72B8F4","#72B8F4","#72B8F4","#72B8F4","#72B8F4"];
  var xValues=[]
  var yValues=[]
  for(let x=0;x< month.length;x++){
    for(const[key,value] of Object.entries(reportCheckout)){
      if(key==month[x]){
        xValues.push(key)
        yValues.push(value)           
      }
    }
}
  new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: {display: false},
      title: {
        display: true,
      }
    }
  });

}

function LineChartCheck(UnpaidReport) {
    var barColors = ["#1D90F4", "#1D90F4","#1D90F4","#1D90F4","#1D90F4",
    "#1D90F4","#1D90F4","#1D90F4","#1D90F4","#1D90F4","#1D90F4","#1D90F4"];
  var xValues=[]
  var yValues=[]
  for(let x=0;x< month.length;x++){
    for(const[key,value] of Object.entries(UnpaidReport)){
      if(key==month[x]){
        xValues.push(key)
        yValues.push(value)
                   
      }
  
    }
}
new Chart("myChartLine", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
    backgroundColor: barColors,
    data: yValues
     }]
       },
      options: {
      legend: {display: false},
      title: {
        display: true,
      }
   }
});  
}

function PaidChart(PaidReport){
  var barColors = ["#9A4E91", "#9A4E91","#9A4E91","#9A4E91","#9A4E91",
  "#9A4E91","#9A4E91","#9A4E91","#9A4E91","#9A4E91","#9A4E91","#9A4E91"];
  var xValues=[]
  var yValues=[]
  for(let x=0;x< month.length;x++){
    for(const[key,value] of Object.entries(PaidReport)){
      if(key==month[x]){
        xValues.push(key)
        yValues.push(value)           
      }
    }
  }
  new Chart("myChartPaid", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: {display: false},
      title: {
        display: true,
      }
    }
  });
}

function PieChart(InventoryReport){
  var barColors = ["#1D90F3", "#72B8F4","#8EB2D1","#647FE0",];
  var xValues=[]
  var yValues=[]
  var Total=0

 
  for(const[key,value] of Object.entries(InventoryReport)){
    if(key=='Total Item'){
       Total=value          
      }
      else{
        xValues.push(key)
        yValues.push(value)
      }
    }
  $('.total-value').text(Total)
    new Chart("myChartPie", {
      type: "doughnut",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        title: {
          display: false,
        }
      }
    });
  
}

function PieChartLow(lowData) {
  var barColors = ["#647FE0", "#9A4E91","#6a4e9a","#62376c",];
  var xValues=[]
  var yValues=[]

  for(const[key,value] of Object.entries(lowData)){
      xValues.push(key)
      yValues.push(value)           
  }
  new Chart("myChartPieLow", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: false,
      }
    }
  });

}