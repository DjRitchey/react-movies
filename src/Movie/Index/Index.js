import React, { Component } from 'react'
import axiosClient from '../../axiosClient'

class MovieIndex extends Component {
  constructor(props) {
    super(props)
    this.state = { movies: [] }
  }

  componentDidMount() {
    axiosClient.get('/movies.json')
    .then(resp => {
      this.setState({ movies: resp.data })
    })
  }

  handleNewMovie() {
    this.props.history.push('/movies/new');
  }

  renderTableBody() {
    return this.state.movies.map(movie => {
      return (
        <tr key={movie.id}>
          <td  style={{
              paddingTop: '15px'
            }}>
            {movie.id}
          </td>
          <td>
          <a
            className="btn"
            onClick={e => this.handleDetails(movie.id)}
          >
            {movie.title}
            </a>
          </td>
          <td style={{
              paddingTop: "15px"
          }}
          >
            {movie.description}
          </td>
          <td>
            <button
              onClick={e => this.handleEdit(movie.id)}
              className="btn btn-primary"
            >
              Edit
            </button>
            &nbsp;
            <button
              onClick={e => this.handleRemove(movie.id)}
              className="btn btn-danger"
            >
              Remove
            </button>
          </td>
        </tr>
      )
    })
  }

  handleEdit(movieId) {
    this.props.history.push(`/movies/${movieId}/edit`)
  }

  handleDetails(movieId) {
    this.props.history.push(`/movies/${movieId}`)
  }

  handleRemove(movieId) {
    let movies = this.state.movies
    movies = movies.filter(movie => {
      return movie.id !== movieId
    })
    this.setState({ movies: movies })
    axiosClient.delete(`/movies/${movieId}`)
  }

  render() {
    return(
      <div className="MovieIndex col-md-12" style={{ marginTop: 10 }}>
        <div className="clearfix">
          <div className="pull-right">
            <button
              onClick={e => this.handleNewMovie()}
              className="btn btn-success">
              New Movie
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Descriptions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTableBody()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default MovieIndex
