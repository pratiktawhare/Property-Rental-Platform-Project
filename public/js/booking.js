document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    // Flash message functions
    function showFlashMessage(message, type = 'danger') {
        const container = document.getElementById('bookingFlashContainer');
        if (!container) return;
        
        // Clear existing messages
        container.innerHTML = '';
        
        // Create new alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show col-12`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        container.appendChild(alertDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }

    function clearFlashMessages() {
        const container = document.getElementById('bookingFlashContainer');
        if (container) container.innerHTML = '';
    }
    
    const totalPriceField = document.getElementById('totalPriceField');
    const listingIdEl = document.getElementById('listingId');
    const listingId = listingIdEl ? listingIdEl.value : null;
    const bookedDates = [];
    
    // Set minimum dates and fetch booked dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;
    
    // Fetch booked dates for this listing
    if (!listingId) {
        console.error('Listing ID not found');
        return;
    }
    
    fetch(`/listings/${listingId}/booked-dates`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            bookedDates.push(...data.bookedDates);
            // Disable booked dates in date picker
            document.querySelectorAll('input[type="date"]').forEach(input => {
                input.addEventListener('input', function() {
                    const selectedDate = new Date(this.value);
                    const isBooked = bookedDates.some(range => 
                        selectedDate >= new Date(range.from) && 
                        selectedDate <= new Date(range.to)
                    );
                        if (isBooked) {
                            this.style.backgroundColor = '#ffdddd';
                            this.style.borderColor = '#ff0000';
                            this.style.color = '#ff0000';
                            this.style.fontWeight = 'bold';
                            showFlashMessage('This date is already booked');
                            this.value = '';
                    } else {
                        this.style.backgroundColor = '';
                        this.style.borderColor = '';
                        this.style.color = '';
                        this.style.fontWeight = '';
                    }
                });

                // Set min/max dates and disable booked dates
                input.min = new Date().toISOString().split('T')[0];
                input.addEventListener('focus', function() {
                    const datePicker = this;
                    setTimeout(() => {
                        const allDates = document.querySelectorAll('input[type="date"] ~ * input[type="date"]');
                        allDates.forEach(dateEl => {
                            const dateValue = new Date(dateEl.value);
                            const isBooked = bookedDates.some(range => 
                                dateValue >= new Date(range.from) && 
                                dateValue <= new Date(range.to)
                            );
                            if (isBooked) {
                                dateEl.disabled = true;
                                dateEl.style.backgroundColor = '#ffdddd';
                                dateEl.style.borderColor = '#ff0000';
                                dateEl.style.color = '#ff0000';
                                dateEl.style.fontWeight = 'bold';
                            }
                        });
                    }, 100);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching booked dates:', error);
        });
    
    // Initialize event listeners
    document.getElementById('checkIn').addEventListener('change', updateBookingSummary);
    document.getElementById('checkOut').addEventListener('change', updateBookingSummary);
    document.getElementById('guests').addEventListener('change', updateBookingSummary);

    // Form submission handler
    bookingForm.addEventListener('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
        showFlashMessage('Please fill all required fields and accept terms');
        } else {
            // Check for date conflicts
            const checkIn = new Date(document.getElementById('checkIn').value);
            const checkOut = new Date(document.getElementById('checkOut').value);
            const hasConflict = bookedDates.some(range => 
                (checkIn >= new Date(range.from) && checkIn <= new Date(range.to)) ||
                (checkOut >= new Date(range.from) && checkOut <= new Date(range.to)) ||
                (checkIn <= new Date(range.from) && checkOut >= new Date(range.to))
            );
            
            if (hasConflict) {
                e.preventDefault();
                showFlashMessage('Selected dates conflict with existing bookings');
                return;
            }
            // Update prices before submission
            const totalText = document.getElementById('totalPrice').textContent.replace('₹', '');
            const subtotalText = document.getElementById('subtotalPrice').textContent.replace('₹', '');
            const taxText = document.getElementById('taxAmount').textContent.replace('₹', '');
            
            totalPriceField.value = totalText;
            document.getElementById('taxField').value = taxText;
            document.getElementById('subtotalField').value = subtotalText;
        }
    });

    function validateForm() {
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = document.getElementById('guests').value;
        const terms = document.getElementById('terms').checked;
        
        return checkIn && checkOut && guests && terms;
    }

    function updateBookingSummary() {
        try {
            const checkInEl = document.getElementById('checkIn');
            const checkOutEl = document.getElementById('checkOut');
            const priceEl = document.getElementById('listingPrice');
            const guestsEl = document.getElementById('guests');
            
            if (!checkInEl || !checkOutEl || !priceEl || !guestsEl) {
                console.error('Required form elements not found');
                return;
            }

            const checkIn = new Date(checkInEl.value);
            const checkOut = new Date(checkOutEl.value);
            
            // Validate dates
            if (checkIn && checkOut) {
                if (checkIn < new Date().setHours(0,0,0,0)) {
                    showFlashMessage('Check-in date cannot be in the past');
                    checkInEl.value = '';
                    return;
                }
                if (checkOut <= checkIn) {
                    showFlashMessage('Check-out date must be after check-in date');
                    checkOutEl.value = '';
                    return;
                }
            }

            const pricePerNight = parseFloat(priceEl.value) || 0;
            const guests = parseInt(guestsEl.value) || 1;

            if (checkIn && checkOut && checkOut > checkIn) {
                const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                const subtotal = nights * pricePerNight;
                const tax = subtotal * 0.18;
                const total = subtotal + tax;
                
                // Update summary display
                const nightsCountEl = document.getElementById('nightsCount');
                const subtotalPriceEl = document.getElementById('subtotalPrice');
                const taxAmountEl = document.getElementById('taxAmount');
                const totalPriceEl = document.getElementById('totalPrice');
                
                if (nightsCountEl) nightsCountEl.textContent = nights;
                if (subtotalPriceEl) subtotalPriceEl.textContent = `₹${subtotal.toFixed(2)}`;
                if (taxAmountEl) taxAmountEl.textContent = `₹${tax.toFixed(2)}`;
                if (totalPriceEl) totalPriceEl.textContent = `₹${total.toFixed(2)}`;
                
                // Update hidden form fields
                const subtotalField = document.getElementById('subtotalField');
                const taxField = document.getElementById('taxField');
                const totalPriceField = document.getElementById('totalPriceField');
                
                if (subtotalField) subtotalField.value = subtotal.toFixed(2);
                if (taxField) taxField.value = tax.toFixed(2);
                if (totalPriceField) totalPriceField.value = total.toFixed(2);
            }
        } catch (error) {
            console.error('Error in updateBookingSummary:', error);
        }
    }

    // Initialize the booking summary
    updateBookingSummary();

    // Clear flash messages when valid dates are selected
    document.getElementById('checkIn').addEventListener('change', function() {
        if (this.value) clearFlashMessages();
    });
    document.getElementById('checkOut').addEventListener('change', function() {
        if (this.value) clearFlashMessages();
    });

    // Handle booking cancellations - redirect to cancel form
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const bookingId = this.dataset.bookingId;
            window.location.href = `/bookings/${bookingId}/cancel`;
        });
    });

    // Style cancelled bookings differently
    document.querySelectorAll('.booking-card.cancelled').forEach(card => {
        card.style.opacity = '0.7';
        card.style.borderLeft = '4px solid #dc3545';
    });
});