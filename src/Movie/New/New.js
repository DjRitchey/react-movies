import React, { Component } from 'react'
import MovieForm from '../Form/Form.js'

class MovieNew extends Component {
  render() {
    return (
      <div className="MovieNew col-md-8 col-md-offset-2">
        <h2>Add a Movie</h2>
        <MovieForm
          history={this.props.history}
          match={this.props.match}
        />
      </div>
    )
  }
}
export default MovieNew
