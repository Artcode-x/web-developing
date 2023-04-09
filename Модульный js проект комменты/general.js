import { getAllCom, sendCom } from "./scriptApi.js"

    const buttonElement = document.getElementById('add-button'); // +
    //const listElement = document.getElementById('list');
    const nameInputElement = document.getElementById('name-input'); // +
    const textInputElement = document.getElementById('text-input'); // +
    const newBox = document.getElementById('box'); // +
    const genForm = document.getElementById('send-form');
    const loaderStartElement = document.getElementById('loader-start');
    const mainForm = document.querySelector(".add-form");
    const loaderPostElement = document.getElementById("loader-post");
    const quoteNameElement = document.getElementById("quote__name")

    loaderStartElement.textContent = 'Данные с сервера загружаются...';
    // Создаем функцию, в которой запрашиваем данные из хранилища
   
 const getAllComments = () => {
   
        getAllCom().then((responseData) => {
            icomments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date).toLocaleString("ru-RU", options),
                    text: comment.text,
                    counter: comment.likes,
                    isliked: false,
                };
            });
            renderIcomments();
        })
        .then(() => {
            loaderStartElement.style.display = "none";
        });
};
    // Делаем невидимым сообщение "комментарии добавляются" 
    // если закомментить - постоянно будет отображаться
    loaderPostElement.style.display = "none";
    // Оживляем кнопку лайков
    function likesButton() {
        const likeButtonElements = document.querySelectorAll(".like-button");
        for (const likeButtonElement of likeButtonElements) {
            // for (Элемент of итерируемый обьект) { тело цикла for of }       
            likeButtonElement.addEventListener("click", (event) => {
                event.stopPropagation();
                const index = likeButtonElement.dataset.index;
            
                if (icomments[index].isLiked === false) {
                    icomments[index].isLiked = true;
                    icomments[index].counter += 1;
                } else {
                    (icomments[index].isLiked === true)
                    icomments[index].isLiked = false;
                    icomments[index].counter = 0;
                }
                renderIcomments();
                // }); // с функиции delay
            });
        }
    };

    //Сначала проверка на пустой ввод - если да, окрасит в красный
    buttonElement.addEventListener('click', () => {  // Добавляем обработчик события "клик" на элемент buttonElement.
        //console.log(textInputElement.value);
        nameInputElement.classList.remove("error"); // Убирает у элемента класс error
        textInputElement.classList.remove("error")
        if (nameInputElement.value === "" || textInputElement.value === "") { // если значения полей имени или текста будут пустыми, применится класс error.(красный цвет полей)
            nameInputElement.classList.add("error"); textInputElement.classList.add("error");
            return;
        }
        
        // Затем идет добавление комментария на сервер
        // buttonElement.disabled = true;
        // buttonElement.textContent = 'Комментарий отправляется';
        // genForm.disabled = true;
        // genForm.textContent = 'Комментарий отправляется...';
        sendCom(protectHtmlString(nameInputElement.value), protectHtmlString(textInputElement.value)).then((response) => { // в ф-ии then, в обработчике, мы ответ преобразовали в json строку
         //     console.log(response);

             if (response.status === 400) {
                throw new Error("Имя и комментарий должны быть не короче 3 символов"); 
              }
               if (response.status === 500) {
                throw new Error("Сервер упал");
              //  throw new Error("Кажется у вас сломался интернет - попробуйте позже"); 
              }

              
                console.log('Сообщение успешно отправлено');
                mainForm.style.display = "none"; // скрыть (display:none)
                loaderPostElement.style.display = "flex"; // отобразить (display:flex;)
                return response.json();
            })
            .then(() => {

                nameInputElement.value = "";
                textInputElement.value = ""; 
                return getAllComments(); // тут лежит GET запрос комментов

                // переносим сюда инпуты чтобы информация в них сохранялась после обновления страницы


            })
            .then(() => {
                loaderPostElement.style.display = "none"; // когда отрисовались комменты, мы должны скрыть надпись 'комментарии добавляются'
                mainForm.style.display = "flex";

            //    throw new Error("Some error");
            }).catch((error) => {
                console.log(error.message);

                switch (error.message) {
                    case "Имя и комментарий должны быть не короче 3 символов":
                        alert("Имя и комментарий должны быть не короче 3 символов");
                        break; // закрывает switch
                    case "Сервер упал":
                        alert("Сервер упал");
                        break;
                    default: 
                    alert("Кажется у вас сломался интернет - попробуйте позже");
                   //если switch не нашел подходящее сообщение, то могу добавить тут условие
                        break;
                }



                return console.warn(error); 
            }); 
    });


    // блокировка кнопки - она блокируется когда пустые поля
    const goodInput = () => {
      // Если поле ввода имени пустое или текста 
      if (nameInputElement.value === "" || textInputElement.value === "") {
       //отключаем кнопку
        buttonElement.disabled = true; 
      } else {
        buttonElement.disabled = false;
      }
    };
    const buttonBlock = () => {
      goodInput();
      document.querySelectorAll("#name-input,#text-input").forEach((el) => {
        el.addEventListener("input", () => {    // поиск по тегу ? окно ввода 
          goodInput();  
        });
      });
  }
    // ввод по кнопке enter
    // ф-ия чтобы можно было отправлять по нажатию ENTER
    mainForm.addEventListener('keydown', (e) => { //  keydown - нажатие по клавше
        // keyup - отпускание клавиши
        if (!e.shiftKey && e.key === 'Enter') {// если шифт и ентер нажать вместе - 
            // e.key - если нажимаем ентер - отправить коммент
            buttonElement.click();
            // коммент не отправится, а будет отступ
            nameInputElement.value = '';
            textInputElement.value = '';
        }
    });
    //  buttonElement.disabled = false;
    //  buttonElement.textContent = "Отправить комментарий";
    //  genForm.textContent.disabled = false;
    //  как написать тут?   genForm.textContent = ;
    // для ререндера icomments на получаемые данные с сервера поменяли const на let
    let icomments = [];// данные о комментариях хранятся тут   
    const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
        hour: "numeric",
        minute: "2-digit",
    };
    // Функция ответа на комментарии
    function answerOnComments() {  // Функция ответа на комментарии
        const answerComments = document.querySelectorAll(".comment");
        const textInputElement = document.getElementById("text-input");
        for (const answerComment of answerComments) {
            answerComment.addEventListener("click", () => {
                const textComment = answerComment.dataset.text; // comments использовал который в рендер форме, но ошибка/  не понятно к какой переменной обращаться?  на answerComment возвращает underfined
                textInputElement.value = textComment;
            });
        }
    }
    // Функция редактирования 
    function buttonEditText(buttonRedacts) { // обернул в ф-ию чтобы было удобно вызывать где нужно
        buttonRedacts = document.querySelectorAll(".redact");
        // for ( берем Элемент из итерируемого объекта) {тело цикла}
        for (const buttonRedact of buttonRedacts) {
            buttonRedact.addEventListener("click", () => {
                // с пом-ю св-ва dataset получаем доступ к data-атрибуту redact (который указали в рендер-html форме, в кнопке редактирования) 
                const index = buttonRedact.dataset.redact;
                if (buttonRedacts[index].innerHTML === "Редактировать") {
                    buttonRedacts[index].innerHTML = "Сохранить";
                    icomments[index].txtRedact = false;
                    const commentBodyElements = document.querySelectorAll(".comment-text");
                    const commentBodyElement = commentBodyElements[index];
                    const textareaElement = `<textarea type="textarea" class="redactor-txt" rows="4">${icomments[index].text}</textarea>`;
                    commentBodyElement.innerHTML = textareaElement;
                } else {
                    icomments[index].txtRedact = true;
                    const redactCommentElement = document.querySelectorAll(".redactor-txt");
                    icomments[index].text = protectHtmlString(redactCommentElement[0].value);
                    renderIcomments();
                }
            });
        }
        return buttonEditText;
    }
    // Функция защиты для полей ввода
    function protectHtmlString(someEdit) {
        someEdit = someEdit
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
        return someEdit;
    }
    // функция задержки для лайков
    function delay(interval = 300) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, interval);
        });
    }
    const giveMeTime = 'ru-RU';
    let todayData = { day: 'numeric', month: 'numeric', year: '2-digit' };
    let todayTime = { hour: 'numeric', minute: '2-digit' };
    let date = new Date();

