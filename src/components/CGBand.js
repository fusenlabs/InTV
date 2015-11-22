'use strict'
import React, {Component} from 'react';

class CGBand extends Component {
    constructor(...props){
        super(...props);
        this.state = {
            show: false,
            videoTitle: null
        }
    }

    render() {
        let CGClass = 'CGBand' + (this.state.show? ' in':'');
        let videoTitle = this.state.videoTitle || this.props.videoTitle;
        return (
            <div className={CGClass}>
                <h1>{videoTitle}</h1>
            </div>
        );
    }

    show( title ) {
        this.setState({ show: true, videoTitle: title || this.state.videoTitle });
    }

    hide() {
        this.setState({ show: false, videoTitle: this.state.videoTitle });
    }
}

export default CGBand;