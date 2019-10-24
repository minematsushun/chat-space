$(function(){

  function buildHTML(message){
    let addImage = (message.image !== null)? `<img class="lower-message__image" src="${message.image}">`:''

    let html = `<div class="main__content__message" data-message-id="${message.id}">
                  <div class="main__content__message__upper-info">
                    <div class="main__content__message__upper-info__name">
                      ${message.user}
                    </div>
                    <div class="main__content__message__upper-info__time">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="main__content__message__text">
                    <p>${message.content}</p>
                    ${addImage}
                  </div>
                </div>`
    return html;
  }


  $("#new_message").on("submit", function(e){
    e.preventDefault();
    let message = new FormData(this);
    let url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: message,
      dataType: "json",
      processData: false,
      contentType: false
    })
    .done(function(data){
      let html = buildHTML(data);
      $('.main__content').append(html)
      $('form')[0].reset();
      $('.main__content').animate({scrollTop:$(".main__content")[0].scrollHeight},"slow");
    })
    .fail(function(data){
      alert("エラーです");
    })
    .always(function(data){
      $('.form__submit').prop('disabled',false);
    });
  })

  var reloadMessages = function(){
    var last_message_id = $(".main__content__message:last").data("message-id")
    $.ajax({
      url: "api/messages",
      type: "GET",
      dataType: "json",
      data: {id: last_message_id}
    })
    .done(function(messages){
        let insertHTML = "";
        messages.forEach(function(message){
          insertHTML = buildHTML(message);
          $(".main__content").append(insertHTML);
        })
        $(".main__content").animate({scrollTop:$(".main__content")[0].scrollHeight}, "slow");
    })
    .fail(function(){
      alert("自動更新失敗です")
    });

  };
  if (window.location.href.match(/groups\/\d\/messages/)){
    setInterval(reloadMessages, 5000);
  }
});


