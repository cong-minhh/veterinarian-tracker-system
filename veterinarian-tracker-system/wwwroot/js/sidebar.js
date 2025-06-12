$(".sidebar ul li").on('click', function () {
    $(".sidebar ul li.active").removeClass('active');
    $(this).addClass('active');
});

