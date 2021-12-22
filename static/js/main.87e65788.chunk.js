(this["webpackJsonparea-tool"]=this["webpackJsonparea-tool"]||[]).push([[0],{38:function(t,e,n){},39:function(t,e,n){},40:function(t,e,n){},42:function(t,e,n){},43:function(t,e,n){},44:function(t,e,n){},45:function(t,e,n){},51:function(t,e,n){},52:function(t,e,n){},53:function(t,e,n){"use strict";n.r(e);var r=n(1),i=n.n(r),c=n(27),a=n.n(c),o=(n(38),n(6)),l=n(3),u=(n(39),n(40),n(0));function s(t){var e=t.source,n=t.setVideo,i=t.setSlider,c=(t.value,Object(r.useRef)(null));Object(r.useEffect)((function(){if(c.current&&e){c.current.src=e,n(c.current);!function t(){setTimeout((function(){var e;(null===(e=c.current)||void 0===e?void 0:e.duration)?a(1):t()}),10)}()}}),[e]);var a=function(t){if(c.current&&e&&t){var n=t<1?1:t>100?100:t;c.current.currentTime=n/100*c.current.duration,i(n)}};return Object(u.jsxs)("div",{className:"VideoCanvas",children:[Object(u.jsx)("input",{className:"slider",type:"range",min:"1",max:"100",onChange:function(t){a(+t.target.value)}}),Object(u.jsx)("video",{ref:c,hidden:!0})]})}n(42);var d=function(t){var e=t.setFile,n=t.accept_types,i=void 0===n?"":n,c=Object(r.useRef)(null);return Object(u.jsxs)("div",{className:"FilePicker",children:[Object(u.jsx)("button",{className:"btn contained primary",onClick:function(){var t;return null===(t=c.current)||void 0===t?void 0:t.click()},children:"Select Video"}),Object(u.jsx)("input",{hidden:!0,ref:c,type:"file",accept:i,onChange:function(t){var n,r,i;return e(null!==(n=null===(r=c.current)||void 0===r||null===(i=r.files)||void 0===i?void 0:i.item(0))&&void 0!==n?n:null)}})]})},f=n(7),b=n(28),h=n(29);function j(t,e){for(var n=!1,r=0;r<e.length;r++){var i=[e[r],e[(r+1)%e.length]];(i[0][1]<=t[1]&&i[1][1]>=t[1]||i[1][1]<=t[1]&&i[0][1]>=t[1])&&t[0]<(i[0][0]-i[1][0])*(t[1]-i[1][1])/(i[0][1]-i[1][1])+i[1][0]&&(n=!n)}return n}function v(t,e){return Math.hypot(t[0]-e[0],t[1]-e[1])}function O(t,e){var n=k(e[1],e[0]),r=v(e[0],e[1]),i=y(n,1/r),c=p(k(t,e[0]),i);return c<0||c>r?null:g(e[0],y(i,c))}function p(t,e){return t[0]*e[0]+t[1]*e[1]}function g(t,e){return[t[0]+e[0],t[1]+e[1]]}function x(t){return[-t[0],-t[1]]}function k(t,e){return g(t,x(e))}function y(t,e){return[t[0]*e,t[1]*e]}function m(t,e){var n=y(e,1/function(t){return v([0,0],t)}(e));return function(t,e,n){return g(y(n,t[0]),y(e,t[1]))}(t,n,[n[1],-n[0]])}function S(t){return y(t.reduce((function(t,e){return g(e,t)})),1/t.length)}var w,C=function(){function t(e){Object(b.a)(this,t),this.id=void 0,this.shape=void 0,this.isCarWalkable=!0,this.direction={left:!1,up:!1,right:!1,down:!1},this.isParking=!1,this.stop=null,this.isSelected=!1,this.id=t.newId(),this.shape=null!==e&&void 0!==e?e:[[-1,-1],[-1,-1],[-1,-1],[-1,-1]]}return Object(h.a)(t,[{key:"order",value:function(){if(function(t){var e=t[0],n=t[1],r=t[3],i=t[2],c=[-(e[1]-i[1]),e[0]-i[0]];if(p(k(n,i),c)<p(k(r,i),c)){var a=t[1];return t[1]=t[3],t[3]=a,!0}return!1}(this.shape)){var t=this.direction.left;this.direction.left=this.direction.up,this.direction.up=t,t=this.direction.right,this.direction.right=this.direction.down,this.direction.down=t}}},{key:"toAreaDictionary",value:function(){var t,e;this.order();t=this.direction;return{id:this.id,points:{lu:this.shape[0].map((function(t){return Math.round(t)})),ru:this.shape[1].map((function(t){return Math.round(t)})),rb:this.shape[2].map((function(t){return Math.round(t)})),lb:this.shape[3].map((function(t){return Math.round(t)}))},carWalk:this.isCarWalkable,dir:Object(f.a)({},this.direction),parking:this.isParking,stop:"".concat(null!==(e=this.stop)&&void 0!==e?e:"None"),ref:this}}},{key:"fromAreaDictionary",value:function(t){this.shape=Object.values(t.points),this.isCarWalkable=t.carWalk;return this.direction=Object(f.a)({},t.dir),this.isParking=t.parking,this.stop=t.stop,t.ref=this,this}}],[{key:"newId",value:function(){return t.counter++}}]),t}();C.counter=0,function(t){t[t.ADD=0]="ADD",t[t.SELECT=1]="SELECT",t[t.SET_DIRECTIONS=2]="SET_DIRECTIONS",t[t.TOGGLE_TYPE=3]="TOGGLE_TYPE"}(w||(w={}));n(43);function E(t){var e=t.value,n=t.onSelect,r=t.onAdd,i=t.onSetDirections,c=t.onToggleType;return Object(u.jsxs)("div",{className:"ToolSelector",children:[r?Object(u.jsx)("button",{className:"btn secondary ".concat(e===w.ADD?"contained":"outlined"),onClick:r,children:"ADD"}):"",n?Object(u.jsx)("button",{className:"btn secondary ".concat(e===w.SELECT?"contained":"outlined"),onClick:n,children:"SELECT"}):"",i?Object(u.jsx)("button",{className:"btn secondary ".concat(e===w.SET_DIRECTIONS?"contained":"outlined"),onClick:i,children:"DIRECTIONS"}):"",c?Object(u.jsx)("button",{className:"btn secondary ".concat(e===w.TOGGLE_TYPE?"contained":"outlined"),onClick:c,children:"TYPES"}):""]})}var T=n(24),D=(n(44),.25),N={width:2,stroke:"rgb(220, 80, 80)",fill:"rgba(220, 80, 80, ".concat(D,")"),arrow:"rgba(220, 80, 80, ".concat(.5,")"),selected:{width:2,stroke:"rgb(255, 130, 130)",fill:"rgba(255, 130, 130, ".concat(D,")"),arrow:"rgba(255, 130, 130, ".concat(.5,")")}},I={width:2,stroke:"rgb(50, 100, 250)",fill:"rgba(50, 100, 250, ".concat(D,")"),arrow:"rgba(50, 100, 250, ".concat(.5,")"),selected:{width:2,stroke:"rgb(50, 200, 250)",fill:"rgba(50, 200, 250, ".concat(D,")"),arrow:"rgba(50, 200, 250, ".concat(.5,")")}},W={width:2,stroke:"rgb(200, 170, 0)",fill:"rgba(240, 190, 0, ".concat(D,")"),arrow:"rgba(200, 170, 0, ".concat(.5,")"),selected:{width:2,stroke:"rgb(255, 215, 50)",fill:"rgba(255, 250, 50, ".concat(D,")"),arrow:"rgba(255, 215, 50, ".concat(.5,")")}},L={width:2,stroke:"rgb(50, 200, 50)",fill:"rgba(50, 200, 50, ".concat(D,")"),arrow:"rgba(50, 200, 50, ".concat(.5,")"),selected:{width:2,stroke:"rgb(100, 240, 100)",fill:"rgba(100, 255, 100, ".concat(D,")"),arrow:"rgba(100, 240, 100, ".concat(.5,")")}},P={width:2,stroke:"rgb(150, 150, 150)",fill:"rgba(150, 150, 150, ".concat(D,")"),arrow:"rgba(150, 150, 150, ".concat(.5,")"),selected:{width:2,stroke:"rgb(230, 230, 230)",fill:"rgba(230, 230, 230, ".concat(D,")"),arrow:"rgba(230, 230, 230, ".concat(.5,")")}};function A(t){var e=t.img,n=t.quads,i=t.newQuad,c=t.tool,a=t.setSelected,s=t.updateQuads,d=t.deleteQuads,f=t.slider,b=t.width,h=(t.height,t.options),p=void 0===h?{ids:!0,arrows:!0}:h,E=Object(r.useState)([]),D=Object(l.a)(E,2),A=D[0],R=D[1],B=Object(r.useState)(!1),M=Object(l.a)(B,2),Y=M[0],_=M[1],G=Object(r.useState)(!1),U=Object(l.a)(G,2),X=U[0],F=U[1],Q=Object(r.useState)(null),V=Object(l.a)(Q,2),q=V[0],J=V[1],K=Object(r.useState)(null),H=Object(l.a)(K,2),z=H[0],Z=H[1],$=Object(r.useRef)(null),tt=Object(r.useState)({x:0,y:0}),et=Object(l.a)(tt,2),nt=et[0],rt=et[1];Object(r.useEffect)((function(){var t=$.current,r=null===t||void 0===t?void 0:t.getContext("2d");if(t&&r){try{if(!e)throw Error;r.drawImage(e,0,0,t.width,t.height)}catch(s){r.fillStyle="#fff",r.fillRect(0,0,t.width,t.height)}for(var i=n.length-1;i>=0;i--){var a=n[i];lt(r,a)}if(nt.x&&nt.y&&A&&c===w.ADD){var l=!1,u=[it([nt.x,nt.y],n.map((function(t){return t.shape})))].concat(Object(o.a)(A));3===A.length&&(l=!0),r.lineWidth=N.width,r.strokeStyle=N.stroke,r.fillStyle=N.fill,ct(r,u,!0,l)}}}),[e,n,c,nt,X,A,f,b,p]);var it=function(t,e){if(X)return t;e.push([[0,0],[1920,0],[1920,1080],[0,1080]]);var n=e.flat().reduce((function(e,n){var r=Object(l.a)(e,2),i=r[0],c=r[1],a=v(t,n);return a<i||-1===i?[a,n]:[i,c]}),[-1,null]),r=Object(l.a)(n,2),i=r[0],c=r[1];if(c&&i<25)t=c;else{var a=e.reduce((function(e,n){var r=Object(l.a)(e,2),i=r[0],c=r[1],a=n.reduce((function(e,n,r,i){var c,a=Object(l.a)(e,2),o=a[0],u=a[1],s=i[(r+1)%i.length],d=O(t,[n,s]);return d&&((c=v(t,d))<o||-1===o)?[c,d]:[o,u]}),[-1,null]),o=Object(l.a)(a,2),u=o[0],s=o[1];return s&&u<i||-1===i?[u,s]:[i,c]}),[-1,null]),o=Object(l.a)(a,2);i=o[0],(c=o[1])&&i<25&&(t=c)}return t},ct=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];e[0]&&t.moveTo(e[0][0],e[0][1]),t.beginPath();var i,c=Object(T.a)(e);try{for(c.s();!(i=c.n()).done;){var a=i.value;t.lineTo(a[0],a[1])}}catch(o){c.e(o)}finally{c.f()}r&&(t.closePath(),t.fill()),t.stroke(),n&&e.forEach((function(e,n){return at(t,e,n)}))},at=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2,r=t.fillStyle,i=t.strokeStyle,c=["#fff","#f55","#5f5","#55f"];t.fillStyle=c[n],t.strokeStyle="#000",t.beginPath(),t.arc(e[0],e[1],5,0,6.3),t.closePath(),t.fill(),t.stroke(),t.fillStyle=r,t.strokeStyle=i},ot=function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"#000",i=arguments.length>4&&void 0!==arguments[4]&&arguments[4],c=[[-.7,-1],[0,1],[.7,-1]];c=c.map((function(t){return y(t,i?16:10)}));var a=S([e[0],e[1]]),o=S([e[2],e[3]]),u=S([e[1],e[2]]),s=S([e[3],e[0]]),d=k(a,o),f=k(u,s),b=Object.entries(n).map((function(t){var e,n,r=Object(l.a)(t,2),i=r[0];if(!r[1])return null;switch(i){case"up":e=d,n=a;break;case"down":e=x(d),n=o;break;case"right":e=f,n=u;break;case"left":e=x(f),n=s;break;default:return null}var b=c.map((function(t){return m(t,e)})),h=k(n,b[1]);return b.map((function(t){return g(t,h)}))})),h=t.strokeStyle,j=t.fillStyle,v=t.lineWidth;t.strokeStyle=i?"#000":r,t.fillStyle=r,t.lineWidth=2;var O,p=Object(T.a)(b);try{for(p.s();!(O=p.n()).done;){var w=O.value;w&&ct(t,w,!1,!0)}}catch(C){p.e(C)}finally{p.f()}t.strokeStyle=h,t.fillStyle=j,t.lineWidth=v},lt=function(t,e){var r=[0,0];Y&&q&&(r=[nt.x-q[0],nt.y-q[1]]);var i,a=e.isSelected?e.shape.map((function(t,i){return z&&z.some((function(t){return t===i}))?it(g(t,r),n.filter((function(t){return t.id!==e.id})).map((function(t){return t.shape}))):t})):e.shape,o=S(a);i=e.isCarWalkable?e.isParking?W:N:e.isParking?L:e.direction.up||e.direction.left||e.direction.right||e.direction.down?P:I,e.isSelected&&(i=i.selected);var l={lw:t.lineWidth,ss:t.strokeStyle,fs:t.fillStyle};t.lineWidth=i.width,t.strokeStyle=i.stroke,t.fillStyle=i.fill,ct(t,a,e.isSelected,!0),p.ids&&ut(t,e.id.toString(),o,48,i.stroke),c===w.SET_DIRECTIONS?ot(t,a,e.direction,"#3e3",!0):p.arrows&&ot(t,a,e.direction,i.stroke),t.lineWidth=l.lw,t.strokeStyle=l.ss,t.fillStyle=l.fs},ut=function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:12,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"#000",c={font:t.font,ta:t.textAlign,tb:t.textBaseline,fs:t.fillStyle,ss:t.strokeStyle};t.font="".concat(r,"px sans-serif"),t.textAlign="center",t.textBaseline="middle",t.fillStyle=i,t.strokeStyle="#000",t.fillText(e,n[0],n[1]),t.strokeText(e,n[0],n[1]),t.font=c.font,t.textAlign=c.ta,t.textBaseline=c.tb,t.fillStyle=c.fs},st=function(){var t=n.find((function(t){return t.isSelected})),e=null;if(t){var r,i=t.shape;e=[-1];var c=i.reduce((function(t,e,n){var r=Object(l.a)(t,2),i=r[0],c=r[1],a=v([nt.x,nt.y],e);return a<i?[a,n]:[i,c]}),[999,-1]),o=Object(l.a)(c,2);if(r=o[0],e[0]=o[1],r>25){var u=i.reduce((function(t,e,n,r){var i=Object(l.a)(t,2),c=i[0],a=i[1],o=(n+1)%r.length,u=r[o],s=O([nt.x,nt.y],[e,u]);if(!s)return[c,a];var d=v([nt.x,nt.y],s);return d<c?[d,[n,o]]:[c,a]}),[999,[-1]]),s=Object(l.a)(u,2);r=s[0],e=s[1]}r>25&&(e=j([nt.x,nt.y],t.shape)?[0,1,2,3]:null)}if(e)Z(e),_(!0),J([nt.x,nt.y]);else{var d=function(t,e){for(var n=0;n<e.length;n++)if(j(t,e[n]))return n;return-1}([nt.x,nt.y],n.map((function(t){return t.shape})));a(d)}},dt=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=[nt.x,nt.y],r=n.find((function(t){return j(e,t.shape)}));if(r){if(t)for(var i=!Object.values(r.direction).every((function(t){return t})),c=0,a=Object.keys(r.direction);c<a.length;c++){var o=a[c];r.direction[o]=i}else{var u=r.shape,d=S(u),f={up:[u[0],u[1],d],down:[u[2],u[3],d],right:[u[1],u[2],d],left:[u[3],u[0],d]},b=function(){for(var t=0,n=Object.entries(f);t<n.length;t++){var r=Object(l.a)(n[t],2),i=r[0],c=r[1];if(j(e,c))return i}return null}();if(!b)return;r.direction[b]=!r.direction[b]}s([r])}},ft=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=[nt.x,nt.y],r=n.find((function(t){return j(e,t.shape)}));if(r){switch(t){case 0:r.isCarWalkable?r.isCarWalkable=!1:r.isCarWalkable=!0;break;case 1:r.isParking?r.isParking=!1:r.isParking=!0}s([r])}},bt=function(){if(Y&&q){var t=n.filter((function(t){return t.isSelected})),e=[nt.x-q[0],nt.y-q[1]],r=t.map((function(t){return t.shape=t.shape.map((function(r,i){return z&&z.some((function(t){return t===i}))?it(g(r,e),n.filter((function(e){return e.id!==t.id})).map((function(t){return t.shape}))):r})),t}));r.forEach((function(t){return t.order()})),s(r),_(!1),Z(null),J(null)}};return Object(u.jsx)("div",{className:"Canvas",children:Object(u.jsx)("canvas",{ref:$,onMouseDown:function(t){switch(t.button){case 0:switch(c){case w.ADD:!function(){if(nt.x&&nt.y){var t=[nt.x,nt.y],e=[t=it(t,n.map((function(t){return t.shape})))].concat(Object(o.a)(A));if(4===e.length){var r=new C(e);r.order(),r.isSelected=!0,a(-1),i(r),R([])}else R(e)}}();break;case w.SELECT:st();break;case w.SET_DIRECTIONS:dt();break;case w.TOGGLE_TYPE:ft(0);break;default:throw Error("Tool not implemented")}break;case 2:switch(c){case w.TOGGLE_TYPE:ft(1);break;case w.SET_DIRECTIONS:dt(!0)}}},onMouseUp:function(){bt()},onMouseLeave:function(){Y&&4===(null===z||void 0===z?void 0:z.length)?(_(!1),Z(null),J(null),d(n.filter((function(t){return t.isSelected})))):bt()},onMouseMove:function(t){var e=$.current;if(e){var n=e.clientWidth/e.width,r=[e.offsetLeft,e.offsetTop];rt({x:(t.pageX-r[0])/n,y:(t.pageY-r[1])/n})}},onContextMenu:function(t){return t.preventDefault()},width:1920,height:1080,onKeyDown:function(t){"Control"===t.key&&F(!0)},onKeyUp:function(t){"Control"===t.key&&F(!1)},tabIndex:0,onMouseEnter:function(){var t;return null===(t=$.current)||void 0===t?void 0:t.focus()},onBlur:function(){return R([])}})})}var R=n(69),B=n(72),M=n(73);n(45);function Y(t){var e=t.target,n=t.update,i=t.selectById,c=t.deleteById,a=Object(r.useState)(),s=Object(l.a)(a,2),d=s[0],f=s[1],b=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(t.changed=e,d){var n=null===d||void 0===d?void 0:d.filter((function(e){return e.id!==t.id}));f([t].concat(Object(o.a)(n)).sort((function(t,e){return t.id<e.id?-1:1})))}};function h(t){var r,a,o=Object.entries(t.points).flatMap((function(e){var n,r,i=Object(l.a)(e,2),c=i[0],a=i[1];return n=c,r=t,a.map((function(t,e){return Object(u.jsx)("td",{children:Object(u.jsx)("input",{type:"number",value:Math.round(t),onChange:function(t){r.points[n][e]=+t.target.value,b(r)}})},"".concat(n).concat(e))}))})),s=Object.entries(t.dir).map((function(e){var n=Object(l.a)(e,2),r=n[0],i=n[1];return Object(u.jsx)("td",{children:Object(u.jsx)("input",{type:"checkbox",checked:i,onChange:function(){t.dir[r]=!t.dir[r],b(t)}})},r)}));return Object(u.jsxs)("tr",{onClick:function(){return i(t.id)},className:(null===(r=t.ref)||void 0===r?void 0:r.isSelected)?"selected":"",children:[Object(u.jsx)("td",{className:"delete",children:Object(u.jsx)("button",{className:"btn contained secondary",onClick:function(e){e.stopPropagation(),c(t.id)},children:Object(u.jsx)(R.a,{})})},"delete"),Object(u.jsx)("td",{children:Object(u.jsxs)("div",{className:"id",children:[" ",t.id," "]})},"id"),o,Object(u.jsx)("td",{children:Object(u.jsx)("input",{type:"checkbox",checked:t.carWalk,onChange:function(){t.carWalk=!t.carWalk,b(t)}})},"iscarwalkable"),s,Object(u.jsx)("td",{children:Object(u.jsx)("input",{type:"checkbox",checked:t.parking,onChange:function(){t.parking=!t.parking,b(t)}})},"isparking"),Object(u.jsx)("td",{children:Object(u.jsx)("input",{type:"text",value:null!==(a=t.stop)&&void 0!==a?a:"None",onChange:function(e){t.stop=e.target.value,b(t)}})},"isstop"),Object(u.jsx)("td",{className:t.changed?"space":"hide"}),Object(u.jsx)("td",{className:t.changed?"":"hide",children:Object(u.jsx)("button",{className:"btn contained primary",onClick:function(){b(t,!1),n([e.find((function(e){return e.id===t.id})).fromAreaDictionary(t)])},children:Object(u.jsx)(B.a,{})})},"update"),Object(u.jsx)("td",{className:t.changed?"":"hide",children:Object(u.jsx)("button",{className:"btn contained secondary ".concat(t.changed?"":"hide"),onClick:function(){t=e.find((function(e){return e.id===t.id})).toAreaDictionary(),b(t,!1)},children:Object(u.jsx)(M.a,{})})},"discard")]},t.id)}return Object(r.useEffect)((function(){var t=e.map((function(t){return t.toAreaDictionary()})),n=null===d||void 0===d?void 0:d.filter((function(t){return t.changed}));t=(t=t.map((function(t){var e=null===n||void 0===n?void 0:n.find((function(e){return e.id===t.id}));return e||t}))).sort((function(t,e){return t.id<e.id?-1:1})),f(t)}),[e]),Object(u.jsx)("div",{className:"Inspector",children:Object(u.jsxs)("table",{children:[Object(u.jsx)("thead",{children:Object(u.jsxs)("tr",{children:[Object(u.jsx)("th",{}),Object(u.jsx)("th",{children:"ID "}),Object(u.jsx)("th",{children:"luX "}),Object(u.jsx)("th",{children:"luY "}),Object(u.jsx)("th",{children:"ruX "}),Object(u.jsx)("th",{children:"ruY "}),Object(u.jsx)("th",{children:"rbX "}),Object(u.jsx)("th",{children:"rbY "}),Object(u.jsx)("th",{children:"lbX "}),Object(u.jsx)("th",{children:"lbY "}),Object(u.jsx)("th",{children:"CarWalk "}),Object(u.jsx)("th",{children:"Left "}),Object(u.jsx)("th",{children:"Up "}),Object(u.jsx)("th",{children:"Right "}),Object(u.jsx)("th",{children:"Down "}),Object(u.jsx)("th",{children:"Parking "}),Object(u.jsx)("th",{children:"Stop "})]})}),Object(u.jsx)("tbody",{children:null===d||void 0===d?void 0:d.map((function(t){return h(t)}))})]})})}var _=n(25),G=n.n(_),U=n(31),X=(n(51),["luX","luY","ruX","ruY","rbX","rbY","lbX","lbY","CarWalk","Left","Up","Right","Down","Parking","Stop"]);function F(t){var e=t.target,n=t.source,i=t.load,c=Object(r.useRef)(null),a=Object(r.useRef)(null),o=n?n.replace(".mp4","_areas.csv"):"areas.csv",l=function(t){var e=t.map(s);return[X.join(",")].concat(e).join("\n")},s=function(t){var e=t.toAreaDictionary(),n=[e.points.lu,e.points.ru,e.points.rb,e.points.lb].map((function(t){return t.join(",")})).join(","),r=e.carWalk?1:0,i=e.parking?1:0,c=e.stop;return[n,r,[e.dir.left,e.dir.up,e.dir.right,e.dir.down].map((function(t){return t?1:0})).join(","),i,c].join(",")},d=function(){var t=Object(U.a)(G.a.mark((function t(e){var n,r,c,a,o;return G.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e){t.next=3;break}return console.error("Unable to load file!"),t.abrupt("return");case 3:return t.next=5,e.text();case 5:n=t.sent,r=n.split("\n").filter((function(t){return""!==t})),c=r.slice(1).map((function(t){return t.split(",")})),a=c.map((function(t){var e={points:{},dir:{}},n=t.map((function(t){return+t}));return e.points.lu=n.slice(0,2),e.points.ru=n.slice(2,4),e.points.rb=n.slice(4,6),e.points.lb=n.slice(6,8),e.carWalk=n[8]>0,e.dir.left=n[9]>0,e.dir.up=n[10]>0,e.dir.right=n[11]>0,e.dir.down=n[12]>0,e.parking=n[13]>0,e.stop=t[14],e})),o=a.map((function(t){return(new C).fromAreaDictionary(t)})),i(o);case 11:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return Object(u.jsxs)("div",{className:"IOManager",children:[Object(u.jsx)("button",{className:"btn contained primary",onClick:function(){var t;return null===(t=a.current)||void 0===t?void 0:t.click()},children:"Load CSV"}),Object(u.jsx)("input",{hidden:!0,type:"file",ref:a,accept:".csv",onChange:function(){var t,e,n;return d(null!==(t=null===(e=a.current)||void 0===e||null===(n=e.files)||void 0===n?void 0:n.item(0))&&void 0!==t?t:null)}}),Object(u.jsx)("button",{className:"btn contained primary",onClick:function(){var t,n,r=l(e),i=new Blob([r],{type:"text/csv;charset=utf-8;"}),a=URL.createObjectURL(i);null===(t=c.current)||void 0===t||t.setAttribute("href",a),null===(n=c.current)||void 0===n||n.click(),URL.revokeObjectURL(a)},children:"Download"}),Object(u.jsx)("a",{ref:c,href:".",download:o,hidden:!0,children:"hidden download link"})]})}n(52);var Q=n(74);function V(t){var e=t.options,n=t.updateOptions;return Object(u.jsxs)("div",{className:"OptionSelector",children:[Object(u.jsx)("button",{className:"btn ".concat(e.ids?"contained":"outlined"),onClick:function(){return n(Object(f.a)(Object(f.a)({},e),{},{ids:!e.ids}))},children:"IDs"}),Object(u.jsx)("button",{className:"btn ".concat(e.arrows?"contained":"outlined"),onClick:function(){return n(Object(f.a)(Object(f.a)({},e),{},{arrows:!e.arrows}))},children:Object(u.jsx)(Q.a,{})})]})}function q(){var t=Object(r.useState)(null),e=Object(l.a)(t,2),n=e[0],i=e[1],c=Object(r.useState)(""),a=Object(l.a)(c,2),f=a[0],b=a[1],h=Object(r.useState)(null),j=Object(l.a)(h,2),v=j[0],O=j[1],p=Object(r.useState)(),g=Object(l.a)(p,2),x=g[0],k=g[1],y=Object(r.useState)([]),m=Object(l.a)(y,2),S=m[0],C=m[1],T=Object(r.useState)(w.ADD),D=Object(l.a)(T,2),N=D[0],I=D[1],W=Object(r.useState)({ids:!0,arrows:!0}),L=Object(l.a)(W,2),P=L[0],R=L[1];Object(r.useEffect)((function(){if(n){var t=URL.createObjectURL(n);b(t)}}),[n]);var B=function(t){var e=S.filter((function(e){return t.every((function(t){return t.id!==e.id}))}));C(e)},M=function(t){S.map((function(t){return t.isSelected=!1})),t>=0&&t<S.length&&(S[t].isSelected=!0),C(Object(o.a)(S))},_=function(t){var e=S.filter((function(e){return t.every((function(t){return t.id!==e.id}))}));C([].concat(Object(o.a)(t),Object(o.a)(e)))};return Object(u.jsxs)("div",{className:"App",children:[Object(u.jsxs)("div",{children:[Object(u.jsx)("div",{className:"BlockButtons",children:Object(u.jsx)(V,{options:P,updateOptions:R})}),Object(u.jsxs)("div",{className:"BlockCanvas",children:[Object(u.jsx)(A,{img:v,quads:S,newQuad:function(t){return C([t].concat(Object(o.a)(S)))},tool:N,setSelected:M,updateQuads:_,deleteQuads:B,slider:x,width:(null===v||void 0===v?void 0:v.videoWidth)||void 0,height:(null===v||void 0===v?void 0:v.videoHeight)||void 0,options:P}),Object(u.jsx)(s,{source:f,setVideo:function(t){O(t),C([])},setSlider:k,value:null!==x&&void 0!==x?x:0})]}),Object(u.jsxs)("div",{className:"BlockButtons",children:[Object(u.jsx)(E,{value:N,onAdd:function(){I(w.ADD),M(-1)},onSelect:function(){I(w.SELECT),M(-1)},onSetDirections:function(){I(w.SET_DIRECTIONS),M(-1)},onToggleType:function(){I(w.TOGGLE_TYPE),M(-1)}}),Object(u.jsx)(d,{setFile:i,accept_types:"video/*"}),Object(u.jsx)(F,{target:S,source:null===n||void 0===n?void 0:n.name,load:function(t){return C(t)}})]})]}),Object(u.jsx)("div",{children:Object(u.jsx)(Y,{target:S,update:_,selectById:function(t){M(S.findIndex((function(e){return e.id===t})))},deleteById:function(t){return B(S.filter((function(e){return e.id===t})))}})})]})}var J=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,77)).then((function(e){var n=e.getCLS,r=e.getFID,i=e.getFCP,c=e.getLCP,a=e.getTTFB;n(t),r(t),i(t),c(t),a(t)}))},K=n(32),H=n(75),z=n(76),Z=n(20),$=n(19),tt=Object(K.a)({palette:{type:"dark",primary:{main:Z.a[400]},secondary:{main:$.a[400]}},typography:{button:{fontWeight:"bold"}},overrides:{MuiButton:{outlined:{border:"2px solid !important"}}}});a.a.render(Object(u.jsx)(i.a.StrictMode,{children:Object(u.jsxs)(H.a,{theme:tt,children:[Object(u.jsx)(z.a,{}),Object(u.jsx)(q,{})]})}),document.getElementById("root")),J()}},[[53,1,2]]]);
//# sourceMappingURL=main.87e65788.chunk.js.map