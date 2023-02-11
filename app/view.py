from crypt import methods
from mimetypes import common_types
import os
from pathlib import Path
import json
import flask
from app import app
from .API import *
from flask import render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from google.cloud import storage
import logging
import http.client as httplib

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= 'scotia-gallery-83d196d15b34.json'
UPLOAD_FOLDER = "./app/upload"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
placeHoldImage='None'
filePath='https://storage.googleapis.com/misystem_items/'


@app.route("/")
def landing():
    netCheck=checkInternetHttplib("www.google.com", 3)
    if netCheck== True:
        return render_template("base.html")
    else:
        return render_template("fail.html")
        

@app.route("/dashboard", methods=["POST","GET"])
async def dashboard():
    
#/*===== Add stock Object Function ============*/
#==============================================
    if request.method== "POST" and 'addItem-form'in request.form:
        if request.files['filename'].filename == '':
             addItemDatabase(request.form['itemName'],request.form['Description'],
             request.form['stock'],request.form['comment'],request.form['brand'],
             request.form['department'],request.form['category'],request.form['location'],placeHoldImage,request.form['stockLimit'],request.form['freqChange'])
        else:
            image = request.files["filename"]
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
            filename = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
            client = storage.Client()
            bucket=client.get_bucket('misystem_items')
            blob=bucket.blob(request.form['itemName'])
            blob.upload_from_filename(filename)
            url=blob.public_url
            addItemDatabase(request.form['itemName'],request.form['Description'],
             request.form['stock'],request.form['comment'],request.form['brand'],
             request.form['department'],request.form['category'],request.form['location'],url,request.form['stockLimit'],request.form['freqChange'])
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
            
#/*===== Add in stock Order Object Function ============*/
#=======================================================
    if request.method=="POST" and 'btn-inStockForm' in request.form:
        inStock=True
        if request.files['filename'].filename == '':
            FileType='none'
            addOrderDatabase(request.form['inStock-item'],request.form['inStock-comment'],request.form['inStock-qty'],request.form['inStock-brand'],
             request.form['inStock-category'],request.form['inStock-price'],request.form['inStock-status'],request.form['inStock-supplier'],placeHoldImage,inStock,FileType)
        else:
            image = request.files["filename"]
            mimetype=image.content_type
            mimetype=mimeTypeSplit(mimetype)
            resultID=addOrderDatabase(request.form['inStock-item'],request.form['inStock-comment'],request.form['inStock-qty'],request.form['inStock-brand'],
             request.form['inStock-category'],request.form['inStock-price'],request.form['inStock-status'],request.form['inStock-supplier'],placeHoldImage,inStock,mimetype)
            url=upload(image,str(resultID),'invoice', mimetype) 
            addUploadImage(resultID,url)
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
        
#/*===== Edit stock Object Function ============*/
#==============================================
    if request.method== "POST" and 'editItem' in request.form:
        if request.files['filename'].filename == '':
            filename='None'
            editStockDatabase(request.form['itemName-edit'],request.form['Description-edit'],
        request.form['stock-edit'],request.form['comment-edit'],request.form['brand-edit'],
        request.form['department-edit'],request.form['category-edit'],request.form['location-edit'],filename,request.form['stockId-edit'],request.form['freqChange-edit'],
        request.form['stockLimit-edit'])
        else:
            image = request.files["filename"]
            url=upload(image,request.form['itemName-edit'],'none')
            editStockDatabase(request.form['itemName-edit'],request.form['Description-edit'],
        request.form['stock-edit'],request.form['comment-edit'],request.form['brand-edit'],request.form['department-edit'],
        request.form['category-edit'],request.form['location-edit'],url,request.form['stockId-edit'],request.form['freqChange-edit'],
        request.form['stockLimit-edit'])
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
            
#/**************** ORDER CODES *********************/    
       
