$(document).ready(function () {
    var menuHidden = true;
    $('.ti-menu').on('click', function () {
        if(menuHidden == true) {
            // $('.user-box').animate({'margin-left': '0px'});
            // $('#sidebar-menu').animate({'margin-left': '0px'});
            $('.topbar .topbar-left').animate({'margin-left': '0px'}, 200);
            $('.side-menu').animate({'margin-left': '0px'}, 200);
            $('.content-page').animate({'margin-left': '250px'}, 200);
            menuHidden = !menuHidden;
        } else {
            // $('.user-box').animate({'margin-left': '-800px'});
            // $('#sidebar-menu').animate({'margin-left': '-800px'});
            $('.topbar .topbar-left').animate({'margin-left': '-210px'}, 200);
            $('.side-menu').animate({'margin-left': '-210px'}, 200);
            $('.content-page').animate({'margin-left': '40px'}, 200);
            menuHidden = !menuHidden;
        }
    })
})