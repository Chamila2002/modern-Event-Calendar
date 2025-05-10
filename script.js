const months = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Sri Lanka 2025 holidays
const holidays2025 = {
  '2025-01-13': 'Duruthu Full Moon Poya Day',
  '2025-01-14': 'Tamil Thai Pongal Day',
  '2025-02-04': 'National Day',
  '2025-02-12': 'Navam Full Moon Poya Day',
  '2025-02-26': 'Mahasivarathri Day',
  '2025-03-13': 'Madin Full Moon Poya Day',
  '2025-03-31': 'Id Ul-Fitr',
  '2025-04-12': 'Bak Full Moon Poya Day',
  '2025-04-13': 'Day prior to Sinhala & Tamil New Year Day',
  '2025-04-14': 'Sinhala & Tamil New Year Day',
  '2025-04-18': 'Good Friday',
  '2025-05-01': 'May Day',
  '2025-05-12': 'Vesak Full Moon Poya Day',
  '2025-05-13': 'Day following Vesak Full Moon Poya Day',
  '2025-06-07': 'Id Ul-Alha',
  '2025-06-10': 'Poson Full Moon Poya Day',
  '2025-07-10': 'Esala Full Moon Poya Day',
  '2025-08-08': 'Nikini Full Moon Poya Day',
  '2025-09-05': 'Milad un-Nabi',
  '2025-09-07': 'Binara Full Moon Poya Day',
  '2025-10-06': 'Vap Full Moon Poya Day',
  '2025-10-20': 'Deepavali',
  '2025-11-05': 'Ill Full Moon Poya Day',
  '2025-12-04': 'Unduvap Full Moon Poya Day',
  '2025-12-25': 'Christmas Day'
};

// Get custom events from localStorage or initialize empty object
let customEvents = JSON.parse(localStorage.getItem('customEvents') || '{}');

const today = new Date();
let selectedYear = today.getFullYear();
let selectedMonth = today.getMonth();
let selectedDay = today.getDate();

const sidebarYear = document.getElementById('sidebar-year');
const monthList = document.getElementById('month-list');
const calendarTitle = document.getElementById('calendar-title');
const calendarWeekdays = document.getElementById('calendar-weekdays');
const calendarDays = document.getElementById('calendar-days');
const eventDate = document.getElementById('event-date');
const eventDetails = document.getElementById('event-details');
const eventTitle = document.getElementById('event-title');
const saveEventBtn = document.getElementById('save-event-btn');

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function getDateKey() {
  return `${selectedYear}-${pad(selectedMonth + 1)}-${pad(selectedDay)}`;
}

function renderSidebar() {
  sidebarYear.textContent = selectedYear;
  monthList.innerHTML = '';
  months.forEach((m, idx) => {
    const li = document.createElement('li');
    li.textContent = m;
    if (idx === selectedMonth) li.classList.add('selected');
    li.onclick = () => {
      selectedMonth = idx;
      selectedDay = 1;
      renderAll();
    };
    monthList.appendChild(li);
  });
}

function renderHeader() {
  calendarTitle.textContent = `${months[selectedMonth]} ${selectedYear}`;
}

function renderWeekdays() {
  calendarWeekdays.innerHTML = '';
  weekdays.forEach(wd => {
    const div = document.createElement('div');
    div.textContent = wd;
    calendarWeekdays.appendChild(div);
  });
}

function renderDays() {
  calendarDays.innerHTML = '';
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // Fill empty slots before 1st day
  for (let i = 0; i < firstDayOfMonth; i++) {
    const div = document.createElement('div');
    div.className = 'empty';
    calendarDays.appendChild(div);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const div = document.createElement('div');
    div.textContent = d;
    const dateKey = `${selectedYear}-${pad(selectedMonth + 1)}-${pad(d)}`;
    let hasHoliday = holidays2025[dateKey] !== undefined && selectedYear === 2025;
    let hasEvent = (customEvents[dateKey] && customEvents[dateKey].length > 0);

    if (hasHoliday) {
      div.classList.add('has-holiday');
      div.title = holidays2025[dateKey];
    }
    if (hasEvent) {
      div.classList.add('has-event');
      if (!hasHoliday) div.title = customEvents[dateKey].map(ev => ev.title).join(', ');
      else div.title += ' & ' + customEvents[dateKey].map(ev => ev.title).join(', ');
    }
    if (
      d === selectedDay &&
      selectedMonth === (new Date(selectedYear, selectedMonth, d)).getMonth()
    ) {
      div.classList.add('selected');
    }
    if (
      d === today.getDate() &&
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear()
    ) {
      div.classList.add('today');
    }
    div.onclick = () => {
      selectedDay = d;
      renderAll();
    };
    calendarDays.appendChild(div);
  }
}

function renderEventsPanel() {
  const dateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  eventDate.textContent = dateStr.replace(',', ', ');
  const dateKey = getDateKey();
  
  eventDetails.innerHTML = '';
  
  // Add holiday if exists
  if (selectedYear === 2025 && holidays2025[dateKey]) {
    const holidayDiv = document.createElement('div');
    holidayDiv.className = 'holiday-item';
    holidayDiv.innerHTML = `<b>Holiday:</b> ${holidays2025[dateKey]}`;
    eventDetails.appendChild(holidayDiv);
  }
  
  // Add custom events with delete buttons
  if (customEvents[dateKey] && customEvents[dateKey].length > 0) {
    customEvents[dateKey].forEach((ev, index) => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event-item';
      
      const eventText = document.createElement('span');
      eventText.innerHTML = `<b>Event:</b> ${ev.title}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-event';
      deleteBtn.textContent = 'Remove';
      deleteBtn.onclick = () => {
        deleteEvent(dateKey, index);
      };
      
      eventDiv.appendChild(eventText);
      eventDiv.appendChild(deleteBtn);
      eventDetails.appendChild(eventDiv);
    });
  }
  
  // If no events, show default message
  if (eventDetails.children.length === 0) {
    eventDetails.innerHTML = "No event for today.. so take a rest! :)";
  }
}

function addEvent() {
  const title = eventTitle.value.trim();
  if (!title) return;
  
  const dateKey = getDateKey();
  
  if (!customEvents[dateKey]) {
    customEvents[dateKey] = [];
  }
  
  customEvents[dateKey].push({ title: title });
  
  // Save to localStorage
  localStorage.setItem('customEvents', JSON.stringify(customEvents));
  
  // Clear input field
  eventTitle.value = '';
  
  // Re-render calendar
  renderAll();
}

function deleteEvent(dateKey, index) {
  customEvents[dateKey].splice(index, 1);
  
  // Remove empty arrays
  if (customEvents[dateKey].length === 0) {
    delete customEvents[dateKey];
  }
  
  // Save to localStorage
  localStorage.setItem('customEvents', JSON.stringify(customEvents));
  
  // Re-render calendar
  renderAll();
}

function renderAll() {
  renderSidebar();
  renderHeader();
  renderWeekdays();
  renderDays();
  renderEventsPanel();
}

// Year navigation
document.getElementById('prev-year').onclick = () => {
  selectedYear--;
  renderAll();
};
document.getElementById('next-year').onclick = () => {
  selectedYear++;
  renderAll();
};

// Event listeners
saveEventBtn.addEventListener('click', addEvent);
eventTitle.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addEvent();
  }
});

// Initialize
renderAll();
