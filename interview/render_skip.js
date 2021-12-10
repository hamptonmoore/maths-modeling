const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
const height = 8
const width = 20
const scale = 48
const xoffset = 2
const yoffset = 2
const canvas = createCanvas((width+xoffset) * scale, (height+yoffset) * scale)
const ctx = canvas.getContext('2d')


data = JSON.parse(fs.readFileSync('./db.json', {encoding:'utf8', flag:'r'}));

ctx.fillStyle = "white"
ctx.fillRect(0, 0, (width+xoffset) * scale, (height+yoffset) * scale)

for (let i = 0; i < width; i++){
    for (let j = 0; j < height; j++){
        let name = `using first ${(0.05 * i).toFixed(2)}n search where i > max skip first ${j.toFixed(2)} maxes`
        if (data[name] == undefined) {
            console.log("So help me lord")
        } else {
            let color = Math.round(data[name].datasets["50;10000"] * 360 * 2.5)
            ctx.fillStyle = `hsl(${color}, 50%, 50%)`;
            ctx.fillRect(((i)+xoffset)*scale, (height-j-1)*scale, scale, scale)
        }
    }
}

for (let i = 0; i < width; i+=1){
    ctx.fillStyle = `black`;
    ctx.font = '16px Impact'
    ctx.fillText((0 + (0.05 * i)).toFixed(2).toString(), (i+xoffset)*scale + 5, (height+0.5)*scale)
    ctx.fillRect((i+xoffset)*scale, (height)*scale, 5, scale)
}

for (let j = 0; j < height; j+=1){
    ctx.fillStyle = `black`;
    ctx.font = '16px Impact'
    ctx.textAlign = 'right';
    ctx.fillText(((j)).toFixed(2).toString(), xoffset*scale, ((height-j-0.25) *scale))
    ctx.fillRect((xoffset-1)*scale, (j+1)*scale, scale, 5)
}

const out = fs.createWriteStream(__dirname + '/output.png')
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () =>  console.log('The PNG file was created.'))