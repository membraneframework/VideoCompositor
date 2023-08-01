use std::thread;
use std::{ops::Deref, sync::Arc};

use compositor_common::{
    scene::{InputId, OutputId, SceneSpec},
    transformation::{TransformationRegistryKey, TransformationSpec},
};
use compositor_common::{Frame, Framerate};
use compositor_render::{
    renderer::{scene::SceneUpdateError, RendererRegisterTransformationError},
    Renderer,
};
use crossbeam_channel::unbounded;
use log::error;

use crate::{
    map::SyncHashMap,
    queue::{Queue, QueueError},
};

pub trait PipelineOutput {
    fn send_frame(&self, frame: Frame);
}

pub struct Pipeline<Output: PipelineOutput> {
    outputs: SyncHashMap<OutputId, Arc<Output>>,
    queue: Queue,
    renderer: Renderer,
}

impl<Output: PipelineOutput + Send + Sync + 'static> Pipeline<Output> {
    pub fn new(framerate: Framerate) -> Self {
        Pipeline {
            outputs: SyncHashMap::new(),
            queue: Queue::new(framerate),
            renderer: Renderer::new().unwrap(), // TODO: handle error
        }
    }

    pub fn add_input(&self, input_id: InputId) {
        self.queue.add_input(input_id);
    }

    pub fn add_output(&self, output_id: OutputId, output: Arc<Output>) {
        self.outputs.insert(output_id, output);
    }

    pub fn push_input_data(&self, input_id: InputId, frame: Frame) -> Result<(), QueueError> {
        self.queue.enqueue_frame(input_id, frame)
    }

    pub fn update_scene(&self, scene_spec: SceneSpec) -> Result<(), SceneUpdateError> {
        self.renderer.update_scene(scene_spec)
    }

    pub fn register_transformation(
        &self,
        key: TransformationRegistryKey,
        spec: TransformationSpec,
    ) -> Result<(), RendererRegisterTransformationError> {
        self.renderer.register_transformation(key, spec)
    }

    #[allow(dead_code)]
    fn on_output_data_received(&self, output_id: OutputId, frame: Frame) {
        match self.outputs.get_cloned(&output_id) {
            Some(output) => output.send_frame(frame),
            None => {
                error!("Output {:?} not found", output_id);
            }
        }
    }

    pub fn start(self: &Arc<Self>) {
        let (frames_sender, frames_receiver) = unbounded();
        let pipeline = self.clone();
        let renderer = self.renderer.clone();

        pipeline.queue.start(frames_sender);

        thread::spawn(move || {
            // TODO move it to pipeline - fix Send, Sync stuff
            loop {
                let input_frames = frames_receiver.recv().unwrap();
                if !input_frames.frames.is_empty() {
                    let output = renderer.render(input_frames);

                    for (id, frame) in &output.frames {
                        let output = pipeline.outputs.get_cloned(id);
                        let Some(output) = output else {
                                error!("no output with id {}", id.0.0);
                                continue;
                        };

                        output.send_frame(frame.deref().clone());
                    }
                }
            }
        });
    }
}
