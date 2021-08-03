const video = document.createElement('video')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const sunglass = document.getElementById('sunglass');
const mask = document.getElementById('mask');
const basketball = document.getElementById('basketball')
const tika = document.getElementById('tika')

let imgPath = './assets/sunglass.png'
let i = 162;
let j = 389;
let k = 5;
let delHeight = 40;
let delWidth = 40;
let delY = 20;
let delX = 20;
let xCenter;
let yCenter;
let indexFinger = { x: 100, y: 100 };
let middleFinger = { x: 100, y: 100 };


sunglass.addEventListener('click', function () {
    imgPath = './assets/sunglass.png'
})

mask.addEventListener('click', function () {
    imgPath = './assets/mask.png'
})

basketball.addEventListener('click', function () {
    imgPath = './assets/basketball.png'
})

tika.addEventListener('click', function (){
    imgPath = './assets/tika.png'
})

context.font = '20px Arial'
context.fillText("Loading!!!!", canvas.width / 3, canvas.height / 2);


function onResults1(results) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        results.image, 0, 0, canvas.width, canvas.height);
    if (results.multiFaceLandmarks) {
        if (imgPath == './assets/sunglass.png') {
            i = 162;
            j = 389;
            k = 5;
            delHeight = 40;
            delWidth = 40;
            delY = 20
            delX = 20;
        } else if(imgPath == './assets/mask.png'){
            i = 234;
            j = 454;
            k = 152;
            delHeight = 0;
            delWidth = 40;
            delY = 0;
            delX = 20;
        } else {
            i = 109;
            j = 338;
            k = 8;
            delHeight = 8;
            delWidth = 10;
            delY = 10;
            delX = 4;
        }
        leftIndex = results.multiFaceLandmarks[0][i]
        rightIndex = results.multiFaceLandmarks[0][j]
        bottomIndex = results.multiFaceLandmarks[0][k]

        xCenter = leftIndex.x * canvas.width
        yCenter = leftIndex.y * canvas.height
        height = bottomIndex.y * canvas.height - yCenter
        width = rightIndex.x * canvas.width - xCenter
    }
    let image = new Image()
    image.src = imgPath
    context.drawImage(image, xCenter - delX, yCenter - delY, width + delWidth, height + delHeight);


    context.restore();
}

function onResults2(results) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        results.image, 0, 0, canvas.width, canvas.height);
    if (results.multiHandLandmarks) {
        indexFinger.x = results.multiHandLandmarks[0][8].x
        indexFinger.y = results.multiHandLandmarks[0][8].y
        middleFinger.x = results.multiHandLandmarks[0][12].x
        middleFinger.y = results.multiHandLandmarks[0][12].y
        let dist = Math.pow(Math.pow(middleFinger.x - indexFinger.x, 2) + Math.pow(middleFinger.y - indexFinger.y, 2), 0.5)
        if (dist > 0.2) {
            xCenter = indexFinger.x * canvas.width;
            yCenter = indexFinger.y * canvas.height;
        }
    }
    const ballImage = new Image()
    ballImage.src = imgPath
    context.drawImage(ballImage, xCenter - 20, yCenter - 20, 60, 50);
    context.font = '8px Arial'
    context.fillText("Move ball by pointing index finger", canvas.width / 2.5, canvas.height - 10)
    context.fillText("Bring index and middle finger close to stop the ball", canvas.width / 2.5, canvas.height - 2)
    context.restore();
}

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});
faceMesh.setOptions({
    maxNumFaces: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults1);

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 2,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults2);

const camera = new Camera(video, {
    onFrame: async () => {
        if (imgPath == './assets/basketball.png') {
            await await hands.send({ image: video });
        } else {
            await faceMesh.send({ image: video });
        }
    }
});
camera.start()