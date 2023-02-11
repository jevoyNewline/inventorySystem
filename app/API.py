from argparse import FileType
from re import T
from sqlite3 import connect
import mysql.connector
import mysql
import os
from datetime import date
from base64 import b64encode
import http.client as httplib
from re import sub
from decimal import Decimal
user='Jevoy'
    
mydb = mysql.connector.connect(
    host="34.73.222.64", user="root", password="admin@mystiqueDB", database='inventory')

#/*===== Checking Database connection Function ============*/
#===========================================================
def checkDatabaseConn(mydb):
    if mydb.is_connected():
        pass
    else:
        mydb.reconnect(attempts=10, delay=5)

#/*===== Add Item to database Function ============*/
#===================================================
def addItemDatabase(itemName,Description,stock,comment,brand,department,category,location,imageFile,stockLimit,freqChange):
    checkDatabaseConn(mydb)
    stock=int(stock)
    stockLimit=int(stockLimit)
    query="INSERT INTO stock(item_name,stock,descriptions,comment,brand,departments,category,locations,stockLimit,freqChange,imageUrl,logUser) VALUES (%s,?,%s,%s,%s,%s,%s,%s,?,%s,%s,%s)"
    val=(itemName,stock,Description,comment,brand,department,category,location,stockLimit,freqChange,imageFile,user)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    mydb.commit()
    
#/*===== Add oder & Invoice to database Function ============*/
#=============================================================
def addOrderDatabase(itemName,comment,qty,brand,category,price,status,supplier,imageFile,inStock,FileType):
    checkDatabaseConn(mydb)
    qty=int(qty)
    
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    if inStock == True:
        orderInStock='yes'
        itemID=int(itemName)
        
        '''procedures'''
        cursor = mydb.cursor()
        cursor.callproc('getItemName',[itemID,])
        for result in cursor.stored_results():
            itemName=result.fetchall()
            
        query="INSERT INTO inventory.order(item,qty,comment,brand,category,orderStatus,orderDate,orderPrice,inStock,orderLog) VALUES (%s,?,%s,%s,%s,%s,%s,%s,%s,%s)"
        val=(str(itemName[0][0]),qty,comment,brand,category,status,today,price,orderInStock,user)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        ID=cursor.lastrowid
        mydb.commit()
        
        cursor = mydb.cursor()
        cursor.callproc('addStockHasOrder',[itemID, ID,])
        
        
        #========add order invoice=======
        query="INSERT INTO invoice(supplier,fileType,url,invoiceDate,invoiceLog) VALUES (%s,%s,%s,%s,%s)"
        val=(supplier,FileType,imageFile,today,user)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        invoiceID=cursor.lastrowid
        mydb.commit()
        
        
        
        cursor = mydb.cursor()
        cursor.callproc('addOrderHasInvoice',[invoiceID, ID,])
        mydb.commit()
        return invoiceID
        
        
    elif inStock == False:
        orderInStock='no'
        query="INSERT INTO inventory.order(item,qty,comment,brand,category,orderStatus,orderDate,orderPrice,inStock,orderLog) VALUES (%s,?,%s,%s,%s,%s,%s,%s,%s,%s)"
        val=(itemName,qty,comment,brand,category,status,today,price,orderInStock,user)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        ID=cursor.lastrowid
        mydb.commit()
        
        #========add order invoice=======
        query="INSERT INTO invoice(supplier,fileType,url,invoiceDate,invoiceLog) VALUES (%s,%s,%s,%s,%s)"
        val=(supplier,FileType,imageFile,today,user)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        invoiceID=cursor.lastrowid
        mydb.commit()
        
        cursor = mydb.cursor()
        cursor.callproc('addOrderHasInvoice',[invoiceID, ID,])
        mydb.commit()
        return invoiceID
    
def AddMultipleOrderData(data):
    checkDatabaseConn(mydb)
    
    TotalCost=0
    supplierData,orderId,imageFileList=[],[],[]
    
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    
    for x in range(len(data)):supplierData.append(data[x][9])
    supplierData=list(dict.fromkeys(supplierData))
    
    for x in range(len(supplierData)):
        for i in range(len(data)):
            if supplierData[x]==data[i][9]:
                if data[i][6]=="Ordered":
                    if len(data[i][8])==0:
                        TotalCost=TotalCost+int(data[i][7])
                        
                        query="INSERT INTO inventory.order(item,qty,comment,brand,category,orderStatus,orderDate,orderPrice,inStock,orderLog,supplier) VALUES (%s,?,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                        val=(data[i][1],int(data[i][2]),data[i][3],data[i][4],data[i][5],today,data[i][6],'$'+data[i][7]+'.00','yes',user,data[i][9])
                        cursor = mydb.cursor(prepared=True)
                        cursor.execute(query, val)
                        ID=cursor.lastrowid
                        orderId.append(cursor.lastrowid)
                        mydb.commit()
                            
                        cursor = mydb.cursor()
                        cursor.callproc('addStockHasOrder',[int(data[i][1]), ID,])
                    else:
                        pass
                           
                 
                          
    
    
   
    
    
    
