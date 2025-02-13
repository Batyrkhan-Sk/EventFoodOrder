document.addEventListener('DOMContentLoaded', () => {
    const addToOrderButtons = document.querySelectorAll('.add-to-order');
    const orderItemsList = document.getElementById('order-items');
    const emptyOrderMessage = document.getElementById('empty-order-message');
    const orderButton = document.getElementById('order-button');
    let totalPrice = 0.00;
    let itemCount = 0;
    let order = {};

    function formatPrice(price) {
        return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function updateOrderButton() {
        orderButton.textContent = `Order ${itemCount} for ${formatPrice(totalPrice)} 〒`;
    }

    function addItemToOrder(name, price) {
        if (order[name]) {
            order[name].quantity++;
        } else {
            order[name] = { price: price, quantity: 1 };
        }
        updateOrderDisplay();
        updateOrderButton();
    }

    function removeItemFromOrder(name) {
        if (order[name]) {
            order[name].quantity--;
            if (order[name].quantity <= 0) {
                delete order[name];
            }
            updateOrderDisplay();
            updateOrderButton();
        }
    }

    function updateOrderDisplay() {
        orderItemsList.innerHTML = '';
        totalPrice = 0;
        itemCount = 0;

        for (const name in order) {
            const item = order[name];
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            itemCount += item.quantity;

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="quantity-buttons">
                    <button class="remove-item" data-name="${name}">-</button>
                </div>
                <span>${item.quantity}x ${name}</span>
                <span>${formatPrice(itemTotal)} 〒</span>
                <div class="quantity-buttons">
                    <button class="add-item" data-name="${name}">+</button>
                </div>
            `;
            orderItemsList.appendChild(listItem);

            listItem.querySelector('.remove-item').addEventListener('click', () => {
                removeItemFromOrder(name);
                if (Object.keys(order).length === 0) {
                    emptyOrderMessage.style.display = 'block';
                }
            });
            listItem.querySelector('.add-item').addEventListener('click', () => {
                addItemToOrder(name, item.price);
                emptyOrderMessage.style.display = 'none';
            });
        }

        if (Object.keys(order).length === 0) {
            emptyOrderMessage.style.display = 'block';
        } else {
            emptyOrderMessage.style.display = 'none';
        }
    }


    addToOrderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.baursak-card');  
            const name = card.querySelector('.baursak-name').textContent; 
            const priceElement = card.querySelector('.baursak-price');  
            const price = parseFloat(priceElement.dataset.price);

            addItemToOrder(name, price);
            emptyOrderMessage.style.display = 'none';
        });
    });

    updateOrderButton();
});