(this.webpackJsonpskyrim_inventory_management_frontend=this.webpackJsonpskyrim_inventory_management_frontend||[]).push([[0],{12:function(e,t,o){e.exports={root:"shoppingListItem_root__3NPoi",headerContainer:"shoppingListItem_headerContainer__hu6Ur",button:"shoppingListItem_button__2k4QA",quantity:"shoppingListItem_quantity__1ebyP",description:"shoppingListItem_description__mnU6z",collapsible:"shoppingListItem_collapsible__xa2wr",notes:"shoppingListItem_notes__8g2fK"}},13:function(e,t,o){e.exports={root:"shoppingList_root__2O9FT",trigger:"shoppingList_trigger__WV4fR",form:"shoppingList_form__1GdfA",title:"shoppingList_title__3Gulc",fa:"shoppingList_fa__hRtKq",collapsible:"shoppingList_collapsible__2Zuq5"}},17:function(e,t,o){e.exports={flash:"shoppingListPage_flash__1mBKN",shoppingList:"shoppingListPage_shoppingList__2wdvG",loading:"shoppingListPage_loading__LoEmY",noLists:"shoppingListPage_noLists__3Ijpw",error:"shoppingListPage_error__3Ea81"}},19:function(e,t,o){e.exports={root:"dashboardLayout_root__2dfR_",title:"dashboardLayout_title__1yGVn",hr:"dashboardLayout_hr__29GgW",container:"dashboardLayout_container__3AwFx"}},20:function(e,t,o){e.exports={root:"flashMessage_root__2sPxp",content:"flashMessage_content__3iY0s",header:"flashMessage_header__Vx_Jr",messageList:"flashMessage_messageList__3V9SA",msg:"flashMessage_msg__3Wquk"}},22:function(e,t,o){e.exports={root:"shoppingListForm_root__24Wk-",input:"shoppingListForm_input__27DAp",submit:"shoppingListForm_submit__2yw-C",fa:"shoppingListForm_fa__1iH4U"}},23:function(e,t,o){e.exports={root:"homePage_root__15tty",container:"homePage_container__3kQJo",header:"homePage_header__3EV45",login:"homePage_login__3ala0"}},24:function(e,t,o){e.exports={root:"loginPage_root__2Vf7z",errorMessage:"loginPage_errorMessage__8uTVC",container:"loginPage_container__2xdLK",button:"loginPage_button__1pDsX"}},29:function(e,t,o){e.exports={button:"logoutDropdown_button__3hRUK",body:"logoutDropdown_body__NiLPw",googleLogout:"logoutDropdown_googleLogout__J9YSG"}},36:function(e,t,o){e.exports={root:"navigationMosaic_root__2CDUx",card:"navigationMosaic_card__3hEln"}},42:function(e,t,o){e.exports={root:"navigationCard_root__1-FD3"}},43:function(e,t,o){e.exports={root:"dashboardPage_root__oVxx1"}},56:function(e,t,o){},65:function(e,t,o){"use strict";o.r(t);var r,n=o(1),a=o.n(n),c=o(38),s=o.n(c),i=(o(56),o(11)),l=o(25),h=o(4),d={home:"/",login:"/login",dashboard:{main:"/dashboard",shoppingLists:"/dashboard/shoppingLists"}},u={schemeColor:"#FFBF00",hoverColor:"#E5AB00",borderColor:"#CC9800",textColorPrimary:"#000000",schemeColorLighter:"#FFCB32",hoverColorLighter:"#FFC519",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#FFF2CC"},b={schemeColor:"#E83F6F",hoverColor:"#D03863",borderColor:"#B93258",textColorPrimary:"#FFFFFF",schemeColorLighter:"#EC658B",hoverColorLighter:"#EA527D",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#FAD8E2"},m={schemeColor:"#2274A5",hoverColor:"#1E6894",borderColor:"#1B5C84",textColorPrimary:"#FFFFFF",schemeColorLighter:"#4E8FB7",hoverColorLighter:"#3881AE",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#D2E3ED"},g={schemeColor:"#00A323",hoverColor:"#00921F",borderColor:"#00821C",textColorPrimary:"#FFFFFF",schemeColorLighter:"#32B54E",hoverColorLighter:"#19AC38",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#CCECD3"},j={schemeColor:"#20E2E9",hoverColor:"#1CCBD1",borderColor:"#19B4BA",textColorPrimary:"#000000",schemeColorLighter:"#62EAEF",hoverColorLighter:"#4CE7ED",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#D2F9FA"},p=[u,b,m,g,j],_=o(3),f=o(66),x="891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com",O="https://sim-api.danascheider.com",v="https://sim.danascheider.com",C="_sim_google_session",y=function(){return!!Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).STORYBOOK},L=o.p+"static/media/googleIcon.9432a66b.svg",N=o(29),S=o.n(N),F=o(0),E=function(e){var t=e.className,o=e.logOutUser;return Object(F.jsx)("div",{className:t,children:Object(F.jsx)("button",{className:S.a.button,onClick:o,children:Object(F.jsx)("div",{className:S.a.body,children:Object(F.jsxs)("div",{className:S.a.googleLogout,children:[Object(F.jsx)("img",{src:L,alt:"Google logo"}),"Log Out With Google"]})})})})},k=o.p+"static/media/anonymousAvatar.36d1acc1.jpg",w=o(7),P=o.n(w),T=function(){var e=Object(n.useState)(!1),t=Object(_.a)(e,2),o=t[0],r=t[1],a=Object(f.a)([C]),c=Object(_.a)(a,3),s=c[0],l=c[2],u=Object(n.useState)(null),b=Object(_.a)(u,2),m=b[0],g=b[1],j=Object(n.useState)(!s[C]),p=Object(_.a)(j,2),x=p[0],v=p[1],L=Object(n.useRef)(!0);return Object(n.useEffect)((function(){var e="".concat(O,"/users/current");!0===L.current&&(y()||s[C])?fetch(e,{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(s[C])}}).then((function(e){return e.json()})).then((function(e){e?e.error?(console.warn("Error fetching user data - logging out user: ",e.error),l(C),v(!0)):(g(e),v(!1)):v(!0)})).catch((function(){s[C]&&l(C),v(!0)})):v(!0)}),[l]),x?Object(F.jsx)(h.a,{to:d.login}):Object(F.jsx)("div",{className:P.a.root,children:Object(F.jsxs)("div",{className:P.a.bar,children:[Object(F.jsx)("span",{className:P.a.headerContainer,children:Object(F.jsx)("h1",{className:P.a.header,children:Object(F.jsxs)(i.b,{className:P.a.headerLink,to:d.dashboard.main,children:["Skyrim Inventory",Object(F.jsx)("br",{className:P.a.bp})," Management"]})})}),m?Object(F.jsxs)("button",{className:P.a.profile,onClick:function(){return r(!o)},children:[Object(F.jsxs)("div",{className:P.a.profileText,children:[Object(F.jsx)("p",{className:P.a.textTop,children:m.name}),Object(F.jsx)("p",{className:P.a.textBottom,children:m.email})]}),Object(F.jsx)("img",{className:P.a.avatar,src:m.image_url||k,alt:"User avatar",referrerPolicy:"no-referrer"})]}):null,Object(F.jsx)(E,{className:o?P.a.logoutDropdown:P.a.hidden,logOutUser:function(e){if(e.preventDefault(),!window.gapi)return L.current=!1,l(C),Object(F.jsx)(h.a,{to:d.home});var t=window.gapi.auth2.getAuthInstance();null!=t&&t.then((function(){return t.disconnect(),L.current=!1,s[C]&&l(C),Object(F.jsx)(h.a,{to:d.home})}),(function(e){console.log("Logout error: ",e)}))}})]})})},D=o(19),I=o.n(D),A=function(e){var t=e.title,o=e.children;return Object(F.jsxs)("div",{className:I.a.root,children:[Object(F.jsxs)("div",{className:I.a.container,children:[t?Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)("h2",{className:I.a.title,children:t}),Object(F.jsx)("hr",{className:I.a.hr})]}):null,o]}),Object(F.jsx)(T,{})]})},B=o(42),H=o.n(B),R=function(e){var t=e.colorScheme,o=e.href,r=e.children,n={"--background-color":t.schemeColor,"--hover-color":t.hoverColor,"--text-color":t.textColorPrimary};return Object(F.jsx)(i.b,{className:H.a.root,to:o,style:n,children:r})},M=o(36),V=o.n(M),U=function(e){var t=e.cardArray;return Object(F.jsx)("div",{className:V.a.root,children:t.map((function(e){var t=e.colorScheme,o=e.href,r=e.children,n=e.key;return Object(F.jsx)("div",{className:V.a.card,children:Object(F.jsx)(R,{colorScheme:t,href:o,children:r})},n)}))})},q=o(43),G=o.n(q),W=[{colorScheme:u,href:d.dashboard.shoppingLists,children:"Your Shopping Lists",key:"shopping-lists"},{colorScheme:b,href:"#",children:"Nav Link 2",key:"nav-link-2"},{colorScheme:m,href:"#",children:"Nav Link 3",key:"nav-link-3"},{colorScheme:g,href:"#",children:"Nav Link 4",key:"nav-link-4"},{colorScheme:j,href:"#",children:"Nav Link 5",key:"nav-link-5"}],K=function(){return Object(F.jsx)(A,{children:Object(F.jsx)("div",{className:G.a.root,children:Object(F.jsx)(U,{cardArray:W})})})},z=o(44),Y=o(16),J=o(20),Q=o.n(J),X="info",Z=(r={},Object(Y.a)(r,X,{body:"#cce5ff",border:"#b3d8ff",text:"#6289b2"}),Object(Y.a)(r,"error",{body:"#ffcccc",border:"#ff9999",text:"#cc0000"}),Object(Y.a)(r,"warning",{body:"#fefde4",border:"#fdf797",text:"#b0a723"}),r),$=function(e){var t=e.type,o=void 0===t?X:t,r=e.header,n=e.message,a={"--body-color":Z[o].body,"--border-color":Z[o].border,"--text-color":Z[o].text};return Object(F.jsxs)("div",{className:Q.a.root,style:a,children:[r&&Object(F.jsx)("p",{className:Q.a.header,children:r}),"string"===typeof n?n:Object(F.jsx)("ul",{className:Q.a.messageList,children:n.map((function(e,t){return Object(F.jsx)("li",{className:Q.a.msg,children:e},"message-".concat(t))}))})]})},ee=function(){var e=Object(n.useState)(!1),t=Object(_.a)(e,2),o=t[0],r=t[1],a=Object(n.useRef)(null),c=Object(n.useRef)(null),s=function(e){return c.current&&c.current.contains(e)},i=function(e){"Escape"===e.key&&r(!1)},l=function(e){var t;t=e.target,a.current&&a.current.contains(t)||s(e.target)?s(e.target)&&r(!o):r(!1)};return Object(n.useEffect)((function(){return document.addEventListener("keydown",i,!0),document.addEventListener("click",l,!0),function(){document.removeEventListener("keydown",i,!0),document.removeEventListener("click",l,!0)}})),{componentRef:a,triggerRef:c,isComponentVisible:o,setIsComponentVisible:r}},te=o(26),oe=o(28),re=o(27),ne=o(47),ae=o.n(ne),ce=o(22),se=o.n(ce),ie=function(e){var t=e.formRef,o=e.className,r=e.colorScheme,a=e.title,c=e.onSubmit,s=function(e){var t=document.createElement("canvas").getContext("2d");return t.font="21px Quattrocento Sans",t.measureText(e).width},i=Object(n.useState)(a),l=Object(_.a)(i,2),h=l[0],d=l[1],u=Object(n.useState)("".concat(s(a),"px")),b=Object(_.a)(u,2),m=b[0],g=b[1],j=Object(n.useRef)(null),p={"--scheme-color":r.schemeColor,"--text-color":r.textColorPrimary,"--border-color":r.borderColor,"--icon-hover-color":r.schemeColorLightest};return Object(n.useEffect)((function(){j.current.focus()})),Object(F.jsxs)("form",{className:ae()(o,se.a.root),style:p,ref:t,onSubmit:c,children:[Object(F.jsx)("input",{className:se.a.input,onClick:function(e){return e.stopPropagation()},onChange:function(e){var t=e.currentTarget.value;d(t),g("".concat(s(t),"px"))},type:"text",name:"title",ref:j,style:{width:m},value:h}),Object(F.jsx)("button",{className:se.a.submit,name:"submit",type:"submit",children:Object(F.jsx)(te.a,{className:se.a.fa,icon:oe.a})})]})},le=o(12),he=o.n(le),de=function(e){var t=e.description,o=e.quantity,r=e.notes,a=e.colorScheme,c=a.schemeColor,s=a.hoverColor,i=a.titleTextColor,l=a.borderColor,h=a.bodyBackgroundColor,d=a.bodyTextColor,u=Object(n.useState)(0),b=Object(_.a)(u,2),m=b[0],g=b[1],j={"--scheme-color":c,"--title-text-color":i,"--border-color":l,"--body-background-color":h,"--body-text-color":d,"--hover-color":s};return Object(F.jsxs)("div",{className:he.a.root,style:j,children:[Object(F.jsxs)("div",{className:he.a.headerContainer,children:[Object(F.jsx)("button",{className:he.a.button,onClick:function(){g(Date.now)},children:Object(F.jsx)("h4",{className:he.a.description,children:t})}),Object(F.jsx)("span",{className:he.a.quantity,children:o})]}),Object(F.jsx)(re.a,{toggleEvent:m,collapsed:!0,children:function(e){var t=e.setCollapsibleElement;return Object(F.jsx)("div",{className:he.a.collapsible,ref:t,children:Object(F.jsx)("div",{className:he.a.container,children:Object(F.jsx)("p",{className:he.a.notes,children:r||"No details available"})})})}})]})},ue=o(13),be=o.n(ue),me=function(e){var t=e.canEdit,o=void 0===t||t,r=e.title,a=e.onSubmitEditForm,c=e.colorScheme,s=e.listItems,i=void 0===s?[]:s,l=c.schemeColor,h=c.hoverColor,d=c.borderColor,u=c.textColorPrimary,b=c.schemeColorLighter,m=c.hoverColorLighter,g=c.schemeColorLightest,j={schemeColor:b,hoverColor:m,borderColor:d,titleTextColor:c.textColorSecondary,bodyBackgroundColor:g,bodyTextColor:c.textColorTertiary},p=Object(n.useState)(0),f=Object(_.a)(p,2),x=f[0],O=f[1],v=Object(n.useState)(r),C=Object(_.a)(v,2),y=C[0],L=C[1],N=Object(n.useRef)(null),S=ee(),E=S.componentRef,k=S.triggerRef,w=S.isComponentVisible,P=S.setIsComponentVisible,T=function(e){return function(e){return N.current&&(N.current===e||N.current.contains(e))}(e)&&!function(e){return k.current&&(k.current===e||k.current.contains(e))}(e)&&!function(e){return E.current&&(E.current===e||E.current.contains(e))}(e)},D={"--scheme-color":l,"--border-color":d,"--text-color":u,"--hover-color":h,"--scheme-color-lighter":b,"--scheme-color-lightest":g};return Object(F.jsxs)("div",{className:be.a.root,style:D,children:[Object(F.jsx)("div",{className:be.a.titleContainer,children:Object(F.jsxs)("div",{className:be.a.trigger,ref:N,onClick:function(e){T(e.target)&&O(Date.now)},children:[o&&Object(F.jsx)("div",{ref:k,children:Object(F.jsx)(te.a,{className:be.a.fa,icon:oe.b})}),o&&w?Object(F.jsx)(ie,{formRef:E,className:be.a.form,colorScheme:c,title:r,onSubmit:function(e){var t,o=e.nativeEvent.target.children[0].defaultValue;(t=o)&&t.match(/^\s*[a-z0-9 ]*\s*$/i)[0]===t&&L(o),a(e),P(!1)}}):Object(F.jsx)("h3",{className:be.a.title,children:y})]})}),Object(F.jsx)(re.a,{toggleEvent:x,collapsed:!0,children:function(e){var t=e.setCollapsibleElement;return Object(F.jsx)("div",{className:be.a.collapsible,ref:t,children:i.map((function(e){var t=e.id,o=e.description,n=e.quantity,a=e.notes,c="".concat(r.toLowerCase().replace(" ","-"),"-").concat(t);return Object(F.jsx)(de,{description:o,quantity:n,notes:a,colorScheme:j},c)}))})}})]})},ge=o(48),je=o.n(ge),pe=function(e){var t=e.className,o=e.type,r=void 0===o?"spin":o,n=e.color,a=e.height,c=e.width;return Object(F.jsx)(je.a,{className:t,type:r,color:n,height:a,width:c})},_e=o(17),fe=o.n(_e),xe="loading",Oe="error",ve=function(){var e=Object(n.useState)(null),t=Object(_.a)(e,2),o=t[0],r=t[1],a=Object(n.useState)(xe),c=Object(_.a)(a,2),s=c[0],i=c[1],l=Object(n.useState)(null),h=Object(_.a)(l,2),d=h[0],b=h[1],m=Object(n.useState)({}),g=Object(_.a)(m,2),j=g[0],x=g[1],v=Object(n.useState)(!1),L=Object(_.a)(v,2),N=L[0],S=L[1],E=Object(f.a)([C]),k=Object(_.a)(E,3)[0];return Object(n.useEffect)((function(){var e="".concat(O,"/shopping_lists");(k[C]||y())&&fetch(e,{headers:{Authorization:"Bearer ".concat(k[C])}}).then((function(e){return 200===e.status||401===e.status?e.json():null})).then((function(e){e?e.error?(i(Oe),b(e.error)):(i("loaded"),r(e)):(i(Oe),b("Unknown error: something went wrong when retrieving your shopping list data."),console.warn("Something went wrong"))}))}),[]),Object(F.jsxs)(A,{title:"Your Shopping Lists",children:[N?Object(F.jsx)("div",{className:fe.a.flash,children:Object(F.jsx)($,Object(z.a)({},j))}):null,o?o.length>0?o.map((function(e,t){var n=e.id,a=e.master,c=e.title,s=e.shopping_list_items,i=t>p.length?t%p.length:t,l=c.toLowerCase().replace(" ","-");return Object(F.jsx)("div",{className:fe.a.shoppingList,children:Object(F.jsx)(me,{canEdit:!a,title:c,listItems:s,colorScheme:p[i],onSubmitEditForm:function(e){return function(e,t){t.preventDefault();var n=t.nativeEvent.target.children[0].defaultValue;fetch("".concat(O,"/shopping_lists/").concat(e),{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(k[C])},body:JSON.stringify({id:e,shopping_list:{title:n}})}).then((function(e){return e.json()})).then((function(t){if(t.error&&t.error.match(/not found/i))x({type:"error",message:"Shopping list could not be updated. Try refreshing to fix this problem."}),S(!0);else if(t.errors&&t.errors.title)x({type:"error",header:"".concat(t.errors.title.length," error(s) prevented your changes from being saved:"),message:t.errors.title.map((function(e){return"Title ".concat(e)}))}),S(!0);else if(t.error)x({type:"error",header:"Error authenticating user (log back in to try again):",message:t.error}),S(!0);else{var n=o.map((function(o,r){return o.id===e?t:o}));r(n)}})).catch((function(e){return console.error(e)}))}(n,e)}})},l)})):Object(F.jsx)("p",{className:fe.a.noLists,children:"You have no shopping lists."}):s===xe?Object(F.jsx)(pe,{className:fe.a.loading,type:"bubbles",color:u.schemeColor,height:"15%",width:"15%"}):s===Oe?Object(F.jsx)("div",{className:fe.a.error,children:d}):Object(F.jsx)(F.Fragment,{})]})},Ce=o(23),ye=o.n(Ce),Le=function(){var e=Object(f.a)([C]),t=Object(_.a)(e,3)[0];return!y()&&t[C]?Object(F.jsx)(h.a,{to:d.dashboard.main}):Object(F.jsx)("div",{className:ye.a.root,children:Object(F.jsxs)("div",{className:ye.a.container,children:[Object(F.jsx)("h1",{className:ye.a.header,children:"Skyrim Inventory Management"}),Object(F.jsx)(i.b,{className:ye.a.login,to:d.login,children:"Log in with Google"})]})})},Ne=o(49),Se=o.n(Ne),Fe=o(24),Ee=o.n(Fe),ke=function(){var e=Object(f.a)([C]),t=Object(_.a)(e,3),o=t[0],r=t[1],a=t[2],c=Object(n.useState)(null),s=Object(_.a)(c,2),i=s[0],l=s[1];return o[C]&&!y()?Object(F.jsx)(h.a,{to:d.dashboard.main}):Object(F.jsxs)("div",{className:Ee.a.root,children:[i?Object(F.jsx)("p",{className:Ee.a.errorMessage,children:i}):null,Object(F.jsx)("div",{className:Ee.a.container,children:Object(F.jsx)(Se.a,{className:Ee.a.button,clientId:x,buttonText:"Log In With Google",onSuccess:function(e){var t=e.tokenId,n="".concat(O,"/auth/verify_token");o[C]!==t&&fetch(n,{headers:{Authorization:"Bearer ".concat(t)}}).then((function(e){204===e.status?r(C,t):o[C]&&a(C)})).catch((function(e){return o[C]&&a(C),console.log("Error from /auth/verify_token: ",e),Object(F.jsx)(h.a,{to:d.home})}))},onFailure:function(e){console.log("Login failure: ",e),o[C]&&a(C),l("Something went wrong! Please try logging in again.")},redirectUri:"".concat(v).concat(d.dashboard.main)})})]})},we="Skyrim Inventory Management |",Pe=[{pageId:"home",title:"".concat(we," Home"),description:"Manage your inventory across multiple properties in Skyrim",Component:Le,path:d.home},{pageId:"login",title:"".concat(we," Login"),description:"Log into Skyrim Inventory Management using your Google account",Component:ke,path:d.login},{pageId:"dashboard",title:"".concat(we," Dashboard"),description:"Skyrim Inventory Management User Dashboard",Component:K,path:d.dashboard.main},{pageId:"shoppingLists",title:"".concat(we," Manage Shopping Lists"),description:"Manage Skyrim Shopping Lists",Component:ve,path:d.dashboard.shoppingLists}],Te=function(){return Object(F.jsx)(h.d,{children:Pe.map((function(e){var t=e.pageId,o=e.title,r=e.description,n=e.Component,a=e.path;return Object(F.jsxs)(h.b,{exact:!0,path:a,children:[Object(F.jsxs)(l.a,{children:[Object(F.jsx)("html",{lang:"en"}),Object(F.jsx)("title",{children:o}),Object(F.jsx)("meta",{name:"description",content:r})]}),Object(F.jsx)(n,{})]},t)}))})},De=function(){return Object(F.jsx)(i.a,{basename:"",children:Object(F.jsx)(l.b,{children:Object(F.jsx)(Te,{})})})};s.a.render(Object(F.jsx)(a.a.StrictMode,{children:Object(F.jsx)(De,{})}),document.getElementById("root"))},7:function(e,t,o){e.exports={root:"dashboardHeader_root__3lzne",bar:"dashboardHeader_bar__1XEWl",headerContainer:"dashboardHeader_headerContainer__1ZVqS",header:"dashboardHeader_header__cB1mg",headerLink:"dashboardHeader_headerLink__dHHDn",profile:"dashboardHeader_profile__A3WxH",profileText:"dashboardHeader_profileText__1HPKf",textTop:"dashboardHeader_textTop__2UNgU",textBottom:"dashboardHeader_textBottom__1vLtl",avatar:"dashboardHeader_avatar__2BhRu",logoutDropdown:"dashboardHeader_logoutDropdown__37Dm5",hidden:"dashboardHeader_hidden__Fkjhq",bp:"dashboardHeader_bp__2hS3f"}}},[[65,1,2]]]);
//# sourceMappingURL=main.9f1781e4.chunk.js.map