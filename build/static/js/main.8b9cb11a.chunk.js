(this.webpackJsonpskyrim_inventory_management_frontend=this.webpackJsonpskyrim_inventory_management_frontend||[]).push([[0],{12:function(e,t,o){e.exports={root:"shoppingList_root__2O9FT",trigger:"shoppingList_trigger__WV4fR",form:"shoppingList_form__1GdfA",title:"shoppingList_title__3Gulc",fa:"shoppingList_fa__hRtKq",icon:"shoppingList_icon__3FP5H",collapsible:"shoppingList_collapsible__2Zuq5"}},15:function(e,t,o){e.exports={root:"shoppingListItem_root__3NPoi",headerContainer:"shoppingListItem_headerContainer__hu6Ur",button:"shoppingListItem_button__2k4QA",quantity:"shoppingListItem_quantity__1ebyP",description:"shoppingListItem_description__mnU6z",collapsible:"shoppingListItem_collapsible__xa2wr",notes:"shoppingListItem_notes__8g2fK"}},16:function(e,t,o){e.exports={root:"shoppingListCreateForm_root__iSFdV",button:"shoppingListCreateForm_button__2so-6",fieldset:"shoppingListCreateForm_fieldset__1BLSp",fieldsetDisabled:"shoppingListCreateForm_fieldsetDisabled__2V4n7",input:"shoppingListCreateForm_input__3hAzq",buttonDisabled:"shoppingListCreateForm_buttonDisabled__1USkv"}},22:function(e,t,o){e.exports={root:"dashboardLayout_root__2dfR_",title:"dashboardLayout_title__1yGVn",hr:"dashboardLayout_hr__29GgW",container:"dashboardLayout_container__3AwFx"}},23:function(e,t,o){e.exports={root:"flashMessage_root__2sPxp",content:"flashMessage_content__3iY0s",header:"flashMessage_header__Vx_Jr",messageList:"flashMessage_messageList__3V9SA",msg:"flashMessage_msg__3Wquk"}},25:function(e,t,o){e.exports={root:"shoppingListEditForm_root__rs5qL",input:"shoppingListEditForm_input__2FbCX",submit:"shoppingListEditForm_submit__1FqNJ",fa:"shoppingListEditForm_fa__Bb-dM"}},26:function(e,t,o){e.exports={root:"homePage_root__15tty",container:"homePage_container__3kQJo",header:"homePage_header__3EV45",login:"homePage_login__3ala0"}},27:function(e,t,o){e.exports={root:"loginPage_root__2Vf7z",errorMessage:"loginPage_errorMessage__8uTVC",container:"loginPage_container__2xdLK",button:"loginPage_button__1pDsX"}},31:function(e,t,o){e.exports={button:"logoutDropdown_button__3hRUK",body:"logoutDropdown_body__NiLPw",googleLogout:"logoutDropdown_googleLogout__J9YSG"}},37:function(e,t,o){e.exports={root:"navigationMosaic_root__2CDUx",card:"navigationMosaic_card__3hEln"}},38:function(e,t,o){e.exports={root:"dashboardPage_root__oVxx1",loading:"dashboardPage_loading__2vZsl"}},39:function(e,t,o){e.exports={noLists:"shoppingListPageContent_noLists__3xnMI",shoppingList:"shoppingListPageContent_shoppingList__S3gTj",loading:"shoppingListPageContent_loading__2EI8i",error:"shoppingListPageContent_error__1dyyw"}},40:function(e,t,o){e.exports={createForm:"shoppingListPage_createForm__c7_90",flash:"shoppingListPage_flash__1mBKN"}},48:function(e,t,o){e.exports={root:"navigationCard_root__1-FD3"}},59:function(e,t,o){},68:function(e,t,o){"use strict";o.r(t);var r=o(1),n=o.n(r),s=o(43),a=o.n(s),i=(o(59),o(10)),c=o(28),l=o(4),d=o(14),h=o(3),u=o(69),b="891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com",p="https://sim.danascheider.com",g="_sim_google_session";function f(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"401 Unauthorized";this.message=e,this.code=401,this.name="AuthorizationError",this.stack=(new Error).stack}f.prototype=new Error;var m,j="https://sim-api.danascheider.com",_=function(e){return{Authorization:"Bearer ".concat(e)}},x={"Content-Type":"application/json"},O=function(e){return Object(d.a)(Object(d.a)({},_(e)),x)},v=function(e,t){var o="".concat(j,"/shopping_lists"),r=JSON.stringify({shopping_list:t});return fetch(o,{method:"POST",headers:O(e),body:r}).then((function(e){if(401===e.status)throw new f;return e}))},y=function(e,t,o){var r="".concat(j,"/shopping_lists/").concat(t),n=JSON.stringify({id:t,shopping_list:o});return fetch(r,{method:"PATCH",headers:O(e),body:n}).then((function(e){if(401===e.status)throw new f;return e}))},C=function(e,t){var o="".concat(j,"/shopping_lists/").concat(t);return fetch(o,{method:"DELETE",headers:_(e)}).then((function(e){if(401===e.status)throw new f;return e}))},L=function(e){console.error("Error signing out: ",e.message)},S=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:L;if(window.gapi&&window.gapi.auth2){var o=window.gapi.auth2.getAuthInstance();null!==o?o.then((function(){return o.signOut()})).then(e,t):e()}e()},w=function(){return!!Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).STORYBOOK},F={home:"/",login:"/login",dashboard:{main:"/dashboard",shoppingLists:"/dashboard/shopping_lists"}},N=o(0),E="done",k=Object(r.createContext)(),P=function(e){var t=e.children,o=e.overrideValue,n=void 0===o?{}:o,s=Object(u.a)([g]),a=Object(h.a)(s,3),i=a[0],c=a[2],b=Object(r.useState)(n.profileData),p=Object(h.a)(b,2),m=p[0],x=p[1],O=Object(r.useState)(n.shouldRedirectTo),v=Object(h.a)(O,2),y=v[0],C=v[1],L=Object(r.useState)(n.profileLoadState||"loading"),P=Object(h.a)(L,2),D=P[0],T=P[1],I=Object(r.useRef)(!0),A=function(){return n.removeSessionCookie||c(g)},R=Object(d.a)({token:i[g],profileData:m,removeSessionCookie:A,profileLoadState:D,setShouldRedirectTo:C},n),V=!n.profileData&&i[g];return Object(r.useEffect)((function(){V?function(e){var t="".concat(j,"/users/current");return fetch(t,{headers:_(e)}).then((function(e){if(401===e.status)throw new f;return e}))}(i[g]).then((function(e){return e.json()})).then((function(e){x(e),n.profileLoadState||T(E)})).catch((function(e){console.error("Error returned while fetching profile data: ",e.message),S((function(){i[g]&&A(),C(F.login),I.current=!1}))})):i[g]||w()?w()&&!n.profileLoadState&&T(E):S((function(){C(F.login),I.current=!1}))}),[]),Object(r.useEffect)((function(){return function(){I.current=!1}})),Object(N.jsx)(k.Provider,{value:R,children:y?Object(N.jsx)(l.a,{to:y}):t})},D={schemeColor:"#FFBF00",hoverColor:"#E5AB00",borderColor:"#CC9800",textColorPrimary:"#000000",schemeColorLighter:"#FFCB32",hoverColorLighter:"#FFC519",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#FFF2CC"},T={schemeColor:"#E83F6F",hoverColor:"#D03863",borderColor:"#B93258",textColorPrimary:"#FFFFFF",schemeColorLighter:"#EC658B",hoverColorLighter:"#EA527D",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#FAD8E2"},I={schemeColor:"#2274A5",hoverColor:"#1E6894",borderColor:"#1B5C84",textColorPrimary:"#FFFFFF",schemeColorLighter:"#4E8FB7",hoverColorLighter:"#3881AE",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#D2E3ED"},A={schemeColor:"#00A323",hoverColor:"#00921F",borderColor:"#00821C",textColorPrimary:"#FFFFFF",schemeColorLighter:"#32B54E",hoverColorLighter:"#19AC38",textColorSecondary:"#FFFFFF",textColorTertiary:"#000000",schemeColorLightest:"#CCECD3"},R={schemeColor:"#20E2E9",hoverColor:"#1CCBD1",borderColor:"#19B4BA",textColorPrimary:"#000000",schemeColorLighter:"#62EAEF",hoverColorLighter:"#4CE7ED",textColorSecondary:"#000000",textColorTertiary:"#000000",schemeColorLightest:"#D2F9FA"},V=[D,T,I,A,R],M=Object(r.createContext)(),B=function(e){var t=e.colorScheme,o=e.children;return Object(N.jsx)(M.Provider,{value:t,children:o})},H="done",U="error",q=Object(r.createContext)(),W=function(e){var t=e.children,o=e.overrideValue,n=void 0===o?{}:o,s=Object(r.useState)(n.shoppingLists),a=Object(h.a)(s,2),i=a[0],c=a[1],l=Object(r.useState)(!1),u=Object(h.a)(l,2),b=u[0],p=u[1],g=Object(r.useState)({}),m=Object(h.a)(g,2),x=m[0],O=m[1],L=Object(r.useState)("loading"),w=Object(h.a)(L,2),E=w[0],k=w[1],P=K(),D=P.token,T=P.setShouldRedirectTo,I=P.removeSessionCookie,A=Object(r.useRef)(!0),R=Object(d.a)({shoppingLists:i,shoppingListLoadingState:E,performShoppingListUpdate:function(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;y(D,e,{title:t}).then((function(t){switch(t.status){case 200:case 422:return t.json();case 404:return O({type:"error",message:"Shopping list could not be updated. Try refreshing to fix this problem."}),!n.setFlashVisible&&p(!0),null;default:throw Error("Something unexpected went wrong while updating list ".concat(e))}})).then((function(t){if(t&&!t.errors){var s=i.map((function(o){return o.id===e?t:o}));c(s),void 0===n.shoppingListLoadingState&&k(H),o&&o()}else t&&t.errors&&t.errors.title?(O({type:"error",header:"".concat(t.errors.title.length," error(s) prevented your changes from being saved:"),message:t.errors.title.map((function(e){return"Title ".concat(e)}))}),void 0===n.setFlashVisible&&p(!0),void 0===n.shoppingListLoadingState&&k(H),r&&r()):t&&t.errors?(O({type:"error",message:"We couldn't update your list and we're not sure what went wrong. We're sorry! Please refresh the page and try again."}),void 0===n.setFlashVisible&&p(!0),void 0===n.setShoppingListLoadingState&&k(H),r&&r()):r&&r()})).catch((function(t){if(console.error("Error updating shopping list ".concat(e,": "),t.message),401===t.code)return S((function(){D&&I(),T(F.login),A.current=!1}));void 0===n.shoppingListLoadingState&&k(U),r&&r()}))},performShoppingListCreate:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;v(D,{title:e}).then((function(e){return e.json()})).then((function(e){if(2===e.length)c(e),O({type:"success",message:"Success! Your list was created, along with your new master shopping list."}),p(!0),t&&t();else if(Array.isArray(e)){var o=i;o.splice(1,0,e[0]),c(o),O({type:"success",message:"Success! Your list was created."}),p(!0),t&&t()}else{if(!(e&&e.errors&&e.errors.title))throw e&&e.message?(console.error("Error returned from the SIM API: ",e.message),new Error("There was an unexpected error creating your new list. Unfortunately, we don't know more than that yet. We're sorry!")):new Error("There was an unexpected error creating your new list. Unfortunately we don't know more than that yet. We're sorry!");O({type:"error",header:"".concat(e.errors.title.length," error(s) prevented your shopping list from being created:"),message:e.errors.title.map((function(e){return"Title ".concat(e)}))}),p(!0),t&&t()}})).catch((function(e){console.error("Error creating shopping list: ",e.message),401===e.code?S((function(){D&&I(),T(F.login),A.current=!1})):(O({type:"error",message:e.message}),p(!0),o&&o())}))},performShoppingListDelete:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;C(D,e).then((function(e){if(405===e.status)throw new Error("You can't delete your master list as it is managed automatically.");if(404===e.status)throw new Error("Shopping list could not be destroyed. Try refreshing to fix this problem.");return 204===e.status?null:e.json()})).then((function(o){if(o){var r=i.map((function(e){return!0===e.master?o.master_list:e})).filter((function(t){return t.id!==e}));c(r),O({type:"success",message:"Your shopping list has been deleted."}),p(!0),t&&t()}else c([]),O({type:"success",header:"Your shopping list has been deleted.",message:"Since it was your last list, your master list has been deleted as well."}),p(!0),t&&t()})).catch((function(e){401===e.code?S((function(){D&&I(),T(F.login),A.current=!1})):(O({type:"error",message:e.message}),p(!0),o&&o())}))},flashProps:x,flashVisible:b,setFlashProps:O,setFlashVisible:p},n);return Object(r.useEffect)((function(){D&&!n.shoppingLists&&function(e){var t="".concat(j,"/shopping_lists");return fetch(t,{headers:_(e)}).then((function(e){if(401===e.status)throw new f;return e}))}(D).then((function(e){return e.json()})).then((function(e){if(!e)throw new Error("No shopping list data returned from the SIM API");c(e),void 0===n.shoppingListLoadingState&&k(H)})).catch((function(e){console.error("Error fetching shopping lists: ",e.message),401===e.code?S((function(){D&&I(),T(F.home),A.current=!1})):(!n.shoppingListLoadingState&&k(U),O({type:"error",message:"There was an error loading your lists. It may have been on our end. We're sorry!"}),p(!0))}))}),[]),Object(r.useEffect)((function(){return function(){A.current=!1}})),Object(N.jsx)(q.Provider,{value:R,children:t})},Y=function(e,t){var o=Object(r.useContext)(e);if(!o)throw new Error(t);return o},G=function(){return Y(M,"useColorScheme must be used within a ColorProvider")},K=function(){return Y(k,"useDashboardContext must be used within a DashboardProvider")},z=function(){return Y(q,"useShoppingListContext must be used within a ShoppingListProvider")},J=o.p+"static/media/googleIcon.9432a66b.svg",Q=o(31),X=o.n(Q),Z=function(e){var t=e.className,o=e.logOutUser;return Object(N.jsx)("div",{className:t,children:Object(N.jsx)("button",{className:X.a.button,onClick:o,children:Object(N.jsx)("div",{className:X.a.body,children:Object(N.jsxs)("div",{className:X.a.googleLogout,children:[Object(N.jsx)("img",{src:J,alt:"Google logo"}),"Log Out With Google"]})})})})},$=o.p+"static/media/anonymousAvatar.36d1acc1.jpg",ee=o(7),te=o.n(ee),oe=function(){var e=K(),t=e.token,o=e.profileData,n=e.removeSessionCookie,s=e.setShouldRedirectTo,a=Object(r.useState)(!1),c=Object(h.a)(a,2),l=c[0],d=c[1],u=Object(r.useRef)(!0);return Object(r.useEffect)((function(){return function(){return u.current=!1}}),[]),Object(N.jsx)("div",{className:te.a.root,children:Object(N.jsxs)("div",{className:te.a.bar,children:[Object(N.jsx)("span",{className:te.a.headerContainer,children:Object(N.jsx)("h1",{className:te.a.header,children:Object(N.jsxs)(i.b,{className:te.a.headerLink,to:F.dashboard.main,children:["Skyrim Inventory",Object(N.jsx)("br",{className:te.a.bp})," Management"]})})}),o?Object(N.jsxs)("button",{className:te.a.profile,onClick:function(){return d(!l)},children:[Object(N.jsxs)("div",{className:te.a.profileText,children:[Object(N.jsx)("p",{className:te.a.textTop,children:o.name}),Object(N.jsx)("p",{className:te.a.textBottom,children:o.email})]}),Object(N.jsx)("img",{className:te.a.avatar,src:o.image_url||$,alt:"User avatar",referrerPolicy:"no-referrer"})]}):null,Object(N.jsx)(Z,{className:l?te.a.logoutDropdown:te.a.hidden,logOutUser:function(e){e.preventDefault(),d(!1),S((function(){t&&n(),s(F.home),u.current=!1}))}})]})})},re=o(22),ne=o.n(re),se=function(e){var t=e.title,o=e.children;return Object(N.jsxs)("div",{className:ne.a.root,children:[Object(N.jsxs)("div",{className:ne.a.container,children:[t?Object(N.jsxs)(N.Fragment,{children:[Object(N.jsx)("h2",{className:ne.a.title,children:t}),Object(N.jsx)("hr",{className:ne.a.hr})]}):null,o]}),Object(N.jsx)(oe,{})]})},ae=o(47),ie=o.n(ae),ce=function(e){var t=e.className,o=e.type,r=void 0===o?"bubbles":o,n=e.color,s=e.height,a=e.width;return Object(N.jsx)(ie.a,{className:t,type:r,color:n,height:s,width:a})},le=o(48),de=o.n(le),he=function(e){var t=e.href,o=e.children,r=G(),n={"--background-color":r.schemeColor,"--hover-color":r.hoverColor,"--text-color":r.textColorPrimary};return Object(N.jsx)(i.b,{className:de.a.root,to:t,style:n,children:o})},ue=o(37),be=o.n(ue),pe=function(e){var t=e.cardArray;return Object(N.jsx)("div",{className:be.a.root,children:t.map((function(e){var t=e.colorScheme,o=e.href,r=e.children,n=e.key;return Object(N.jsx)("div",{className:be.a.card,children:Object(N.jsx)(B,{colorScheme:t,children:Object(N.jsx)(he,{href:o,children:r})})},n)}))})},ge=o(38),fe=o.n(ge),me=[{colorScheme:D,href:"#",children:"Your Games",key:"your-games"},{colorScheme:T,href:F.dashboard.shoppingLists,children:"Your Shopping Lists",key:"your-shopping-lists"},{colorScheme:I,href:"#",children:"Nav Link 3",key:"nav-link-3"},{colorScheme:A,href:"#",children:"Nav Link 4",key:"nav-link-4"},{colorScheme:R,href:"#",children:"Nav Link 5",key:"nav-link-5"}],je=function(){var e=K(),t=e.token,o=e.profileLoadState;return t?Object(N.jsx)(se,{children:"done"===o?Object(N.jsx)("div",{className:fe.a.root,children:Object(N.jsx)(pe,{cardArray:me})}):Object(N.jsx)(ce,{className:fe.a.loading,type:"bubbles",color:D.schemeColor,height:"15%",width:"15%"})}):Object(N.jsx)(l.a,{to:F.login})},_e=o(13),xe=o(23),Oe=o.n(xe),ve="info",ye=(m={},Object(_e.a)(m,"success",{body:"#e5f2e5",border:"#b2d8b2",text:"#329932"}),Object(_e.a)(m,ve,{body:"#cce5ff",border:"#b3d8ff",text:"#4e6d8e"}),Object(_e.a)(m,"error",{body:"#ffcccc",border:"#ff9999",text:"#cc0000"}),Object(_e.a)(m,"warning",{body:"#fefde4",border:"#fdf797",text:"#b0a723"}),m),Ce=function(e){var t=e.type,o=void 0===t?ve:t,r=e.header,n=e.message,s={"--body-color":ye[o].body,"--border-color":ye[o].border,"--text-color":ye[o].text};return Object(N.jsxs)("div",{className:Oe.a.root,style:s,children:[r&&Object(N.jsx)("p",{className:Oe.a.header,children:r}),"string"===typeof n?n:Object(N.jsx)("ul",{className:Oe.a.messageList,children:n.map((function(e,t){return Object(N.jsx)("li",{className:Oe.a.msg,children:e},"message-".concat(t))}))})]})},Le=o(16),Se=o.n(Le),we=o(20),Fe=o.n(we),Ne=function(e){var t=e.disabled,o=z().performShoppingListCreate,n=Object(r.useState)(""),s=Object(h.a)(n,2),a=s[0],i=s[1],c={"--button-color":I.schemeColorLighter,"--button-text-color":I.textColorPrimary,"--button-border-color":I.borderColor,"--button-hover-color":I.hoverColorLighter};return Object(N.jsx)("div",{className:Se.a.root,style:c,children:Object(N.jsx)("form",{className:Se.a.form,onSubmit:function(e){e.preventDefault();var t=e.nativeEvent.target.children[0].children[0].defaultValue;o(t,(function(){return i("")}))},children:Object(N.jsxs)("fieldset",{className:Fe()(Se.a.fieldset,Object(_e.a)({},Se.a.fieldsetDisabled,t)),disabled:t,children:[Object(N.jsx)("input",{className:Se.a.input,type:"text",name:"title",placeholder:"Title",value:a,onChange:function(e){var t=e.currentTarget.value;i(t)}}),Object(N.jsx)("button",{className:Fe()(Se.a.button,Object(_e.a)({},Se.a.buttonDisabled,t)),type:"submit",children:"Create"})]})})})},Ee=function(){var e=Object(r.useState)(!1),t=Object(h.a)(e,2),o=t[0],n=t[1],s=Object(r.useRef)(null),a=Object(r.useRef)(null),i=function(e){return a.current&&a.current.contains(e)},c=function(e){"Escape"===e.key&&n(!1)},l=function(e){var t;t=e.target,s.current&&s.current.contains(t)||i(e.target)?i(e.target)&&n(!o):n(!1)};return Object(r.useEffect)((function(){return document.addEventListener("keydown",c,!0),document.addEventListener("click",l,!0),function(){document.removeEventListener("keydown",c,!0),document.removeEventListener("click",l,!0)}})),{componentRef:s,triggerRef:a,isComponentVisible:o,setIsComponentVisible:n}},ke=o(21),Pe=o(30),De=o(51),Te=o(29),Ie=o(25),Ae=o.n(Ie),Re=function(e){var t=e.formRef,o=e.className,n=e.title,s=e.onSubmit,a=function(e){var t=document.createElement("canvas").getContext("2d");return t.font="21px Quattrocento Sans",t.measureText(e).width},i=Object(r.useState)(n),c=Object(h.a)(i,2),l=c[0],d=c[1],u=Object(r.useState)("".concat(a(n),"px")),b=Object(h.a)(u,2),p=b[0],g=b[1],f=Object(r.useRef)(null),m=G(),j={"--scheme-color":m.schemeColor,"--text-color":m.textColorPrimary,"--border-color":m.borderColor,"--icon-hover-color":m.schemeColorLightest};return Object(r.useEffect)((function(){f.current.focus()})),Object(N.jsxs)("form",{className:Fe()(o,Ae.a.root),style:j,ref:t,onSubmit:s,children:[Object(N.jsx)("input",{className:Ae.a.input,onClick:function(e){return e.stopPropagation()},onChange:function(e){var t=e.currentTarget.value;d(t),g("".concat(a(t),"px"))},type:"text",name:"title",ref:f,style:{width:p},value:l}),Object(N.jsx)("button",{className:Ae.a.submit,name:"submit",type:"submit",children:Object(N.jsx)(ke.a,{className:Ae.a.fa,icon:Pe.a})})]})},Ve=o(15),Me=o.n(Ve),Be=function(e){var t=e.description,o=e.quantity,n=e.notes,s=Object(r.useState)(0),a=Object(h.a)(s,2),i=a[0],c=a[1],l=G(),d=l.schemeColorLighter,u=l.hoverColorLighter,b={"--main-color":d,"--title-text-color":l.textColorSecondary,"--border-color":l.borderColor,"--body-background-color":l.schemeColorLightest,"--body-text-color":l.textColorTertiary,"--hover-color":u};return Object(N.jsxs)("div",{className:Me.a.root,style:b,children:[Object(N.jsxs)("div",{className:Me.a.headerContainer,children:[Object(N.jsx)("button",{className:Me.a.button,onClick:function(){c(Date.now)},children:Object(N.jsx)("h4",{className:Me.a.description,children:t})}),Object(N.jsx)("span",{className:Me.a.quantity,children:o})]}),Object(N.jsx)(Te.a,{toggleEvent:i,collapsed:!0,children:function(e){var t=e.setCollapsibleElement;return Object(N.jsx)("div",{className:Me.a.collapsible,ref:t,children:Object(N.jsx)("div",{className:Me.a.container,children:Object(N.jsx)("p",{className:Me.a.notes,children:n||"No details available"})})})}})]})},He=o(12),Ue=o.n(He),qe=function(e){var t=e.canEdit,o=void 0===t||t,n=e.listId,s=e.title,a=Object(r.useState)(0),i=Object(h.a)(a,2),c=i[0],l=i[1],d=Object(r.useState)(s),u=Object(h.a)(d,2),b=u[0],p=u[1],g=Object(r.useState)(null),f=Object(h.a)(g,2),m=f[0],j=f[1],_=Object(r.useRef)(null),x=Object(r.useRef)(null),O=Object(r.useRef)(!0),v=Ee(),y=v.componentRef,C=v.triggerRef,L=v.isComponentVisible,S=v.setIsComponentVisible,w=z(),F=w.shoppingLists,E=w.performShoppingListUpdate,k=w.performShoppingListDelete,P=w.setFlashProps,D=w.setFlashVisible,T=s,I=function(e){return function(e){return _.current&&(_.current===e||_.current.contains(e))}(e)&&!function(e){return C.current&&(C.current===e||C.current.contains(e))}(e)&&!function(e){return y.current&&(y.current===e||y.current.contains(e))}(e)&&!function(e){return x.current&&(x.current===e||x.current.contains(e))}(e)},A=G(),R={"--scheme-color":A.schemeColor,"--border-color":A.borderColor,"--text-color":A.textColorPrimary,"--hover-color":A.hoverColor,"--scheme-color-lighter":A.schemeColorLighter,"--scheme-color-lightest":A.schemeColorLightest};return Object(r.useEffect)((function(){if(void 0!==F){var e=F.find((function(e){return e.id===n})).shopping_list_items;j(e)}}),[F]),Object(r.useEffect)((function(){return function(){return O.current=!1}})),Object(N.jsxs)("div",{className:Ue.a.root,style:R,children:[Object(N.jsx)("div",{className:Ue.a.titleContainer,children:Object(N.jsxs)("div",{className:Ue.a.trigger,ref:_,onClick:function(e){I(e.target)&&l(Date.now)},children:[o&&Object(N.jsxs)(N.Fragment,{children:[Object(N.jsx)("div",{className:Ue.a.icon,ref:x,onClick:function(e){e.preventDefault(),window.confirm('Are you sure you want to delete the list "'.concat(s,'"? You will also lose any list items on the list. This action cannot be undone.'))?k(n,(function(){O.current=!1})):(P({type:"info",message:"Your list was not deleted."}),D(!0))},children:Object(N.jsx)(ke.a,{className:Ue.a.fa,icon:De.a})}),Object(N.jsx)("div",{className:Ue.a.icon,ref:C,children:Object(N.jsx)(ke.a,{className:Ue.a.fa,icon:Pe.b})})]}),o&&L?Object(N.jsx)(Re,{formRef:y,className:Ue.a.form,title:s,onSubmit:function(e){e.preventDefault();var t,o=e.nativeEvent.target.children[0].defaultValue;o&&(!(t=o)||t.match(/^\s*[a-z0-9 ]*\s*$/i)[0]!==t||"Master"===t)||p(o),E(n,o,null,(function(){p(T)})),S(!1)}}):Object(N.jsx)("h3",{className:Ue.a.title,children:b})]})}),Object(N.jsx)(Te.a,{toggleEvent:c,collapsed:!0,children:function(e){var t=e.setCollapsibleElement;return Object(N.jsx)("div",{className:Ue.a.collapsible,ref:t,children:m&&m.map((function(e){var t=e.id,o=e.description,r=e.quantity,n=e.notes,a="".concat(s.toLowerCase().replace(" ","-"),"-").concat(t);return Object(N.jsx)(Be,{description:o,quantity:r,notes:n},a)}))})}})]})},We=o(39),Ye=o.n(We),Ge=function(){var e=z(),t=e.shoppingLists,o=e.shoppingListLoadingState;return t&&"done"===o&&t.length>0?Object(N.jsx)(N.Fragment,{children:t.map((function(e,t){var o=e.id,r=e.title,n=e.master,s=V[t<V.length?t:t%V.length],a=r.toLowerCase().replace(" ","-");return Object(N.jsx)(B,{colorScheme:s,children:Object(N.jsx)("div",{className:Ye.a.shoppingList,children:Object(N.jsx)(qe,{canEdit:!n,listId:o,title:r})})},a)}))}):"loading"===o?Object(N.jsx)(ce,{className:Ye.a.loading,color:D.schemeColor,height:"15%",width:"15%"}):null},Ke=o(40),ze=o.n(Ke),Je=function(){var e=z(),t=e.flashProps,o=e.flashVisible,r=e.shoppingListLoadingState,n="loading"===r||"error"===r;return Object(N.jsxs)(se,{title:"Your Shopping Lists",children:[o&&Object(N.jsx)("div",{className:ze.a.flash,children:Object(N.jsx)(Ce,Object(d.a)({},t))}),Object(N.jsx)("div",{className:ze.a.createForm,children:Object(N.jsx)(Ne,{disabled:n})}),Object(N.jsx)(Ge,{})," "]})},Qe=o(26),Xe=o.n(Qe),Ze=function(){var e=Object(u.a)([g]),t=Object(h.a)(e,3)[0];return!w()&&t[g]?Object(N.jsx)(l.a,{to:F.dashboard.main}):Object(N.jsx)("div",{className:Xe.a.root,children:Object(N.jsxs)("div",{className:Xe.a.container,children:[Object(N.jsx)("h1",{className:Xe.a.header,children:"Skyrim Inventory Management"}),Object(N.jsx)(i.b,{className:Xe.a.login,to:F.login,children:"Log in with Google"})]})})},$e=o(52),et=o.n($e),tt=o(27),ot=o.n(tt),rt=function(){var e=Object(u.a)([g]),t=Object(h.a)(e,3),o=t[0],n=t[1],s=t[2],a=Object(r.useState)(null),i=Object(h.a)(a,2),c=i[0],d=i[1];return o[g]&&!w()?Object(N.jsx)(l.a,{to:F.dashboard.main}):Object(N.jsxs)("div",{className:ot.a.root,children:[c?Object(N.jsx)("p",{className:ot.a.errorMessage,children:c}):null,Object(N.jsx)("div",{className:ot.a.container,children:Object(N.jsx)(et.a,{className:ot.a.button,clientId:b,buttonText:"Log In With Google",onSuccess:function(e){var t=e.tokenId;o[g]!==t&&function(e){var t="".concat(j,"/auth/verify_token");return fetch(t,{headers:_(e)}).then((function(e){if(401===e.status)throw new f;return e}))}(t).then((function(e){204===e.status&&n(g,t)})).catch((function(e){console.error("Error from /auth/verify_token: ",e.message),S((function(){return o[g]&&s(g),Object(N.jsx)(l.a,{to:F.home})}))}))},onFailure:function(e){console.error("Login failure: ",e),o[g]&&s(g),d("Something went wrong! Please try logging in again.")},isSignedIn:!0,redirectUri:"".concat(p).concat(F.dashboard.main)})})]})},nt="Skyrim Inventory Management |",st=[{pageId:"home",title:"".concat(nt," Home"),description:"Manage your inventory across multiple properties in Skyrim",jsx:Object(N.jsx)(Ze,{}),path:F.home},{pageId:"login",title:"".concat(nt," Login"),description:"Log into Skyrim Inventory Management using your Google account",jsx:Object(N.jsx)(rt,{}),path:F.login},{pageId:"dashboard",title:"".concat(nt," Dashboard"),description:"Skyrim Inventory Management User Dashboard",jsx:Object(N.jsx)(P,{children:Object(N.jsx)(je,{})}),path:F.dashboard.main},{pageId:"shoppingLists",title:"".concat(nt," Manage Shopping Lists"),description:"Manage Skyrim Shopping Lists",jsx:Object(N.jsx)(P,{children:Object(N.jsx)(W,{children:Object(N.jsx)(Je,{})})}),path:F.dashboard.shoppingLists}],at=function(){return Object(N.jsx)(l.d,{children:st.map((function(e){var t=e.pageId,o=e.title,r=e.description,n=e.jsx,s=e.path;return Object(N.jsxs)(l.b,{exact:!0,path:s,children:[Object(N.jsxs)(c.a,{children:[Object(N.jsx)("html",{lang:"en"}),Object(N.jsx)("title",{children:o}),Object(N.jsx)("meta",{name:"description",content:r})]}),n]},t)}))})},it=function(){return Object(N.jsx)(i.a,{basename:"",children:Object(N.jsx)(c.b,{children:Object(N.jsx)(at,{})})})};a.a.render(Object(N.jsx)(n.a.StrictMode,{children:Object(N.jsx)(it,{})}),document.getElementById("root"))},7:function(e,t,o){e.exports={root:"dashboardHeader_root__3lzne",bar:"dashboardHeader_bar__1XEWl",headerContainer:"dashboardHeader_headerContainer__1ZVqS",header:"dashboardHeader_header__cB1mg",headerLink:"dashboardHeader_headerLink__dHHDn",profile:"dashboardHeader_profile__A3WxH",profileText:"dashboardHeader_profileText__1HPKf",textTop:"dashboardHeader_textTop__2UNgU",textBottom:"dashboardHeader_textBottom__1vLtl",avatar:"dashboardHeader_avatar__2BhRu",logoutDropdown:"dashboardHeader_logoutDropdown__37Dm5",hidden:"dashboardHeader_hidden__Fkjhq",bp:"dashboardHeader_bp__2hS3f"}}},[[68,1,2]]]);
//# sourceMappingURL=main.8b9cb11a.chunk.js.map