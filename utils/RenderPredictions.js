import { throttle } from "lodash";

const RenderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top"

  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction["bbox"];
    const isPerson = prediction.class === "person"
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF"
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = `rgb(255, 0, 0, ${isPerson ? 0.2 : 0})`
    ctx.fillRect(x, y, width, height)

    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10);
    ctx.strokeRect(x, y, textWidth + 4, textHeight + 4)
    
    ctx.fillStyle = "#FFF";
    ctx.fillText(prediction.class, x, y);

    if (prediction.class === "finger") {
      playAudio();
    }
  })
}

const playAudio = throttle(() => {
  const audio = new Audio("/Unicorn Heads  Modern.mp3");
  audio.play();
}, 10000)

export default RenderPredictions