#/*===== Add in Order Object Function ============*/
#==================================================            
    if request.method=="POST" and 'btn-addOrderForm' in request.form:
        inStock=False
        if request.files['filename'].filename == '':
            FileType='none'
            addOrderDatabase(request.form['itemName'],request.form['comment'],request.form['qty'],request.form['brand'],
             request.form['category'],request.form['price'],request.form['inStock-status'],request.form['supplier'],placeHoldImage,inStock,FileType)
        else:
            image = request.files["filename"]
            mimetype=image.content_type
            mimetype=mimeTypeSplit(mimetype)
            resultID=addOrderDatabase(request.form['itemName'],request.form['comment'],request.form['qty'],request.form['brand'],
             request.form['category'],request.form['price'],request.form['order-status'],request.form['supplier'],placeHoldImage,inStock,mimetype)
            url=upload(image,str(resultID),'invoice',mimetype)
            addUploadImage(resultID,url)
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
#=============================================

#/*===== Add in stock Order Object Function ============*/
#=======================================================
    if request.method=="POST" and 'btn-inStockForm' in request.form:
        inStock=True
        if request.files['filename'].filename == '':
            FileType='none'
            addOrderDatabase(request.form['inStock-item'],request.form['inStock-comment'],request.form['inStock-qty'],request.form['inStock-brand'],
             request.form['inStock-category'],request.form['inStock-price'],request.form['inStock-status'],request.form['inStock-supplier'],placeHoldImage,inStock,FileType)
        else:
            image = request.files["filename"]
            mimetype=image.content_type
            mimetype=mimeTypeSplit(mimetype)
            resultID=addOrderDatabase(request.form['inStock-item'],request.form['inStock-comment'],request.form['inStock-qty'],request.form['inStock-brand'],
             request.form['inStock-category'],request.form['inStock-price'],request.form['inStock-status'],request.form['inStock-supplier'],placeHoldImage,inStock,mimetype)
            url=upload(image,str(resultID),'invoice', mimetype) 
            addUploadImage(resultID,url)
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
 #=============================================
        
    if request.method=="POST" and "orderEditItem" in request.form:
        editOrderDatabase(request.form['orderId-edit'],request.form['itemName-orderEdit'],request.form['qty-orderEdit'],request.form['comment-orderEdit'],request.form['brand-orderEdit'],
             request.form['category-orderEdit'],request.form['order-statusEdit'],request.form['price-orderEdit'])
        
#/**************** INVOICE CODES *********************/    
       
#/*===== Edit Invoice Object Function ============*/
#================================================== 
    if request.method=="POST" and "DashInovEditItem" in request.form:
        if request.files['filename'].filename == '':
            filename='None' 
            editInvoice(request.form['inoviceId-edit'],request.form['inovice-editSupp'],filename)
        else:
            image = request.files["filename"]
            mimetype=image.content_type
            mimetype=mimeTypeSplit(mimetype)
            url=upload(image,request.form['inoviceId-edit'],'invoice',str(mimetype))
            editInvoice(request.form['inoviceId-edit'],request.form['inovice-editSupp'],url,mimetype)
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
     
    stockData=fetchStockData()
    itemData=fetchStockData()
    orderData=fetchOrderData()
    Data=fetchInvoiceData()
    invoiceData=Data[0]
    supplier=Data[1]
    invoiceData=invoiceData[:5]
    orderData=orderData[:6]
    stockData=stockData[:5]
    return render_template("dashboard.html",stockData=stockData,orderData=orderData,invoiceData=invoiceData,supplier=supplier,itemData= itemData)


#/**************** Check Out CODES *********************/
#/*===== Check Out Object Function ============*/
#==================================================     
@app.route("/checkout",methods=["POST","GET"])
def checkout():
    if request.method== "POST" and 'btn-checkoutForm'in request.form:
         addCheckout(request.form['name'],request.form['ItemName'],request.form['checkoutQty'],request.form['checkoutComment'],request.form['checkoutBrand'],request.form['checkoutCategory'],request.form['checkoutStatus'])
         
    if request.method== "POST" and 'btn-checkoutFormEdit'in request.form:
        editCheckout(request.form['CheckNameEdit'],request.form['ItemNameEdit'],request.form['stock-edit'],
                     request.form['checkoutCommentEdit'],request.form['checkoutBrandEdit'],
                     request.form['checkoutCategoryEdit'],request.form['checkoutStatusEdit'],
                     request.form['checkoutId-edit'])
         
    stockData=fetchStockData()
    checkoutData=fetchCheckout()
    return render_template("checkout.html",stockData= stockData,checkoutData=checkoutData)
