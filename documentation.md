### Generate video from javascript  canvas 


## Introduction
The canvas element allows you to add more interactivity to your web pages because now you can control the graphics, images, and text dynamically with a scripting language. This article shows how drawn canvas can be manipulated to form a single video object.

## Codesandbox

Check the sandbox demo on  [Codesandbox](https://codesandbox.io/s/javascript-canvas-67dnjc).

<CodeSandbox
title="javascript-canvas"
id="javascript-canvas-67dnjc"
/>

You can also get the project Github repo using [Github](/).

## Prerequisites

Entry-level javascript and React/Nextjs knowledge.

## Setting Up the Sample Project

In your respective folder, create a new nextjs app using `npx create-next-app canvasvideo` using your terminal.
Head to your project root directory `cd canvasvideo`
 
Nextjs contains a serverside rendering backend which we will use for our media files upload. 
Set up [Cloudinary](https://cloudinary.com/?ap=em)  for our backend. 

Create your Cloudinary account using this [Link](https://cloudinary.com/console).
Log in to a dashboard containing the environment variable keys necessary for the Cloudinary integration in our project.

Include Cloudinary in your project dependencies: `npm install cloudinary`.

Create a new file named `.env.local` and paste the following guide to fill your environment variables. You can locate your variables from the Cloudinary dashboard. Use the guide below to fill your variables.

```
CLOUDINARY_CLOUD_NAME =

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET =
```

Restart your project: `npm run dev`.

In the `pages/api` directory, create a new file named `upload.js`. 
Configure  the Cloudinary environment keys and libraries.

```
var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
```
Create a handler function to execute the POST request. The function will receive media file data and post it to the Cloudinary website. It then captures the media file's Cloudinary link and sends it back as a response.

```
export default async function handler(req, res) {
    if (req.method === "POST") {
        let url = ""
        try {
            let fileStr = req.body.data;
            const uploadedResponse = await cloudinary.uploader.upload_large(
                fileStr,
                {
                    resource_type: "video",
                    chunk_size: 6000000,
                }
            );
            url = uploadedResponse.url
        } catch (error) {
            res.status(500).json({ error: "Something wrong" });
        }

        res.status(200).json({data: url});
    }
}
```
The code above concludes our backend.

In the front end, in order to create the video we need to create a canvas animation. Inside the index component use the following code in your return statement.

```
"pages/index.js"


return (
    <div className='container'>
      <h2>Generate video from javascript  canvas</h2>
      <div className='row'>
        <div className='column'>
          {link?
          <a href={link}>check link</a>
          :
          "click 'RECORD' to record canvas video"
          }
          <br />
          <canvas id="canvas" width="300" height="300" />
          <br />
          <button onClick={record}>RECORD</button>
        </div>
      </div>
    </div>
)
```
The code above, using the css files from the github repo should generate a UI like below:

![initial UI](https://res.cloudinary.com/dogjmmett/image/upload/v1657659991/Screenshot_1_gu2ujy.png "initial UI")

Now to animate the canvas. Start by importing the following 3 statehooks. We will use them as we move on. Also we will be animating part of the solar system inside the canvas. the useState variable below will be used to save the final link from our backend.

```
"pages/index.js"

import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [link, setLink] = useState('');

  var sun, moon, earth, canvas;

    return (
    <div className='container'>
      <h2>Generate video from javascript  canvas</h2>
      <div className='row'>
        <div className='column'>
          {link?
          <a href={link}>check link</a>
          :
          "click 'RECORD' to record canvas video"
          }
          <br />
          <canvas id="canvas" width="300" height="300" />
          <br />
          <button onClick={record}>RECORD</button>
        </div>
      </div>
    </div>
  )
}
```

Assign the three variables; sun, moon and earth to new image elements and use the images provided for the image sources.
We then use the setIntervall to call a `draw` function every 100 milliseconds. 

```
  useEffect(() => {
    canvas = document.getElementById('canvas');

    sun = document.createElement('img');
    moon = document.createElement('img');
    earth = document.createElement('img');

    sun.src = 'images/sun.png';
    moon.src = 'images/moon.png';
    earth.src = 'images/earth.png';
    setInterval(draw, 100);
  },[])
```
Let's create the `draw` function. Note that in the use effect hook we have a the canvas variable assigned to the DOM element. Therefore in the `draw` function, start by retreiving the canvas context. We use the lobalCompositeOperation property of the Canvas 2D API to the type of compositing operation to apply when drawing new shapes. 

```
"pages/index.js"

  const draw = () => {
    var ctx = canvas.getContext('2d');

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.save();
    ctx.translate(150, 150);
}
```

Use the following guide to draw the 3 images on the canvas. You can play with the code to make it behave to your preference. That should complete the animation procedure

```
"pages/index.js"

  const draw = () => {
    var ctx = canvas.getContext('2d');

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.save();
    ctx.translate(150, 150);

    // Earth
    var time = new Date();
    ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
    ctx.translate(105, 0);
    ctx.fillRect(0, -12, 50, 24); // Shadow
    ctx.drawImage(earth, -12, -12);

    // Moon
    ctx.save();
    ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
    ctx.translate(0, 28.5);
    ctx.drawImage(moon, -3.5, -3.5);
    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(sun, 0, 0, 300, 300);
}
```

Now that the canvas is animated, we want to record the canvas activity as video. First we create an array named `chunks` to store the recorded chunks as blobs. We grab a canvas media stream and initialize the media stream recorder. Once a recorder stops, we construct a complete Blob from all the chunks. We set the recording to stop in 3 seconds. You can set the time to your preference. The chunk blob will then be sent to the `uploadHandler` function for cloudinary upload.

```
"pages/index.js"

    const record = () => {
    console.log('canvas', canvas);
    const chunks = []; 
    const stream = canvas.captureStream(); // grab our canvas MediaStream
    const rec = new MediaRecorder(stream); // init the recorder

    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = e => uploadHandler(new Blob(chunks, { type: 'video/webm' }));

    rec.start();
    setTimeout(() => rec.stop(), 3000);
}
```
In the `uploadHandler` function, we use a file reader to encode the blobs to bse64 format and upload them to the backend using a POST method. The response will be a url string of the mediafile Cloudinary url. We store it in the `link` state hook so we can view the final project from the UI.

The final project should look like below:


![final UI](https://res.cloudinary.com/dogjmmett/image/upload/v1657659961/finalUI_dyyvee.png "final UI")

That completes it. You can use the article above to enjoy the exprerience. Enjoy your coding