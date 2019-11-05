// Initialise Pusher
const pusher = new Pusher('ab111db1de74ab5d6b29', {
    cluster: 'ap2',
    encrypted: true
});

// Subscribe to movie_bot channel
const channel = pusher.subscribe('movie_bot');

$(function() {
  $("#addClass").click(function(e) {
    e.preventDefault();
    $('#qnimate').addClass('popup-box-on');
  });
  $("#removeClass").click(function() {
    $('#qnimate').removeClass('popup-box-on');
  });

  $("#speech_recog").click(function(e) {
    e.preventDefault();
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
recognition.start();

recognition.onresult = function(event) {
//    console.log('You said: ', event.results[0][0].transcript);
    userSays(event.results[0][0].transcript)
};

  });


});

 function submit_message(message) {

$.post( "/send_message", {
            message: message,
            socketId: pusher.connection.socket_id
        }, handle_response);

        function handle_response(data) {
            // append the bot repsonse to the div
            console.log(data.message)
            $('.direct-chat-msg').append(`
            <div class="direct-chat-text">
                    ${data.message}
                </div>
`)
            // remove the loading indicator
            $( "#loading" ).remove();

            $('.direct-chat-msg').append(`
            <div class="margin_div">
            </div>
        `)


//        const messages = document.getElementsByClassName(".popup-messages");
//        messages.scrollTop = messages.scrollHeight;sName(".popup-messages");
//        messages.scrollTop = messages.scrollHeight;sName(".popup-messages");
//        messages.scrollTop = messages.scrollHeight;


//showHeight( "popup-messages", $( document ).height() );
//
//showHeight( "direct-chat-messages", $( document ).height() );
//
//showHeight( "direct-chat-msg", $( document ).height() );
showHeight( "direct-chat-msg", $( document ).height() );

//var objDiv = document.getElementsByClassName("#popup-messages");
//        $('.popup-messages').scroll(objDiv.scrollHeight);

        }


}

function showHeight( element, height ) {
  $('.popup-messages').scroll(height);
}


$('#target').on('submit', function(e){
        e.preventDefault();
        const input_message = $('#input_message').val()
        // return if the user does not enter any text
        if (!input_message) {
            return
        }

        userSays(input_message);


    });


function userSays(input_message){

    //        user part
        const userName = 'User'
        const robotName = 'Robot'
        const loadingMsg = 'Loading...'
        const userImage = '//www.gravatar.com/avatar/2090713a50fcdae69b802e73815000a4/?default=&s=64'
        const robotImage = 'https://robohash.org/69.162.124.234.png'
        $('.direct-chat-msg').append(`
            <div class="robot_direct-chat-info clearfix">
                    <span class="robot_direct-chat-name pull-right">${userName}</span>
                </div>
                <img alt="message user image"
                     src=${userImage}
                     class="robot_direct-chat-img">

                     <div class="robot_direct-chat-text">
                    ${input_message}
                </div>
        `)

        $('.direct-chat-msg ').append(`
            <div class="margin_div">
            </div>
        `)


        $('.direct-chat-msg ').append(`
        <div class="direct-chat-info clearfix">
                    <span class="direct-chat-name pull-left">${robotName}</span>
              </div>
                <img alt="message user image"
                     src=${robotImage}
                     class="direct-chat-img">

                     <div class="direct-chat-text" id="loading">
                    ${loadingMsg}
                </div>
        `)


//        robot part
$('#input_message').val('')
         submit_message(input_message)
}