/**
 * Alerion AI — Edge Node 4
 * Machine: MACHINE_004 | Type: L (Low capacity)
 * Standalone process — run with: npm run start:edge4
 */

import { startEdgeNode } from './edgeSimulator.js';

startEdgeNode({
    machineId: 'MACHINE_004',
    machineType: 'L',
    intervalMs: 500,
    varianceFactor: 1.2,
});
