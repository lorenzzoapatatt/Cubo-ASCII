let A = 0, B = 0, C = 0;

const cubeWidth = 10;
const width = 160;
const height = 44;

const incrementSpeed = 0.8;

const zBuffer = new Array(width * height).fill(0);
const buffer = new Array(width * height).fill(' ');

const backgroundASCIICode = ' ';
const distanceFromCam = 60;
const K1 = 40;

function calculateX(i, j, k) {
    return j * Math.sin(A) * Math.sin(B) * Math.cos(C) - 
           k * Math.cos(A) * Math.sin(B) * Math.cos(C) + 
           j * Math.cos(A) * Math.sin(C) + 
           k * Math.sin(A) * Math.sin(C) + 
           i * Math.cos(B) * Math.cos(C);
}

function calculateY(i, j, k) {
    return j * Math.cos(A) * Math.cos(C) + 
           k * Math.sin(A) * Math.cos(C) - 
           j * Math.sin(A) * Math.sin(B) * Math.sin(C) + 
           k * Math.cos(A) * Math.sin(B) * Math.sin(C) - 
           i * Math.cos(B) * Math.sin(C);
}

function calculateZ(i, j, k) {
    return k * Math.cos(A) * Math.cos(B) - 
           j * Math.sin(A) * Math.cos(B) + 
           i * Math.sin(B);
}

function calculateForSurface(cubeX, cubeY, cubeZ, ch) {
    const x = calculateX(cubeX, cubeY, cubeZ);
    const y = calculateY(cubeX, cubeY, cubeZ);
    const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;

    const ooz = 1 / z;

    const xp = Math.floor(width / 2 + K1 * ooz * x * 2);
    const yp = Math.floor(height / 2 + K1 * ooz * y);

    const idx = xp + yp * width;
    if (idx >= 0 && idx < width * height) {
        if (ooz > zBuffer[idx]) {
            zBuffer[idx] = ooz;
            buffer[idx] = ch;
        }
    }
}

function main() {
    setInterval(() => {
        buffer.fill(backgroundASCIICode);
        zBuffer.fill(0);

        // Desenha as 6 faces do cubo
        for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
            for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
                calculateForSurface(cubeX, cubeY, -cubeWidth, '.'); // Face de trás
                calculateForSurface(cubeX, cubeY, cubeWidth, '$');  // Face da frente
                calculateForSurface(cubeX, -cubeWidth, cubeY, '~'); // Face de baixo
                calculateForSurface(cubeX, cubeWidth, cubeY, '#');  // Face de cima
                calculateForSurface(-cubeWidth, cubeX, cubeY, ';'); // Lado esquerdo
                calculateForSurface(cubeWidth, cubeX, cubeY, '+');  // Lado direito
            }
        }

        let output = '';
        for (let i = 0; i < buffer.length; i++) {
            output += buffer[i];
            if ((i + 1) % width === 0) {
                output += '\n';
            }
        }

        console.log(output);

        // Incrementa os ângulos para rotação
        A += 0.005;
        B += 0.005;
        C += 0.03;
    }, 50);
}

main();