#/*===== Add checkout to database Function ============*/
#=============================================================    
def addCheckout(name,item,qty,comment,brand,category,status):
    checkDatabaseConn(mydb)
    qty=int(qty)
    item=int(item)
    newVal=0
    
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    '''procedures'''
    cursor = mydb.cursor()
    cursor.callproc('getItemName',[item,])
    for result in cursor.stored_results():
        itemName=result.fetchall()
        
    query="INSERT INTO inventory.checkout(name,item,qty,comment,brand,category,checkDate,status,checkBy) VALUES (%s,%s,?,%s,%s,%s,%s,%s,%s)"
    val=(name,str(itemName[0][0]),qty,comment,brand,category,today,status,user)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    checkID=cursor.lastrowid
    mydb.commit()
    
    query="SELECT stock FROM inventory.stock WHERE stockid= ? "
    cursor = mydb.cursor(prepared=True)
    val=(item,)
    cursor.execute(query,val)
    StockData=cursor.fetchall()
    
    newVal= StockData[0][0]-qty
    
    if newVal<0:
        newVal=0
    query="UPDATE stock SET stock=%s WHERE stockid=%s "
    val=(newVal,item)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    mydb.commit()
    
    query="INSERT INTO inventory.modify(modifyDate,modifyOld,modifyNew,modifyby) VALUES (%s,%s,%s,%s) "
    val=(today,StockData[0][0], newVal,user)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    modifyID=cursor.lastrowid
    mydb.commit()
    
    cursor = mydb.cursor()
    cursor.callproc('AddStockHasModify',[item,  modifyID,])
    mydb.commit()
    
    query="INSERT INTO inventory.checkout_has_stock VALUES(?,?)"
    val=(checkID,item)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    mydb.commit()
  
#/*===== Fetch the Stock data Function ============*/
#====================================================
def fetchStockData():
    checkDatabaseConn(mydb)
    allStock=[]
    '''procedures'''
    cursor = mydb.cursor()
    cursor.callproc('getStockData')
    for result in cursor.stored_results():
        allStock=result.fetchall()
    return allStock

#/*===== Fetch Frequent stock data Function ============*/
#========================================================  
def getFreqStockData():
    checkDatabaseConn(mydb)
    freqChange=[]
    cursor = mydb.cursor()
    cursor.callproc('freqItem')
    for result in cursor.stored_results():
        freqChange=result.fetchall()
    return freqChange

#/*===== Fetch the Order data Function ============*/
#====================================================
def fetchOrderData():
    checkDatabaseConn(mydb)
    query="SELECT * FROM inventory.order"
    cursor = mydb.cursor()
    cursor.execute(query)
    rows=cursor.fetchall()
    return rows
#/*===== Fetch the Order data Function ============*/
#====================================================
def fetchInvoiceData():
    suppList=list()
    checkDatabaseConn(mydb)
    cursor = mydb.cursor()
    cursor.callproc('getInvoiceData')
    for result in cursor.stored_results():
        rows=result.fetchall()
    
    query="SELECT supplier FROM inventory.invoice"
    cursor = mydb.cursor()
    cursor.execute(query)
    suppData=cursor.fetchall()
    suppData=list(dict.fromkeys(suppData))
    for x in suppData:
        suppList.append(x[0])
    return rows,suppList

#/*===== Fetch the Order data Function ============*/
#====================================================   
def fetchCheckout():
    checkDatabaseConn(mydb)
    query="SELECT * FROM inventory.checkout"
    cursor = mydb.cursor()
    cursor.execute(query)
    rows=cursor.fetchall()
    return rows
  
    
#/*===== Edit order data and add modify Function ============*/
#============================================================
def editOrderDatabase(orderId,item,qty,comment,brand,category,status,orderPrice):
    checkDatabaseConn(mydb)
    NewList=[item,int(qty),comment,brand,category,status,orderPrice]
    oldList=[]
    orderId=int(orderId)
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    
    query="SELECT item,qty,comment,brand,category,orderStatus,orderPrice FROM inventory.order WHERE orderID=%s"
    cursor = mydb.cursor(prepared=True)
    val=(orderId,)
    cursor.execute(query,val)
    rows=cursor.fetchall()
    
    for x in range (0,len(rows[0])):
        oldList.append(rows[0][x])
    holVal=list(set(oldList) - set(NewList))
    
    
    query="UPDATE inventory.order SET item=%s,qty=%s,comment=%s,brand=%s,category=%s,orderStatus=%s,orderPrice=%s WHERE orderID=%s "
    orderId=int(orderId)
    val=(item,qty,comment,brand,category,status,orderPrice,orderId)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    mydb.commit()
    
    for x in range(0,len(holVal)):
            query="INSERT INTO inventory.modify(modifyDate,modifyOld,modifyNew,modifyby) VALUES (%s,%s,%s,%s) "
            index=oldList.index(holVal[x])
            neVal=NewList[index]
            val=(today,holVal[x],neVal,user)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            ID=cursor.lastrowid
            mydb.commit()
            
            cursor = mydb.cursor()
            cursor.callproc('addOrderHasModify',[orderId, ID,])
            mydb.commit()  
    
