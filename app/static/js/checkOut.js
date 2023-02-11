/*=============================================
=            Modal             =
=============================================*/
// Get the modal
var modal = document.getElementById("myModal-checkout");

// Get the button that opens the modal
var btn = document.getElementById("addCheckoutBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  var modifyBox=document.getElementById("checkoutForm");
  modifyBox.style.display='block'
  var editForm=document.getElementById('checkoutFormEdit')
  editForm.style.display="none";
  var modifyConfirm=document.getElementById("confirm");
  modifyConfirm.style.display='none'
  var modifyBox=document.getElementById("checkoutModify-box");
        modifyBox.style.display='none'

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
=            Edit Function             =
=============================================*/
$('.checkout-editBtn').on('click', function(){
  var percentClass=$(this).closest('.checkout-data');
  var checkId=percentClass.children('.checkId').text()
  var checkName=percentClass.children('.checkName').text()
  var checkItem=percentClass.children('.checkItem').text()
  var checkQty=percentClass.children('.checkQty').text()
  var checkComment=percentClass.children('.checkComment').text()
  var checkBrand=percentClass.children('.checkBrand').text()
  var checkCategory=percentClass.children('.checkCategory').text()
  var checkStatus=percentClass.children('.checkStatus').text()

  var modalEdit = document.getElementById("myModal-checkout");
  modalEdit.style.display = "block";
  var editForm=document.getElementById('checkoutFormEdit')
  editForm.style.display="block";
  var modifyBox=document.getElementById("checkoutForm");
  modifyBox.style.display='none'
  var modifyConfirm=document.getElementById("confirm");
  modifyConfirm.style.display='none'
  var modifyBox=document.getElementById("checkoutModify-box");
        modifyBox.style.display='none'

  $('#checkoutId-edit').val(checkId.trim())
  $('#CheckNameEdit').val(checkName.trim())
  $('#ItemNameEdit').val(checkItem.trim())
  $('#stock-edit').val(checkQty.trim())
  $('#checkoutCommentEdit').val(checkComment.trim())
  $('#checkoutBrandEdit').val(checkBrand.trim())
  $('#checkoutStatusEdit').val(checkStatus.trim())
  $('#checkoutCategoryEdit').val(checkCategory.trim())
  
})

/*=====  End of Edit Function   ======*/


/*=============================================
=            Filter/Search Function            =
=============================================*/
$('#checkout-filterBtn').on('click', function(){
  var categoryFilter=document.getElementById('checkout-category-filter')
  var categoryFilterVal = categoryFilter.options[categoryFilter.selectedIndex].value;
  var brandFilter=document.getElementById('checkout-brand-filter')
  var brandFilterVal = brandFilter.options[brandFilter.selectedIndex].value;
  var sortBy=document.getElementById('checkout-sort-by')
  var sortByVal=sortBy.options[sortBy.selectedIndex].value;

  var table= document.getElementById('checkout-table');
  var tr = table.getElementsByTagName("tr");

  if(brandFilterVal.length==0 && categoryFilterVal.length==0 && sortByVal.length==0 ){
    for (i=1; i < tr.length; i++){
      tr[i].style.display = "";
    }
    alert('Please select an option to filter')


  }
  else if(sortByVal.length==0){
    for (i=1; i < tr.length; i++){
      tdBrand = tr[i].getElementsByTagName("td")[6].textContent || tr[i].getElementsByTagName("td")[6].innerText;
      tdCategory = tr[i].getElementsByTagName("td")[10].textContent;
      tdSortBy = tr[i].getElementsByTagName("td")[11].textContent;
      var text=tdBrand.split("");
      console.log(tdBrand.trim())
      if (brandFilterVal== tdBrand.trim() || tdCategory.toString().trim() ==categoryFilterVal.toString()){
          tr[i].style.display = "";
        }
        else{
          tr[i].style.display = "none";
    
        }
      }
  }
  else{
    for (i=1; i < tr.length; i++){
      tdBrand = tr[i].getElementsByTagName("td")[6].textContent;
      tdCategory = tr[i].getElementsByTagName("td")[10].textContent;
      tdSortBy = tr[i].getElementsByTagName("td")[11].textContent;
      tdSortBy=String(tdSortBy)
      if (tdBrand.toString().trim() ==brandFilterVal.toString() || tdCategory.toString().trim() ==categoryFilterVal.toString() || tdSortBy.includes(sortByVal)==true){
          tr[i].style.display = "";
    
        }
        else{
          tr[i].style.display = "none";
    
        }
      }
    }
 
})

/*=====  End of Filter/Search Function  ======*/


/*=============================================
=            Check Out Search Function            =
=============================================*/
function checkoutSearch(){
  input=document.getElementsByClassName('checkoutSearch')[0].value;
  filter = input.toUpperCase();
  var table= document.getElementById('checkout-table');
  var tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    td2= tr[i].getElementsByTagName("td")[2];
    if(td){
      txtValue =td.textContent || td.innerText;
      txtValue2 =td2.textContent || td2.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1||txtValue2.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }

    }
  }
}


