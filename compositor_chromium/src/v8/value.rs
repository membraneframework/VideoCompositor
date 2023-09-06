use crate::validated::{Validatable, Validated, ValidatedError};

use super::{
    array::V8Array, array_buffer::V8ArrayBuffer, bool::V8Bool, numbers::*, object::V8Object,
    string::V8String,
};

/// Represents JavaScript values
pub enum V8Value {
    Undefined(V8GenericValue),
    Null(V8GenericValue),
    Bool(V8Bool),
    Int(V8Int),
    Uint(V8Uint),
    Double(V8Double),
    String(V8String),
    Array(V8Array),
    ArrayBuffer(V8ArrayBuffer),
    Object(V8Object),

    // Not implemented
    Function(V8GenericValue),
    Date(V8GenericValue),
    Promise(V8GenericValue),
}

impl V8Value {
    pub(crate) fn from_raw(v8_value: *mut chromium_sys::cef_v8value_t) -> Self {
        let validated_value = Validated(v8_value);
        if Self::is_undefined(v8_value) {
            return Self::Undefined(V8GenericValue(validated_value));
        }
        if Self::is_null(v8_value) {
            return Self::Null(V8GenericValue(validated_value));
        }
        if Self::is_bool(v8_value) {
            return Self::Bool(V8Bool(validated_value));
        }
        if Self::is_int(v8_value) {
            return Self::Int(V8Int(validated_value));
        }
        if Self::is_uint(v8_value) {
            return Self::Uint(V8Uint(validated_value));
        }
        if Self::is_double(v8_value) {
            return Self::Double(V8Double(validated_value));
        }
        if Self::is_string(v8_value) {
            return Self::String(V8String(validated_value));
        }
        if Self::is_array(v8_value) {
            return Self::Array(V8Array(validated_value));
        }
        if Self::is_array_buffer(v8_value) {
            return Self::ArrayBuffer(V8ArrayBuffer(validated_value));
        }
        if Self::is_object(v8_value) {
            return Self::Object(V8Object(validated_value));
        }
        if Self::is_function(v8_value) {
            return Self::Function(V8GenericValue(validated_value));
        }
        if Self::is_date(v8_value) {
            return Self::Date(V8GenericValue(validated_value));
        }
        if Self::is_promise(v8_value) {
            return Self::Promise(V8GenericValue(validated_value));
        }

        unreachable!("Unknown v8 value")
    }

    pub(crate) fn get_raw(&self) -> Result<*mut chromium_sys::cef_v8value_t, V8ValueError> {
        let raw_value = match self {
            V8Value::Undefined(V8GenericValue(v)) => v.get()?,
            V8Value::Null(V8GenericValue(v)) => v.get()?,
            V8Value::Bool(V8Bool(v)) => v.get()?,
            V8Value::Int(V8Int(v)) => v.get()?,
            V8Value::Uint(V8Uint(v)) => v.get()?,
            V8Value::Double(V8Double(v)) => v.get()?,
            V8Value::String(V8String(v)) => v.get()?,
            V8Value::Array(V8Array(v)) => v.get()?,
            V8Value::Object(V8Object(v)) => v.get()?,
            V8Value::ArrayBuffer(V8ArrayBuffer(v)) => v.get()?,
            V8Value::Function(V8GenericValue(v)) => v.get()?,
            V8Value::Date(V8GenericValue(v)) => v.get()?,
            V8Value::Promise(V8GenericValue(v)) => v.get()?,
        };

        Ok(raw_value)
    }

    fn is_undefined(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_undefined = (*v8_value).is_undefined.unwrap();
            is_undefined(v8_value) == 1
        }
    }

    fn is_null(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_null = (*v8_value).is_null.unwrap();
            is_null(v8_value) == 1
        }
    }

    fn is_bool(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_bool = (*v8_value).is_bool.unwrap();
            is_bool(v8_value) == 1
        }
    }

    fn is_int(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_int = (*v8_value).is_int.unwrap();
            is_int(v8_value) == 1
        }
    }

    fn is_uint(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_uint = (*v8_value).is_uint.unwrap();
            is_uint(v8_value) == 1
        }
    }

    fn is_double(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_double = (*v8_value).is_double.unwrap();
            is_double(v8_value) == 1
        }
    }

    fn is_string(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_string = (*v8_value).is_string.unwrap();
            is_string(v8_value) == 1
        }
    }

    fn is_array(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_array = (*v8_value).is_array.unwrap();
            is_array(v8_value) == 1
        }
    }

    fn is_array_buffer(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_array = (*v8_value).is_array_buffer.unwrap();
            is_array(v8_value) == 1
        }
    }

    fn is_object(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_object = (*v8_value).is_object.unwrap();
            is_object(v8_value) == 1
        }
    }

    fn is_function(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_function = (*v8_value).is_function.unwrap();
            is_function(v8_value) == 1
        }
    }

    fn is_date(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_date = (*v8_value).is_date.unwrap();
            is_date(v8_value) == 1
        }
    }

    fn is_promise(v8_value: *mut chromium_sys::cef_v8value_t) -> bool {
        unsafe {
            let is_promise = (*v8_value).is_promise.unwrap();
            is_promise(v8_value) == 1
        }
    }
}

impl Validatable for chromium_sys::cef_v8value_t {
    fn is_valid(&mut self) -> bool {
        let is_valid = self.is_valid.unwrap();
        unsafe { is_valid(self) == 1 }
    }
}

pub struct V8GenericValue(Validated<chromium_sys::cef_v8value_t>);

#[derive(Debug, thiserror::Error)]
pub enum V8ValueError {
    #[error("V8Value is no longer valid")]
    NotValid(#[from] ValidatedError),
}
