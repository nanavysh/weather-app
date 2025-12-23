const API_KEY = '19a9df0e9bed831f9a93b188379d0e24'

const form = document.querySelector('.todo-form') as HTMLFormElement
const inputElement = document.getElementById('todo-id') as HTMLInputElement
const divResult = document.querySelector('.result') as HTMLDivElement

type City = {
    country: string,
    lat: number,
    lon: number,
    name: string,
    state: string,
}

type ResponseCityData = City[]

type ResponseWeatherData = {
    main: {
        temp: number,
        feels_like: number,
        humidity: number,
        pressure: number
    },
    weather: Array<{
    description: string,
    icon: string
}>,
    wind: {
        speed: number
    },
    name: string
}

form.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault()

    const cityName: string = inputElement.value.trim()
    if (cityName) {
        getWeatherDataByCityName(cityName)
    } else {
        divResult.innerHTML = '<p class="error"> Введите название города! </p>'
        console.warn('Введите название города!')
    }
})

async function getCityCoords(cityName: string)  {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

    try {
        let response = await fetch(url)
        if (!response.ok) {
            throw new Error('Ошибка:' + response.status)
        }

        let cityData: ResponseCityData = await response.json()
        console.log(cityData[0])
        if (cityData.length > 0) {
            let lat: number = cityData[0].lat
            let lon: number = cityData[0].lon
            console.log(`Координаты: ${lat}, ${lon}`)

            return {lat, lon}
        } else {
            divResult.innerHTML = '<p class="error">Город не найден</p>'
        }
    } catch (error) {
        console.log('Не удалось получить данные: ' + error)
    }
}

async function getWeatherData(lat: number, lon: number): Promise<ResponseWeatherData | null> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`

    try {
        let response = await fetch(url)

        if (!response.ok) {
            throw new Error('Ошибка:' + response.status)
        }

        let weatherData: ResponseWeatherData = await response.json()
        console.log(weatherData)
        return weatherData
    } catch (error) {
        console.log('Не удалось получить данные: ' + error)
        return null
    }
}

function renderWeather(data: ResponseWeatherData) {
    divResult.innerHTML = `
        <div class="weather-card">
            <h2>Погода в г. ${data.name}</h2>
            <p> Температура: <strong>${Math.round(data.main.temp)}°C</strong> </p>
            <p> Ощущается как: <strong> ${Math.round(data.main.feels_like)}°C</strong> </p>
            <p> Влажность: ${data.main.humidity} </p>
            <p> На улице: ${data.weather[0].description} </p>
            <p> Скорость ветра: ${data.wind.speed} </p>
        </div>
    `
}

async function getWeatherDataByCityName(cityName: string) {
    const coords  = await getCityCoords(cityName)

    if (coords) {
        const weather = await getWeatherData(coords.lat, coords.lon)
        if (weather) {
            renderWeather(weather)
        }
    }
}
// 1 функция - делает запрос по названию города, возвращает широту и долготу указанного города
// 2 функция - принимает в аргументах два апараметра - широта и долгота, и выполняет запрос на получение самой погоды
// 3 функция - объединяет в себе две функции, сначала выполняет 1, дожидается ответа (широта-долгота)
// после чего выполняет функцию 2, передав туда полученные от функции 1 значения широты и долготы
// и уже после чего, выводит в консоль полученные данные по погоде от функции 2