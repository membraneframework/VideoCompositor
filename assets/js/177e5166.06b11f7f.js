"use strict";(self.webpackChunkcompositor_live=self.webpackChunkcompositor_live||[]).push([[651,676],{3393:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>p,frontMatter:()=>s,metadata:()=>o,toc:()=>a});var i=r(5893),t=r(1151);const s={},d=void 0,o={id:"api/generated/renderer-WebRenderer",title:"renderer-WebRenderer",description:"WebRenderer",source:"@site/pages/api/generated/renderer-WebRenderer.md",sourceDirName:"api/generated",slug:"/api/generated/renderer-WebRenderer",permalink:"/docs/api/generated/renderer-WebRenderer",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{}},c={},a=[{value:"WebRenderer",id:"webrenderer",level:2},{value:"Properties",id:"properties",level:4},{value:"Resolution",id:"resolution",level:2},{value:"Properties",id:"properties-1",level:4}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h2,{id:"webrenderer",children:"WebRenderer"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:'type WebRenderer = {\n  instance_id: string;\n  url: string;\n  resolution: Resolution;\n  embedding_method?: \n    | "chromium_embedding"\n    | "native_embedding_over_content"\n    | "native_embedding_under_content";\n}\n'})}),"\n",(0,i.jsx)(n.h4,{id:"properties",children:"Properties"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"instance_id"})," - Id of a web renderer instance. It can be used in a ",(0,i.jsx)(n.a,{href:"../components/WebView",children:(0,i.jsx)(n.code,{children:"WebView"})})," component after registration."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"url"})," - Url of a website that you want to render."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"resolution"})," - Resolution."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"embedding_method"})," - Mechanism used to render input frames on the website.","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:'"chromium_embedding"'})," - Pass raw input frames as JS buffers so they can be rendered, for example, using a ",(0,i.jsx)(n.code,{children:"<canvas>"})," component.","\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsx)(n.p,{children:"This method might have a significant performance impact, especially for a large number of inputs."})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:'"native_embedding_over_content"'})," - Render a website without any inputs and overlay them over the website content."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:'"native_embedding_under_content"'})," - Render a website without any inputs and overlay them under the website content."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"resolution",children:"Resolution"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"type Resolution = {\n  width: u32;\n  height: u32;\n}\n"})}),"\n",(0,i.jsx)(n.h4,{id:"properties-1",children:"Properties"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"width"})," - Width in pixels."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"height"})," - Height in pixels."]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},7974:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>d,metadata:()=>c,toc:()=>l});var i=r(5893),t=r(1151),s=r(3393);const d={},o="Web Renderer",c={id:"api/renderers/web",title:"Web Renderer",description:"Represents an instance of a website opened with Chromimum embeded inside the compositor. Used by a WebView component. Only one WebView component can use a specific instance at a time.",source:"@site/pages/api/renderers/web.md",sourceDirName:"api/renderers",slug:"/api/renderers/web",permalink:"/docs/api/renderers/web",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"Image",permalink:"/docs/api/renderers/image"}},a={},l=[];function p(e){const n={a:"a",code:"code",h1:"h1",p:"p",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"web-renderer",children:"Web Renderer"}),"\n",(0,i.jsxs)(n.p,{children:["Represents an instance of a website opened with Chromimum embeded inside the compositor. Used by a ",(0,i.jsxs)(n.a,{href:"../components/WebView",children:[(0,i.jsx)(n.code,{children:"WebView"})," component"]}),". Only one ",(0,i.jsx)(n.code,{children:"WebView"})," component can use a specific instance at a time."]}),"\n",(0,i.jsx)(s.default,{})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},1151:(e,n,r)=>{r.d(n,{Z:()=>o,a:()=>d});var i=r(7294);const t={},s=i.createContext(t);function d(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);