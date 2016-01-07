'use strict'
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Player from './components/Player';
import CGBand from './components/CGBand';
import {Config,Video} from 'youtube-client-wrapper';
import Utils from './libs/Utils';
import {
    TOP25_BILLBOARD_DANCE_ELECTRONIC,
    TOP25_BILLBOARD_DANCE_ELECTRONIC_SRC } from './assets/playlists.js';

let bootYoutubeClient = ()=>{
    return Config.set({
                apiKey: 'AIzaSyB8_0tIV6QuSA5Qb1zx3kXW8UAB-cATQXU'
            })
            .boot();
},
videosData = [],
playlist = TOP25_BILLBOARD_DANCE_ELECTRONIC,
playerPlaylist = [],
ISO8601ToSeconds = Utils.ISO8601ToSeconds,
//for creation list process, uncomment when collecting = true
//externalList = TOP25_BILLBOARD_DANCE_ELECTRONIC_SRC,
collecting = false;

class App extends Component {
    constructor(...props){
        super(...props);
        bootYoutubeClient()
            .then(() => {
                if( collecting ){
                    this._collectVideosInfo();
                }else{
                    this._generatePlaylist();
                }
            });

        this.state = {
            loading: true,
            playlist: playerPlaylist,
            showCGBand: false,
            currentVideoTitle: '',
            startSeconds: 0
        };
    }

    render() {
        let content = this.state.loading? this._getLoadingComponent() : this._getYoutubeVideo();
        if( collecting ){
            content = <pre>{JSON.stringify(this.state.data)}</pre>;
        }
        return ( content );
    }

    _getLoadingComponent() {
        return (
            <div className="AppLoading"><h1>loading...</h1></div>
        );
    }

    _getYoutubeVideo() {
        return (
            <div>
                <Player className="playerContainer" 
                    list={this.state.playlist}
                    startSeconds={this.state.startSeconds}
                    onReady={this._onReadyHandler.bind(this)}
                    onEnd={this._onEndHandler.bind(this)} 
                    onPause={this._onPauseHandler.bind(this)}
                    onPlay={this._onPlayHandler.bind(this)}
                    onStateChange={this._onStateChangeHandler.bind(this)} />
                <CGBand show={this.state.showCGBand} videoTitle={this.state.currentVideoTitle} ref="gcBand" />
            </div>

        );
    }

    _collectVideosInfo() {
        if( externalList.length == 0 ){
            this.setState({
                loading: false,
                data: videosData
            });
        }else{
            let videoTitle = externalList.shift();
            Video.where(videoTitle)
            .then(page => {
                let video = page.firstElement();
                video.get({part: 'contentDetails'}).then(video => {
                    videosData.push( {
                        id: video.id,
                        duration: video.contentDetails.duration
                    });
                    this._collectVideosInfo();
                });
            });
        }
    }

    _generatePlaylist() {
        /**
        * a Video
        * ===
        *
        * a playlist
        * [===.===.===.===]
        *
        * a day
        *                       now
        * -----------------------|--------------------------------------------
        *
        * fill up the day with playlists
        * [===.===.===.===][===.===.===.===][===.===.===.===][===.===.===.===]
        * -----------------------|--------------------------------------------
        *
        * determine the video to play for the current time of the day
        *
        *                       video
        * [===.===.===.===][===.<===>.===.===] 
        * ------------------------|--------------------------------------------
        *
        * calculate the start second of the video
        *
        *                       start
        * [===.===.===.===][===.<=|==>.===.===] 
        * ------------------------|--------------------------------------------
        **/

        let today = new Date();
        //time of the day in seconds
        let now = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();
        let index = 0;
        let firstVideoToPlay = playlist[index];
        //total duration of the videos taken for the playlist.
        let totalDuration = ISO8601ToSeconds(firstVideoToPlay.duration);
        //while the total playlist videos duration is lower than now
        while( totalDuration < now ) {
            //loops the videos if reaches the end of the playlist
            if( index == playlist.length - 1 ) { index = -1; }
            //update values
            totalDuration+= ISO8601ToSeconds(playlist[++index].duration);
        }
        firstVideoToPlay = playlist[index];
        //the time that the playlist exceeds the current time of the day
        let offset = ( totalDuration ) - now;
        //the seconds in wich the video should start playing
        let start = ISO8601ToSeconds(firstVideoToPlay.duration)-offset;

        //generates final playlist starting from firstVideoToPlay until the end of the day
        let startSeconds = start;
        playerPlaylist = [firstVideoToPlay.id];
        let playlistDuration = ISO8601ToSeconds(firstVideoToPlay.duration);
        let aDay = 86400;
        let dayLeft = aDay - now;
        while( playlistDuration < dayLeft ){
            if( index == playlist.length - 1 ) { index = -1; }
            firstVideoToPlay = playlist[++index];
            playerPlaylist.push(firstVideoToPlay.id);
            playlistDuration+= ISO8601ToSeconds(firstVideoToPlay.duration);
        }

        /**
        * Looks like the YouTube player support up to 135 videos on an inline playlist
        * cuts off the full day playlist to the original length
        */
        let newPlaylist = playerPlaylist.splice(0, playlist.length );
        setTimeout(()=>{
            this.setState({
                loading: false,
                playlist: newPlaylist,
                showCGBand: false,
                currentVideoTitle: '',
                startSeconds: startSeconds
            });
        },100);
    }

    _onReadyHandler( evt ) {
        //console.log(evt);
    }

    _onEndHandler( evt ) {
        console.log('END');
    }

    _onPauseHandler( evt ) {
        console.log('SHOW FOOTER ON PAUSE');
        clearTimeout(this.GCTimeoutId);
        this.refs.gcBand.show();
    }

    _onPlayHandler( evt ) {
        let GCBand = this.refs.gcBand;
        if( evt.target.getCurrentTime() < 5 ){
            GCBand.show( evt.target.getVideoData().title );
            this.GCTimeoutId = setTimeout(()=>{
                GCBand.hide();
            },5000);
        }else{
            console.log('HIDE FOOTER ON RESUME');
            GCBand.hide();
        }
    }

    _onStateChangeHandler( evt ) {
        console.log('STATE CHANGE');
        //console.log(evt);
    }

}

export default App;
