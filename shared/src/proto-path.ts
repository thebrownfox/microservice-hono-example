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
    // NOTE: When used from node_modules/dist, the path structure is different
    // NOTE: We use this only for development and copy the whole shared package when building the docker image
    const protoPath = path.join(__dirname, '..', 'proto', protoFileName);

    return protoPath;
}
