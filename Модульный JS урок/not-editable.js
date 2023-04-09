const listElement = document.getElementById("list");

const students = [
  {
    name: "Глеб",
    color: "#ff2600",
  },
];

const renderStudents = () => {
  const studentsHtml = students
    .map((student, index) => {
      return `
      <li class="student" data-color="${student.color}">
        <p class="student-name">
          ${student.name}
        </p>
        <p>Любимый цвет: ${student.color} <span style="
          display:inline-block;
          width: 15px;
          height: 15px;
          background-color: ${student.color};">
        </span></p>
      </li>`;
    })
    .join("");

  listElement.innerHTML = studentsHtml;

  const deleteButtons = document.querySelectorAll(".delete-button");


  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const index = deleteButton.dataset.index;


      students.splice(index, 1);
      renderStudents();
    });
  }
};

renderStudents();