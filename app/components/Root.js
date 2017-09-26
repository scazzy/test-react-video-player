import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import VideoPlayer from './VideoPlayer';
import uuid from 'uuid/v4';
import style from '../styles';
import { classnames as cx } from '../helpers';


export default class Root extends Component {
    constructor (props) {
        super(props);

        const logData = this.getViewLog();

        this.state = {
            userId: uuid(),
            video: null,
            viewMilestone: 0,
            log: logData
        }

    }

    componentWillUpdate(nextProps, nextState) {
        if(this.state.video) {
            if(nextState.video.name !== this.state.video.name) {
                this.setState({
                    viewMilestone: 0
                })
            }
        }
    }

    onTimeUpdate = (player) => {
        
        const percent = Math.floor((player.currentTime() / player.duration() * 100));
        // See actual timeupdates
        // console.log('ontimeupdate', percent)

        // This weird criteria is to handle edge cases when timeupdate doesn't trigger sharply 25%, 50%, but instead a percent or two around
        if(percent > 0 && (percent % 25 === 0 || percent % 25 <= 2) && percent > this.state.viewMilestone+20) { // x25%, 10 = arbitary number

            this.setState({
                // viewMilestone: percent, // Tho this gives 26, 51, 76, sometimes, which is fine as our goal is to track CROSSING OF 25, 50, 75, 100
                viewMilestone: percent >= 100 ? 100 : (percent>=75 ? 75: (percent>=50?50: (percent>=25?25: 0)))
            })
            this.addViewLog();

            // We can also use switch case to handle that
            // case percent >= 25 && percent < 27:
            //      log (25)
        }
    }

    onDrop = (files) => {
        if(files.length > 0) {
            this.setState({
                video: files[0]
            });
        }
    }

    /**
     * Add/Update view log the current video in view
     * Storing log in localStorage temporarily. States aren't best solution to store logs
     * Optimal options - via api to a proper tracking tool/db, inhouse or 3rd party like mixpanel
     */
    addViewLog = () => {
        // Log in localStorage
        if(window.localStorage && this.state.video) {
            // { userId, videoName, milestone }
            const dataKey = this.state.userId + '_' + this.state.video.name
            
            let logData = this.state.log;
            
            logData[dataKey] = {
                userId: this.state.userId,
                video: this.state.video.name,
                milestone: this.state.viewMilestone
            };
            
            localStorage.setItem('videoViewsLog', JSON.stringify(logData));
        }
    }

    getViewLog = () => {
        if(window.localStorage) {
            const log = localStorage.getItem('videoViewsLog');
            return log ? JSON.parse(log) : {};
        }
        return {}
    }

    
    
    render () {
        let videoJsOptions = {};
        if(this.state.video) {
            videoJsOptions = {
                autoplay: false,
                controls: true,
                sources: [{
                    src: this.state.video.preview,  // video.preview will work mostly, but better to use FileReader api
                    type: 'video/mp4'
                }]
            }
        }

        const logData = this.state.log;
        const statsRender = Object.keys(logData).map((key, i) => {
            return `User <b>${logData[key]['userId']}</b> watched <b>${logData[key]['video']}</b> upto <b>${logData[key]['milestone']}%</b>`
        })
        

        return (
            <div className={cx(style.container, style['pure-g'])}>
                
                <div className={cx(style['pure-u-3-4'])}>
                    <div className={cx(style['video-wrapper'])}>
                        { this.state.video &&
                            (<VideoPlayer
                                {...videoJsOptions}
                                onTimeUpdate={this.onTimeUpdate}
                            />)
                        }
                    </div>
                    
                    {this.state.video && 
                    <p>
                        Viewed milestone: {this.state.viewMilestone}%
                    </p>
                    }

                    <hr/>

                    <h2>View Stats</h2>
                    <small>(Each refresh means a new user)</small>
                    <div dangerouslySetInnerHTML={{ __html: statsRender.join('<br/>') }}></div>
                </div>

                <aside className={cx(style['pure-u-1-4'], style['sidebar'])}>
                    <p>Please add or update a video here</p>
                    <Dropzone onDrop={this.onDrop} accept="video/mp4">
                        <p>Drop your video here, or click to upload</p>
                    </Dropzone>
                </aside>
                
            </div>
        )
    }
}