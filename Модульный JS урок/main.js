// Поиск статичных элементов по id с помощью getElementById
// Статичные элементы можно искать и другими методами: querySelector, querySelectorAll
const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const colorInputElement = document.getElementById("color-input");

// Данные о студентах в JS-коде
const students = [
  {
    name: "Глеб",
    color: "#ff2610",

    name: "artur",
    color: "#ff2620",

  },
];

// Рендер-функция
const renderStudents = () => {
  // Преобразование данных в HTML-разметку с помощью map и join
  const studentsHtml = students
    .map((student, index) => {
      return `
      <li class="student" data-color="${student.color}">
        <p class="student-name">
          ${student.name}
        </p>
        <p>Любимый цвет студента: ${student.color}</p>
        <button data-index="${index}" class="button delete-button">Удалить</button>
      </li>`;
    })
    .join("");

  // Рендер HTML-строки в браузер
  listElement.innerHTML = studentsHtml;

  // Поиск динамически создаваемых элементов разметки
  const deleteButtons = document.querySelectorAll(".delete-button");


  // Добавление обработчиков клика на динамически созданные элементы
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      // Отключение всплытия у события через stopPropagation,
      // обработчики клика на родительских элементах не будут вызываться после отключения
      event.stopPropagation();

      // Получение значения из data-* атрибутов разметки 
      const index = deleteButton.dataset.index;


      // Удаляем студента из данных
      students.splice(index, 1);
      // Делаем ререндер, чтобы после обновления данных обновить разметку
      renderStudents();
    });
  }
};

renderStudents();


buttonElement.addEventListener("click", () => {

  // Управляем классами на элементах с помощью classList
  nameInputElement.classList.remove("input-error");
  if (nameInputElement.value === "") {
    nameInputElement.classList.add("input-error");
    return;
  }


  // Добавляем нового студента в данные
  students.push({
    // Получаем значение из инпута через свойство value
    // Делаем HTML-строку безопасной для рендера, заменяя управляющие символы HTML на спец. символы
    name: nameInputElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
    color: colorInputElement.value,
  });

  // Делаем ререндер, чтобы после обновления данных обновить разметку
  renderStudents();

  // Очищаем поле ввода имени, записывая в .value элемента пустую строку
  nameInputElement.value = "";
});
