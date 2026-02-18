/**
 * Alerion AI — WebSocket Test Client
 *
 * Connects to the WebSocket server and logs received predictions.
 * Run: npm run ws:test
 *
 * Usage: npx tsx src/test/wsTestClient.ts [ws-url]
 * Default URL: ws://localhost:8080
 */

import WebSocket from 'ws';

const WS_URL = process.argv[2] || 'ws://localhost:8080';
let messageCount = 0;
let alertCount = 0;

console.log(`\n╔════════════════════════════════════════════╗`);
console.log(`║  Alerion AI — WebSocket Test Client        ║`);
console.log(`╚════════════════════════════════════════════╝\n`);
console.log(`Connecting to: ${WS_URL}\n`);

function connect(): void {
    const ws = new WebSocket(WS_URL);

    ws.on('open', () => {
        console.log('✅ Connected to Alerion AI WebSocket server\n');
        console.log('─'.repeat(70));
        console.log(
            'TYPE'.padEnd(12) +
            'MACHINE'.padEnd(15) +
            'PRED'.padEnd(6) +
            'CONF'.padEnd(8) +
            'ANOMALY'.padEnd(10) +
            'FAILURE TYPE'
        );
        console.log('─'.repeat(70));
    });

    ws.on('message', (data: WebSocket.RawData) => {
        try {
            const msg = JSON.parse(data.toString());
            messageCount++;

            if (msg.type === 'system') {
                console.log(`\n📡 System: ${msg.payload.message} (${msg.payload.clientId})\n`);
                return;
            }

            if (msg.type === 'heartbeat') return;

            const p = msg.payload;
            const icon = msg.type === 'alert' ? '🚨' : '  ';
            if (msg.type === 'alert') alertCount++;

            console.log(
                `${icon} ${msg.type.padEnd(10)}` +
                `${p.machine_id.padEnd(15)}` +
                `${String(p.prediction).padEnd(6)}` +
                `${p.confidence.toFixed(3).padEnd(8)}` +
                `${p.anomalyScore.toFixed(3).padEnd(10)}` +
                `${p.failure_type}`
            );

            // Summary every 50 messages
            if (messageCount % 50 === 0) {
                console.log(`\n📊 Summary: ${messageCount} messages received, ${alertCount} alerts\n`);
            }
        } catch {
            console.log('Raw:', data.toString().substring(0, 100));
        }
    });

    ws.on('close', (code: number) => {
        console.log(`\n❌ Disconnected (code: ${code}). Reconnecting in 3s...`);
        setTimeout(connect, 3000);
    });

    ws.on('error', (err: Error) => {
        console.error(`Error: ${err.message}`);
    });
}

connect();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(`\n\n📊 Final Summary: ${messageCount} messages, ${alertCount} alerts`);
    process.exit(0);
});
