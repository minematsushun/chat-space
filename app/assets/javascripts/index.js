$(document).on('turbolinks:load',function(){

  let search_list = $("#user-search-result");
  let searched_list = $(".js-add-user");

  function appendUser(user){
    let html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <p class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</p>
                </div>`
    search_list.append(html);
  }

  function appendedUser(user_id, user_name){
    let html = `<div class="chat-group-user clearfix">
                  <input name='group[user_ids][]' type='hidden' value='${user_id}'>
                  <p class="chat-group-user__name">${user_name}</p>
                  <p class="user-search-add chat-group-user__btn chat-group-user__btn--del" data-user-id="${user_id}" data-user-name="${user_name}">削除</p>
                </div>`
    searched_list.append(html);
  }

  function addNoUser(){
    let html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">ユーザーが見つかりません</p>
                </div>`
    search_list.append(html);
  }

  $("#user-search-field").on("keyup",function(){
    let input = $("#user-search-field").val();
    let array = [] //空の配列を作る（＊２）
    $("#chat-group-users").find('input').each(function(index, element){
      array.push($(element).val())
    }) //配列の中に今のグループのユーザーIDを入れる（＊２）
    $.ajax({
      type: "GET",
      url: "/users",
      dataType: "json",
      data: { keyword: input , error: array}
    })
    .done(function(users){
      search_list.empty();
      console.log("users")
      if (input.length == 0) {
        return false;
      } else if (users.length !== 0) {
        users.forEach (function(user){
          if(user.name !== $(".chat-group-user__name").val())
          console.log(user)
            appendUser (user);
        });
      } else {
        addNoUser();
      }
    })

    .fail(function(){
      console.log(this)
      alert("ユーザー検索に失敗しました");
    });
  });


  $("#user-search-result").on("click", ".chat-group-user__btn--add" , function(){
    let user_id = $(this).data('user-id');
    let user_name = $(this).data('user-name');
    appendedUser(user_id, user_name);
    $(this).parent().remove();
  })

  $(".js-add-user").on("click", ".chat-group-user__btn--del" ,function(){
    $(this).parent().remove();
  });
});