'use strict'
import React, {Component} from 'react';
import Youtube from 'react-youtube';

class Player extends Component {

    render() {
        let {list, startSeconds, ...other} = this.props;
        let firstVideoId = list.shift();

        let opts = {
            height: '100%',
            width: '100%',
            start: startSeconds,
            playerVars: {
                autoplay: 1,
                controls: 0,//show/hide controls
                autohide: 2,//controls autohide
                disablekb: 0,//allow keyboard control
                fs: 0,//hide fullscreen button
                iv_load_policy: 3,//disable anotations
                loop: 1,
                rel: 0,
                start: startSeconds,
                showinfo: 0,
                modestbranding: 1,//remove watermark/logo
                playlist: list.join(',')
            }
        };
        //console.log(`http://www.youtube.com/watch?v=${firstVideoId}`);
        return(
            <Youtube 
                url={`http://www.youtube.com/watch?v=${firstVideoId}`}
                opts={opts}
                {...other} />
        );
    }
}

export default Player;