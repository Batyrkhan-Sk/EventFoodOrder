document.addEventListener('DOMContentLoaded', async () => {
  const submitButton = document.getElementById('submit-button');
  let braintreeInstance;

  const fetchClientToken = async () => {
    try {
      const response = await fetch('/api/payment/client-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const { clientToken } = await response.json();
      return clientToken;
    } catch (error) {
      console.error('Error fetching client token:', error);
      alert('Failed to load payment options. Please try again.');
    }
  };

  const initializeBraintree = async () => {
    const clientToken = await fetchClientToken();
  
    braintree.dropin.create(
      {
        authorization: clientToken, 
        container: '#dropin-container',
      },
      (error, instance) => {
        if (error) {
          console.error('Error initializing Braintree:', error);
          alert('Failed to load payment options. Please try again.');
        } else {
          console.log('Braintree initialized successfully:', instance);
          braintreeInstance = instance;
          submitButton.removeAttribute('disabled');
        }
      }
    );
  };

  submitButton.addEventListener('click', async () => {
    submitButton.setAttribute('disabled', true);
    submitButton.textContent = 'Processing...';
  
    try {
      if (!braintreeInstance) {
        throw new Error('Braintree instance is not initialized.');
      }
  
      const { paymentMethodNonce } = await braintreeInstance.requestPaymentMethod();
  
      const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
  
      const response = await fetch('/api/payment/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          paymentMethodNonce,
          amount: totalPrice,
          currency: 'KZT',
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Payment successful!');
        localStorage.removeItem('order');
        localStorage.removeItem('totalPrice');
        localStorage.removeItem('itemCount');
        window.location.href = '/success.html';
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      submitButton.removeAttribute('disabled');
      submitButton.textContent = 'Pay to order';
    }
  });

  initializeBraintree();
});