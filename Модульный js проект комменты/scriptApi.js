

function getAllCom() {
return fetch('https://webdev-hw-api.vercel.app/api/v1/:alexandr-b/comments', {
    method: "GET",
})
    .then((response) => {
        // Запускаем преобразовываем "сырые" данные от API в json формат
        return response.json();
    })
}

function sendCom(name, text) {
return fetch('https://webdev-hw-api.vercel.app/api/v1/:alexandr-b/comments', {
    method: "POST",
    body: JSON.stringify({ // в body запроса мы передали json строку с обьектом, которую требует api
        name: name,
        text: text,
        date: date,
        counter: 0,
        liked: false,
    }),
})
}

export {getAllCom, sendCom};