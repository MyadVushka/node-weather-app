import readline from 'node:readline'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import nameValidate from '../utilits/nameValidate.js'
import { bannerGraffiti } from '../utilits/graffities.js'

dotenv.config()

const URLCitiesList = 'http://api.openweathermap.org/geo/1.0/direct?q='
const cityList = []

const getWeatherList = async city => {
  console.log('Waiting for data...')
  await fetch(
    URLCitiesList + city + '&limit=5&appid=' + process.env.WEATHER_KEY,
  )
    .then(res => res.json())
    .then(data => {
      cityList.push(...data)
      console.log(
        cityList.map((obj, idx) => {
          console.log(
            (idx + 1) + '. ' + obj.name + ' in ' + obj.country, obj.state !== undefined
              ? '(' + obj.state + ')'
              : '',
          )
        }),
      )
    })
    .catch(err => console.log('Oooops! There is an error, ' + err))
}

const askForCity = () => {
  console.clear()
  bannerGraffiti()
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question(
    'Enter city name, the name should not containt numbers, spaces or special characters: ',
    async cityName => {
      if (nameValidate(cityName)) {
        rl.question(
          'Your entered city contains bannded symbols! Wanna type again? (Y/n): ',
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
        await getWeatherList(cityName)
        if (cityList.length > 1) {
          rl.question(
            'There are more than one city with this title, please enter a country or state: ',
            region => {
              console.log(region)
              rl.close()
            },
          )
        }
      }
    },
  )
}

askForCity()
