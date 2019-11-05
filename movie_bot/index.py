from flask import Flask, request, jsonify, render_template
import os
import dialogflow
import requests
import json
import pusher
import speech_recognition as sr
import webbrowser as wb

# initialize Pusher
pusher_client = pusher.Pusher(
    app_id=os.getenv('PUSHER_APP_ID'),
    key=os.getenv('PUSHER_KEY'),
    secret=os.getenv('PUSHER_SECRET'),
    cluster=os.getenv('PUSHER_CLUSTER'),
    ssl=True)

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_movie_detail', methods=['POST'])
def get_movie_detail():
    data = request.get_json(silent=True)
    movie = data['queryResult']['parameters']['movie']
    api_key = os.getenv('OMDB_API_KEY')

    movie_detail = requests.get('http://www.omdbapi.com/?t={0}&apikey={1}'.format(movie, api_key)).content
    movie_detail = json.loads(movie_detail)
    response = """
            Title : {0}
            Released: {1}
            Actors: {2}
            Plot: {3}
        """.format(movie_detail['Title'], movie_detail['Released'], movie_detail['Actors'], movie_detail['Plot'])

    reply = {
        "fulfillmentText": response,
    }

    return jsonify(reply)


@app.route('/send_message', methods=['POST'])
def send_message():
    message = request.form['message']
    project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
    fulfillment_text = detect_intent_texts(project_id, "unique", message, 'en')
    response_text = {"message": fulfillment_text}

    socketId = request.form['socketId']
    pusher_client.trigger('movie_bot', 'new_message',
                          {'human_message': message, 'bot_message': fulfillment_text},
                          socketId)
    return jsonify(response_text)


def detect_intent_texts(project_id, session_id, text, language_code):
    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(project_id, session_id)

    if text:
        text_input = dialogflow.types.TextInput(
            text=text, language_code=language_code)
        query_input = dialogflow.types.QueryInput(text=text_input)
        response = session_client.detect_intent(
            session=session, query_input=query_input)

        return response.query_result.fulfillment_text


@app.route('/background_process_test')
def background_process_test():
    print("ok")
    return "nothing"


@app.route('/send_message1', methods=['POST'])
def send_message1():
    # message = request.form['message']
    # return message
    r1 = sr.Recognizer()
    r2 = sr.Recognizer()
    r3 = sr.Recognizer()

    with sr.Microphone() as source:
        print("search youtube")
        print('speak now')
        audio = r3.listen(source)

        print('speak now')

        try:
            get = r3.recognize_google(audio)
            print(get)
            return get
        except sr.UnknownValueError:
            print('error')
            return 'error'
        except sr.RequestError as e:
            print('failed'.format(e))
            return e


# run Flask app
if __name__ == "__main__":
    app.run()
