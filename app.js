const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const databasePath = path.join(__dirname, 'covid19India.db')
const app = express()
app.use(express.json())

let database = null

const initializeAndSever = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initializeAndSever()

const convertDbtoResponse = district => {
  return {
    districtId: district.district_id,
    districtName: district.district_name,
    stateId: district.state_id,
    cases: district.cases,
    cured: district.cured,
    active: district.active,
    deaths: district.deaths,
  }
}

app.get('/districts/:districtId', async (request, response) => {
  const districtId = request.params
  const getQuery = `
    SELECT * FROM district
    WHERE district_id=${districtId}`
  const district = await database.get(getQuery)
  response.send(convertDbtoResponse(district))
})

module.exports = app
