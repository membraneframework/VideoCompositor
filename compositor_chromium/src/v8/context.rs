use log::warn;

use crate::cef::V8Value;
use crate::cef_string::CefString;
use crate::{
    cef::V8Global,
    validated::{Validatable, Validated, ValidatedError},
};

use super::V8Object;

/// JavaScript V8 engine context.
/// Available only on the renderer process
pub struct V8Context {
    inner: Validated<chromium_sys::cef_v8context_t>,
}

impl V8Context {
    pub(crate) fn new(v8_context: *mut chromium_sys::cef_v8context_t) -> Self {
        let inner = Validated::new(v8_context);
        Self { inner }
    }

    pub fn enter(&self) -> Result<V8ContextEntered<'_>, V8ContextError> {
        unsafe {
            let ctx = self.inner.get()?;
            let enter_context = (*ctx).enter.unwrap();
            enter_context(ctx);
        }

        Ok(V8ContextEntered(self))
    }

    pub fn global(&self) -> Result<V8Global, V8ContextError> {
        unsafe {
            let ctx = self.inner.get()?;
            let get_global = (*ctx).get_global.unwrap();
            let global = Validated::new(get_global(ctx));

            Ok(V8Global(V8Object(global)))
        }
    }

    pub fn eval(&self, code: &str) -> Result<V8Value, V8ContextError> {
        unsafe {
            let ctx = self.inner.get()?;
            let eval = (*ctx).eval.unwrap();
            let code = CefString::new_raw(code);
            let mut retval: *mut chromium_sys::cef_v8value_t = std::ptr::null_mut();
            let mut exception: *mut chromium_sys::cef_v8exception_t = std::ptr::null_mut();

            eval(ctx, &code, std::ptr::null(), 0, &mut retval, &mut exception);
            if !exception.is_null() {
                let get_message = (*exception).get_message.unwrap();
                let message = CefString::from_userfree(get_message(exception));
                return Err(V8ContextError::EvalFailed(message));
            }

            Ok(V8Value::from_raw(retval))
        }
    }
}

pub struct V8ContextEntered<'a>(&'a V8Context);

impl<'a> Drop for V8ContextEntered<'a> {
    fn drop(&mut self) {
        unsafe {
            match self.0.inner.get() {
                Ok(ctx) => {
                    let exit_context = (*ctx).exit.unwrap();
                    exit_context(ctx);
                }
                Err(err) => warn!("Could not exit the context: {err}"),
            }
        }
    }
}

impl Validatable for chromium_sys::cef_v8context_t {
    fn is_valid(&mut self) -> bool {
        let is_valid = self.is_valid.unwrap();
        unsafe { is_valid(self) == 1 }
    }
}

#[derive(Debug, thiserror::Error)]
pub enum V8ContextError {
    #[error("V8Context is no longer valid")]
    NotValid(#[from] ValidatedError),

    #[error("Eval failed: {0}")]
    EvalFailed(String),
}
