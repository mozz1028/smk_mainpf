$(function () {
    $(".close").stop().click(function () {
        $(".click").hide();
    });
    $(".click").stop().click(function () {
        $(".click").hide();
    });


    $(".hover").hover(function () {
        $(".clickme").stop().fadeIn();
        $(this).stop().animate({
            opacity: 0.8
        }, )
    }, function () {
        $(".clickme").stop().fadeOut();
        $(this).stop().animate({
            opacity: 0.2
        })
    });


    $(function () {
        $(".clickme").click(function () {
            $(this).parents(".item-image").next(".click").stop().fadeIn();
        })
    })



})