function deleteCom() {
   // начало реализации кнопки удаления положено :)
 const deleteButtons = document.querySelectorAll(".delete-button");
    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener("click", (event) => {
            console.log(deleteButton);
            event.stopPropagation();
            const index = deleteButton.dataset.id;
          //  console.log(index);
            icomments.splice(index, 1); 
            renderIcomments();
        })
    }
}
    //рендер-функция
 
    const renderIcomments = () => {
        //  elementOfdata - 1 комментарий, elementOfdata.name - часть одного комментария 
        const icommentsHTML = icomments.map((elementOfdata, index) => {
            return `
            <li data-text = '&gt ${elementOfdata.name} \n ${elementOfdata.text}' class="comment">
        <div class="comment-header">
          <div id="quote__name">${elementOfdata.name}</div>
          <div>${elementOfdata.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text" data-text>${elementOfdata.text} </div>
          </div>
          <div class="comment-footer">
          <button data-redact="${index}" class="redact">Редактировать</button>
          <button data-id="${index}" class="delete-button">Удалить</button>
          <div class="likes">
            <span class="likes-counter">${elementOfdata.counter}</span>
            <button data-index="${index}" class="${elementOfdata.isLiked ? 'like-button -active-like' : 'like-button'}"></button> 
            
            </div>
        </div>
      </li>`;
        })
            .join('');  // а после этого проверяем через консоль и кладем в innerHTML полученную строку
        // console.log(icommentsHTML); // Тут видно данные с массива
        newBox.innerHTML = icommentsHTML; // Рендерим данные с массива
        // };

        deleteCom(); 
        buttonEditText();
        answerOnComments();
        likesButton();
    };
    getAllComments();
    buttonBlock();

