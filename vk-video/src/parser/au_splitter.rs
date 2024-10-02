use h264_reader::nal::slice::PicOrderCountLsb;

use super::Slice;

#[derive(Default)]
pub(crate) struct AUSplitter {
    buffered_nals: Vec<Slice>,
}

impl AUSplitter {
    pub(crate) fn put_slice(&mut self, slice: Slice) -> Option<Vec<Slice>> {
        if self.is_new_au(&slice) {
            let au = std::mem::take(&mut self.buffered_nals);
            self.buffered_nals.push(slice);
            if !au.is_empty() {
                Some(au)
            } else {
                None
            }
        } else {
            self.buffered_nals.push(slice);
            None
        }
    }

    /// returns `true` if `slice` is a first slice in an Access Unit
    fn is_new_au(&self, slice: &Slice) -> bool {
        let Some(last) = self.buffered_nals.last() else {
            return true;
        };

        first_mb_in_slice_zero(slice)
            || frame_num_differs(last, slice)
            || pps_id_differs(last, slice)
            || field_pic_flag_differs(last, slice)
            || nal_ref_idc_differs_one_zero(last, slice)
            || pic_order_cnt_zero_check(last, slice)
            || idr_and_non_idr(last, slice)
            || idrs_where_idr_pic_id_differs(last, slice)
    }
}

// defguardp first_mb_in_slice_zero(a)
//           when a.first_mb_in_slice == 0 and
//                  a.nal_unit_type in [1, 2, 5]
//
fn first_mb_in_slice_zero(slice: &Slice) -> bool {
    slice.header.first_mb_in_slice == 0
}

// defguardp frame_num_differs(a, b) when a.frame_num != b.frame_num
//
fn frame_num_differs(last: &Slice, curr: &Slice) -> bool {
    last.header.frame_num != curr.header.frame_num
}

// defguardp pic_parameter_set_id_differs(a, b)
//           when a.pic_parameter_set_id != b.pic_parameter_set_id
//
fn pps_id_differs(last: &Slice, curr: &Slice) -> bool {
    last.pps_id != curr.pps_id
}

// defguardp field_pic_flag_differs(a, b) when a.field_pic_flag != b.field_pic_flag
//
// defguardp bottom_field_flag_differs(a, b) when a.bottom_field_flag != b.bottom_field_flag
//
fn field_pic_flag_differs(last: &Slice, curr: &Slice) -> bool {
    last.header.field_pic != curr.header.field_pic
}

// defguardp nal_ref_idc_differs_one_zero(a, b)
//           when (a.nal_ref_idc == 0 or b.nal_ref_idc == 0) and
//                  a.nal_ref_idc != b.nal_ref_idc
//
fn nal_ref_idc_differs_one_zero(last: &Slice, curr: &Slice) -> bool {
    (last.nal_header.nal_ref_idc() == 0 || curr.nal_header.nal_ref_idc() == 0)
        && last.nal_header.nal_ref_idc() != curr.nal_header.nal_ref_idc()
}

// defguardp pic_order_cnt_zero_check(a, b)
//           when a.pic_order_cnt_type == 0 and b.pic_order_cnt_type == 0 and
//                  (a.pic_order_cnt_lsb != b.pic_order_cnt_lsb or
//                     a.delta_pic_order_cnt_bottom != b.delta_pic_order_cnt_bottom)
//
fn pic_order_cnt_zero_check(last: &Slice, curr: &Slice) -> bool {
    let (last_pic_order_cnt_lsb, last_delta_pic_order_cnt_bottom) =
        match last.header.pic_order_cnt_lsb {
            Some(PicOrderCountLsb::Frame(pic_order_cnt_lsb)) => (pic_order_cnt_lsb, 0),
            Some(PicOrderCountLsb::FieldsAbsolute {
                pic_order_cnt_lsb,
                delta_pic_order_cnt_bottom,
            }) => (pic_order_cnt_lsb, delta_pic_order_cnt_bottom),
            _ => return false,
        };

    let (curr_pic_order_cnt_lsb, curr_delta_pic_order_cnt_bottom) =
        match curr.header.pic_order_cnt_lsb {
            Some(PicOrderCountLsb::Frame(pic_order_cnt_lsb)) => (pic_order_cnt_lsb, 0),
            Some(PicOrderCountLsb::FieldsAbsolute {
                pic_order_cnt_lsb,
                delta_pic_order_cnt_bottom,
            }) => (pic_order_cnt_lsb, delta_pic_order_cnt_bottom),
            _ => return false,
        };

    last_pic_order_cnt_lsb != curr_pic_order_cnt_lsb
        || last_delta_pic_order_cnt_bottom != curr_delta_pic_order_cnt_bottom
}

// defguardp pic_order_cnt_one_check_zero(a, b)
//           when a.pic_order_cnt_type == 1 and b.pic_order_cnt_type == 1 and
//                  hd(a.delta_pic_order_cnt) != hd(b.delta_pic_order_cnt)
// TODO

// defguardp pic_order_cnt_one_check_one(a, b)
//           when a.pic_order_cnt_type == 1 and b.pic_order_cnt_type == 1 and
//                  hd(hd(a.delta_pic_order_cnt)) != hd(hd(b.delta_pic_order_cnt))
// TODO

// defguardp idr_and_non_idr(a, b)
//           when (a.nal_unit_type == 5 or b.nal_unit_type == 5) and
//                  a.nal_unit_type != b.nal_unit_type
//
fn idr_and_non_idr(last: &Slice, curr: &Slice) -> bool {
    (last.nal_header.nal_unit_type().id() == 5) ^ (curr.nal_header.nal_unit_type().id() == 5)
}

// defguardp idrs_with_idr_pic_id_differ(a, b)
//           when a.nal_unit_type == 5 and b.nal_unit_type == 5 and a.idr_pic_id != b.idr_pic_id
fn idrs_where_idr_pic_id_differs(last: &Slice, curr: &Slice) -> bool {
    match (last.header.idr_pic_id, curr.header.idr_pic_id) {
        (Some(last), Some(curr)) => last != curr,
        _ => false,
    }
}
