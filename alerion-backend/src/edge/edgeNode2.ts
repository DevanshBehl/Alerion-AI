/**
 * Alerion AI — Edge Node 2
 * Machine: MACHINE_002 | Type: M (Medium capacity)
 * Standalone process — run with: npm run start:edge2
 */

import { startEdgeNode } from './edgeSimulator.js';

startEdgeNode({
    machineId: 'MACHINE_002',
    machineType: 'M',
    intervalMs: 500,
    varianceFactor: 1.1,
});
