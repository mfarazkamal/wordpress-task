let vw = jQuery(window).width();
gsap.ticker.lagSmoothing(false);
jQuery(function() {
    //Navigation hide on scroll
    var didScroll;
    var lastScrollTop = 0;
    var navbarHeight = jQuery('header').outerHeight();
    var sub_nav_el = jQuery('.sub-nav-sticky');
    if(sub_nav_el.length){
        var sub_nav_ot = sub_nav_el.offset().top;
    }
    jQuery(window).scroll(function(event) {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = jQuery(this).scrollTop();
        if(st > navbarHeight){
          jQuery('header').addClass('solid');
        }
        else{
          jQuery('header').removeClass('solid');
        }

        if(st > 100){
            jQuery('.sticky-cta-bottom').addClass('up');
        }
        else{
            jQuery('.sticky-cta-bottom').removeClass('up');
        }

        if (st > lastScrollTop && st > navbarHeight) {
            jQuery('header').addClass('up');
            if(sub_nav_el.length){
                jQuery('.sub-nav-sticky .bind').removeClass('pull-down');
            }
        } else {
            if (st + jQuery(window).height() < jQuery(document).height()) {
                jQuery('header').removeClass('up');
                if(sub_nav_el.length){
                    jQuery('.sub-nav-sticky .bind').addClass('pull-down');
                }
            }
        }
        if(sub_nav_el.length){
            if(st > sub_nav_ot){
                jQuery('.sub-nav-sticky .bind').addClass('sticky');
            }
            else{
                jQuery('.sub-nav-sticky .bind').removeClass('sticky');
            }
        }

        lastScrollTop = st;
    }

    //Mute philosophy video
    jQuery('.muted-video-wrapper .mute-icon').on('click', function(){
        let _vid_elem = jQuery(".muted-video-wrapper video");
        if(_vid_elem.prop('muted')) {
            jQuery(this).addClass('active');
            _vid_elem.prop('muted', false);
        } else {
            jQuery(this).removeClass('active');
            _vid_elem.prop('muted', true);
        }
    });

    //search icon script
    jQuery('.nav-wrap .search-icon button').on('click', function(){
        jQuery(this).parent().toggleClass('active');
        jQuery('.nav-wrap .search-icon .search-input').focus();
    });

    //nav trigger
    var navOpnFlg = 0, navOpnFlgOnce = 0;
    jQuery(".hamburger").on('click', function () {
        if (navOpnFlg == 0) {
            TweenMax.to(jQuery(this).find('li:eq(0)'), 0.3, { rotation: -45, y: 6 });
            TweenMax.to(jQuery(this).find('li:eq(1)'), 0.3, { opacity: 0, x: 0 });
            TweenMax.to(jQuery(this).find('li:eq(2)'), 0.3, { rotation: 45, y: -6 });
            TweenMax.to(jQuery('.hamburger-open-menu'), 0.8, { y: 0, opacity:1, ease: "power3.inOut", onComplete:function(){
                jQuery('header').addClass('solid no-shadow');
            } });
            jQuery('body').addClass('lock-scroll');
            navOpnFlg = 1;
            navOpnFlgOnce = 1;
        } else {
            jQuery('header').removeClass('solid no-shadow');
            TweenMax.to(jQuery(this).find('li:eq(0)'), 0.3, { rotation: 0, y: 0 });
            TweenMax.to(jQuery(this).find('li:eq(1)'), 0.3, { opacity: 1, x: 0 });
            TweenMax.to(jQuery(this).find('li:eq(2)'), 0.3, { rotation: 0, y: 0 });
            TweenMax.to(jQuery('.hamburger-open-menu'), 0.8, { y: "-100%", opacity:0, ease: "power3.inOut"});
            jQuery('body').removeClass('lock-scroll');
            navOpnFlg = 0;
            navOpnFlgOnce = 0;
            jQuery('.hamburger-open-menu .selector-line, .hamburger-open-menu .selector-line path').removeAttr('style');
        }
    });

    //Nav hover animate svg
    jQuery('.hamburger-open-menu nav > ul > li > a').on('mouseover', function(){
        let _curr_top = jQuery(this).offset().top, _curr_left = jQuery(this).offset().left, _ww = jQuery(window).width(), _static_offset = 20;
        if(jQuery(this).hasClass('sub-link')){
            _static_offset = 50;
        }
        jQuery('.hamburger-open-menu .selector-line').css({'top': _curr_top + 20 +'px', 'right': _ww - _curr_left - _static_offset +'px'});
        if(navOpnFlgOnce){
            gsap.from(jQuery('.hamburger-open-menu .selector-line path'), 1, {drawSVG:0, autoAlpha:true, duration:1});
            navOpnFlgOnce = 0;
        }
    });
    jQuery('.hamburger-open-menu nav > ul > li > a').on('click',function(){
        jQuery(this).parent().find("ul").slideToggle();
        jQuery(this).parent().siblings('li').find("ul:visible").slideUp();
    });

    //Project homepage filter
    var $home_project_slider = jQuery('.home-project-slider .slider-wrap').flickity({
        contain: true, 
        arrowShape: "m49.85,97.8l8.79-8.62L23.87,55.01h75.83v-12.23H23.87L58.64,8.62,49.85,0,0,48.9l49.85,48.9Z",
        pauseAutoPlayOnHover: false,
        imagesLoaded: true,
        groupCells: true
      });
    jQuery('.home-project-slider .tab-head a').on('click', function(){
        let _curr_category = jQuery(this).data('category');
        if(_curr_category !== 'all'){
            jQuery('.home-project-slider .slider-wrap .slides').hide();
            jQuery('.home-project-slider .slider-wrap .slides.'+_curr_category).show();
        }
        else{
            jQuery('.home-project-slider .slider-wrap .slides').show();
        }
        $home_project_slider.flickity('reposition');
        jQuery('.home-project-slider .tab-head a').removeClass('active');
        jQuery(this).addClass('active');
    });
    

    //Artpage popup
    if(jQuery('.art-popup').length){
        let $grid_art = jQuery('.art-popup .grid').packery({
            itemSelector: '.grid-item',
            gutter: 8
        });
        jQuery('.art-popup .expand-image').on('click', function(){
            jQuery('.art-popup .wrap .right-item .image').toggleClass('expand');
            jQuery('.art-popup .wrap .right-item .description').toggle();
            // jQuery('.art-popup .wrap .right-item .image').hasClass('expand') == true ? jQuery(this).html('Scale down Image') : jQuery(this).html('Expand Image');  
        });

        openArtGalleryPopup = function(obj){
            jQuery('.art-popup').show();
            jQuery('body').addClass('lock-scroll');
            $grid_art.imagesLoaded().progress( function() {
                $grid_art.packery();
            });
            jQuery('.art-popup .wrap .right-item .content-wrap').hide();
            jQuery('.art-popup .wrap .right-item .content-wrap.content-'+obj).show();
            jQuery('.art-popup .wrap .right-item .image').removeClass('expand');
            jQuery('.art-popup .wrap .right-item .description').show();
            // jQuery('.art-popup .expand-image').html('Expand Image');
        }
        jQuery('.art-popup .close').on('click', function(){
            jQuery('.art-popup').hide();
            jQuery('body').removeClass('lock-scroll');
        });
    }

    //Project detail page map 
    jQuery('.location-map .slides').on('click', function(){
        let _get_map_url = jQuery(this).data('map');
        jQuery('.location-map .map-wrapper .map iframe').attr('src', _get_map_url);
    });

    var $project_map_slider = jQuery('.map-wrapper .image-slider').flickity({
        contain: true, 
        pauseAutoPlayOnHover: false, 
        imagesLoaded: true, 
        prevNextButtons: false, 
        pageDots: false
      });
    $project_map_slider.on( 'staticClick.flickity', function( event, pointer, cellElement, cellIndex ) {
        if ( typeof cellIndex == 'number' ) {
            $project_map_slider.flickity( 'select', cellIndex );
          }
    });

    //accordion js

    // if(jQuery('.accordion-container').length){

    // const accSingleTriggers = document.querySelectorAll('.js-acc-single-trigger');

    // accSingleTriggers.forEach(trigger => trigger.addEventListener('click', toggleAccordion));

    // function toggleAccordion() {
    //     const items = document.querySelectorAll('.js-acc-item');
    //     const thisItem = this.parentNode;

    //     items.forEach(item => {
    //         if (thisItem == item) {
    //             thisItem.classList.toggle('is-open');
    //             return;
    //         }
    //         item.classList.remove('is-open');
    //     });
    // }
    // }
    if(jQuery('.leadership-team-cards-holder').length){
        jQuery('.leadership-team-cards-holder .cards-wrapper ul li').on('click', function(){
            jQuery(this).toggleClass('active');
        });
    }

    //Loader animation
    const logo_anim = gsap.timeline();
    logo_anim.to(jQuery(".site-loader-animation .fill"), 1.3, { height: "99%" })
    .to(jQuery(".site-loader-animation .blue img"), 0.7, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" })
    .addLabel("blueGreenSpin")
    .to(jQuery(".site-loader-animation .left"), 0.7, { left: 0, xPercent:0,ease: "power4.out" }, "blueGreenSpin+=0.2")
    .to(jQuery(".site-loader-animation .right"), 0.7, { scale: 1, autoAlpha:1,ease: "power4.out", onComplete:function(){
        setTimeout(() => {
            jQuery(".site-loader-animation").fadeOut();
        }, 800);
    }}, "blueGreenSpin+=0.4");

    //Homepage video testimonial
    // var $testimonial_slider = jQuery('.testimonial-slider').flickity({
    //     cellAlign: "left",
    //     contain: true, 
    //     prevNextButtons: false,
    //     groupCells: true,
    //     watchCSS: true
    // });
    // jQuery('.excerpt, .fulltext').on('click', function(){
    //     $testimonial_slider.flickity('resize');
    // });
    jQuery('.testimonial-slider a').on('click', function(e){
        e.preventDefault();
        let _curr_url = jQuery(this).attr('href'), _curr_img = jQuery(this).data('img');
        if(!jQuery(this).hasClass('playing')){
            jQuery(this).parent().parent().parent().find('video').each(function() {
                jQuery('.video-icon, .testimonial-slider a').removeClass('playing');
                jQuery(this).get(0).pause();
                jQuery('.testimonial-slider .lity-click').addClass('hidden');
            });
            jQuery(this).parent().find('.img').html('<video autoplay><source src="'+_curr_url+'" type="video/mp4"></video>');
        }
        else{
            jQuery(this).parent().find('.img').html('<img src="'+_curr_img+'" alt="">');
        }
        jQuery(this).parent().parent().find('.hidden').toggle();
        jQuery(this).parent().find('.video-icon').toggleClass('playing');
        jQuery(this).toggleClass('playing');
    });
    jQuery('.testimonial-slider .hidden').on('click', function(e){
        jQuery('.testimonial-slider video').each(function() {
            jQuery('.video-icon, .testimonial-slider a').removeClass('playing');
            jQuery(this).get(0).pause();
            jQuery('.testimonial-slider .lity-click').addClass('hidden');
        });
    });
    var $home_testimonial_slider = jQuery('.home-testimonial .testimonial-slider').flickity({
        cellAlign: "center", 
        contain: true, 
        watchCSS: true, 
        prevNextButtons: false,
        imagesLoaded: true
    });
    jQuery('.testimonial-slider .description').on('click', function(e){
        jQuery(this).toggleClass('show-text');
        // if(vw<989){
            setTimeout(() => {
                $home_testimonial_slider.flickity( 'resize');
            }, 200);
        // }
    });

    


    //Accordion script 
    jQuery(".accr-wrap .head").click(function(){
        let _this = jQuery(this);
		jQuery(this).next(".content").slideToggle(600, function(){
            let _curr_offset = _this.offset().top - jQuery('header').innerHeight();
            jQuery('html, body').animate({
              scrollTop: _curr_offset
            }, 500);
          }).siblings(".content:visible").slideUp();
		jQuery(this).toggleClass("active");
        jQuery(this).siblings(".head").removeClass("active");
	});
    //Sustainability card flip animation
    gsap.set(jQuery(".sustainability-gallery-slider-wrap .slides .wrap .back"), {rotationX:180});
    jQuery(document).on("mouseenter", '.sustainability-gallery-slider-wrap .slides.is-selected .wrap', function() {
        gsap.to(jQuery(this).find('.front, .title'),0.5, {rotationX:-180});
        gsap.to(jQuery(this).find('.back'),0.5, {rotationX:0}, 0);
    });
    jQuery(document).on("mouseleave", '.sustainability-gallery-slider-wrap .slides.is-selected .wrap', function() {
        gsap.to(jQuery(this).find('.front, .title'),0.5, {rotationX:0});
        gsap.to(jQuery(this).find('.back'),0.5, {rotationX:180}, 0);
    });

    //Fancybox
    jQuery('[data-fancybox]').fancybox({
        infobar: false,
        hash: false,
        buttons: [
            "close"
        ],
        caption : function( instance, item ) {
            let caption = jQuery(this).data('caption') || '';
            let caption_array = caption.split('|');
            let caption_array_desc = caption_array[1]?caption_array[1]:'';
            return ( caption.length ? '<strong>'+caption_array[0] + '</strong><p>'+caption_array_desc+'</p>' : '' );
        }
    });

    //News and media homepage
    var $news_and_media_slider = jQuery('.news-grid-wrap').flickity({
        cellAlign: "left", 
        contain: true, 
        prevNextButtons: false, 
        adaptiveHeight: true, 
        pageDots: true,
        imagesLoaded: true,
        autoPlay: 3000
      });
    jQuery('.home-news-and-media .news-grid-thumb-wrap .slides').on('click', function(){
        let _curr_index = jQuery(this).index();
        $news_and_media_slider.flickity( 'select', _curr_index );
    });

    //News and media page tab filter
    jQuery('.news-media-tabs-container .tabs-wrap .tab-head ul li a').on('click', function(){
        let _curr_category = jQuery(this).data('category');
        jQuery('.news-media-tabs-container .tabs-wrap .tab-head ul li a').removeClass('active');
        jQuery(this).addClass('active');
        jQuery('.news-media-tabs-container .tabs-wrap .article-cards .cards').hide();
        jQuery('.news-media-tabs-container .tabs-wrap .article-cards .cards.'+_curr_category).show();
    });

    //Typology dropdown script
    let typology_slider = jQuery('.typology-slider').flickity({
        contain: true, 
        wrapAround: true, 
        prevNextButtons: false, 
        autoPlay: 5000, 
        pageDots: true,
        imagesLoaded: true
    });
    jQuery('.typology-wrap .input-wrap .form-select').on('change', function(){
        let curr_index = parseInt(jQuery(this).prop('selectedIndex'))-1;
        typology_slider.flickity('select', curr_index);
    });

    //Investor page show hide from select input
    jQuery('.downloads-block select').on('change', function(){
        let _curr_select = jQuery(this).val();
        let _curr_class = jQuery(this).attr('class');
        jQuery('.row.'+_curr_class).addClass('no-display');
        jQuery('.row.'+_curr_class+'#'+_curr_select).removeClass('no-display');
    });

    //Query string update for Investor page
    //get query string from url
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let parent = params.acc, child = params.sub; 
    if(parent == 'disclosures' && child == 'financial_information'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_financial_information').trigger('click');
        });
    }
    else if(parent == 'disclosures' && child == 'shareholding_pattern'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_shareholding_pattern').trigger('click');            
        });
    }else if(parent == 'disclosures' && child == 'schedule_of_analysts'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_schedule_of_analysts').trigger('click');
        });
    }else if(parent == 'disclosures' && child == 'presentation_and_audio'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_presentation_and_audio').trigger('click');
        });
    }else if(parent == 'disclosures' && child == 'items_in_reg_47'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_items_in_reg_47').trigger('click');
        });
    }else if(parent == 'disclosures' && child == 'credit_ratings'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_credit_ratings').trigger('click');
        });
    }else if(parent == 'disclosures' && child == 'audited_financial_results'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_audited_financial_results').trigger('click');
        });
    }else if(parent == 'disclosures' && child == 'disclosure_under_30_8'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_disclosure_under_30_8').trigger('click');
        });
    }else if(parent == 'disclosures' && child == 'annual_return_as_provided'){
        jQuery('#acc_disclosures').trigger('click');
        setTimeout(() => {
            jQuery('#acc_annual_return_as_provided').trigger('click');
        });
    }
    
    function selectDefault() {
        const paths = window.location.pathname.split('/');
        const url = paths[paths.length - 1];
        if (url === 'luxury-apartments-estate-360') {
            jQuery('select[name="position"]').val('Residences at Estate 360');
        }
    
        if (url === 'senior-living-residences') {
            jQuery('select[name="position"]').val('Senior Living Residences at Estate 360');
        }
    
        if (url === 'antara') {
            jQuery('select[name="position"] option[value="Residences at Estate 360"]').css('display', 'none');
            jQuery('select[name="position"]').val('Senior Living Residences at Estate 360');
        }
    }
    
    selectDefault();

    //Download brochure on Estate 360 pages
    let _curr_download_link = jQuery('.download-brochure-360').data('brochure');
    jQuery('.download-brochure-360').on('click', function(){
        if(jQuery('.download-brochure-360').attr('href') == 'javascript:;'){
            jQuery('#lead-form').modal('show');
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?db=true';
                window.history.pushState({path:newurl},'',newurl);
            }
        }
    });
    document.addEventListener( 'wpcf7submit', function(event) {
        const urlParams = new URLSearchParams(window.location.search);
        const dbParams = urlParams.get('db');
        if ( event.detail.contactFormId == '3306' || event.detail.contactFormId == '3307' ) {
            if(_curr_download_link){
                jQuery('.download-brochure-360').attr({'href':_curr_download_link, 'target':'_blank', 'download':'estate-360-brochure'});
            }
            if(dbParams){
                if(event.detail.status == 'mail_sent'){
                    jQuery('.download-brochure-360').click(function() {
                        this.click();
                    }).click();
                }
            }
        }
    }, false );
});

