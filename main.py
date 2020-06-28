from quiz import makePPTFromQs

from flask import Flask,render_template,request,send_file

import time

import threading
import os

def remove_file(name):
    time.sleep(60*60)
    os.remove(name)

app=Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate",methods=['POST'])
def gen():
    try:
        Questions_and_answers=request.json
        for Questions_and_answer in Questions_and_answers:
            print(Questions_and_answer["Answer"])
            if not Questions_and_answer["Question"] or not Questions_and_answer["Answer"]:
                return "<p>Empty data</p>"
            if any([not x for x in Questions_and_answer["Options"]]):
                return "<p>Empty data</p>"
        temp=str(time.time())+request.remote_addr
        tag=f"<b>This link is valid for 1 hour</b><br><a href='/downloadfile?filename={temp}.pptx'> Click here to download the PPT</a>"
        makePPTFromQs(Questions_and_answers,temp+".pptx")
        threading.Thread(target=remove_file,args=(temp+".pptx",)).start()
        return tag
    except :
        return "An error occured"


@app.route("/downloadfile")
def download():
    f=request.args.get("filename")
    if os.path.isfile(f):
        return send_file(f,as_attachment=True)
    return "LINK has expired"

# Format for Qs and As
# Questions_and_answers=[
#   {"Question":"<Your question here>","Answer":"<Answer to your question>","Options":["<option 1>","<option 2>,..."]}
# ]
# 
# Questions_and_answers=[]
# makePPTFromQs(Questions_and_answers,"hi.pptx")


if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
