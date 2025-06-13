/**
 * Form Features JavaScript
 * Modern, interactive form functionality for the VetTracker application
 */

// Initialize all form features when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all form features
  initFormValidation();
  initFloatingLabels();
  initMaterialInputs();
  initInputClearButtons();
  initCustomFileInputs();
  initFormSteps();
  initFormTabs();
  initSearchSuggestions();
  initTagsInput();
  initRangeSliders();
  initColorPickers();
  initDatePickers();
  initTimePickers();
});

/**
 * Initialize form validation
 */
function initFormValidation() {
  // Get all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');
  
  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      form.classList.add('was-validated');
    }, false);
    
    // Add real-time validation for each input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        // Check validity when input loses focus
        if (input.checkValidity()) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
      });
    });
  });
}

/**
 * Initialize floating labels
 */
function initFloatingLabels() {
  const floatingInputs = document.querySelectorAll('.form-floating input, .form-floating textarea, .form-floating select');
  
  floatingInputs.forEach(input => {
    // Check initial state
    if (input.value !== '') {
      input.classList.add('has-value');
    }
    
    // Add event listeners
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      if (input.value !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });
}

/**
 * Initialize material design inputs
 */
function initMaterialInputs() {
  const materialInputs = document.querySelectorAll('.form-material .form-control');
  
  materialInputs.forEach(input => {
    // Check initial state
    if (input.value !== '') {
      input.classList.add('has-value');
    }
    
    // Add event listeners
    input.addEventListener('focus', () => {
      input.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.classList.remove('focused');
      if (input.value !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });
}

/**
 * Initialize input clear buttons
 */
function initInputClearButtons() {
  const clearableInputs = document.querySelectorAll('.input-with-clear .form-control');
  
  clearableInputs.forEach(input => {
    // Find the clear button
    const clearButton = input.parentElement.querySelector('.clear-button');
    if (!clearButton) return;
    
    // Add event listener to clear button
    clearButton.addEventListener('click', () => {
      input.value = '';
      input.focus();
      input.dispatchEvent(new Event('input'));
    });
    
    // Show/hide clear button based on input value
    input.addEventListener('input', () => {
      if (input.value !== '') {
        clearButton.style.opacity = '0.5';
      } else {
        clearButton.style.opacity = '0';
      }
    });
    
    // Initial state
    if (input.value !== '') {
      clearButton.style.opacity = '0.5';
    }
  });
}

/**
 * Initialize custom file inputs with preview
 */
function initCustomFileInputs() {
  const fileInputs = document.querySelectorAll('.file-input-with-preview input[type="file"]');
  
  fileInputs.forEach(input => {
    // Find the preview element
    const previewElement = input.parentElement.querySelector('.file-preview');
    if (!previewElement) return;
    
    // Add event listener to file input
    input.addEventListener('change', () => {
      // Clear previous preview
      previewElement.innerHTML = '';
      
      if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Check if it's an image
        if (file.type.match('image.*')) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewElement.appendChild(img);
          };
          
          reader.readAsDataURL(file);
        } else {
          // Not an image, show file name
          const fileInfo = document.createElement('div');
          fileInfo.className = 'preview-placeholder';
          fileInfo.innerHTML = `<i class="fas fa-file me-2"></i>${file.name}`;
          previewElement.appendChild(fileInfo);
        }
      } else {
        // No file selected
        const placeholder = document.createElement('div');
        placeholder.className = 'preview-placeholder';
        placeholder.innerHTML = '<i class="fas fa-upload me-2"></i>No file selected';
        previewElement.appendChild(placeholder);
      }
    });
    
    // Trigger change event to initialize preview
    input.dispatchEvent(new Event('change'));
  });
}

/**
 * Initialize form steps
 */
function initFormSteps() {
  const formWithSteps = document.querySelectorAll('.form-with-steps');
  
  formWithSteps.forEach(form => {
    const steps = form.querySelectorAll('.step-content');
    const stepIndicators = form.querySelectorAll('.form-step');
    const prevButtons = form.querySelectorAll('.btn-prev-step');
    const nextButtons = form.querySelectorAll('.btn-next-step');
    
    let currentStep = 0;
    
    // Show initial step
    showStep(currentStep);
    
    // Add event listeners to next buttons
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Validate current step before proceeding
        const currentStepInputs = steps[currentStep].querySelectorAll('input, select, textarea');
        let isValid = true;
        
        currentStepInputs.forEach(input => {
          if (!input.checkValidity()) {
            isValid = false;
            input.classList.add('is-invalid');
          }
        });
        
        if (isValid) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });
    
    // Add event listeners to previous buttons
    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
      });
    });
    
    // Function to show a specific step
    function showStep(stepIndex) {
      // Hide all steps
      steps.forEach(step => {
        step.style.display = 'none';
      });
      
      // Show current step
      steps[stepIndex].style.display = 'block';
      
      // Update step indicators
      stepIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        
        if (index < stepIndex) {
          indicator.classList.add('completed');
        } else if (index === stepIndex) {
          indicator.classList.add('active');
        }
      });
    }
  });
}

/**
 * Initialize form tabs
 */
