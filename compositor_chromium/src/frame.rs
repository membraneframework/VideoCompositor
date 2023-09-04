use crate::{
    cef::{ProcessId, ProcessMessage, ThreadId, V8Context},
    validated::{Validatable, Validated, ValidatedError},
};

/// Represents a renderable surface.
/// Each browser has a main frame which is the visible web page.
/// Browser can also have multiple smaller frames (for example when `<iframe>` is used)
pub struct Frame {
    inner: Validated<chromium_sys::cef_frame_t>,
}

impl Frame {
    pub(crate) fn new(frame: *mut chromium_sys::cef_frame_t) -> Self {
        let inner = Validated::new(frame);
        Self { inner }
    }

    /// Sends IPC message
    pub fn send_process_message(
        &self,
        pid: ProcessId,
        msg: ProcessMessage,
    ) -> Result<(), ValidatedError> {
        unsafe {
            let frame = self.inner.get()?;
            let send_message = (*frame).send_process_message.unwrap();
            send_message(frame, pid as u32, msg.inner);
        }

        Ok(())
    }

    /// If called on the renderer process it returns `Ok(V8Context)`, otherwise it's `Err(FrameError::V8ContextWrongThread)`
    pub fn v8_context(&self) -> Result<V8Context, FrameError> {
        let frame = self.inner.get()?;

        unsafe {
            if chromium_sys::cef_currently_on(ThreadId::Renderer as u32) != 1 {
                return Err(FrameError::V8ContextWrongThread);
            }

            let get_v8_context = (*frame).get_v8context.unwrap();
            let context = get_v8_context(frame);
            Ok(V8Context::new(context))
        }
    }
}

#[derive(Debug, thiserror::Error)]
pub enum FrameError {
    #[error("Frame is not longer valid")]
    NotValid(#[from] ValidatedError),

    #[error("Tried to retrieve V8Context on a wrong thread")]
    V8ContextWrongThread,
}

impl Validatable for chromium_sys::cef_frame_t {
    fn is_valid(&mut self) -> bool {
        unsafe {
            let is_valid = self.is_valid.unwrap();
            is_valid(self) == 1
        }
    }
}
