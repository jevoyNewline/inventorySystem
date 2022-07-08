$(' div #menu-optoin,#fa').on('click', function(){
    $('div #menu-optoin').removeClass('active');
    $('div #menu-optoin').children('div').removeClass('active');
    $('div #menu-optoin').find('#fa').removeClass('active');
    $('div #menu-optoin').children('a').removeClass('active');
    

    $( this ).addClass('active');
    $(this).children('div').addClass('active');
    $(this).find('i').addClass('active');
    $(this).children('a').addClass('active');

    
 })


/*=============================================
=            Onload Functions            =
=============================================*/
 $(document).ready(function () {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(drawItemCheckout);

    
});

/*=============================================
=            Total Expense Report            =
=============================================*/

$(function expense() {
  var sen='yes'
  fetch("http://127.0.0.1:8080/expense",{
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(sen)
  }).then(res=>{
    if(res.ok){
      return res.json()
    }else{
      alert('something is wrong')
    }
  }).then(jsonResponse=>{
    let firstValue = Object.values(jsonResponse)[0]; // "plain value"
    let secValue = Object.values(jsonResponse)[1]; // "plain value"
    
    $('.chart').attr('data-percent', firstValue.toString());
    $('.money').text(secValue);
    $('.expense-pre').text(firstValue.toString()+'%');
    $('.chart').easyPieChart({
      size: 160,
      barColor: "#4B569C",
      scaleLength: 0,
      lineWidth: 20,
      trackColor: "#525151",
      lineCap: "circle",
      animate: 2000,
    });

  });
 
});

/*=====  End of Total Expense Report  ======*/


 function getReports (){
   var data= document.getElementById('Inventory-Summary-box').value;
  
 }


/*=============================================
=            Draw pie chart function            =
=============================================*/
// Draw the chart and set the chart values
function drawChart() {
  var lebData=[]
  const cars = [
    { "make":"Porsche", "model":"911S" },
    { "make":"Mercedes-Benz", "model":"220SE" },
    { "make":"Jaguar","model": "Mark VII" }
  ];
  fetch("http://127.0.0.1:8080/inventorysummuary",{
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(cars)
  }).then(res=>{
    if(res.ok){
      return res.json()
    }else{
      alert('something is wrong')
    }
  }).then(jsonResponse=>{
    
    for(const[key,value] of Object.entries(jsonResponse)){
      lebData.push([key,value])
      
    }
    var data = google.visualization.arrayToDataTable(lebData);

    // Optional; add a title and set the width and height of the chart
    var options = {'title':'', 'width':350, 'height':195,backgroundColor: '#2E2E30',color: '#FFFFFF;', pieHole: 0.6,legend: {
      textStyle: { color: 'white' }}} ;
    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('Inventory-Summary-box'));
    chart.draw(data, options);

  })
}
/*=====  End of Draw pie chart function  ======*/


/*=============================================
=            Draw Bar Chart            =
=============================================*/

function drawItemCheckout(){
  var sen='yes'
  fetch("http://127.0.0.1:8080/itemcheckout",{
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(sen)
  }).then(res=>{
    if(res.ok){
      return res.json()
    }else{
      alert('something is wrong')
    }
  }).then(jsonResponse=>{
    const month=['Month', 'Jan','Feb','Mar','Apr','Jun','Jul',
    'Aug','May','Sept','Oct','Nov','Dec'];
    var monthlabel=[]
    for(let x=0;x< month.length;x++){
      for(const[key,value] of Object.entries(jsonResponse)){
        if(month[x]==key){
          monthlabel.push([key,value]);
        }
        
      }


    }
    var data = google.visualization.arrayToDataTable(monthlabel);
    // Optional; add a title and set the width and height of the chart
    var options = {'title':'', 'width':350, 'height':195,backgroundColor: '#2E2E30',color: '#FFFFFF;',bars: ' vertical', hAxis: {
      textStyle: { color: '#8D8D8D' }}} ;
    // Display the chart inside the <div> element with id="barchart"
    var chart = new google.visualization.BarChart(document.getElementById('itemCheckout'));
    chart.draw(data, options);
  })

}

/*=====  End of Draw Bar Chart  ======*/



