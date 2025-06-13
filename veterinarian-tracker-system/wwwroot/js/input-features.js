/**
 * Input Features JavaScript
 * Modern, interactive input functionality for the VetTracker application
 */

// Initialize all input features when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all input features
  initInputEffects();
  initCheckboxEffects();
  initRadioEffects();
  initSwitchEffects();
  initPasswordToggle();
  initCharacterCounter();
  initAutoExpand();
  initInputMasks();
});

/**
 * Initialize input effects
 */
function initInputEffects() {
  // Effect 2: Bottom border expands
  const effect2Inputs = document.querySelectorAll('.input-effect-2 input, .input-effect-2 textarea, .input-effect-2 select');
  
  effect2Inputs.forEach(input => {
    input.addEventListener('focus', function() {
      const parent = this.closest('.input-effect-2');
      if (parent) {
        const after = document.createElement('span');
        after.className = 'effect-border';
        after.style.position = 'absolute';
        after.style.width = '0';
        after.style.height = '2px';
        after.style.bottom = '0';
        after.style.left = '0';
        after.style.backgroundColor = 'var(--primary-color)';
        after.style.transition = 'all 0.3s ease';
        
        // Remove any existing effect-border
        const existingBorder = parent.querySelector('.effect-border');
        if (existingBorder) {
          parent.removeChild(existingBorder);
        }
        
        parent.appendChild(after);
        
        // Trigger reflow
        after.offsetWidth;
        
        after.style.width = '100%';
      }
    });
    
    input.addEventListener('blur', function() {
      const parent = this.closest('.input-effect-2');
      if (parent) {
        const border = parent.querySelector('.effect-border');
        if (border) {
          border.style.width = '0';
          
          // Remove the element after transition
          setTimeout(() => {
            if (border.parentNode === parent) {
              parent.removeChild(border);
            }
          }, 300);
        }
      }
    });
  });
  
  // Effect 3: Bottom border with highlight
  const effect3Inputs = document.querySelectorAll('.input-effect-3 input, .input-effect-3 textarea, .input-effect-3 select');
  
  effect3Inputs.forEach(input => {
    input.addEventListener('focus', function() {
      const parent = this.closest('.input-effect-3');
      if (parent) {
        const before = document.createElement('span');
        before.className = 'effect-border';
        before.style.position = 'absolute';
        before.style.width = '100%';
        before.style.height = '2px';
        before.style.bottom = '0';
        before.style.left = '0';
        before.style.backgroundColor = 'var(--primary-color)';
        before.style.visibility = 'hidden';
        before.style.transform = 'scaleX(0)';
        before.style.transition = 'all 0.3s ease';
        
        // Remove any existing effect-border
        const existingBorder = parent.querySelector('.effect-border');
        if (existingBorder) {
          parent.removeChild(existingBorder);
        }
        
        parent.appendChild(before);
        
        // Trigger reflow
        before.offsetWidth;
        
        before.style.visibility = 'visible';
        before.style.transform = 'scaleX(1)';
      }
    });
    
    input.addEventListener('blur', function() {
      const parent = this.closest('.input-effect-3');
      if (parent) {
        const border = parent.querySelector('.effect-border');
        if (border) {
          border.style.transform = 'scaleX(0)';
          
          // Remove the element after transition
          setTimeout(() => {
            if (border.parentNode === parent) {
              parent.removeChild(border);
            }
          }, 300);
        }
      }
    });
  });
  
  // Effect 4: Box fill
  const effect4Inputs = document.querySelectorAll('.input-effect-4 input, .input-effect-4 textarea, .input-effect-4 select');
  
  effect4Inputs.forEach(input => {
    input.addEventListener('focus', function() {
      const parent = this.closest('.input-effect-4');
      if (parent) {
        const before = document.createElement('span');
        before.className = 'effect-background';
        before.style.position = 'absolute';
        before.style.left = '0';
        before.style.top = '0';
        before.style.width = '100%';
        before.style.height = '100%';
        before.style.backgroundColor = 'rgba(var(--primary-rgb), 0.05)';
        before.style.zIndex = '-1';
        before.style.transform = 'scaleY(0)';
        before.style.transformOrigin = 'bottom';
        before.style.transition = 'all 0.3s ease';
        
        // Remove any existing effect-background
        const existingBg = parent.querySelector('.effect-background');
        if (existingBg) {
          parent.removeChild(existingBg);
        }
        
        parent.appendChild(before);
        
        // Trigger reflow
        before.offsetWidth;
        
        before.style.transform = 'scaleY(1)';
      }
    });
    
    input.addEventListener('blur', function() {
      const parent = this.closest('.input-effect-4');
      if (parent) {
        const bg = parent.querySelector('.effect-background');
        if (bg) {
          bg.style.transform = 'scaleY(0)';
          
          // Remove the element after transition
          setTimeout(() => {
            if (bg.parentNode === parent) {
              parent.removeChild(bg);
            }
          }, 300);
        }
      }
    });
  });
  
  // Effect 7: Shaking effect on invalid
  const effect7Inputs = document.querySelectorAll('.input-effect-7 input, .input-effect-7 textarea, .input-effect-7 select');
  
  effect7Inputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.classList.add('shake-animation');
      
      // Remove the animation class after it completes
      setTimeout(() => {
        this.classList.remove('shake-animation');
      }, 500);
    });
  });
  
  // Add shake animation style if not already present
  if (!document.getElementById('shake-animation-style')) {
    const style = document.createElement('style');
    style.id = 'shake-animation-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
      }
      
      .shake-animation {
        animation: shake 0.5s;
        border-color: var(--danger-color) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Effect 9: Bouncing label
  const effect9Inputs = document.querySelectorAll('.input-effect-9 input, .input-effect-9 textarea, .input-effect-9 select');
  
  effect9Inputs.forEach(input => {
    input.addEventListener('focus', function() {
      const parent = this.closest('.input-effect-9');
      if (parent) {
        const label = parent.querySelector('label');
        if (label) {
          label.classList.add('bounce-animation');
          
          // Remove the animation class after it completes
          setTimeout(() => {
            label.classList.remove('bounce-animation');
          }, 500);
        }
      }
    });
  });
  
  // Add bounce animation style if not already present
  if (!document.getElementById('bounce-animation-style')) {
    const style = document.createElement('style');
    style.id = 'bounce-animation-style';
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      .bounce-animation {
        animation: bounce 0.5s;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Initialize checkbox effects
 */
function initCheckboxEffects() {
  // Checkbox effect 3: Pulse
  const checkbox3Inputs = document.querySelectorAll('.checkbox-effect-3 input[type="checkbox"]');
  
  checkbox3Inputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.checked) {
        const checkmark = this.parentElement.querySelector('.checkmark');
        if (checkmark) {
          checkmark.classList.add('pulse-animation');
          
          // Remove the animation class after it completes
          setTimeout(() => {
            checkmark.classList.remove('pulse-animation');
          }, 500);
        }
      }
    });
  });
  
  // Add pulse animation style if not already present
  if (!document.getElementById('pulse-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-style';
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      .pulse-animation {
        animation: pulse 0.5s;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Initialize radio effects
 */
function initRadioEffects() {
  // Radio effect 1: Ripple
  const radio1Inputs = document.querySelectorAll('.radio-effect-1 input[type="radio"]');
  
  radio1Inputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.checked) {
        const checkmark = this.parentElement.querySelector('.checkmark');
        if (checkmark) {
          checkmark.classList.add('ripple-animation');
          
          // Remove the animation class after it completes
          setTimeout(() => {
            checkmark.classList.remove('ripple-animation');
          }, 600);
        }
      }
    });
  });
  
  // Add ripple animation style if not already present
  if (!document.getElementById('ripple-animation-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation-style';
    style.textContent = `
      @keyframes ripple {
        0% { box-shadow: 0 0 0 0px rgba(var(--primary-rgb), 0.5); }
        100% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
      }
      
      .ripple-animation {
        animation: ripple 0.6s;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Initialize switch effects
 */
function initSwitchEffects() {
  // Switch effect 1: Bounce
  const switch1Inputs = document.querySelectorAll('.switch-effect-1 input[type="checkbox"]');
  
  switch1Inputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.checked) {
        const slider = this.parentElement.querySelector('.slider:before');
        if (slider) {
          slider.classList.add('bounce-animation');
          
          // Remove the animation class after it completes
          setTimeout(() => {
            slider.classList.remove('bounce-animation');
          }, 500);
        }
      }
    });
  });
}

/**
 * Initialize password toggle visibility
 */
function initPasswordToggle() {
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    const input = toggle.previousElementSibling;
    if (!input || input.type !== 'password') return;
    
    toggle.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        input.type = 'password';
        toggle.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });
}

/**
 * Initialize character counter for inputs
 */
function initCharacterCounter() {
  const inputsWithCounter = document.querySelectorAll('.input-with-counter');
  
  inputsWithCounter.forEach(wrapper => {
    const input = wrapper.querySelector('input, textarea');
    const counter = wrapper.querySelector('.character-counter');
    
    if (!input || !counter) return;
    
    const maxLength = input.getAttribute('maxlength');
    if (!maxLength) return;
    
    // Update counter
    function updateCounter() {
      const remaining = maxLength - input.value.length;
      counter.textContent = `${remaining} characters remaining`;
      
      if (remaining <= 10) {
        counter.classList.add('text-danger');
      } else {
        counter.classList.remove('text-danger');
      }
    }
    
    // Initial update
    updateCounter();
    
    // Add event listener
    input.addEventListener('input', updateCounter);
  });
}

/**
 * Initialize auto-expand for textareas
 */
function initAutoExpand() {
  const autoExpandTextareas = document.querySelectorAll('textarea.auto-expand');
  
  autoExpandTextareas.forEach(textarea => {
    // Set initial height
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    
    // Add event listener
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  });
}

/**
 * Initialize input masks
 * This is a simple implementation. For more complex masks,
 * consider using a library like IMask.js or Cleave.js
 */
function initInputMasks() {
  // Phone mask
  const phoneInputs = document.querySelectorAll('input[data-mask="phone"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.length <= 3) {
          this.value = `(${value}`;
        } else if (value.length <= 6) {
          this.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
          this.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
      }
    });
  });
  
  // Date mask (MM/DD/YYYY)
  const dateInputs = document.querySelectorAll('input[data-mask="date"]');
  
  dateInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.length <= 2) {
          this.value = value;
        } else if (value.length <= 4) {
          this.value = `${value.slice(0, 2)}/${value.slice(2)}`;
        } else {
          this.value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
        }
      }
    });
  });
  
  // Credit card mask
  const ccInputs = document.querySelectorAll('input[data-mask="cc"]');
  
  ccInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = this.value.replace(/\D/g, '');
      let formattedValue = '';
      
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      
      this.value = formattedValue;
    });
  });
}