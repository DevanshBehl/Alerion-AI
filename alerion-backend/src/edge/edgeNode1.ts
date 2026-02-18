/**
 * Alerion AI — Edge Node 1
 * Machine: MACHINE_001 | Type: L (Low capacity)
 * Standalone process — run with: npm run start:edge1
 */

import { startEdgeNode } from './edgeSimulator.js';

startEdgeNode({
    machineId: 'MACHINE_001',
    machineType: 'L',
    intervalMs: 500,
    varianceFactor: 1.0,
});