#/*===== Edit stock data and add modify Function ============*/
#============================================================
def editStockDatabase(itemNameEdit,DescriptionEdit,stockEdit,commentEdit,brandEdit,departmentEdit,categoryEdit,locationEdit,filename,stockIdEdit,freqChange,stockLimit):
    checkDatabaseConn(mydb)
    stockIdEdit=int(stockIdEdit)
    ListVal=[itemNameEdit,int(stockEdit),DescriptionEdit,commentEdit,brandEdit,categoryEdit,locationEdit,int(stockLimit),freqChange,filename]
    holVal=[]
    itemVal=[]
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    
    cursor = mydb.cursor()
    cursor.callproc('getItem',[stockIdEdit,])
    for result in cursor.stored_results():
        item=result.fetchall()
    
    for x in range (0,len(item[0])):
        itemVal.append(item[0][x])
    itemVal=itemVal[1:11]
    holVal=list(set(itemVal) - set(ListVal))
    
    if filename== 'None':
        query="UPDATE stock SET item_name=%s,stock=%s,descriptions=%s,comment=%s,brand=%s,departments=%s,category=%s,locations=%s,stockLimit=%s,freqChange=%s WHERE stockid=%s "
        val=(itemNameEdit,stockEdit,DescriptionEdit,commentEdit,brandEdit,departmentEdit,categoryEdit,locationEdit,stockLimit,freqChange,stockIdEdit)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        mydb.commit()
        
         #========adding modify data to the database=======
        for x in range(0,len(holVal)):
            query="INSERT INTO inventory.modify(modifyDate,modifyOld,modifyNew,modifyby) VALUES (%s,%s,%s,%s) "
            index=itemVal.index(holVal[x])
            neVal=ListVal[index]
            val=(today,holVal[x],neVal,user)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            ID=cursor.lastrowid
            mydb.commit()
            
            cursor = mydb.cursor()
            cursor.callproc('AddStockHasModify',[stockIdEdit, ID,])
            mydb.commit()
    else:
        query="UPDATE stock SET item_name=%s,stock=%s,descriptions=%s,comment=%s,brand=%s,category=%s,locations=%s,stockLimit=%s,freqChange=%s,imageUrl=%s WHERE stockid=%s "
        val=(itemNameEdit,stockEdit,DescriptionEdit,commentEdit,brandEdit,categoryEdit,locationEdit,stockLimit,freqChange,filename,stockIdEdit)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        mydb.commit()
        
         #========adding modify data to the database=======
        for x in range(0,len(holVal)):
            query="INSERT INTO inventory.modify(modifyDate,modifyOld,modifyNew,modifyby) VALUES (%s,%s,%s,%s) "
            index=itemVal.index(holVal[x])
            neVal=ListVal[index]
            val=(today,holVal[x],neVal,user)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            ID=cursor.lastrowid
            mydb.commit()
            
            cursor = mydb.cursor()
            cursor.callproc('AddStockHasModify',[stockIdEdit, ID,])
            mydb.commit()
            
#/*===== Edit Invoice data and add modify Function ============*/
#============================================================
def editInvoice(invoiceId,supplier,filename,mimetype):
    checkDatabaseConn(mydb)
    invoiceId=int(invoiceId)
    mimetype=str(mimetype)
    listVal=[invoiceId,supplier,filename,mimetype]
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    
    query="SELECT invoiceid,supplier,fileType,url FROM inventory.invoice WHERE invoiceid= ?"
    cursor = mydb.cursor(prepared=True)
    val=(invoiceId,)
    cursor.execute(query,val)
    Data=cursor.fetchall()
    Data=list(Data[0])
    
    
    holVal=list(set(Data) - set(listVal))
    if filename=="None":
        query="UPDATE inventory.invoice SET supplier=%s WHERE invoiceid=%s "
        val=(supplier,invoiceId)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        mydb.commit()
        #========adding modify data to the database=======
        for x in range(0,len(holVal)):
            query="INSERT INTO inventory.modify(modifyDate,modifyOld,modifyNew,modifyby) VALUES (%s,%s,%s,%s) "
            index=Data.index(holVal[x])
            neVal=listVal[index]
            val=(today,holVal[x],neVal,user)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            ID=cursor.lastrowid
            mydb.commit()
            
            query="INSERT INTO invoice_has_modify(idinvoice,idmodify_has) VALUES (?,?) "
            cursor = mydb.cursor(prepared=True)
            val=(invoiceId,ID)
            cursor.execute(query, val)
            mydb.commit()
    else:
        query="UPDATE inventory.invoice SET supplier=%s,fileType= %s,url=%s WHERE invoiceid=%s "
        val=(supplier,mimetype,filename,invoiceId)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        mydb.commit()
        
        #========adding modify data to the database=======
        for x in range(0,len(holVal)):
            query="INSERT INTO inventory.modify(modifyDate,modifyOld,modifyNew,modifyby) VALUES (%s,%s,%s,%s) "
            index=Data.index(holVal[x])
            neVal=listVal[index]
            val=(today,holVal[x],neVal,user)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            ID=cursor.lastrowid
            mydb.commit()
            
            query="INSERT INTO invoice_has_modify(idinvoice,idmodify_has) VALUES (?,?) "
            cursor = mydb.cursor(prepared=True)
            val=(invoiceId,ID)
            cursor.execute(query, val)
            mydb.commit()
        
