(this.webpackJsonpskyrim_inventory_management_frontend=this.webpackJsonpskyrim_inventory_management_frontend||[]).push([[0],{14:function(e,t,o){e.exports={root:"shoppingListItem_root__3NPoi",headerContainer:"shoppingListItem_headerContainer__hu6Ur",button:"shoppingListItem_button__2k4QA",quantity:"shoppingListItem_quantity__1ebyP",description:"shoppingListItem_description__mnU6z",collapsible:"shoppingListItem_collapsible__xa2wr",notes:"shoppingListItem_notes__8g2fK"}},15:function(e,t,o){e.exports={root:"shoppingListCreateForm_root__iSFdV",button:"shoppingListCreateForm_button__2so-6",fieldset:"shoppingListCreateForm_fieldset__1BLSp",fieldsetDisabled:"shoppingListCreateForm_fieldsetDisabled__2V4n7",input:"shoppingListCreateForm_input__3hAzq",buttonDisabled:"shoppingListCreateForm_buttonDisabled__1USkv"}},16:function(e,t,o){e.exports={root:"shoppingList_root__2O9FT",trigger:"shoppingList_trigger__WV4fR",form:"shoppingList_form__1GdfA",title:"shoppingList_title__3Gulc",fa:"shoppingList_fa__hRtKq",collapsible:"shoppingList_collapsible__2Zuq5"}},21:function(e,t,o){e.exports={root:"dashboardLayout_root__2dfR_",title:"dashboardLayout_title__1yGVn",hr:"dashboardLayout_hr__29GgW",container:"dashboardLayout_container__3AwFx"}},22:function(e,t,o){e.exports={root:"flashMessage_root__2sPxp",content:"flashMessage_content__3iY0s",header:"flashMessage_header__Vx_Jr",messageList:"flashMessage_messageList__3V9SA",msg:"flashMessage_msg__3Wquk"}},24:function(e,t,o){e.exports={root:"shoppingListEditForm_root__rs5qL",input:"shoppingListEditForm_input__2FbCX",submit:"shoppingListEditForm_submit__1FqNJ",fa:"shoppingListEditForm_fa__Bb-dM"}},25:function(e,t,o){e.exports={root:"homePage_root__15tty",container:"homePage_container__3kQJo",header:"homePage_header__3EV45",login:"homePage_login__3ala0"}},26:function(e,t,o){e.exports={root:"loginPage_root__2Vf7z",errorMessage:"loginPage_errorMessage__8uTVC",container:"loginPage_container__2xdLK",button:"loginPage_button__1pDsX"}},31:function(e,t,o){e.exports={button:"logoutDropdown_button__3hRUK",body:"logoutDropdown_body__NiLPw",googleLogout:"logoutDropdown_googleLogout__J9YSG"}},37:function(e,t,o){e.exports={root:"navigationMosaic_root__2CDUx",card:"navigationMosaic_card__3hEln"}},38:function(e,t,o){e.exports={root:"dashboardPage_root__oVxx1",loading:"dashboardPage_loading__2vZsl"}},39:function(e,t,o){e.exports={noLists:"shoppingListPageContent_noLists__3xnMI",shoppingList:"shoppingListPageContent_shoppingList__S3gTj",loading:"shoppingListPageContent_loading__2EI8i",error:"shoppingListPageContent_error__1dyyw"}},40:function(e,t,o){e.exports={createForm:"shoppingListPage_createForm__c7_90",flash:"shoppingListPage_flash__1mBKN"}},48:function(e,t,o){e.exports={root:"navigationCard_root__1-FD3"}},58:function(e,t,o){},67:function(e,t,o){"use strict";o.r(t);var r=o(1),n=o.n(r),a=o(43),s=o.n(a),i=(o(58),o(10)),c=o(27),l=o(4),d=o(13),h=o(3),u=o(68),b="891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com",g="https://sim.danascheider.com",p="_sim_google_session";function j(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"401 Unauthorized";this.message=e,this.code=401,this.name="AuthorizationError",this.stack=(new Error).stack}j.prototype=new Error;var m,f="https://sim-api.danascheider.com",_=function(e){return{Authorization:"Bearer ".concat(e)}},x={"Content-Type":"application/json"},O=function(e){return Object(d.a)(Object(d.a)({},_(e)),x)},v=function(e,t){var o="".concat(f,"/shopping_lists"),r=JSON.stringify({shopping_list:t});return fetch(o,{method:"POST",headers:O(e),body:r}).then((function(e){if(401===e.status)throw new j;return e}))},C=function(e,t,o){var r="".concat(f,"/shopping_lists/").concat(t),n=JSON.stringify({id:t,shopping_list:o});return fetch(r,{method:"PATCH",headers:O(e),body:n}).then((function(e){if(401===e.status)throw new j;return e}))},L=function(e){console.error("Error signing out: ",e.message)},y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:L;if(window.gapi&&window.gapi.auth2){var o=window.gapi.auth2.getAuthInstance();null!==o?o.then((function(){return o.signOut()})).then(e,t):e()}e()},S=function(){return!!Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).STORYBOOK},N={home:"/",login:"/login",dashboard:{main:"/dashboard",shoppingLists:"/dashboard/shoppingLists"}},F=o(0),w="done",E=Object(r.createContext)(),k=function(e){var t=e.children,o=e.overrideValue,n=void 0===o?{}:o,a=Object(u.a)([p]),s=Object(h.a)(a,3),i=s[0],c=s[2],b=Object(r.useState)(n.profileData),g=Object(h.a)(b,2),m=g[0],x=g[1],O=Object(r.useState)(n.shouldRedirectTo),v=Object(h.a)(O,2),C=v[0],L=v[1],k=Object(r.useState)(n.profileLoadState||"loading"),P=Object(h.a)(k,2),D=P[0],T=P[1],I=Object(r.useRef)(!0),A=function(){return n.removeSessionCookie||c(p)},R=Object(d.a)({token:i[p],profileData:m,removeSessionCookie:A,profileLoadState:D,setShouldRedirectTo:L},n),V=!n.profileData&&i[p];return Object(r.useEffect)((function(){V?function(e){var t="".concat(f,"/users/current");return fetch(t,{headers:_(e)}).then((function(e){if(401===e.status)throw new j;return e}))}(i[p]).then((function(e){return e.json()})).then((function(e){x(e),n.profileLoadState||T(w)})).catch((function(e){console.error("Error returned while fetching profile data: ",e.message),y((function(){i[p]&&A(),L(N.login),I.current=!1}))})):i[p]||S()?S()&&!n.profileLoadState&&T(w):y((function(){L(N.login),I.current=!1}))}),[]),Object(r.useEffect)((function(){return function(){I.current=!1}})),Object(F.jsx)(E.Provider,{value:R,children:C?Object(F.jsx)(l.a,{to:C}):t})},P={schemeColor:"#FFBF00",hoverColor:"#E5AB00",borderColor:"#CC9800",textColorPrimary:"#000000",schemeColorLighter:"#FFCB32",hoverColorLighter:"#FFC519",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#FFF2CC"},D={schemeColor:"#E83F6F",hoverColor:"#D03863",borderColor:"#B93258",textColorPrimary:"#FFFFFF",schemeColorLighter:"#EC658B",hoverColorLighter:"#EA527D",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#FAD8E2"},T={schemeColor:"#2274A5",hoverColor:"#1E6894",borderColor:"#1B5C84",textColorPrimary:"#FFFFFF",schemeColorLighter:"#4E8FB7",hoverColorLighter:"#3881AE",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#D2E3ED"},I={schemeColor:"#00A323",hoverColor:"#00921F",borderColor:"#00821C",textColorPrimary:"#FFFFFF",schemeColorLighter:"#32B54E",hoverColorLighter:"#19AC38",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#CCECD3"},A={schemeColor:"#20E2E9",hoverColor:"#1CCBD1",borderColor:"#19B4BA",textColorPrimary:"#000000",schemeColorLighter:"#62EAEF",hoverColorLighter:"#4CE7ED",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#D2F9FA"},R=[P,D,T,I,A],V=Object(r.createContext)(),M=function(e){var t=e.colorScheme,o=e.children;return Object(F.jsx)(V.Provider,{value:t,children:o})},B="done",H="error",U=Object(r.createContext)(),q=function(e){var t=e.children,o=e.overrideValue,n=void 0===o?{}:o,a=Object(r.useState)(n.shoppingLists),s=Object(h.a)(a,2),i=s[0],c=s[1],l=Object(r.useState)(!1),u=Object(h.a)(l,2),b=u[0],g=u[1],p=Object(r.useState)({}),m=Object(h.a)(p,2),x=m[0],O=m[1],L=Object(r.useState)("loading"),S=Object(h.a)(L,2),w=S[0],E=S[1],k=K(),P=k.token,D=k.setShouldRedirectTo,T=k.removeSessionCookie,I=Object(r.useRef)(!0),A=Object(d.a)({shoppingLists:i,shoppingListLoadingState:w,performShoppingListUpdate:function(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;C(P,e,{title:t}).then((function(t){switch(t.status){case 200:case 422:return t.json();case 404:return O({type:"error",message:"Shopping list could not be updated. Try refreshing to fix this problem."}),!n.setFlashVisible&&g(!0),null;default:throw Error("Something unexpected went wrong while updating list ".concat(e))}})).then((function(t){if(t&&!t.errors){var a=i.map((function(o){return o.id===e?t:o}));c(a),void 0===n.shoppingListLoadingState&&E(B),o&&o()}else t&&t.errors&&t.errors.title?(O({type:"error",header:"".concat(t.errors.title.length," error(s) prevented your changes from being saved:"),message:t.errors.title.map((function(e){return"Title ".concat(e)}))}),void 0===n.setFlashVisible&&g(!0),void 0===n.shoppingListLoadingState&&E(B),r&&r()):t&&t.errors?(O({type:"error",message:"We couldn't update your list and we're not sure what went wrong. We're sorry! Please refresh the page and try again."}),void 0===n.setFlashVisible&&g(!0),void 0===n.setShoppingListLoadingState&&E(B),r&&r()):r&&r()})).catch((function(t){if(console.error("Error updating shopping list ".concat(e,": "),t.message),401===t.code)return y((function(){P&&T(),D(N.login),I.current=!1}));void 0===n.shoppingListLoadingState&&E(H),r&&r()}))},performShoppingListCreate:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;v(P,{title:e}).then((function(e){return e.json()})).then((function(e){if(2===e.length)c(e),O({type:"success",message:"Success! Your list was created, along with your new master shopping list."}),g(!0),t&&t();else if(Array.isArray(e)){var o=i;o.splice(1,0,e[0]),c(o),O({type:"success",message:"Success! Your list was created."}),t&&t(),g(!0)}else{if(!(e&&e.errors&&e.errors.title))throw e&&e.message?(console.error("Error returned from the SIM API: ",e.message),new Error("There was an unexpected error creating your new list. Unfortunately, we don't know more than that yet. We're sorry!")):new Error("There was an unexpected error creating your new list. Unfortunately we don't know more than that yet. We're sorry!");O({type:"error",header:"".concat(e.errors.title.length," error(s) prevented your shopping list from being created:"),message:e.errors.title.map((function(e){return"Title ".concat(e)}))}),g(!0),t&&t()}})).catch((function(e){console.error("Error creating shopping list: ",e.message),401===e.code?y((function(){P&&T(),D(N.login),I.current=!1})):(O({type:"error",message:e.message}),g(!0),o&&o())}))},flashProps:x,flashVisible:b},n);return Object(r.useEffect)((function(){P&&!n.shoppingLists&&function(e){var t="".concat(f,"/shopping_lists");return fetch(t,{headers:_(e)}).then((function(e){if(401===e.status)throw new j;return e}))}(P).then((function(e){return e.json()})).then((function(e){if(!e)throw new Error("No shopping list data returned from the SIM API");c(e),void 0===n.shoppingListLoadingState&&E(B)})).catch((function(e){console.error("Error fetching shopping lists: ",e.message),401===e.code?y((function(){P&&T(),D(N.home),I.current=!1})):(!n.shoppingListLoadingState&&E(H),O({type:"error",message:"There was an error loading your lists. It may have been on our end. We're sorry!"}),g(!0))}))}),[]),Object(r.useEffect)((function(){return function(){I.current=!1}})),Object(F.jsx)(U.Provider,{value:A,children:t})},W=function(e,t){var o=Object(r.useContext)(e);if(!o)throw new Error(t);return o},G=function(){return W(V,"useColorScheme must be used within a ColorProvider")},K=function(){return W(E,"useDashboardContext must be used within a DashboardProvider")},z=function(){return W(U,"useShoppingListContext must be used within a ShoppingListProvider")},J=o.p+"static/media/googleIcon.9432a66b.svg",Y=o(31),Q=o.n(Y),X=function(e){var t=e.className,o=e.logOutUser;return Object(F.jsx)("div",{className:t,children:Object(F.jsx)("button",{className:Q.a.button,onClick:o,children:Object(F.jsx)("div",{className:Q.a.body,children:Object(F.jsxs)("div",{className:Q.a.googleLogout,children:[Object(F.jsx)("img",{src:J,alt:"Google logo"}),"Log Out With Google"]})})})})},Z=o.p+"static/media/anonymousAvatar.36d1acc1.jpg",$=o(7),ee=o.n($),te=function(){var e=K(),t=e.token,o=e.profileData,n=e.removeSessionCookie,a=e.setShouldRedirectTo,s=Object(r.useState)(!1),c=Object(h.a)(s,2),l=c[0],d=c[1],u=Object(r.useRef)(!0);return Object(r.useEffect)((function(){return function(){return u.current=!1}}),[]),Object(F.jsx)("div",{className:ee.a.root,children:Object(F.jsxs)("div",{className:ee.a.bar,children:[Object(F.jsx)("span",{className:ee.a.headerContainer,children:Object(F.jsx)("h1",{className:ee.a.header,children:Object(F.jsxs)(i.b,{className:ee.a.headerLink,to:N.dashboard.main,children:["Skyrim Inventory",Object(F.jsx)("br",{className:ee.a.bp})," Management"]})})}),o?Object(F.jsxs)("button",{className:ee.a.profile,onClick:function(){return d(!l)},children:[Object(F.jsxs)("div",{className:ee.a.profileText,children:[Object(F.jsx)("p",{className:ee.a.textTop,children:o.name}),Object(F.jsx)("p",{className:ee.a.textBottom,children:o.email})]}),Object(F.jsx)("img",{className:ee.a.avatar,src:o.image_url||Z,alt:"User avatar",referrerPolicy:"no-referrer"})]}):null,Object(F.jsx)(X,{className:l?ee.a.logoutDropdown:ee.a.hidden,logOutUser:function(e){e.preventDefault(),d(!1),y((function(){t&&n(),a(N.home),u.current=!1}))}})]})})},oe=o(21),re=o.n(oe),ne=function(e){var t=e.title,o=e.children;return Object(F.jsxs)("div",{className:re.a.root,children:[Object(F.jsxs)("div",{className:re.a.container,children:[t?Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)("h2",{className:re.a.title,children:t}),Object(F.jsx)("hr",{className:re.a.hr})]}):null,o]}),Object(F.jsx)(te,{})]})},ae=o(47),se=o.n(ae),ie=function(e){var t=e.className,o=e.type,r=void 0===o?"bubbles":o,n=e.color,a=e.height,s=e.width;return Object(F.jsx)(se.a,{className:t,type:r,color:n,height:a,width:s})},ce=o(48),le=o.n(ce),de=function(e){var t=e.href,o=e.children,r=G(),n={"--background-color":r.schemeColor,"--hover-color":r.hoverColor,"--text-color":r.textColorPrimary};return Object(F.jsx)(i.b,{className:le.a.root,to:t,style:n,children:o})},he=o(37),ue=o.n(he),be=function(e){var t=e.cardArray;return Object(F.jsx)("div",{className:ue.a.root,children:t.map((function(e){var t=e.colorScheme,o=e.href,r=e.children,n=e.key;return Object(F.jsx)("div",{className:ue.a.card,children:Object(F.jsx)(M,{colorScheme:t,children:Object(F.jsx)(de,{href:o,children:r})})},n)}))})},ge=o(38),pe=o.n(ge),je=[{colorScheme:P,href:N.dashboard.shoppingLists,children:"Your Shopping Lists",key:"shopping-lists"},{colorScheme:D,href:"#",children:"Nav Link 2",key:"nav-link-2"},{colorScheme:T,href:"#",children:"Nav Link 3",key:"nav-link-3"},{colorScheme:I,href:"#",children:"Nav Link 4",key:"nav-link-4"},{colorScheme:A,href:"#",children:"Nav Link 5",key:"nav-link-5"}],me=function(){var e=K(),t=e.token,o=e.profileLoadState;return t?Object(F.jsx)(ne,{children:"done"===o?Object(F.jsx)("div",{className:pe.a.root,children:Object(F.jsx)(be,{cardArray:je})}):Object(F.jsx)(ie,{className:pe.a.loading,type:"bubbles",color:P.schemeColor,height:"15%",width:"15%"})}):Object(F.jsx)(l.a,{to:N.login})},fe=o(12),_e=o(22),xe=o.n(_e),Oe="info",ve=(m={},Object(fe.a)(m,"success",{body:"#e5f2e5",border:"#b2d8b2",text:"#329932"}),Object(fe.a)(m,Oe,{body:"#cce5ff",border:"#b3d8ff",text:"#6289b2"}),Object(fe.a)(m,"error",{body:"#ffcccc",border:"#ff9999",text:"#cc0000"}),Object(fe.a)(m,"warning",{body:"#fefde4",border:"#fdf797",text:"#b0a723"}),m),Ce=function(e){var t=e.type,o=void 0===t?Oe:t,r=e.header,n=e.message,a={"--body-color":ve[o].body,"--border-color":ve[o].border,"--text-color":ve[o].text};return Object(F.jsxs)("div",{className:xe.a.root,style:a,children:[r&&Object(F.jsx)("p",{className:xe.a.header,children:r}),"string"===typeof n?n:Object(F.jsx)("ul",{className:xe.a.messageList,children:n.map((function(e,t){return Object(F.jsx)("li",{className:xe.a.msg,children:e},"message-".concat(t))}))})]})},Le=o(15),ye=o.n(Le),Se=o(20),Ne=o.n(Se),Fe=function(e){var t=e.disabled,o=z().performShoppingListCreate,n=Object(r.useState)(""),a=Object(h.a)(n,2),s=a[0],i=a[1],c={"--button-color":T.schemeColorLighter,"--button-text-color":T.textColorPrimary,"--button-border-color":T.borderColor,"--button-hover-color":T.hoverColorLighter};return Object(F.jsx)("div",{className:ye.a.root,style:c,children:Object(F.jsx)("form",{className:ye.a.form,onSubmit:function(e){e.preventDefault();var t=e.nativeEvent.target.children[0].children[0].defaultValue;o(t,(function(){return i("")}))},children:Object(F.jsxs)("fieldset",{className:Ne()(ye.a.fieldset,Object(fe.a)({},ye.a.fieldsetDisabled,t)),disabled:t,children:[Object(F.jsx)("input",{className:ye.a.input,type:"text",name:"title",placeholder:"Title",value:s,onChange:function(e){var t=e.currentTarget.value;i(t)}}),Object(F.jsx)("button",{className:Ne()(ye.a.button,Object(fe.a)({},ye.a.buttonDisabled,t)),type:"submit",children:"Create"})]})})})},we=function(){var e=Object(r.useState)(!1),t=Object(h.a)(e,2),o=t[0],n=t[1],a=Object(r.useRef)(null),s=Object(r.useRef)(null),i=function(e){return s.current&&s.current.contains(e)},c=function(e){"Escape"===e.key&&n(!1)},l=function(e){var t;t=e.target,a.current&&a.current.contains(t)||i(e.target)?i(e.target)&&n(!o):n(!1)};return Object(r.useEffect)((function(){return document.addEventListener("keydown",c,!0),document.addEventListener("click",l,!0),function(){document.removeEventListener("keydown",c,!0),document.removeEventListener("click",l,!0)}})),{componentRef:a,triggerRef:s,isComponentVisible:o,setIsComponentVisible:n}},Ee=o(28),ke=o(30),Pe=o(29),De=o(24),Te=o.n(De),Ie=function(e){var t=e.formRef,o=e.className,n=e.title,a=e.onSubmit,s=function(e){var t=document.createElement("canvas").getContext("2d");return t.font="21px Quattrocento Sans",t.measureText(e).width},i=Object(r.useState)(n),c=Object(h.a)(i,2),l=c[0],d=c[1],u=Object(r.useState)("".concat(s(n),"px")),b=Object(h.a)(u,2),g=b[0],p=b[1],j=Object(r.useRef)(null),m=G(),f={"--scheme-color":m.schemeColor,"--text-color":m.textColorPrimary,"--border-color":m.borderColor,"--icon-hover-color":m.schemeColorLightest};return Object(r.useEffect)((function(){j.current.focus()})),Object(F.jsxs)("form",{className:Ne()(o,Te.a.root),style:f,ref:t,onSubmit:a,children:[Object(F.jsx)("input",{className:Te.a.input,onClick:function(e){return e.stopPropagation()},onChange:function(e){var t=e.currentTarget.value;d(t),p("".concat(s(t),"px"))},type:"text",name:"title",ref:j,style:{width:g},value:l}),Object(F.jsx)("button",{className:Te.a.submit,name:"submit",type:"submit",children:Object(F.jsx)(Ee.a,{className:Te.a.fa,icon:ke.a})})]})},Ae=o(14),Re=o.n(Ae),Ve=function(e){var t=e.description,o=e.quantity,n=e.notes,a=Object(r.useState)(0),s=Object(h.a)(a,2),i=s[0],c=s[1],l=G(),d=l.schemeColorLighter,u=l.hoverColorLighter,b={"--main-color":d,"--title-text-color":l.textColorSecondary,"--border-color":l.borderColor,"--body-background-color":l.schemeColorLightest,"--body-text-color":l.textColorTertiary,"--hover-color":u};return Object(F.jsxs)("div",{className:Re.a.root,style:b,children:[Object(F.jsxs)("div",{className:Re.a.headerContainer,children:[Object(F.jsx)("button",{className:Re.a.button,onClick:function(){c(Date.now)},children:Object(F.jsx)("h4",{className:Re.a.description,children:t})}),Object(F.jsx)("span",{className:Re.a.quantity,children:o})]}),Object(F.jsx)(Pe.a,{toggleEvent:i,collapsed:!0,children:function(e){var t=e.setCollapsibleElement;return Object(F.jsx)("div",{className:Re.a.collapsible,ref:t,children:Object(F.jsx)("div",{className:Re.a.container,children:Object(F.jsx)("p",{className:Re.a.notes,children:n||"No details available"})})})}})]})},Me=o(16),Be=o.n(Me),He=function(e){var t=e.canEdit,o=void 0===t||t,n=e.listId,a=e.title,s=Object(r.useState)(0),i=Object(h.a)(s,2),c=i[0],l=i[1],d=Object(r.useState)(a),u=Object(h.a)(d,2),b=u[0],g=u[1],p=Object(r.useState)(null),j=Object(h.a)(p,2),m=j[0],f=j[1],_=Object(r.useRef)(null),x=we(),O=x.componentRef,v=x.triggerRef,C=x.isComponentVisible,L=x.setIsComponentVisible,y=z(),S=y.shoppingLists,N=y.performShoppingListUpdate,w=a,E=function(e){return function(e){return _.current&&(_.current===e||_.current.contains(e))}(e)&&!function(e){return v.current&&(v.current===e||v.current.contains(e))}(e)&&!function(e){return O.current&&(O.current===e||O.current.contains(e))}(e)},k=G(),P={"--scheme-color":k.schemeColor,"--border-color":k.borderColor,"--text-color":k.textColorPrimary,"--hover-color":k.hoverColor,"--scheme-color-lighter":k.schemeColorLighter,"--scheme-color-lightest":k.schemeColorLightest};return Object(r.useEffect)((function(){if(void 0!==S){var e=S.find((function(e){return e.id===n})).shopping_list_items;f(e)}}),[S]),Object(F.jsxs)("div",{className:Be.a.root,style:P,children:[Object(F.jsx)("div",{className:Be.a.titleContainer,children:Object(F.jsxs)("div",{className:Be.a.trigger,ref:_,onClick:function(e){E(e.target)&&l(Date.now)},children:[o&&Object(F.jsx)("div",{ref:v,children:Object(F.jsx)(Ee.a,{className:Be.a.fa,icon:ke.b})}),o&&C?Object(F.jsx)(Ie,{formRef:O,className:Be.a.form,title:a,onSubmit:function(e){e.preventDefault();var t,o=e.nativeEvent.target.children[0].defaultValue;o&&(!(t=o)||t.match(/^\s*[a-z0-9 ]*\s*$/i)[0]!==t||"Master"===t)||g(o),N(n,o,null,(function(){g(w)})),L(!1)}}):Object(F.jsx)("h3",{className:Be.a.title,children:b})]})}),Object(F.jsx)(Pe.a,{toggleEvent:c,collapsed:!0,children:function(e){var t=e.setCollapsibleElement;return Object(F.jsx)("div",{className:Be.a.collapsible,ref:t,children:m&&m.map((function(e){var t=e.id,o=e.description,r=e.quantity,n=e.notes,s="".concat(a.toLowerCase().replace(" ","-"),"-").concat(t);return Object(F.jsx)(Ve,{description:o,quantity:r,notes:n},s)}))})}})]})},Ue=o(39),qe=o.n(Ue),We=function(){var e=z(),t=e.shoppingLists,o=e.shoppingListLoadingState,r=t&&"done"===o&&t.length>0;t&&"done"===o&&t.length;return r?Object(F.jsx)(F.Fragment,{children:t.map((function(e,t){var o=e.id,r=e.title,n=e.master,a=R[t<R.length?t:t%R.length],s=r.toLowerCase().replace(" ","-");return Object(F.jsx)(M,{colorScheme:a,children:Object(F.jsx)("div",{className:qe.a.shoppingList,children:Object(F.jsx)(He,{canEdit:!n,listId:o,title:r})})},s)}))}):"loading"===o?Object(F.jsx)(ie,{className:qe.a.loading,color:P.schemeColor,height:"15%",width:"15%"}):null},Ge=o(40),Ke=o.n(Ge),ze=function(){var e=z(),t=e.flashProps,o=e.flashVisible,r=e.shoppingListLoadingState,n="loading"===r||"error"===r;return Object(F.jsxs)(ne,{title:"Your Shopping Lists",children:[o&&Object(F.jsx)("div",{className:Ke.a.flash,children:Object(F.jsx)(Ce,Object(d.a)({},t))}),Object(F.jsx)("div",{className:Ke.a.createForm,children:Object(F.jsx)(Fe,{disabled:n})}),Object(F.jsx)(We,{})," "]})},Je=o(25),Ye=o.n(Je),Qe=function(){var e=Object(u.a)([p]),t=Object(h.a)(e,3)[0];return!S()&&t[p]?Object(F.jsx)(l.a,{to:N.dashboard.main}):Object(F.jsx)("div",{className:Ye.a.root,children:Object(F.jsxs)("div",{className:Ye.a.container,children:[Object(F.jsx)("h1",{className:Ye.a.header,children:"Skyrim Inventory Management"}),Object(F.jsx)(i.b,{className:Ye.a.login,to:N.login,children:"Log in with Google"})]})})},Xe=o(51),Ze=o.n(Xe),$e=o(26),et=o.n($e),tt=function(){var e=Object(u.a)([p]),t=Object(h.a)(e,3),o=t[0],n=t[1],a=t[2],s=Object(r.useState)(null),i=Object(h.a)(s,2),c=i[0],d=i[1],m=Object(r.useRef)(!0);return Object(r.useEffect)((function(){return function(){return m.current=!1}})),o[p]&&!S()?Object(F.jsx)(l.a,{to:N.dashboard.main}):Object(F.jsxs)("div",{className:et.a.root,children:[c?Object(F.jsx)("p",{className:et.a.errorMessage,children:c}):null,Object(F.jsx)("div",{className:et.a.container,children:Object(F.jsx)(Ze.a,{className:et.a.button,clientId:b,buttonText:"Log In With Google",onSuccess:function(e){var t=e.tokenId;o[p]!==t&&function(e){var t="".concat(f,"/auth/verify_token");return fetch(t,{headers:_(e)}).then((function(e){if(401===e.status)throw new j;return e}))}(t).then((function(e){204===e.status&&n(p,t)})).catch((function(e){console.error("Error from /auth/verify_token: ",e.message),y((function(){return o[p]&&a(p),Object(F.jsx)(l.a,{to:N.home})}))}))},onFailure:function(e){console.error("Login failure: ",e),o[p]&&a(p),d("Something went wrong! Please try logging in again.")},isSignedIn:!0,redirectUri:"".concat(g).concat(N.dashboard.main)})})]})},ot="Skyrim Inventory Management |",rt=[{pageId:"home",title:"".concat(ot," Home"),description:"Manage your inventory across multiple properties in Skyrim",jsx:Object(F.jsx)(Qe,{}),path:N.home},{pageId:"login",title:"".concat(ot," Login"),description:"Log into Skyrim Inventory Management using your Google account",jsx:Object(F.jsx)(tt,{}),path:N.login},{pageId:"dashboard",title:"".concat(ot," Dashboard"),description:"Skyrim Inventory Management User Dashboard",jsx:Object(F.jsx)(k,{children:Object(F.jsx)(me,{})}),path:N.dashboard.main},{pageId:"shoppingLists",title:"".concat(ot," Manage Shopping Lists"),description:"Manage Skyrim Shopping Lists",jsx:Object(F.jsx)(k,{children:Object(F.jsx)(q,{children:Object(F.jsx)(ze,{})})}),path:N.dashboard.shoppingLists}],nt=function(){return Object(F.jsx)(l.d,{children:rt.map((function(e){var t=e.pageId,o=e.title,r=e.description,n=e.jsx,a=e.path;return Object(F.jsxs)(l.b,{exact:!0,path:a,children:[Object(F.jsxs)(c.a,{children:[Object(F.jsx)("html",{lang:"en"}),Object(F.jsx)("title",{children:o}),Object(F.jsx)("meta",{name:"description",content:r})]}),n]},t)}))})},at=function(){return Object(F.jsx)(i.a,{basename:"",children:Object(F.jsx)(c.b,{children:Object(F.jsx)(nt,{})})})};s.a.render(Object(F.jsx)(n.a.StrictMode,{children:Object(F.jsx)(at,{})}),document.getElementById("root"))},7:function(e,t,o){e.exports={root:"dashboardHeader_root__3lzne",bar:"dashboardHeader_bar__1XEWl",headerContainer:"dashboardHeader_headerContainer__1ZVqS",header:"dashboardHeader_header__cB1mg",headerLink:"dashboardHeader_headerLink__dHHDn",profile:"dashboardHeader_profile__A3WxH",profileText:"dashboardHeader_profileText__1HPKf",textTop:"dashboardHeader_textTop__2UNgU",textBottom:"dashboardHeader_textBottom__1vLtl",avatar:"dashboardHeader_avatar__2BhRu",logoutDropdown:"dashboardHeader_logoutDropdown__37Dm5",hidden:"dashboardHeader_hidden__Fkjhq",bp:"dashboardHeader_bp__2hS3f"}}},[[67,1,2]]]);
//# sourceMappingURL=main.b546a914.chunk.js.map