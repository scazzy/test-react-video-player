# React Video Player

**Setup**

 * Git clone this repo
 * Install `yarn` if you don't have already
 * Run `yarn` to install all dependencies
 * Run `yarn start:dev` to start the webpack-dev-server

You can also choose to test if the transpilation is working fine using `yarn webpack [options]`


**Usage**

- Kindly note that it's a minimal reproduction of the requirements
- Drag or click on the box in right sidebar to select a video. Currently only `.mp4` supported
- Left black area is where the video will appear. Click to play the video
- You can see the "Viewed milestones" ranging 25, 50, 75 and 100% while video is being played
- Stats/logs are currently stored in localStorage instead of a disk file

**Features**

 - You can upload a new video while a video already exists in the view (irrespective of being played or paused)
 - Each refresh acts like a new user. Hence, the the view log is based on each user watching `n` videos to get better idea of stats from multiple users
 - Used css-modules with sass

**Optimizations**

 - As mentioned, this is a quick raw implementation and has hundreds of optimization possibilities. There's a bit of commenting in the code as well
 - Including, better UI, building a more robust video uploader with better file handling, compression, etc
 - Currently the video is being played simply from the preview of the file available. A better option is to read the uploaded file using FileReader api. For a more robust mechanism, the video can be uploaded on server using more backward-compatible options
 - While have kept the `VideoPlayer` Component abstract from the application logic of data logging, it isn't ideal to keep actual app in Root.js. Better way to use containers and normalized components for the app. Since this is just a test
 - Have used `Dropzone` library to help with drag upload to quickly help with file type filterations. In ideal condition, I'd use the HTML5 drag and drop API (like I've used in this app http://output.jsbin.com/rafacof)
 - Stats/Log shouldn't be in component state, nor stored in localstorage. Localstorage only provides a set limit of usage, and a file based option should be used, also allowing for a app-wide logging over a browser-wide logging
 - Haven't implemented SSR. Currently works on webpack-dev-server. If used webpack, can also run the index.html inside the `dist/` directory
 - Many more, of course :)

----
Feel free to give feedback