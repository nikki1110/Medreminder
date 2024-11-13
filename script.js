document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission if not granted
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          alert("Please enable notifications for reminders!");
        } else {
          console.log("Notification permission granted.");
        }
      });
    }
  
    loadMedications();
    checkReminders();
  });
  if (Notification.permission === 'granted') {
    new Notification("Test Notification", {
      body: "This is a test",
      icon: "path/to/your/icon.png"
    });
  } else {
    alert("Permission denied for notifications.");
  }
  
  document.getElementById('medication-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const dosage = document.getElementById('dosage').value;
    const time = document.getElementById('time').value;
  
    const medication = { name, dosage, time };
    saveMedication(medication);
  
    showMessage("Medication added successfully!");
    showCharacter();
    document.getElementById('medication-form').reset();
    loadMedications();
    checkReminders();
  });
  
  function saveMedication(medication) {
    let medications = JSON.parse(localStorage.getItem('medications')) || [];
    medications.push(medication);
    localStorage.setItem('medications', JSON.stringify(medications));
  }
  
  function loadMedications() {
    const medicationsList = document.getElementById('medications-list');
    medicationsList.innerHTML = ''; // Clear the list before loading
  
    const medications = JSON.parse(localStorage.getItem('medications')) || [];
    medications.forEach((med) => {
      const item = document.createElement('li');
      item.textContent = `${med.name} - ${med.dosage} at ${med.time}`;
      medicationsList.appendChild(item);
    });
  }
  
  function checkReminders() {
    const medications = JSON.parse(localStorage.getItem('medications')) || [];
    medications.forEach(med => {
      const now = new Date();
      const reminderTime = new Date();
      const [hours, minutes] = med.time.split(':').map(Number);
      reminderTime.setHours(hours, minutes, 0, 0);
  
      console.log(`Checking reminder for: ${med.name}`);
      console.log(`Now: ${now}, Reminder Time: ${reminderTime}`);
  
      if (now < reminderTime) {
        const timeUntilReminder = reminderTime - now;
        console.log(`Time until reminder: ${timeUntilReminder}ms`);
  
        setTimeout(() => {
          console.log(`Sending notification for: ${med.name}`);
          sendNotification(med.name, med.dosage);
        }, timeUntilReminder);
      } else {
        console.log(`Reminder time for ${med.name} has already passed.`);
      }
    });
  }
  
  function sendNotification(medName, dosage) {
    if (Notification.permission === 'granted') {
      console.log("Notification permission granted. Sending notification...");
  
      const notification = new Notification(`Time to take your medication!`, {
        body: `${medName} - ${dosage}`,
        icon: 'assets/notification-icon.png'  // Ensure this path is correct
      });
  
      // Play sound when notification is clicked
      notification.onclick = () => {
        console.log("Notification clicked. Playing sound...");
        const audio = new Audio('assets/audio/notification-sound.mp3');  // Correct path to sound file
        audio.play().catch(error => {
          console.log("Error playing sound:", error);
        });
      };
    } else {
      console.log("Notification permission denied.");
    }
  }
  
  function showMessage(text) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = '#dff0d8';
    messageDiv.style.color = '#3c763d';
    messageDiv.style.padding = '10px';
    messageDiv.style.marginTop = '10px';
    messageDiv.style.borderRadius = '5px';
  
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }
  
  function showCharacter() {
    const characterDiv = document.getElementById('character');
    characterDiv.style.display = 'block';
  
    setTimeout(() => {
      characterDiv.style.display = 'none';
    }, 3000);
  }
  
  // Event listener for the clear list button
  document.getElementById('clear-list').addEventListener('click', () => {
    localStorage.removeItem('medications'); // Clear from localStorage
    loadMedications(); // Reload list to show empty state
  });
  