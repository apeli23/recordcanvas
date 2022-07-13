import { useRef, useState, useEffect } from "react";


export default function Home() {
  const [link, setLink] = useState('');

  var sun, moon, earth, canvas;


  useEffect(() => {
    canvas = document.getElementById('canvas');

    sun = document.createElement('img');
    moon = document.createElement('img');
    earth = document.createElement('img');

    sun.src = 'images/sun.png';
    moon.src = 'images/moon.png';
    earth.src = 'images/earth.png';
    setInterval(draw, 100);
  }, [])

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

  const uploadHandler = async (blob) => {
    await readFile(blob).then((encoded_file) => {
      try {
        fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ data: encoded_file }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            setLink(data.data);

          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  function readFile(file) {
    console.log("readFile()=>", file);
    return new Promise(function (resolve, reject) {
      let fr = new FileReader();

      fr.onload = function () {
        resolve(fr.result);
      };

      fr.onerror = function () {
        reject(fr);
      };

      fr.readAsDataURL(file);
    });
  };

  return (
    <div className='container'>
      <h2>Generate video from javascript  canvas</h2>
      <div className='row'>
        <div className='column'>
          {link ?
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
