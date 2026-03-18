$(document).ready(function () {
    let currentStep = 1;
    const totalSteps = 4;
    let selectedMeals = 0;
    let selectedDate = "";
    let cart = [];
    const BASE_PRICE = 14.00;

    generateDeliveryDates();

    // --- STEP 1: Plan Selection ---
    $(document).on('click', '.section-1-card', function () {
        $('.section-1-card').removeClass('active-selection');
        $(this).addClass('active-selection');
        const mealsValue = $(this).data('meals');
        if (mealsValue) {
            selectedMeals = parseInt(mealsValue);
            document.getElementById('s-3-meals').innerHTML = selectedMeals;
            $('#meal-warning').addClass('d-none');
            cart = [];
            renderCart();
        }
    });

    // --- Date Generation ---
    function generateDeliveryDates() {
        const container = $('#date-list');
        if (!container.length) return;
        container.empty();
        let today = new Date();
        let nextMonday = new Date();
        let daysUntilMonday = (1 - today.getDay() + 7) % 7;
        if (daysUntilMonday === 0) daysUntilMonday = 7;
        nextMonday.setDate(today.getDate() + daysUntilMonday);
        for (let i = 0; i < 14; i++) {
            let dateToPrint = new Date(nextMonday);
            dateToPrint.setDate(nextMonday.getDate() + i);
            const dayName = dateToPrint.toLocaleString('default', { weekday: 'long' });
            const monthShort = dateToPrint.toLocaleString('default', { month: 'short' });
            const dayNum = dateToPrint.getDate();
            const displayString = `${dayName}, ${monthShort} ${dayNum}`;
            let popularBadge = (i === 0) ? `<span class="popular-badge"><i class="fa-regular fa-star"></i> Most Popular</span>` : "";
            if (i === 0) document.getElementById("first-delivery-date").innerHTML = displayString;
            container.append(`<div class="date-entry" data-date="${displayString}"><p class="date-text"><span class="date-day">${dayName}</span>, <span class="date-val">${monthShort} ${dayNum}</span></p>${popularBadge}</div>`);
        }
    }

    $(document).on('click', '.date-entry', function () {
        $('.date-entry').removeClass('active-date');
        $(this).addClass('active-date');
        selectedDate = $(this).data('date');
        document.getElementById("section-3-delivery-date").innerHTML = selectedDate;
        document.getElementById('dev-date').innerHTML = selectedDate;
        $('#date-warning').addClass('d-none');
    });

    // --- STEP 3: Cart Logic ---
    $(document).on('click', '.section-3-button', function () {
        if (selectedMeals === 0) return;


        const card = $(this).closest('.section-3-card-border');
        const mealName = card.find('.section-3-meal-name p').text().trim();
        const imgSrc = card.find('.section-3-card-image').attr('src');
        const mealNameDes = card.find('.section-3-meal-description p').text().trim();

        const isSpecial = card.hasClass('special-card');

        let finalPrice = BASE_PRICE;
        let addOnPriceText = "";
        const addOnElem = card.find('.special-card-addon');
        if (addOnElem.length) {
            addOnPriceText = addOnElem.text().trim();
            finalPrice += parseFloat(addOnPriceText.replace(/[^0-9.]/g, ''));
        }

        cart.push({
            id: Date.now() + Math.random(),
            name: mealName,
            img: imgSrc,
            price: finalPrice,
            isSpecial: isSpecial,
            addOnText: addOnPriceText,
            description: mealNameDes
        });
        renderCart();
    });

    $(document).on('click', '.plus-button', function () {
            const name = $(this).data('name');
            const img = $(this).data('img');
            const price = parseFloat($(this).data('price'));
            const isSpecial = $(this).data('special');
            const addOnText = $(this).data('addontext');

            cart.push({
                id: Date.now() + Math.random(),
                name: name,
                img: img,
                price: price,
                isSpecial: isSpecial,
                addOnText: addOnText
            });
            renderCart();
        
    });

    $(document).on('click', '.minus-button', function () {
        const idToRemove = $(this).data('id');
        const idx = cart.findIndex(i => i.id === idToRemove);
        if (idx > -1) {
            cart.splice(idx, 1);
            renderCart();
        }
    });

    function renderCart() {
        const container = $('.added-items-container');
        container.empty();


        if (cart.length === 0) {
            document.getElementById('s-3-subtotal').innerHTML = "0.00";
            document.getElementById('pill-total-number').innerHTML = 0;
            updateFooterMessages(0);
            return;
        }

        let baseSubtotal = 0;
        let addonSubtotal = 0;

        cart.forEach(item => {
            baseSubtotal += BASE_PRICE;
            addonSubtotal += (item.price - BASE_PRICE);

            const extraClass = item.isSpecial ? "s-3-added-special" : "";
            const imageBadge = item.isSpecial ? `<span class="special-card-addon" style="font-size: 10px; top: auto; bottom: 5px; left: 18px; right: auto; width: 68%">${item.addOnText}</span>` : "";

            container.append(`
            <div class="s-3-added ${extraClass} mb-2">
                <div class="row">
                    <div class="col-3 s-3-img-container position-relative">
                        ${imageBadge}
                        <img src="${item.img}" alt="meal" class="s-3-img">
                    </div>
                    <div class="col-7 section-3-meal-name d-flex ps-lg-4 align-items-center">
                        <p class="ps-3 mb-0">${item.name}</p>
                    </div>
                    <div class="col-2">
                        <div class="row">
                            <button class="btn dark-gray plus-button pad-0" 
                                data-name="${item.name}" 
                                data-img="${item.img}" 
                                data-price="${item.price}"
                                data-special="${item.isSpecial}"
                                data-addontext="${item.addOnText}">+</button>
                        </div>
                        <div class="row mt-1">
                            <button class="btn dark-gray minus-button pad-0" data-id="${item.id}">-</button>
                        </div>
                    </div>
                </div>
            </div>`);
        });

        const mealLabel = cart.length === 1 ? "Meal" : "Meals";
        const priceDisplay = addonSubtotal > 0
            ? `$${baseSubtotal.toFixed(2)} + $${addonSubtotal.toFixed(2)}`
            : `$${baseSubtotal.toFixed(2)}`;

        const grandTotal = baseSubtotal + addonSubtotal;

        container.append(`
        <div class="s-3-order-summary mt-5 d-none d-lg-block">
            <span class="fw-bold">Order Summary</span>
        </div>
        <div class="d-none d-lg-flex justify-content-between mt-2">
            <span class="font-14"><span>${cart.length}</span> ${mealLabel}</span>
            <span class="font-14"> ${priceDisplay}</span>
        </div>
        <div class="d-none d-lg-flex justify-content-between mt-2">
            <span class="font-14"> Subtotal</span>
            <span class="font-14 fw-bold"> $${grandTotal.toFixed(2)}</span>
        </div>
        <p class="text-center font-12 mt-3 text-muted d-none d-lg-block">Tax and shipping calculated at checkout</p>
    `);

        document.getElementById('s-3-subtotal').innerHTML = grandTotal.toFixed(2);
        document.getElementById('pill-total-number').innerHTML = cart.length;
        document.getElementById('s-4-meal-price').innerHTML = grandTotal.toFixed(2);
        const finalGrandTotal = grandTotal + 10.99 + 8.99;
        document.getElementById('s-4-meal-price-total').innerHTML = finalGrandTotal.toFixed(2);


        updateFooterMessages(cart.length);
    }


    function updateFooterMessages(currentCount) {
        const diff = selectedMeals - currentCount;

        const $footerDivs = $('.section-3-right-footer .t-12');
        const $addMore = $footerDivs.eq(0);
        const $ready = $footerDivs.eq(1);
        const $remove = $footerDivs.eq(2);
        const $nextBtn = $('.nextBtn.section-3-button-next');

        $addMore.addClass('d-none');
        $ready.addClass('d-none');
        $remove.addClass('d-none');

        $nextBtn.prop('disabled', true).css({ 'opacity': '0.5', 'cursor': 'not-allowed' });

        if (selectedMeals === 0 || diff > 0) {
            $addMore.removeClass('d-none');
            $('#s-3-meals').text(selectedMeals === 0 ? "some" : diff);
        }
        else if (diff === 0) {

            $ready.removeClass('d-none');
            $nextBtn.prop('disabled', false).css({ 'opacity': '1', 'cursor': 'pointer' });
        }
        else {
            $remove.removeClass('d-none');
            const countToRemove = Math.abs(diff);
            const label = countToRemove === 1 ? "meal" : "meals";

            $remove.find('.orange-text-nobold').html(`Please Remove <span class="orange-text"><span id="s-3-meals-2">${countToRemove}</span> ${label}</span> to continue.`);
        }
    }
    // --- Clear All Logic ---
    $(document).on('click', '.section-3-right-heading a', function (e) {
        e.preventDefault();
        cart = [];
        renderCart();
    });

    // --- Navigation Logic ---
    function updateUI() {
        $('.step-content').addClass('d-none');
        $(`#content-${currentStep}`).removeClass('d-none');
        $('.step-item').removeClass('active');
        $(`.step-item[data-step="${currentStep}"]`).addClass('active').removeClass('disabled');
    }

    $('.nextBtn').click(function () {
        if (currentStep === 1 && selectedMeals === 0) { $('#meal-warning').removeClass('d-none'); return; }
        if (currentStep === 2 && selectedDate === "") { $('#date-warning').removeClass('d-none'); return; }
        if (currentStep < totalSteps) {
            $(`.step-item[data-step="${currentStep + 1}"]`).removeClass('disabled');
            currentStep++;
            updateUI();
        }
    });

    $('.step-item').click(function () {
        const targetStep = $(this).data('step');
        if (!$(this).hasClass('disabled')) {
            currentStep = targetStep;
            updateUI();
        }
    });
    $(document).on('click', '#mobile-cart-toggle', function () {
        if ($(window).width() < 992) {
            $('.section-3-right').addClass('expanded');
            $('.cart-overlay').addClass('show');
            /*$('body').css('overflow', 'hidden'); */
        }
    });

    $(document).on('click', '.collapse-trigger, .cart-overlay', function () {
        $('.section-3-right').removeClass('expanded');
        $('.cart-overlay').removeClass('show');
        $('body').css('overflow', 'auto'); // Unlock background scroll
    });

   
    $(document).on('click', '.clear-all-link', function (e) {
        e.preventDefault();
        cart = [];
        renderCart();
        if ($(window).width() < 992) {
            $('.collapse-trigger').click();
        }
    });
});