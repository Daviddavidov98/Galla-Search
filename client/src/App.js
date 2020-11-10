import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import loading from './loading.svg'
import dropfiles from './dropfiles.png'
import dropit from './dropit.png'
import notaccepted from './notaccepted.png'

import './App.css';
import {app} from './base'

  class App extends Component {
    constructor(props){
      super(props);
      
      //Creating our State Array of objects
      this.state = {
        labelledImages : [],
        showUpload: true,
        showSearch: false,
        showDescription: false,
        search: "",
        isLoading: false
      }
    }

    onDrop = (acceptedFiles) => {     
      this.setState({isLoading:true, showUpload:false})
      acceptedFiles.map(img => {
        Object.assign(img, {
          //Create a preview image to load on homepage
          preview: URL.createObjectURL(img)
        });
        //Upload the dropped image to FireBase
        const storageRef = app.storage().ref()
        const fileRef = storageRef.child(img.name);
        fileRef.put(img)
        .then(() => {
          //Get URL from firebase upload
          fileRef.getDownloadURL()
            .then((url) =>{
              // Pass URL to POST Function to Analyze it 
                this.readImage(url, img.name)
                  .then((desc) => {
                    //Assign New Variables to labelledImages state
                    this.setState({
                      labelledImages: [...this.state.labelledImages, 
                        { name: img.name, 
                          preview: img.preview, 
                          url: url,
                          desc: desc }],
                      showSearch:true,
                      isLoading:false
                      });
                  });
            });
        });
      });
    }
    updateSearch(event){
      this.setState({search: event.target.value.substr(0,20)});
      if(this.state.search.length <= 1){
        this.setState({showDescription:false})
      }
      else{
        this.setState({showDescription:true})
      }
    }
    readImage = async (url, name) => {
      const response = await fetch('/api/readImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, name: name }),
      });
        const body = await response.text();
        return body;
    };

  //Not necessary yet TODO: Load all firebase images to homepage if there are any 
  componentDidMount() {
    document.title = "Galla-Search";
  }

  render(){
    const { labelledImages } = this.state
    
    let filteredImages = labelledImages.filter(
      (img) => {
        return img.desc.toLowerCase().indexOf(this.state.search.toLowerCase()) !==-1;
      }
    );
    return (
      <div className="App">
      <h1 className="title">GALLA-SEARCH</h1>
      {
        this.state.isLoading?
        <img src={loading} className="App-logo" alt="logo"/>   
        :null
      }
      {
        this.state.showSearch?
        <div>
            <input type="text"
              className="searchBar"
              placeholder="Search through your images!"
              value={this.state.search}
              onChange={this.updateSearch.bind(this)}/>
            <ul className="grid">
              {
                filteredImages.map((img)=>{
                  return <div>
                  
                  {
                    this.state.showDescription?
                    <div>
                    <img src={img.preview} className="imagesText"/>
                    <p className="description">Text: {img.desc}</p>
                    </div>
                    :<img src={img.preview} className="images"/>
                  }
                  </div>
                })
              }
            </ul>
        </div>
        :null
      }
        {
          this.state.showUpload?
            <div>
            <p className="introText">Never spend time looking through that CLUTTERED gallery of yours again! 
            With this program, you can now upload your images and instantly make them
            searchable! Our software uses Google Cloud's Optical Character Recognition API 
            to ensure every word in your gallery, regardless of font, gets recognized. Test it out for yourself
            to be amazed! :D</p>
            <Dropzone 
            onDrop={this.onDrop}
            accept="image/png, image/jpg, image/jpeg"
            multiple
          >
            {({getRootProps, getInputProps, isDragActive, isDragReject}) => (
              <div className="dropArea" {...getRootProps()}>
                <input {...getInputProps()} />
                {!isDragActive && <img src={dropfiles} className="dropFiles" alt="Drop"/>}
                {isDragActive && !isDragReject &&  <img src={dropit} className="dropFiles" alt="DropFiles"/>}
                {isDragReject && <img src={notaccepted} className="dropFiles" alt="DontDropFiles"/>}
              </div>
            )}
          </Dropzone>
          </div>
          :null
        }
      </div>
    );
  }
}

export default App;
