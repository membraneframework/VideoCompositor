"use strict";(self.webpackChunkcompositor_live=self.webpackChunkcompositor_live||[]).push([[8932],{61268:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>t,default:()=>c,frontMatter:()=>s,metadata:()=>l,toc:()=>a});var o=i(74848),r=i(28453);const s={},t="Deployment",l={id:"deployment/overview",title:"Deployment",description:"LiveCompositor can be deployed in various ways, depending on your platform, used features and whether it is used standalone or via Membrane Framework plugin.",source:"@site/pages/deployment/overview.md",sourceDirName:"deployment",slug:"/deployment/overview",permalink:"/docs/deployment/overview",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"Shaders",permalink:"/docs/concept/shaders"},next:{title:"Requirements",permalink:"/docs/deployment/requirements"}},d={},a=[{value:"Requirements",id:"requirements",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Web renderer support",id:"web-renderer-support",level:2},{value:"DeckLink support",id:"decklink-support",level:2},{value:"Membrane Framework plugin",id:"membrane-framework-plugin",level:2},{value:"Requirements",id:"requirements-1",level:4},{value:"Configuration",id:"configuration-1",level:4},{value:"Web renderer support",id:"web-renderer-support-1",level:4},{value:"DeckLink support",id:"decklink-support-1",level:4}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h4:"h4",li:"li",p:"p",ul:"ul",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"deployment",children:"Deployment"}),"\n",(0,o.jsx)(n.p,{children:"LiveCompositor can be deployed in various ways, depending on your platform, used features and whether it is used standalone or via Membrane Framework plugin."}),"\n",(0,o.jsx)(n.p,{children:"You can consider following options for LiveCompositor deployment:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Using docker","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["(recommended) Dockerfile with compositor without web rendering support ",(0,o.jsx)(n.a,{href:"https://github.com/software-mansion/live-compositor/blob/master/build_tools/docker/slim.Dockerfile",children:"https://github.com/software-mansion/live-compositor/blob/master/build_tools/docker/slim.Dockerfile"})]}),"\n",(0,o.jsxs)(n.li,{children:["Dockerfile with compositor with web rendering support ",(0,o.jsx)(n.a,{href:"https://github.com/software-mansion/live-compositor/blob/master/build_tools/docker/full.Dockerfile",children:"https://github.com/software-mansion/live-compositor/blob/master/build_tools/docker/full.Dockerfile"})]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Standalone binaries","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Building ",(0,o.jsx)(n.a,{href:"https://github.com/software-mansion/live-compositor",children:(0,o.jsx)(n.code,{children:"github.com/software-mansion/live-compositor"})})," from source."]}),"\n",(0,o.jsxs)(n.li,{children:["Binaries from ",(0,o.jsx)(n.a,{href:"https://github.com/software-mansion/live-compositor/releases",children:"GitHub releases"}),"."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["As an element in a Membrane pipeline. ",(0,o.jsx)(n.a,{href:"#membrane-framework-plugin",children:"Learn more."})]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"requirements",children:"Requirements"}),"\n",(0,o.jsxs)(n.p,{children:["See ",(0,o.jsx)(n.a,{href:"/docs/deployment/requirements",children:(0,o.jsx)(n.code,{children:"requirements"})})," page for details about software and hardware requirements of the compositor in various configurations."]}),"\n",(0,o.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,o.jsxs)(n.p,{children:["Some of the compositor behaviors can only be configured on server startup. You can define those options using ",(0,o.jsx)(n.code,{children:"LIVE_COMPOSITOR_*"}),"\nenvironment variables. Full list of those variables can be found ",(0,o.jsx)(n.a,{href:"/docs/deployment/configuration",children:"here"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"web-renderer-support",children:"Web renderer support"}),"\n",(0,o.jsxs)(n.p,{children:["If you want to use a ",(0,o.jsx)(n.a,{href:"/docs/api/components/WebView",children:(0,o.jsx)(n.code,{children:"WebView"})})," component in your scene definition you need to use binaries compiled\nwith web rendering support."]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["When building from source you need to have ",(0,o.jsx)(n.code,{children:"web_renderer"})," feature enabled (enabled by default)."]}),"\n",(0,o.jsxs)(n.li,{children:["When using binaries from ",(0,o.jsx)(n.a,{href:"https://github.com/software-mansion/live-compositor/releases",children:"GitHub releases"})," use files with ",(0,o.jsx)(n.code,{children:"_with_web_renderer_"})," in the name."]}),"\n",(0,o.jsxs)(n.li,{children:["When using Docker use ",(0,o.jsx)(n.a,{href:"https://github.com/software-mansion/live-compositor/blob/master/build_tools/docker/full.Dockerfile",children:"github.com/software-mansion/live-compositor/blob/master/build_tools/docker/full.Dockerfile"})]}),"\n"]}),"\n",(0,o.jsx)(n.admonition,{type:"warning",children:(0,o.jsx)(n.p,{children:"Keep in mind that using a browser for rendering might not be secure, especially if you use it to render untrusted websites\nor content provided by the end user. Unless you specifically need that capability, we recommend using LiveCompositor without\nweb rendering support."})}),"\n",(0,o.jsx)(n.h2,{id:"decklink-support",children:"DeckLink support"}),"\n",(0,o.jsxs)(n.p,{children:["If you want to use a DeckLink device as an input you need to use binaries compiled with support for it. When building from\nsource you need to have ",(0,o.jsx)(n.code,{children:"decklink"})," feature enabled (enabled by default)."]}),"\n",(0,o.jsx)(n.p,{children:"Currently, we do not provide binaries or Dockerfiles with DeckLink support, and only support x86_64 Linux platform."}),"\n",(0,o.jsx)(n.h2,{id:"membrane-framework-plugin",children:"Membrane Framework plugin"}),"\n",(0,o.jsx)(n.h4,{id:"requirements-1",children:"Requirements"}),"\n",(0,o.jsxs)(n.p,{children:["By default, Membrane plugin is using a binary release, so in most cases ",(0,o.jsx)(n.a,{href:"/docs/deployment/requirements#binaries-from-github-releases",children:"this section"}),"\napplies, but you can also override LiveCompositor binary used by the plugin and provide your own."]}),"\n",(0,o.jsx)(n.h4,{id:"configuration-1",children:"Configuration"}),"\n",(0,o.jsx)(n.p,{children:"Membrane Framework plugin provides a way to define a compositor configuration. However, there are configuration options\nthat are not exposed with the plugin API. In most cases it should not be needed, but if you need to set option like that you can always\nconfigure compositor with environment variables."}),"\n",(0,o.jsx)(n.h4,{id:"web-renderer-support-1",children:"Web renderer support"}),"\n",(0,o.jsx)(n.p,{children:"Default binary used by the plugin was built without web rendering support. To use web rendering inside the plugin you need to override\nthe compositor binary."}),"\n",(0,o.jsx)(n.h4,{id:"decklink-support-1",children:"DeckLink support"}),"\n",(0,o.jsx)(n.p,{children:"Not supported"})]})}function c(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},28453:(e,n,i)=>{i.d(n,{R:()=>t,x:()=>l});var o=i(96540);const r={},s=o.createContext(r);function t(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);