(function() {
    function getQueryParams() {
        var params = {};
        var queryString = window.location.search.substring(1);
        var regex = /([^&=]+)=([^&]*)/g;
        var match;
        while (match = regex.exec(queryString)) {
            params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
        }
        return params;
    }

    const paths = window.location.pathname.split('/');
    const url = paths[paths.length - 1];
    var webSourceField = document.querySelector('input[name="web_source"]');
    if (webSourceField && url) {
        webSourceField.value = url;
    }
    
    if (url === 'antara-senior-living-residences') {
        jQuery('select[name="position"]').val('Senior Living Residences at Estate 360');
    }
    
    var params = getQueryParams();
    if (params.utm_source || params.utm_medium || params.utm_campaign) {
        document.addEventListener("DOMContentLoaded", function() {
            var utmSourceField = document.querySelector('input[name="utm_source"]');
            var utmMediumField = document.querySelector('input[name="utm_medium"]');
            var utmCampaignField = document.querySelector('input[name="utm_campaign"]');
            

            if (utmSourceField && params.utm_source) {
                utmSourceField.value = params.utm_source;
            }
            if (utmMediumField && params.utm_medium) {
                utmMediumField.value = params.utm_medium;
            }
            if (utmCampaignField && params.utm_campaign) {
                utmCampaignField.value = params.utm_campaign;
            }
        });
    }
})();