#/*===== Edit Checkout data and add modify Function ============*/
#================================================================          
def editCheckout(name,item,qty,comment,brand,category,status,checkId):
    checkId=int(checkId)
    NewList=[name,item,int(qty),comment,brand,category,status]
    oldList=[]
    qty=int(qty)
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    sum=0
    if status == "Return":
        
        query="SELECT status FROM inventory.checkout WHERE checkoutid=?  "
        val=(checkId,)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query,val)
        statusData=cursor.fetchall()
        
        if statusData[0][0] != "Return":
            query="SELECT  idstock FROM inventory.checkout_has_stock WHERE idcheckout=?"
            val=(checkId,)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query,val)
            Data=cursor.fetchall()
        
            cursor = mydb.cursor()
            cursor.callproc('getStockQty',[Data[0][0],])
            for result in cursor.stored_results():
                itemQty=result.fetchall()
                
            sum=itemQty[0][0]+qty
                
            query="UPDATE stock SET stock=%s WHERE stockid=%s "
            val=(sum,Data[0][0])
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            mydb.commit()
            
            getCheck(NewList,checkId,today)
            
            query="UPDATE inventory.checkout SET name=%s,item=%s, qty=%s, comment=%s, brand=%s, category=%s,returnDate=%s,status=%s WHERE checkoutid=%s "
            val=(name,item,qty,comment,brand,category,today,status,checkId)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            mydb.commit()
            
            
        else:
            getCheck(NewList,checkId,today)
            
            query="UPDATE inventory.checkout SET name=%s,item=%s, qty=%s, comment=%s, brand=%s, category=%s,returnDate=%s,status=%s WHERE checkoutid=%s "
            val=(name,item,qty,comment,brand,category,today,status,checkId)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            mydb.commit()
    else:
        query="SELECT name,item,qty,comment,brand,category status FROM inventory.checkout WHERE checkoutid=?  "
        val=(checkId,)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query,val)
        statusData=cursor.fetchall()
    
        
        if statusData[0][2] != qty:
            
            query="SELECT  idstock FROM inventory.checkout_has_stock WHERE idcheckout=?"
            val=(checkId,)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query,val)
            Data=cursor.fetchall()
        
            cursor = mydb.cursor()
            cursor.callproc('getStockQty',[Data[0][0],])
            for result in cursor.stored_results():
                itemQty=result.fetchall()
                
            sum=itemQty[0][0]-qty
                
            query="UPDATE stock SET stock=%s WHERE stockid=%s "
            val=(sum,Data[0][0])
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            mydb.commit()
            
            getCheck(NewList,checkId,today)
            
            query="UPDATE inventory.checkout SET name=%s,item=%s, qty=%s, comment=%s, brand=%s, category=%s,status=%s WHERE checkoutid=%s "
            val=(name,item,qty,comment,brand,category,status,checkId)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            mydb.commit()
        
        else:
            getCheck(NewList,checkId,today)
            
            query="UPDATE inventory.checkout SET name=%s,item=%s, qty=%s, comment=%s, brand=%s, category=%s,status=%s WHERE checkoutid=%s "
            val=(name,item,qty,comment,brand,category,status,checkId)
            cursor = mydb.cursor(prepared=True)
            cursor.execute(query, val)
            mydb.commit()
        
#/*===== Fetch the modify data Function ============*/
#====================================================     
def dashboardModify(lst):
    checkDatabaseConn(mydb)
    key=lst[0]
    value=int(lst[1])
    
    if key=='stock dash':
        '''procedures'''
        cursor = mydb.cursor()
        cursor.callproc('getStockModify',[value,])
        for result in cursor.stored_results():
            modifyVal=result.fetchall()    
        return modifyHelper(modifyVal)
        
    elif key=='order dash':
        '''procedures'''
        cursor = mydb.cursor()
        cursor.callproc('getOrderModify',[value,])
        for result in cursor.stored_results():
            modifyVal=result.fetchall() 
        return modifyHelper(modifyVal)
    
    elif key== 'invoice dash':
        cursor = mydb.cursor()
        cursor.callproc('getInvoiceModify',[value,])
        for result in cursor.stored_results():
            modifyVal=result.fetchall() 
        return modifyHelper(modifyVal)
    
    elif key=="check dash":
        cursor = mydb.cursor()
        cursor.callproc('getCheckoutModify',[value])
        for result in cursor.stored_results():
            modifyVal=result.fetchall()
        return modifyHelper(modifyVal)
        
        
    
        
