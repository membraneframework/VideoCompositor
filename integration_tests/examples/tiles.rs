use anyhow::Result;
use live_compositor::types::Resolution;
use log::info;
use serde_json::json;

use integration_tests::{
    examples::{self, run_example},
    ffmpeg::{start_ffmpeg_receive, start_ffmpeg_send_testsrc},
};

const VIDEO_RESOLUTION: Resolution = Resolution {
    width: 1920,
    height: 1080,
};

const IP: &str = "127.0.0.1";
const INPUT_PORT: u16 = 8002;
const OUTPUT_PORT: u16 = 8004;

fn main() {
    run_example(client_code);
}

fn client_code() -> Result<()> {
    info!("[example] Start listening on output port.");
    start_ffmpeg_receive(Some(OUTPUT_PORT), None)?;

    info!("[example] Send register input request.");
    examples::post(
        "input/input_1/register",
        &json!({
            "type": "rtp_stream",
            "port": INPUT_PORT,
            "video": {
                "decoder": "ffmpeg_h264"
            }
        }),
    )?;

    let scene_with_inputs = |n: usize| {
        let children: Vec<_> = (0..n)
            .map(|_| {
                json!({
                    "type": "input_stream",
                    "input_id": "input_1",
                })
            })
            .collect();
        json!({
            "type": "tiles",
            "id": "tile",
            "padding": 5,
            "background_color_rgba": "#444444FF",
            "children": children,
            "transition": {
                "duration_ms": 700,
                "easing_function": {
                    "function_name": "cubic_bezier",
                    "points": [0.35, 0.22, 0.1, 0.8]
                }
            },
        })
    };

    info!("[example] Send register output request.");
    examples::post(
        "output/output_1/register",
        &json!({
            "type": "rtp_stream",
            "ip": IP,
            "port": OUTPUT_PORT,
            "video": {
                "resolution": {
                    "width": VIDEO_RESOLUTION.width,
                    "height": VIDEO_RESOLUTION.height,
                },
                "encoder": {
                    "type": "ffmpeg_h264",
                    "preset": "ultrafast"
                },
                "initial": {
                    "root": scene_with_inputs(0)
                }
            }
        }),
    )?;

    for i in 1..=16 {
        info!("[example] Update output");
        examples::post(
            "output/output_1/update",
            &json!({
                "video": {
                    "root": scene_with_inputs(i)
                },
                "schedule_time_ms": i * 1000,
            }),
        )?;
    }

    info!("[example] Start pipeline");
    examples::post("start", &json!({}))?;

    info!("[example] Start input stream");
    start_ffmpeg_send_testsrc(IP, INPUT_PORT, VIDEO_RESOLUTION)?;

    for i in 0..16 {
        info!("[example] Update output");
        examples::post(
            "output/output_1/update",
            &json!({
                "video": {
                    "root": scene_with_inputs(16 - i),
                },
                "schedule_time_ms": (20 + i) * 1000,
            }),
        )?;
    }

    info!("[example] Update output");
    examples::post(
        "output/output_1/update",
        &json!({
            "video": {
                "root": scene_with_inputs(4),
            },
            "schedule_time_ms": 40 * 1000,
        }),
    )?;

    Ok(())
}