/*=====  End of Check Out Search Function  ======*/

/*=============================================
=            Delete Function            =
=============================================*/
$('.checkout-deleteBtn').on('click', function(){
  var loader=$('.loader')
  var percentClass=$(this).closest('.checkout-data');
  var checkId=percentClass.children('.checkId').text().trim()
  var checkStatus=percentClass.children('.checkStatus').text()
  var checkQty=percentClass.children('.checkQty').text().trim()

  if (checkStatus.trim()=='Return' || checkStatus.trim()=='Check Out' ){
    data=['check','Return',checkId]
    if(confirm("Do you want to DELETE ") == true){
      loader.css('display','flex');
      fetch("http://127.0.0.1:8080/delete",{
        method: 'POST',
        headers:{
          'Content-type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify(data)
      }).then(() => {
        loader.css('display','none');
        window.location.reload();
    })


    }


  }
  else{
    data=['check','Return',checkId,checkQty]
    checkHepler(data)

  }
})
/*=====  End of Delete Function  ======*/


/*=============================================
=             Get Checkout Modify Data Function              =
=============================================*/
$('.checkout-modifyBtn').on('click', function(){
  var loader=$('.loader')
  loader.css('display','flex');
  var percentClass=$(this).closest('.checkout-data');
  var checkId=percentClass.children('.checkId').text()
  data=['check dash',checkId]
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
      var table=document.getElementById('checkoutModify-data')
      table.textContent='';
      for(i=0;i<jsonResponse.length;i++){
        var tr= document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        td1.append(checkId);
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
        var modifyBox=document.getElementById("myModal-checkout");
        modifyBox.style.display='block'
        var modifyBox=document.getElementById("checkoutModify-box");
        modifyBox.style.display='block'

        var editForm=document.getElementById('checkoutForm')
        editForm.style.display="none";
        var modifyConfirm=document.getElementById("confirm");
        modifyConfirm.style.display='none'
        var editForm=document.getElementById('checkoutFormEdit')
        editForm.style.display="none";
      
    }
    loader.css('display','none')
    
  })
  

})


/*=====  End of  Get Checkout Modify Data Function    ======*/



function checkHepler(data){
  var loader=$('.loader')
  var modalEdit = document.getElementById("myModal-checkout");
  modalEdit.style.display = "block";
  var editForm=document.getElementById('checkoutFormEdit')
  editForm.style.display="none";
  var modifyBox=document.getElementById("checkoutForm");
  modifyBox.style.display='none'
  var modifyBox=document.getElementById("checkoutModify-box");
        modifyBox.style.display='none'
  var modifyConfirm=document.getElementById("confirm");
  modifyConfirm.style.display='block'


  $('#Check-btnYes'). click(function(){
    var modalEdit = document.getElementById("myModal-checkout");
    modalEdit.style.display = "none";
    if(confirm("Do you want to DELETE ") == true){
      loader.css('display','flex');
      fetch("http://127.0.0.1:8080/delete",{
        method: 'POST',
        headers:{
          'Content-type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify(data)
      }).then(() => {
        loader.css('display','none');
        window.location.reload();
    })
      

    }

  })

  $('#Check-btnNo'). click(function(){
    data[1]="out"
    var modalEdit = document.getElementById("myModal-checkout");
    modalEdit.style.display = "none";
    if(confirm("Do you want to DELETE ") == true){
      loader.css('display','flex');
      fetch("http://127.0.0.1:8080/delete",{
        method: 'POST',
        headers:{
          'Content-type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify(data)
      }).then(() => {
        loader.css('display','none');
        window.location.reload();
    })
      

    }

  })


}