#=============================================


#/**************** Report CODES *********************/
#/*===== Report Object Function ===================*/
#==================================================  
@app.route("/report", methods=["POST","GET"])
def report():
    if request.method== "POST":
        data=request.get_json()
        
        if data[0]=='change month':
            return jsonify(changeMonth(data))
        
        if data[0]=='change kitchen':
            return( jsonify(changeKitchen(data)))
        
        if data[0]=='change Office':
            return( jsonify(changeOffice(data)))
        
        if data[0]=='check':
            reportCheckoutData=reportCheckout()
            UnpaidReportData=UnpaidReport()
            paidReportData=paidReport()
            categoryData=InventoryReport()
            lowItemData= LowItemReport()
            data=[reportCheckoutData,UnpaidReportData,paidReportData,categoryData,lowItemData]
            return jsonify(data)
        
        
    expenseMthData=reportExpense()
    kitchen=kitchenExp()  
    office=OfficeExp()     
    return render_template("report.html",kitchen=kitchen, expenseMthData=expenseMthData,office=office)
#=====================================================================================================


#/**************** Order CODES *********************/
#/*===== Order Object Function ===================*/
@app.route("/order", methods=["POST","GET"])
def order():
#/*===== Add in Order Object Function ============*/
#================================================== 
    if request.method=="POST" and 'btn-addOrderForm' in request.form:
        inStock=False
        if request.files['filename'].filename == '':
            FileType='none'
            addOrderDatabase(request.form['itemName'],request.form['comment'],request.form['qty'],request.form['brand'],
             request.form['category'],request.form['price'],request.form['inStock-status'],request.form['supplier'],placeHoldImage,inStock,FileType)
        else:
            image = request.files["filename"]
            mimetype=image.content_type
            mimetype=mimeTypeSplit(mimetype)
            resultID=addOrderDatabase(request.form['itemName'],request.form['comment'],request.form['qty'],request.form['brand'],
             request.form['category'],request.form['price'],request.form['order-status'],request.form['supplier'],placeHoldImage,inStock,mimetype)
            url=upload(image,str(resultID),'invoice',mimetype)
            addUploadImage(resultID,url)
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
            
    if request.method=="POST" and "orderEditItem" in request.form:
            editOrderDatabase(request.form['orderId-edit'],request.form['itemName-orderEdit'],request.form['qty-orderEdit'],request.form['comment-orderEdit'],request.form['brand-orderEdit'],
             request.form['category-orderEdit'],request.form['order-statusEdit'],request.form['price-orderEdit'])
        
    
    orderData=fetchOrderData()
    stockData=fetchStockData()
    return render_template("order.html",orderData=orderData,stockData=stockData)

@app.route("/MultipleOrder", methods=["POST","GET"])
def MultipleOrder():
     if request.method=="POST":
         data=request.get_json()
    
#=====================================================================================================

#/**************** Invoice CODES *********************/
#/*===== Invoice Object Function ===================*/
@app.route("/invoice", methods=["POST","GET"])
def invoice():
    
#/*===== Edit Invoice Object Function ============*/
#================================================== 
    if request.method=="POST" and "DashInovEditItem" in request.form:
        if request.files['filename'].filename == '':
            filename='None' 
            editInvoice(request.form['inoviceId-edit'],request.form['inovice-editSupp'],filename)
        else:
            image = request.files["filename"]
            mimetype=image.content_type
            mimetype=mimeTypeSplit(mimetype)
            url=upload(image,request.form['inoviceId-edit'],'invoice',str(mimetype))
            editInvoice(request.form['inoviceId-edit'],request.form['inovice-editSupp'],url,mimetype)
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
            
    Data=fetchInvoiceData()
    invoiceData=Data[0]
    supplier=Data[1] 
    return render_template("invoice.html",invoiceData=invoiceData,supplier=supplier)
    

@app.route("/KitchenReport", methods=["POST","GET"])
def KitchenReport():
    if request.method== "POST":
        data=request.get_json()
        
        if data[0]=='check unpaid':
            return jsonify(UnpaidReport())
            
    return render_template("report.html")
    

