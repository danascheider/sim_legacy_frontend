(this.webpackJsonpskyrim_inventory_management_frontend=this.webpackJsonpskyrim_inventory_management_frontend||[]).push([[0],{15:function(e,t,o){e.exports={root:"home_root__FVET7",header:"home_header__2rWYK",login:"home_login__PpxdQ"}},19:function(e,t,o){e.exports={root:"navigationMosaic_root__2CDUx",card:"navigationMosaic_card__3hEln"}},22:function(e,t,o){e.exports={root:"login_root__3wNY7",button:"login_button__CN8ce"}},23:function(e,t,o){e.exports={root:"logout_root__3YWyZ",button:"logout_button__3gpQm"}},30:function(e,t,o){e.exports={root:"navigationCard_root__1-FD3"}},31:function(e,t,o){e.exports={body:"dashboard_body__28Wid"}},33:function(e,t,o){},34:function(e,t,o){},39:function(e,t,o){},46:function(e,t,o){"use strict";o.r(t);var n=o(0),a=o.n(n),r=o(26),c=o.n(r),i=(o(39),o(9)),s=o(13),l=o(3),d=o(10),u=o(47),h={home:"/",login:"/login",logout:"/logout",dashboard:{main:"/dashboard",shoppingLists:"/dashboard/shoppingLists"}},b="891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com",j="https://sim-api.danascheider.com",g="https://sim.danascheider.com",m="_sim_google_session",p=o(29),x=o.n(p),_=o.p+"static/media/anonymousAvatar.36d1acc1.jpg",f=o(8),O=o.n(f),v=o(1),y=function(e){var t=e.data,o=t.email,n=t.name,a=t.image_url;return Object(v.jsxs)("div",{className:O.a.root,children:[Object(v.jsx)("span",{className:O.a.headerContainer,children:Object(v.jsx)("h1",{className:O.a.header,children:"Skyrim Inventory Management"})}),Object(v.jsxs)("span",{className:O.a.profile,children:[Object(v.jsxs)("div",{className:O.a.profileText,children:[Object(v.jsx)("p",{className:O.a.textTop,children:n}),Object(v.jsx)("p",{className:O.a.textBottom,children:o})]}),Object(v.jsx)("img",{className:O.a.avatar,src:a||_,alt:"User avatar",referrerPolicy:"no-referrer"})]})]})},k=o(30),C=o.n(k),F=function(e){var t=e.backgroundColor,o=e.textColor,n=e.href,a=(e.key,e.children);return Object(v.jsx)("a",{className:C.a.root,href:n,style:{"--background-color":t,"--text-color":o},children:a})},N=o(19),S=o.n(N),I=function(e){var t=e.cardArray;return Object(v.jsx)("div",{className:S.a.root,children:t.map((function(e){var t=e.backgroundColor,o=e.textColor,n=e.href,a=e.children,r=e.key;return Object(v.jsx)("div",{className:S.a.card,children:Object(v.jsx)(F,{backgroundColor:t,textColor:o,href:n,children:a})},r)}))})},L=o(31),H=o.n(L),T=[{backgroundColor:"#FFBF00",textColor:"#000000",href:h.shoppingLists,children:"Your Shopping Lists",key:"shopping-lists"},{backgroundColor:"#E83F6F",textColor:"#FFFFFF",href:"#",children:"Nav Link 2",key:"nav-link-2"},{backgroundColor:"#2274A5",textColor:"#FFFFFF",href:"#",children:"Nav Link 3",key:"nav-link-3"},{backgroundColor:"#00A323",textColor:"#FFFFFF",href:"#",children:"Nav Link 4",key:"nav-link-4"},{backgroundColor:"#20E2E9",textColor:"#000000",href:"#",children:"Nav Link 5",key:"nav-link-5"}],B=function(){var e=Object(u.a)([m]),t=Object(d.a)(e,3),o=t[0],a=t[2],r=Object(n.useState)(null),c=Object(d.a)(r,2),i=c[0],s=c[1],b=Object(n.useState)(!o[m]),g=Object(d.a)(b,2),p=g[0],_=g[1];return Object(n.useEffect)((function(){var e="".concat(j,"/users/current");fetch(e,{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(o[m])}}).then((function(e){return console.log("Response from API: ",e),401===e.status?(a(m),_(!0),{}):e.json()})).then((function(e){return s(e)})).catch((function(e){return console.log(e)}))}),[o,a]),p?Object(v.jsx)(l.a,{to:h.login}):Object(v.jsxs)(v.Fragment,{children:[i?Object(v.jsx)(y,{data:i}):Object(v.jsx)(x.a,{type:"spinningBubbles",color:"#ccc"}),Object(v.jsx)("div",{className:H.a.body,children:Object(v.jsx)(I,{cardArray:T})})]})},M=o(15),A=o.n(M),U=function(){return Object(v.jsxs)("div",{className:A.a.root,children:[Object(v.jsx)("h1",{className:A.a.header,children:"Skyrim Inventory Management"}),Object(v.jsx)(i.b,{className:A.a.login,to:h.login,children:"Log in with Google"})]})},E=o(14),w=o.n(E),D=o(22),G=o.n(D),P=function(){var e=Object(u.a)([m]),t=Object(d.a)(e,3),o=t[0],n=t[1],a=t[2];return o[m]?Object(v.jsx)(l.a,{to:h.logout}):Object(v.jsx)("div",{className:G.a.root,children:Object(v.jsx)(w.a,{className:G.a.button,clientId:b,buttonText:"Log In with Google",onSuccess:function(e){var t=e.tokenId,r="".concat(j,"/auth/verify_token");o[m]!==t&&fetch(r,{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(t)}}).then((function(e){!0===e.ok?n(m,t):o[m]&&a(m)})).catch((function(e){return console.log(e)}))},onFailure:function(e){console.log("Login failure: ",e),o[m]&&a(m)},redirectUri:"".concat(g,"/dashboard"),isSignedIn:!0})})},W=o(23),Y=o.n(W),q=function(){var e=Object(u.a)([m]),t=Object(d.a)(e,3),o=t[0],n=t[2];return o[m]?Object(v.jsx)("div",{className:Y.a.root,children:Object(v.jsx)(w.a,{className:Y.a.button,buttonText:"Log Out",clientId:b,redirectUri:"".concat(g,"/"),isSignedIn:!1,onLogoutSuccess:function(){console.log("Logout succeeded"),n(m)},onFailure:function(e){console.log("Unable to log out: ",e)}})}):Object(v.jsx)(l.a,{to:h.login})},z=o(33),J=o.n(z),K=o(34),Q=o.n(K),R="Skyrim Inventory Management |",V=[{pageId:"home",title:"".concat(R," Home"),description:"Manage your inventory across multiple properties in Skyrim",baseStyles:J.a,Component:U,path:h.home},{pageId:"login",title:"".concat(R," Login"),description:"Log into Skyrim Inventory Management using your Google account",baseStyles:null,Component:P,path:h.login},{pageId:"logout",title:"".concat(R," Logout"),description:"Log out of Skyrim Inventory Management with your Google account",baseStyles:null,Component:q,path:h.logout},{pageId:"dashboard",title:"".concat(R," Dashboard"),description:"Skyrim Inventory Management User Dashboard",baseStyles:Q.a,Component:B,path:h.dashboard.main}],Z=function(){return Object(v.jsx)(l.d,{children:V.map((function(e){var t=e.pageId,o=e.title,n=e.description,a=e.baseStyles,r=e.Component,c=e.path;return Object(v.jsxs)(l.b,{exact:!0,path:c,children:[Object(v.jsxs)(s.a,{children:[Object(v.jsx)("html",{lang:"en",style:a}),Object(v.jsx)("title",{children:o}),Object(v.jsx)("meta",{name:"description",content:n})]}),Object(v.jsx)(r,{})]},t)}))})},X=function(){return Object(v.jsx)(i.a,{basename:"",children:Object(v.jsx)(s.b,{children:Object(v.jsx)(Z,{})})})};c.a.render(Object(v.jsx)(a.a.StrictMode,{children:Object(v.jsx)(X,{})}),document.getElementById("root"))},8:function(e,t,o){e.exports={root:"dashboardHeader_root__3lzne",headerContainer:"dashboardHeader_headerContainer__1ZVqS",header:"dashboardHeader_header__cB1mg",profile:"dashboardHeader_profile__A3WxH",profileText:"dashboardHeader_profileText__1HPKf",textTop:"dashboardHeader_textTop__2UNgU",textBottom:"dashboardHeader_textBottom__1vLtl",avatar:"dashboardHeader_avatar__2BhRu"}}},[[46,1,2]]]);
//# sourceMappingURL=main.d3d5f9b2.chunk.js.map