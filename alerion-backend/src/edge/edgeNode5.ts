/**
 * Alerion AI — Edge Node 5
 * Machine: MACHINE_005 | Type: M (Medium capacity)
 * Standalone process — run with: npm run start:edge5
 */

import { startEdgeNode } from './edgeSimulator.js';

startEdgeNode({
    machineId: 'MACHINE_005',
    machineType: 'M',
    intervalMs: 500,
    varianceFactor: 0.8,
});
