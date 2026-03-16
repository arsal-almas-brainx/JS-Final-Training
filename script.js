$(document).ready(function () {
    let currentStep = 1;
    const totalSteps = 4;
    let selectedMeals = 0;
    let selectedDate = "";

    generateDeliveryDates();

    $(document).on('click', '.section-1-card', function () {
        $('.section-1-card').removeClass('active-selection');
        $(this).addClass('active-selection');

        const mealsValue = $(this).data('meals');
        if (mealsValue) {
            selectedMeals = parseInt(mealsValue);
            console.log("Meal Selection:", selectedMeals);
            $('#meal-warning').addClass('d-none');
        }
    });

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

        let popularBadge = "";
        if (i === 0) {
            popularBadge = `<span class="popular-badge"><i class="fa-regular fa-star"></i> Most Popular</span>`;
            document.getElementById("first-delivery-date").innerHTML = `${dayName}, ${monthShort} ${dayNum}`;
        }

        const html = `
            <div class="date-entry" data-date="${displayString}">
                <p class="date-text">
                    <span class="date-day">${dayName}</span>, 
                    <span class="date-val">${monthShort} ${dayNum}</span>
                </p>
                ${popularBadge}
            </div>`;
        container.append(html);
    }
}

    $(document).on('click', '.date-entry', function () {
        $('.date-entry').removeClass('active-date');
        $(this).addClass('active-date');

        selectedDate = $(this).data('date');
        console.log("Selected Date:", selectedDate);
        document.getElementById("section-3-delivery-date").innerHTML = selectedDate;
        $('#date-warning').addClass('d-none');
    });

    function updateUI() {
        $('.step-content').addClass('d-none');
        $(`#content-${currentStep}`).removeClass('d-none');

        $('.step-item').removeClass('active');
        $(`.step-item[data-step="${currentStep}"]`).addClass('active').removeClass('disabled');
    }

    $('.nextBtn').click(function () {

        if (currentStep === 1 && selectedMeals === 0) {
            $('#meal-warning').removeClass('d-none');
            return;
        }

        if (currentStep === 2 && selectedDate === "") {
            $('#date-warning').removeClass('d-none');
            return;
        }

        if (currentStep < totalSteps) {
            $(`.step-item[data-step="${currentStep + 1}"]`).removeClass('disabled');
            currentStep++;
            updateUI();
        } else {
            alert(`Process Finished!\nMeals: ${selectedMeals}\nFirst Delivery: ${selectedDate}`);
        }

        if ($('#testing').length) {
            $('#testing').html(`Selected: ${selectedMeals} meals on ${selectedDate}`);
        }
    });

    $('.step-item').click(function () {
        const targetStep = $(this).data('step');
        if (!$(this).hasClass('disabled')) {
            currentStep = targetStep;
            updateUI();
        }
    });
});