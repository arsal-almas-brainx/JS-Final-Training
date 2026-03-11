$(document).ready(function() {
    let currentStep = 1;
    const totalSteps = 4;
    let selectedMeals = 0; 


    $(document).on('click', '.section-1-card', function() {
 
        $('.section-1-card').removeClass('active-selection');
        $(this).addClass('active-selection');

        const mealsValue = $(this).data('meals'); 
        
        if (mealsValue) {
            selectedMeals = parseInt(mealsValue);
            console.log("Meal Selection Updated:", selectedMeals);
            
            $('#meal-warning').addClass('d-none');
        }
    });

    function updateUI() {
    
        $('.step-content').addClass('d-none');
        $(`#content-${currentStep}`).removeClass('d-none');

        $('.step-item').removeClass('active');
        $(`.step-item[data-step="${currentStep}"]`).addClass('active').removeClass('disabled');
        
        const testingEl = document.getElementById("testing");
        if(testingEl) {
            testingEl.innerHTML = selectedMeals;
        }
    }

    $('.nextBtn').click(function() {

        if (currentStep === 1) {
            if (selectedMeals === 0) {
                $('#meal-warning').removeClass('d-none');
                return;
            } else {
                $('#meal-warning').addClass('d-none');
            }
        }

        if (currentStep < totalSteps) {
           
            $(`.step-item[data-step="${currentStep + 1}"]`).removeClass('disabled');
            currentStep++;
            updateUI();
        } else {
            alert("Process Finished! Final Order: " + selectedMeals + " meals.");
        }
    });

    $('.step-item').click(function() {
        const targetStep = $(this).data('step');
        
        if (!$(this).hasClass('disabled')) {
            currentStep = targetStep;
            updateUI();
        }
    });
});