var inStock = document.getElementById("btn-inStock");
var inStock2 = document.getElementById("btn-inStockForm");
var btnNotStock=document.getElementById("btn-notStock");
var InstockForm= document.getElementById("form2");
var addOrderFom1 = document.getElementById("addOrder-form");
inStock.onclick= function(){
  addOrderFom1.style.display="none"
  InstockForm.style.display="block";
  inStock.style.display="none"

}
btnNotStock.onclick= function(){
  addOrderFom1.style.display="block"
  InstockForm.style.display="none";
  inStock.style.display="block"

}
var modalOrder = document.getElementById("myModal-order");

// Get the button that opens the modal
var btnOrder = document.getElementById("addOrderBtn");

var spanOrder = document.getElementsByClassName("close1")[0];
btnOrder.onclick = function() {
  modalOrder.style.display = "block";
}
spanOrder.onclick = function() {
    modalOrder.style.display = "none";
  }
  //    Edit Form model Function 
  var orderModalEditClose= document.getElementsByClassName("close3")[0];
  var orderModalEdit = document.getElementById("myModal-order-edit");
  orderModalEditClose.onclick= function(){
    orderModalEdit.style.display = "none";
  }
window.onclick= function(event) {
    if (event.target == modalOrder) {
        modalOrder.style.display = "none";
      }
    if (event.target == orderModalEdit) {
        orderModalEdit.style.display = "none";
      }
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

var loadFileInstock = function(event) {
var image = document.getElementById('output-instock');
var imageName = document.getElementById('imageName-instock');
var fileName=document.getElementsByClassName('filename-instock')[0];
image.src = URL.createObjectURL(event.target.files[0]);
image.style.display="block";
fileName.style.display="block";
imageName.innerHTML=event.target.files[0].name;
};

/*=============================================
=            Order Table Edit Function             =
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
    $('#brand-orderEdit').val(orderBrand.text().trim());
    $('#category-orderEdit').val(orderCategory.text());
    $('#order-statusEdit').val(orderStatus.text());
    $('#price-orderEdit').val(orderPrice.text());
  })


/*=====  End of Order Table Edit Function   ======*/


/*=============================================
=              Get Order Modify Data Function            =
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


/*=====  End of   Get Order Modify Data Function  ======*/


/*=============================================
=            Order Dashboard Filter Function            =
=============================================*/
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


/*=====  End of Order Dashboard Filter Function  ======*/

/*=============================================
=            Order Dashboard Search function              =
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
/*=====  End of Order Dashboard Search function    ======*/

/*=============================================
=            Delete Function            =
=============================================*/
$('.order-deleteBtn').on('click', function(){
    var percentClass=$(this).closest('.order-data');
    var loader=$('.loader')
    var orderID=percentClass.children('.orderId').text().trim();
    var OrderItem=percentClass.children('.order-itemName');
    loader.css('display','flex');
    data=['order dash',orderID]
    if (confirm("Do you want to DELETE "+OrderItem.text()+'?') == true) {
      fetch("http://127.0.0.1:8080/delete",{
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(data)
    }).then(() => {
    loader.css('display','none')
      window.location.reload();
  })
      
    } else {}
  
  })


/*=====  End of Delete Function  ======*/



