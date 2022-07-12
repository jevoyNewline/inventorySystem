from crypt import methods
import os
import json
from xml.etree.ElementTree import Comment
import flask
from app import app
from .API import *
from flask import render_template, request, redirect, url_for, flash, jsonify

@app.route("/")
def landing():
    return render_template("base.html")

@app.route("/dashboard", methods=["POST","GET"])
def dashboard():
    if request.method== "POST" and 'editItem' in request.form:
        editStock=editStockDatabase(request.form['itemName-edit'],request.form['Description-edit'],
        request.form['stock-edit'],request.form['comment-edit'],request.form['brand-edit'],
        request.form['category-edit'],request.form['location-edit'],request.form.get("filename", False),request.form['stockId-edit'])
    stockData=fetchStockData()
    orderData=fetchOrderData()
    orderData=orderData[:6]
    stockData=stockData[:6]
    return render_template("dashboard.html",stockData=stockData,orderData=orderData)
    
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
    totalEpenes={'per':70,'spend':'$50,000'}
    if request.method== "POST":
        data=request.get_json()
        data=jsonify(totalEpenes)
        return data
    return render_template("dashboard.html")

@app.route("/addItem", methods=["POST","GET"])
def addItem():
    if request.method== "POST":
        addItem=addItemDatabase(request.form['itemName'],request.form['Description'],
             request.form['stock'],request.form['comment'],request.form['brand'],
             request.form['category'],request.form['location'],request.form['filename'])
    return render_template("dashboard.html")
    
@app.route("/addOrder", methods=["POST","GET"])
def addOrder():
    if request.method=="POST":
        print('work')
        addOrder=addOrderDatabase(request.form['itemName'],request.form['comment'],request.form['qty'],request.form['brand'],
             request.form['category'],request.form['price'])
        
    return render_template("dashboard.html")

# Server function for editing stock
@app.route("/editStock", methods=["POST","GET"])
def editStock():
    if request.method== "POST":
        editStock=editStockDatabase(request.form['itemName-edit'],request.form['Description-edit'],
             request.form['stock-edit'],request.form['comment-edit'],request.form['brand-edit'],
             request.form['category-edit'],request.form['location-edit'],request.form.get("filename", False),request.form['stockId-edit'])
    return render_template("dashboard.html")
    
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")