$(function() {
  $("#addClass").click(function(e) {
    e.preventDefault();
    $('#qnimate').addClass('popup-box-on');
  });
  $("#removeClass").click(function() {
    $('#qnimate').removeClass('popup-box-on');
  });
});


$('#target').on('submit', function(e){
        e.preventDefault();
        const input_message = $('#input_message').val()
        // clear the text input
        $('#input_message').val('jaliur')
    });