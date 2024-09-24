"use strict";(self.webpackChunkcompositor_live=self.webpackChunkcompositor_live||[]).push([[6993],{73321:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var i=r(74848),t=r(28453);const o={},s="Example: AWS EC2",l={id:"deployment/aws-ec2",title:"Example: AWS EC2",description:"This is an example configuration that shows how to deploy LiveCompositor to an AWS EC2 instance with Terraform configuration.",source:"@site/pages/deployment/aws-ec2.md",sourceDirName:"deployment",slug:"/deployment/aws-ec2",permalink:"/docs/deployment/aws-ec2",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"Configuration",permalink:"/docs/deployment/configuration"},next:{title:"TypeScript SDK Reference",permalink:"/docs/typescript/api"}},a={},c=[{value:"Prerequisites",id:"prerequisites",level:3},{value:"CPU vs GPU rendering trade-off",id:"cpu-vs-gpu-rendering-trade-off",level:3},{value:"How to deploy",id:"how-to-deploy",level:3},{value:"<code>CPU-only</code>",id:"cpu-only",level:3},{value:"<code>CPU+GPU</code>",id:"cpugpu",level:3},{value:"How to use",id:"how-to-use",level:3}];function d(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",h1:"h1",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"example-aws-ec2",children:"Example: AWS EC2"}),"\n",(0,i.jsx)(n.p,{children:"This is an example configuration that shows how to deploy LiveCompositor to an AWS EC2 instance with Terraform configuration."}),"\n",(0,i.jsxs)(n.p,{children:["All examples are located in the ",(0,i.jsx)(n.a,{href:"https://github.com/membraneframework-labs/live_compositor_deployment",children:"github.com/membraneframework-labs/live_compositor_deployment"})," repository:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"project"})," directory includes an example Membrane project that can consume multiple streams over RTMP and host the composed stream as an HLS playlist."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"aws-ec2-terraform"})," directory includes an example Terraform+Packer configuration for building an AMI (Amazon Machine Image) and deploying it to EC2."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Terraform"}),"\n",(0,i.jsx)(n.li,{children:"Packer"}),"\n",(0,i.jsx)(n.li,{children:"Elixir - required to build an example project"}),"\n",(0,i.jsx)(n.li,{children:"FFmpeg - used to send/receive streams from/to the compositor"}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"cpu-vs-gpu-rendering-trade-off",children:"CPU vs GPU rendering trade-off"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"GPU+CPU"})," - LiveCompositor uses ",(0,i.jsx)(n.code,{children:"wgpu"})," (implementation of WebGPU standard written in Rust) for rendering. However, all decoding and\nencoding still happens on the CPU. When running on GPU the rendering cost should be negligible compared to the decoding/encoding."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"CPU-only"})," - When running on a CPU-only instance, all ",(0,i.jsx)(n.code,{children:"WebGPU"})," code is emulated on the CPU. Unless your encoder quality is set very\nhigh, rendering will use most of the CPU processing time."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Actual price-to-performance can vary, but in general, CPU+GPU instances make more sense for fast encoder presets and complex rendering\npipelines. However, CPU-only can be more optimal when using simple layouts and prioritizing quality over performance with slower preset."}),"\n",(0,i.jsx)(n.h3,{id:"how-to-deploy",children:"How to deploy"}),"\n",(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsxs)(n.p,{children:["The example configuration is using ",(0,i.jsx)(n.code,{children:"us-east-1"})," region. If you want to use a different one make sure to change it both in Packer\nand Terraform configuration. Specifically, if you use EC2 instances with GPU, you might only have them available in some regions."]})}),"\n",(0,i.jsx)(n.h3,{id:"cpu-only",children:(0,i.jsx)(n.code,{children:"CPU-only"})}),"\n",(0,i.jsxs)(n.p,{children:["Go to ",(0,i.jsx)(n.strong,{children:"aws-ec2-terraform/packer"})," directory and run"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"packer build membrane.pkr.hcl\n"})}),"\n",(0,i.jsxs)(n.p,{children:["to build an AMI image with an example Membrane project. At the end of the process, the terminal will print the AMI ID, that will\nbe needed in the next step (something like ",(0,i.jsx)(n.code,{children:"ami-0e18e9d7b8c037ec2"}),")."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["The other ",(0,i.jsx)(n.code,{children:"pkr.hcl"})," file in this directory (",(0,i.jsx)(n.strong,{children:"standalone.pkr.hcl"}),") includes configuration for deploying just a standalone LiveCompositor\ninstance, so you can also go that route, but the rest of this guide assumes you are using the provided Membrane project."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Open ",(0,i.jsx)(n.strong,{children:"aws-ec2-terraform/main.tf"}),", find ",(0,i.jsx)(n.code,{children:"aws_instance.demo_instance"})," definition and update the ",(0,i.jsx)(n.code,{children:"ami"})," field with the AMI ID from the previous step."]}),"\n",(0,i.jsxs)(n.p,{children:["In ",(0,i.jsx)(n.strong,{children:"aws-ec2-terraform"})," directory run:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"terraform apply\n"})}),"\n",(0,i.jsx)(n.h3,{id:"cpugpu",children:(0,i.jsx)(n.code,{children:"CPU+GPU"})}),"\n",(0,i.jsxs)(n.p,{children:["Go to ",(0,i.jsx)(n.strong,{children:"aws-ec2-terraform/packer"})," directory and run"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'packer build -var "with-gpu=true" membrane.pkr.hcl\n'})}),"\n",(0,i.jsxs)(n.p,{children:["to build an AMI image with an example Membrane project. At the end of the process, the terminal will print the AMI ID that, will\nbe needed in the next step (something like ",(0,i.jsx)(n.code,{children:"ami-0e18e9d7b8c037ec2"}),")."]}),"\n",(0,i.jsxs)(n.p,{children:["Open ",(0,i.jsx)(n.strong,{children:"aws-ec2-terraform/main.tf"}),", find ",(0,i.jsx)(n.code,{children:"aws_instance.demo_instance"})," definition and update the ",(0,i.jsx)(n.code,{children:"ami"})," field with the AMI ID from the previous step."]}),"\n",(0,i.jsxs)(n.p,{children:["In ",(0,i.jsx)(n.strong,{children:"aws-ec2-terraform"})," directory run:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'terraform apply -var="with-gpu=true"\n'})}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsxs)(n.p,{children:["Instances with GPU like ",(0,i.jsx)(n.code,{children:"g4dn.xlarge"})," are not available by default on AWS. You will need to request a quota increase from the AWS team to use them."]})}),"\n",(0,i.jsx)(n.h3,{id:"how-to-use",children:"How to use"}),"\n",(0,i.jsx)(n.p,{children:"After everything is deployed you can open your AWS dashboard and find the public IP of the newly deployed instance."}),"\n",(0,i.jsx)(n.p,{children:"To test the service, run in separate terminals:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["To receive the output stream","\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ffplay http://YOUR_INSTANCE_IP:9001/index.m3u8\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["To send an example input stream","\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ffmpeg -re -f lavfi -i testsrc\n  -vf scale=1280:720 -vcodec libx264 \\\n  -profile:v baseline -preset fast -pix_fmt yuv420p \\\n  -f flv rtmp://YOUR_INSTANCE_IP:9000/app/stream_key\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["You can run this command multiple times with different paths instead of ",(0,i.jsx)(n.code,{children:"app/stream_key"})," to connect multiple streams."]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28453:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>l});var i=r(96540);const t={},o=i.createContext(t);function s(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);