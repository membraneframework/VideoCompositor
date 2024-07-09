"use strict";(self.webpackChunkcompositor_live=self.webpackChunkcompositor_live||[]).push([[2967],{3390:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>r,metadata:()=>t,toc:()=>o});var s=i(5893),d=i(1151);const r={},c=void 0,t={id:"api/generated/renderer-DeckLink",title:"renderer-DeckLink",description:"DeckLink",source:"@site/pages/api/generated/renderer-DeckLink.md",sourceDirName:"api/generated",slug:"/api/generated/renderer-DeckLink",permalink:"/docs/api/generated/renderer-DeckLink",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{}},l={},o=[{value:"DeckLink",id:"decklink",level:2},{value:"Properties",id:"properties",level:4}];function a(e){const n={code:"code",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,d.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"decklink",children:"DeckLink"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"type DeckLink = {\n  subdevice_index?: u32;\n  display_name?: string;\n  persistent_id?: string;\n  enable_audio?: bool;\n  required?: bool;\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"Capture streams from devices connected to Blackmagic DeckLink card."}),"\n",(0,s.jsx)(n.h4,{id:"properties",children:"Properties"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"subdevice_index"})," - Single DeckLink device can consist of multiple sub-devices. This field defines\nindex of sub-device that should be used."]}),"\n",(0,s.jsxs)(n.p,{children:["The input device is selected based on fields ",(0,s.jsx)(n.code,{children:"subdevice_index"}),", ",(0,s.jsx)(n.code,{children:"persistent_id"})," ",(0,s.jsx)(n.strong,{children:"AND"})," ",(0,s.jsx)(n.code,{children:"display_name"}),".\nAll of them need to match the device if they are specified. If nothing is matched, the error response\nwill list available devices."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"display_name"}),' - Select sub-device to use based on the display name. This is the value you see in e.g.\nBlackmagic Media Express app. like "DeckLink Quad HDMI Recorder (3)"']}),"\n",(0,s.jsxs)(n.p,{children:["The input device is selected based on fields ",(0,s.jsx)(n.code,{children:"subdevice_index"}),", ",(0,s.jsx)(n.code,{children:"persistent_id"})," ",(0,s.jsx)(n.strong,{children:"AND"})," ",(0,s.jsx)(n.code,{children:"display_name"}),".\nAll of them need to match the device if they are specified. If nothing is matched, the error response\nwill list available devices."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"persistent_id"})," - Persistent ID of a device represented by 32-bit hex number. Each DeckLink sub-device has a separate id."]}),"\n",(0,s.jsxs)(n.p,{children:["The input device is selected based on fields ",(0,s.jsx)(n.code,{children:"subdevice_index"}),", ",(0,s.jsx)(n.code,{children:"persistent_id"})," ",(0,s.jsx)(n.strong,{children:"AND"})," ",(0,s.jsx)(n.code,{children:"display_name"}),".\nAll of them need to match the device if they are specified. If nothing is matched, the error response\nwill list available devices."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"enable_audio"})," - (",(0,s.jsxs)(n.strong,{children:["default=",(0,s.jsx)(n.code,{children:"true"})]}),") Enable audio support."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"required"})," - (",(0,s.jsxs)(n.strong,{children:["default=",(0,s.jsx)(n.code,{children:"false"})]}),") If input is required and frames are not processed\non time, then LiveCompositor will delay producing output frames."]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,d.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>t,a:()=>c});var s=i(7294);const d={},r=s.createContext(d);function c(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:c(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);