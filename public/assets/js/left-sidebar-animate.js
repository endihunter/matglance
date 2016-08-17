$(document).ready(function () {
    var menuHidden = true;
    $('.ti-menu').on('click', function () {
        if(menuHidden == true) {
            $('.user-box').animate({'margin-left': '0px'});
            $('#sidebar-menu').animate({'margin-left': '0px'});
            menuHidden = !menuHidden;
        } else {
            $('.user-box').animate({'margin-left': '-800px'});
            $('#sidebar-menu').animate({'margin-left': '-800px'});
            menuHidden = !menuHidden;
        }
    })
})