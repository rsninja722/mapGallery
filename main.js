var displayImage = document.querySelector("img");
var wzoom = WZoom.create('#displayImage', {
    dragScrollableOptions: {
        onGrab: function () {
            document.getElementById('displayImage').style.cursor = 'grabbing';
        },
        onDrop: function () {
            document.getElementById('displayImage').style.cursor = 'grab';
        }
    }
});

window.addEventListener('resize', () => {
    wzoom.prepare();
});

var fileInfo = {name:"",extension:"",start:0,end:0};
var images = [];
var imageIndex;

fetch("config.json").then(response => response.json()).then(data => {
    fileInfo = {name:data.fileName,extension:data.fileExtension,start:data.sequenceStart,end:data.sequenceEnd};
    imageIndex = fileInfo.start;
    for(var i=fileInfo.start;i<=fileInfo.end;i++) {
        images[i] = new Image();
        images[i].src = `images/${fileInfo.name}${i}.${fileInfo.extension}`;
    }
    updateImage(fileInfo.start);
    wzoom.prepare();
});

function updateImage(number) {
    displayImage.src = images[number].src;
}

function next() {
    if(imageIndex < fileInfo.end) {
        updateImage(++imageIndex);
    }
}
function previous() {
    if(imageIndex > fileInfo.start) {
        updateImage(--imageIndex);
    }
}