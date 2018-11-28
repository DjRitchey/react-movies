import React, { Component } from 'react'

class Details extends Component {
  constructor(props){
    super(props)
    this.state={ movie: [] }
  }

  componentDidMount() {
    axiosClient.get(`/movies/${id}/.json`)
    .then(resp => {
      this.setState({ movies: resp.data })
    })
  }


  render() {
    return(
      <div>
        details page
      </div>
    )
  }
}
