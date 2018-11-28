import React, { Component } from 'react'
import MovieForm from '../Form'

class MovieEdit extends Component {
  render() {
    return (
      <div className="MovieEdit col-md-8 col-md-offset-2">
        <h2>Edit Movie</h2>
        <MovieForm
          history={this.props.history}
          match={this.props.match}
        />
      </div>
    )
  }
}
export default MovieEdit
