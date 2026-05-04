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

    // Открытие модального окна
    $(document).on('click', '.modal-trigger', function(e) {
        e.preventDefault(); // Чтобы ссылки не прыгали
        $('#bookingModal').addClass('active');
        $('body').css('overflow', 'hidden'); // Блокируем прокрутку фона
    });

    // Закрытие по крестику и оверлею
    $('.modal-close, .modal-overlay').on('click', function() {
        $('#bookingModal').removeClass('active');
        $('body').css('overflow', ''); // Возвращаем прокрутку
    });

    // Закрытие по Esc
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('#bookingModal').removeClass('active');
            $('body').css('overflow', '');
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
// ============================================
// Form Submission (AJAX to mail.php)
    // ============================================
    $('#bookingForm').on('submit', function(e) {
    e.preventDefault();
    
    var $form = $(this);
    var $submitBtn = $form.find('button[type="submit"]');
    var originalText = $submitBtn.html();
    
    // Простая валидация
    var name = $form.find('[name="name"]').val().trim();
    var phone = $form.find('[name="phone"]').val().trim();
    
    if (name.length < 2) {
        alert('Введите корректное имя');
        return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
        alert('Введите корректный телефон');
        return;
    }
    
    $submitBtn.html('<span>Отправка...</span>').prop('disabled', true);
    
    $.ajax({
        url: 'mail.php',
        type: 'POST',
        data: $form.serialize(),  // ✅ Исправлено: добавлено "data:"
        dataType: 'json',
        timeout: 10000,
        success: function(response) {
            if (response.success) {
                alert('✅ Спасибо! Мы свяжемся с вами в ближайшее время.');
                $form[0].reset();
                $('#bookingModal').removeClass('active');
                $('body').css('overflow', '');
            } else {
                console.log('Server errors:', response);
                alert('⚠️ ' + (response.message || 'Ошибка отправки'));
            }
        },
        error: function(xhr, status, error) {
            console.log('AJAX Error:', { status, error, response: xhr.responseText });
            //alert('❌ Ошибка: ' + (xhr.responseJSON?.message || 'Проверьте консоль'));
            alert('❌ Ошибка соединения. Попробуйте позвонить по телефонам, указанным на сайте');
        },
        complete: function() {
            $submitBtn.html(originalText).prop('disabled', false);
        }
    });
});

});