import React, { Component } from 'react';
import videojs from 'video.js';


export default class VideoPlayer extends Component {

    constructor (props) {
        super(props);
        this.state = {
            viewMilestone: 0,       // 25, 50, 75, 100
        }
        this.videoInfo = {
            duration: 0
        }
    }

    componentDidMount() {
        const that = this;

        this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
            // console.log('onPlayerReady', this)
            
            if(that.props.onTimeUpdate) {
                this.on('timeupdate', () => that.props.onTimeUpdate(that.player))
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        // Handle video change
        if(this.player && this.props.sources.length > 0) {
            if(nextProps.sources[0].src !== this.props.sources[0].src) {
                this.player.src(nextProps.sources[0]);
                console.log('video has changed')
            }
        }
    }
  
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }
  
    render() {
        return (
            <div data-vjs-player>
                <video
                    ref={ n => this.videoNode = n }
                    className="video-js"
                    >
                </video>
            </div>
        )
    }
}
