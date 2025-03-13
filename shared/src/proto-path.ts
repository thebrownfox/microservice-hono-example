import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the absolute path to a proto file in the shared package
 * @param protoFileName The name of the proto file
 * @returns The absolute path to the proto file
 */
export function getProtoPath(protoFileName: string): string {
    // When used from node_modules, the path structure is different
    // Try the development path first
    const devPath = path.join(__dirname, '..', 'proto', protoFileName);

    // If we're running from node_modules (built package)
    const prodPath = path.join(__dirname, 'proto', protoFileName);

    return devPath;
}
