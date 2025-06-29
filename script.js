 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let editIndex = -1;

    const saveTasksToLocalStorage = () => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const addTask = () => {
      const taskInput = document.getElementById("taskInput");
      const text = taskInput.value.trim();

      if (text === "") {
        alert("Please enter a task.");
        return;
      }

      if (editIndex === -1) {
        tasks.push({ text: text, completed: false });
      } else {
        tasks[editIndex].text = text;
        editIndex = -1;
      }
      taskInput.value = '';
      saveTasksToLocalStorage();
      updateTasksList();
    };

    const updateTasksList = () => {
      const tasksList = document.getElementById("task-list");
      const numbers = document.getElementById("numbers");
      const progress = document.getElementById("progress");

      tasksList.innerHTML = '';

      tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.className = `taskItem fade-in ${task.completed ? "completed" : ""}`;
        listItem.innerHTML = `
          <div class="task">
            <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${index})" />
            <p>${task.text}</p>
          </div>
          <div class="icons">
            <img src="./assets/edit.png" onclick="editTask(${index})" />
            <img src="./assets/delete.png" onclick="deleteTask(${index})" />
          </div>
        `;
        tasksList.appendChild(listItem);
      });

      const total = tasks.length;
      const completed = tasks.filter(task => task.completed).length;

      numbers.innerText = `${completed}/${total}`;
      progress.style.width = total === 0 ? '0%' : `${(completed / total) * 100}%`;

      if (completed === total && total !== 0) {
        blastconfetti();
      }
    };

    const toggleTaskComplete = (index) => {
      tasks[index].completed = !tasks[index].completed;
      saveTasksToLocalStorage();
      updateTasksList();
    };

    const deleteTask = (index) => {
      tasks.splice(index, 1);
      if (editIndex === index) editIndex = -1;
      saveTasksToLocalStorage();
      updateTasksList();
    };

    const editTask = (index) => {
      const taskInput = document.getElementById("taskInput");
      taskInput.value = tasks[index].text;
      taskInput.focus();
      editIndex = index;
    };

    document.getElementById("newTask").addEventListener("click", (e) => {
      e.preventDefault();
      addTask();
    });

    window.addEventListener("DOMContentLoaded", () => {
      updateTasksList();
    });

    new Sortable(document.getElementById("task-list"), {
      animation: 150,
      onEnd: () => {
        const newOrder = [...document.querySelectorAll(".taskItem")].map(item => {
          const text = item.querySelector("p").innerText.trim();
          const completed = item.classList.contains("completed");
          return { text, completed };
        });
        tasks = newOrder;
        saveTasksToLocalStorage();
        updateTasksList();
      }
    });

    const blastconfetti = () => {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    };