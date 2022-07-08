from re import T
import mysql.connector
import mysql
import os
from datetime import date
from base64 import b64encode
mydb = mysql.connector.connect(
    host="localhost", user="root", password="icec00lRen!", database='inventory')

def addItemDatabase(itemName,Description,stock,comment,brand,category,location,imageFile):
    stock=int(stock)
    query="INSERT INTO stock(item_name,descriptions,qty,comment,brand,category,locations,imageFile) VALUES (%s,%s,?,%s,%s,%s,%s,%s)"
    val=(itemName,Description,stock,comment,brand,category,location,imageFile)
    cursor = mydb.cursor(prepared=True)
    cursor.execute(query, val)
    mydb.commit()
    
    
def addOrderDatabase(itemName,comment,qty,brand,category,price):
    today=date.today()
    today=today.strftime("%B %d, %Y")
    today=str(today)
    query="INSERT INTO purchase(item,qty,comment,brand,category,orderDate,orderPrice) VALUES (%s,%s,%s,%s,%s,%s,%s)"
    val=(itemName,qty,comment,brand,category,today,price)
    cursor = mydb.cursor()
    cursor.execute(query, val)
    mydb.commit()
   
    
def fetchStockData():
    query="SELECT * FROM stock "
    cursor = mydb.cursor()
    cursor.execute(query)
    rows=cursor.fetchall()
    return rows

def editStockDatabase(itemNameEdit,DescriptionEdit,stockEdit,commentEdit,brandEdit,categoryEdit,locationEdit,filename,stockIdEdit):
    stockIdEdit=int(stockIdEdit)
    if filename== False:
        query="UPDATE stock SET item_name=%s,descriptions=%s,qty=%s,comment=%s,brand=%s,category=%s,locations=%s WHERE stockid=%s "
        val=(itemNameEdit,DescriptionEdit,stockEdit,commentEdit,brandEdit,categoryEdit,locationEdit,stockIdEdit)
        cursor = mydb.cursor()
        cursor.execute(query, val)
        mydb.commit()
        
    else:
        query="UPDATE stock SET item_name=%s,descriptions=%s,qty= %s,comment=%s,brand=%s,category=%s,locations=%s,imageFile=%s WHERE stockid= %s "
        val=(itemNameEdit,DescriptionEdit,stockEdit,commentEdit,brandEdit,categoryEdit,locationEdit,filename,stockIdEdit)
        cursor = mydb.cursor()
        cursor.execute(query, val)
        mydb.commit()
        
        