#/*===== Delete stock data by ID Function ============*/
#====================================================    
def deleteObjDatabase(lst):
    checkDatabaseConn(mydb)
    key=lst[0]
    value=int(lst[1])
    
    if key=='stock dash':
        query="DELETE FROM stock WHERE stockid= ?"
        cursor = mydb.cursor()
        cursor.callproc('getItem',[value,])
        for result in cursor.stored_results():
            item=result.fetchall()
        
        query="SELECT modify_idmodify FROM stock_has_modify WHERE stock_stockid= ? "
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        rowData=cursor.fetchall()
        
        query="DELETE FROM stock_has_modify WHERE stock_stockid= ?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        query="DELETE FROM stock_has_order WHERE stock_stockid= ?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        if len(rowData)==0:
            pass
        else:
            for x in range(0,len(rowData)):
                query="DELETE FROM inventory.modify WHERE idmodify= ?"
                cursor = mydb.cursor(prepared=True)
                val=(rowData[x][0],)
                cursor.execute(query,val)
                mydb.commit()
                
        query="DELETE FROM stock WHERE stockid= ?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        if item[0][10]=="None":
            return 'None'
        else:
            return item[0][1]
        
    if key=='invoice dash':
        query="SELECT orderID FROM order_has_invoice WHERE invoiceID= ? "
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        rowData=cursor.fetchall()
        
        query="DELETE FROM order_has_invoice WHERE invoiceID= ?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        query="SELECT idmodify_has FROM invoice_has_modify WHERE idinvoice= ? "
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        rowModify=cursor.fetchall()
        
        query="DELETE FROM invoice_has_modify WHERE idinvoice= ?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        query="DELETE FROM inventory.order WHERE orderID= ?"
        cursor = mydb.cursor(prepared=True)
        val=(rowData[0][0],)
        cursor.execute(query,val)
        mydb.commit()
        
        if len(rowModify)==0:
            pass
        else:
            for x in range(0,len(rowModify)):
                query="DELETE FROM inventory.modify WHERE idmodify= ?"
                cursor = mydb.cursor(prepared=True)
                val=(rowModify[x][0],)
                cursor.execute(query,val)
                mydb.commit()
                
        query="SELECT fileType FROM inventory.invoice WHERE invoiceid=?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        rowDataType=cursor.fetchall()
        
        query="DELETE FROM inventory.invoice WHERE invoiceid=?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        data=str(value)+"."+rowDataType[0][0]
        if rowDataType[0][0] =="none":
            NoData="None"
            return NoData
        else:
            return data
        
    if key=='order dash':
        query="SELECT modifyID FROM order_has_modify WHERE order_orderID= ? "
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        rowData=cursor.fetchall()
        
        query="DELETE FROM order_has_invoice WHERE orderID= ?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        query="DELETE FROM order_has_modify WHERE order_orderID= ? "
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()
        
        if len(rowData)==0:
                pass
        else:
            for x in range(0,len(rowData)):
                query="DELETE FROM inventory.modify WHERE idmodify= ?"
                cursor = mydb.cursor(prepared=True)
                val=(rowData[x][0],)
                cursor.execute(query,val)
                mydb.commit()
                
        query="DELETE FROM inventory.order WHERE orderID= ?"
        cursor = mydb.cursor(prepared=True)
        val=(value,)
        cursor.execute(query,val)
        mydb.commit()     
        
#/*===== Delete checkout data by ID Function ============*/
#====================================================    
def deleteCheck(lst):
    checkDatabaseConn(mydb)
    key=lst[1]
    value=int(lst[2])
    
    if key == "Return":
        query="DELETE FROM inventory.checkout_has_stock WHERE idcheckout= ?"
        val=(value,)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query,val)
        mydb.commit()
        
        cursor = mydb.cursor()
        cursor.callproc('getCheckoutModify',[value])
        for result in cursor.stored_results():
            modifyVal=result.fetchall()
        
        if len(modifyVal)==0:
            pass
        else:
            for x in range(0,len(modifyVal)):
                query="DELETE FROM inventory.modify WHERE idmodify= ?"
                cursor = mydb.cursor(prepared=True)
                val=(modifyVal[x][1],)
                cursor.execute(query,val)
                mydb.commit()
                
            query="DELETE FROM inventory.checkout_has_modify WHERE check_outID= ?"
            cursor = mydb.cursor(prepared=True)
            val=(value,)
            cursor.execute(query,val)
            mydb.commit()
        
        query="DELETE FROM inventory.checkout WHERE checkoutid= ?"
        val=(value,)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query,val)
        mydb.commit()
        
    elif key == "out":
        qty=int(lst[3])
        sum=0
        query="SELECT  idstock FROM inventory.checkout_has_stock WHERE idcheckout=?"
        val=(value,)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query,val)
        Data=cursor.fetchall()
    
        cursor = mydb.cursor()
        cursor.callproc('getStockQty',[Data[0][0],])
        for result in cursor.stored_results():
            itemQty=result.fetchall()
            
        sum=itemQty[0][0]+qty
            
        query="UPDATE stock SET stock=%s WHERE stockid=%s "
        val=(sum,Data[0][0])
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        mydb.commit()
        
        query="DELETE FROM inventory.checkout_has_stock WHERE idcheckout= ?"
        val=(value,)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query,val)
        mydb.commit()
        
        cursor = mydb.cursor()
        cursor.callproc('getCheckoutModify',[value])
        for result in cursor.stored_results():
            modifyVal=result.fetchall()
        
        if len(modifyVal)==0:
            pass
        else:
            for x in range(0,len(modifyVal)):
                query="DELETE FROM inventory.modify WHERE idmodify= ?"
                cursor = mydb.cursor(prepared=True)
                val=(modifyVal[x][1],)
                cursor.execute(query,val)
                mydb.commit()
                
            query="DELETE FROM inventory.checkout_has_modify WHERE check_outID= ?"
            cursor = mydb.cursor(prepared=True)
            val=(value,)
            cursor.execute(query,val)
            mydb.commit()
        
        query="DELETE FROM inventory.checkout WHERE checkoutid= ?"
        val=(value,)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query,val)
        mydb.commit()
            