function initFormTabs() {
  const formWithTabs = document.querySelectorAll('.form-with-tabs');
  
  formWithTabs.forEach(form => {
    const tabs = form.querySelectorAll('.form-tab');
    const tabContents = form.querySelectorAll('.tab-content');
    
    // Add event listeners to tabs
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and tab contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.style.display = 'none');
        
        // Add active class to current tab and show its content
        tab.classList.add('active');
        tabContents[index].style.display = 'block';
      });
    });
    
    // Activate first tab by default
    if (tabs.length > 0) {
      tabs[0].click();
    }
  });
}

/**
 * Initialize search suggestions
 */
function initSearchSuggestions() {
  const searchInputs = document.querySelectorAll('.search-input');
  
  searchInputs.forEach(input => {
    const suggestionsContainer = input.parentElement.querySelector('.search-suggestions');
    if (!suggestionsContainer) return;
    
    // Sample suggestions (in a real app, these would come from an API)
    const sampleSuggestions = [
      'Vaccination',
      'Check-up',
      'Surgery',
      'Dental cleaning',
      'X-ray',
      'Ultrasound',
      'Blood test',
      'Microchipping',
      'Neutering',
      'Spaying'
    ];
    
    // Add event listener to input
    input.addEventListener('input', () => {
      const value = input.value.toLowerCase();
      
      if (value.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
      }
      
      // Filter suggestions based on input value
      const filteredSuggestions = sampleSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value)
      );
      
      // Clear previous suggestions
      suggestionsContainer.innerHTML = '';
      
      // Add filtered suggestions
      if (filteredSuggestions.length > 0) {
        filteredSuggestions.forEach(suggestion => {
          const item = document.createElement('div');
          item.className = 'search-suggestion-item';
          item.textContent = suggestion;
          
          item.addEventListener('click', () => {
            input.value = suggestion;
            suggestionsContainer.style.display = 'none';
          });
          
          suggestionsContainer.appendChild(item);
        });
        
        suggestionsContainer.style.display = 'block';
      } else {
        suggestionsContainer.style.display = 'none';
      }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', event => {
      if (!input.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
  });
}

/**
 * Initialize tags input
 */
function initTagsInput() {
  const tagsInputs = document.querySelectorAll('.tags-input-wrapper');
  
  tagsInputs.forEach(wrapper => {
    const input = wrapper.querySelector('.tags-input');
    if (!input) return;
    
    const tags = new Set();
    
    // Add event listener to input
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        
        const value = input.value.trim();
        if (value && !tags.has(value)) {
          addTag(value);
          tags.add(value);
          input.value = '';
        }
      }
    });
    
    // Function to add a tag
    function addTag(text) {
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `
        ${text}
        <span class="tag-remove">&times;</span>
      `;
      
      // Add event listener to remove button
      const removeButton = tag.querySelector('.tag-remove');
      removeButton.addEventListener('click', () => {
        wrapper.removeChild(tag);
        tags.delete(text);
      });
      
      wrapper.insertBefore(tag, input);
    }
  });
}

/**
 * Initialize range sliders
 */
function initRangeSliders() {
  const rangeSliders = document.querySelectorAll('.range-slider');
  
  rangeSliders.forEach(slider => {
    const input = slider.querySelector('.range-slider-input');
    const value = slider.querySelector('.range-slider-value');
    
    if (!input || !value) return;
    
    // Update value display
    function updateValue() {
      value.textContent = input.value;
    }
    
    // Initial value
    updateValue();
    
    // Add event listeners
    input.addEventListener('input', updateValue);
  });
}

/**
 * Initialize color pickers
 */
function initColorPickers() {
  const colorPickers = document.querySelectorAll('.color-picker-wrapper');
  
  colorPickers.forEach(picker => {
    const input = picker.querySelector('.color-picker-input');
    const value = picker.querySelector('.color-picker-value');
    
    if (!input || !value) return;
    
    // Update value display
    function updateValue() {
      value.textContent = input.value.toUpperCase();
    }
    
    // Initial value
    updateValue();
    
    // Add event listeners
    input.addEventListener('input', updateValue);
  });
}

/**
 * Initialize date pickers
 */
function initDatePickers() {
  // This is a placeholder for date picker initialization
  // In a real application, you might use a library like Flatpickr or Bootstrap Datepicker
  console.log('Date pickers initialized');
}

/**
 * Initialize time pickers
 */
function initTimePickers() {
  const timePickers = document.querySelectorAll('.time-picker-wrapper');
  
  timePickers.forEach(picker => {
    const hourInput = picker.querySelector('.time-picker-hour');
    const minuteInput = picker.querySelector('.time-picker-minute');
    const ampmSelect = picker.querySelector('.time-picker-ampm');
    
    if (!hourInput || !minuteInput) return;
    
    // Add event listeners to hour input
    hourInput.addEventListener('input', () => {
      let value = parseInt(hourInput.value, 10);
      
      if (isNaN(value)) {
        hourInput.value = '12';
      } else if (value < 1) {
        hourInput.value = '1';
      } else if (value > 12) {
        hourInput.value = '12';
      } else {
        hourInput.value = value.toString();
      }
    });
    
    // Add event listeners to minute input
    minuteInput.addEventListener('input', () => {
      let value = parseInt(minuteInput.value, 10);
      
      if (isNaN(value)) {
        minuteInput.value = '00';
      } else if (value < 0) {
        minuteInput.value = '00';
      } else if (value > 59) {
        minuteInput.value = '59';
      } else {
        minuteInput.value = value.toString().padStart(2, '0');
      }
    });
  });
}