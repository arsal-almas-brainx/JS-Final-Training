$(document).ready(function() {
    let currentStep = 1;
    const totalSteps = 4;

    function updateUI() {

        $('.step-content').addClass('d-none');
        $(`#content-${currentStep}`).removeClass('d-none');

        
        $('.step-item').removeClass('active');
        $(`.step-item[data-step="${currentStep}"]`).addClass('active').removeClass('disabled');

        
        if (currentStep === 1) {
            $('#prevBtn').addClass('d-none');
        } else {
            $('#prevBtn').removeClass('d-none');
        }

        if (currentStep === totalSteps) {
            $('#nextBtn').text('Finish');
        } else {
            $('#nextBtn').text('Next Step');
        }
    }

  
    $('#nextBtn').click(function() {
        if (currentStep < totalSteps) {
            
            $(`.step-item[data-step="${currentStep + 1}"]`).removeClass('disabled');
            currentStep++;
            updateUI();
        } else {
            alert("Process Finished!");
        }
    });


    $('#prevBtn').click(function() {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
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