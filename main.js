var displayImage = document.querySelector("img");
var wzoom = WZoom.create("#displayImage", {
    speed:7,
    dragScrollableOptions: {
        onGrab: function () {
            document.getElementById("displayImage").style.cursor = "grabbing";
        },
        onDrop: function () {
            document.getElementById("displayImage").style.cursor = "grab";
        }
    }
});

window.addEventListener("resize", () => {
    wzoom.prepare();
});

var fileInfo = { name: "", extension: "", start: 0, end: 0 };
var buttons = {
    play: document.getElementById("play"),
    pause: document.getElementById("pause"),
    next: document.getElementById("next"),
    back: document.getElementById("back")
};
var images = [];
var imageIndex;

var playing = false;

var previousTime = Date.now();

fetch("config.json")
    .then((response) => response.json())
    .then((data) => {
        fileInfo = { name: data.fileName, extension: data.fileExtension, start: data.sequenceStart, end: data.sequenceEnd };
        imageIndex = fileInfo.start;
        for (var i = fileInfo.start; i <= fileInfo.end; i++) {
            images[i] = new Image();
            images[i].src = `images/${fileInfo.name}${i}.${fileInfo.extension}`;
        }
        updateImage(fileInfo.start);
        wzoom.prepare();
        play();
        setInterval(animateFrames, 30);
    });

function animateFrames() {
    if (playing) {
        if (Date.now() - previousTime >= 1000 / parseInt(document.getElementById("fps").value)) {
            if(!nextFrame()) {
                pause();
            }
            previousTime = Date.now();
        }
    }
}

function updateImage(number) {
    displayImage.src = images[number].src;
}

function next() {
    if (!playing) {
        nextFrame();
    }
}
function previous() {
    if (imageIndex > fileInfo.start && !playing) {
        updateImage(--imageIndex);
    }
}

function nextFrame() {
    if (imageIndex < fileInfo.end) {
        updateImage(++imageIndex);
        return true;
    }
    return false;
}
function previousFrame() {
    if (imageIndex > fileInfo.start) {
        updateImage(--imageIndex);
    }
}

function pause() {
    if (playing) {
        playing = false;
        buttons.play.className = "";
        buttons.next.className = "";
        buttons.back.className = "";
        buttons.pause.className = "greyed";
    }
}

function play() {
    if(imageIndex === fileInfo.end) {
        imageIndex = fileInfo.start;
    }
    playing = true;
    buttons.play.className = "greyed";
    buttons.next.className = "greyed";
    buttons.back.className = "greyed";
    buttons.pause.className = "";
}
