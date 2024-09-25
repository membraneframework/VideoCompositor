"use strict";(self.webpackChunkcompositor_live=self.webpackChunkcompositor_live||[]).push([[4841],{31209:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>l,frontMatter:()=>i,metadata:()=>r,toc:()=>a});var s=o(74848),t=o(28453);const i={},c="Concepts",r={id:"concept/overview",title:"Concepts",description:"Inputs/outputs streams",source:"@site/pages/concept/overview.md",sourceDirName:"concept",slug:"/concept/overview",permalink:"/docs/concept/overview",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"Web Renderer",permalink:"/docs/guides/web"},next:{title:"Component",permalink:"/docs/concept/component"}},d={},a=[{value:"Inputs/outputs streams",id:"inputsoutputs-streams",level:2},{value:"Video composition",id:"video-composition",level:2},{value:"Audio mixer",id:"audio-mixer",level:2}];function p(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"concepts",children:"Concepts"}),"\n",(0,s.jsx)(n.h2,{id:"inputsoutputs-streams",children:"Inputs/outputs streams"}),"\n",(0,s.jsxs)(n.p,{children:["LiveCompositor receives inputs and sends output streams via ",(0,s.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Real-time_Transport_Protocol",children:"RTP"}),".\nAdditionally, you can also use MP4 files directly as an input. To deliver/receive any other formats you can use tools like\nFFmpeg, GStreamer, or Membrane Framework to convert between RTP and the desired format."]}),"\n",(0,s.jsx)(n.h2,{id:"video-composition",children:"Video composition"}),"\n",(0,s.jsx)(n.p,{children:"For each output stream, you need to define a scene. A scene is a tree-like structure of components that defines what should be\nrendered. This component tree API should be easy to pick up for anyone familiar with Web development."}),"\n",(0,s.jsx)(n.p,{children:"You can construct a scene from, among other things, the following components:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"InputStream"})," - RTP stream or MP4 file. (",(0,s.jsx)(n.a,{href:"/docs/typescript/components/InputStream",children:(0,s.jsx)(n.code,{children:"TypeScript"})}),", ",(0,s.jsx)(n.a,{href:"/docs/api/components/InputStream",children:(0,s.jsx)(n.code,{children:"HTTP"})}),")"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"View"})," - The most basic/core component, an analog of ",(0,s.jsx)(n.code,{children:"<div>"})," in HTML or ",(0,s.jsx)(n.code,{children:"<View>"})," in React Native. (",(0,s.jsx)(n.a,{href:"/docs/typescript/components/View",children:(0,s.jsx)(n.code,{children:"TypeScript"})}),", ",(0,s.jsx)(n.a,{href:"/docs/api/components/View",children:(0,s.jsx)(n.code,{children:"HTTP"})}),")"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"Rescaler"})," - Resizes its child component. (",(0,s.jsx)(n.a,{href:"/docs/typescript/components/Rescaler",children:(0,s.jsx)(n.code,{children:"TypeScript"})}),", ",(0,s.jsx)(n.a,{href:"/docs/api/components/Rescaler",children:(0,s.jsx)(n.code,{children:"HTTP"})}),")"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"Image"})," - Supports PNG, JPEG, SVG, and GIF (including animated ones). (",(0,s.jsx)(n.a,{href:"/docs/typescript/components/Image",children:(0,s.jsx)(n.code,{children:"TypeScript"})}),", ",(0,s.jsx)(n.a,{href:"/docs/api/components/Image",children:(0,s.jsx)(n.code,{children:"HTTP"})}),")"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"Text"})," (",(0,s.jsx)(n.a,{href:"/docs/typescript/components/Text",children:(0,s.jsx)(n.code,{children:"TypeScript"})}),", ",(0,s.jsx)(n.a,{href:"/docs/api/components/Text",children:(0,s.jsx)(n.code,{children:"HTTP"})}),")"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"WebView"})," - Renders a website using a browser. (",(0,s.jsx)(n.a,{href:"/docs/typescript/components/WebView",children:(0,s.jsx)(n.code,{children:"TypeScript"})}),", ",(0,s.jsx)(n.a,{href:"/docs/api/components/WebView",children:(0,s.jsx)(n.code,{children:"HTTP"})}),")"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Learn more about components and the scene ",(0,s.jsx)(n.a,{href:"/docs/concept/component",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"audio-mixer",children:"Audio mixer"}),"\n",(0,s.jsx)(n.p,{children:"LiveCompositor supports audio streams and provides a simple mixer to combine them. Even if you only have one audio stream and do not need\nto modify it in any way, then it is still good to pass that stream to the compositor to avoid synchronization issues between audio and video."})]})}function l(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},28453:(e,n,o)=>{o.d(n,{R:()=>c,x:()=>r});var s=o(96540);const t={},i=s.createContext(t);function c(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:c(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);