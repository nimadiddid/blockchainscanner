const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ChainLens</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --navy: #080608; --surface: #140d0d; --border: #3a1a1a;
      --red: #e03030; --red-l: #ff6b6b; --red-d: #8b1a1a;
      --glow-r: rgba(224,48,48,0.45);
      --text: #f0e8e8; --muted: #886666; --accent: #ff6b6b; --mid: #1a0e0e;
    }
    body { font-family: 'Syne', sans-serif; background: var(--navy); color: var(--text); min-height: 100vh; overflow-x: hidden; }
    body::before {
      content: ''; position: fixed; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 15% 10%, rgba(180,20,20,0.22) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 85% 80%, rgba(120,10,10,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 40% 40% at 55% 40%, rgba(80,5,5,0.12) 0%, transparent 50%);
      pointer-events: none; z-index: 0; animation: meshPulse 8s ease-in-out infinite alternate;
    }
    @keyframes meshPulse { 0%{opacity:0.6;} 100%{opacity:1;} }
    body::after {
      content: ''; position: fixed; inset: 0;
      background-image: linear-gradient(rgba(180,20,20,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(180,20,20,0.05) 1px, transparent 1px);
      background-size: 48px 48px; pointer-events: none; z-index: 0;
    }
    #chainCanvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
    .wrapper { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 0 24px; }
    header { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(20px); background: rgba(8,6,8,0.85); border-bottom: 1px solid var(--border); }
    .header-inner { display: flex; align-items: center; gap: 10px; padding: 14px 24px; max-width: 900px; margin: 0 auto; }
    .logo-icon { width: 34px; height: 34px; background: linear-gradient(135deg, var(--red), #600); border-radius: 9px; display: grid; place-items: center; font-size: 17px; flex-shrink: 0; }
    .logo-text { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.5px; }
    .logo-text span { color: var(--red-l); }
    .header-contact { margin-left: auto; font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--muted); display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .header-contact a { color: var(--red-l); text-decoration: none; border: 1px solid rgba(224,48,48,0.3); background: rgba(224,48,48,0.08); padding: 4px 10px; border-radius: 999px; transition: background 0.2s, border-color 0.2s; display: flex; align-items: center; gap: 5px; }
    .header-contact a:hover { background: rgba(224,48,48,0.18); border-color: rgba(224,48,48,0.6); }
    .tg-dot { width: 5px; height: 5px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.75);} }
    .hero { padding: 64px 0 36px; text-align: center; }
    .hero h1 { font-size: clamp(1.9rem, 4.5vw, 3.2rem); font-weight: 800; line-height: 1.12; letter-spacing: -1.5px; margin-bottom: 14px; }
    .grad { background: linear-gradient(90deg, var(--red-l), #ff9090, #ffb3b3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p { font-size: 1rem; color: var(--muted); max-width: 480px; margin: 0 auto; line-height: 1.7; }
    .chain-selector-wrap { margin: 28px 0 0; display: flex; justify-content: center; }
    .chain-selector { position: relative; display: inline-block; }
    .chain-btn { display: flex; align-items: center; gap: 10px; padding: 11px 20px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); color: var(--text); font-family: 'DM Mono', monospace; font-size: 0.82rem; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; user-select: none; min-width: 240px; justify-content: space-between; }
    .chain-btn:hover { border-color: var(--red); box-shadow: 0 0 16px rgba(224,48,48,0.2); }
    .chain-label-left { display: flex; align-items: center; gap: 8px; }
    .chain-btn-label { font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
    .chain-btn .arrow { font-size: 0.65rem; color: var(--muted); transition: transform 0.25s; }
    .chain-btn.open .arrow { transform: rotate(180deg); }
    .chain-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .chain-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #1a0a0a; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.6); z-index: 50; max-height: 0; opacity: 0; transition: max-height 0.3s ease, opacity 0.25s ease; pointer-events: none; }
    .chain-dropdown.open { max-height: 320px; opacity: 1; pointer-events: all; overflow-y: auto; }
    .chain-option { display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-family: 'DM Mono', monospace; font-size: 0.8rem; color: var(--text); cursor: pointer; transition: background 0.15s; }
    .chain-option:hover { background: rgba(224,48,48,0.10); }
    .chain-option.active { background: rgba(224,48,48,0.15); color: var(--red-l); }
    .chain-option .chain-name { font-weight: 500; }
    .chain-option .chain-id { font-size: 0.65rem; color: var(--muted); margin-left: auto; }
    .search-wrap { margin: 20px 0 48px; background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 28px 32px; position: relative; overflow: hidden; }
    .search-wrap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--red-d), var(--red), var(--red-l)); }
    .search-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 14px; }
    .input-row { display: flex; gap: 12px; flex-wrap: wrap; }
    #addrInput { flex: 1; min-width: 200px; background: rgba(8,6,8,0.7); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; color: var(--text); font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
    #addrInput::placeholder { color: var(--muted); }
    #addrInput:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(224,48,48,0.15); }
    #searchBtn { padding: 14px 28px; border: none; border-radius: 12px; background: linear-gradient(135deg, var(--red-d), var(--red)); color: #fff; font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 0 20px var(--glow-r); display: flex; align-items: center; gap: 8px; }
    #searchBtn:hover { transform: translateY(-2px); box-shadow: 0 0 32px var(--glow-r); }
    #searchBtn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .search-hint { margin-top: 12px; font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--muted); }
    .search-hint.error { color: #f87171; }
    .search-hint.success { color: #4ade80; }
    .spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: none; }
    @keyframes spin { to { transform: rotate(360deg); } }
    #results { display: none; }
    .result-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
    .result-addr { font-family: 'DM Mono', monospace; font-size: 0.8rem; color: var(--accent); background: rgba(224,48,48,0.08); border: 1px solid rgba(224,48,48,0.25); padding: 6px 14px; border-radius: 999px; }
    .explorer-link { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--red-l); text-decoration: none; display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 999px; border: 1px solid rgba(224,48,48,0.25); background: rgba(224,48,48,0.07); transition: background 0.2s; }
    .explorer-link:hover { background: rgba(224,48,48,0.16); }
    .section-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
    .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; margin-bottom: 40px; }
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px 20px; position: relative; overflow: hidden; transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; }
    .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--red-d), var(--red-l)); opacity: 0; transition: opacity 0.3s; }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(224,48,48,0.4); box-shadow: 0 8px 32px rgba(224,48,48,0.18); }
    .stat-card:hover::before { opacity: 1; }
    .glow-blob { position: absolute; width: 100px; height: 100px; border-radius: 50%; filter: blur(35px); pointer-events: none; top: -15px; right: -15px; opacity: 0.18; }
    .stat-icon { font-size: 24px; margin-bottom: 16px; }
    .stat-label { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .stat-value { font-size: 2rem; font-weight: 800; letter-spacing: -1px; line-height: 1; margin-bottom: 5px; background: linear-gradient(135deg, #fff 40%, var(--red-l)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .stat-sub { font-size: 0.72rem; color: var(--muted); font-family: 'DM Mono', monospace; line-height: 1.5; }
    .skeleton { display: inline-block; width: 90px; height: 32px; border-radius: 6px; background: linear-gradient(90deg, var(--mid) 25%, var(--border) 50%, var(--mid) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
    @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
    .tx-section { margin-bottom: 60px; }
    .tx-list { display: flex; flex-direction: column; gap: 7px; }
    .tx-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr auto; align-items: center; gap: 12px; padding: 13px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 11px; font-family: 'DM Mono', monospace; font-size: 0.74rem; color: var(--muted); cursor: pointer; transition: border-color 0.2s, background 0.2s; }
    .tx-row:hover { border-color: var(--red); background: rgba(224,48,48,0.05); }
    .tx-hash { color: var(--red-l); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tx-amount { color: var(--text); font-weight: 500; }
    .tx-badge { padding: 3px 9px; border-radius: 999px; font-size: 0.65rem; font-weight: 700; white-space: nowrap; }
    .tx-badge.in  { background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .tx-badge.out { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
    .tx-header { display: grid; grid-template-columns: 1.4fr 1fr 1fr auto; gap: 12px; padding: 8px 18px; font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
    footer { text-align: center; padding: 28px 24px; border-top: 1px solid var(--border); font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--muted); position: relative; z-index: 1; }
    footer a { color: var(--accent); text-decoration: none; }
    @media(max-width:560px){ .tx-row,.tx-header{grid-template-columns:1fr auto;} .search-wrap{padding:22px 18px;} .header-contact span{display:none;} }
  </style>
</head>
<body>
<canvas id="chainCanvas"></canvas>
<header>
  <div class="header-inner">
    <div class="logo-icon">&#x2B21;</div>
    <div class="logo-text">Chain<span>Lens</span></div>
    <div class="header-contact">
      <span>Contact Founder:</span>
      <a href="https://t.me/DTCDOT" target="_blank" rel="noopener">
        <span class="tg-dot"></span>T.me/DTCDOT
      </a>
    </div>
  </div>
</header>
<div class="wrapper">
  <section class="hero">
    <h1>Explore Any Wallet on<br/><span class="grad">Any Blockchain</span></h1>
    <p>Paste any EVM wallet address to instantly explore transactions, NFTs, assets, and trading volume.</p>
    <div class="chain-selector-wrap">
      <div class="chain-selector" id="chainSelector">
        <div class="chain-btn" id="chainBtn" onclick="toggleChainDropdown()">
          <div>
            <div class="chain-btn-label">Select Blockchain</div>
            <div class="chain-label-left">
              <span class="chain-dot" id="selectedDot" style="background:#627eea;"></span>
              <span id="selectedChainName">Ethereum Mainnet</span>
            </div>
          </div>
          <span class="arrow">&#x25BC;</span>
        </div>
        <div class="chain-dropdown" id="chainDropdown">
          <div class="chain-option active"
            data-chainid="1" data-name="Ethereum Mainnet" data-dot="#627eea"
            data-explorer="https://etherscan.io" data-label="etherscan.io"
            data-apitype="etherscan" data-symbol="ETH" onclick="selectChain(this)">
            <span class="chain-dot" style="background:#627eea;"></span>
            <span class="chain-name">Ethereum Mainnet</span>
            <span class="chain-id">ID: 1</span>
          </div>
          <div class="chain-option"
            data-chainid="8453" data-name="Base" data-dot="#0052ff"
            data-explorer="https://basescan.org" data-label="basescan.org"
            data-apitype="etherscan" data-symbol="ETH" onclick="selectChain(this)">
            <span class="chain-dot" style="background:#0052ff;"></span>
            <span class="chain-name">Base</span>
            <span class="chain-id">ID: 8453</span>
          </div>
          <div class="chain-option"
            data-chainid="50312" data-name="Somnia Mainnet" data-dot="#a855f7"
            data-explorer="https://explorer.somnia.network" data-label="explorer.somnia.network"
            data-apitype="blockscout" data-apiurl="https://mainnet.somnia.w3us.site" data-symbol="STT"
            onclick="selectChain(this)">
            <span class="chain-dot" style="background:#a855f7;"></span>
            <span class="chain-name">Somnia Mainnet</span>
            <span class="chain-id">ID: 50312</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="search-wrap">
    <div class="search-label">Wallet Address</div>
    <div class="input-row">
      <input id="addrInput" type="text" placeholder="0x... paste your EVM wallet address here" autocomplete="off" spellcheck="false" />
      <button id="searchBtn"><span id="btnLabel">Search</span><div class="spin" id="btnSpin"></div></button>
    </div>
    <div class="search-hint" id="searchHint">Enter a valid 0x address</div>
  </div>
  <div id="results">
    <div class="result-header">
      <div class="result-addr" id="resultAddr"></div>
      <a class="explorer-link" id="explorerLink" href="#" target="_blank">&#x2197; View on Explorer</a>
    </div>
    <div class="section-label">On-Chain Overview</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="glow-blob" style="background:#e03030;"></div>
        <div class="stat-icon">&#x1F4CA;</div>
        <div class="stat-label">Transactions</div>
        <div class="stat-value" id="txCount"></div>
        <div class="stat-sub" id="txSub"></div>
      </div>
      <div class="stat-card">
        <div class="glow-blob" style="background:#8b1a1a;"></div>
        <div class="stat-icon">&#x1F5BC;&#xFE0F;</div>
        <div class="stat-label">NFTs Held</div>
        <div class="stat-value" id="nftCount"></div>
        <div class="stat-sub" id="nftSub"></div>
      </div>
      <div class="stat-card">
        <div class="glow-blob" style="background:#600;"></div>
        <div class="stat-icon">&#x1F48E;</div>
        <div class="stat-label" id="balanceLabel">ETH Balance</div>
        <div class="stat-value" id="assetValue"></div>
        <div class="stat-sub" id="assetSub"></div>
      </div>
      <div class="stat-card">
        <div class="glow-blob" style="background:#e03030;"></div>
        <div class="stat-icon">&#x1F4C8;</div>
        <div class="stat-label">Trade Volume</div>
        <div class="stat-value" id="tradeVol"></div>
        <div class="stat-sub" id="volSub"></div>
      </div>
    </div>
    <div class="section-label">Recent Transactions</div>
    <div class="tx-section">
      <div class="tx-header"><span>Hash</span><span>From</span><span>Value</span><span>Type</span></div>
      <div class="tx-list" id="txList"></div>
    </div>
  </div>
</div>
<footer>
  Data via <a href="https://etherscan.io" target="_blank">Etherscan v2</a> &amp; <a href="https://explorer.somnia.network" target="_blank">Somnia Explorer</a> &nbsp;&middot;&nbsp; ChainLens &copy; 2025
</footer>
<script>
(function(){
  var canvas=document.getElementById('chainCanvas'),ctx=canvas.getContext('2d');
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  var chains=[];
  function rndChain(sx){return{blockCount:Math.floor(Math.random()*7)+4,blockW:36+Math.random()*24,blockH:18+Math.random()*10,gap:20+Math.random()*16,angle:(Math.random()*30-15)*Math.PI/180,speed:0.22+Math.random()*0.35,x:sx!==undefined?sx:(-400-Math.random()*300),y:Math.random()*(window.innerHeight+300)-150,hue:Math.random()*14,sat:70+Math.random()*20,alpha:0.30+Math.random()*0.28};}
  for(var i=0;i<9;i++)chains.push(rndChain(Math.random()*(window.innerWidth+800)-400));
  function drawChain(ch){
    ctx.save();ctx.translate(ch.x,ch.y);ctx.rotate(ch.angle);
    var c='hsla('+ch.hue+','+ch.sat+'%,55%,'+ch.alpha+')',lc='hsla('+ch.hue+','+(ch.sat-10)+'%,45%,'+(ch.alpha*0.75)+')',ic='hsla('+ch.hue+','+ch.sat+'%,65%,'+(ch.alpha*0.40)+')';
    for(var i=0;i<ch.blockCount;i++){
      var bx=i*(ch.blockW+ch.gap);
      if(i>0){var lx=bx-ch.gap;ctx.beginPath();ctx.strokeStyle=lc;ctx.lineWidth=2;ctx.moveTo(lx,ch.blockH/2-4);ctx.lineTo(bx,ch.blockH/2-4);ctx.moveTo(lx,ch.blockH/2+4);ctx.lineTo(bx,ch.blockH/2+4);ctx.stroke();ctx.beginPath();ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.ellipse(lx+ch.gap/2,ch.blockH/2,ch.gap/2-2,5.5,0,0,Math.PI*2);ctx.stroke();}
      ctx.beginPath();ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.roundRect(bx,0,ch.blockW,ch.blockH,4);ctx.stroke();ctx.fillStyle='hsla('+ch.hue+','+ch.sat+'%,20%,'+(ch.alpha*0.15)+')';ctx.fill();
      ctx.beginPath();ctx.strokeStyle=ic;ctx.lineWidth=1;ctx.moveTo(bx+6,ch.blockH*0.33);ctx.lineTo(bx+ch.blockW-6,ch.blockH*0.33);ctx.moveTo(bx+6,ch.blockH*0.66);ctx.lineTo(bx+ch.blockW*0.65,ch.blockH*0.66);ctx.stroke();
    }
    ctx.restore();
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0;i<chains.length;i++){
      chains[i].x+=chains[i].speed;
      if(chains[i].x>canvas.width+150){chains[i]=rndChain();chains[i].x=-(chains[i].blockCount*(chains[i].blockW+chains[i].gap))-80;chains[i].y=Math.random()*(canvas.height+300)-150;}
      drawChain(chains[i]);
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

var currentChain={id:'1',name:'Ethereum Mainnet',explorer:'https://etherscan.io',label:'etherscan.io',apitype:'etherscan',apiurl:null,symbol:'ETH',dot:'#627eea'};

function toggleChainDropdown(){var dd=document.getElementById('chainDropdown'),isOpen=dd.classList.toggle('open');document.getElementById('chainBtn').classList.toggle('open',isOpen);}

function selectChain(el){
  currentChain={id:el.dataset.chainid,name:el.dataset.name,explorer:el.dataset.explorer,label:el.dataset.label,dot:el.dataset.dot,apitype:el.dataset.apitype||'etherscan',apiurl:el.dataset.apiurl||null,symbol:el.dataset.symbol||'ETH'};
  document.getElementById('selectedChainName').textContent=currentChain.name;
  document.getElementById('selectedDot').style.background=currentChain.dot||'#627eea';
  document.getElementById('balanceLabel').textContent=currentChain.symbol+' Balance';
  document.querySelectorAll('.chain-option').forEach(function(o){o.classList.remove('active');});
  el.classList.add('active');
  document.getElementById('chainDropdown').classList.remove('open');
  document.getElementById('chainBtn').classList.remove('open');
  hint('Selected: '+currentChain.name,'');
}

document.addEventListener('click',function(e){if(!document.getElementById('chainSelector').contains(e.target)){document.getElementById('chainDropdown').classList.remove('open');document.getElementById('chainBtn').classList.remove('open');}});

function isValid(a){return /^0x[0-9a-fA-F]{40}$/.test(a);}
function hint(m,t){var el=document.getElementById('searchHint');el.textContent=m;el.className='search-hint'+(t?' '+t:'');}
function loading(on){document.getElementById('searchBtn').disabled=on;document.getElementById('btnLabel').style.display=on?'none':'inline';document.getElementById('btnSpin').style.display=on?'block':'none';}
function skeletons(){['txCount','nftCount','assetValue','tradeVol'].forEach(function(id){document.getElementById(id).innerHTML='<span class="skeleton"></span>';});['txSub','nftSub','assetSub','volSub'].forEach(function(id){document.getElementById(id).textContent='';});document.getElementById('txList').innerHTML='';}

function pFetch(params){
  var url=new URL('/api/etherscan',window.location.origin);
  url.searchParams.set('chainid',currentChain.id);
  for(var k in params)url.searchParams.set(k,params[k]);
  return fetch(url.toString()).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
}

function doSearch(){
  var raw=document.getElementById('addrInput').value.trim();
  if(!isValid(raw)){hint('Please enter a valid 0x EVM address.','error');return;}
  var addr=raw.toLowerCase();
  loading(true);hint('Fetching data from '+currentChain.name+'...','');skeletons();
  document.getElementById('results').style.display='block';
  document.getElementById('resultAddr').textContent=addr.slice(0,6)+'...'+addr.slice(-4);
  var el=document.getElementById('explorerLink');
  el.href=currentChain.explorer+'/address/'+raw;
  el.textContent='\u2197 View on '+currentChain.label;
  var p=currentChain.apitype==='blockscout'?bsFetchAll(addr):ethFetchAll(addr);
  p.then(function(){loading(false);hint('Data loaded successfully.','success');}).catch(function(e){loading(false);hint('Error: '+e.message,'error');});
}

document.getElementById('searchBtn').addEventListener('click',doSearch);
document.getElementById('addrInput').addEventListener('keydown',function(e){if(e.key==='Enter')doSearch();});

function ethFetchAll(addr){
  var sym=currentChain.symbol;
  return Promise.all([
    pFetch({module:'account',action:'balance',address:addr,tag:'latest'}),
    pFetch({module:'account',action:'tokenlist',address:addr}),
    pFetch({module:'account',action:'txlist',address:addr,startblock:'0',endblock:'99999999',page:'1',offset:'10000',sort:'desc'}),
    pFetch({module:'account',action:'tokennfttx',address:addr,startblock:'0',endblock:'99999999',page:'1',offset:'1000',sort:'desc'})
  ]).then(function(res){
    document.getElementById('assetValue').textContent=(res[0].status==='1'?parseFloat(res[0].result)/1e18:0).toFixed(5)+' '+sym;
    var toks=(res[1].status==='1'&&Array.isArray(res[1].result))?res[1].result:[];
    document.getElementById('assetSub').textContent='+ '+toks.length+' ERC-20 token'+(toks.length!==1?'s':'');
    var txs=(res[2].status==='1'&&Array.isArray(res[2].result))?res[2].result:[];
    var recv=0,sent=0,vol=0;
    txs.forEach(function(t){if(t.to&&t.to.toLowerCase()===addr)recv++;if(t.from&&t.from.toLowerCase()===addr)sent++;vol+=parseFloat(t.value||0)/1e18;});
    document.getElementById('txCount').textContent=txs.length.toLocaleString()+(txs.length>=10000?'+':'');
    document.getElementById('txSub').textContent=recv+' received / '+sent+' sent';
    document.getElementById('tradeVol').textContent=vol.toFixed(4)+' '+sym;
    document.getElementById('volSub').textContent='Total '+sym+' moved';
    renderTxEth(txs.slice(0,12),addr);
    var nftData=(res[3].status==='1'&&Array.isArray(res[3].result))?res[3].result:[];
    var nftMap={};
    nftData.forEach(function(t){var k=t.contractAddress+':'+t.tokenID;nftMap[k]=(nftMap[k]||0)+(t.to&&t.to.toLowerCase()===addr?1:-1);});
    var held=Object.values(nftMap).filter(function(v){return v>0;}).length;
    document.getElementById('nftCount').textContent=held.toLocaleString();
    document.getElementById('nftSub').textContent=nftData.length+' total NFT transfers';
  });
}

function renderTxEth(txs,addr){
  var el=document.getElementById('txList'),sym=currentChain.symbol;
  if(!txs.length){el.innerHTML='<div style="text-align:center;color:var(--muted);padding:28px;font-size:0.78rem;">No transactions found</div>';return;}
  el.innerHTML=txs.map(function(tx){
    var isIn=tx.to&&tx.to.toLowerCase()===addr;
    return '<div class="tx-row" onclick="window.open(\''+currentChain.explorer+'/tx/'+tx.hash+'\',\'_blank\')">'
      +'<span class="tx-hash">'+tx.hash.slice(0,8)+'...'+tx.hash.slice(-5)+'</span>'
      +'<span>'+tx.from.slice(0,6)+'...'+tx.from.slice(-4)+'</span>'
      +'<span class="tx-amount">'+(parseFloat(tx.value||0)/1e18).toFixed(5)+' '+sym+'</span>'
      +'<span class="tx-badge '+(isIn?'in':'out')+'">'+(isIn?'&#x25B2; IN':'&#x25BC; OUT')+'</span>'
      +'</div>';
  }).join('');
}

function bsFetchAll(addr){
  var sym=currentChain.symbol,base=currentChain.apiurl;
  return Promise.all([
    fetch(base+'/api/v2/addresses/'+addr).then(function(r){return r.json();}).catch(function(){return {};}),
    fetch(base+'/api/v2/addresses/'+addr+'/counters').then(function(r){return r.json();}).catch(function(){return {};}),
    fetch(base+'/api/v2/addresses/'+addr+'/transactions?filter=to%20%7C%20from&limit=50').then(function(r){return r.json();}).catch(function(){return {items:[]};}),
    fetch(base+'/api/v2/addresses/'+addr+'/token-balances').then(function(r){return r.json();}).catch(function(){return [];}),
    fetch(base+'/api/v2/addresses/'+addr+'/nft?limit=50').then(function(r){return r.json();}).catch(function(){return {items:[]};})
  ]).then(function(res){
    var info=res[0],counters=res[1],txData=res[2],tokData=res[3],nftData=res[4];
    document.getElementById('assetValue').textContent=(parseFloat(info.coin_balance||'0')/1e18).toFixed(5)+' '+sym;
    var toks=Array.isArray(tokData)?tokData.filter(function(t){return t.token&&t.token.type&&t.token.type!=='ERC-721'&&t.token.type!=='ERC-1155';}):[];
    var tokNames=toks.slice(0,3).map(function(t){return(t.token&&t.token.symbol)?t.token.symbol:'somi';}).join(', ');
    document.getElementById('assetSub').textContent='+ '+toks.length+' token'+(toks.length!==1?'s':'')+(tokNames?' ('+tokNames+')':'');
    var txItems=(txData.items&&Array.isArray(txData.items))?txData.items:[];
    var recv=0,sent=0,vol=0;
    txItems.forEach(function(t){var to=t.to?(t.to.hash||'').toLowerCase():'',from=t.from?(t.from.hash||'').toLowerCase():'';if(to===addr)recv++;if(from===addr)sent++;vol+=parseFloat(t.value||0)/1e18;});
    var totalTx=counters.transactions_count?parseInt(counters.transactions_count,10):null;
    document.getElementById('txCount').textContent=totalTx!==null?totalTx.toLocaleString():txItems.length+(txData.next_page_params?'+':'');
    document.getElementById('txSub').textContent=recv+' received / '+sent+' sent (last '+txItems.length+' shown)';
    document.getElementById('tradeVol').textContent=vol.toFixed(4)+' '+sym;
    document.getElementById('volSub').textContent='Volume (last '+txItems.length+' txs)';
    renderTxBs(txItems.slice(0,12),addr);
    var nftItems=(nftData.items&&Array.isArray(nftData.items))?nftData.items:[];
    var nftTotal=counters.nfts_count?parseInt(counters.nfts_count,10):null;
    document.getElementById('nftCount').textContent=nftTotal!==null?nftTotal.toLocaleString():nftItems.length+(nftData.next_page_params?'+':'');
    document.getElementById('nftSub').textContent=(nftTotal||nftItems.length)>0?(nftTotal||nftItems.length)+' NFT(s) held':'No NFTs found';
  });
}

function renderTxBs(txs,addr){
  var el=document.getElementById('txList'),sym=currentChain.symbol;
  if(!txs.length){el.innerHTML='<div style="text-align:center;color:var(--muted);padding:28px;font-size:0.78rem;">No transactions found</div>';return;}
  el.innerHTML=txs.map(function(tx){
    var toH=tx.to?(tx.to.hash||'').toLowerCase():'',fromH=tx.from?(tx.from.hash||'').toLowerCase():'',isIn=toH===addr;
    return '<div class="tx-row" onclick="window.open(\''+currentChain.explorer+'/tx/'+tx.hash+'\',\'_blank\')">'
      +'<span class="tx-hash">'+tx.hash.slice(0,8)+'...'+tx.hash.slice(-5)+'</span>'
      +'<span>'+(fromH?fromH.slice(0,6)+'...'+fromH.slice(-4):'--')+'</span>'
      +'<span class="tx-amount">'+(parseFloat(tx.value||0)/1e18).toFixed(5)+' '+sym+'</span>'
      +'<span class="tx-badge '+(isIn?'in':'out')+'">'+(isIn?'&#x25B2; IN':'&#x25BC; OUT')+'</span>'
      +'</div>';
  }).join('');
}
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (url.pathname === '/api/etherscan') {
      const params = url.searchParams;
      const apiUrl = new URL('https://api.etherscan.io/v2/api');
      for (const [k, v] of params.entries()) {
        apiUrl.searchParams.set(k, v);
      }
      apiUrl.searchParams.set('apikey', env.ETHERSCAN_API_KEY || '');
      try {
        const resp = await fetch(apiUrl.toString(), {
          headers: { 'User-Agent': 'ChainLens/1.0' }
        });
        const data = await resp.text();
        return new Response(data, {
          headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ status: '0', message: e.message, result: [] }), {
          headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};
