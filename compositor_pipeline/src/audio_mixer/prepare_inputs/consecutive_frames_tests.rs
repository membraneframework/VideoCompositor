use std::{sync::Arc, time::Duration};

use crate::audio_mixer::InputSamples;

use super::frame_input_samples;

#[test]
fn test_continuity_between_frames() {
    // 6 samples at sample rate 48000
    let batch_duration = Duration::from_micros(125);
    let start = Duration::from_millis(20);
    let end = start + batch_duration;
    let sample_rate = 48000;
    let sample_duration = Duration::from_secs_f64(1.0 / sample_rate as f64);
    let small_error = Duration::from_secs_f64(sample_duration.as_secs_f64() * 0.001);
    let half_sample = Duration::from_secs_f64(sample_duration.as_secs_f64() * 0.5);

    let first_batch = Arc::new(vec![(1, 1), (2, 2), (3, 3), (4, 4)]);
    let second_batch = Arc::new(vec![(5, 5), (6, 6), (7, 7), (8, 8)]);
    let third_batch = Arc::new(vec![(9, 9), (10, 10), (11, 11), (12, 12)]);

    // shifted by half sample
    let first_batch_start = start - sample_duration - half_sample;
    let second_batch_start = first_batch_start + (4 * sample_duration);
    let third_batch_start = first_batch_start + (8 * sample_duration);
    assert_eq!(
        frame_input_samples(
            start,
            end,
            vec![
                InputSamples {
                    samples: first_batch.clone(),
                    start_pts: first_batch_start,
                    end_pts: first_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
            ],
            sample_rate
        ),
        vec![(2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7)]
    );
    assert_eq!(
        frame_input_samples(
            start + batch_duration,
            end + batch_duration,
            vec![
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: third_batch.clone(),
                    start_pts: third_batch_start,
                    end_pts: third_batch_start + (4 * sample_duration)
                }
            ],
            sample_rate
        ),
        vec![(8, 8), (9, 9), (10, 10), (11, 11), (12, 12), (0, 0)]
    );

    // shifted by small_error (subtract)
    let first_batch_start = start - sample_duration - small_error;
    let second_batch_start = first_batch_start + (4 * sample_duration);
    let third_batch_start = first_batch_start + (8 * sample_duration);
    assert_eq!(
        frame_input_samples(
            start,
            end,
            vec![
                InputSamples {
                    samples: first_batch.clone(),
                    start_pts: first_batch_start,
                    end_pts: first_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
            ],
            sample_rate
        ),
        vec![(2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7)]
    );
    assert_eq!(
        frame_input_samples(
            start + batch_duration,
            end + batch_duration,
            vec![
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: third_batch.clone(),
                    start_pts: third_batch_start,
                    end_pts: third_batch_start + (4 * sample_duration)
                }
            ],
            sample_rate
        ),
        vec![(8, 8), (9, 9), (10, 10), (11, 11), (12, 12), (0, 0)]
    );

    // shifted by small_error (add)
    let first_batch_start = start - sample_duration + small_error;
    let second_batch_start = first_batch_start + (4 * sample_duration);
    let third_batch_start = first_batch_start + (8 * sample_duration);
    assert_eq!(
        frame_input_samples(
            start,
            end,
            vec![
                InputSamples {
                    samples: first_batch.clone(),
                    start_pts: first_batch_start,
                    end_pts: first_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
            ],
            sample_rate
        ),
        vec![(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6)]
    );
    assert_eq!(
        frame_input_samples(
            start + batch_duration,
            end + batch_duration,
            vec![
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: third_batch.clone(),
                    start_pts: third_batch_start,
                    end_pts: third_batch_start + (4 * sample_duration)
                }
            ],
            sample_rate
        ),
        vec![(7, 7), (8, 8), (9, 9), (10, 10), (11, 11), (12, 12)]
    );

    // shifted by small_error (subtract) + batches overlapping between frames
    let first_batch_start = start - sample_duration - small_error;
    let second_batch_start = first_batch_start + (4 * sample_duration);
    let third_batch_start = first_batch_start + (8 * sample_duration) - small_error;
    assert_eq!(
        frame_input_samples(
            start,
            end,
            vec![
                InputSamples {
                    samples: first_batch.clone(),
                    start_pts: first_batch_start,
                    end_pts: first_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
            ],
            sample_rate
        ),
        vec![(2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7)]
    );
    assert_eq!(
        frame_input_samples(
            start + batch_duration,
            end + batch_duration,
            vec![
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: third_batch.clone(),
                    start_pts: third_batch_start,
                    end_pts: third_batch_start + (4 * sample_duration)
                }
            ],
            sample_rate
        ),
        vec![(8, 8), (9, 9), (10, 10), (11, 11), (12, 12), (0, 0)]
    );

    // shifted by small_error (add) + small gap between batches
    let first_batch_start = start - sample_duration + small_error;
    let second_batch_start = first_batch_start + (4 * sample_duration);
    let third_batch_start = first_batch_start + (8 * sample_duration) + small_error;
    assert_eq!(
        frame_input_samples(
            start,
            end,
            vec![
                InputSamples {
                    samples: first_batch.clone(),
                    start_pts: first_batch_start,
                    end_pts: first_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
            ],
            sample_rate
        ),
        vec![(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6)]
    );
    assert_eq!(
        frame_input_samples(
            start + batch_duration,
            end + batch_duration,
            vec![
                InputSamples {
                    samples: second_batch.clone(),
                    start_pts: second_batch_start,
                    end_pts: second_batch_start + (4 * sample_duration)
                },
                InputSamples {
                    samples: third_batch.clone(),
                    start_pts: third_batch_start,
                    end_pts: third_batch_start + (4 * sample_duration)
                }
            ],
            sample_rate
        ),
        vec![(7, 7), (8, 8), (9, 9), (10, 10), (11, 11), (12, 12)]
    );
}
