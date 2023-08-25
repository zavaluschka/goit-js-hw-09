import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import 'flatpickr/dist/flatpickr.min.css';

const input= document.querySelector('#datetime-picker');
const timer = document.querySelector('.timer');
const startBtn = document.querySelector('button[data-start]');
const days = document.querySelector('span[data-days]');
const hours = document.querySelector('span[data-hours]');
const minutes = document.querySelector('span[data-minutes]');
const seconds = document.querySelector('span[data-seconds]');


flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    let currentDate = Date.now();

    console.log(selectedDates[0].getTime());
    console.log(currentDate);
    if (selectedDates[0].getTime() < currentDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
      startBtn.disabled = true;
      
      return;
    }
    startBtn.disabled = false;
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

startBtn.addEventListener('click', startTimer);

function startTimer() {
  const selectedDate = input._flatpickr.selectedDates[0].getTime();

  startBtn.disabled = true;

  const countdownInterval = setInterval(() => {
    const msRemaining = selectedDate - Date.now();

    if (msRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimer(0);
      startBtn.disabled = false;
    } else {
      updateTimer(msRemaining);
    }
  }, 1000);
}

function updateTimer(ms) {
  const {
    days: daysValue,
    hours: hoursValue,
    minutes: minutesValue,
    seconds: secondsValue,
  } = convertMs(ms);

  days.textContent = addLeadingZero(daysValue);
  hours.textContent = addLeadingZero(hoursValue);
  minutes.textContent = addLeadingZero(minutesValue);
  seconds.textContent = addLeadingZero(secondsValue);
}