/* =====================================================================
   Motor FC de Obra · v1 (16/11/2026)
   Foto do vão → contramarco → reboco → esquadria do Banco de Tipologias FC.
   Escrito do zero pela FC Consultoria em Esquadria, sem reaproveitar código de terceiros.
   Técnica própria: homografia por sistema linear 8×8 e desenho em perspectiva
   por malha de triângulos (cada triângulo com transformação afim no canvas).
   © FC Consultoria em Esquadria · CNPJ 52.985.682/0001-32 · uso exclusivo
   ===================================================================== */
(function (G) {
  'use strict';

  /* ---------------- 1. Matemática ---------------- */

  // Eliminação de Gauss com pivô parcial (n×n)
  function gauss(M, y) {
    const n = y.length, A = M.map((r, i) => r.concat([y[i]]));
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      if (Math.abs(A[p][c]) < 1e-12) return null;
      if (p !== c) { const t = A[p]; A[p] = A[c]; A[c] = t; }
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = A[r][c] / A[c][c];
        if (f) for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
      }
    }
    return A.map((r, i) => r[n] / r[i]);
  }

  // Transformação projetiva que leva os 4 pontos "de" nos 4 pontos "para"
  function projetiva(de, para) {
    const M = [], y = [];
    for (let i = 0; i < 4; i++) {
      const [x, z] = de[i], [X, Z] = para[i];
      M.push([x, z, 1, 0, 0, 0, -x * X, -z * X]); y.push(X);
      M.push([0, 0, 0, x, z, 1, -x * Z, -z * Z]); y.push(Z);
    }
    const h = gauss(M, y);
    return h ? h.concat([1]) : null;
  }
  function leva(h, x, z) {
    const w = h[6] * x + h[7] * z + h[8];
    return [(h[0] * x + h[1] * z + h[2]) / w, (h[3] * x + h[4] * z + h[5]) / w];
  }

  // Coloca 4 cantos na ordem: alto-esquerda, alto-direita, baixo-direita, baixo-esquerda
  function cantosEmOrdem(pts) {
    const cx = pts.reduce((s, p) => s + p[0], 0) / 4, cy = pts.reduce((s, p) => s + p[1], 0) / 4;
    const giro = pts.slice().sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
    let ini = 0;
    giro.forEach((p, i) => { if (p[0] + p[1] < giro[ini][0] + giro[ini][1]) ini = i; });
    const r = giro.slice(ini).concat(giro.slice(0, ini));
    // garante sentido horário na tela (y para baixo)
    const area = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[2][0] - r[0][0]) * (r[1][1] - r[0][1]);
    return area < 0 ? [r[0], r[3], r[2], r[1]] : r;
  }

  function dentro(p, poli) {
    let d = false;
    for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
      const [xi, yi] = poli[i], [xj, yj] = poli[j];
      if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) d = !d;
    }
    return d;
  }

  /* ---------------- 2. Desenho em perspectiva ---------------- */

  // Um triângulo da imagem (s) desenhado no triângulo da tela (d) por transformação afim
  function triangulo(g, img, s, d) {
    const [s0, s1, s2] = s, [d0, d1, d2] = d;
    const den = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]);
    if (Math.abs(den) < 1e-9) return;
    const a = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / den;
    const c = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / den;
    const b = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / den;
    const dd = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / den;
    const e = d0[0] - a * s0[0] - c * s0[1], f = d0[1] - b * s0[0] - dd * s0[1];
    // recorte levemente aumentado a partir do centro (evita frestas entre triângulos)
    const mx = (d0[0] + d1[0] + d2[0]) / 3, my = (d0[1] + d1[1] + d2[1]) / 3;
    const ab = p => { const vx = p[0] - mx, vy = p[1] - my, L = Math.hypot(vx, vy) || 1; return [p[0] + vx / L * 0.7, p[1] + vy / L * 0.7]; };
    const q0 = ab(d0), q1 = ab(d1), q2 = ab(d2);
    g.save();
    g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.lineTo(q2[0], q2[1]); g.closePath(); g.clip();
    g.setTransform(a, b, c, dd, e, f);
    g.drawImage(img, 0, 0);
    g.restore();
  }

  // Malha de triângulos: para cada ponto (u,v) de 0 a 1, onde ele está na imagem (fs) e na tela (fd)
  function malha(g, img, fs, fd, n) {
    n = n || 16; const pt = [];
    for (let j = 0; j <= n; j++) { pt[j] = []; for (let i = 0; i <= n; i++) pt[j][i] = { s: fs(i / n, j / n), d: fd(i / n, j / n) }; }
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const A = pt[j][i], B = pt[j][i + 1], C = pt[j + 1][i + 1], D = pt[j + 1][i];
      triangulo(g, img, [A.s, B.s, C.s], [A.d, B.d, C.d]);
      triangulo(g, img, [A.s, C.s, D.s], [A.d, C.d, D.d]);
    }
  }
  // Imagem inteira (retângulo) dentro do quadrilátero da tela, em perspectiva
  function emPerspectiva(g, img, quad, n) {
    const W = img.width, H = img.height, h = projetiva([[0, 0], [1, 0], [1, 1], [0, 1]], quad);
    if (!h) return;
    malha(g, img, (u, v) => [u * W, v * H], (u, v) => leva(h, u, v), n);
  }
  // O contrário: o trecho da foto dentro do quadrilátero, "endireitado" no retângulo W×H
  function endireitar(g, foto, quad, W, H, n) {
    const h = projetiva([[0, 0], [1, 0], [1, 1], [0, 1]], quad);
    if (!h) return;
    malha(g, foto, (u, v) => leva(h, u, v), (u, v) => [u * W, v * H], n);
  }

  /* ---------------- 3. Camadas do vão (desenhadas "de frente") ---------------- */

  const PAREDE = [
    { id: 'cimento', n: 'Cimento', c: '#b9b4ab' },
    { id: 'areia', n: 'Areia', c: '#cfc3ad' },
    { id: 'gelo', n: 'Branco gelo', c: '#e7e5df' },
    { id: 'cinza', n: 'Cinza claro', c: '#c9cbc9' },
    { id: 'palha', n: 'Palha', c: '#ddd2b8' }
  ];

  // Ruído determinístico (mesma parede sempre igual)
  function sorteio(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function tom(hex, k) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = x => Math.max(0, Math.min(255, Math.round(x * k)));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }

  // Monta o "retrato de frente" do vão com margem de reboco em volta
  // vao: { W, H (mm), contramarco:{on,cor}, reboco:{on,cor}, img (esquadria pronta ou null) }
  function retrato(vao, cores) {
    const W = vao.W, H = vao.H;
    const margem = vao.reboco && vao.reboco.on ? Math.max(120, Math.min(260, Math.max(W, H) * 0.12)) : 0; // mm
    const lim = Math.max(700, Math.min(1600, (vao.ladoPx || 900) * 1.4));
    const esc = Math.min(lim / (W + 2 * margem), lim / (H + 2 * margem)); // px por mm (acompanha o tamanho do vão na foto)
    const cw = Math.round((W + 2 * margem) * esc), ch = Math.round((H + 2 * margem) * esc);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d');
    // fundo: a própria foto da obra, endireitada (deixa o retrato opaco e sem emendas na hora de aplicar)
    if (vao.foto && vao.cantos) endireitar(g, vao.foto, quadroComMargem(vao.cantos, W, H, margem), cw, ch, 18);
    const X = margem * esc, Y = margem * esc, VW = W * esc, VH = H * esc;

    // reboco (anel em volta do vão, borda externa irregular e suave)
    if (margem) {
      const base = (PAREDE.find(p => p.id === vao.reboco.cor) || PAREDE[0]).c;
      const t = document.createElement('canvas'); t.width = cw; t.height = ch;
      const tg = t.getContext('2d'); tg.fillStyle = base; tg.fillRect(0, 0, cw, ch);
      const r = sorteio(W * 7 + H * 13);
      for (let k = 0; k < cw * ch / 90; k++) { tg.fillStyle = tom(base, 0.9 + r() * 0.18); tg.globalAlpha = 0.35; tg.fillRect(r() * cw, r() * ch, 1 + r() * 2.2, 1 + r() * 2.2); }
      tg.globalAlpha = 1;
      // máscara: borda externa com recortes leves (acabamento de obra)
      const m = document.createElement('canvas'); m.width = cw; m.height = ch;
      const mg = m.getContext('2d'), fe = margem * esc;
      mg.filter = `blur(${Math.max(2, fe * 0.08)}px)`;
      mg.fillStyle = '#000'; mg.beginPath();
      const passos = 48, bord = (i, n, a, b) => a + (b - a) * i / n;
      const jit = () => (r() - 0.5) * fe * 0.18;
      const pts = [];
      for (let i = 0; i <= passos; i++) pts.push([bord(i, passos, fe * 0.15, cw - fe * 0.15), fe * 0.15 + jit()]);
      for (let i = 0; i <= passos; i++) pts.push([cw - fe * 0.15 + jit(), bord(i, passos, fe * 0.15, ch - fe * 0.15)]);
      for (let i = 0; i <= passos; i++) pts.push([bord(i, passos, cw - fe * 0.15, fe * 0.15), ch - fe * 0.15 + jit()]);
      for (let i = 0; i <= passos; i++) pts.push([fe * 0.15 + jit(), bord(i, passos, ch - fe * 0.15, fe * 0.15)]);
      pts.forEach((p, i) => i ? mg.lineTo(p[0], p[1]) : mg.moveTo(p[0], p[1])); mg.closePath(); mg.fill();
      tg.globalCompositeOperation = 'destination-in'; tg.drawImage(m, 0, 0);
      tg.globalCompositeOperation = 'source-over'; tg.clearRect(X, Y, VW, VH); // o vão fica aberto: reboco só em volta
      g.drawImage(t, 0, 0);
      // quina do reboco com o vão (sombra fina)
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = Math.max(1.5, esc * 6); g.strokeRect(X, Y, VW, VH);
    }

    // contramarco (requadro de alumínio no vão)
    let ix = X, iy = Y, iw = VW, ih = VH;
    if (vao.contramarco && vao.contramarco.on) {
      const cc = cores[vao.contramarco.cor] || cores.branco || { b: '#c3c6c9', l: '#e6e8ea', d: '#8d9196' };
      const e = Math.max(4, 32 * esc); // 32 mm de face aparente
      const grad = (x0, y0, x1, y1) => { const gg = g.createLinearGradient(x0, y0, x1, y1); gg.addColorStop(0, cc.d); gg.addColorStop(0.35, cc.l); gg.addColorStop(0.75, cc.b); gg.addColorStop(1, cc.d); return gg; };
      g.fillStyle = grad(0, Y, 0, Y + e); g.fillRect(X, Y, VW, e);
      g.fillStyle = grad(0, Y + VH, 0, Y + VH - e); g.fillRect(X, Y + VH - e, VW, e);
      g.fillStyle = grad(X, 0, X + e, 0); g.fillRect(X, Y + e, e, VH - 2 * e);
      g.fillStyle = grad(X + VW, 0, X + VW - e, 0); g.fillRect(X + VW - e, Y + e, e, VH - 2 * e);
      g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = Math.max(1, esc * 1.5);
      g.strokeRect(X + 0.5, Y + 0.5, VW - 1, VH - 1); g.strokeRect(X + e, Y + e, VW - 2 * e, VH - 2 * e);
      // cantos a 45°
      g.beginPath(); g.moveTo(X, Y); g.lineTo(X + e, Y + e); g.moveTo(X + VW, Y); g.lineTo(X + VW - e, Y + e);
      g.moveTo(X + VW, Y + VH); g.lineTo(X + VW - e, Y + VH - e); g.moveTo(X, Y + VH); g.lineTo(X + e, Y + VH - e); g.stroke();
      ix += e; iy += e; iw -= 2 * e; ih -= 2 * e;
    }

    // esquadria
    if (vao.img) {
      g.save(); g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = Math.max(4, esc * 10); g.shadowOffsetY = Math.max(1, esc * 3);
      g.drawImage(vao.img, ix, iy, iw, ih); g.restore();
    }
    return { canvas: c, margemMM: margem };
  }

  // Quadrilátero do retrato completo (vão + margem de reboco), a partir dos 4 cantos do vão
  function quadroComMargem(cantos, W, H, margem) {
    if (!margem) return cantos;
    const h = projetiva([[0, 0], [W, 0], [W, H], [0, H]], cantos);
    if (!h) return cantos;
    return [[-margem, -margem], [W + margem, -margem], [W + margem, H + margem], [-margem, H + margem]].map(p => leva(h, p[0], p[1]));
  }

  // Proporção real do vão marcado (largura/altura), estimada pelos lados
  function proporcao(c) {
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const w = (d(c[0], c[1]) + d(c[3], c[2])) / 2, h = (d(c[0], c[3]) + d(c[1], c[2])) / 2;
    return h > 1 ? w / h : 1;
  }

  /* ---------------- 4. Conferência dos cantos (ponto verde quando está no lugar) ---------------- */
  // Mapa de bordas da foto (feito uma vez por foto)
  function mapaBordas(foto) {
    const w = foto.width, h = foto.height;
    const d = foto.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const cz = new Float32Array(w * h);
    for (let i = 0, k = 0; i < cz.length; i++, k += 4) cz[i] = d[k] * 0.299 + d[k + 1] * 0.587 + d[k + 2] * 0.114;
    const sv = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; sv[i] = (cz[i] * 4 + cz[i - 1] + cz[i + 1] + cz[i - w] + cz[i + w]) / 8; }
    return { w, h, sv };
  }
  function gradiente(m, x, y) {
    x = Math.round(x); y = Math.round(y);
    if (x < 2 || y < 2 || x > m.w - 3 || y > m.h - 3) return [0, 0];
    const a = (dx, dy) => m.sv[(y + dy) * m.w + x + dx];
    return [(a(1, -1) + 2 * a(1, 0) + a(1, 1)) - (a(-1, -1) + 2 * a(-1, 0) + a(-1, 1)),
            (a(-1, 1) + 2 * a(0, 1) + a(1, 1)) - (a(-1, -1) + 2 * a(0, -1) + a(1, -1))];
  }
  // Para cada lado marcado: acha a borda real do vão ao longo do lado inteiro e mede
  // quanto o começo e o fim do lado estão afastados dela (em pixels da foto)
  function desvioDoLado(m, A, B) {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]); if (L < 12) return null;
    const tx = (B[0] - A[0]) / L, ty = (B[1] - A[1]) / L, nx = -ty, ny = tx;
    const R = Math.max(10, Math.min(40, L * 0.07)), N = 30, pts = [];
    for (let k = 0; k < N; k++) {
      const t = (0.06 + 0.88 * k / (N - 1)) * L, cx = A[0] + tx * t, cy = A[1] + ty * t, f = [];
      for (let o = -R; o <= R; o++) { const g = gradiente(m, cx + nx * o, cy + ny * o); f.push(Math.abs(g[0] * nx + g[1] * ny)); }
      const top = Math.max(...f); if (top < 60) continue;
      // entre os picos fortes, fica o mais perto da linha marcada (evita pegar a 2ª borda do vão)
      let melhor = null;
      for (let i = 1; i < f.length - 1; i++) if (f[i] >= f[i - 1] && f[i] >= f[i + 1] && f[i] >= top * 0.25 && f[i] >= 60) {
        const o = i - R; if (melhor === null || Math.abs(o) < Math.abs(melhor)) melhor = o; }
      if (melhor !== null) pts.push([t, melhor]);
    }
    if (pts.length < N * 0.45) return null; // borda pouco visível: não dá para conferir
    // reta o = a + b·t: escolhe a reta que passa pelo maior número de pontos (ignora outras bordas e sujeira) e refina
    const ajusta = P => { let st = 0, so = 0, stt = 0, sto = 0; P.forEach(([t, o]) => { st += t; so += o; stt += t * t; sto += t * o; });
      const n = P.length, den = n * stt - st * st; const b = den ? (n * sto - st * so) / den : 0; return { a: (so - b * st) / n, b }; };
    let melhorSet = [];
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const [t1, o1] = pts[i], [t2, o2] = pts[j]; if (t2 - t1 < L * 0.15) continue;
      const b = (o2 - o1) / (t2 - t1), a = o1 - b * t1;
      const set = pts.filter(([t, o]) => Math.abs(o - a - b * t) <= 1.5);
      if (set.length > melhorSet.length) melhorSet = set;
    }
    if (melhorSet.length < N * 0.4) return null;
    const r = ajusta(melhorSet);
    // linha da borda real em coordenadas da foto (do começo ao fim do lado)
    const em = t => { const o = r.a + r.b * t; return [A[0] + tx * t + nx * o, A[1] + ty * t + ny * o]; };
    return { ini: Math.abs(r.a), fim: Math.abs(r.a + r.b * L), linha: { p: em(0), d: [tx + nx * r.b, ty + ny * r.b] } };
  }
  // Situação de cada canto:
  //   'borda' → em cima das duas bordas reais do vão
  //   'regra' → um lado não tem borda visível (ex.: porta sem soleira, pessoa na frente):
  //             o canto está na continuação da borda que aparece e o lado sem borda
  //             está paralelo ao lado oposto (regra de encaixe)
  //   false   → fora do lugar
  // alvo: onde o canto deveria ficar (para "grudar" quando o ponto é solto perto)
  // Cruzamento de duas retas (ponto p, direção d)
  function cruza(r, s) {
    const den = r.d[0] * s.d[1] - r.d[1] * s.d[0]; if (Math.abs(den) < 1e-9) return null;
    const t = ((s.p[0] - r.p[0]) * s.d[1] - (s.p[1] - r.p[1]) * s.d[0]) / den;
    return [r.p[0] + r.d[0] * t, r.p[1] + r.d[1] * t];
  }
  function situacaoCantos(m, cantos) {
    const tol = Math.max(1.5, Math.hypot(m.w, m.h) * 0.0016);
    const lados = [0, 1, 2, 3].map(i => desvioDoLado(m, cantos[i], cantos[(i + 1) % 4]));
    const dir = i => { const A = cantos[i], B = cantos[(i + 1) % 4], L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1; return [(B[0] - A[0]) / L, (B[1] - A[1]) / L]; };
    const dirReal = i => { const l = lados[i]; if (!l) return dir(i); const L = Math.hypot(l.linha.d[0], l.linha.d[1]) || 1; return [l.linha.d[0] / L, l.linha.d[1] / L]; };
    const angulo = (u, v) => Math.acos(Math.min(1, Math.abs(u[0] * v[0] + u[1] * v[1]))) * 180 / Math.PI;
    return cantos.map((p, i) => {
      const s = (i + 3) % 4, iSai = i, sai = lados[iSai], chega = lados[s];
      if (sai && chega) {
        const alvo = cruza({ p: chega.linha.p, d: chega.linha.d }, { p: sai.linha.p, d: sai.linha.d });
        return { estado: sai.ini <= tol && chega.fim <= tol ? 'borda' : false, alvo, tol };
      }
      if (!sai && !chega) return { estado: false, alvo: null, tol };
      // um lado visível (V) e um sem borda (S)
      const vis = sai || chega, offV = sai ? sai.ini : chega.fim;
      const iS = sai ? s : iSai, viz = sai ? cantos[s] : cantos[(i + 1) % 4];
      const oposto = dirReal((iS + 2) % 4);
      const alvo = cruza({ p: vis.linha.p, d: vis.linha.d }, { p: viz, d: oposto });
      const paralelo = angulo(dir(iS), oposto) <= 1.2;
      return { estado: offV <= tol && paralelo ? 'regra' : false, alvo, tol };
    });
  }
  function cantosCertos(m, cantos) { return situacaoCantos(m, cantos).map(x => x.estado); }

  /* ---------------- 5. Limpar a foto (apagar pessoa, andaime, entulho) ---------------- */
  // mascara: canvas do mesmo tamanho da foto, pintado onde deve apagar.
  // 1) preenche de fora para dentro com a média das cores vizinhas (base lisa)
  // 2) devolve a textura (blocos, reboco, piso) trazida de uma faixa ao lado, na mesma altura
  function apagar(foto, mascara) {
    const W = foto.width, H = foto.height;
    const mk = mascara.getContext('2d').getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    const M0 = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) if (mk[i * 4 + 3] > 20) { M0[i] = 1; const x = i % W, y = (i / W) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const out = document.createElement('canvas'); out.width = W; out.height = H; const og = out.getContext('2d'); og.drawImage(foto, 0, 0);
    if (x1 < 0) return out;
    // folga de 2 px em volta do que foi pintado (pega a sombra/borda do objeto)
    const M = new Uint8Array(W * H);
    for (let y = Math.max(0, y0 - 2); y <= Math.min(H - 1, y1 + 2); y++) for (let x = Math.max(0, x0 - 2); x <= Math.min(W - 1, x1 + 2); x++) {
      let on = 0; for (let dy = -2; dy <= 2 && !on; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && M0[yy * W + xx]) { on = 1; break; } }
      M[y * W + x] = on; }
    x0 = Math.max(0, x0 - 3); y0 = Math.max(0, y0 - 3); x1 = Math.min(W - 1, x1 + 3); y1 = Math.min(H - 1, y1 + 3);
    const img = og.getImageData(0, 0, W, H), d = img.data;
    // base lisa: camadas de fora para dentro
    const base = new Float32Array(W * H * 3), feito = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) if (!M[i]) { feito[i] = 1; base[i * 3] = d[i * 4]; base[i * 3 + 1] = d[i * 4 + 1]; base[i * 3 + 2] = d[i * 4 + 2]; }
    let falta = true, volta = 0;
    while (falta && volta++ < 4000) {
      falta = false; const novos = [];
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * W + x; if (feito[i]) continue;
        let r = 0, g = 0, b = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const j = yy * W + xx; if (feito[j]) { r += base[j * 3]; g += base[j * 3 + 1]; b += base[j * 3 + 2]; n++; } }
        if (n >= 2) novos.push(i, r / n, g / n, b / n); else falta = true; }
      for (let k = 0; k < novos.length; k += 4) { const i = novos[k]; base[i * 3] = novos[k + 1]; base[i * 3 + 1] = novos[k + 2]; base[i * 3 + 2] = novos[k + 3]; feito[i] = 1; }
      if (!novos.length) break;
    }
    // textura: detalhe fino (pixel − média local) de uma faixa ao lado, sem objeto
    const larg = x1 - x0 + 1, borr = (x, y, c) => { let s = 0, n = 0; for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; s += d[(yy * W + xx) * 4 + c]; n++; } return s / n; };
    const livre = dx => { let ok = 0, tot = 0; for (let y = y0; y <= y1; y += 3) for (let x = x0; x <= x1; x += 3) { if (!M[y * W + x]) continue; tot++; const xx = x + dx; if (xx >= 0 && xx < W && !M[y * W + xx]) ok++; } return tot ? ok / tot : 0; };
    const opc = [larg + 6, -(larg + 6), 2 * larg + 12, -(2 * larg + 12)].map(dx => [dx, livre(dx)]).sort((a, b) => b[1] - a[1]);
    const dxT = opc[0][1] > 0.6 ? opc[0][0] : 0;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * W + x; if (!M[i]) continue;
      const xs = x + dxT, temFonte = dxT && xs >= 0 && xs < W && !M[y * W + xs];
      // só traz a textura se a cor de lá combina com a cor que vai aqui (não leva bloco para dentro do vão escuro)
      let combina = false; if (temFonte) { let dif = 0; for (let c = 0; c < 3; c++) dif += Math.abs(borr(xs, y, c) - base[i * 3 + c]); combina = dif < 60; }
      for (let c = 0; c < 3; c++) {
        let v = base[i * 3 + c];
        if (combina) v += d[(y * W + xs) * 4 + c] - borr(xs, y, c);
        d[i * 4 + c] = Math.max(0, Math.min(255, v)); } }
    og.putImageData(img, 0, 0);
    // costura suave na borda do que foi apagado
    const fina = document.createElement('canvas'); fina.width = W; fina.height = H; const fg = fina.getContext('2d');
    fg.drawImage(out, 0, 0);
    const borda = document.createElement('canvas'); borda.width = W; borda.height = H; const bg = borda.getContext('2d');
    const bi = bg.createImageData(W, H); for (let i = 0; i < W * H; i++) if (M[i]) bi.data[i * 4 + 3] = 255; bg.putImageData(bi, 0, 0);
    const res = document.createElement('canvas'); res.width = W; res.height = H; const rg = res.getContext('2d');
    rg.drawImage(foto, 0, 0);
    const lim = document.createElement('canvas'); lim.width = W; lim.height = H; const lg = lim.getContext('2d');
    lg.filter = 'blur(1.5px)'; lg.drawImage(borda, 0, 0); lg.filter = 'none'; lg.globalCompositeOperation = 'source-in'; lg.drawImage(fina, 0, 0);
    rg.drawImage(lim, 0, 0); rg.drawImage(lim, 0, 0);
    return res;
  }

  G.MotorFC = { projetiva, leva, cantosEmOrdem, dentro, malha, emPerspectiva, endireitar, retrato, quadroComMargem, proporcao, mapaBordas, cantosCertos, situacaoCantos, desvioDoLado, apagar, PAREDE };
})(window);
