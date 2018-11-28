import React, { Component } from 'react'
import axiosClient from '../../axiosClient'
import './Index.css'


class MovieForm extends Component {
  state = {
    selectedMovieCoverFiles: [],
    submitFormProgess: 0,
    isSubmittingForm: false,
    didFormSubmissionComplete: false,
    movie: {
      id: this.props.match.params.id,
      title: '',
      description: '',
      errors: {}
    }
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      axiosClient.get(`/movies/${this.props.match.params.id}`)
      .then(resp => {
        this.setState({
          selectedMovieCoverFiles: resp.data.cover_photos,
          movie: {
            id: resp.data.id,
            title: resp.data.title,
            description: resp.data.description,
            errors: {}
          }
        })
      })
    }
  }

  handleCancel() {
    this.props.history.push('/books')
  }

  handleFormSubmit() {
    let { movie } = this.state
    movie.errors = {}
    this.setState({
      isSubmittingForm: true,
      movie: movie
    }, () => {
      this.submitForm()
    })
  }

  buildFormData() {
    let formData = new FormData()
    formData.append('movie[title]', this.state.movie.title)
    formData.append('movie[description]', this.state.movie.description)

    let { selectedMovieCoverFiles } = this.state
    for(let i = 0; i < selectedMovieCoverFiles.length; i++) {
      let file = selectedMovieCoverFiles[i]
        if(file.id) {
          if(file._destroy) {
            formData.append(`movie[covers_attributes][${i}][id]`, file.id)
            formData.append(`movie[covers_attributes][${i}][_destroy]`, '1')
          }
        } else {
          formData.append(`movie[covers_attributes][${i}][photo]`, file, file.name)
        }
    }
    return formData
  }

  submitForm() {
    let submitMethod = this.state.movie.id ? "patch" : "post"
    let url = this.state.movie.id ? `/movies/${this.state.movie.id}.json` : `/movies.json`

    axiosClient
      [submitMethod](url, this.buildFormData(), {
        onUploadProgress: progressEvent => {
          let percent = progressEvent.loaded * 100.0 / progressEvent.total
          this.setState({
            submitFormProgess: percent
          })
        }
      })
      .then(resp => {
        this.setState({
          didFormSubmissionComplete: true
        })
        this.props.history.push('/movies')
      }).catch(err => {
        let { movie } = this.state
        movie.errors = err.response.data
        this.setState({
          isSubmittingForm: false,
          submitFormProgess: 0,
          movie: movie
        })
      })
  }


  handleMovieTitleChange(e) {
    let { movie } = this.state
    movie.title = e.target.value
    this.setState({ movie })
  }

  handleMovieDescriptionChange(e) {
    let { movie } = this.state
    movie.description = e.target.value
    this.setState({ movie })
  }

  renderMovieTitleInlineError() {
    if(this.state.movie.errors.title) {
      return (
        <div className="inline-error alert alert-danger">
          {this.state.movie.errors.title.join(', ')}
        </div>
      )
    }else {
      return null;
    }
  }

  getNumberOfSelectedFiles() {
    return this.state.selectedMovieCoverFiles.filter(el => {
      return el._destroy !== true
    }).length
  }

  handleMovieCoversChange() {
    let selectedFiles = this.movieCoversField.files
    let { selectedMovieCoverFiles } = this.state
    for(let i = 0; i < selectedFiles.length; i++) {
      selectedMovieCoverFiles.push(selectedFiles.item(i))
    }

    this.setState({
      selectedMovieCoverFiles: selectedMovieCoverFiles
    }, () => {
      this.movieCoversField.value = null;
    })
  }

  renderUploadCoversButton() {
    let numberOfSelectedCovers = this.getNumberOfSelectedFiles()
      return (
        <div>
          <input
            name="covers[]"
            ref={field => (this.movieCoversField = field)}
            type="file"
            disabled={this.state.isSubmittingForm}
            multiple={true}
            accept="image/*"
            style={{
              width: 0.1,
              height: 0.1,
              opacity: 0,
              overflow: 'hidden',
              position: 'absolute',
              zIndex: -1
            }}
              id="movie_covers"
              onChange={e => this.handleMovieCoversChange(e)}
              className="form-control"
           />
           <label
              disabled={this.state.isSubmittingForm}
              className="btn btn-success"
              htmlFor="movie_covers"
           >
           <span
              className="glyphicon glyphicon-cloud-upload"
            />
            &nbsp; &nbsp;
            {numberOfSelectedCovers === 0 ?
              "upload files" : `${numberOfSelectedCovers}
              file${numberOfSelectedCovers !== 1 ? "s" : " "} selected`}
           </label>
        </div>
      )
  }

  renderMovieDescriptionInlineError() {
    if(this.state.movie.errors.description) {
      return (
        <div className="inline-error alert alert-danger">
          {this.state.movie.errors.description.join(", ")}
        </div>
      )
    }else {
      return null
    }
  }

  renderSelectedMovieCoverFiles() {
    let fileDOMs = this.state.selectedMovieCoverFiles.map((el, index) => {
      if(el._destroy) {
        return null
      }

      return (
        <li key={index}>
          <div className="photo">
            <img
              width={150}
              src={el.id ? el.url : URL.createObjectURL(el)}
              style={{alignSelf: "center"}}
             />
             <div
              className="remove"
              onClick={() => this.removeSelectedMovieCoverFile(el, index)}
             >
             <span style={{top: 2}} className="glyphicon glyphicon-remove" />
             </div>
          </div>
          <div className="file-name">
            {el.name}
          </div>
        </li>
      )
    })
    return (
      <ul className="selected-covers">
        {fileDOMs}
      </ul>
    )
  }

  removeSelectedMovieCoverFile(cover, index) {
    let { selectedMovieCoverFiles } = this.state
    if(cover.id) {
      selectedMovieCoverFiles[index]._destroy = true;
    } else {
      selectedMovieCoverFiles.splice(index, 1)
    }

    this.setState({
      selectedMovieCoverFiles: selectedMovieCoverFiles
    })
  }

  renderUploadFormProgess() {
    if (this.state.isSubmittingForm === false) {
      return null
    }
    return (
      <div className="progress">
        <div className=
        {'progress-bar progress-bar-info progress-bar-striped' +
          (this.state.submitFormProgess < 100 ? 'active' : '')
        }
        role="progressbar"
        aria-valuenow={this.state.submitFormProgress}
        aria-valuemin="0"
        aria-valuemax="100"
        style={{ width: this.state.submitFormProgess + '%'}}
        >
        {this.state.submitFormProgess}% Complete
        </div>

      </div>
    )
  }

  render() {
    return (
      <div className="MovieForm">
        <form>
          <div className='form-group'>
            <label>Title</label>
            <input
              type="text"
              onChange={e => this.handleMovieTitleChange(e)}
              value={this.state.movie.title}
              className='form-control'
            />
           {this.renderMovieTitleInlineError()}
          </div>


           <div className='form-group'>
             <label>Description</label>
             <input
               type="text"
               onChange={e => this.handleMovieDescriptionChange(e)}
               value={this.state.movie.description}
               className='form-control'
              />
              {this.renderMovieDescriptionInlineError()}
            </div>


            <div className='form-group'>
              <label>Covers</label>
                {this.renderUploadCoversButton()}
                {this.renderSelectedMovieCoverFiles()}
             </div>

             {this.renderUploadFormProgess()}

          <button
            disabled={this.state.isSubmittingForm}
            onClick={e => this.handleFormSubmit()}
            className="btn btn-primary"
          >
            {this.state.isSubmittingForm ? "Saving..." : "Save"}
          </button>
          &nbsp;
          <button
            disabled={this.state.isSubmittingForm}
            onClick={e => this.handleCancel()}
            className="btn btn-default"
          >
          Cancel
          </button >
        </form>
        <br />
      </div>

    )
  }
}

export default MovieForm
