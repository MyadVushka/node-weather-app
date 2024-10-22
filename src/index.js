import readline from 'node:readline'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import chalk from 'chalk'
import nameValidate from '../utilits/nameValidate.js'
import { bannerGraffiti } from '../utilits/graffities.js'

dotenv.config()

const URLCitiesList = 'http://api.openweathermap.org/geo/1.0/direct?q='
const URLSpecificCity = 'https://api.openweathermap.org/data/2.5/weather?lat='
const cityList = []

const getCityList = async req => {
  console.log('Waiting for data...\n')
  await fetch(URLCitiesList + req + '&limit=5&appid=' + process.env.WEATHER_KEY)
    .then(res => res.json())
    .then(data => {
      cityList.push(...data)
      console.log(cityList)
      console.log('Result of request ' + req + ':\n')
      cityList.map((obj, idx) => {
        console.log(
          idx + 1 + '. ' + obj.name + ' in ' + obj.country,
          obj.state !== undefined ? '(' + obj.state + ')' : '',
        )
      })
    })
    .catch(err => console.log('Oooops! There is an error, ' + err))
}

const getCityWeather = async number => {
  const idx = Number(number)
  if (isNaN(idx)) {
    return
  } else {
    const city = cityList[idx - 1]
    const lon = city.lon
    const lat = city.lat
    await fetch(
      URLSpecificCity +
        lat +
        '&lon=' +
        lon +
        '&appid=' +
        process.env.WEATHER_KEY,
    )
      .then(res => res.json())
      .then(data => console.log(data))
  }
}

const askForCity = () => {
  console.clear()
  bannerGraffiti()
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question(
    'Enter city name, the name should not contain numbers, spaces or special characters: ',
    async cityName => {
      if (nameValidate(cityName)) {
        rl.question(
          `Your entered city contains banned symbols! Wanna type again? (${chalk.green(
            'Y',
          )}/${chalk.red('n')}): `,
          answer => {
            if (answer.trim().toLowerCase() === 'y' || answer.trim() === '') {
              rl.close()
              askForCity()
            } else {
              rl.close()
            }
          },
        )
      } else {
        await getCityList(cityName)
        if (cityList.length > 1) {
          rl.question(
            '\nThere are more than one city with this title, please enter a number below title: ',
            async number => {
              await getCityWeather(number)
              rl.close()
            },
          )
        }
      }
    },
  )
}

askForCity()
