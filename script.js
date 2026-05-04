$(document).ready(function() {
    // ============================================
    // Preloader - FIX
    // ============================================
    function hidePreloader() {
        $('.preloader').addClass('hidden');
        $('body').removeClass('preload');
    }
    // Скрываем через 2 секунды максимум
    setTimeout(function() {
        hidePreloader();
    }, 2000);
    // Или когда всё загрузится
    $(window).on('load', function() {
        setTimeout(function() {
            hidePreloader();
        }, 500);
    });
    // ============================================
    // Navigation Scroll Effect
    // ============================================
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 100) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
    // ============================================
    // Smooth Scroll
    // ============================================
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
    // ============================================
    // Active Navigation Link
    // ============================================
    $(window).on('scroll', function() {
        var scrollPos = $(window).scrollTop() + 100;
        $('section').each(function() {
            var sectionTop = $(this).offset().top;
            var sectionBottom = sectionTop + $(this).outerHeight();
            var sectionId = $(this).attr('id');
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                $('.nav-link').removeClass('active');
                $('.nav-link[href="#' + sectionId + '"]').addClass('active');
            }
        });
    });
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    $('.hamburger').on('click', function() {
        $(this).toggleClass('active');
        $('.nav-menu').slideToggle(300);
    });
    // ============================================
    // Fleet Tabs
    // ============================================
    /*$('.fleet-tab').on('click', function() {
        var tabId = $(this).data('tab');
        $('.fleet-tab').removeClass('active');
        $(this).addClass('active');
        $('.fleet-item').removeClass('active');
        $('#' + tabId).addClass('active');
    });
    */
    // ============================================
    // Scroll Reveal Animation
    // ============================================
    function revealOnScroll() {
        $('.reveal').each(function() {
            var elementTop = $(this).offset().top;
            var windowBottom = $(window).scrollTop() + $(window).height();
            var revealPoint = elementTop - $(window).height() * 0.85;
            if (windowBottom > revealPoint) {
                $(this).addClass('active');
            }
        });
    }
    $(window).on('scroll', revealOnScroll);
    revealOnScroll();
    // ============================================
    // Form Submission
    // ============================================
    $('#bookingForm').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $submitBtn = $form.find('button[type="submit"]');
        var originalText = $submitBtn.html();
        var isValid = true;
        $form.find('[required]').each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        
        if (isValid) {
            $submitBtn.html('<span>Отправка...</span>');
            $submitBtn.prop('disabled', true);
            
            setTimeout(function() {
                alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                $form[0].reset();
                $submitBtn.html(originalText);
                $submitBtn.prop('disabled', false);
            }, 1500);
        }
    });
    
    // ============================================
    // Phone Input Mask
    // ============================================
    $('input[type="tel"]').on('input', function() {
        var value = this.value.replace(/\D/g, '');
        var formattedValue = '';
        
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            
            formattedValue = '+7';
            
            if (value.length > 0) {
                formattedValue += ' (' + value.substring(0, 3);
            }
            if (value.length >= 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length >= 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length >= 8) {
                formattedValue += '-' + value.substring(8, 10);
            }
        }
        
        this.value = formattedValue;
    });
    
});