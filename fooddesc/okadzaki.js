document.addEventListener('DOMContentLoaded', () => {
  const addToOrderButtons = document.querySelectorAll('.add-to-order');
  const orderItemsList = document.getElementById('order-items');
  const emptyOrderMessage = document.getElementById('empty-order-message');
  const orderButton = document.getElementById('order-button');
  let order = {}; 
  let totalPrice = 0;
  let itemCount = 0;
  const MAX_QUANTITY = 5;


  function formatPrice(price) {
      return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
  }

  function updateOrderButton() {
      orderButton.textContent = `Order ${itemCount} for ${formatPrice(totalPrice)} 〒`;
  }

  function addItemToOrder(name, price) {
      if (order[name]) {
          if (order[name].quantity < MAX_QUANTITY) {
              order[name].quantity++;
          } else {
              alert(`You can only order a maximum of ${MAX_QUANTITY} ${name}.`);
              return; 
          }
      } else {
          order[name] = { price: price, quantity: 1 };
      }
      updateOrderDisplay();
  }

  function removeItemFromOrder(name) {
      if (order[name]) {
          order[name].quantity--;
          if (order[name].quantity <= 0) {
              delete order[name];
          }
          updateOrderDisplay();
      }
  }

  function updateOrderDisplay() {
      orderItemsList.innerHTML = ''; 
      totalPrice = 0;
      itemCount = 0;

      for (const name in order) {
          if (order.hasOwnProperty(name)) { 
              const item = order[name];
              const itemTotal = item.price * item.quantity;
              totalPrice += itemTotal;
              itemCount += item.quantity;

              const listItem = document.createElement('li');
              listItem.innerHTML = `
        <div class="quantity-buttons">
          <button class="remove-item" data-name="${name}" aria-label="Remove item">-</button>
        </div>
        <span>${item.quantity}x ${name}</span>
        <span>${formatPrice(itemTotal)} 〒</span>
        <div class="quantity-buttons">
          <button class="add-item" data-name="${name}" aria-label="Add item">+</button>
        </div>
      `;
              orderItemsList.appendChild(listItem);

              listItem.querySelector('.remove-item').addEventListener('click', () => {
                  removeItemFromOrder(name);
              });
              listItem.querySelector('.add-item').addEventListener('click', () => {
                  addItemToOrder(name, item.price);
              });
          }
      }

      if (Object.keys(order).length === 0) {
          emptyOrderMessage.style.display = 'block';
      } else {
          emptyOrderMessage.style.display = 'none';
      }

      updateOrderButton(); 
  }


  addToOrderButtons.forEach(button => {
      button.addEventListener('click', () => {
          const card = button.closest('.sushi-card');
          const name = card.querySelector('.sushi-name').textContent;
          const priceElement = card.querySelector('.sushi-price');
          const price = parseFloat(priceElement.dataset.price);

          addItemToOrder(name, price);
          emptyOrderMessage.style.display = 'none';
      });
  });

  orderButton.addEventListener('click', () => {
      if (Object.keys(order).length === 0) {
          alert("Choose food for order"); 
          return; 
      }

      try {
          localStorage.setItem('order', JSON.stringify(order));
          localStorage.setItem('totalPrice', totalPrice.toString());
          localStorage.setItem('itemCount', itemCount.toString());
          window.location.href = '/payment/payment.html'; // Correct path
      } catch (e) {
          console.error("Error saving to localStorage:", e);
          alert("Could not save order.  Please try again later."); 
      }
  });


  updateOrderDisplay(); 
});