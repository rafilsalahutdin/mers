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
    // ЯКОРЯ (только same-page, безопасно)
    // ============================================
    $('a[href^="#"]').on('click', function(e) {
        var $target = $(this.hash);
        if ($target.length) {
            e.preventDefault();
            $('html, body').stop().animate({ scrollTop: $target.offset().top - 80 }, 800);
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
    // МОБИЛЬНОЕ МЕНЮ
    // ============================================
    const $mobileMenu = $('#mobileMenu');
    const $mobileOverlay = $('#mobileOverlay');
    $('.hamburger').on('click', function(e) {
        e.stopPropagation();
        $mobileMenu.addClass('active');
        $mobileOverlay.addClass('active');
        $('body').css('overflow', 'hidden');
    });
    function closeMobileMenu() {
        $mobileMenu.removeClass('active');
        $mobileOverlay.removeClass('active');
        if (!$('#bookingModal').hasClass('active')) $('body').css('overflow', '');
    }
    $mobileOverlay.on('click', closeMobileMenu);
    $('.mobile-close').on('click', closeMobileMenu);
    $('#mobileMenu a').on('click', closeMobileMenu);
    $(document).on('keydown', function (e) { if (e.key === 'Escape') closeMobileMenu(); });

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
    // МОДАЛЬНОЕ ОКНО
    // ============================================
    const $modal = $('#bookingModal');

    $(document).on('click', '.modal-trigger', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Не даём меню/якорям перехватить
        $modal.addClass('active');
        $('body').css('overflow', 'hidden');
    });

    function closeModal() {
        $modal.removeClass('active');
        if (!$mobileMenu.hasClass('active')) $('body').css('overflow', '');
    }

    $modal.find('.modal-close, .modal-overlay').on('click', closeModal);
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $modal.hasClass('active')) closeModal();
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
    // ОТПРАВКА ФОРМЫ (независимая)
    // ============================================
    $(document).on('submit', '#bookingForm', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Блокируем всплытие к глобальным обработчикам

        var $form = $(this);
        var $btn = $form.find('button[type="submit"]');
        var originalText = $btn.html();

        $btn.html('<span>Отправка...</span>').prop('disabled', true);

        $.ajax({
            url: 'mail.php',
            type: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            timeout: 15000,
            success: function(res) {
                if (res.success) {
                    alert('✅ Спасибо! Мы свяжемся с вами в ближайшее время.');
                    $form[0].reset();
                    closeModal();
                } else {
                    alert('️ ' + (res.message || 'Ошибка валидации'));
                }
            },
            error: function() {
                alert('❌ Ошибка соединения. Проверьте еще раз введенные Вами данные или позвоните по телефону, указанныму на сайте.');
            },
            complete: function() {
                $btn.html(originalText).prop('disabled', false);
            }
        });
    });

});