/*=============================================
=            Modal             =
=============================================*/
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("addItemBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/*=============================================
=             Edit Form model Function           =
=============================================*/

var spanEdit = document.getElementsByClassName("close2")[0];

// When the user clicks on <span> (x), close the modal
var modalEditClose = document.getElementById("myModal-edit");
spanEdit.onclick = function() {
  modalEditClose.style.display = "none";
}

/*=====  End of   ======*/


/*=============================================
=            Add Order Modal Function            =
=============================================*/
var modalOrder = document.getElementById("myModal-order");

// Get the button that opens the modal
var btnOrder = document.getElementById("addOrderBtn");

var spanOrder = document.getElementsByClassName("close1")[0];
btnOrder.onclick = function() {
  modalOrder.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanOrder.onclick = function() {
  modalOrder.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modalOrder) {
    modalOrder.style.display = "none";
  }
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modalEditClose) {
    modalEditClose.style.display = "none";
  }
}

/*=====  End of Add Order Modal Function  ======*/




/*=====  End of Modal   ======*/



/*=============================================
=            Stock Table Edit Function            =
=============================================*/

//Edit Button function for stock 
$('.editBtn').on('click', function(event){
  var percentClass=$(this).closest('.data');
  var stockIdPer=percentClass.children('.marker');
  var stockID=stockIdPer.children('.stockId');
  var itemNamePer=percentClass.children('.stock-itemName');
  var itemName=itemNamePer.children('.item');
  var stockNumber=percentClass.children('.stock-qty');
  var stockDescription=percentClass.children('.stock-description');
  var stockComment=percentClass.children('.stock-comment');
  var stockBrand=percentClass.children('.stock-brand');
  var stockCategory=percentClass.children('.stock-category');
  var stockLocation=percentClass.children('.stock-location');
  // Get the button that opens the modal
  var modalEdit = document.getElementById("myModal-edit");
  modalEdit.style.display = "block";
  $('#stockId-edit').val(stockID.text());
  $('#itemName-edit').val(itemName.text());
  $('#stock-edit').val(stockNumber.text());
  $('#Description-edit').val(stockDescription.text());
  $('#comment-edit').val(stockComment.text());
  $('#brand-edit').val(stockBrand.text());
  $('#category-edit').val(stockCategory.text());
  $('#location-edit').val(stockLocation.text());
  
})
 
 /*=============================================
 =            Filter/Search Function          =
 =============================================*/
 $('#filterBtn').on('click', function(){
  var categoryFilter=document.getElementById('category-filter')
  var categoryFilterVal = categoryFilter.options[categoryFilter.selectedIndex].value;
  var brandFilter=document.getElementById('brand-filter')
  var brandFilterVal = brandFilter.options[brandFilter.selectedIndex].value;
  var sortBy=document.getElementById('sort-by')
  var sortByVal=sortBy.options[sortBy.selectedIndex].value;
  //var sortBy=$('#sort-by option:selected').text();
  var table= document.getElementById('stock-table');
  var tr = table.getElementsByTagName("tr");
  if(brandFilterVal.length==0 && categoryFilterVal.length==0 && sortByVal.length==0 ){
    alert('Please select an option to filter')

  }
  else{
    for (i=1; i < tr.length; i++){
      tdBrand = tr[i].getElementsByTagName("td")[5].textContent;
      tdCategory = tr[i].getElementsByTagName("td")[6].textContent;
      tdSortBy = parseInt(tr[i].getElementsByTagName("td")[2].textContent);
      if(sortByVal.toString()=="Low Stock"){
        if (tdBrand.toString()==brandFilterVal.toString() || tdCategory.toString()==categoryFilterVal.toString()|| tdSortBy<5){
          tr[i].style.display = "";
    
        }
        else{
          tr[i].style.display = "none";
    
        }

      }
      else if (tdBrand.toString()==brandFilterVal.toString() || tdCategory.toString()==categoryFilterVal.toString()){
        tr[i].style.display = "";
  
      }
      else{
        tr[i].style.display = "none";
  
      }
  
    }

  }
  

})
 
 
 /*=============================================
 =            Stock Search function           =
 =============================================*/
 function stockSearch(){
  input=document.getElementsByClassName('stockSearch')[0].value;
  filter = input.toUpperCase()
  //console.log(filter)
  var table= document.getElementById('stock-table');
  var tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    tdStockName=td.children[3];
    if (td) {
      txtValue = tdStockName.textContent || tdStockName.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
 }
 $('.stockSearch').keypress(function (e) {                                       
  if (e.which == 13) {
       e.preventDefault();
       //do something   
  }
});


/*=====  End of Stock Table Edit Function  ======*/





