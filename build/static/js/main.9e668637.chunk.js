(this.webpackJsonpskyrim_inventory_management_frontend=this.webpackJsonpskyrim_inventory_management_frontend||[]).push([[0],{15:function(e,o,t){e.exports={root:"home_root__FVET7",header:"home_header__2rWYK",login:"home_login__PpxdQ"}},19:function(e,o,t){e.exports={root:"navigationMosaic_root__2CDUx",card:"navigationMosaic_card__3hEln"}},22:function(e,o,t){e.exports={root:"login_root__3wNY7",button:"login_button__CN8ce"}},23:function(e,o,t){e.exports={root:"logout_root__3YWyZ",button:"logout_button__3gpQm"}},30:function(e,o,t){e.exports={root:"navigationCard_root__1-FD3"}},31:function(e,o,t){e.exports={body:"dashboard_body__28Wid"}},33:function(e,o,t){},34:function(e,o,t){},39:function(e,o,t){},46:function(e,o,t){"use strict";t.r(o);var n=t(0),a=t.n(n),r=t(26),c=t.n(r),i=(t(39),t(9)),s=t(13),l=t(3),d=t(10),u=t(47),h={home:"/",login:"/login",logout:"/logout",dashboard:{main:"/dashboard",shoppingLists:"/dashboard/shoppingLists"}},b="891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com",j="https://sim-api.danascheider.com",g="https://sim.danascheider.com",m="_sim_google_session",p=t(29),x=t.n(p),_=t.p+"static/media/anonymousAvatar.36d1acc1.jpg",f=t(8),v=t.n(f),O=t(1),y=function(e){var o=e.data,t=o.email,n=o.name,a=o.image_url;return Object(O.jsxs)("div",{className:v.a.root,children:[Object(O.jsx)("span",{className:v.a.headerContainer,children:Object(O.jsx)("h1",{className:v.a.header,children:"Skyrim Inventory Management"})}),Object(O.jsxs)("span",{className:v.a.profile,children:[Object(O.jsxs)("div",{className:v.a.profileText,children:[Object(O.jsx)("p",{className:v.a.textTop,children:n}),Object(O.jsx)("p",{className:v.a.textBottom,children:t})]}),Object(O.jsx)("img",{className:v.a.avatar,src:a||_,alt:"User avatar",referrerPolicy:"no-referrer"})]})]})},k=t(30),C=t.n(k),F=function(e){var o=e.backgroundColor,t=e.textColor,n=e.href,a=(e.key,e.children);return Object(O.jsx)("a",{className:C.a.root,href:n,style:{"--background-color":o,"--text-color":t},children:a})},N=t(19),S=t.n(N),I=function(e){var o=e.cardArray;return Object(O.jsx)("div",{className:S.a.root,children:o.map((function(e){var o=e.backgroundColor,t=e.textColor,n=e.href,a=e.children,r=e.key;return Object(O.jsx)("div",{className:S.a.card,children:Object(O.jsx)(F,{backgroundColor:o,textColor:t,href:n,children:a})},r)}))})},L=t(31),H=t.n(L),T=[{backgroundColor:"#FFBF00",textColor:"#000000",href:h.shoppingLists,children:"Your Shopping Lists",key:"shopping-lists"},{backgroundColor:"#E83F6F",textColor:"#FFFFFF",href:"#",children:"Nav Link 2",key:"nav-link-2"},{backgroundColor:"#2274A5",textColor:"#FFFFFF",href:"#",children:"Nav Link 3",key:"nav-link-3"},{backgroundColor:"#00A323",textColor:"#FFFFFF",href:"#",children:"Nav Link 4",key:"nav-link-4"},{backgroundColor:"#20E2E9",textColor:"#000000",href:"#",children:"Nav Link 5",key:"nav-link-5"}],B=function(){var e=Object(u.a)([m]),o=Object(d.a)(e,3),t=o[0],a=o[2],r=Object(n.useState)(null),c=Object(d.a)(r,2),i=c[0],s=c[1],b=Object(n.useState)(!t[m]),g=Object(d.a)(b,2),p=g[0],_=g[1];return Object(n.useEffect)((function(){var e="".concat(j,"/users/current");fetch(e,{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(t[m])}}).then((function(e){return console.log("Response from API: ",e),401===e.status?(a(m),_(!0),{}):e.json()})).then((function(e){return s(e)})).catch((function(e){return console.log(e)}))}),[t,a]),p?Object(O.jsx)(l.a,{to:h.login}):Object(O.jsxs)(O.Fragment,{children:[i?Object(O.jsx)(y,{data:i}):Object(O.jsx)(x.a,{type:"spinningBubbles",color:"#ccc"}),Object(O.jsx)("div",{className:H.a.body,children:Object(O.jsx)(I,{cardArray:T})})]})},M=t(15),A=t.n(M),U=function(){return Object(O.jsxs)("div",{className:A.a.root,children:[Object(O.jsx)("h1",{className:A.a.header,children:"Skyrim Inventory Management"}),Object(O.jsx)(i.b,{className:A.a.login,to:h.login,children:"Log in with Google"})]})},E=t(14),w=t.n(E),D=t(22),G=t.n(D),P=function(){var e=Object(u.a)([m]),o=Object(d.a)(e,3),t=o[0],n=o[1],a=o[2];return t[m]?Object(O.jsx)(l.a,{to:h.logout}):Object(O.jsx)("div",{className:G.a.root,children:Object(O.jsx)(w.a,{className:G.a.button,clientId:b,buttonText:"Log In with Google",onSuccess:function(e){var o=e.tokenId;console.log(e);var r="".concat(j,"/auth/verify_token");t[m]!==o&&fetch(r,{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(o)}}).then((function(e){!0===e.ok?n(m,o):t[m]&&a(m)})).catch((function(e){return console.log(e)}))},onFailure:function(e){console.log("Login failure: ",e),t[m]&&a(m)},redirectUri:"".concat(g,"/dashboard"),isSignedIn:!0})})},W=t(23),Y=t.n(W),q=function(){var e=Object(u.a)([m]),o=Object(d.a)(e,3),t=o[0],n=o[2];return t[m]?Object(O.jsx)("div",{className:Y.a.root,children:Object(O.jsx)(w.a,{className:Y.a.button,buttonText:"Log Out",clientId:b,redirectUri:"".concat(g,"/"),isSignedIn:!1,onLogoutSuccess:function(){console.log("Logout succeeded"),n(m)},onFailure:function(e){console.log("Unable to log out: ",e)}})}):Object(O.jsx)(l.a,{to:h.login})},z=t(33),J=t.n(z),K=t(34),Q=t.n(K),R="Skyrim Inventory Management |",V=[{pageId:"home",title:"".concat(R," Home"),description:"Manage your inventory across multiple properties in Skyrim",baseStyles:J.a,Component:U,path:h.home},{pageId:"login",title:"".concat(R," Login"),description:"Log into Skyrim Inventory Management using your Google account",baseStyles:null,Component:P,path:h.login},{pageId:"logout",title:"".concat(R," Logout"),description:"Log out of Skyrim Inventory Management with your Google account",baseStyles:null,Component:q,path:h.logout},{pageId:"dashboard",title:"".concat(R," Dashboard"),description:"Skyrim Inventory Management User Dashboard",baseStyles:Q.a,Component:B,path:h.dashboard.main}],Z=function(){return Object(O.jsx)(l.d,{children:V.map((function(e){var o=e.pageId,t=e.title,n=e.description,a=e.baseStyles,r=e.Component,c=e.path;return Object(O.jsxs)(l.b,{exact:!0,path:c,children:[Object(O.jsxs)(s.a,{children:[Object(O.jsx)("html",{lang:"en",style:a}),Object(O.jsx)("title",{children:t}),Object(O.jsx)("meta",{name:"description",content:n})]}),Object(O.jsx)(r,{})]},o)}))})},X=function(){return Object(O.jsx)(i.a,{basename:"",children:Object(O.jsx)(s.b,{children:Object(O.jsx)(Z,{})})})};c.a.render(Object(O.jsx)(a.a.StrictMode,{children:Object(O.jsx)(X,{})}),document.getElementById("root"))},8:function(e,o,t){e.exports={root:"dashboardHeader_root__3lzne",headerContainer:"dashboardHeader_headerContainer__1ZVqS",header:"dashboardHeader_header__cB1mg",profile:"dashboardHeader_profile__A3WxH",profileText:"dashboardHeader_profileText__1HPKf",textTop:"dashboardHeader_textTop__2UNgU",textBottom:"dashboardHeader_textBottom__1vLtl",avatar:"dashboardHeader_avatar__2BhRu"}}},[[46,1,2]]]);
//# sourceMappingURL=main.9e668637.chunk.js.map