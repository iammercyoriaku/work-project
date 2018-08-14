 var stripe = Stripe('pk_test_tHfOar5aKcCZ7ceMI9oWcnBS');

// Stripe.setPublishableKey('pk_test_tHfOar5aKcCZ7ceMI9oWcnBS');

var $form = $('#checkout-form');

$form.submit(function(event){
        $('#charge-error').addClass('hidden');
    $form.find('button').prop('disbaled', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val(),
    }, stripResponseHandler);
    return false;
});

function stripeResponseHandler(status, response){
    console.log(response)
    if(response.error){
        
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false);
    }else{
        
        var token = response.id;

        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));

        $form.get(0).submit();
    }
}