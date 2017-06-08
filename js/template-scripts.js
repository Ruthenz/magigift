jQuery(document).ready(function ($) {

    // START - Handling carousel (switching photos in top of site)
    var theme_slider = $("#owl-demo");
    $("#owl-demo").owlCarousel({
        navigation: false,
        slideSpeed: 300,
        paginationSpeed: 400,
        autoPlay: 6000,
        addClassActive: true,
        // transitionStyle: "fade",
        singleItem: true
    });
    $("#owl-demo2").owlCarousel({
        slideSpeed: 300,
        autoPlay: true,
        navigation: true,
        navigationText: ["&#xf007", "&#xf006"],
        pagination: false,
        singleItem: true
    });

    // Custom Navigation Events
    $(".next-arrow").click(function () {
        theme_slider.trigger('owl.next');
    })
    $(".prev-arrow").click(function () {
        theme_slider.trigger('owl.prev');
    })

    // END - Handling carousel (switching photos in top of site)


    // START - click events inside the site
    var btnClick = $(".offset-fix").find("a");

    btnClick.click(function(e) {
        clickEventsFunction(e, this)
    });

    var clickEventsFunction = function (e, data) {
        var href = $(data).attr("href");

        // Reveal divs when href to their id
        if (href == "#find-gift") {

            var allDivsToHide = $(".hideAgain");

            for (var i = 0; i < allDivsToHide.length; i++) {
                $(allDivsToHide[i]).addClass("doNotShow");
                $(allDivsToHide[i]).removeClass("hideAgain");

            }
            $("#gender").removeClass("doNotShow");
        }
        else {
            $(href).removeClass("doNotShow")
            $(href).addClass("hideAgain")

            if (href == "#search-results") {
                generateSearchResults()
            }
        }

        // Fix the offset that created from the nav bar on all href to local id
        var offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;

        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 300);
        e.preventDefault();

    }
    // END - click events inside the site


    // START - click events on navigation bar and change active buttons on scrolling
    // One page navigation
    var     lastId;
    var     topMenu = $(".top-nav");
    var     topMenuHeight = topMenu.outerHeight() + 15;
    var     menuItems = topMenu.find("a");
    var     scrollItems = menuItems.map(function () {
            var item = $($(this).attr("href"));
            if (item.length) {
                return item;
            }
        });

    // Handling click on navigation bar button
    menuItems.click(function (e) {
        var href = $(this).attr("href");

        // Fix the offset that created from the nav bar on all href to local id
        var offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;

        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 300);
        e.preventDefault();
    });

    // Change active buttons on scrolling
    $(window).scroll(function () {
        var fromTop = $(this).scrollTop() + topMenuHeight;
        var cur = scrollItems.map(function () {
            if ($(this).offset().top < fromTop)
                return this;
        });
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            menuItems
                .parent().removeClass("active-item")
                .end().filter("[href=#" + id + "]").parent().addClass("active-item");
        }
    })

    // END - click events on navigation bar and change active buttons on scrolling


    // START - changing pictures to match gender clicked
    // In case male chose
    var maleClick = $(".gender-male").click(function () {

        $(".genderChange").each(function (index) {
            if (this.src.indexOf("female") != -1) {
                var maleSrc = this.src.replace("female", "male");
                this.src = maleSrc;
            }
        })
    })

    // In case female chose
    var femaleClick = $(".gender-female").click(function () {

        $(".genderChange").each(function (index) {
            if (this.src.indexOf("female") == -1) {
                var femaleSrc = this.src.replace("male", "female");
                this.src = femaleSrc;
            }
        })
    })
    // END - changing pictures to match gender clicked


    // START - inserting search results to html
    var generateSearchResults = function () {
        //
        // var winWidth = $( window ).width();
        // var winHeight = $( window ).height()
        // $(".modalWait").width(winWidth);
        // $(".modalWait").height(winHeight);
        // $(".modalWait").removeClass("doNotShow");
        // setTimeout(function(){
        //     // Copy to item results json array - for ajax later
        //     var itemResults = productsMale;
        //
        //     var productsHtml = "<h1 class='text-center white-color'>Our Results</h1>"
        //
        //     for (var i = 0; i < itemResults.length; i++) {
        //
        //         var description = itemResults[i].description;
        //         if (itemResults[i].description.length > 100) {
        //             description = itemResults[i].description.substring(0, 24) + "...";
        //         }
        //         var itemHtml =
        //             "<div class='line'>" +
        //             "   <div class='s-12 m-offset-1 m-10 l-offset-1 l-10'> <a href='" + itemResults[i].href + "'> " +
        //             "       <div class='line single-product'>" +
        //             "         <div class='s-offset-1 s-10 m-offset-1 m-10 l-3'>" +
        //             "           <img class='product-image' src='" + itemResults[i].image + "'>" +
        //             "         </div>" +
        //             "         <div class='s-offset-1 s-10 m-offset-1 m-10 l-7 product-description'>" +
        //             "             <h3 class='product-title'>" + itemResults[i].name + "</h3>" +
        //             "             <p>" + description + "</p>" +
        //             "         </div>" +
        //             "         <div class='s-offset-1 s-10 m-offset-1 m-10 l-2'>" +
        //             "            <span class='iconWrapper'>" +
        //             "                <span class='fa fa-money'></span>" +
        //             "                <span class='iconText'>" + itemResults[i].price + "</span>" +
        //             "            </span>" +
        //             "         </div>" +
        //             "      </div>" +
        //             "   </a> </div>" +
        //             "</div>"
        //
        //         productsHtml += itemHtml;
        //     }
        //
        //     productsHtml +=
        //     "<div class='line'>" +
        //     "   <h2 class='text-center'>Want to search another gift?</h2>" +
        //     "   <div class='s-12 m-4 l-2 center offset-fix'>" +
        //     "      <a class='white-btn' href='#find-gift'>click here</a>" +
        //     "   </div>" +
        //     "</div>";
        //
        //     $(".modalWait").addClass("doNotShow");
        //     $("#search-results").html(productsHtml);
        //
        //     var btnClick = $(".offset-fix").find("a");
        //
        //     btnClick.click(function(e) {
        //         clickEventsFunction(e, this)
        //     });
        // }, 500);

    }

    // Mock results
    var productsMale = [
        {
            name: "FIFA 17 Xbox One Full Digital Game CODE CARD FIFA 2017",
            description: "Football fans can enjoy a round of virtual football, create teams and score goals with the FIFA 17 Video Game. Its advanced game engine gives you an immersive, responsive and realistic football experience. This game can be played on the Microsoft Xbox One and provides exciting challenges and hours of fun. Based on its content, this Electronic Arts video game belongs to the sports genre. The game may be played in single player mode and with others locally or online. This game has been released in 2016.",
            image: "img/products/a.jpg",
            price: "$47.90",
            href: "http://www.ebay.com/itm/FIFA-17-Xbox-One-Full-Digital-Game-CODE-CARD-FIFA-2017-/122272731388?hash=item1c7805d0fc:g:2DQAAOSwa~BYVU~j "
        },
        {
            name: "NBA 2K17 Standard Edition - Xbox One - BRAND NEW & SEALED",
            description: "NBA 2K17 Early Tip-Off Weekend is a game for the Xbox One. NBA 2K17 is one of the biggest names in video game basketball. With this edition it returns for more hard-court action with updated modes, expanded gameplay, and improved tutorials in NBA 2K17. Gamers can once again customize a young player and guide him from college to NBA superstardom in the story-driven MyCareer mode, improving their attributes as they play, and potentially even making the Olympic team. The single-player MyGM mode and its online multiplayer counterpart MyLeague both return to let gamers manage every aspect of their franchise, and 2K17 adds new expansion options for leagues of up to 36 teams.",
            image: "img/products/b.jpg",
            price: "$24.50",
            href: "http://www.ebay.com/itm/NBA-2K17-Standard-Edition-Xbox-One-BRAND-NEW-SEALED-/162495293648?hash=item25d57968d0:g:sDIAAOSwUKxYgWM9"
        },
        {
            name: "Wii Sports Resort (Nintendo Wii, 2009)",
            description: "Product Information Fling a Frisbee through the air and then try to hit the bullseye in archery. Follow it up with a perfect strike in bowling and then engage in some swordplay. Do all of this and more from the comfort of home with Wii Sports Resort, the only resort where the sun is always shining and sports are always available. It will feel just like you are in the middle of the sunshine thanks to immersive motion controls that put you right in the middle of the action. Take on the different challenges on your own or play with friends in this 1-4 player game.",
            image: "img/products/c.jpg",
            price: "$34.00",
            href: "http://www.ebay.com/itm/Wii-Sports-Resort-Nintendo-Wii-2009-/122476987922?hash=item1c84328612:g:Fk4AAOxyVaBSpwjL"
        },
        {
            name: "Skate 3 Xbox 360 Skating Game Brand New Sealed Free Shipping Skateboarding",
            description: "Skate 3 for the Xbox 360 picks up right where Skate 2 left off. After having become the top skater in San Vanelona, your character proceeds to Port Carverton to continue being the champion. However, what he finds shocks him as this new city is the complete opposite in terms of culture. Your character lets his ego get the best of him and goes for a jump that no one else has successfully nailed. Unfortunately, your character botches this jump and becomes the laughing stock of the city. Fueled by his desire to be the greatest skating mogul, you vow to conquer this new city. Your goal in Skate 3 is to assemble a team of the best skaters in the city and to prove your superiority.",
            image: "img/products/d.jpg",
            price: "$17.45",
            href: "http://www.ebay.com/itm/Skate-3-Xbox-360-Skating-Game-Brand-New-Sealed-Free-Shipping-Skateboarding-/322504135151?hash=item4b16be91ef:g:xqUAAOSwX61ZCnKr"
        },
        {
            name: "VIRTUA TENNIS 4 ~ PS3 (in Great Condition)",
            description: "Virtua Tennis 4 with the PlayStation Move is more than just hitting the ball; it s about the angle of the racquet, the spin and speed of the ball and the power of the shot. The advanced motion sensors of PlayStation Move precisely track both the fast and subtle movements of the controller allowing for pinpoint accurate shots as players improve their racquet skills. Virtua Tennis 4 will also support 3D technology delivering unprecedented realism to the tennis experience, bringing you closer than ever to being out on the court.",
            image: "img/products/e.jpg",
            price: "$5.95",
            href: "http://www.ebay.com/itm/VIRTUA-TENNIS-4-PS3-in-Great-Condition-/181025284793?hash=item2a25f2a2b9:g:vRYAAOSwNSxVe2yF"
        }
    ]

    // END - inserting search results to html
});