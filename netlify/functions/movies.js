// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error! Include query parameters for year and genre.` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
       
      // check if there is a runtime and include genres and years that match the values given in URL parameters
      // this code should also ignore results with no genres or runtimees
      if (moviesFromCsv[i].runtimeMinutes > 0 && moviesFromCsv[i].genres.includes(`${genre}`) && moviesFromCsv[i].startYear.includes(`${year}`)){
        
        // store each movie in memory
        let movie = {
        movieTitle: moviesFromCsv[i].primaryTitle,
        movieReleaseYear: moviesFromCsv[i].startYear,
        movieGenres: moviesFromCsv[i].genres
      }
        //add the movie to the array of movies to return
        returnValue.movies.push(movie)
        returnValue.numResults = returnValue.numResults + 1
      }
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}