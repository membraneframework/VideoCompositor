use std::time::Duration;

use compositor_common::util::{
    align::{HorizontalAlign, VerticalAlign},
    colors::RGBAColor,
};

use crate::transformations::layout::NestedLayout;

use super::{
    layout::StatefulLayoutComponent, scene_state::BuildStateTreeCtx, BuildSceneError, Component,
    ComponentId, IntermediateNode, Position, Size, StatefulComponent, TilesComponent,
};

mod layout;

#[derive(Debug, Clone)]
pub(super) struct StatefulTilesComponent {
    component: TilesComponentParams,
    children: Vec<StatefulComponent>,
}

#[derive(Debug, Clone)]
struct TilesComponentParams {
    id: Option<ComponentId>,

    width: Option<f32>,
    height: Option<f32>,

    background_color: RGBAColor,
    tile_aspect_ratio: (u32, u32),
    margin: f32,
    padding: f32,
    horizontal_alignment: HorizontalAlign,
    vertical_alignment: VerticalAlign,
}

impl StatefulTilesComponent {
    pub(super) fn component_id(&self) -> Option<&ComponentId> {
        self.component.id.as_ref()
    }

    pub(super) fn position(&self, _pts: Duration) -> Position {
        Position::Static {
            width: self.component.width,
            height: self.component.height,
        }
    }

    pub(super) fn children(&self) -> Vec<&StatefulComponent> {
        self.children.iter().collect()
    }

    pub(super) fn children_mut(&mut self) -> Vec<&mut StatefulComponent> {
        self.children.iter_mut().collect()
    }

    pub(super) fn intermediate_node(&self) -> Result<IntermediateNode, BuildSceneError> {
        let children = self
            .children
            .iter()
            .map(|component| {
                let node = component.intermediate_node()?;
                match node {
                    IntermediateNode::Layout { root: _, children } => Ok(children),
                    _ => Ok(vec![node]),
                }
            })
            .collect::<Result<Vec<_>, _>>()? // convert Vec<Result<Vec<_>>> into Result<Vec<Vec<_>>>
            .into_iter()
            .flatten()
            .collect();

        Ok(IntermediateNode::Layout {
            root: StatefulLayoutComponent::Tiles(self.clone()),
            children,
        })
    }

    pub(super) fn layout(&self, size: Size, pts: Duration) -> NestedLayout {
        self.component.layout(size, &self.children, pts)
    }
}

impl TilesComponent {
    pub(super) fn stateful_component(
        self,
        ctx: &BuildStateTreeCtx,
    ) -> Result<StatefulComponent, BuildSceneError> {
        let tiles = StatefulTilesComponent {
            component: TilesComponentParams {
                id: self.id,
                width: self.width,
                height: self.height,
                background_color: self.background_color,
                tile_aspect_ratio: self.tile_aspect_ratio,
                margin: self.margin,
                padding: self.padding,
                horizontal_alignment: self.horizontal_alignment,
                vertical_alignment: self.vertical_alignment,
            },
            children: self
                .children
                .into_iter()
                .map(|c| Component::stateful_component(c, ctx))
                .collect::<Result<_, _>>()?,
        };

        Ok(StatefulComponent::Layout(StatefulLayoutComponent::Tiles(
            tiles,
        )))
    }
}
