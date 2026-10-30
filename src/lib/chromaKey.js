// Recorta el fondo verde de un <video> en WebGL y lo dibuja con transparencia
// en un <canvas>. Funciona en cualquier navegador (no depende de WebM con alpha).

// Verde de fondo de los clips de la mascota (0, 154, 66)
const KEY = [0, 154 / 255, 66 / 255];
// Zona del video que se muestra (en 0–1): el robot ocupa el centro del cuadro
const CROP = [0.2, 0.13, 0.7, 0.75];

const VERT = `
attribute vec2 a_pos;
uniform vec4 u_crop;
varying vec2 v_uv;
void main() {
  vec2 uv = a_pos * 0.5 + 0.5;
  uv.y = 1.0 - uv.y;
  v_uv = u_crop.xy + uv * u_crop.zw;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Distancia de color en el plano CbCr: ignora el brillo, así que las sombras
// y los reflejos del robot no se confunden con el fondo.
const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec3 u_key;
varying vec2 v_uv;
vec2 cbcr(vec3 c) {
  return vec2(-0.169 * c.r - 0.331 * c.g + 0.5 * c.b, 0.5 * c.r - 0.419 * c.g - 0.081 * c.b);
}
void main() {
  vec3 c = texture2D(u_tex, v_uv).rgb;
  float d = distance(cbcr(c), cbcr(u_key));
  float a = smoothstep(0.08, 0.2, d);
  // quita el reflejo verde de los bordes
  c.g = mix(c.g, min(c.g, max(c.r, c.b)), 0.85);
  gl_FragColor = vec4(c * a, a);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export function createChromaKey(canvas) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  gl.uniform4fv(gl.getUniformLocation(prog, 'u_crop'), CROP);
  gl.uniform3fv(gl.getUniformLocation(prog, 'u_key'), KEY);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return {
    resize(w, h) {
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(video) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    },
  };
}