@app.route("/inventorysummuary", methods=["POST","GET"])
def inventorysummuary():
    InvenSumm={'Inventory': 'value',
                'Total Items': 60,
               'New Items':10,
               'Low Items':15,
               'Logout Items':5
               }
    if request.method== "POST":
        data=request.get_json()
        data=jsonify(InvenSumm)
        return data
    return render_template("dashboard.html")
    

@app.route("/itemcheckout", methods=["POST","GET"])
def  Itemcheckout():
    itemcheckout={'Month': 'value',
                'Jan': 60,
               'Feb':10,
               'Mar':15,
               'Apr':5,
               'May':3,
               'Jun': 10,
               'Jul': 20,
               'Aug': 10,
               'Sept':5,
               'Oct': 0,
               'Nov':1,
               'Dec':2
               }
    if request.method== "POST":
        data=request.get_json()
        data=jsonify(itemcheckout)
        return data
    return render_template("dashboard.html")

@app.route("/expense", methods=["POST","GET"])
def  expense():
    totalEpenes={'per':20,'spend':'$50,000'}
    if request.method== "POST":
        data=request.get_json()
        data=jsonify(totalEpenes)
        return data
    return render_template("dashboard.html")

        
#/*===== Modify Object Function ============*/
#=============================================
@app.route("/modify", methods=["POST","GET"])
def modify():
    if request.method== "POST":
        data=request.get_json()
        #data=list(data)
        data=dashboardModify(list(data))
        data = jsonify(data)
        return data
    
#/*===== Download Object from GCP Function ============*/
#=======================================================
@app.route("/download", methods=["POST","GET"])
def download():
    if request.method== "POST":
        data=request.get_json()
        data= downloadData(list(data))
        path_to_download_folder = str(os.path.join(Path.home(), "Downloads"))
        
        if data=="No Data":
            return data
        else:
            client = storage.Client()
            bucket=client.get_bucket('misystem_items')
            blob=bucket.blob(data)
            destination_uri = '{}/{}'.format(path_to_download_folder, blob.name) 
            blob.download_to_filename(destination_uri)
            return "200"
    return render_template("dashboard.html")
    

#/*===== Delete Object Database Function ============*/
#=============================================
@app.route("/delete", methods=["POST","GET"])
def deleteObject():
    if request.method== "POST":
        data=request.get_json()
        if data[0]=='order dash':
            deleteObjDatabase(list(data))
            return'ok'
        
        elif data[0]=='check':
            deleteCheck(list(data))
            return'ok'
        else:
            #data=request.get_json()
            data= deleteObjDatabase(list(data)) 
            if data=="None":
                pass
            else:
                delete_blob('misystem_items', data)
            return'ok'
        
        

#/*===== Delete Object GCP Function ============*/
#=============================================
def delete_blob(bucket_name, filename):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.delete()
    
 #/*===== Upload Object Function ============*/
#=============================================   
def upload(image, itemName,bucket,mimetype):
    if bucket== 'invoice':
        image.save(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
        filename = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
        client = storage.Client()
        bucket=client.get_bucket('misystem_items')
        blob=bucket.blob(itemName+'.'+mimetype)
        blob.upload_from_filename(filename)
        url=blob.public_url
        return url
    else:
        image.save(os.path.join(app.config["UPLOAD_FOLDER"], image.filename))
        mimetype=image.content_type
        filename = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
        filename=filename+'.'+mimetype
        client = storage.Client()
        bucket=client.get_bucket('misystem_items')
        blob=bucket.blob(itemName)
        blob.upload_from_filename(filename)
        url=blob.public_url
        return url
    
 #/*===== Website icon Function ============*/
#=============================================  
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'app/static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')
#/*===== Helper Functions ==========================*/
#====================================================  
def mimeTypeSplit(mimetype):
    mimeTypeData=mimetype.split("/")
    return mimeTypeData[1]

# function to check internet connectivity
def checkInternetHttplib(url,timeout):
    connection = httplib.HTTPConnection(url,timeout)
    try:
        # only header requested for fast operation
        connection.request("HEAD", "/")
        connection.close()  # connection closed
        return True
    except Exception as exep:
        return False
if __name__ == '__main__':
    #from waitress import serve
    #serve(app, host="127.0.0.1", port=8080)
    app.run(debug=True, host="", port="8080")