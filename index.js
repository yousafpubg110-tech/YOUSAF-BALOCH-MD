border-radius: 50px;
            padding: 12px 25px;
            text-align: center;
            margin-bottom: 30px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 600;
            animation: pulse 2s ease infinite;
            position: relative;
            z-index: 1;
        }
        
        @keyframes pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
        
        .status {
            color: var(--accent);
        }
        
        .status.connected {
            color: #00ff00;
        }
        
        .buttons-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }
        
        .method-btn {
            background: linear-gradient(135deg, rgba(0, 242, 255, 0.2), rgba(139, 92, 246, 0.2));
            border: 2px solid var(--primary);
            border-radius: 20px;
            padding: 25px 15px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            overflow: hidden;
        }
        
        .method-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(0, 242, 255, 0.3), transparent);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
            border-radius: 50%;
        }
        
        .method-btn:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .method-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 40px rgba(0, 242, 255, 0.4);
            border-color: var(--secondary);
        }
        
        .method-icon {
            font-size: 3em;
            margin-bottom: 10px;
            filter: drop-shadow(0 0 10px currentColor);
        }
        
        .method-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.1em;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .method-desc {
            font-size: 0.85em;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .section {
            display: none;
            animation: fadeIn 0.5s ease;
            position: relative;
            z-index: 1;
        }
        
        .section.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .qr-container {
            background: white;
            border-radius: 20px;
            padding: 20px;
            margin: 20px 0;
            display: flex;
            justify-content: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        #qrcode {
            display: inline-block;
        }
        
        .qr-timer {
            font-family: 'Orbitron', monospace;
            font-size: 1.2em;
            color: var(--accent);
            text-align: center;
            margin-top: 15px;
        }
        
        input {
            width: 100%;
            padding: 18px 20px;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(0, 242, 255, 0.3);
            border-radius: 15px;
            color: white;
            font-size: 1.1em;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.3s;
            margin-bottom: 15px;
        }
        
        input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }
        
        input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 25px rgba(0, 242, 255, 0.3);
            background: rgba(0, 0, 0, 0.7);
        }
        
        .generate-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, var(--primary), var(--purple));
            border: none;
            border-radius: 15px;
            color: white;
            font-size: 1.1em;
            font-weight: 700;
            font-family: 'Orbitron', sans-serif;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        .generate-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(139, 92, 246, 0.5);
        }
        
        .code-display {
            font-family: 'Orbitron', monospace;
            font-size: 2.5em;
            font-weight: 900;
            letter-spacing: 15px;
            color: var(--primary);
            text-align: center;
            padding: 30px;
            background: rgba(0, 0, 0, 0.6);
            border: 3px solid var(--primary);
            border-radius: 20px;
            margin: 20px 0;
            text-shadow: 0 0 30px var(--primary);
            animation: codeGlow 2s ease infinite;
        }
        
        @keyframes codeGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 242, 255, 0.5); }
            50% { box-shadow: 0 0 40px rgba(0, 242, 255, 0.8); }
        }
        
        .info-text {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            margin: 15px 0;
            font-size: 0.95em;
        }
        
        .social-links {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 30px;
            position: relative;
            z-index: 1;
        }
        
        .social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            color: white;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 0.9em;
        }
        
        .social-btn:hover {
            background: rgba(255, 0, 128, 0.2);
            border-color: var(--secondary);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(255, 0, 128, 0.3);
        }
        
        .social-icon {
            font-size: 1.3em;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9em;
            position: relative;
            z-index: 1;
        }
        
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(0, 242, 255, 0.3);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @media (max-width: 600px) {
            .time-display { font-size: 2em; }
            .bot-title { font-size: 1.8em; }
            .method-icon { font-size: 2.5em; }
            .code-display {
                font-size: 1.8em;
                letter-spacing: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="particles" id="particles"></div>

    <div class="container">
        <div class="header-time">
            <div class="time-display" id="time">00:00:00</div>
            <div class="date-display" id="date">Loading...</div>
        </div>

        <div class="main-card">
            <h1 class="bot-title">⚡ YOUSAF-BALOCH-MD ⚡</h1>
            <div class="bot-subtitle">ULTRA PREMIUM EDITION</div>
            
            <div class="dev-info">
                <div class="dev-name">MUHAMMAD YOUSAF BALOCH</div>
                <div class="dev-contact">📞 +923710636110</div>
            </div>
            
            <div class="status-badge">
                <div id="status" class="status">⏳ Waiting...</div>
            </div>
            
            <div class="buttons-grid">
                <div class="method-btn" onclick="showQR()">
                    <div class="method-icon">📱</div>
                    <div class="method-title">QR CODE</div>
                    <div class="method-desc">Scan & Connect</div>
                </div>
                <div class="method-btn" onclick="showPairing()">
                    <div class="method-icon">🔐</div>
                    <div class="method-title">PAIRING</div>
                    <div class="method-desc">8-Digit Code</div>
                </div>
            </div>
            
            <div id="qr-section" class="section">
                <div class="qr-container">
                    <div id="qrcode"></div>
                </div>
                <div id="qr-timer" class="qr-timer">⏳ Loading QR...</div>
                <div class="info-text">Open WhatsApp → Linked Devices → Scan QR</div>
            </div>
            
            <div id="pairing-section" class="section">
                <input type="tel" id="phone" placeholder="923710636110" maxlength="15">
                <button class="generate-btn" onclick="generateCode()">🚀 GENERATE CODE</button>
                <div id="code-result"></div>
            </div>
            
            <div class="social-links">
                <a href="https://github.com/musakhanbaloch03-sad" class="social-btn" target="_blank">
                    <span class="social-icon">💻</span>
                    <span>GitHub</span>
                </a>
                <a href="https://www.youtube.com/@Yousaf_Baloch_Tech" class="social-btn" target="_blank">
                    <span class="social-icon">📺</span>
                    <span>YouTube</span>
                </a>
                <a href="https://tiktok.com/@loser_boy.110" class="social-btn" target="_blank">
                    <span class="social-icon">🎵</span>
                    <span>TikTok</span>
                </a>
                <a href="https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j" class="social-btn" target="_blank">
                    <span class="social-icon">📢</span>
                    <span>Channel</span>
                </a>
            </div>
        </div>
        
        <div class="footer">
            © 2025 YOUSAF-BALOCH-MD | Developed by Muhammad Yousaf Baloch<br>
            All Rights Reserved
        </div>
    </div>

    <script>
        // Create particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 5 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = Math.random() * 10 + 10 + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            document.getElementById('particles').appendChild(particle);
        }
        
        // Update time
        function updateDateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            document.getElementById('time').textContent = \`\${hours}:\${minutes}:\${seconds}\`;
            
            const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const day = days[now.getDay()];
            const month = months[now.getMonth()];
            const date = now.getDate();
            const year = now.getFullYear();
            
            document.getElementById('date').textContent = \`\${day}, \${month} \${date}, \${year}\`;
        }
        setInterval(updateDateTime, 1000);
        updateDateTime();

        // Status Check
        function updateStatus() {
            fetch('/status')
                .then(r => r.json())
                .then(data => {
                    const statusEl = document.getElementById('status');
                    if (data.connected) {
                        statusEl.className = 'status connected';
                        statusEl.innerHTML = '✅ CONNECTED: ' + data.number;
                    } else {
                        statusEl.className = 'status';
                        statusEl.textContent = '⏳ Waiting...';
                    }
                })
                .catch(() => {});
        }
        setInterval(updateStatus, 3000);

        // Show QR
        function showQR() {
            document.getElementById('qr-section').classList.add('active');
            document.getElementById('pairing-section').classList.remove('active');
            loadQR();
        }

        // Show Pairing
        function showPairing() {
            document.getElementById('pairing-section').classList.add('active');
            document.getElementById('qr-section').classList.remove('active');
        }

        // Load QR
        function loadQR() {
            fetch('/qr')
                .then(r => r.json())
                .then(data => {
                    if (data.qr) {
                        const qrDiv = document.getElementById('qrcode');
                        qrDiv.innerHTML = '';
                        new QRCode(qrDiv, {
                            text: data.qr,
                            width: 256,
                            height: 256,
                            colorDark: '#000000',
                            colorLight: '#ffffff'
                        });
                        startQRTimer();
                    }
                });
        }

        // QR Timer
        let timerInterval;
        function startQRTimer() {
            let seconds = 60;
            const timerEl = document.getElementById('qr-timer');
            clearInterval(timerInterval);
            
            timerInterval = setInterval(() => {
                seconds--;
                timerEl.textContent = \`⏰ EXPIRES IN \${seconds}S\`;
                
                if (seconds <= 0) {
                    clearInterval(timerInterval);
                    timerEl.textContent = '⚠️ EXPIRED! REFRESH PAGE';
                }
            }, 1000);
        }

        // Generate Pairing Code
        async function generateCode() {
            const phone = document.getElementById('phone').value.replace(/[^0-9]/g, '');
            const resultEl = document.getElementById('code-result');
            
            if (!phone || phone.length < 10) {
                resultEl.innerHTML = '<div class="info-text" style="color: #ff0080;">❌ INVALID NUMBER</div>';
                return;
            }
            
            resultEl.innerHTML = '<div class="info-text"><span class="spinner"></span> GENERATING...</div>';
            
            try {
                const response = await fetch('/pairing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                
                const data = await response.json();
                
                if (data.code) {
                    resultEl.innerHTML = \`
                        <div class="code-display">\${data.code}</div>
                        <div class="info-text">⏰ ENTER IN WHATSAPP WITHIN 60 SECONDS</div>
                        <div class="info-text">WhatsApp → Linked Devices → Link with Phone Number</div>
                    \`;
                } else {
                    resultEl.innerHTML = '<div class="info-text" style="color: #ff0080;">❌ ' + data.error + '</div>';
                }
            } catch (error) {
                resultEl.innerHTML = '<div class="info-text" style="color: #ff0080;">❌ ERROR OCCURRED</div>';
            }
        }

        // Allow Enter key
        document.getElementById('phone').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateCode();
            }
        });
    </script>
</body>
</html>
  `);
});

