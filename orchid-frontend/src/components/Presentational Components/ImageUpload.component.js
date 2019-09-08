import React from 'react';

export default function ImageUpload(props) {
    let urls = new WeakMap()

    let blobUrl = blob => {
      if (urls.has(blob)) {
        return urls.get(blob)
      } else {
        let url = URL.createObjectURL(blob)
        urls.set(blob, url)
        return url
      }
    }

    
    
    let onDrag = event => {
        event.preventDefault();
      }
    
    let onDrop = event => {
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        props.updateImage(file);
    }

    let onClick = event => {
        event.stopPropagation();
        if(event.target.tagName=='DIV')
            event.target.lastChild.click();
        else if(event.target.tagName=='IMG')
            event.target.parentNode.lastChild.click();
    }

    let onChange = event => {
        event.preventDefault();
        let file = event.target.files[0];
        props.updateImage(file);
    }
    
    let file  = props.imageFile;
    let url;
    if(file && file.type == 'Buffer'){
        var data = btoa(String.fromCharCode.apply(null, file.data));
        url = file ? `data:image/jpeg;base64,${data}`: props.SVG;
    }
    else{
        url = file && blobUrl(file);
    }
     return (
        <div className="detail-image-banner" onDragOver={onDrag} onDrop={onDrop} onClick={onClick}>
            <img src={url} onClick={onClick} alt="Drop an image!" style={!props.imageFile ? {display: 'none'}: {display: 'block'}}/>
            <p style={props.imageFile ? {display: 'none'}: {display: 'block'}}>Drop or select an image</p>
            <input type = "file" onChange={onChange} accept="image/x-png,image/gif,image/jpeg" style={{display: 'none'}}/>
        </div>
        
      );
  }