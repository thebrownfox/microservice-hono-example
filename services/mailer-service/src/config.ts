import fs from "node:fs";
import ini from "ini";
import path from "node:path";

// Configuration interface
export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export interface ServerConfig {
  port: number;
}

export interface Config {
  smtp: SmtpConfig;
  server: ServerConfig;
}

// Load configuration from config.ini file
export function loadConfig(configPath: string): Config {
  try {
    const configFile = fs.readFileSync(configPath, "utf-8");
    const parsedConfig = ini.parse(configFile);

    // Convert string values to appropriate types
    const config: Config = {
      smtp: {
        host: parsedConfig.smtp.host,
        port: Number.parseInt(parsedConfig.smtp.port, 10),
        secure: parsedConfig.smtp.secure === "true",
        user: parsedConfig.smtp.user,
        pass: parsedConfig.smtp.pass,
        from: parsedConfig.smtp.from,
      },
      server: {
        port: Number.parseInt(parsedConfig.server.port, 10),
      },
    };

    return config;
  } catch (error) {
    console.error(`Error loading configuration: ${error}`);
    throw error;
  }
}
