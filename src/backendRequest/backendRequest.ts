const loadTodoFormElement = document.querySelector('.load-todo-form') as HTMLFormElement
const todoIdInputElement = document.querySelector('#todo-id') as HTMLInputElement
const resultElement = document.querySelector('.result') as HTMLElement

loadTodoFormElement?.addEventListener('submit', (event) => {
    event.preventDefault()

    fetch(`https://jsonplaceholder.typicode.com/todos/${todoIdInputElement.value}`)
        .then((response) => {
            console.log("response:", response)

            if (!response.ok) {
                const errorMessage = response.status === 404
                ? 'Задача по указанному идентификатору не найдена'
                : 'Что-то пошло не так :('

                throw new Error(errorMessage)
            }
            return response.json()
        })

        .then ((json) => {
        console.log(json)

        const {id, title, completed } = json

        resultElement.innerHTML = `
            <input
                id="todo-${id}"
                type="checkbox"
                ${completed ? 'checked' : ``}
            />
            
            <label for="todo-${id}">${title}</label>
        `
        })

        .catch((error) => {
            console.log('error:', error)
            resultElement.innerHTML = error.message
        })
})
