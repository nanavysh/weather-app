const API_KEY = '19a9df0e9bed831f9a93b188379d0e24'

type City = {
    country: string,
    lat: number,
    lon: number,
    name: string,
    state: string,
}

type ResponseCityData = City[]

const form = document.querySelector('.todo-form') as HTMLFormElement
const inputElement = document.getElementById('todo-id') as HTMLInputElement
const divResult = document.querySelector('.result') as HTMLDivElement

// 1 функция - делает запрос по названию города, возвращает широту и долготу указанного города
// 2 функция - принимает в аргументах два апараметра - широта и долгота, и выполняет запрос на получение самой погоды
// 3 функция - объединяет в себе две функции, сначала выполняет 1, дожидается ответа (широта-долгота)
// после чего выполняет функцию 2, передав туда полученные от функции 1 значения широты и долготы
// и уже после чего, выводит в консоль полученные данные по погоде от функции 2

async function createRequest(cityName: string) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

    try {
        let response = await fetch(url)
        if (!response.ok) {
            throw new Error('Ошибка:' + response.status)
        }

        let cityData: ResponseCityData = await response.json()
        console.log(cityData)
    } catch (error) {
        console.log('Не удалось получить данные: ' + error)
    }
}

form.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault()

    const cityName: string = inputElement.value.trim()
    if (cityName) {
        createRequest(cityName)
    } else {
        divResult.innerHTML = '<p class="error"> Введите название города! </p>'
        console.warn('Введите название города!')
    }
})
//19a9df0e9bed831f9a93b188379d0e24
//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${кеу}