#/*===== Download Object from GCP Function ============*/
#=======================================================
def downloadData(data):
    checkDatabaseConn(mydb)
    id=int(data[0])
    
    query="SELECT fileType FROM inventory.invoice WHERE invoiceid=?"
    cursor = mydb.cursor(prepared=True)
    val=(id,)
    cursor.execute(query,val)
    rowDataType=cursor.fetchall()
    data=str(id)+"."+rowDataType[0][0]
    if rowDataType[0][0] =="none":
        NoData="No Data"
        return NoData
    else:
        return data
    
#/*===== Report Object from GCP Function ============*/
#=======================================================
def reportExpense():
    checkDatabaseConn(mydb)
    current_month=date.today().strftime("%B")
    current_year='2022'
    #date.today().strftime("%Y")
    sum=0
   
    
    cursor = mydb.cursor()
    cursor.callproc('getPrice')
    for result in cursor.stored_results():
        item=result.fetchall()
        
    for x in range(0,len(item)):
        if current_month in item[x][0] and current_year in item[x][0]:
            money=Decimal(sub(r'[^\d.]', '', item[x][1]))
            sum=sum+money
    return CalExpense(current_month,sum)

#/*===== Kitchen Item Monthly Expense Function ============*/
#===========================================================
def kitchenExp():
    checkDatabaseConn(mydb)
    current_month=date.today().strftime("%B")
    current_year=date.today().strftime("%Y")
    sum=0
    
    cursor = mydb.cursor()
    cursor.callproc('getKitchenPrice')
    for result in cursor.stored_results():
        item=result.fetchall()
        
    for x in range(0,len(item)):
        if current_month in item[x][1] and current_year in item[x][1]:
            money=Decimal(sub(r'[^\d.]', '', item[x][2]))
            sum=sum+money

    return CalExpense(current_month,sum)

def OfficeExp():
    checkDatabaseConn(mydb)
    
    current_month=date.today().strftime("%B")
    current_year=date.today().strftime("%Y")
    sum=0
    
    cursor = mydb.cursor()
    cursor.callproc('getOfficePrice')
    for result in cursor.stored_results():
        item=result.fetchall()
        
    for x in range(0,len(item)):
        if current_month in item[x][1] and current_year in item[x][1]:
            money=Decimal(sub(r'[^\d.]', '', item[x][2]))
            sum=sum+money

    return CalExpense(current_month,sum)
   
        
#/*===== Report Object from GCP Function ===========================*/
#=====================================================================  
def changeMonth(lst):
    checkDatabaseConn(mydb)
    month=lst[1]
    current_year='2022'
    sum=0
    per=0
    spendDiff=0
    
    cursor = mydb.cursor()
    cursor.callproc('getPrice')
    for result in cursor.stored_results():
        item=result.fetchall()
        
    for x in range(0,len(item)):
        if month in item[x][0] and current_year in item[x][0]:
            money=Decimal(sub(r'[^\d.]', '', item[x][1]))
            sum=sum+money
            
    return CalExpense(month,sum)

#/*===== Report Object from GCP Function ============*/
#=======================================================  
def changeKitchen(lst):
    checkDatabaseConn(mydb)
   
    month=lst[1]
    paidSelect=lst[2]
    
    current_year=date.today().strftime("%Y")
    sum=0
    per=0
    spendDiff=0
    
    cursor = mydb.cursor()
    cursor.callproc('getKitchenPrice')
    for result in cursor.stored_results():
        item=result.fetchall()
    if len(paidSelect)==0:
        for x in range(0,len(item)):
            if month in item[x][1] and current_year in item[x][1]:
                money=Decimal(sub(r'[^\d.]', '', item[x][2]))
                sum=sum+money
        return CalExpense(month,sum)
    else:
        for x in range(0,len(item)):
            if month in item[x][1] and current_year in item[x][1] and paidSelect in item[x][0]:
                money=Decimal(sub(r'[^\d.]', '', item[x][2]))
                sum=sum+money
        return CalExpense(month,sum)
        
def changeOffice(lst):
    checkDatabaseConn(mydb)
    month=lst[1]
    paidSelect=lst[2]
    
    current_year=date.today().strftime("%Y")
    sum=0
    per=0
    spendDiff=0
    
    cursor = mydb.cursor()
    cursor.callproc('getOfficePrice')
    for result in cursor.stored_results():
        item=result.fetchall()
    if len(paidSelect)==0:
        for x in range(0,len(item)):
            if month in item[x][1] and current_year in item[x][1]:
                money=Decimal(sub(r'[^\d.]', '', item[x][2]))
                sum=sum+money
        return CalExpense(month,sum)
    else:
        for x in range(0,len(item)):
            if month in item[x][1] and current_year in item[x][1] and paidSelect in item[x][0]:
                money=Decimal(sub(r'[^\d.]', '', item[x][2]))
                sum=sum+money
        return CalExpense(month,sum)
    
