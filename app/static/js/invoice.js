

var DashInovModalEditClose= document.getElementsByClassName("close4")[0];
var DashInovModalEdit = document.getElementById("myModal-inovice-edit");
DashInovModalEditClose.onclick=function(){
  DashInovModalEdit.style.display = "none";

}
window.onclick = function(event) {
    if (event.target ==  DashInovModalEdit) {
      DashInovModalEdit.style.display = "none";
    }
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

/*=============================================
=            Invoice Table Edit Function             =
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


/*=====  End of Invoice Table Edit Function   ======*/


/*=============================================
=              Get Invoice Modify Data Function             =
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
/*=====  End of   Get Invoice Modify Data Function   ======*/


/*=============================================
=              Download             =
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


/*=====  End of   Download   ======*/


/*=============================================
=             Delete function              =
=============================================*/
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
/*=====  End of Delete function    ======*/



/*=============================================
=            Filter/Search Function             =
=============================================*/
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
/*=====  End of Filter/Search Function   ======*/


/*=============================================
=             Invoice Dashboard Search Function            =
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


/*=====  End of  Invoice Dashboard Search Function  ======*/


