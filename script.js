let tasks = [];

const getPillClass = (subject) => {
  const map = {
    Math:    'pill-math',
    Physics: 'pill-physics',
    CS:      'pill-cs',
    English: 'pill-english',
  };
  return map[subject] || 'pill-other';
};

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();


  const { value: taskName } = document.getElementById('taskName');
  const { value: subject }  = document.getElementById('subject');
  const { value: dueDate }  = document.getElementById('dueDate');

  if (!taskName || !subject || !dueDate) {
    showToast('Please fill all fields!', true);
    return;
  }


  const newTask = { id: Date.now(), taskName, subject, dueDate };
  tasks = [...tasks, newTask];

  renderTasks();
  e.target.reset();
  showToast('Task added successfully!');
});


const renderTasks = () => {
  const filterVal = document.getElementById('filterSubject').value;
  const sortVal   = document.getElementById('sortOrder').value;
  const tbody     = document.getElementById('taskTableBody');
  const today     = new Date().toISOString().split('T')[0];

  // PART e: Filter by subject
  let filtered = tasks.filter((task) => {
    return filterVal === 'All' || task.subject === filterVal;
  });


  filtered = filtered.sort((a, b) => {
    return sortVal === 'asc'
      ? a.dueDate.localeCompare(b.dueDate)
      : b.dueDate.localeCompare(a.dueDate);
  });


  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="icon">📋</div>
            <div>No tasks yet. Add one above!</div>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((task, index) => {
    const isOverdue = task.dueDate < today;

    return `
      <tr>
        <td style="color:var(--muted);font-size:0.78rem">${index + 1}</td>
        <td>${task.taskName}</td>
        <td>
          <span class="subject-pill ${getPillClass(task.subject)}">
            ${task.subject}
          </span>
        </td>
        <td class="date-cell ${isOverdue ? 'overdue' : ''}">
          ${task.dueDate}${isOverdue ? ' ⚠' : ''}
        </td>
        <td>
          <button class="btn btn-danger" onclick="deleteTask(${task.id})">✕</button>
        </td>
      </tr>`;
  }).join('');
};

const deleteTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
  showToast('Task removed.');
};

document.getElementById('clearBtn').addEventListener('click', () => {
  if (tasks.length === 0) return;
  tasks = [];
  renderTasks();
  showToast('All tasks cleared.');
});

document.getElementById('filterSubject').addEventListener('change', renderTasks);
document.getElementById('sortOrder').addEventListener('change', renderTasks);

const fetchAPIData = async () => {
  const apiSection = document.getElementById('apiSection');


  apiSection.innerHTML = `
    <div class="loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <span style="margin-left:6px">Fetching data…</span>
    </div>`;

  try {

    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const data     = await response.json();


    const getStatus = (id) => {
      if (id % 3 === 0) return { label: 'Done',        cls: 'status-done' };
      if (id % 2 === 0) return { label: 'In Progress', cls: 'status-inprogress' };
      return                   { label: 'To Do',        cls: 'status-todo' };
    };


    apiSection.innerHTML = data.map(({ id, userId, title }, i) => {
      const { label, cls } = getStatus(id);
      const capitalized    = title.charAt(0).toUpperCase() + title.slice(1);

      return `
        <div class="api-item" style="animation-delay:${i * 0.07}s">
          <div class="api-num">${id}</div>
          <div>
            <h4>${capitalized}
              <span class="status-badge ${cls}">${label}</span>
            </h4>
            <p>User #${userId} · JSONPlaceholder API</p>
          </div>
        </div>`;
    }).join('');

    showToast('API data loaded!');

  } catch (error) {
    apiSection.innerHTML = `
      <p style="color:var(--accent2);font-size:0.8rem;padding:0.5rem 0">
        ⚠ Failed to fetch. Check your connection.
      </p>`;
  }
};

document.getElementById('fetchBtn').addEventListener('click', fetchAPIData);


const showToast = (message, isError = false) => {
  const toast = document.getElementById('toast');
  toast.textContent    = message;
  toast.style.background = isError ? 'var(--accent2)' : 'var(--accent)';
  toast.style.color      = isError ? '#fff' : '#0d0f14';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
};

tasks = [
  { id: 1, taskName: 'Lab Report #4',        subject: 'CS',      dueDate: '2026-05-10' },
  { id: 2, taskName: 'Mechanics Problem Set', subject: 'Physics', dueDate: '2026-05-08' },
  { id: 3, taskName: 'Essay Draft',           subject: 'English', dueDate: '2026-05-12' },
];

renderTasks();