#/*===== Report Checkout Object from GCP Function ============*/
#==============================================================  
def reportCheckout():
    checkDatabaseConn(mydb)
    month=[['January',0],['February',0],['March',0],['April',0],['May',0],
            ['June',0] ,['July',0],['August',0],['September',0],['October',0],
            ['November',0],['December',0]]
    
    cursor = mydb.cursor()
    cursor.callproc('getCheckoutReport')
    for result in cursor.stored_results():
        checkData=result.fetchall()
    
    checkDataList=listSplit(checkData)
    firstList,secondList=checkDataList[0],checkDataList[1]
    
    for k in range(12):
        for x in range(0,len(firstList)):
            if  month[k][0] in firstList[x][0] and firstList[x][1]!='Return':
                month[k][1]=month[k][1]+1
    
    for k in range(12):
        for x in range(0,len(secondList)):
            if month[k][0] in secondList[x][0] and secondList[x][1]!='Return':
                month[k][1]=month[k][1]+1
    return dict(month)   

#/*===== Report Unpaid Object from GCP Function ============*/
#==============================================================  
def UnpaidReport():
    checkDatabaseConn(mydb)
    month=[['January',0],['February',0],['March',0],['April',0],['May',0],
            ['June',0] ,['July',0],['August',0],['September',0],['October',0],
            ['November',0],['December',0]]
    
    cursor = mydb.cursor()
    cursor.callproc('getUnpaid')
    for result in cursor.stored_results():
        checkData=result.fetchall()
    
    checkDataList=listSplit(checkData)
    firstList,secondList=checkDataList[0],checkDataList[1]
    
    for k in range(12):
        for x in range(0,len(firstList)):
            if month[k][0] in firstList[x][0]:
                month[k][1]=month[k][1]+1
    
    for k in range(12):
        for x in range(0,len(secondList)):
            if month[k][0] in secondList[x][0] :
                month[k][1]=month[k][1]+1
    return dict(month)  
#/*===== Report Unpaid Object from GCP Function ============*/
#==============================================================
def paidReport():
    checkDatabaseConn(mydb)
    
    month=[['January',0],['February',0],['March',0],['April',0],['May',0],
            ['June',0] ,['July',0],['August',0],['September',0],['October',0],
            ['November',0],['December',0]]
    
    cursor = mydb.cursor()
    cursor.callproc('getPaid')
    for result in cursor.stored_results():
        checkData=result.fetchall()
    
    checkDataList=listSplit(checkData)
    firstList,secondList=checkDataList[0],checkDataList[1]
    
    
    for k in range(12):
         for x in range(0,len(firstList)):
             if month[k][0] in firstList[x][0]:
                 month[k][1]=month[k][1]+1
                 
    for k in range(12):
         for x in range(0,len(secondList)):
             if month[k][0] in secondList[x][0]:
                 month[k][1]=month[k][1]+1
    
    monthData=dict(month)  
    return monthData
#/*===== Report Unpaid Object from GCP Function ============*/
#==============================================================
def InventoryReport():
    checkDatabaseConn(mydb)
    category=[['Office Item',0],['Kitchen Item',0],['Bathroom Item',0],
              ['Brand Item',0],['Total Item',0]]
    
    cursor = mydb.cursor()
    cursor.callproc('getInventory')
    for result in cursor.stored_results():
        checkData=result.fetchall()
        
    checkDataList=listSplit(checkData)
    firstList,secondList=checkDataList[0],checkDataList[1]
    
    for x in range(len(firstList)):
        if firstList[x][1]=='Office Item':
            category[0][1]= category[0][1]+firstList[x][0]
            
        elif firstList[x][1]=='Kitchen Item':
            category[1][1]= category[1][1]+firstList[x][0]
        
        elif firstList[x][1]=='Bathroom Item':
            category[2][1]= category[2][1]+firstList[x][0]
        
        elif firstList[x][1]=='Brand Item':
            category[3][1]= category[3][1]+firstList[x][0]
            
    for x in range(len(secondList)):
        if secondList[x][1]=='Office Item':
            category[0][1]= category[0][1]+secondList[x][0]
            
        elif secondList[x][1]=='Kitchen Item':
            category[1][1]= category[1][1]+secondList[x][0]
        
        elif secondList[x][1]=='Bathroom Item':
            category[2][1]= category[2][1]+secondList[x][0]
        
        elif secondList[x][1]=='Brand Item':
            category[3][1]= category[3][1]+secondList[x][0]
    Sum=[category[0][1],category[1][1],category[2][1],category[3][1]]
    category[4][1]=sum(Sum) 
    return dict(category)
        
    
