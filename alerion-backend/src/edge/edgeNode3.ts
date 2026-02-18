/**
 * Alerion AI — Edge Node 3
 * Machine: MACHINE_003 | Type: H (High capacity)
 * Standalone process — run with: npm run start:edge3
 */

import { startEdgeNode } from './edgeSimulator.js';

startEdgeNode({
    machineId: 'MACHINE_003',
    machineType: 'H',
    intervalMs: 500,
    varianceFactor: 0.9,
});
