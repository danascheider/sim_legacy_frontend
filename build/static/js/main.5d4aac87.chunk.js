(this.webpackJsonpskyrim_inventory_management_frontend=this.webpackJsonpskyrim_inventory_management_frontend||[]).push([[0],{12:function(e,o,t){e.exports={root:"shoppingListItem_root__3NPoi",headerContainer:"shoppingListItem_headerContainer__hu6Ur",button:"shoppingListItem_button__2k4QA",quantity:"shoppingListItem_quantity__1ebyP",description:"shoppingListItem_description__mnU6z",collapsible:"shoppingListItem_collapsible__xa2wr",notes:"shoppingListItem_notes__8g2fK"}},15:function(e,o,t){e.exports={root:"shoppingList_root__2O9FT",button:"shoppingList_button__-Q-F1",collapsible:"shoppingList_collapsible__2Zuq5"}},16:function(e,o,t){e.exports={root:"dashboardLayout_root__2dfR_",title:"dashboardLayout_title__1yGVn",hr:"dashboardLayout_hr__29GgW",container:"dashboardLayout_container__3AwFx"}},17:function(e,o,t){e.exports={shoppingList:"shoppingListPage_shoppingList__2wdvG",loading:"shoppingListPage_loading__LoEmY",noLists:"shoppingListPage_noLists__3Ijpw",error:"shoppingListPage_error__3Ea81"}},18:function(e,o,t){e.exports={root:"homePage_root__15tty",container:"homePage_container__3kQJo",header:"homePage_header__3EV45",login:"homePage_login__3ala0"}},19:function(e,o,t){e.exports={root:"loginPage_root__2Vf7z",errorMessage:"loginPage_errorMessage__8uTVC",container:"loginPage_container__2xdLK",button:"loginPage_button__1pDsX"}},22:function(e,o,t){e.exports={button:"logoutDropdown_button__3hRUK",body:"logoutDropdown_body__NiLPw",googleLogout:"logoutDropdown_googleLogout__J9YSG"}},29:function(e,o,t){e.exports={root:"navigationMosaic_root__2CDUx",card:"navigationMosaic_card__3hEln"}},36:function(e,o,t){e.exports={root:"navigationCard_root__1-FD3"}},37:function(e,o,t){e.exports={root:"dashboardPage_root__oVxx1"}},48:function(e,o,t){},54:function(e,o,t){"use strict";t.r(o);var r=t(1),a=t.n(r),n=t(32),s=t.n(n),c=(t(48),t(11)),i=t(20),l=t(3),h={home:"/",login:"/login",dashboard:{main:"/dashboard",shoppingLists:"/dashboard/shoppingLists"}},d={schemeColor:"#FFBF00",hoverColor:"#E5AB00",borderColor:"#CC9800",textColorPrimary:"#000000",schemeColorLighter:"#FFCB32",hoverColorLighter:"#FFC519",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#FFF2CC"},b={schemeColor:"#E83F6F",hoverColor:"#D03863",borderColor:"#B93258",textColorPrimary:"#FFFFFF",schemeColorLighter:"#EC658B",hoverColorLighter:"#EA527D",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#FAD8E2"},j={schemeColor:"#2274A5",hoverColor:"#1E6894",borderColor:"#1B5C84",textColorPrimary:"#FFFFFF",schemeColorLighter:"#4E8FB7",hoverColorLighter:"#3881AE",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#D2E3ED"},u={schemeColor:"#00A323",hoverColor:"#00921F",borderColor:"#00821C",textColorPrimary:"#FFFFFF",schemeColorLighter:"#32B54E",hoverColorLighter:"#19AC38",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#CCECD3"},g={schemeColor:"#20E2E9",hoverColor:"#1CCBD1",borderColor:"#19B4BA",textColorPrimary:"#000000",schemeColorLighter:"#62EAEF",hoverColorLighter:"#4CE7ED",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#D2F9FA"},m=[d,b,j,u,g],p=t(4),_=t(55),x="891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com",O="https://sim-api.danascheider.com",C="https://sim.danascheider.com",v="_sim_google_session",f=function(){return!!Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).STORYBOOK},y=t.p+"static/media/googleIcon.9432a66b.svg",L=t(22),F=t.n(L),N=t(0),S=function(e){var o=e.className,t=e.logOutUser;return Object(N.jsx)("div",{className:o,children:Object(N.jsx)("button",{className:F.a.button,onClick:t,children:Object(N.jsx)("div",{className:F.a.body,children:Object(N.jsxs)("div",{className:F.a.googleLogout,children:[Object(N.jsx)("img",{src:y,alt:"Google logo"}),"Log Out With Google"]})})})})},k=t.p+"static/media/anonymousAvatar.36d1acc1.jpg",E=t(7),w=t.n(E),D=function(){var e=Object(r.useState)(!1),o=Object(p.a)(e,2),t=o[0],a=o[1],n=Object(_.a)([v]),s=Object(p.a)(n,3),i=s[0],d=s[2],b=Object(r.useState)(null),j=Object(p.a)(b,2),u=j[0],g=j[1],m=Object(r.useState)(!i[v]),x=Object(p.a)(m,2),C=x[0],y=x[1],L=Object(r.useRef)(!0);return Object(r.useEffect)((function(){var e="".concat(O,"/users/current");!0===L.current&&(f()||i[v])?fetch(e,{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(i[v])}}).then((function(e){return e.json()})).then((function(e){e?e.error?(console.warn("Error fetching user data - logging out user: ",e.error),d(v),y(!0)):(g(e),y(!1)):y(!0)})).catch((function(){i[v]&&d(v),y(!0)})):y(!0)}),[d]),C?Object(N.jsx)(l.a,{to:h.login}):Object(N.jsx)("div",{className:w.a.root,children:Object(N.jsxs)("div",{className:w.a.bar,children:[Object(N.jsx)("span",{className:w.a.headerContainer,children:Object(N.jsx)("h1",{className:w.a.header,children:Object(N.jsxs)(c.b,{className:w.a.headerLink,to:h.dashboard.main,children:["Skyrim Inventory",Object(N.jsx)("br",{className:w.a.bp})," Management"]})})}),u?Object(N.jsxs)("button",{className:w.a.profile,onClick:function(){return a(!t)},children:[Object(N.jsxs)("div",{className:w.a.profileText,children:[Object(N.jsx)("p",{className:w.a.textTop,children:u.name}),Object(N.jsx)("p",{className:w.a.textBottom,children:u.email})]}),Object(N.jsx)("img",{className:w.a.avatar,src:u.image_url||k,alt:"User avatar",referrerPolicy:"no-referrer"})]}):null,Object(N.jsx)(S,{className:t?w.a.logoutDropdown:w.a.hidden,logOutUser:function(e){if(e.preventDefault(),!window.gapi)return L.current=!1,d(v),Object(N.jsx)(l.a,{to:h.home});var o=window.gapi.auth2.getAuthInstance();null!=o&&o.then((function(){return o.disconnect(),L.current=!1,i[v]&&d(v),Object(N.jsx)(l.a,{to:h.home})}),(function(e){console.log("Logout error: ",e)}))}})]})})},P=t(16),T=t.n(P),I=function(e){var o=e.title,t=e.children;return Object(N.jsxs)("div",{className:T.a.root,children:[Object(N.jsxs)("div",{className:T.a.container,children:[o?Object(N.jsxs)(N.Fragment,{children:[Object(N.jsx)("h2",{className:T.a.title,children:o}),Object(N.jsx)("hr",{className:T.a.hr})]}):null,t]}),Object(N.jsx)(D,{})]})},B=t(36),A=t.n(B),H=function(e){var o=e.colorScheme,t=e.href,r=e.children,a={"--background-color":o.schemeColor,"--hover-color":o.hoverColor,"--text-color":o.textColorPrimary};return Object(N.jsx)(c.b,{className:A.a.root,to:t,style:a,children:r})},M=t(29),U=t.n(M),q=function(e){var o=e.cardArray;return Object(N.jsx)("div",{className:U.a.root,children:o.map((function(e){var o=e.colorScheme,t=e.href,r=e.children,a=e.key;return Object(N.jsx)("div",{className:U.a.card,children:Object(N.jsx)(H,{colorScheme:o,href:t,children:r})},a)}))})},G=t(37),R=t.n(G),K=[{colorScheme:d,href:h.dashboard.shoppingLists,children:"Your Shopping Lists",key:"shopping-lists"},{colorScheme:b,href:"#",children:"Nav Link 2",key:"nav-link-2"},{colorScheme:j,href:"#",children:"Nav Link 3",key:"nav-link-3"},{colorScheme:u,href:"#",children:"Nav Link 4",key:"nav-link-4"},{colorScheme:g,href:"#",children:"Nav Link 5",key:"nav-link-5"}],W=function(){return Object(N.jsx)(I,{children:Object(N.jsx)("div",{className:R.a.root,children:Object(N.jsx)(q,{cardArray:K})})})},V=t(21),z=t(12),Y=t.n(z),J=function(e){var o=e.description,t=e.quantity,a=e.notes,n=e.colorScheme,s=n.schemeColor,c=n.hoverColor,i=n.titleTextColor,l=n.borderColor,h=n.bodyBackgroundColor,d=n.bodyTextColor,b=Object(r.useState)(0),j=Object(p.a)(b,2),u=j[0],g=j[1],m={"--scheme-color":s,"--title-text-color":i,"--border-color":l,"--body-background-color":h,"--body-text-color":d,"--hover-color":c};return Object(N.jsxs)("div",{className:Y.a.root,style:m,children:[Object(N.jsxs)("div",{className:Y.a.headerContainer,children:[Object(N.jsx)("button",{className:Y.a.button,onClick:function(){g(Date.now)},children:Object(N.jsx)("h4",{className:Y.a.description,children:o})}),Object(N.jsx)("span",{className:Y.a.quantity,children:t})]}),Object(N.jsx)(V.a,{toggleEvent:u,collapsed:!0,children:function(e){var o=e.setCollapsibleElement;return Object(N.jsx)("div",{className:Y.a.collapsible,ref:o,children:Object(N.jsx)("div",{className:Y.a.container,children:Object(N.jsx)("p",{className:Y.a.notes,children:a||"No details available"})})})}})]})},Q=t(15),X=t.n(Q),Z=function(e){var o=e.title,t=e.colorScheme,a=e.listItems,n=void 0===a?[]:a,s=t.schemeColor,c=t.hoverColor,i=t.borderColor,l=t.textColorPrimary,h=t.schemeColorLighter,d=t.hoverColorLighter,b=t.schemeColorLightest,j={schemeColor:h,hoverColor:d,borderColor:i,titleTextColor:t.textColorSecondary,bodyBackgroundColor:b,bodyTextColor:t.textColorTertiary},u=Object(r.useState)(0),g=Object(p.a)(u,2),m=g[0],_=g[1],x={"--scheme-color":s,"--border-color":i,"--text-color":l,"--hover-color":c};return Object(N.jsxs)("div",{className:X.a.root,style:x,children:[Object(N.jsx)("div",{className:X.a.titleContainer,children:Object(N.jsx)("button",{className:X.a.button,onClick:function(){_(Date.now)},children:Object(N.jsx)("h3",{className:X.a.title,children:o})})}),Object(N.jsx)(V.a,{toggleEvent:m,collapsed:!0,children:function(e){var t=e.setCollapsibleElement;return Object(N.jsx)("div",{className:X.a.collapsible,ref:t,children:n.map((function(e){var t=e.id,r=e.description,a=e.quantity,n=e.notes,s="".concat(o.toLowerCase().replace(" ","-"),"-").concat(t);return Object(N.jsx)(J,{description:r,quantity:a,notes:n,colorScheme:j},s)}))})}})]})},$=t(40),ee=t.n($),oe=function(e){var o=e.className,t=e.type,r=void 0===t?"spin":t,a=e.color,n=e.height,s=e.width;return Object(N.jsx)(ee.a,{className:o,type:r,color:a,height:n,width:s})},te=t(17),re=t.n(te),ae="loading",ne="error",se=function(){var e=Object(r.useState)(null),o=Object(p.a)(e,2),t=o[0],a=o[1],n=Object(r.useState)(ae),s=Object(p.a)(n,2),c=s[0],i=s[1],l=Object(r.useState)(null),h=Object(p.a)(l,2),b=h[0],j=h[1],u=Object(_.a)([v]),g=Object(p.a)(u,3)[0];return Object(r.useEffect)((function(){var e="".concat(O,"/shopping_lists");(g[v]||f())&&fetch(e,{headers:{Authorization:"Bearer ".concat(g[v])}}).then((function(e){return 200===e.status||401===e.status?e.json():null})).then((function(e){e?e.error?(i(ne),j(e.error)):(i("loaded"),a(e)):(i(ne),j("Unknown error: something went wrong when retrieving your shopping list data."),console.warn("Something went wrong"))}))}),[]),Object(N.jsx)(I,{title:"Your Shopping Lists",children:t?t.length>0?t.map((function(e,o){var t=e.title,r=e.shopping_list_items,a=o>m.length?o%m.length:o,n=t.toLowerCase().replace(" ","-");return Object(N.jsx)("div",{className:re.a.shoppingList,children:Object(N.jsx)(Z,{title:t,listItems:r,colorScheme:m[a]})},n)})):Object(N.jsx)("p",{className:re.a.noLists,children:"You have no shopping lists."}):c===ae?Object(N.jsx)(oe,{className:re.a.loading,type:"bubbles",color:d.schemeColor,height:"15%",width:"15%"}):c===ne?Object(N.jsx)("div",{className:re.a.error,children:b}):Object(N.jsx)(N.Fragment,{})})},ce=t(18),ie=t.n(ce),le=function(){var e=Object(_.a)([v]),o=Object(p.a)(e,3)[0];return!f()&&o[v]?Object(N.jsx)(l.a,{to:h.dashboard.main}):Object(N.jsx)("div",{className:ie.a.root,children:Object(N.jsxs)("div",{className:ie.a.container,children:[Object(N.jsx)("h1",{className:ie.a.header,children:"Skyrim Inventory Management"}),Object(N.jsx)(c.b,{className:ie.a.login,to:h.login,children:"Log in with Google"})]})})},he=t(41),de=t.n(he),be=t(19),je=t.n(be),ue=function(){var e=Object(_.a)([v]),o=Object(p.a)(e,3),t=o[0],a=o[1],n=o[2],s=Object(r.useState)(null),c=Object(p.a)(s,2),i=c[0],d=c[1];return t[v]&&!f()?Object(N.jsx)(l.a,{to:h.dashboard.main}):Object(N.jsxs)("div",{className:je.a.root,children:[i?Object(N.jsx)("p",{className:je.a.errorMessage,children:i}):null,Object(N.jsx)("div",{className:je.a.container,children:Object(N.jsx)(de.a,{className:je.a.button,clientId:x,buttonText:"Log In With Google",onSuccess:function(e){var o=e.tokenId,r="".concat(O,"/auth/verify_token");t[v]!==o&&fetch(r,{headers:{Authorization:"Bearer ".concat(o)}}).then((function(e){204===e.status?a(v,o):t[v]&&n(v)})).catch((function(e){return t[v]&&n(v),console.log("Error from /auth/verify_token: ",e),Object(N.jsx)(l.a,{to:h.home})}))},onFailure:function(e){console.log("Login failure: ",e),t[v]&&n(v),d("Something went wrong! Please try logging in again.")},redirectUri:"".concat(C).concat(h.dashboard.main)})})]})},ge="Skyrim Inventory Management |",me=[{pageId:"home",title:"".concat(ge," Home"),description:"Manage your inventory across multiple properties in Skyrim",Component:le,path:h.home},{pageId:"login",title:"".concat(ge," Login"),description:"Log into Skyrim Inventory Management using your Google account",Component:ue,path:h.login},{pageId:"dashboard",title:"".concat(ge," Dashboard"),description:"Skyrim Inventory Management User Dashboard",Component:W,path:h.dashboard.main},{pageId:"shoppingLists",title:"".concat(ge," Manage Shopping Lists"),description:"Manage Skyrim Shopping Lists",Component:se,path:h.dashboard.shoppingLists}],pe=function(){return Object(N.jsx)(l.d,{children:me.map((function(e){var o=e.pageId,t=e.title,r=e.description,a=e.Component,n=e.path;return Object(N.jsxs)(l.b,{exact:!0,path:n,children:[Object(N.jsxs)(i.a,{children:[Object(N.jsx)("html",{lang:"en"}),Object(N.jsx)("title",{children:t}),Object(N.jsx)("meta",{name:"description",content:r})]}),Object(N.jsx)(a,{})]},o)}))})},_e=function(){return Object(N.jsx)(c.a,{basename:"",children:Object(N.jsx)(i.b,{children:Object(N.jsx)(pe,{})})})};s.a.render(Object(N.jsx)(a.a.StrictMode,{children:Object(N.jsx)(_e,{})}),document.getElementById("root"))},7:function(e,o,t){e.exports={root:"dashboardHeader_root__3lzne",bar:"dashboardHeader_bar__1XEWl",headerContainer:"dashboardHeader_headerContainer__1ZVqS",header:"dashboardHeader_header__cB1mg",headerLink:"dashboardHeader_headerLink__dHHDn",profile:"dashboardHeader_profile__A3WxH",profileText:"dashboardHeader_profileText__1HPKf",textTop:"dashboardHeader_textTop__2UNgU",textBottom:"dashboardHeader_textBottom__1vLtl",avatar:"dashboardHeader_avatar__2BhRu",logoutDropdown:"dashboardHeader_logoutDropdown__37Dm5",hidden:"dashboardHeader_hidden__Fkjhq",bp:"dashboardHeader_bp__2hS3f"}}},[[54,1,2]]]);
//# sourceMappingURL=main.5d4aac87.chunk.js.map