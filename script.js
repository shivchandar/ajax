$(function(){

    var $addTopdForm = $("#addToDo");
    var $listGroup = $(".list-group");

    var URL = "http://localhost:3000/toods";

    //template
    var source   = $("#listitemtemplate").html();
    var template = Handlebars.compile(source);

    // Add items
    $addTopdForm.on("submit", function(event){
        event.preventDefault();

        var firstname  =$addTopdForm.find('#firstName').val();
        /* var lastname  =$addTopdForm.find('#lastName').val();
        var city  =$addTopdForm.find('#city').val();
        var state  =$addTopdForm.find('#state').val(); */
        
        $.ajax({
            url:URL,
            method:"POST",
            data:{
                firstname:firstname,
                /*lastname:lastname,
                 address:[
                    {city:city},
                    {state:state}
                ] */
            }
        }).done(function(){
            var listItem = template({
                firstname : firstname.firstname,
                /* lastname:lastname.lastname,
                address:[
                    {city:city.city},
                    {state:state.state}
                ], */
                id : newTood.id
            });
    
            $listGroup.append(listItem);
        }).fail(function(){

        });
        $addTopdForm.find('input').val("");
    });

    $.ajax({
        url:URL,
        method:"GET"
    }).done(function(data){
        console.log("data", data);
        data.forEach(function(dataitem){
            var listItem = template({
                firstname : dataitem.firstname,
                //lastname:dataitem.lastname,
                id:dataitem.id
            });    
            $listGroup.append(listItem);
        })
    }).fail(function(){
        //err
    });

    // Delete
    $listGroup.on("click", '.deleteBtn', function (event) { 
        console.log(event.target)
        //closest li

        var listItem01 = $(event.target).closest("li.list-group-item");
        var id = listItem01.attr("id");

        listItem01.remove();
        console.log(id);
        $.ajax({
            url:URL + '/' + id,
            method:"DELETE"
        })
     });

     //Edit

     var editSource = $("#editTemplate").html();
     var editTempalte = Handlebars.compile(editSource);

     $listGroup.on("click", '.editBtn', function(event){
         event.preventDefault()
        //Access List Item
        var listItem01 = $(event.target).closest("li.list-group-item");

        // List Item Hide
        listItem01.find(".content").hide();

        // add content of list item
        var content = listItem01.find("span").html();
        console.log(content);

        // submit edit form
        var editHtml = editTempalte({
            value:content
        });

        listItem01.append(editHtml)

        var $editTodoFrom = listItem01.find("#editToDo");
        $editTodoFrom.on("submit", function(event){
            event.preventDefault();

            // replace new value with list tiem content
            var newContent =  $editTodoFrom.find("input").val();

            listItem01.find("span").html( newContent);

            // show list item
            listItem01.find(".content").show();
            $editTodoFrom.remove();

            var id = listItem01.attr("id");

            $.ajax({
                url: URL + "/" + id,
                method:"PUT",
                data:{
                    firstname:newContent
                }
            })
        })

     })
});