app.get('/status', (req, res) => {
  res.json({
    connected: connectionStatus === 'connected',
    number: global.conn?.user?.id?.split(':')[0] || null
  });
});

app.get('/qr', (req, res) => {
  res.json({ qr: currentQR });
});

app.post('/pairing', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.json({ error: 'Invalid phone number' });
    }
    const code = await global.conn.requestPairingCode(phone);
    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
    console.log(chalk.green(`\n🔐 Code: ${formattedCode} for ${phone}\n`));
    res.json({ code: formattedCode });
  } catch (error) {
    res.json({ error: 'Failed to generate' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(chalk.green(`\n✅ Server: http://localhost:${PORT}\n`));
});

async function startBot() {
  const {state, saveCreds} = await useMultiFileAuthState(global.sessionName);
  const {version} = await fetchLatestBaileysVersion();
  
  const connectionOptions = {
    version,
    logger: Pino({level: 'silent'}),
    printQRInTerminal: false,
    browser: ['YOUSAF-BALOCH-MD', 'Safari', '1.0.0'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({level: 'silent'})),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      return {message: ''};
    },
    msgRetryCounterMap: MessageRetryMap,
  };

  global.conn = makeWASocket(connectionOptions);

  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
    }, 30 * 1000);
  }

  global.conn.ev.on('connection.update', async (update) => {
    const {connection, lastDisconnect, qr} = update;
    
    if (qr) currentQR = qr;
    
    const code = lastDisconnect?.error?.output?.statusCode;
    
    if (code && code !== DisconnectReason.loggedOut && !global.conn?.ws.socket) {
      console.log(chalk.yellow('⚠️ Reconnecting...'));
      connectionStatus = 'reconnecting';
      setTimeout(() => startBot(), 3000);
    }
    
    if (connection === 'open') {
      connectionStatus = 'connected';
      console.log(chalk.green('\n✅ BOT CONNECTED!\n'));
    }
  });

  global.conn.ev.on('creds.update', saveCreds);

  global.plugins = {};
  const pluginFolder = path.join(__dirname, './plugins');
  if (existsSync(pluginFolder)) {
    const files = readdirSync(pluginFolder).filter(f => f.endsWith('.js'));
    for (const file of files) {
      try {
        const plugin = await import(pathToFileURL(path.join(pluginFolder, file)).href);
        global.plugins[file] = plugin.default || plugin;
      } catch (e) {}
    }
  }
}

startBot();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
