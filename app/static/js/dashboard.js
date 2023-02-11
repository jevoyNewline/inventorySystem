
/* Comment */
const MultipleOrderValue=[];




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

async function drawItemCheckout(){
  var sen='yes'
  await fetch("http://127.0.0.1:8080/itemcheckout",{
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
  $('#myFile-additem').val('')
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

var orderModalEditClose= document.getElementsByClassName("close3")[0];
var orderModalEdit = document.getElementById("myModal-order-edit");
orderModalEditClose.onclick= function(){
  orderModalEdit.style.display = "none";
}
var DashInovModalEditClose= document.getElementsByClassName("close4")[0];
var DashInovModalEdit = document.getElementById("myModal-inovice-edit");
DashInovModalEditClose.onclick=function(){
  DashInovModalEdit.style.display = "none";

}
/*=====  End of   ======*/


/*=============================================
=            load image to box Function            =
=============================================*/
$('#myFile-editItem').change('click',function(event){
  var upload=$(this).closest('.file-box');

  var image= upload.children('.fileupload');
  var output=image.children('#output-editItem');
  

  var filename=upload.children('.filename-editItem');
  var imageName=filename.children('#imageName-editItem');
  var hold=event.target.files[0]
  output.attr('src',URL.createObjectURL(event.target.files[0]));
  output.css('display','block');
  filename.css('display','block');
  imageName.text(event.target.files[0].name);
})
var loadFileEditItem= function(event){
  var image = document.getElementById('output-editItem');
  var imageName = document.getElementById('imageName-editItem');
  var fileName=document.getElementsByClassName('filename-editItem')[0];
	image.src = URL.createObjectURL(event.target.files[0]);
  image.style.display="block";
  fileName.style.display="block";
  imageName.innerHTML=event.target.files[0].name;

}
var loadFileItem= function(event){
  var image = document.getElementById('output-additem');
  var imageName = document.getElementById('imageName-additem');
  var fileName=document.getElementsByClassName('filename-additem')[0];
	image.src = URL.createObjectURL(event.target.files[0]);
  image.style.display="block";
  fileName.style.display="block";
  imageName.innerHTML=event.target.files[0].name;
}
var loadFileInstock = function(event) {
	var image = document.getElementById('output-instock');
  var imageName = document.getElementById('imageName-instock');
  var fileName=document.getElementsByClassName('filename-instock')[0];
	image.src = URL.createObjectURL(event.target.files[0]);
  image.style.display="block";
  fileName.style.display="block";
  imageName.innerHTML=event.target.files[0].name;
};
var loadFile = function(event) {
	var image = document.getElementById('output');
  var imageName = document.getElementById('imageName');
  var fileName=document.getElementsByClassName('file-name')[0];
	image.src = URL.createObjectURL(event.target.files[0]);
  image.style.display="block";
  fileName.style.display="block";
  imageName.innerHTML=event.target.files[0].name;
};

var loadFileMultOrder= function(event) {
  var image = document.getElementById('output-multOrder');
  var imageName = document.getElementById('imageName-multOrder');
  var fileName=document.getElementsByClassName('fileName-multOrder')[0];
	image.src = URL.createObjectURL(event.target.files[0]);
  image.style.display="block";
  fileName.style.display="block";
  imageName.innerHTML=event.target.files[0].name;

}

var loadFileDashInvo= function(event){
  var image = document.getElementById('output-inoviceItem');
  var imageName = document.getElementById('imageName-inoviceItem');
  var fileName=document.getElementsByClassName('filename-inovice')[0];
	image.src = URL.createObjectURL(event.target.files[0]);
  image.style.display="block";
  fileName.style.display="block";
  imageName.innerHTML=event.target.files[0].name;

}

/*=====  End of load image to box Function  ======*/


/*=============================================
=            Add Order Modal Function            =
=============================================*/

//Function for In Stock Order modal
var inStock = document.getElementById("btn-inStock");
var inStock2 = document.getElementById("btn-inStockForm");
var btnNotStock=document.getElementById("btn-notStock");
var InstockForm= document.getElementById("form2");
var addOrderFom1 = document.getElementById("addOrder-form");
var MultOrder= document.getElementById("addMultOrder");
var MultOrderForm= document.getElementById("multOrderForm");

inStock.onclick= function(){
      /* form style */
  addOrderFom1.style.display="none"
  InstockForm.style.display="block";
  MultOrderForm.style.display="none";

   /* button style */
   inStock.style.display="none"
   btnNotStock.style.display="block";
   MultOrder.style.display="block";
}

btnNotStock.onclick= function(){
   /* form style */
  addOrderFom1.style.display="block";
  InstockForm.style.display="none";
  MultOrderForm.style.display="none";

  /* button style */
  btnNotStock.style.display="none";
  inStock.style.display="block";
  MultOrder.style.display="block";
}

MultOrder.onclick= function(){
    /* form style */
  modalOrder.style.display = "block";
  addOrderFom1.style.display="none";
  InstockForm.style.display="none";
  MultOrderForm.style.display="block";
  
  /* button style */
  btnNotStock.style.display="block";
  inStock.style.display="block";
  MultOrder.style.display="none";
 
}


var modalOrder = document.getElementById("myModal-order");

// Get the button that opens the modal
var btnOrder = document.getElementById("addOrderBtn");

var spanOrder = document.getElementsByClassName("close1")[0];
btnOrder.onclick = function() {
  modalOrder.style.display = "block";
  btnNotStock.style.display="none";
 
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
  if (event.target == orderModalEdit) {
    orderModalEdit.style.display = "none";
  }
  if (event.target ==  DashInovModalEdit) {
    DashInovModalEdit.style.display = "none";
  }
}

/*=====  End of Add Order Modal Function  ====*/

/*========================  End of Modal   =======================*/


/*=============================================
=            Multiple Form Function            =
=============================================*/
$("#multOrder-btnSave").on('click',function(){
var inputFile=document.getElementById('multOrder-myFile');
var multiStockId=document.getElementById('multOrder-itemName');
var multiStockIdValue= multiStockId.options[multiStockId.selectedIndex].value;
var multiItemName=$('#multOrder-itemName option:selected').text()
var multOrderQty=$('#multOrder-qty').val();
var multOrderCategory=$('#multOrder-category option:selected').text();
var multOrderStatus=$('#multOrder-status option:selected').text();
var multOrderComment=$('#multOrder-comment').val();
var multOrderDepartment=$('#multOrder-department option:selected').text();
var multOrderPrice=$('#multOrder-price').val();
var multOrderSupplier=$('#multOrder-supplier').val();

/* Image object Var */
var fileName=document.getElementsByClassName('fileName-multOrder')[0];
var image = document.getElementById('output-multOrder');


if (multiItemName.length==0||multOrderQty.length==0|| multOrderSupplier.length==0|| multOrderStatus.length==0 || multOrderPrice.length==0) {
  alert("Please enter data in: ITEM NAME,QTY,STATUS,PRICE & SUPPLIER")

}
else{
  if (MultipleOrderValue.length<5){
    MultipleOrderValue.push([multiStockIdValue,multiItemName,multOrderQty,multOrderComment,multOrderDepartment,multOrderCategory,
      multOrderStatus,multOrderPrice,inputFile.files[0],multOrderSupplier]);


      document.querySelector('#SavedOrderData').innerHTML+='<div class="me-md-auto d-flex align-items-center mt-3" id="save-box"> <span> '+ multiItemName+' </span><div class="ms-md-5 "> <button class="SavedOrderDel" type="button"><i class=" fs-7 SavedOrderIcon-delete bi bi-trash-fill"></i></button></div>'; 
      document.getElementById('SavedOrderData').style.display="block";
   

      //console.log(MultipleOrderValue);
      $('#multOrder-itemName').val("");
      $('#multOrder-qty').val("");
      $('#multOrder-category').val("");
      $('#multOrder-status ').val("");
      $('#multOrder-comment').val('');
      $('#multOrder-department').val('');
      $('#multOrder-price').val('');
      $('#multOrder-supplier').val('');
      
      /* Clearing image object */
      $('#multOrder-myFile').val('');
      image.style.display="none";
      fileName.style.display="none";

      console.log(MultipleOrderValue);



  }
  else{
    alert("Only 5 order can be log")
  }
  
}

})

$(document).on('click', '#SavedOrderData .SavedOrderDel',function(){
  var percentClass=$(this).closest('#save-box');
  var itemName = percentClass.children("span").text();
  var count=0;

  while(count<MultipleOrderValue.length){
    if(itemName.toString().trim()==MultipleOrderValue[count][0].toString().trim()){
      MultipleOrderValue.splice(count,1);
    }
    else{
      ++count;
    }
  }
  $(this).closest('#save-box').remove()
})

$(document).on('click','#SavedOrderData .submitBtn',function(){
  var totalCost=0;

  if(MultipleOrderValue.length==0){
    alert('NO ORDER WAS ENTERED!');

  }
  else{
    for(i=0; i<MultipleOrderValue.length; i++){
      //totalCost= totalCost + parseInt( MultipleOrderValue[i][6]);
    }

    MultipleOrderValue.push(['TotalCost', totalCost])

    fetch("http://127.0.0.1:8080/MultipleOrder",{
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(MultipleOrderValue)
    })

  }
})

/*=====  End of Multiple Form Function  ======*/





/*=============================================
=            Stock Table Edit Function            =
=============================================*/

//Edit Button function for stock 
$('.editBtn').on('click', function(event){
  var percentClass=$(this).closest('.data');
  var stockIdPer=percentClass.children('.marker');
  var stockID=percentClass.children('.stockId');
  var itemNamePer=percentClass.children('.stock-itemName');
  var img=itemNamePer.children('img').prop('src');
  var itemName=itemNamePer.children('.item');
  var stockNumber=percentClass.children('.stock-qty');
  var stockDescription=percentClass.children('.stock-description');
  var stockComment=percentClass.children('.stock-comment');
  var stockBrand=percentClass.children('.stock-brand').children(span);
  var stockDepart=percentClass.children('.stock-department').children(span);
  var stockCategory=percentClass.children('.stock-category');
  var stockLocation=percentClass.children('.stock-location');
  var user= percentClass.children('.stock-logBy');
  var freq= user.children('.freq');
  var stockLimit=user.children('.stockLimit');
  $('#myFile-editItem').val('')

  // get the image 
  var outputImg=$('#output-editItem');
  var filename=$('.filename-editItem');
  outputImg.attr('src',img);
  outputImg.css('display','block');


  // Get the button that opens the modal
  var modifyBox=document.getElementById("modify-box");
  modifyBox.style.display='none'
  var modalEdit = document.getElementById("myModal-edit");
  modalEdit.style.display = "block";
  var editForm=document.getElementById('editForm')
    editForm.style.display="block";
  $('#stockId-edit').val(stockID.text());
  $('#itemName-edit').val(itemName.text());
  $('#stock-edit').val(stockNumber.text());
  $('#Description-edit').val(stockDescription.text().trim());
  $('#comment-edit').val(stockComment.text());
  $('#brand-edit').val(stockBrand.text().trim());
  $('#department-edit').val(stockDepart.text().trim());
  $('#category-edit').val(stockCategory.text());
  $('#location-edit').val(stockLocation.text());
  $('#stockLimit-edit').val(stockLimit.text());
  $('#freqChange-edit').val(freq.text());
  
  
})
/*=============================================
=            Order Table Edit Function            =
=============================================*/
$('.orderEditBtn').on('click', function(){
  var percentClass=$(this).closest('.order-data');
  var orderId=percentClass.children('.orderId');
  var OrderItem=percentClass.children('.order-itemName');
  var orderNumber=percentClass.children('.order-qty');
  var orderComment=percentClass.children('.order-comment');
  var orderBrand=percentClass.children('.order-brand');
  var orderCategory=percentClass.children('.order-category');
  var orderStatus=percentClass.children('.orderStatus');
  var orderDate=percentClass.children('.order-date');
  var orderPrice=percentClass.children('.order-price');
  

  // Get the button that opens the modal
  var modalEdit = document.getElementById("myModal-order-edit");
  modalEdit.style.display = "block";
  var editForm=document.getElementById('editOrder-form')
  editForm.style.display="block";
  var modifyBox=document.getElementById("orderModify-box");
  modifyBox.style.display='none'
  $('#orderId-edit').val(orderId.text());
  $('#itemName-orderEdit').val(OrderItem.text());
  $('#qty-orderEdit').val(orderNumber.text());
  $('#comment-orderEdit').val(orderComment.text());
  $('#brand-orderEdit').val(orderBrand.text());
  $('#category-orderEdit').val(orderCategory.text());
  $('#order-statusEdit').val(orderStatus.text());
  $('#price-orderEdit').val(orderPrice.text());
  
  
})

/*=============================================
=            Invoice Table Edit Function              =
=============================================*/
$('.inovice-editBtn').on('click', function(){
  var percentClass=$(this).closest('.invoiceData');
  var invoiceId=percentClass.children('.inoviceId').text()
  var supplier=percentClass.children('.inoviceSupplier').text()
  var img=percentClass.children('.DashInvo-img')
  var imgVal=img.children('img').prop('src');
  var fileName= document.getElementsByClassName('filename-inovice')[0];
  fileName.style.display='none';
  $('#myFile-inoviceItem').val('')

  // get the image 
  var outputImg=$('#output-inoviceItem');
  outputImg.attr('src',imgVal);
  outputImg.css('display','block');
  

 // Get the button that opens the modal
  var modifyBox=document.getElementById("myModal-inovice-edit");
  modifyBox.style.display='block'
$('#inovice-editSupp').val(supplier);
$('#inoviceId-edit').val(invoiceId);

})


/*=====  End of Invoice Table Edit Function    ======*/



/*=============================================
=            Get Stock Modify Data Function            =
=============================================*/
$('.stock-modifyBtn').on('click', function(){
  var loader=$('.loader')
  loader.css('display','flex');
  var percentClass=$(this).closest('.data');
  var stockID=percentClass.children('.stockId').text();
  var itemNamePer=percentClass.children('.stock-itemName');
  var itemName=itemNamePer.children('.item').text();
  data=['stock dash',stockID]
  fetch("http://127.0.0.1:8080/modify",{
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(data)
  }).then(res=>{
    loader.removeClass('active');
    if(res.ok){
      return res.json()
    }else{
      alert('something is wrong')
    }
  }).then(jsonResponse=>{
    if (jsonResponse=='No Value'){
      alert(" No Modify data")
    }
    else{
      var table=document.getElementById('modify-data')
      table.textContent='';
    for(i=0;i<jsonResponse.length;i++){
      var tr= document.createElement("tr");
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      var td3 = document.createElement("td");
      var td4 = document.createElement("td");
      var td5 = document.createElement("td");
      td1.append(itemName);
      td2.append(jsonResponse[i][2]);
      td3.append(jsonResponse[i][1]);
      td4.append(jsonResponse[i][0]);
      td5.append(jsonResponse[i][3]);
      //tr.append(td1,td2,td3,td4,td5);
      tr.append(td1);
      tr.append(td2);
      tr.append(td3);
      tr.append(td4);
      tr.append(td5);
      table.append(tr) 
    }
    var editForm=document.getElementById('editForm')
    editForm.style.display="none";
    var modalEdit = document.getElementById("myModal-edit");
    modalEdit.style.display = "block";
    var modifyBox=document.getElementById("modify-box");
    modifyBox.style.display='block'

    }
    loader.css('display','none');
    
  })

})
/*=====  End of Get Modify Data Function  ======*/


/*=============================================
=            Get Invoice Modify Data Function        =
=============================================*/
$('.inovice-modifyBtn').on('click', function(){
  var loader=$('.loader')
  loader.css('display','flex');
  var percentClass=$(this).closest('.invoiceData');
  var invoiceId=percentClass.children('.inoviceId').text()
  data=['invoice dash',invoiceId]
  fetch("http://127.0.0.1:8080/modify",{
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
    if (jsonResponse=='No Value'){
      alert(" No Modify data")
    }
    else{
      var table=document.getElementById('invoiceModify-data')
      table.textContent='';
      for(i=0;i<jsonResponse.length;i++){
        var tr= document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        td1.append(invoiceId);
        td2.append(jsonResponse[i][2]);
        td3.append(jsonResponse[i][1]);
        td4.append(jsonResponse[i][0]);
        td5.append(jsonResponse[i][3]);
       
        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        tr.append(td4);
        tr.append(td5);
        table.append(tr)
          
        }
        var modifyBox=document.getElementById("myModal-inovice-edit");
        modifyBox.style.display='block'
        var editForm=document.getElementById('InoviceOrder-form')
        editForm.style.display="none";
        var modifyBox=document.getElementById("invoiceModify-box");
       modifyBox.style.display='block'
      
    }
    loader.css('display','none')
    
  })
  

})


/*=====  End of Get Invoice Modify Data Function  ======*/



/*=============================================
=            Get Order Modify Data Function            =
=============================================*/
$('.order-modifyBtn').on('click', function(){
  var loader=$('.loader')
  loader.css('display','flex');
  var percentClass=$(this).closest('.order-data');
  var itemName=percentClass.children('.order-itemName').text();
  var orderID=percentClass.children('.orderId').text();
  data=['order dash',orderID]
  fetch("http://127.0.0.1:8080/modify",{
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(data)
  }).then(res=>{
    loader.removeClass('active');
    if(res.ok){
      return res.json()
    }else{
      alert('something is wrong')
    }
  }).then(jsonResponse=>{
    if (jsonResponse=='No Value'){
      alert(" No Modify data")
    }
    else{
      var table=document.getElementById('orderModify-data')
      table.textContent='';
      for(i=0;i<jsonResponse.length;i++){
      var tr= document.createElement("tr");
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      var td3 = document.createElement("td");
      var td4 = document.createElement("td");
      var td5 = document.createElement("td");
      td1.append(itemName);
      td2.append(jsonResponse[i][2]);
      td3.append(jsonResponse[i][1]);
      td4.append(jsonResponse[i][0]);
      td5.append(jsonResponse[i][3]);
      //tr.append(td1,td2,td3,td4,td5);
      tr.append(td1);
      tr.append(td2);
      tr.append(td3);
      tr.append(td4);
      tr.append(td5);
      table.append(tr)
     
        
      }
      var modalEdit = document.getElementById("myModal-order-edit");
      modalEdit.style.display = "block";
      var editForm=document.getElementById('editOrder-form')
      editForm.style.display="none";
      var modifyBox=document.getElementById("orderModify-box");
       modifyBox.style.display='block'

    }
    loader.css('display','none');
  })
})

/*=====  End of Get Modify Data Function  ======*/


/*=============================================
=            Download             =
=============================================*/
$('.inovice-downloadBtn').on('click',function(){
  var loader=$('.loader')
  loader.css('display','flex');
  var percentClass=$(this).closest('.invoiceData');
  var invoiceId=percentClass.children('.inoviceId').text()
  data=[invoiceId]
  fetch("http://127.0.0.1:8080/download", {
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(data)
  }).then(res=>{
    if(res.ok){
      return res.text()
    }else{
      alert('something is wrong')
    }
  }).then(jsonResponse=>{
    if (jsonResponse=='No Data'){
      alert(" No Data Found");
    }
    else{
      alert("Invoice Was Download ");
    }
    loader.css('display','none')
  })
})


/*=====  End of Download   ======*/



/*=============================================
=            Delete function            =
=============================================*/
$('.stock-deleteBtn').on('click', function(){
  var percentClass=$(this).closest('.data');
  var stockID=percentClass.children('.stockId').text();
  var itemNamePer=percentClass.children('.stock-itemName');
  var itemName=itemNamePer.children('.item');
  data=['stock dash',stockID]
  //var itemNamePer=percentClass.children('.stock-itemName');
  //var img=itemNamePer.children('img').prop('src').split('/').pop();
  if (confirm("Do you want to DELETE "+itemName.text()+'?') == true) {
    fetch("http://127.0.0.1:8080/delete",{
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(data)
  }).then(() => {
    window.location.reload();
})
    
  } else {}

})

$('.inovice-deleteBtn').on('click', function(){
  var percentClass=$(this).closest('.invoiceData');
  var invoiceId=percentClass.children('.inoviceId').text()
  data=['invoice dash',invoiceId]
  if (confirm("Do you want to DELETE ?") == true) {
    fetch("http://127.0.0.1:8080/delete",{
    method: 'POST',
    headers:{
      'Content-type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify(data)
  }).then(() => {
    window.location.reload();
})
    
  } else {}

})
/*=====  End of Delete function  ======*/

 
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
  var department=document.getElementById('department-filter');
  var departmentVal=department.options[department.selectedIndex].value

  //var sortBy=$('#sort-by option:selected').text();
  var table= document.getElementById('stock-table');
  var tr = table.getElementsByTagName("tr");
  if(brandFilterVal.length==0 && categoryFilterVal.length==0 && departmentVal.length==0 && sortByVal.length==0 ){
    alert('Please select an option to filter')

  }
  else{
    for (i=1; i < tr.length; i++){
      tdBrand = tr[i].getElementsByTagName("td")[6].textContent;
      tdCategory = tr[i].getElementsByTagName("td")[8].textContent;
      tdDept = tr[i].getElementsByTagName("td")[7].textContent;
      tdSortBy = parseInt(tr[i].getElementsByTagName("td")[3].textContent);
      if(sortByVal.toString()=="Low Stock"){
        if (tdBrand.toString()==brandFilterVal.toString()|| tdDept.toString()==departmentVal.toString() || tdCategory.toString()==categoryFilterVal.toString()|| tdSortBy<5){
          tr[i].style.display = "";
    
        }
        else{
          tr[i].style.display = "none";
    
        }

      }
      else if (tdBrand.toString().trim().toUpperCase()==brandFilterVal.toString().toUpperCase() || tdDept.toString().trim()==departmentVal.toString() || tdCategory.toString()==categoryFilterVal.toString()){
        tr[i].style.display = "";
  
      }
      else{
        tr[i].style.display = "none";
  
      }
  
    }

  }
  

})
 //Order Dashboard Filter Function
$('#order-filterBtn').on('click', function(){
  var categoryFilter=document.getElementById('order-category-filter')
  var categoryFilterVal = categoryFilter.options[categoryFilter.selectedIndex].value;
  var brandFilter=document.getElementById('order-brand-filter')
  var brandFilterVal = brandFilter.options[brandFilter.selectedIndex].value;
  var sortBy=document.getElementById('order-sort-by')
  var sortByVal=sortBy.options[sortBy.selectedIndex].value;
  var table= document.getElementById('order-table');
  var tr = table.getElementsByTagName("tr");
  if(brandFilterVal.length==0 && categoryFilterVal.length==0 && sortByVal.length==0 ){
    alert('Please select an option to filter');
    for (i=1; i < tr.length; i++){
      tr[i].style.display = "";
    }
  }
  else if( sortByVal.length==0){
    for (i=1; i < tr.length; i++){
      tdBrand = tr[i].getElementsByTagName("td")[5].textContent;
      tdCategory = tr[i].getElementsByTagName("td")[6].textContent;
      tdSortBy = tr[i].getElementsByTagName("td")[7].textContent;
      tdSortBy=String(tdSortBy);
      if (tdBrand.toString()==brandFilterVal.toString() || tdCategory.toString()==categoryFilterVal.toString()){
          tr[i].style.display = "";
        }
        else{
          tr[i].style.display = "none";
    
        }
      }
  }
  else{
    for (i=1; i < tr.length; i++){
      tdBrand = tr[i].getElementsByTagName("td")[5].textContent;
      tdCategory = tr[i].getElementsByTagName("td")[6].textContent;
      tdSortBy = tr[i].getElementsByTagName("td")[8].textContent;
      tdSortBy=String(tdSortBy)
      if (tdBrand.toString()==brandFilterVal.toString() || tdCategory.toString()==categoryFilterVal.toString() || tdSortBy.includes(sortByVal)==true){
          tr[i].style.display = "";
    
        }
        else{
          tr[i].style.display = "none";
    
        }
      }
    }
})

$('#invoice-filterBtn').on('click',function(){
  var supplier=document.getElementById('supplier-filter')
  var supplierFilterVal = supplier.options[supplier.selectedIndex].value;
  var sortByDate=document.getElementById('invoice-sort-by')
  var sortByDateVal =  sortByDate.options[ sortByDate.selectedIndex].value;

  var table= document.getElementById('invoice-table');
  var tr = table.getElementsByTagName("tr");

  if (supplierFilterVal.length==0 && sortByDateVal.length==0){
    for (i=1; i < tr.length; i++){
      tr[i].style.display = "";
    }
    alert("Please Select a Filter Option");
   
  }
  else{
    for (i=1; i < tr.length;i++){
      tdSupplier= tr[i].getElementsByTagName("td")[3].textContent;
      tdSortByData= tr[i].getElementsByTagName("td")[5].textContent;
      if (tdSupplier.toString()==supplierFilterVal.toString() || tdSortByData.toString()==sortByDateVal.toString()){
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
  var table= document.getElementById('stock-table');
  var tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
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
 $('.stockSearch,.orderSearch,.DashInvo').keypress(function (e) {                                       
  if (e.which == 13) {
       e.preventDefault();
       //do something   
  }
});


/*=====  End of Stock Table Edit Function  ======*/



/*=============================================
=             Order Dashboard Search function                =
=============================================*/
function orderSearch(){
  input=document.getElementsByClassName('orderSearch')[0].value;
  filter = input.toUpperCase()
  var table= document.getElementById('order-table');
  var tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue =td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
 }
 


/*=====  End of  Order Dashboard Search function      ======*/

/*=============================================
=            Invoice Dashboard Search Function            =
=============================================*/
function DashInvoSearch(){
  input=document.getElementsByClassName('DashInvo')[0].value;
  filter = input.toUpperCase();
  var table= document.getElementById('invoice-table');
  var tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if(td){
      txtValue =td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }

    }
  }
}


/*=====  End of Invoice Dashboard Search Function ======*/





