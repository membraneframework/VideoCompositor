use std::{env, path::Path, str::FromStr, sync::Arc};

#[derive(Debug, Clone)]
pub struct Config {
    pub api_port: u16,
    pub logger: LoggerConfig,
    pub path_to_assets: Arc<Path>,
}

#[derive(Debug, Clone)]
pub struct LoggerConfig {
    pub format: LoggerFormat,
    pub level: String,
}

#[derive(Debug, Copy, Clone)]
pub enum LoggerFormat {
    Pretty,
    Json,
    Compact,
}

impl FromStr for LoggerFormat {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "json" => Ok(LoggerFormat::Json),
            "pretty" => Ok(LoggerFormat::Pretty),
            "compact" => Ok(LoggerFormat::Compact),
            _ => Err("invalid logger format"),
        }
    }
}

pub fn read_config() -> Config {
    try_read_config().expect("Failed to read the config from environment variables.")
}

fn try_read_config() -> Result<Config, String> {
    let api_port = match env::var("LIVE_COMPOSITOR_PLAYGROUND_API_PORT") {
        Ok(api_port) => api_port
            .parse::<u16>()
            .map_err(|_| "LIVE_COMPOSITOR_PLAYGROUND_API_PORT has to be valid port number")?,
        Err(_) => 9000,
    };

    let logger_level = match env::var("LIVE_COMPOSITOR_PLAYGROUND_LOGGER_LEVEL") {
        Ok(level) => level,
        Err(_) => "info,wgpu_hal=warn,wgpu_core=warn".to_string(),
    };

    // When building in repo use compact logger
    let default_logger_format = match env::var("CARGO_MANIFEST_DIR") {
        Ok(_) => LoggerFormat::Compact,
        Err(_) => LoggerFormat::Json,
    };
    let logger_format = match env::var("LIVE_COMPOSITOR_PLAYGROUND_LOGGER_FORMAT") {
        Ok(format) => LoggerFormat::from_str(&format).unwrap_or(default_logger_format),
        Err(_) => default_logger_format,
    };

    let path_to_assets = match env::var("PLAYGROUND_ASSETS_PATH") {
        Ok(path) => Arc::from(Path::new(&path)),
        Err(_) => Arc::from(Path::new("./assets")),
    };

    let config = Config {
        api_port,
        logger: LoggerConfig {
            format: logger_format,
            level: logger_level,
        },
        path_to_assets,
    };
    Ok(config)
}