#/*===== Report Low Items Object from GCP Function =============*/
#================================================================
def LowItemReport():
    checkDatabaseConn(mydb)
    category=[['Office Item',0],['Kitchen Item',0],['Bathroom Item',0],
              ['Brand Item',0]]
    
    cursor = mydb.cursor()
    cursor.callproc('getLowItemData')
    for result in cursor.stored_results():
        checkData=result.fetchall()
        
    checkDataList=listSplit(checkData)
    firstList,secondList=checkDataList[0],checkDataList[1]
    
    for x in range(len(firstList)):
        if firstList[x][1]=='Office Item' and firstList [x][2]< firstList [x][0]:
            category[0][1]= category[0][1]+firstList[x][0]
            
        elif firstList[x][1]=='Kitchen Item' and firstList [x][2]< firstList [x][0]:
            category[1][1]= category[1][1]+firstList[x][0]
        
        elif firstList[x][1]=='Bathroom Item' and firstList [x][2]< firstList [x][0]:
            category[2][1]= category[2][1]+firstList[x][0]
        
        elif firstList[x][1]=='Brand Item' and firstList [x][2]< firstList [x][0]:
            category[3][1]= category[3][1]+firstList[x][0]
    
    for x in range(len(secondList)):
        if secondList[x][1]=='Office Item' and secondList [x][2]< secondList [x][0]:
            category[0][1]= category[0][1]+secondList[x][0]
            
        elif secondList[x][1]=='Kitchen Item' and secondList [x][2]< secondList [x][0]:
            category[1][1]= category[1][1]+secondList[x][0]
        
        elif secondList[x][1]=='Bathroom Item' and secondList [x][2]< secondList [x][0]:
            category[2][1]= category[2][1]+secondList[x][0]
        
        elif secondList[x][1]=='Brand Item' and secondList [x][2]< secondList [x][0]:
            category[3][1]= category[3][1]+secondList[x][0]
    return dict(category)

#==============================END OF REPORT CODES ================================  



#/************** Helper Functions *********************************/
#==================================================================  

#/*== calculate Month Expense Function ======*/
#==============================================  
    
def CalExpense(month,sum):
    per=0
    spendDiff=0
    
    if sum==0:
        spendDiff=0
        per=0  
        
    elif sum<50000:
         per=((50000-sum)/50000)*100
         per=round(per,0)
         spendDiff=50000-sum
    else:
        spendDiff=50000-sum
        per=100
        
    currentMonthData=[month,str(sum),per,spendDiff]
    return currentMonthData
#============================================= 
    
def addUploadImage(id,image):
    checkDatabaseConn(mydb)
    query="UPDATE inventory.invoice SET url=%s WHERE invoiceid=%s "
    val=(image,id)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    mydb.commit()
    
def modifyHelper(modifyVal):
    checkDatabaseConn(mydb)
    modifyList=[]
    if len(modifyVal)==0:
        modify="No Value"
        return modify
    
    elif len(modifyVal) < 100:
            for x in range(0,len(modifyVal)):
                query="SELECT modifyDate,modifyOld,modifyNew,modifyby FROM inventory.modify WHERE idmodify= ?  "
                val=(modifyVal[x][1],)
                cursor = mydb.cursor(prepared=True)
                cursor.execute(query, val)
                modifyList+=cursor.fetchall()
            return modifyList
        
    elif len(modifyVal) > 100:
            listSplit=listSplit(modifyVal) 
            firstList,secondList=listSplit[0],listSplit[1]
            for x in range(0,len(firstList)):
                query="SELECT modifyDate,modifyOld,modifyNew,modifyby FROM inventory.modify WHERE idmodify= ?  "
                val=(firstList[x][1],)
                cursor = mydb.cursor(prepared=True)
                cursor.execute(query, val)
                modifyList+=cursor.fetchall()
            for x in range(0,len(secondList)):
                query="SELECT modifyDate,modifyOld,modifyNew,modifyby FROM inventory.modify WHERE idmodify= ?  "
                val=(secondList[x][1],)
                cursor = mydb.cursor(prepared=True)
                cursor.execute(query, val)
                modifyList+=cursor.fetchall()
            return modifyList
    
       
def listSplit(lst):
    checkDatabaseConn(mydb)
    listLen=len(lst)//2
    firstList=lst[:listLen]
    secondList=lst[listLen:]
    return firstList,secondList

#/*===== Helper Functions for check out ==========================*/
#==================================================================  
def getCheck(NewList,checkId,today):
    oldList=[]
    
    query="SELECT name,item,qty,comment,brand,category status FROM inventory.checkout WHERE checkoutid=?  "
    val=(checkId,)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query,val)
    statusData=cursor.fetchall()
        
    for x in range (0,len(statusData[0])):
        oldList.append(statusData[0][x])
        holVal=list(set(oldList) - set(NewList))
        
    for x in range(0,len(holVal)):
        query="INSERT INTO inventory.modify(modifyDate,modifyOld,modifyNew,modifyby) VALUES (%s,%s,%s,%s) "
        index=oldList.index(holVal[x])
        neVal=NewList[index]
        val=(today,holVal[x],neVal,user)
        cursor = mydb.cursor(prepared=True)
        cursor.execute(query, val)
        ID=cursor.lastrowid
        mydb.commit()
                
        cursor = mydb.cursor()
        cursor.callproc('addCheckHasModify',[checkId, ID,])
        mydb.commit()  
#================================================================== 
    
def checkInternetHttplib(url,timeout):
    connection = httplib.HTTPConnection(url,timeout)
    try:
        # only header requested for fast operation
        connection.request("HEAD", "/")
        connection.close()  # connection closed
        return True
    except Exception as exep:
        return False