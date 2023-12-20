"use strict";(self.webpackChunkcompositor_live=self.webpackChunkcompositor_live||[]).push([[780,778,598],{8169:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>d,default:()=>u,frontMatter:()=>r,metadata:()=>c,toc:()=>h});var t=i(5893),o=i(1151),s=i(2732),l=i(9342);const r={sidebar_position:3,hide_table_of_contents:!0},d="Rescaler",c={id:"api/components/Rescaler",title:"Rescaler",description:"Rescaler is a layout component responsible for rescaling other components.",source:"@site/pages/api/components/Rescaler.md",sourceDirName:"api/components",slug:"/api/components/Rescaler",permalink:"/docs/api/components/Rescaler",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,hide_table_of_contents:!0},sidebar:"sidebar",previous:{title:"View",permalink:"/docs/api/components/View"},next:{title:"Tiles",permalink:"/docs/api/components/Tiles"}},a={},h=[{value:"Absolute positioning",id:"absolute-positioning",level:3},{value:"Static positioning",id:"static-positioning",level:3},{value:"Transitions",id:"transitions",level:3}];function p(e){const n={code:"code",h1:"h1",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"rescaler",children:"Rescaler"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"Rescaler"})," is a layout component responsible for rescaling other components."]}),"\n",(0,t.jsx)(n.h3,{id:"absolute-positioning",children:"Absolute positioning"}),"\n",(0,t.jsx)(l.default,{}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Rescaler"})," ",(0,t.jsx)(n.strong,{children:"does not"})," support absolute positioning for its child components. A child component will still be rendered, but all fields like ",(0,t.jsx)(n.code,{children:"top"}),", ",(0,t.jsx)(n.code,{children:"left"}),", ",(0,t.jsx)(n.code,{children:"right"}),", ",(0,t.jsx)(n.code,{children:"bottom"}),", and ",(0,t.jsx)(n.code,{children:"rotation"})," will be ignored."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Rescaler"})," can be absolutely positioned relative to its parent, if the parent component supports it."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"static-positioning",children:"Static positioning"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"Rescaler"})," always have exactly one child that will be proportionally rescaled to match the parent."]}),"\n",(0,t.jsx)(n.h3,{id:"transitions",children:"Transitions"}),"\n",(0,t.jsxs)(n.p,{children:["On the scene update, a ",(0,t.jsx)(n.code,{children:"Rescaler"})," component will animate between the original state and the new one if the ",(0,t.jsx)(n.code,{children:"transition"})," field is defined. Both the original and the new scene need to define a component with the same ",(0,t.jsx)(n.code,{children:"id"}),". Currently, only some of the fields support animated transitions:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"width"})," / ",(0,t.jsx)(n.code,{children:"height"})," - Only supported within the same positioning mode. If the positioning mode changes between the old scene and the new one, the transition will not work."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"bottom"})," / ",(0,t.jsx)(n.code,{children:"top"})," / ",(0,t.jsx)(n.code,{children:"left"})," / ",(0,t.jsx)(n.code,{children:"right"})," / ",(0,t.jsx)(n.code,{children:"rotation"})," - Only supports transition when changing a value of the same field. If the old scene defines a ",(0,t.jsx)(n.code,{children:"left"})," field and the new one does not, the transition will not work."]}),"\n"]}),"\n",(0,t.jsx)(s.default,{})]})}function u(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}},2732:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>c});var t=i(5893),o=i(1151);const s={},l=void 0,r={id:"api/generated/component-Rescaler",title:"component-Rescaler",description:"Rescaler",source:"@site/pages/api/generated/component-Rescaler.md",sourceDirName:"api/generated",slug:"/api/generated/component-Rescaler",permalink:"/docs/api/generated/component-Rescaler",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{}},d={},c=[{value:"Rescaler",id:"rescaler",level:2},{value:"Properties",id:"properties",level:4},{value:"Transition",id:"transition",level:2},{value:"Properties",id:"properties-1",level:4}];function a(e){const n={code:"code",h2:"h2",h4:"h4",li:"li",pre:"pre",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h2,{id:"rescaler",children:"Rescaler"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:'type Rescaler = {\n  id?: string;\n  child: Component;\n  mode?: "fit" | "fill";\n  horizontal_align?: "left" | "right" | "justified" | "center";\n  vertical_align?: "top" | "center" | "bottom" | "justified";\n  width?: f32;\n  height?: f32;\n  top?: f32;\n  left?: f32;\n  bottom?: f32;\n  right?: f32;\n  rotation?: f32;\n  transition?: Transition;\n}\n'})}),"\n",(0,t.jsx)(n.h4,{id:"properties",children:"Properties"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"id"})," - Id of a component."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"child"})," - List of component's children."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"mode"})," - (",(0,t.jsxs)(n.strong,{children:["default=",(0,t.jsx)(n.code,{children:'"fit"'})]}),") Resize mode:","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:'"fit"'})," - Resize the component proportionally, so one of the dimensions is the same as its parent, but it still fits inside it."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:'"fill"'})," - Resize the component proportionally, so one of the dimensions is the same as its parent and the entire area of the parent is covered. Parts of a child that do not fit inside the parent are not rendered."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"horizontal_align"})," - (",(0,t.jsxs)(n.strong,{children:["default=",(0,t.jsx)(n.code,{children:'"center"'})]}),") Horizontal alignment."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"vertical_align"})," - (",(0,t.jsxs)(n.strong,{children:["default=",(0,t.jsx)(n.code,{children:'"center"'})]}),") Vertical alignment."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"width"})," - Width of a component in pixels. Required when using absolute positioning."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"height"})," - Height of a component in pixels. Required when using absolute positioning."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"top"})," - Distance in pixels between this component's top edge and its parent's top edge. If this field is defined, then the component will ignore a layout defined by its parent."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"left"})," - Distance in pixels between this component's left edge and its parent's left edge. If this field is defined, this element will be absolutely positioned, instead of being laid out by its parent."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"bottom"})," - Distance in pixels between this component's bottom edge and its parent's bottom edge. If this field is defined, this element will be absolutely positioned, instead of being laid out by its parent."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"right"})," - Distance in pixels between this component's right edge and its parent's right edge. If this field is defined, this element will be absolutely positioned, instead of being laid out by its parent."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"rotation"})," - Rotation of a component in degrees. If this field is defined, this element will be absolutely positioned, instead of being laid out by its parent."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"transition"})," - Defines how this component will behave during a scene update. This will only have an effect if the previous scene already contained a View component with the same id."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"transition",children:"Transition"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"type Transition = {\n  duration_ms: f64;\n}\n"})}),"\n",(0,t.jsx)(n.h4,{id:"properties-1",children:"Properties"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"duration_ms"})," - Duration of a transition in milliseconds."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},9342:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>c});var t=i(5893),o=i(1151);const s={},l=void 0,r={id:"common/absolute-position",title:"absolute-position",description:"A component is absolutely positioned if it defines fields like top, left, right, bottom, or rotation.",source:"@site/pages/common/absolute-position.md",sourceDirName:"common",slug:"/common/absolute-position",permalink:"/docs/common/absolute-position",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{}},d={},c=[];function a(e){const n={p:"p",...(0,o.a)(),...e.components};return(0,t.jsx)(n.p,{children:"A component is absolutely positioned if it defines fields like top, left, right, bottom, or rotation.\nThose fields define the component's position relative to its parent. However, to respect those values,\nthe parent component has to be a layout component that supports absolute positioning."})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>r,a:()=>l});var t=i(7294);const o={},s=t.createContext(o);function l(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:l(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);