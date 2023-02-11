from app import app
app.run(debug=True,host="127.0.0.1",port=8080)
from waitress import serve
#serve(app, host="127.0.0.1", port=8080)